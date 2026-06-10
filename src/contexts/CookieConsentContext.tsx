"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type CookieConsentChoice,
  getStoredConsent,
  setStoredConsent,
} from "@/lib/cookie-consent";

type CookieConsentContextValue = {
  consent: CookieConsentChoice | null;
  marketingAllowed: boolean;
  showBanner: boolean;
  acceptAll: () => void;
  essentialOnly: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsentChoice | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(getStoredConsent());
    setHydrated(true);
  }, []);

  const acceptAll = useCallback(() => {
    setStoredConsent("all");
    setConsent("all");
    window.dispatchEvent(new Event("cookie-consent-updated"));
  }, []);

  const essentialOnly = useCallback(() => {
    setStoredConsent("essential");
    setConsent("essential");
    window.dispatchEvent(new Event("cookie-consent-updated"));
  }, []);

  const showBanner = hydrated && consent === null;
  const marketingAllowed = consent === "all";

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        marketingAllowed,
        showBanner,
        acceptAll,
        essentialOnly,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider"
    );
  }
  return ctx;
}
