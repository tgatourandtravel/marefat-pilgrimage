"use client";

type FormErrorBannerProps = {
  message: string | null;
  onDismiss?: () => void;
};

export function FormErrorBanner({ message, onDismiss }: FormErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-xl border border-danger-light bg-danger-light/20 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-danger">{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs font-medium text-danger/80 transition hover:text-danger"
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
