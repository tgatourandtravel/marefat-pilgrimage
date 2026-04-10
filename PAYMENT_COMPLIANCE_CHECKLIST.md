# Payment Compliance Checklist

Use this checklist before enabling live online payments.

## Business and Legal

- Register business entity and keep registration active
- Obtain EIN for tax and payment onboarding
- Use a dedicated business bank account
- Verify whether Seller of Travel registration is required in your operating state
- Publish and keep updated:
  - Terms of Service (`/terms`)
  - Privacy Policy (`/privacy`)
  - Refund Policy (`/refund-policy`)
- Keep cancellation terms visible during checkout

## Stripe Account Setup

- Create Stripe Business account
- Complete Stripe identity verification (KYC)
- Add business bank account payout details
- Enable Stripe Radar defaults and 3D Secure
- Configure webhook endpoint:
  - `/api/payments/webhook`
- Save secrets in environment variables:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`

## Security and Fraud Controls

- Never store raw card details in app database
- Use webhook signature verification for all payment status updates
- Enforce idempotency keys on PaymentIntent creation
- Record payment metadata (`booking_ref`, `tour_slug`, `contact_email`)
- Add rate limiting on payment creation endpoints
- Log suspicious payment attempts and monitor Stripe Dashboard alerts

## Operational Readiness

- Test full payment flow in Stripe test mode
- Verify admin notification emails on payment success/failure
- Confirm booking status transitions in Supabase
- Validate refund and dispute response process
