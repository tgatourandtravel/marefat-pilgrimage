import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal";

export const metadata: Metadata = {
  title: "Booking & Service Transparency Note | Marefat Pilgrimage",
  description:
    "Transparency note on how TGA Tour and Travel LLC (DBA Marefat Pilgrimage) provides travel advisory and intermediary services.",
};

export default function TransparencyPage() {
  return (
    <LegalPageShell
      title="Booking & Service Transparency Note"
      subtitle="TGA Tour and Travel LLC — DBA: Marefat Pilgrimage"
    >
      <h2>Our commitment to transparency</h2>
      <p>
        The Company does not guarantee the availability, pricing, or performance of any third-party
        travel services.
      </p>
      <p>
        TGA Tour and Travel LLC is committed to providing professional, transparent, and reliable
        travel services.
      </p>
      <p>
        We believe that clear communication and defined expectations are essential to delivering
        high-quality travel experiences.
      </p>

      <h2>Our role as a travel advisor</h2>
      <p>
        TGA Tour and Travel LLC operates as a travel advisor and intermediary between clients and
        independent travel service providers, including:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Airlines</li>
        <li>Hotels</li>
        <li>Transportation providers</li>
        <li>Tour operators</li>
        <li>Private aviation operators</li>
        <li>Government and visa authorities</li>
      </ul>
      <p>We do not own or control these suppliers.</p>

      <h2>Service fees and pricing</h2>
      <p>
        Our services are based on professional planning, coordination, and travel management.
      </p>
      <p>Service fees may apply for:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Travel consultation and planning</li>
        <li>Booking management</li>
        <li>Concierge services</li>
        <li>Modifications, changes, or cancellations</li>
        <li>Additional or special requests</li>
      </ul>
      <p>
        All applicable fees are outlined in our official Pricing Guide and are communicated prior
        to confirmation.
      </p>
      <p>
        Payments made in cryptocurrency are subject to market volatility and may vary in value. The
        Company does not guarantee exchange rates or value stability for cryptocurrency
        transactions.
      </p>

      <h2>Minimum service engagement</h2>
      <p>
        Our services are subject to a minimum service fee, which applies regardless of booking size
        or final transaction value.
      </p>
      <p>
        This fee reflects the professional time, expertise, and resources required to provide
        high-quality service.
      </p>
      <p>
        Certain services, particularly pilgrimage travel programs, may involve coordination with
        government systems, religious authorities, and regulated platforms. These processes are
        outside the Company&apos;s control and may affect timing, availability, or outcomes.
      </p>

      <h2>Customer responsibilities</h2>
      <p>To ensure a smooth booking process, customers are responsible for:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Providing complete and accurate information</li>
        <li>Submitting all travel requirements at the time of booking</li>
        <li>Reviewing all travel documents and confirmations</li>
      </ul>
      <p>Additional requests made after booking may result in additional service fees.</p>

      <h2>Supplier control and limitations</h2>
      <p>
        The Company does not guarantee the performance, availability, or outcomes of services
        provided by third-party suppliers.
      </p>
      <p>
        TGA Tour and Travel LLC is not responsible for the acts, errors, omissions, or performance
        of third-party suppliers.
      </p>
      <p>Travel services are provided by independent third-party suppliers.</p>
      <p>As a result:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Availability and pricing are subject to change</li>
        <li>Services may be modified due to operational or regulatory reasons</li>
        <li>Cancellation and refund policies are determined by suppliers</li>
      </ul>

      <h2>High-value travel services</h2>
      <p>
        For high-value or complex travel arrangements, including private aviation and luxury travel
        programs, customized pricing structures may apply.
      </p>
      <p>These will be clearly communicated and agreed upon prior to proceeding.</p>

      <h2>Legal framework</h2>
      <p>All services are provided in accordance with:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <Link href="/terms" className="text-charcoal underline underline-offset-2">
            Terms and Conditions
          </Link>
        </li>
        <li>
          <Link href="/privacy" className="text-charcoal underline underline-offset-2">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link href="/refund-policy" className="text-charcoal underline underline-offset-2">
            Refund Policy
          </Link>
        </li>
        <li>Pricing Guide (as provided separately)</li>
      </ul>
      <p>Customers are encouraged to review these documents before confirming any booking.</p>

      <h2>Acknowledgement</h2>
      <p>By submitting a booking request or making payment, the customer confirms that they:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Understand the nature of our services</li>
        <li>Accept applicable service fees</li>
        <li>Agree to the Company&apos;s policies and terms</li>
      </ul>
      <p>
        Our services are designed for clients who value expertise, efficiency, and premium travel
        experiences.
      </p>
      <p>
        All provisions of this transparency note apply to the fullest extent permitted by applicable
        law.
      </p>
      <p>
        The customer acknowledges that travel services are subject to external factors beyond the
        Company&apos;s control and accepts the associated risks.
      </p>
      <p>Travel, professionally managed with clarity and care.</p>
    </LegalPageShell>
  );
}
