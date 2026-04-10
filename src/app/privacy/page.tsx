export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ivory">
      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="font-display text-3xl font-semibold text-charcoal">Privacy Policy</h1>
        <p className="mt-4 text-sm text-charcoal/70">
          This policy explains how Marefat Pilgrimage collects and uses your personal information.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-charcoal/80">
          <section>
            <h2 className="text-lg font-semibold text-charcoal">1. Data We Collect</h2>
            <p className="mt-2">
              We collect booking details, traveler identity information, and contact information
              required to process reservations, provide support, and satisfy legal travel requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">2. Payment Data</h2>
            <p className="mt-2">
              Online card payments are processed by Stripe. Card details are handled directly by Stripe
              and are not stored on Marefat Pilgrimage servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">3. How We Use Data</h2>
            <p className="mt-2">
              We use your data to confirm bookings, send verification and travel updates, process
              payments, prevent fraud, and meet regulatory obligations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">4. Data Sharing</h2>
            <p className="mt-2">
              We share only necessary information with trusted service providers (airlines, hotels,
              visa partners, payment processors) to deliver your travel services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">5. Security</h2>
            <p className="mt-2">
              We use reasonable technical and organizational safeguards, including encrypted transport,
              access controls, and audited third-party platforms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal">6. Contact</h2>
            <p className="mt-2">
              To request access, correction, or deletion of your data, email{" "}
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
