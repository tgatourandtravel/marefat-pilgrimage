import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateOTP, getOTPExpiry } from '@/lib/utils/otp';
import { sendOTPEmail } from '@/lib/email/resend';
import type { Booking, Traveler, VerificationCode } from '@/lib/supabase/types';

interface ResendRequest {
  bookingRef: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ResendRequest = await request.json();

    // Validate input
    if (!body.bookingRef || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find booking
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

    // Rate limiting: Check last code creation time
    const { data: lastCodeData } = await supabaseAdmin
      .from('verification_codes')
      .select('created_at')
      .eq('booking_id', booking.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastCodeData) {
      const lastCode = lastCodeData as { created_at: string };
      const lastCreated = new Date(lastCode.created_at);
      const now = new Date();
      const diffSeconds = (now.getTime() - lastCreated.getTime()) / 1000;

      if (diffSeconds < 60) {
        return NextResponse.json(
          {
            error: 'Please wait before requesting a new code',
            waitSeconds: Math.ceil(60 - diffSeconds),
          },
          { status: 429 }
        );
      }
    }

    // Invalidate previous codes
    await supabaseAdmin
      .from('verification_codes')
      .update({ is_used: true })
      .eq('booking_id', booking.id)
      .eq('is_used', false);

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpiry = getOTPExpiry();

    await supabaseAdmin
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

    // Get primary traveler name
    const { data: travelerData } = await supabaseAdmin
      .from('travelers')
      .select('first_name')
      .eq('booking_id', booking.id)
      .eq('is_primary_contact', true)
      .single();

    const primaryTraveler = travelerData as { first_name: string } | null;

    // Send email
    await sendOTPEmail({
      to: booking.contact_email,
      firstName: primaryTraveler?.first_name || 'Traveler',
      bookingRef: booking.booking_ref,
      otpCode: otpCode,
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
    });

  } catch (error) {
    console.error('Resend API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
