"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/ui/PaymentForm";
import { ONLINE_PAYMENT_ENABLED } from "@/lib/config/features";
import type { PaymentMethod, PaymentStatus } from "@/lib/supabase/types";

function CopyDetailsButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="flex items-center gap-1.5 rounded-lg bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal transition hover:bg-charcoal/10"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

type BookingPaymentState = {
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  expires_at: string | null;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get("ref") || "MAR-XXXXX";
  const verified = searchParams.get("verified") === "true";
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoadingPaymentState, setIsLoadingPaymentState] = useState(true);

  const stripePromise = useMemo(() => {
    if (paymentMethod !== "card") return null;
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    return key ? loadStripe(key) : null;
  }, [paymentMethod]);

  useEffect(() => {
    const loadPaymentState = async () => {
      setIsLoadingPaymentState(true);
      const { data } = await supabase
        .from("bookings")
        .select("payment_status, payment_method, expires_at")
        .eq("booking_ref", bookingRef)
        .single<BookingPaymentState>();

      if (data) {
        setPaymentStatus(data.payment_status || null);
        setPaymentMethod(data.payment_method || null);
        setExpiresAt(data.expires_at || null);
      }
      setIsLoadingPaymentState(false);
    };

    loadPaymentState();
  }, [bookingRef]);

  const createPaymentIntent = async () => {
    setIsCreatingIntent(true);
    setPaymentError(null);
    try {
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingRef }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize online payment.");
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Payment initialization failed.");
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      const response = await fetch(`/api/bookings/pdf?ref=${encodeURIComponent(bookingRef)}`);
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to generate PDF.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `Marefat-Booking-${bookingRef}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      setDownloadError(
        error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Use authoritative expiry date from DB if available.
  const expiryDate = expiresAt ? new Date(expiresAt) : new Date();
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

          {/* Payment Details - Only shown after verification */}
          {verified && isLoadingPaymentState && (
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-charcoal/10 bg-ivory/90 p-5 text-left">
              <p className="text-xs text-charcoal/60">Loading your payment details...</p>
            </div>
          )}

          {verified && !isLoadingPaymentState && paymentMethod !== "card" && (
            <div className="mx-auto mt-8 max-w-md text-left space-y-4">
              {/* Wire Transfer Details */}
              {paymentMethod === "wire" && (
                <div className="rounded-xl border border-gold/30 bg-ivory/90 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/70">
                      Wire Transfer Details
                    </p>
                    <CopyDetailsButton
                      text={`Account Name: TGA Tour and Travel LLC\nBank: JPMorgan Chase Bank, N.A.\nRouting Number (Wire): 021000021\nAccount Number: 2906503801\nSWIFT/BIC: CHASUS33\nReference: ${bookingRef}`}
                    />
                  </div>
                  <div className="space-y-2 text-sm text-charcoal">
                    <div className="flex gap-2">
                      <span className="w-36 shrink-0 font-medium text-charcoal/70">Account Name</span>
                      <span>TGA Tour and Travel LLC</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-36 shrink-0 font-medium text-charcoal/70">Bank</span>
                      <span>JPMorgan Chase Bank, N.A.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-36 shrink-0 font-medium text-charcoal/70">Routing (Wire)</span>
                      <span className="font-mono">021000021</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-36 shrink-0 font-medium text-charcoal/70">Account Number</span>
                      <span className="font-mono">2906503801</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-36 shrink-0 font-medium text-charcoal/70">SWIFT / BIC</span>
                      <span className="font-mono">CHASUS33</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-36 shrink-0 font-medium text-charcoal/70">Reference</span>
                      <span className="font-mono font-semibold text-charcoal">{bookingRef}</span>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg bg-charcoal/5 p-3">
                    <p className="text-xs leading-relaxed text-charcoal/70">
                      <strong className="font-semibold text-charcoal">Important:</strong> Please send as a wire transfer (not ACH)
                      and include your booking reference in the payment note.
                    </p>
                  </div>
                </div>
              )}

              {/* Zelle Details */}
              {paymentMethod === "zelle" && (
                <div className="rounded-xl border border-gold/30 bg-ivory/90 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/70">
                      Zelle Transfer Details
                    </p>
                    <CopyDetailsButton
                      text={`Zelle Recipient: info@tgatourandtravel.com\nRecipient Name: TGA Tour and Travel LLC\nReference: ${bookingRef}`}
                    />
                  </div>
                  <div className="space-y-2 text-sm text-charcoal">
                    <div className="flex gap-2">
                      <span className="w-36 shrink-0 font-medium text-charcoal/70">Recipient Email</span>
                      <span className="font-mono">info@tgatourandtravel.com</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-36 shrink-0 font-medium text-charcoal/70">Recipient Name</span>
                      <span>TGA Tour and Travel LLC</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-36 shrink-0 font-medium text-charcoal/70">Reference</span>
                      <span className="font-mono font-semibold text-charcoal">{bookingRef}</span>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg bg-charcoal/5 p-3">
                    <p className="text-xs leading-relaxed text-charcoal/70">
                      <strong className="font-semibold text-charcoal">Verification:</strong> Before completing your transfer,
                      confirm the recipient name in Zelle matches{" "}
                      <strong className="text-charcoal">TGA Tour and Travel LLC</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Expiry Notice */}
              <div className="rounded-xl bg-gold/10 p-4">
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

          {ONLINE_PAYMENT_ENABLED &&
            verified &&
            !isLoadingPaymentState &&
            paymentMethod === "card" &&
            paymentStatus !== "paid" && (
            <div className="mx-auto mt-6 max-w-md rounded-xl border border-charcoal/10 bg-ivory/90 p-6 text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal/70">
                Online Card Payment
              </p>
              <p className="mb-4 text-xs text-charcoal/70">
                Pay your deposit securely via Stripe. Card data is handled by Stripe and never stored
                on Marefat Pilgrimage servers.
              </p>

              {!clientSecret ? (
                <button
                  onClick={createPaymentIntent}
                  disabled={isCreatingIntent}
                  className="w-full rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-ivory transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingIntent ? "Initializing..." : "Pay Deposit Online"}
                </button>
              ) : stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm bookingRef={bookingRef} />
                </Elements>
              ) : (
                <p className="text-xs text-danger">
                  Online payment is temporarily unavailable. Please contact support.
                </p>
              )}

              {paymentError && <p className="mt-3 text-xs text-danger">{paymentError}</p>}
              {paymentMethod === "card" && (
                <p className="mt-3 text-xs text-charcoal/60">
                  Your booking is set to card payment mode.
                </p>
              )}
            </div>
          )}

          {paymentStatus === "paid" && (
            <div className="mx-auto mt-6 max-w-md rounded-xl border border-gold/30 bg-gold/10 p-4 text-left">
              <p className="text-sm font-semibold text-charcoal">Online payment received</p>
              <p className="mt-1 text-xs text-charcoal/70">
                Your deposit has been paid successfully. Our team will contact you with the next steps.
              </p>
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
                    Please transfer the deposit using the payment details{" "}
                    {verified ? "shown above" : "provided in your confirmation email"}.
                    Always include your booking reference <strong className="font-medium text-charcoal">{bookingRef}</strong> in the payment note.
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
