import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendBookingConfirmedEmail } from '@/lib/email/resend';
import { generateRegistrationConfirmationPDFBytes } from '@/lib/pdf/registration-confirmation-pdf';
import type { Booking, Traveler } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

interface HotelDetails {
  name: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  meal: string;
  address?: string;
  phone?: string;
  email?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

interface ConfirmRequest {
  hotelMedina: HotelDetails;
  hotelMecca: HotelDetails;
  balanceDueDate: string;
  notes?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify admin session
  const session = request.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: ConfirmRequest = await request.json();

    if (!body.hotelMedina?.name || !body.hotelMecca?.name || !body.balanceDueDate) {
      return NextResponse.json(
        { error: 'Hotel details and balance due date are required' },
        { status: 400 }
      );
    }

    // Fetch booking
    const { data: bookingData, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (bookingError || !bookingData) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingData as Booking;

    if (booking.status === 'confirmed') {
      return NextResponse.json({ error: 'Booking already confirmed' }, { status: 400 });
    }

    if (booking.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Cannot confirm booking without payment' },
        { status: 400 }
      );
    }

    // Fetch travelers
    const { data: travelersData } = await supabaseAdmin
      .from('travelers')
      .select('*')
      .eq('booking_id', booking.id)
      .order('traveler_order', { ascending: true });

    const travelers = (travelersData || []) as Traveler[];

    // Update booking status to confirmed
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Confirm update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm booking' },
        { status: 500 }
      );
    }

    // Generate PDF attachment
    let pdfBuffer: Buffer | undefined;
    try {
      const pdfBytes = generateRegistrationConfirmationPDFBytes({
        bookingRef: booking.booking_ref,
        groupName: booking.tour_title,
        preConfirmationNumber: `PC-${booking.booking_ref}`,
        confirmationDate: new Date().toISOString(),
        bookingStatus: 'Pre-Confirmed',
        booker: {
          fullName: `${booking.contact_first_name} ${booking.contact_last_name}`.trim(),
          phone: booking.contact_phone,
          email: booking.contact_email,
        },
        totalPrice: booking.grand_total,
        amountPaid: booking.deposit_amount,
        currency: 'USD',
        balanceDueDate: body.balanceDueDate,
        selectedPaymentMethod: booking.payment_method,
        travelers: travelers.map((t) => ({
          fullName: `${t.first_name} ${t.last_name}`.trim(),
          nationality: t.nationality,
          passportNumber: t.passport_number,
          dateOfBirth: t.date_of_birth,
          roomType: body.hotelMecca.roomType || body.hotelMedina.roomType || undefined,
        })),
        hotelMedina: {
          name: body.hotelMedina.name,
          checkInDate: body.hotelMedina.checkIn,
          checkOutDate: body.hotelMedina.checkOut,
          checkInTime: body.hotelMedina.checkInTime,
          checkOutTime: body.hotelMedina.checkOutTime,
          address: body.hotelMedina.address,
          phone: body.hotelMedina.phone,
          email: body.hotelMedina.email,
          mealPlan: body.hotelMedina.meal,
          roomType: body.hotelMedina.roomType,
        },
        hotelMecca: {
          name: body.hotelMecca.name,
          checkInDate: body.hotelMecca.checkIn,
          checkOutDate: body.hotelMecca.checkOut,
          checkInTime: body.hotelMecca.checkInTime,
          checkOutTime: body.hotelMecca.checkOutTime,
          address: body.hotelMecca.address,
          phone: body.hotelMecca.phone,
          email: body.hotelMecca.email,
          mealPlan: body.hotelMecca.meal,
          roomType: body.hotelMecca.roomType,
        },
        cancellationPolicy: body.notes,
      });
      pdfBuffer = Buffer.from(pdfBytes);
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      // Continue without PDF — email still goes out
    }

    // Send confirmation email to customer with PDF attachment
    try {
      await sendBookingConfirmedEmail({
        to: booking.contact_email,
        firstName: booking.contact_first_name,
        lastName: booking.contact_last_name,
        phone: booking.contact_phone,
        email: booking.contact_email,
        bookingRef: booking.booking_ref,
        tourTitle: booking.tour_title,
        grandTotal: booking.grand_total,
        depositAmount: booking.deposit_amount,
        paymentMethod: booking.payment_method,
        balanceDueDate: body.balanceDueDate,
        travelers: travelers.map((t) => `${t.first_name} ${t.last_name}`),
        hotelMedina: body.hotelMedina,
        hotelMecca: body.hotelMecca,
        notes: body.notes,
        pdfAttachment: pdfBuffer,
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
      // Don't fail — booking is confirmed, email can be resent
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Confirm booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}