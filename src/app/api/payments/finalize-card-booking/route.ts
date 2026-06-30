import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { stripe, isStripeConfigured } from "@/lib/stripe/client";
import { checkRateLimit } from "@/lib/utils/rate-limit";

export const dynamic = "force-dynamic";

interface FinalizeCardBookingRequest {
  bookingRef: string;
  paymentMethodId: string;
  setupIntentId: string;
}

const CARD_FEE_RATE = 0.036;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { allowed } = await checkRateLimit(`card-finalize:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many payment attempts. Please try again in one minute." },
        { status: 429 }
      );
    }

    if (!isStripeConfigured || !stripe) {
      return NextResponse.json({ error: "Online payment is not configured." }, { status: 503 });
    }

    const body: FinalizeCardBookingRequest = await request.json();
    if (!body.bookingRef || !body.paymentMethodId || !body.setupIntentId) {
      return NextResponse.json({ error: "bookingRef, paymentMethodId and setupIntentId are required." }, { status: 400 });
    }

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("booking_ref", body.bookingRef)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    if (booking.payment_method !== "card") {
      return NextResponse.json({ error: "Online card payment is not enabled for this booking." }, { status: 400 });
    }
    if (booking.payment_status === "paid") {
      return NextResponse.json({ error: "This booking is already paid." }, { status: 400 });
    }

    const setupIntent = await stripe.setupIntents.retrieve(body.setupIntentId);
    if (setupIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Card authorization is incomplete. Please retry." }, { status: 400 });
    }

    const setupPaymentMethodId =
      typeof setupIntent.payment_method === "string"
        ? setupIntent.payment_method
        : setupIntent.payment_method?.id;

    if (!setupPaymentMethodId || setupPaymentMethodId !== body.paymentMethodId) {
      return NextResponse.json({ error: "Payment method mismatch." }, { status: 400 });
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(body.paymentMethodId);
    if (paymentMethod.type !== "card") {
      return NextResponse.json({ error: "Only card payment methods are supported." }, { status: 400 });
    }

    const fundingType = paymentMethod.card?.funding ?? "unknown";
    const depositInCents = Math.max(1, Math.round(booking.deposit_amount * 100));
    const cardFeeCents = Math.round(depositInCents * CARD_FEE_RATE);
    const amountInCents = depositInCents + cardFeeCents;

    // Attach the payment method to a customer before reusing it in PaymentIntent.
    // Stripe requires this for setup-confirmed payment methods.
    const customer = await stripe.customers.create({
      email: booking.contact_email,
      name: `${booking.contact_first_name ?? ""} ${booking.contact_last_name ?? ""}`.trim() || undefined,
      phone: booking.contact_phone || undefined,
      metadata: {
        booking_ref: booking.booking_ref,
      },
    });

    try {
      await stripe.paymentMethods.attach(body.paymentMethodId, { customer: customer.id });
    } catch (attachError) {
      const error = attachError as { code?: string; message?: string };
      // Safe to continue when payment method is already attached.
      if (error.code !== "resource_already_exists") {
        throw attachError;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: "usd",
        payment_method_types: ["card"],
        customer: customer.id,
        payment_method: body.paymentMethodId,
        confirm: true,
        receipt_email: booking.contact_email,
        description: `${booking.tour_title} — ${booking.booking_ref}`,
        metadata: {
          booking_ref: booking.booking_ref,
          tour_slug: booking.tour_slug,
          tour_title: booking.tour_title,
          contact_email: booking.contact_email,
          flow: "payment_first",
          card_funding_type: fundingType,
          credit_card_fee_cents: String(cardFeeCents),
        },
      },
      {
        idempotencyKey: `card-finalize-${booking.booking_ref}-${body.paymentMethodId}-${amountInCents}`,
      }
    );

    await supabaseAdmin
      .from("bookings")
      .update({
        payment_status: "requires_action",
        stripe_payment_intent_id: paymentIntent.id,
      })
      .eq("id", booking.id);

    return NextResponse.json({
      paymentIntentStatus: paymentIntent.status,
      paymentIntentClientSecret: paymentIntent.client_secret,
      amountCharged: amountInCents / 100,
      cardFundingType: fundingType,
      cardFeeAmount: cardFeeCents / 100,
    });
  } catch (error) {
    console.error("finalize-card-booking error:", error);
    return NextResponse.json({ error: "Failed to finalize card payment." }, { status: 500 });
  }
}
