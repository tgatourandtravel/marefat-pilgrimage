"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { generateBookingPDF, type BookingData } from "@/lib/pdf/booking-pdf";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get("ref") || "MAR-XXXXX";
  const verified = searchParams.get("verified") === "true";
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      // Fetch booking data from Supabase
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_ref', bookingRef)
        .single();

      if (bookingError || !bookingData) {
        throw new Error('Booking not found');
      }

      // Fetch travelers data
      const { data: travelersData, error: travelersError } = await supabase
        .from('travelers')
        .select('*')
        .eq('booking_id', (bookingData as any).id)
        .order('traveler_order', { ascending: true });

      if (travelersError) {
        throw new Error('Failed to fetch traveler information');
      }

      // Format data for PDF
      const booking = bookingData as any;
      const pdfData: BookingData = {
        bookingRef: booking.booking_ref,
        tourTitle: booking.tour_title,
        tourDestination: booking.tour_destination,
        tourStartDate: booking.tour_start_date,
        tourDurationDays: booking.tour_duration_days,
        numberOfTravelers: booking.number_of_travelers,
        travelers: (travelersData || []).map((t: any) => ({
          firstName: t.first_name,
          lastName: t.last_name,
          email: t.email,
          phone: t.phone,
          passportNumber: t.passport_number,
          nationality: t.nationality,
          passportExpiry: t.passport_expiry,
          dateOfBirth: t.date_of_birth,
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

      // Generate and download PDF
      generateBookingPDF(pdfData);
    } catch (error) {
      console.error('PDF generation error:', error);
      setDownloadError(
        error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Calculate expiry date (1 week from now)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  const formattedExpiry = expiryDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-ivory">
      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-charcoal/5 bg-ivory p-8 text-center shadow-soft sm:p-12">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-gold-soft/30">
            <svg
              className="h-10 w-10 text-gold-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            Booking Confirmed!
          </h1>
          <p className="mt-4 text-base leading-relaxed text-charcoal/75">
            Thank you for choosing Marefat Pilgrimage. Your sacred journey awaits.
          </p>

          {/* Booking Reference */}
          <div className="mx-auto mt-8 max-w-md rounded-xl bg-ivory/90 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Booking Reference
            </p>
            <p className="mt-2 font-display text-2xl font-bold tracking-wide text-charcoal">
              {bookingRef}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-charcoal/70">
              Please save this reference number for future correspondence.
            </p>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-charcoal/15 bg-ivory px-6 py-2.5 text-sm font-medium text-charcoal shadow-sm transition hover:border-charcoal/30 hover:shadow-md disabled:cursor-wait disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Confirmation PDF
                </>
              )}
            </button>

            {/* Error Message */}
            {downloadError && (
              <div className="mt-3 rounded-lg border border-danger bg-danger-light/10 p-3">
                <p className="text-xs text-danger">{downloadError}</p>
              </div>
            )}
          </div>

          {/* Bank Details - Only shown after verification */}
          {verified && (
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-gold/30 bg-ivory/90 p-6 text-left">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-charcoal/70">
                Bank Details for Deposit
              </p>
              <div className="space-y-2 text-sm text-charcoal">
                <div className="flex">
                  <span className="w-24 font-medium">Bank:</span>
                  <span>Deutsche Bank</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">IBAN:</span>
                  <span className="font-mono">DE89 3704 0044 0532 0130 00</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">BIC:</span>
                  <span className="font-mono">COBADEFFXXX</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">Reference:</span>
                  <span className="font-mono font-medium">{bookingRef}</span>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-gold/10 p-3">
                <p className="text-xs text-charcoal/70">
                  <strong className="font-semibold text-charcoal">Reservation expires:</strong>{" "}
                  {formattedExpiry}
                </p>
                <p className="mt-1 text-xs text-charcoal/60">
                  Please complete the deposit payment by this date to secure your booking.
                </p>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="mt-10 space-y-4 text-left">
            <h2 className="text-center text-base font-semibold text-charcoal">
              What Happens Next?
            </h2>

            <div className="rounded-xl border border-charcoal/5 bg-ivory/90 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <svg className="h-5 w-5 text-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-charcoal">
                    1. Email Confirmation
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/70">
                    A detailed confirmation email with your booking information, payment instructions, and bank details has been sent to your inbox. Please check your spam folder if you don&apos;t see it within a few minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-charcoal/5 bg-ivory/90 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <svg className="h-5 w-5 text-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-charcoal">
                    2. Payment Transfer
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/70">
                    Please transfer the 30% deposit to the bank account {verified ? "shown above" : "provided in your email"}. Use your booking reference ({bookingRef}) as the payment reference.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-charcoal/5 bg-ivory/90 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <svg className="h-5 w-5 text-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-charcoal">
                    3. Travel Documents
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/70">
                    Once we receive your deposit, we&apos;ll send you detailed travel documents, pre-departure guide, and visa assistance information (if applicable).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="mt-10 rounded-xl bg-gold/10 p-6">
            <p className="text-sm font-medium text-charcoal">
              Questions? We&apos;re here to help.
            </p>
            <p className="mt-2 text-xs text-charcoal/70">
              Contact us at{" "}
              <a
                href="mailto:info@marefatpilgrimage.com"
                className="font-medium text-gold-dark transition hover:underline"
              >
                info@marefatpilgrimage.com
              </a>
              {" "}or WhatsApp{" "}
              <a
                href="https://wa.me/19543308904"
                className="font-medium text-gold-dark transition hover:underline"
              >
                +1 (954) 330-8904
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-charcoal/15 bg-ivory px-8 py-3 text-sm font-medium text-charcoal shadow-sm transition hover:border-charcoal/30 hover:shadow-md"
            >
              Return Home
            </Link>
            <Link
              href="/tours"
              className="inline-flex items-center justify-center rounded-full bg-charcoal px-8 py-3 text-sm font-medium text-ivory shadow-soft transition hover:bg-charcoal/90"
            >
              Explore More Tours
            </Link>
          </div>
        </div>

        {/* Additional info */}
        <p className="mt-8 text-center text-xs text-charcoal/60">
          You will receive a confirmation email within the next few minutes. If you don&apos;t see it, please check your spam folder.
        </p>
      </section>
    </main>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-ivory">
          <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-12">
            <div className="rounded-2xl border border-charcoal/5 bg-ivory p-12 text-center shadow-soft">
              <p className="text-sm text-charcoal/70">Loading confirmation...</p>
            </div>
          </section>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
