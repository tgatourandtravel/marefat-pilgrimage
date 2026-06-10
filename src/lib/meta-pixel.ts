declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1301892158679447";

export const WHATSAPP_URL = "https://wa.me/19543308904";

/** Admin routes are excluded from Meta Pixel (no init, no PageView). */
export function isMetaPixelExcludedPath(
  pathname: string | null | undefined
): boolean {
  if (!pathname) return false;
  return pathname.startsWith("/admin");
}

function canTrack(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

export function trackMetaPageView(): void {
  if (!canTrack()) return;
  window.fbq!("track", "PageView");
}

export function trackMetaLead(params?: { content_name?: string }): void {
  if (!canTrack()) return;
  window.fbq!("track", "Lead", params ?? {});
}

export type WhatsAppContactTracking = {
  content_name: "floating_button" | "inline_link";
  content_category: string;
};

export function trackMetaContact(source: WhatsAppContactTracking): void {
  if (!canTrack()) return;
  window.fbq!("track", "Contact", source);
}
