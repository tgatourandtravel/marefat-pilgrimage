import Link from "next/link";
import { PaymentBadges } from "@/components/layout/PaymentBadges";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-charcoal/5 bg-ivory/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-xs text-charcoal/60 sm:px-8 sm:text-[13px] lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-medium text-charcoal">
              Marefat Pilgrimage
            </p>
            <p className="mt-1 max-w-md">
              Licensed religious travel agency specialized in premium
              Umrah, Hajj, and Ziyarat experiences.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-xs sm:items-end">
            <p className="font-medium text-charcoal/80">
              Direct assistance
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+19543308904"
                className="text-charcoal/80 underline-offset-2 hover:underline"
              >
                +1 (954) 330-8904
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@marefatpilgrimage.com"
                className="text-charcoal/80 underline-offset-2 hover:underline"
              >
                info@marefatpilgrimage.com
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 border-t border-charcoal/5 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <img
              src="/images/iata-accredited.png"
              alt="IATA Accredited Travel Agent"
              className="h-8 w-auto shrink-0 object-contain opacity-85 sm:h-9"
              title="IATA Accredited Travel Agent — International Air Transport Association"
            />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/60 sm:text-[11px]">
                IATA Accredited Travel Agent
              </p>
              <p className="text-xs font-medium text-charcoal sm:text-[13px]">
                International Air Transport Association
              </p>
            </div>
          </div>

          <div className="hidden h-8 w-px shrink-0 bg-charcoal/10 lg:block" />

          <PaymentBadges />
        </div>

        <div className="flex flex-col gap-4 border-t border-charcoal/5 pt-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <p>© {year} Marefat Pilgrimage. All rights reserved.</p>
          <nav
            className="flex max-w-xl flex-col gap-2 text-charcoal/70 sm:items-end"
            aria-label="Legal"
          >
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link href="/privacy" className="hover:text-charcoal hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-charcoal hover:underline">
                Terms &amp; Conditions
              </Link>
              <Link href="/refund-policy" className="hover:text-charcoal hover:underline">
                Refund Policy
              </Link>
              <Link href="/cookie-policy" className="hover:text-charcoal hover:underline">
                Cookie Policy
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link href="/legal-notice" className="hover:text-charcoal hover:underline">
                Legal Notice
              </Link>
              <Link
                href="/insurance-disclaimer"
                className="hover:text-charcoal hover:underline"
              >
                Insurance Disclaimer
              </Link>
              <Link href="/transparency" className="hover:text-charcoal hover:underline">
                Transparency
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
