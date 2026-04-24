/**
 * Feature flags — toggle features without touching business logic.
 *
 * TO ENABLE ONLINE PAYMENT:
 *   Change ONLINE_PAYMENT_ENABLED to `true`, then redeploy.
 *   All Stripe infrastructure (API routes, webhook, DB columns) is already in place.
 */

export const ONLINE_PAYMENT_ENABLED = true;
