import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal";

export const metadata: Metadata = {
  title: "Travel Insurance Disclaimer | Marefat Pilgrimage",
  description:
    "Travel insurance disclaimer for TGA Tour and Travel LLC (DBA Marefat Pilgrimage).",
};

export default function InsuranceDisclaimerPage() {
  return (
    <LegalPageShell
      title="Travel Insurance Disclaimer"
      subtitle="TGA Tour and Travel LLC — DBA: Marefat Pilgrimage"
    >
      <h2>1. Recommendation of travel insurance</h2>
      <p>
        TGA Tour and Travel LLC strongly recommends that all travelers purchase comprehensive
        travel insurance prior to participating in any travel program or booking any travel
        services.
      </p>
      <p>
        Travel insurance is an essential component of responsible travel planning, particularly for
        international, luxury, and high-value travel arrangements.
      </p>

      <h2>2. Coverage considerations</h2>
      <p>
        Travel insurance may provide financial protection and assistance in situations including,
        but not limited to:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Trip cancellation or interruption</li>
        <li>Medical emergencies and hospitalization</li>
        <li>Emergency medical evacuation</li>
        <li>Travel delays or missed connections</li>
        <li>Lost, stolen, or delayed baggage</li>
        <li>Supplier insolvency or service disruption</li>
      </ul>
      <p>
        Travel insurance may not cover losses related to cryptocurrency payments or financial
        transactions.
      </p>

      <h2>3. Customer responsibility</h2>
      <p>The traveler is solely responsible for:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Obtaining appropriate travel insurance coverage</li>
        <li>Reviewing the terms, conditions, and exclusions of their policy</li>
        <li>Ensuring coverage is sufficient for the value and nature of their trip</li>
      </ul>
      <p>
        TGA Tour and Travel LLC does not provide advice regarding specific insurance policies
        unless explicitly agreed in writing.
      </p>
      <p>
        TGA Tour and Travel LLC does not guarantee that any travel insurance policy will provide
        coverage for specific events or losses.
      </p>

      <h2>4. No liability for uninsured losses</h2>
      <p>
        If a traveler chooses not to purchase travel insurance, they accept full responsibility for
        any financial losses, damages, or additional expenses that may arise, including but not
        limited to:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Cancellations</li>
        <li>Medical emergencies</li>
        <li>Travel disruptions</li>
        <li>Supplier failures</li>
      </ul>
      <p>
        TGA Tour and Travel LLC shall not be liable for any losses that could have been covered by
        travel insurance.
      </p>
      <p>The traveler assumes all risks associated with traveling without adequate insurance coverage.</p>

      <h2>5. High-value travel notice</h2>
      <p>
        For high-value travel arrangements, including private aviation, luxury villas, or
        customized travel programs, travel insurance is strongly recommended due to the significant
        financial commitments involved.
      </p>
      <p>
        Travelers acknowledge that such arrangements may be subject to strict supplier
        cancellation policies and limited refund eligibility.
      </p>

      <h2>6. Third-party providers</h2>
      <p>
        If travel insurance is arranged through a third-party provider, the contract is between the
        traveler and the insurance provider.
      </p>
      <p>TGA Tour and Travel LLC acts only as an intermediary (if applicable) and is not responsible for:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Policy terms</li>
        <li>Claim approvals or denials</li>
        <li>Insurance coverage disputes</li>
      </ul>

      <h2>7. Acknowledgement</h2>
      <p>By booking travel services with TGA Tour and Travel LLC, the traveler acknowledges that:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Travel insurance has been recommended</li>
        <li>They understand the risks of traveling without insurance</li>
        <li>They accept responsibility for any uninsured losses</li>
      </ul>
      <p>
        All provisions of this Travel Insurance Disclaimer apply to the fullest extent permitted by
        applicable law.
      </p>
    </LegalPageShell>
  );
}
