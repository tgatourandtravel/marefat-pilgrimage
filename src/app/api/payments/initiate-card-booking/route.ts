import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { stripe, isStripeConfigured } from '@/lib/stripe/client';
import { generateBookingRef } from '@/lib/utils/booking-ref';
import { getTourBySlug } from '@/data/tours';
import { validateBookerFields, validateTravelerFields } from '@/lib/utils/validation';
import { parseFlightBookingPreferences } from '@/lib/booking/flight-request';

export const dynamic = 'force-dynamic';

const rateLimitWindowMs = 60_000;
const maxRequestsPerWindow = 10;
const requestLog = new Map<string, number[]>();

interface BookerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isTraveling: boolean;
}

interface TravelerInput {
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  passportExpiry: string;
  dateOfBirth: string;
}

interface InitiateCardBookingRequest {
  tourSlug: string;
  booker: BookerInput;
  travelers: TravelerInput[];
  hasInsurance: boolean;
  hasFlightBooking: boolean;
  preferredDepartureCity?: string | null;
  preferredReturnCity?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter((ts) => now - ts < rateLimitWindowMs);
    if (recent.length >= maxRequestsPerWindow) {
      return NextResponse.json(
        { error: 'Too many payment attempts. Please try again in one minute.' },
        { status: 429 }
      );
    }
    recent.push(now);
    requestLog.set(ip, recent);
    for (const [entryIp, timestamps] of requestLog.entries()) {
      const valid = timestamps.filter((ts) => now - ts < rateLimitWindowMs);
      if (valid.length === 0) requestLog.delete(entryIp);
      else requestLog.set(entryIp, valid);
    }

    if (!isStripeConfigured || !stripe) {
      return NextResponse.json({ error: 'Online payment is not configured.' }, { status: 503 });
    }

    const body: InitiateCardBookingRequest = await request.json();

    // ── Validation ─────────────────────────────────────────────────────────
    if (!body.tourSlug || !body.booker || !body.travelers?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (body.travelers.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 travelers are allowed.' }, { status: 400 });
    }

    const tour = getTourBySlug(body.tourSlug);
    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const bookerErrors = validateBookerFields(body.booker);
    if (Object.keys(bookerErrors).length > 0) {
      return NextResponse.json({ error: 'Invalid booker information', details: bookerErrors }, { status: 400 });
    }

    const travelerErrors = body.travelers
      .map((traveler, index) => {
        const skipNameValidation = index === 0 && body.booker.isTraveling;
        const candidate = skipNameValidation
          ? { ...traveler, firstName: body.booker.firstName, lastName: body.booker.lastName }
          : traveler;
        const errors = validateTravelerFields(candidate, tour.startDate, skipNameValidation);
        return Object.keys(errors).length > 0 ? { travelerIndex: index, errors } : null;
      })
      .filter(Boolean);

    if (travelerErrors.length > 0) {
      return NextResponse.json({ error: 'Invalid traveler information', details: travelerErrors }, { status: 400 });
    }

    const flightPrefs = parseFlightBookingPreferences({
      tour,
      hasFlightBooking: body.hasFlightBooking,
      preferredDepartureCity: body.preferredDepartureCity,
      preferredReturnCity: body.preferredReturnCity,
    });
    if (!flightPrefs.ok) {
      return NextResponse.json({ error: flightPrefs.message }, { status: 400 });
    }

    // ── Pricing (server-authoritative) ─────────────────────────────────────
    const numberOfTravelers = body.travelers.length;
    const basePricePerPerson = tour.priceFrom;
    const baseTotal = basePricePerPerson * numberOfTravelers;
    /** Flight assistance is quoted separately; never included in package totals here. */
    const flightTotal = 0;
    const grandTotal = baseTotal;
    const depositAmount = Math.floor(grandTotal * 0.3);

    // ── Unique booking reference ────────────────────────────────────────────
    let bookingRef = generateBookingRef();
    for (let attempts = 0; attempts < 10; attempts++) {
      const { data: existing } = await supabaseAdmin
        .from('bookings')
        .select('id')
        .eq('booking_ref', bookingRef)
        .single();
      if (!existing) break;
      bookingRef = generateBookingRef();
    }

    // ── Create booking (pre-verified — payment IS the verification) ─────────
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        booking_ref: bookingRef,
        tour_slug: tour.slug,
        tour_title: tour.title,
        tour_destination: tour.destination,
        tour_start_date: tour.startDate || null,
        tour_duration_days: tour.durationDays || null,
        contact_first_name: body.booker.firstName.trim(),
        contact_last_name: body.booker.lastName.trim(),
        contact_email: body.booker.email.toLowerCase(),
        contact_phone: body.booker.phone,
        base_price_per_person: basePricePerPerson,
        number_of_travelers: numberOfTravelers,
        insurance_total: 0,
        flight_total: flightTotal,
        grand_total: grandTotal,
        deposit_amount: depositAmount,
        has_insurance: false,
        has_flight_booking: body.hasFlightBooking,
        preferred_departure_city: flightPrefs.departureCity,
        preferred_return_city: flightPrefs.returnCity,
        stripe_payment_intent_id: null,
        payment_method: 'card',
        payment_status: 'unpaid',
        payment_paid_at: null,
        // Booking is pre-verified: the card payment itself is the identity check
        status: 'awaiting_card_payment',
        is_verified: true,
        verified_at: new Date().toISOString(),
        expires_at: null,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error('Booking creation error:', bookingError);
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    // ── Insert travelers ────────────────────────────────────────────────────
    const travelersToInsert = body.travelers.map((traveler, index) => ({
      booking_id: booking.id,
      first_name: index === 0 && body.booker.isTraveling ? body.booker.firstName : traveler.firstName,
      last_name: index === 0 && body.booker.isTraveling ? body.booker.lastName : traveler.lastName,
      email: index === 0 && body.booker.isTraveling ? body.booker.email.toLowerCase() : '',
      phone: index === 0 && body.booker.isTraveling ? body.booker.phone : '',
      date_of_birth: traveler.dateOfBirth,
      nationality: traveler.nationality,
      passport_number: traveler.passportNumber,
      passport_expiry: traveler.passportExpiry,
      traveler_order: index + 1,
      is_primary_contact: index === 0 && body.booker.isTraveling,
    }));

    const { error: travelersError } = await supabaseAdmin.from('travelers').insert(travelersToInsert);

    if (travelersError) {
      console.error('Travelers insertion error:', travelersError);
      await supabaseAdmin.from('bookings').delete().eq('id', booking.id);
      return NextResponse.json({ error: 'Failed to save traveler information' }, { status: 500 });
    }

    // ── Create Stripe PaymentIntent ─────────────────────────────────────────
    const amountInCents = Math.max(1, Math.round(depositAmount * 100));
    const idempotencyKey = `card-init-${bookingRef}-${amountInCents}`;

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        receipt_email: body.booker.email.toLowerCase(),
        metadata: {
          booking_ref: bookingRef,
          tour_slug: tour.slug,
          contact_email: body.booker.email.toLowerCase(),
          flow: 'payment_first',
          ...(flightPrefs.departureCity ? { flight_departure: flightPrefs.departureCity } : {}),
          ...(flightPrefs.returnCity ? { flight_return: flightPrefs.returnCity } : {}),
        },
      },
      { idempotencyKey }
    );

    // ── Attach PaymentIntent ID to booking ──────────────────────────────────
    await supabaseAdmin
      .from('bookings')
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: 'requires_action',
      })
      .eq('id', booking.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingRef,
      depositAmount,
      grandTotal,
    });
  } catch (error) {
    console.error('initiate-card-booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
