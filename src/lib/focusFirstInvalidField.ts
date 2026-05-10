/**
 * After failed form validation, focus the first invalid control and bring it into view.
 * Relies on aria-invalid="true" (used by Input, Select, Textarea, PhoneInput).
 */
export function focusFirstInvalidField(root: HTMLElement | null | undefined): void {
  if (!root || typeof window === "undefined") return;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const selector =
        'input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"]';
      const el = root.querySelector<HTMLElement>(selector);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      if (typeof (el as HTMLInputElement).focus === "function") {
        (el as HTMLInputElement).focus({ preventScroll: true });
      }
    });
  });
}
