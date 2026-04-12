import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Marefat Pilgrimage",
  description:
    "Privacy Policy for TGA Tour and Travel LLC (DBA Marefat Pilgrimage): how we collect, use, and protect personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      subtitle="TGA Tour and Travel LLC — Doing Business As: Marefat Pilgrimage"
      effectiveDate="March 11, 2026"
    >
      <p>
        TGA Tour and Travel LLC (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or
        &quot;us&quot;) respects the privacy of our customers and is committed to protecting
        personal information collected during the booking and travel service process.
      </p>
      <p>
        This Privacy Policy explains how we collect, use, store, and share personal information
        when customers use our services.
      </p>

      <h2>1. Company identity</h2>
      <p>This Privacy Policy applies to services provided by:</p>
      <p>
        <strong className="text-charcoal">TGA Tour and Travel LLC</strong>
      </p>
      <p>
        The trade name Marefat Pilgrimage is a brand operated by TGA Tour and Travel LLC.
      </p>
      <p>
        All personal data collected under the name Marefat Pilgrimage is processed and
        controlled by TGA Tour and Travel LLC.
      </p>
      <h3 className="text-base font-semibold text-charcoal">Data controller</h3>
      <p>
        For the purposes of applicable data protection laws, including the General Data
        Protection Regulation (GDPR), TGA Tour and Travel LLC acts as the data controller
        responsible for the processing of personal information described in this Privacy
        Policy.
      </p>

      <h2>2. Information we collect</h2>
      <p>We may collect personal information necessary to provide travel services.</p>
      <p>This information may include:</p>
      <p>
        <strong className="text-charcoal">Personal identification information:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Full name</li>
        <li>Date of birth</li>
        <li>Gender</li>
        <li>Nationality</li>
      </ul>
      <p>
        <strong className="text-charcoal">Contact information:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Phone number</li>
        <li>Email address</li>
        <li>Residential address</li>
      </ul>
      <p>
        <strong className="text-charcoal">Travel documentation:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Passport copies</li>
        <li>Residence permit copies</li>
        <li>Visa documents</li>
        <li>Identification photos</li>
        <li>Vaccination records where required</li>
        <li>Government-issued identification</li>
      </ul>
      <p>
        <strong className="text-charcoal">Travel details:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Travel itinerary</li>
        <li>Flight information</li>
        <li>Hotel reservations</li>
        <li>Transportation bookings</li>
        <li>Pilgrimage registration information</li>
      </ul>
      <p>
        <strong className="text-charcoal">Payment information:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Payment confirmation details</li>
        <li>Transaction information</li>
        <li>Billing information</li>
        <li>Cryptocurrency wallet addresses and transaction identifiers (where applicable)</li>
      </ul>

      <h2>3. Purpose of data collection</h2>
      <p>Personal information is collected and used for the following purposes:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Processing travel bookings</li>
        <li>Coordinating reservations with airlines, hotels, and suppliers</li>
        <li>Processing pilgrimage travel registration</li>
        <li>Assisting with visa applications</li>
        <li>Communicating travel information and updates</li>
        <li>Managing customer service requests</li>
        <li>Processing payments and refunds</li>
        <li>Complying with legal or regulatory obligations</li>
      </ul>
      <p>
        The Company collects only the personal information reasonably necessary to provide
        travel services and fulfill legal or contractual obligations.
      </p>

      <h3 className="text-base font-semibold text-charcoal">
        3.1 Legal basis for processing (GDPR)
      </h3>
      <p>If the Customer is located in the European Union, personal data is processed on the following legal bases:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong className="text-charcoal">Performance of a contract</strong> – to provide
          requested travel services
        </li>
        <li>
          <strong className="text-charcoal">Legal obligations</strong> – to comply with
          applicable laws and regulations
        </li>
        <li>
          <strong className="text-charcoal">Legitimate interests</strong> – to manage bookings,
          improve services, and prevent fraud
        </li>
        <li>
          <strong className="text-charcoal">Consent</strong> – where required for specific
          processing activities such as marketing communications
        </li>
      </ul>
      <p>
        Where consent is required, Customers may withdraw consent at any time, subject to legal
        or contractual limitations.
      </p>

      <h2>4. Sharing of personal data</h2>
      <p>
        To provide travel services, personal information may be shared with third parties when
        necessary.
      </p>
      <p>
        <strong className="text-charcoal">Travel service providers:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Airlines</li>
        <li>Hotels</li>
        <li>Transportation providers</li>
        <li>Cruise companies</li>
        <li>Tour operators</li>
        <li>Charter aviation providers</li>
      </ul>
      <p>
        <strong className="text-charcoal">Government authorities:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Immigration authorities</li>
        <li>Visa issuing authorities</li>
        <li>Border control agencies</li>
        <li>
          Pilgrimage authorities including the Saudi Ministry of Hajj and Umrah
        </li>
      </ul>
      <p>
        <strong className="text-charcoal">Other service partners:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Payment processors</li>
        <li>Travel insurance providers</li>
        <li>Travel management partners</li>
      </ul>
      <p>Information will only be shared to the extent necessary to perform the requested services.</p>
      <p>
        Personal data may also be shared with service providers or partners where necessary to
        fulfill contractual obligations or comply with legal requirements.
      </p>

      <h2>5. Visa processing data</h2>
      <p>If visa assistance is provided by the Company, customers may be required to submit documentation including:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Passport copies</li>
        <li>Residence permits</li>
        <li>Identification photos</li>
        <li>Supporting travel documents</li>
      </ul>
      <p>
        These documents may be transmitted to visa authorities, embassies, or authorized visa
        processing partners.
      </p>
      <p>
        The Company has no control over the processing, decision, or storage of personal data
        once it is submitted to government authorities.
      </p>

      <h2>6. Media and marketing consent</h2>
      <p>
        During group travel or pilgrimage tours organized by Marefat Pilgrimage, photos, videos,
        or audio recordings may be taken.
      </p>
      <p>
        These recordings may include travelers participating in travel activities or group
        events.
      </p>
      <p>
        By participating in these programs, customers grant permission for TGA Tour and Travel
        LLC to use such media for:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Marketing materials</li>
        <li>Promotional campaigns</li>
        <li>Social media content</li>
        <li>Website content</li>
        <li>Advertising materials</li>
      </ul>
      <p>
        Customers who do not wish to appear in media recordings must notify the Company in
        writing before the start of the travel program. Once marketing materials have been
        published, the Company may not be able to remove previously published content.
      </p>

      <h2>7. Data security</h2>
      <p>
        TGA Tour and Travel LLC takes reasonable administrative and technical measures to
        protect personal data from unauthorized access, disclosure, or misuse.
      </p>
      <p>However, no system of data storage or transmission can be guaranteed to be completely secure.</p>

      <h2>8. Data incidents</h2>
      <p>
        In the event of a data security incident that affects personal information, TGA Tour and
        Travel LLC will take reasonable steps to investigate the incident and, where required by
        applicable law, notify affected individuals and relevant authorities.
      </p>

      <h2>9. Online data transmission</h2>
      <p>Customers acknowledge that information transmitted over the internet may not be completely secure.</p>
      <p>
        While we take reasonable steps to protect personal data, we cannot guarantee the
        absolute security of information transmitted electronically.
      </p>
      <p>Customers transmit personal data to the Company at their own risk.</p>

      <h2>10. Data retention</h2>
      <p>
        Personal data will be retained only for as long as necessary to fulfill the purposes
        outlined in this Privacy Policy, including legal, accounting, and reporting
        requirements.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Complete travel services</li>
        <li>Maintain booking records</li>
        <li>Comply with legal or regulatory obligations</li>
        <li>Resolve disputes</li>
        <li>Enforce contractual agreements</li>
      </ul>
      <p>
        Once data is no longer required, the Company will take reasonable steps to delete or
        securely store such information.
      </p>

      <h2>11. International data transfers</h2>
      <p>
        Because TGA Tour and Travel LLC operates internationally, personal information may be
        transferred to and processed in countries outside the customer&apos;s country of
        residence, including the United States and other jurisdictions where travel suppliers or
        government authorities are located.
      </p>
      <p>
        By using the Company&apos;s services, customers acknowledge and agree that their
        personal information may be transferred internationally as necessary to provide travel
        services.
      </p>
      <p>
        All such transfers will be performed in accordance with applicable legal requirements
        where relevant.
      </p>
      <p>
        Where required by law, appropriate safeguards such as contractual protections may be
        implemented for international data transfers.
      </p>
      <p>
        Where required, data transfers will rely on appropriate legal mechanisms such as
        Standard Contractual Clauses.
      </p>

      <h2>12. European Union privacy rights (GDPR)</h2>
      <p>Customers located within the European Union may have the following rights:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Right of access to personal data</li>
        <li>Right to correct inaccurate data</li>
        <li>Right to request deletion (right to be forgotten)</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
        <li>Right to object to processing</li>
        <li>Right to lodge a complaint with a supervisory authority</li>
      </ul>
      <p>Requests may be submitted to the Company for review and processing where legally applicable.</p>
      <p>
        Requests regarding personal data may be submitted using the contact information
        provided in Section 16 of this Privacy Policy.
      </p>

      <h2>13. California privacy rights (CCPA)</h2>
      <p>Residents of California may have rights under the California Consumer Privacy Act (CCPA).</p>
      <p>These rights may include:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>The right to know what personal information is collected</li>
        <li>The right to request deletion of personal information</li>
        <li>The right to request disclosure of how personal data is used</li>
        <li>
          Opt-out of the sale or sharing of personal information (where applicable)
        </li>
        <li>Not be discriminated against for exercising their privacy rights</li>
      </ul>
      <p>
        Requests may be submitted to the Company and will be processed in accordance with
        applicable laws.
      </p>
      <p>The Company does not sell personal information to third parties.</p>

      <h2>14. Third-party websites</h2>
      <p>
        The Company&apos;s website or communications may contain links to third-party websites.
      </p>
      <p>
        The Company is not responsible for the privacy practices or policies of such third-party
        websites.
      </p>
      <p>Customers are encouraged to review the privacy policies of those websites separately.</p>

      <h3 className="text-base font-semibold text-charcoal">14.1 Cookies and website data</h3>
      <p>
        The Company&apos;s website may use cookies or similar technologies to improve user
        experience, analyze website usage, and support service functionality.
      </p>
      <p>Customers may control cookie settings through their browser preferences.</p>
      <p>
        Additional details may be provided in a separate Cookie Policy where applicable. See our{" "}
        <Link href="/cookie-policy" className="text-charcoal underline underline-offset-2">
          Cookie Policy
        </Link>
        .
      </p>

      <h2>15. Policy changes</h2>
      <p>
        TGA Tour and Travel LLC reserves the right to update or modify this Privacy Policy at
        any time.
      </p>
      <p>Updated policies may be published on the Company website or provided during booking processes.</p>
      <p>Continued use of the Company&apos;s services constitutes acceptance of the updated Privacy Policy.</p>
      <p>
        Continued use of the Company&apos;s services after any updates to this Privacy Policy
        constitutes acceptance of the revised terms.
      </p>

      <h2>16. Contact information</h2>
      <p>Questions regarding this Privacy Policy or requests related to personal data may be directed to:</p>
      <p>
        <strong className="text-charcoal">TGA Tour and Travel LLC</strong>
        <br />
        Customer Service Department
        <br />
        Address: 404 NW 68th Ave, Plantation, FL 33317, USA
        <br />
        Email:{" "}
        <a
          href="mailto:info@tgatourandtravel.com"
          className="text-charcoal underline underline-offset-2"
        >
          info@tgatourandtravel.com
        </a>
        <br />
        Phone:{" "}
        <a href="tel:+19543308904" className="text-charcoal underline underline-offset-2">
          +1 (954) 330-8904
        </a>
      </p>
      <p>
        The Company will make reasonable efforts to respond to privacy-related inquiries in
        accordance with applicable privacy laws.
      </p>
    </LegalPageShell>
  );
}
