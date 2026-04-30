"use client";

import { FormEvent, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

interface PaymentFormProps {
  bookingRef: string;
  /**
   * Optional URL to redirect to on successful payment.
   * Defaults to the current page URL (used by the legacy success-page flow).
   */
  successUrl?: string;
  /**
   * Optional async callback invoked once — just before the first payment
   * submission attempt — to lazily create the PaymentIntent and return its
   * `clientSecret`.  When provided, the form calls this instead of relying on
   * a `clientSecret` already mounted in the parent `<Elements>` provider.
   * The parent must pass the returned secret into the Stripe Elements instance
   * via its `options.clientSecret` before calling `stripe.confirmPayment`.
   *
   * In practice the parent already pre-fetches the clientSecret (from
   * `/api/payments/initiate-card-booking`) before rendering this component, so
   * `onInitiate` is only called on the very first submit — if the parent
   * hasn't initialised Elements yet, this is a no-op fallback path.
   */
  onInitiate?: () => Promise<string>;
  /** Button label override (defaults to "Pay Deposit Now") */
  buttonLabel?: string;
}

export default function PaymentForm({
  bookingRef,
  successUrl,
  buttonLabel = "Pay Deposit Now",
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const buildReturnUrl = () => {
    if (successUrl) return successUrl;
    return `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(bookingRef)}&verified=true&paid=true`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: buildReturnUrl() },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message || "Payment failed.");
      setIsSubmitting(false);
      return;
    }

    // No redirect required (e.g. no 3D Secure) — navigate immediately.
    setIsSubmitting(false);
    window.location.href = buildReturnUrl();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-xs text-danger">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-ivory transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Processing..." : buttonLabel}
      </button>
    </form>
  );
}
