import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { stripe, isStripeConfigured } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";
const rateLimitWindowMs = 60_000;
const maxRequestsPerWindow = 10;
const requestLog = new Map<string, number[]>();

interface CreateIntentRequest {
  bookingRef: string;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter((ts) => now - ts < rateLimitWindowMs);
    if (recent.length >= maxRequestsPerWindow) {
      return NextResponse.json(
        { error: "Too many payment attempts. Please try again in one minute." },
        { status: 429 }
      );
    }
    recent.push(now);
    requestLog.set(ip, recent);

    if (!isStripeConfigured || !stripe) {
      return NextResponse.json(
        { error: "Online payment is not configured yet." },
        { status: 503 }
      );
    }

    const body: CreateIntentRequest = await request.json();
    if (!body.bookingRef) {
      return NextResponse.json({ error: "bookingRef is required" }, { status: 400 });
    }

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("booking_ref", body.bookingRef)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (!booking.is_verified) {
      return NextResponse.json(
        { error: "Booking must be verified before online payment." },
        { status: 400 }
      );
    }

    if (booking.payment_status === "paid") {
      return NextResponse.json(
        { error: "This booking is already paid." },
        { status: 400 }
      );
    }

    const amountInCents = Math.max(1, Math.round(booking.deposit_amount * 100));
    const idempotencyKey = `deposit-${booking.booking_ref}-${amountInCents}`;

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: "eur",
        automatic_payment_methods: { enabled: true },
        receipt_email: booking.contact_email,
        metadata: {
          booking_ref: booking.booking_ref,
          tour_slug: booking.tour_slug,
          contact_email: booking.contact_email,
        },
      },
      { idempotencyKey }
    );

    await supabaseAdmin
      .from("bookings")
      .update({
        payment_method: "card",
        payment_status: "requires_action",
        stripe_payment_intent_id: paymentIntent.id,
      })
      .eq("id", booking.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: booking.deposit_amount,
      currency: "EUR",
    });
  } catch (error) {
    console.error("Create PaymentIntent error:", error);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
