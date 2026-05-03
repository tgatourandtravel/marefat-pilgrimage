'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="text-center space-y-4 px-6">
          <p className="text-xs uppercase tracking-widest text-charcoal/40">
            Marefat Pilgrimage
          </p>
          <h1 className="text-2xl font-semibold text-charcoal">
            Something went wrong
          </h1>
          <p className="text-sm text-charcoal/50 max-w-sm">
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={reset}
            className="mt-4 rounded-full border border-charcoal/20 px-5 py-2 text-sm font-medium text-charcoal hover:border-charcoal/40 transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
