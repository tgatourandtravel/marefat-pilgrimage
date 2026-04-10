import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured = Boolean(secretKey);

export const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: "2025-08-27.basil",
      typescript: true,
    })
  : null;
