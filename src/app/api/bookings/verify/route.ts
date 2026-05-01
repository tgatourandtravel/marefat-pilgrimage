import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getBookingExpiry } from '@/lib/utils/booking-ref';
import { isOTPExpired } from '@/lib/utils/otp';
import { sendBookingConfirmationEmail, sendNewBookingAdminEmail } from '@/lib/email/resend';
import type { Booking, VerificationCode } from '@/lib/supabase/types';

// Force dynamic rendering to prevent static optimization at build time
export const dynamic = 'force-dynamic';

interface VerifyRequest {
  bookingRef: string;
  email: string;
  code: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();

    // Validate input
    if (!body.bookingRef || !body.email || !body.code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find booking by ref and email
    const { data: bookingData, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('booking_ref', body.bookingRef)
      .eq('contact_email', body.email.toLowerCase())
      .single();

    if (bookingError || !bookingData) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const booking = bookingData as Booking;

    // Check if already verified
    if (booking.is_verified) {
      return NextResponse.json(
        { error: 'Booking already verified' },
        { status: 400 }
      );
    }

    // Get latest verification code
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('verification_codes')
      .select('*')
      .eq('booking_id', booking.id)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (codeError || !codeData) {
      return NextResponse.json(
        { error: 'No active verification code found. Please request a new code.' },
        { status: 400 }
      );
    }

    const verificationCode = codeData as VerificationCode;

    // Check if code is expired
    if (isOTPExpired(verificationCode.expires_at)) {
      return NextResponse.json(
        { error: 'Verification code expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check max attempts
    if (verificationCode.attempts >= verificationCode.max_attempts) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify code
    if (verificationCode.code !== body.code) {
      // Increment attempts
      await supabaseAdmin
        .from('verification_codes')
        .update({ attempts: verificationCode.attempts + 1 })
        .eq('id', verificationCode.id);

      return NextResponse.json(
        {
          error: 'Invalid verification code',
          attemptsRemaining: verificationCode.max_attempts - verificationCode.attempts - 1,
        },
        { status: 400 }
      );
    }

    // Mark code as used
    await supabaseAdmin
      .from('verification_codes')
      .update({
        is_used: true,
        used_at: new Date().toISOString()
      })
      .eq('id', verificationCode.id);

    // Update booking status
    const expiresAt = getBookingExpiry();
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        status: 'verified',
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Booking update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to verify booking' },
        { status: 500 }
      );
    }

    // Send confirmation email with payment details
    try {
      await sendBookingConfirmationEmail({
        to: booking.contact_email,
        firstName: booking.contact_first_name || 'Traveler',
        bookingRef: booking.booking_ref,
        tourTitle: booking.tour_title,
        depositAmount: booking.deposit_amount,
        grandTotal: booking.grand_total,
        expiresAt: expiresAt,
        paymentMethod: booking.payment_method ?? undefined,
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
    }

    // Notify admin for Wire/Zelle bookings
    if (booking.payment_method !== 'card') {
      try {
        await sendNewBookingAdminEmail({
          bookingRef: booking.booking_ref,
          customerName: `${booking.contact_first_name} ${booking.contact_last_name}`,
          customerEmail: booking.contact_email,
          customerPhone: booking.contact_phone,
          tourTitle: booking.tour_title,
          paymentMethod: booking.payment_method,
          depositAmount: booking.deposit_amount,
          grandTotal: booking.grand_total,
          numberOfTravelers: booking.number_of_travelers,
          hasFlightBooking: booking.has_flight_booking,
          preferredDepartureCity: booking.preferred_departure_city,
          preferredReturnCity: booking.preferred_return_city,
        });
      } catch (adminEmailError) {
        console.error('Admin notification email error:', adminEmailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking verified successfully',
      booking: {
        ref: booking.booking_ref,
        tourTitle: booking.tour_title,
        grandTotal: booking.grand_total,
        depositAmount: booking.deposit_amount,
        expiresAt: expiresAt.toISOString(),
      },
    });

  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
