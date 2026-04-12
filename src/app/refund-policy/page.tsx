import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal";

export const metadata: Metadata = {
  title: "Refund Policy | Marefat Pilgrimage",
  description:
    "Refund and cancellation policy for TGA Tour and Travel LLC (DBA Marefat Pilgrimage), including pilgrimage group travel.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPageShell
      title="Refund Policy"
      subtitle="TGA Tour and Travel LLC — Doing Business As: Marefat Pilgrimage"
    >
      <h2>1. General policy</h2>
      <p>
        TGA Tour and Travel LLC acts as an intermediary between customers and third-party travel
        service providers, including airlines, hotels, and other suppliers.
      </p>
      <p>
        Refunds are subject to the terms, conditions, and policies of the respective third-party
        suppliers.
      </p>
      <p>
        Refund eligibility for travel services arranged by TGA Tour and Travel LLC depends on the
        type of travel service and the policies of the relevant third-party suppliers.
      </p>
      <p>
        For pilgrimage group travel organized under Marefat Pilgrimage, the following cancellation
        policy applies:
      </p>

      <h2>2. Cancellation terms</h2>
      <div className="overflow-x-auto rounded-lg border border-charcoal/10 bg-white/40">
        <table className="w-full min-w-[280px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 bg-charcoal/[0.03]">
              <th className="px-4 py-3 font-semibold text-charcoal">Timing</th>
              <th className="px-4 py-3 font-semibold text-charcoal">Refund</th>
            </tr>
          </thead>
          <tbody className="[&_tr]:border-b [&_tr]:border-charcoal/5">
            <tr>
              <td className="px-4 py-3">More than 90 days before departure</td>
              <td className="px-4 py-3">
                80% refund of the total trip price; a $200 administrative fee may be deducted
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">60 – 89 days before departure</td>
              <td className="px-4 py-3">70% refund of the total trip price</td>
            </tr>
            <tr>
              <td className="px-4 py-3">30 – 59 days before departure</td>
              <td className="px-4 py-3">50% refund of the total trip price</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Less than 30 days before departure</td>
              <td className="px-4 py-3">No refund</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Non-refundable charges</h2>
      <p>The following charges are strictly non-refundable:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Company service fees</li>
        <li>Transaction processing fees</li>
        <li>Visa processing fees once submitted</li>
        <li>Government fees</li>
        <li>Non-refundable supplier charges</li>
      </ul>

      <h2>4. Limitation of responsibility</h2>
      <p>
        The Company is not responsible for refund decisions made by third-party suppliers and does
        not guarantee that refunds will be issued by such suppliers.
      </p>
      <p>
        No refunds will be guaranteed in cases of events beyond the Company&apos;s control,
        including but not limited to government decisions, visa denials, travel restrictions, or
        force majeure events.
      </p>

      <h2>5. Refund processing</h2>
      <p>
        Refund processing times are dependent on third-party suppliers and financial institutions
        and are not guaranteed by the Company. In certain cases refund processing may take longer
        depending on airline, supplier, or banking procedures.
      </p>
      <p>
        Refunds will only be issued to the original payment method and the original payer unless
        otherwise agreed in writing.
      </p>
      <p>
        For payments made using cryptocurrency, refunds (if applicable) will be processed at the
        Company&apos;s discretion and may be issued in fiat currency or cryptocurrency based on the
        value at the time of the refund.
      </p>
      <p>
        The Company is not responsible for any changes in cryptocurrency value between the time of
        payment and the time of refund.
      </p>

      <h2>6. Legal application</h2>
      <p>All refund terms and limitations apply to the fullest extent permitted by applicable law.</p>
    </LegalPageShell>
  );
}
