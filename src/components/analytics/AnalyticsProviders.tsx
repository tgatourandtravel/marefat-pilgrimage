"use client";

import type { ReactNode } from "react";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { CookieConsentBanner } from "@/components/analytics/CookieConsentBanner";
import { MetaPixel } from "@/components/analytics/MetaPixel";

export function AnalyticsProviders({ children }: { children: ReactNode }) {
  return (
    <CookieConsentProvider>
      <MetaPixel />
      {children}
      <CookieConsentBanner />
    </CookieConsentProvider>
  );
}
