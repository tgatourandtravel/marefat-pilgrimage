"use client";

import { forwardRef } from "react";

type StepProgressProps = {
  step: number;
  steps: string[];
  /** Short labels shown on screens narrower than sm (640px). Falls back to full label if omitted. */
  shortLabels?: string[];
};

export const StepProgress = forwardRef<HTMLDivElement, StepProgressProps>(
  function StepProgress({ step, steps, shortLabels }, ref) {
    return (
      <div
        ref={ref}
        className="flex items-center justify-between rounded-2xl border border-charcoal/5 bg-ivory/90 p-6"
      >
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          const short = shortLabels?.[idx] ?? label;

          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition ${
                  isDone
                    ? "bg-charcoal text-ivory"
                    : isActive
                    ? "bg-gold text-charcoal"
                    : "bg-charcoal/5 text-charcoal/40"
                }`}
              >
                {isDone ? "✓" : stepNum}
              </div>
              {/* Short label on very small screens */}
              <span
                className={`text-[11px] sm:hidden ${
                  isActive || isDone
                    ? "font-medium text-charcoal"
                    : "text-charcoal/40"
                }`}
              >
                {short}
              </span>
              {/* Full label on sm+ */}
              <span
                className={`hidden text-xs sm:inline ${
                  isActive || isDone
                    ? "font-medium text-charcoal"
                    : "text-charcoal/50"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);
