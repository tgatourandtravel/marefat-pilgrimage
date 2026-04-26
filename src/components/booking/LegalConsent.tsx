"use client";

import Link from "next/link";
import { forwardRef, useEffect, useRef } from "react";

type LegalConsentProps = {
  accepted: boolean;
  error: boolean;
  onChange: (checked: boolean) => void;
};

export const LegalConsent = forwardRef<HTMLDivElement, LegalConsentProps>(
  function LegalConsent({ accepted, error, onChange }, ref) {
    const prevErrorRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (error && !prevErrorRef.current) {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      prevErrorRef.current = error;
    }, [error]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`rounded-2xl border p-5 transition-colors ${
          error
            ? "border-red-300 bg-red-50/60"
            : accepted
            ? "border-gold/40 bg-gold/5"
            : "border-charcoal/10 bg-ivory/80"
        }`}
      >
        <label htmlFor="legal-consent" className="flex cursor-pointer items-start gap-4">
          <div className="mt-0.5 shrink-0">
            <input
              id="legal-consent"
              type="checkbox"
              checked={accepted}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 rounded border-charcoal/30 text-charcoal accent-charcoal transition focus:ring-2 focus:ring-gold/50"
              aria-describedby="legal-consent-text"
            />
          </div>
          <div id="legal-consent-text" className="space-y-2.5">
            <p className="text-sm font-medium text-charcoal">Required confirmation</p>
            <ol className="list-decimal space-y-1 pl-5 text-xs leading-relaxed text-charcoal/75">
              <li>I understand this is a travel package booking request, not a final ticket issuance.</li>
              <li>I confirm the traveler details I entered are accurate and exactly match official documents.</li>
              <li>I have read and accept Marefat's policies and booking conditions.</li>
            </ol>
            <p className="text-xs text-charcoal/70">
              By confirming, you agree to our{" "}
              <Link className="underline decoration-charcoal/30 underline-offset-2 hover:decoration-charcoal" href="/terms">
                Terms
              </Link>
              ,{" "}
              <Link className="underline decoration-charcoal/30 underline-offset-2 hover:decoration-charcoal" href="/privacy">
                Privacy Policy
              </Link>
              ,{" "}
              <Link className="underline decoration-charcoal/30 underline-offset-2 hover:decoration-charcoal" href="/refund-policy">
                Refund Policy
              </Link>
              , and{" "}
              <Link className="underline decoration-charcoal/30 underline-offset-2 hover:decoration-charcoal" href="/cookie-policy">
                Cookie Policy
              </Link>
              .
            </p>
          </div>
        </label>
        {error && (
          <p role="alert" className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-600">
            Please read and accept the booking agreement before confirming.
          </p>
        )}
      </div>
    );
  }
);
