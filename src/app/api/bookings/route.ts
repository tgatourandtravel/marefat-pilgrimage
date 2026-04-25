import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateBookingRef } from '@/lib/utils/booking-ref';
import { generateOTP, getOTPExpiry } from '@/lib/utils/otp';
import { sendOTPEmail } from '@/lib/email/resend';
import { getTourBySlug } from '@/data/tours';
import {
  validateBookerFields,
  validateTravelerFields,
} from '@/lib/utils/validation';

// Force dynamic rendering to prevent static optimization at build time
export const dynamic = 'force-dynamic';
const rateLimitWindowMs = 60_000;
const maxRequestsPerWindow = 10;
const requestLog = new Map<string, number[]>();

// Booker: Person making the reservation (has contact info)
interface BookerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isTraveling: boolean;
}

// Traveler: Person traveling (passport info only)
interface TravelerInput {
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  passportExpiry: string;
  dateOfBirth: string;
}

interface CreateBookingRequest {
  tourSlug: string;
  booker: BookerInput;
  travelers: TravelerInput[];
  hasInsurance: boolean;
  hasFlightBooking: boolean;
  paymentMethod?: 'wire' | 'zelle' | 'card';
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter((ts) => now - ts < rateLimitWindowMs);
    if (recent.length >= maxRequestsPerWindow) {
      return NextResponse.json(
        { error: 'Too many booking attempts. Please try again in one minute.' },
        { status: 429 }
      );
    }
    recent.push(now);
    requestLog.set(ip, recent);
    for (const [entryIp, timestamps] of requestLog.entries()) {
      const validTimestamps = timestamps.filter((ts) => now - ts < rateLimitWindowMs);
      if (validTimestamps.length === 0) {
        requestLog.delete(entryIp);
      } else {
        requestLog.set(entryIp, validTimestamps);
      }
    }

    const body: CreateBookingRequest = await request.json();

    // Validate required fields
    if (!body.tourSlug || !body.booker || !body.travelers || body.travelers.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (body.travelers.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 travelers are allowed per booking.' },
        { status: 400 }
      );
    }

    const tour = getTourBySlug(body.tourSlug);
    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    const bookerErrors = validateBookerFields(body.booker);
    if (Object.keys(bookerErrors).length > 0) {
      return NextResponse.json(
        { error: 'Invalid booker information', details: bookerErrors },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'Invalid traveler information', details: travelerErrors },
        { status: 400 }
      );
    }

    // Calculate totals using authoritative server-side pricing.
    const numberOfTravelers = body.travelers.length;
    const basePricePerPerson = tour.priceFrom;
    const insuranceCostPerPerson = 99;
    const flightCostPerPerson = 450;
    const baseTotal = basePricePerPerson * numberOfTravelers;
    const insuranceTotal = body.hasInsurance
      ? insuranceCostPerPerson * numberOfTravelers
      : 0;
    const flightTotal = body.hasFlightBooking && !tour.flightIncluded
      ? flightCostPerPerson * numberOfTravelers
      : 0;
    const grandTotal = baseTotal + insuranceTotal + flightTotal;
    const depositAmount = Math.floor(grandTotal * 0.3);
    const selectedPaymentMethod =
      body.paymentMethod === 'card'
        ? 'card'
        : body.paymentMethod === 'zelle'
        ? 'zelle'
        : 'wire';

    // Generate unique booking reference
    let bookingRef = generateBookingRef();
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabaseAdmin
        .from('bookings')
        .select('id')
        .eq('booking_ref', bookingRef)
        .single();

      if (!existing) break;
      bookingRef = generateBookingRef();
      attempts++;
    }

    // Create booking with booker as contact
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
        insurance_total: insuranceTotal,
        flight_total: flightTotal,
        grand_total: grandTotal,
        deposit_amount: depositAmount,
        has_insurance: body.hasInsurance,
        has_flight_booking: body.hasFlightBooking,
        stripe_payment_intent_id: null,
        payment_method: selectedPaymentMethod,
        payment_status: 'unpaid',
        payment_paid_at: null,
        status: 'pending_verification',
        is_verified: false,
        verified_at: null,
        expires_at: null,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      return NextResponse.json(
        {
          error: 'Failed to create booking',
          details: process.env.NODE_ENV === 'development' ? bookingError.message : undefined
        },
        { status: 500 }
      );
    }

    // Insert travelers
    // Note: email/phone are stored at booking level (booker), not per traveler
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

    const { error: travelersError } = await supabaseAdmin
      .from('travelers')
      .insert(travelersToInsert);

    if (travelersError) {
      console.error('Travelers insertion error:', travelersError);
      // Rollback booking
      await supabaseAdmin.from('bookings').delete().eq('id', booking.id);
      return NextResponse.json(
        {
          error: 'Failed to save traveler information',
          details: process.env.NODE_ENV === 'development' ? travelersError.message : undefined
        },
        { status: 500 }
      );
    }

    // Generate and store OTP
    const otpCode = generateOTP();
    const otpExpiry = getOTPExpiry();

    const { error: otpError } = await supabaseAdmin
      .from('verification_codes')
      .insert({
        booking_id: booking.id,
        code: otpCode,
        code_type: 'email',
        expires_at: otpExpiry.toISOString(),
        is_used: false,
        used_at: null,
        attempts: 0,
        max_attempts: 5,
      });

    if (otpError) {
      console.error('OTP creation error:', otpError);
    }

    // Send OTP email to booker
    try {
      await sendOTPEmail({
        to: body.booker.email,
        firstName: body.booker.firstName,
        bookingRef: bookingRef,
        otpCode: otpCode,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request, user can resend
    }

    return NextResponse.json({
      success: true,
      bookingRef: bookingRef,
      email: body.booker.email,
      message: 'Booking created. Please check your email for verification code.',
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
