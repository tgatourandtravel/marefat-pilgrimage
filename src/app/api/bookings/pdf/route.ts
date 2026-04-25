import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { generateBookingPDFBytes, type BookingData } from "@/lib/pdf/booking-pdf";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const bookingRef = request.nextUrl.searchParams.get("ref")?.trim();
    if (!bookingRef) {
      return NextResponse.json({ error: "Booking reference is required." }, { status: 400 });
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("booking_ref", bookingRef)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    // PDF can only be retrieved for verified bookings.
    if (!booking.is_verified) {
      return NextResponse.json(
        { error: "Booking must be verified before downloading confirmation." },
        { status: 403 }
      );
    }

    const { data: travelers, error: travelersError } = await supabaseAdmin
      .from("travelers")
      .select("*")
      .eq("booking_id", booking.id)
      .order("traveler_order", { ascending: true });

    if (travelersError) {
      return NextResponse.json(
        { error: "Failed to load traveler details." },
        { status: 500 }
      );
    }

    const pdfData: BookingData = {
      bookingRef: booking.booking_ref,
      tourTitle: booking.tour_title,
      tourDestination: booking.tour_destination,
      tourStartDate: booking.tour_start_date,
      tourDurationDays: booking.tour_duration_days,
      numberOfTravelers: booking.number_of_travelers,
      travelers: (travelers || []).map((traveler) => ({
        firstName: traveler.first_name,
        lastName: traveler.last_name,
        email: traveler.email,
        phone: traveler.phone,
        passportNumber: traveler.passport_number,
        nationality: traveler.nationality,
        passportExpiry: traveler.passport_expiry,
        dateOfBirth: traveler.date_of_birth,
      })),
      basePricePerPerson: booking.base_price_per_person,
      insuranceTotal: booking.insurance_total,
      flightTotal: booking.flight_total,
      grandTotal: booking.grand_total,
      depositAmount: booking.deposit_amount,
      hasInsurance: booking.has_insurance,
      hasFlightBooking: booking.has_flight_booking,
      contactEmail: booking.contact_email,
      contactPhone: booking.contact_phone,
      createdAt: booking.created_at,
      expiresAt: booking.expires_at,
    };

    const pdfBytes = generateBookingPDFBytes(pdfData);
    const pdfArrayBuffer = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;
    const fileName = `Marefat-Booking-${booking.booking_ref}.pdf`;

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Booking PDF API error:", error);
    return NextResponse.json({ error: "Failed to generate PDF." }, { status: 500 });
  }
}

