import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal";

export const metadata: Metadata = {
  title: "Legal Notice | Marefat Pilgrimage",
  description:
    "Legal notice and company information for TGA Tour and Travel LLC (DBA Marefat Pilgrimage), operator of marefatpilgrimage.com.",
};

export default function LegalNoticePage() {
  return (
    <LegalPageShell
      title="Legal Notice"
      subtitle="TGA Tour and Travel LLC — Doing Business As: Marefat Pilgrimage"
    >
      <p>
        This Legal Notice provides information about the operator of this website and the legal
        entity responsible for the services offered through{" "}
        <a
          href="https://www.marefatpilgrimage.com"
          className="text-charcoal underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.marefatpilgrimage.com
        </a>
        .
      </p>

      <h2>Company information</h2>
      <p>
        <strong className="text-charcoal">TGA Tour and Travel LLC</strong>
        <br />
        Doing Business As: Marefat Pilgrimage
        <br />
        Address: 404 NW 68th Ave, Plantation, FL 33317, United States of America
        <br />
        Phone:{" "}
        <a href="tel:+19543308904" className="text-charcoal underline underline-offset-2">
          +1 (954) 330-8904
        </a>
        <br />
        Email:{" "}
        <a
          href="mailto:info@tgatourandtravel.com"
          className="text-charcoal underline underline-offset-2"
        >
          info@tgatourandtravel.com
        </a>
      </p>

      <h3 className="text-base font-semibold text-charcoal">Legal representative</h3>
      <p>
        TGA Tour and Travel LLC is represented by its authorized managing member(s) or
        director(s).
      </p>
      <p>Represented by: Ahmad Reshad Tajik</p>

      <h2>Business registration</h2>
      <p>TGA Tour and Travel LLC is registered in the State of Florida, United States.</p>
      <p>Registration Authority: Florida Division of Corporations</p>

      <h2>Tax information</h2>
      <p>The Company does not maintain a European VAT identification number.</p>
      <p>All services are provided from the United States.</p>

      <h2>Brand and legal clarification</h2>
      <p>
        Marefat Pilgrimage is a trade name and operational brand owned and operated by TGA Tour
        and Travel LLC, a travel services company registered in the State of Florida, United
        States.
      </p>
      <p>
        Marefat Pilgrimage does not operate as a separate legal entity and does not provide
        services independently of TGA Tour and Travel LLC.
      </p>
      <p>
        All services marketed or promoted under the name Marefat Pilgrimage, including pilgrimage
        travel programs, group travel services, visa assistance, travel coordination, and related
        travel arrangements, are legally provided and administered by TGA Tour and Travel LLC.
      </p>
      <p>
        All travel bookings, contracts, invoices, confirmations, payments, and legal obligations
        associated with services offered under the Marefat Pilgrimage name are issued and handled
        by TGA Tour and Travel LLC.
      </p>
      <p>
        By requesting travel services, submitting travel documentation, or making any form of
        payment through this website or through communications related to Marefat Pilgrimage,
        customers acknowledge that they are entering into a contractual relationship with TGA Tour
        and Travel LLC.
      </p>

      <h2>Website operator</h2>
      <p>
        The website www.marefatpilgrimage.com is operated by TGA Tour and Travel LLC, a travel
        services company registered in the State of Florida, United States.
      </p>
      <p>
        The name Marefat Pilgrimage is a trade name and operational brand owned and operated by
        TGA Tour and Travel LLC and used primarily for religious pilgrimage travel services.
      </p>
      <p>
        All travel services, bookings, payments, invoices, confirmations, and contractual
        agreements related to services offered through this website are issued and managed by TGA
        Tour and Travel LLC.
      </p>
      <p>
        Travel services may also be requested or arranged through email, telephone communication,
        messaging platforms, or other communication channels operated by TGA Tour and Travel LLC.
      </p>

      <h2>Business activities</h2>
      <p>TGA Tour and Travel LLC provides travel-related services including but not limited to:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>International travel planning</li>
        <li>Airline ticket reservations</li>
        <li>Hotel reservations and accommodation arrangements</li>
        <li>Group travel organization</li>
        <li>Pilgrimage travel programs including Hajj, Umrah, and Ziyarat</li>
        <li>Travel consulting services</li>
        <li>Travel itinerary planning</li>
        <li>Transportation coordination</li>
        <li>Luxury travel arrangements</li>
        <li>Private aviation charter coordination</li>
        <li>Concierge travel services</li>
      </ul>
      <p>
        The Company acts primarily as an intermediary between customers and independent travel
        suppliers such as airlines, hotels, transportation providers, and government authorities.
      </p>
      <p>
        The Company may also arrange customized luxury travel programs, VIP travel services, and
        private aviation charter coordination through authorized third-party service providers.
      </p>
      <p>
        The Company may accept payments in various forms, including traditional payment methods and
        cryptocurrency, at its discretion.
      </p>

      <h3 className="text-base font-semibold text-charcoal">
        Independent travel service provider notice
      </h3>
      <p>
        TGA Tour and Travel LLC is an independent travel services company based in the United
        States.
      </p>
      <p>
        The Company is not affiliated with, endorsed by, or acting as an official representative
        of any foreign government authority, including but not limited to the Saudi Ministry of
        Hajj and Umrah, Iraqi pilgrimage authorities, or other governmental institutions
        responsible for religious pilgrimage administration.
      </p>
      <p>
        For pilgrimage travel programs, TGA Tour and Travel LLC acts as a travel intermediary and
        coordination service provider, assisting customers with travel planning, registration
        guidance, and travel arrangements in cooperation with authorized third-party suppliers and
        pilgrimage authorities.
      </p>
      <p>
        All official decisions regarding pilgrimage registration, quotas, permits, visas, access to
        religious sites, and pilgrimage logistics remain under the authority and control of the
        relevant government institutions and authorized operators.
      </p>
      <p>
        TGA Tour and Travel LLC does not have authority to guarantee pilgrimage approvals, visas,
        or access to religious sites. However, the Company does not guarantee the completeness,
        accuracy, or continuous availability of the information published on this website.
      </p>

      <h3 className="text-base font-semibold text-charcoal">Liability for website content</h3>
      <p>The information provided on this website is for general informational purposes only.</p>
      <p>
        TGA Tour and Travel LLC makes reasonable efforts to ensure that the information presented
        on this website is accurate and up to date.
      </p>
      <p>
        As a service provider, TGA Tour and Travel LLC is responsible for its own content on
        this website in accordance with applicable laws.
      </p>
      <p>
        However, the Company is not obligated to monitor transmitted or stored third-party
        information or to investigate circumstances indicating illegal activity.
      </p>

      <h3 className="text-base font-semibold text-charcoal">No offer and no guarantee of availability</h3>
      <p>
        The information presented on this website, including descriptions of travel services,
        destinations, itineraries, accommodations, and pricing examples, is provided for
        informational purposes only.
      </p>
      <p>
        Content published on this website does not constitute a legally binding offer to provide
        travel services.
      </p>
      <p>
        All travel services, prices, and availability are subject to confirmation by TGA Tour and
        Travel LLC and the relevant third-party travel suppliers.
      </p>
      <p>
        Availability of flights, hotels, pilgrimage registrations, transportation services, and
        other travel arrangements may change without prior notice due to operational, regulatory,
        or supplier-related factors.
      </p>
      <p>
        Travel services are only considered confirmed once the Company has issued a written
        booking confirmation or travel agreement.
      </p>
      <p>
        TGA Tour and Travel LLC reserves the right to modify, correct, update, or remove
        information published on this website at any time without prior notice.
      </p>

      <h2>External links</h2>
      <p>This website may contain links to third-party websites.</p>
      <p>
        TGA Tour and Travel LLC has no control over the content or privacy practices of such
        external websites and therefore assumes no responsibility for their content.
      </p>
      <p>The responsibility for the content of linked websites lies solely with the operators of those websites.</p>

      <h2>Intellectual property</h2>
      <p>
        All content published on this website, including text, images, graphics, logos, and
        design elements, is the property of TGA Tour and Travel LLC, unless otherwise stated.
      </p>
      <p>
        Unauthorized reproduction, distribution, or use of website content without prior written
        permission from TGA Tour and Travel LLC is prohibited.
      </p>

      <h2>Legal documents</h2>
      <p>The use of this website and the services offered through it are governed by the following legal documents:</p>
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
        <li>Pricing Guide (as provided separately)</li>
      </ul>
      <p>
        Customers are encouraged to review these documents carefully before requesting travel
        services or making any payment.
      </p>

      <h2>Business registration (summary)</h2>
      <p>
        TGA Tour and Travel LLC is a limited liability company registered in the State of Florida,
        United States.
      </p>
      <p>
        The Company operates as an independent travel services provider and travel intermediary
        arranging travel services through licensed third-party suppliers including airlines,
        hotels, transportation providers, and other travel service partners.
      </p>
      <p>
        All travel services are provided subject to the applicable{" "}
        <Link href="/terms" className="text-charcoal underline underline-offset-2">
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-charcoal underline underline-offset-2">
          Privacy Policy
        </Link>{" "}
        issued by TGA Tour and Travel LLC.
      </p>

      <h2>Corporate transparency statement</h2>
      <p>
        TGA Tour and Travel LLC is committed to conducting its business in accordance with
        applicable laws, industry standards, and ethical business practices.
      </p>
      <p>
        The Company strives to provide accurate information regarding its services, business
        identity, and legal policies to ensure transparency for customers and business partners.
      </p>
      <p>
        Customers are encouraged to review the Company&apos;s Terms and Conditions, Privacy
        Policy, and other legal documents available on this website before requesting travel
        services or making any payment.
      </p>
      <p>
        If customers have any questions regarding the Company, its services, or its legal
        policies, they are encouraged to contact the Company using the contact information
        provided in this Legal Notice.
      </p>

      <h2>Responsible for website content</h2>
      <p>Responsible for the content of this website in accordance with applicable laws:</p>
      <p>
        <strong className="text-charcoal">TGA Tour and Travel LLC</strong>
        <br />
        Customer Service Department
        <br />
        Address: 404 NW 68th Ave, Plantation, FL 33317, United States of America
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
        TGA Tour and Travel LLC is responsible for the content published on this website and makes
        reasonable efforts to ensure that the information provided is accurate, complete, and up
        to date. However, the Company does not guarantee the completeness, accuracy, or continuous
        availability of the information published on this website.
      </p>

      <h2>Online dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute resolution (ODR), which is
        available at:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr/"
          className="text-charcoal underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ec.europa.eu/consumers/odr/
        </a>
      </p>
      <p>
        TGA Tour and Travel LLC is not obligated to participate in dispute resolution proceedings
        before a consumer arbitration board.
      </p>
    </LegalPageShell>
  );
}
