import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/server";
import { sendPaymentSuccessAdminEmail, sendBookingConfirmationEmail } from "@/lib/email/resend";

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const bookingRef = paymentIntent.metadata?.booking_ref;

    if (!bookingRef) {
      return;
    }

    // Idempotency guard: if Stripe retries the webhook event after a transient
    // failure, do not apply the update again on an already-paid booking.
    const { data: existing } = await supabaseAdmin
      .from("bookings")
      .select("payment_status")
      .eq("booking_ref", bookingRef)
      .single();

    if (existing?.payment_status === "paid") {
      return;
    }

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .update({
        status: "deposit_paid",
        payment_status: "paid",
        payment_method: "card",
        payment_paid_at: new Date().toISOString(),
        stripe_payment_intent_id: paymentIntent.id,
      })
      .eq("booking_ref", bookingRef)
      .select("*")
      .single();

    if (error || !booking) {
      throw new Error("Failed to update booking payment state");
    }

    // Send admin notification
    try {
      await sendPaymentSuccessAdminEmail({
        bookingRef: booking.booking_ref,
        customerEmail: booking.contact_email,
        amount: paymentIntent.amount_received / 100,
        currency: paymentIntent.currency.toUpperCase(),
        tourTitle: booking.tour_title,
      });
    } catch (emailError) {
      console.error("Admin payment email error:", emailError);
    }

    // Send booking confirmation to the traveler.
    // For the payment-first card flow the booking was created pre-verified,
    // so this is the first (and only) confirmation email the traveler receives.
    try {
      await sendBookingConfirmationEmail({
        to: booking.contact_email,
        firstName: booking.contact_first_name,
        bookingRef: booking.booking_ref,
        tourTitle: booking.tour_title,
        depositAmount: booking.deposit_amount,
        grandTotal: booking.grand_total,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // balance due in 45 days
        paymentMethod: "card",
      });
    } catch (emailError) {
      console.error("Traveler confirmation email error:", emailError);
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const bookingRef = paymentIntent.metadata?.booking_ref;
    if (!bookingRef) return;

    await supabaseAdmin
      .from("bookings")
      .update({
        payment_status: "failed",
        payment_method: "card",
        stripe_payment_intent_id: paymentIntent.id,
      })
      .eq("booking_ref", bookingRef);
  }
}
