export const COOKIE_CONSENT_STORAGE_KEY = "marefat-cookie-consent";

export type CookieConsentChoice = "essential" | "all";

export function getStoredConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (value === "essential" || value === "all") return value;
  return null;
}

export function setStoredConsent(choice: CookieConsentChoice): void {
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
}

export function hasMarketingConsent(): boolean {
  return getStoredConsent() === "all";
}
