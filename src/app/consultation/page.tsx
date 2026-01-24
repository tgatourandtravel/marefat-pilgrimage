"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ConsultationPage() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="border-b border-charcoal/5 bg-ivory/90">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-charcoal/60 transition hover:text-charcoal"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>

          <h1 className="mt-6 text-2xl font-semibold text-charcoal sm:text-3xl">
            Book a Consultation
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-charcoal/70">
            Schedule a free 30-minute consultation with our team. We&apos;ll discuss
            your pilgrimage goals, answer your questions, and help you find the
            perfect tour package.
          </p>

          {/* Benefits */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-ivory px-3 py-1.5 text-xs text-charcoal/70">
              <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free consultation
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-ivory px-3 py-1.5 text-xs text-charcoal/70">
              <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No obligation
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-ivory px-3 py-1.5 text-xs text-charcoal/70">
              <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Personalized advice
            </span>
          </div>
        </div>
      </section>

      {/* Calendly Widget */}
      <section className="mx-auto max-w-4xl px-6 py-8 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-charcoal/5 bg-white p-4 shadow-sm">
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/marefatpilgrimage-info/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=1a1a1a"
            style={{ minWidth: "320px", height: "700px" }}
          />
        </div>
      </section>

      {/* Additional Info */}
      <section className="mx-auto max-w-4xl px-6 pb-16 sm:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-charcoal/5 bg-ivory/90 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <svg className="h-5 w-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-charcoal">Choose Your Time</h3>
            <p className="mt-2 text-xs text-charcoal/70">
              Select a convenient time slot that works for your schedule.
            </p>
          </div>

          <div className="rounded-2xl border border-charcoal/5 bg-ivory/90 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <svg className="h-5 w-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-charcoal">We&apos;ll Call You</h3>
            <p className="mt-2 text-xs text-charcoal/70">
              Our team will contact you at the scheduled time via phone or video call.
            </p>
          </div>

          <div className="rounded-2xl border border-charcoal/5 bg-ivory/90 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <svg className="h-5 w-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-charcoal">Get Your Plan</h3>
            <p className="mt-2 text-xs text-charcoal/70">
              Receive personalized recommendations and next steps for your journey.
            </p>
          </div>
        </div>

        {/* Contact Alternative */}
        <div className="mt-8 rounded-2xl border border-charcoal/5 bg-ivory/90 p-6 text-center">
          <p className="text-sm text-charcoal/70">
            Prefer to reach us directly?
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/4917647aborede"
              className="inline-flex items-center gap-2 text-sm font-medium text-charcoal transition hover:text-gold"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <span className="text-charcoal/30">|</span>
            <a
              href="mailto:info@marefatpilgrimage.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-charcoal transition hover:text-gold"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
