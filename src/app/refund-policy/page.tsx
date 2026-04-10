export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-ivory">
      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="font-display text-3xl font-semibold text-charcoal">Refund & Cancellation Policy</h1>
        <p className="mt-4 text-sm text-charcoal/70">
          This policy describes refund eligibility for tour bookings and related services.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-charcoal/80">
          <section>
            <h2 className="text-lg font-semibold text-charcoal">1. Deposit Payments</h2>
            <p className="mt-2">
              Deposits reserve limited seats and partner inventory. Deposit refunds depend on cancellation
              timing and third-party penalties already incurred.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">2. Standard Cancellation Window</h2>
            <p className="mt-2">
              Cancellations requested more than 30 days before departure are generally eligible for
              partial refund after non-recoverable costs. Cancellations within 30 days may be
              non-refundable or partially refundable depending on supplier terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">3. Visa, Airline, and Hotel Charges</h2>
            <p className="mt-2">
              Government fees, visa fees, airline tickets, and certain hotel charges are often non-refundable
              once issued or confirmed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">4. Processing Time</h2>
            <p className="mt-2">
              Approved refunds are typically processed within 7 to 14 business days to the original
              payment method where possible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">5. Contact for Refund Requests</h2>
            <p className="mt-2">
              Submit cancellation or refund requests to{" "}
              <a className="underline" href="mailto:info@marefatpilgrimage.com">
                info@marefatpilgrimage.com
              </a>{" "}
              with your booking reference.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
