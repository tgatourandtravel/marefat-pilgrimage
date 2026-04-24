import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateBookingRef } from '@/lib/utils/booking-ref';
import { generateOTP, getOTPExpiry } from '@/lib/utils/otp';
import { sendOTPEmail } from '@/lib/email/resend';
import type { Booking } from '@/lib/supabase/types';

// Force dynamic rendering to prevent static optimization at build time
export const dynamic = 'force-dynamic';

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
  tourTitle: string;
  tourDestination: string;
  tourStartDate?: string;
  tourDurationDays?: number;
  booker: BookerInput;
  travelers: TravelerInput[];
  hasInsurance: boolean;
  hasFlightBooking: boolean;
  flightIncludedInTour: boolean;
  basePricePerPerson: number;
  insuranceCostPerPerson: number;
  flightCostPerPerson: number;
  paymentMethod?: 'wire' | 'zelle' | 'card';
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBookingRequest = await request.json();

    // Validate required fields
    if (!body.tourSlug || !body.booker || !body.travelers || body.travelers.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate booker has email
    if (!body.booker.email) {
      return NextResponse.json(
        { error: 'Booker email is required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const numberOfTravelers = body.travelers.length;
    const baseTotal = body.basePricePerPerson * numberOfTravelers;
    const insuranceTotal = body.hasInsurance
      ? body.insuranceCostPerPerson * numberOfTravelers
      : 0;
    const flightTotal = body.hasFlightBooking && !body.flightIncludedInTour
      ? body.flightCostPerPerson * numberOfTravelers
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
        tour_slug: body.tourSlug,
        tour_title: body.tourTitle,
        tour_destination: body.tourDestination,
        tour_start_date: body.tourStartDate || null,
        tour_duration_days: body.tourDurationDays || null,
        contact_email: body.booker.email.toLowerCase(),
        contact_phone: body.booker.phone,
        base_price_per_person: body.basePricePerPerson,
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
      first_name: traveler.firstName,
      last_name: traveler.lastName,
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
