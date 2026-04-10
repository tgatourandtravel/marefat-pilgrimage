export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ivory">
      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="font-display text-3xl font-semibold text-charcoal">Terms of Service</h1>
        <p className="mt-4 text-sm text-charcoal/70">
          These Terms of Service govern bookings made with Marefat Pilgrimage.
          By placing a booking, you agree to these terms.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-charcoal/80">
          <section>
            <h2 className="text-lg font-semibold text-charcoal">1. Booking and Confirmation</h2>
            <p className="mt-2">
              A booking is considered confirmed only after identity verification and successful receipt
              of the required deposit or online payment confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">2. Pricing and Payment</h2>
            <p className="mt-2">
              Tour pricing is displayed at checkout. A deposit is required to reserve a seat. The
              remaining balance is due before departure based on your itinerary terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">3. Traveler Responsibility</h2>
            <p className="mt-2">
              Travelers are responsible for valid passports, visas, health requirements, and accurate
              booking information. Marefat Pilgrimage is not responsible for losses caused by invalid
              or incomplete travel documentation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">4. Changes and Cancellations</h2>
            <p className="mt-2">
              Changes and cancellations are subject to our refund and cancellation policy. Airline,
              hotel, and partner penalties may apply depending on timing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">5. Liability</h2>
            <p className="mt-2">
              Marefat Pilgrimage acts as an organizer and facilitator with approved third-party
              providers. Liability is limited to the extent permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">6. Contact</h2>
            <p className="mt-2">
              For legal or booking inquiries, contact{" "}
              <a className="underline" href="mailto:info@marefatpilgrimage.com">
                info@marefatpilgrimage.com
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
