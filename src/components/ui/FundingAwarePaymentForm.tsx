"use client";

import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

interface FundingAwarePaymentFormProps {
  bookingRef: string;
  successUrl: string;
  buttonLabel?: string;
}

export default function FundingAwarePaymentForm({
  bookingRef,
  successUrl,
  buttonLabel = "Pay Deposit Securely",
}: FundingAwarePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError("");

    const setupResult = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (setupResult.error) {
      setError(setupResult.error.message || "Card verification failed.");
      setIsSubmitting(false);
      return;
    }

    const setupIntent = setupResult.setupIntent;
    const paymentMethodId =
      typeof setupIntent.payment_method === "string"
        ? setupIntent.payment_method
        : setupIntent.payment_method?.id;

    if (!setupIntent?.id || !paymentMethodId) {
      setError("Unable to verify payment method. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const finalizeResponse = await fetch("/api/payments/finalize-card-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingRef,
        paymentMethodId,
        setupIntentId: setupIntent.id,
      }),
    });

    const finalizeData = await finalizeResponse.json();
    if (!finalizeResponse.ok) {
      setError(finalizeData.error || "Failed to finalize payment.");
      setIsSubmitting(false);
      return;
    }

    if (
      finalizeData.paymentIntentStatus === "requires_action" &&
      finalizeData.paymentIntentClientSecret
    ) {
      const confirmResult = await stripe.confirmCardPayment(finalizeData.paymentIntentClientSecret);
      if (confirmResult.error) {
        setError(confirmResult.error.message || "Payment authentication failed.");
        setIsSubmitting(false);
        return;
      }
    }

    const redirectUrl = new URL(successUrl);
    redirectUrl.searchParams.set("funding", finalizeData.cardFundingType || "unknown");
    redirectUrl.searchParams.set("fee", String(finalizeData.cardFeeAmount || 0));
    redirectUrl.searchParams.set("charged", String(finalizeData.amountCharged || 0));
    window.location.href = redirectUrl.toString();
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      {error && <p className="text-xs text-danger">{error}</p>}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || isSubmitting}
        className="w-full rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-ivory transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Processing..." : buttonLabel}
      </button>
    </div>
  );
}
