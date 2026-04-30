"use client";

import React, { forwardRef, useEffect, useRef } from "react";

type LegalConsentProps = {
  accepted: boolean;
  error: boolean;
  onChange: (checked: boolean) => void;
};

export const LegalConsent = forwardRef<HTMLDivElement, LegalConsentProps>(
  function LegalConsent({ accepted, error, onChange }, ref) {
    const prevErrorRef = useRef(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (error && !prevErrorRef.current) {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      prevErrorRef.current = error;
    }, [error]);

    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    return (
      <div
        ref={setRefs}
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
            <p className="text-sm font-semibold uppercase tracking-wide text-charcoal">
              Booking Agreement & Legal Consent
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-xs leading-relaxed text-charcoal/75">
              <li>I confirm that all information provided in this booking is accurate and complete.</li>
              <li>
                I have read, understood, and agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-charcoal underline decoration-charcoal/30 underline-offset-2 hover:decoration-gold hover:text-gold"
                >
                  Terms & Conditions
                </a>
                ,{" "}
                <a
                  href="/refund-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-charcoal underline decoration-charcoal/30 underline-offset-2 hover:decoration-gold hover:text-gold"
                >
                  Refund Policy
                </a>
                , and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-charcoal underline decoration-charcoal/30 underline-offset-2 hover:decoration-gold hover:text-gold"
                >
                  Privacy Policy
                </a>{" "}
                of TGA Tour and Travel LLC (Marefat Pilgrimage).
              </li>
              <li>
                I acknowledge that certain travel services are provided by independent third-party
                suppliers and are subject to their own terms and conditions, including cancellation
                and refund policies.
              </li>
              <li>I understand that all payments are subject to the Company's payment and refund terms.</li>
            </ol>
            <p className="text-xs text-charcoal/70">
              By confirming this booking, I enter into a legally binding agreement with TGA Tour and
              Travel LLC and agree to all applicable policies and conditions.
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
