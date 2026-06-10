"use client";

import Link from "next/link";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export function CookieConsentBanner() {
  const { showBanner, acceptAll, essentialOnly } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-charcoal/10 bg-ivory/95 p-4 shadow-[0_-8px_32px_rgba(15,15,15,0.12)] backdrop-blur-sm sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p
            id="cookie-consent-title"
            className="text-sm font-semibold text-charcoal"
          >
            Cookie preferences
          </p>
          <p
            id="cookie-consent-desc"
            className="mt-1.5 text-xs leading-relaxed text-charcoal/70 sm:text-sm"
          >
            We use essential cookies for site functionality. With your permission,
            we also use marketing cookies (including Meta Pixel) to measure visits
            and improve our outreach. See our{" "}
            <Link
              href="/cookie-policy"
              className="font-medium text-charcoal underline underline-offset-2 hover:text-gold-dark"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={essentialOnly}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-charcoal/15 bg-ivory px-5 py-2.5 text-xs font-medium text-charcoal transition hover:border-charcoal/30"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-charcoal px-5 py-2.5 text-xs font-medium text-ivory shadow-soft transition hover:bg-charcoal/90"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
