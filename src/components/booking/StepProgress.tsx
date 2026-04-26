"use client";

import { forwardRef } from "react";

type StepProgressProps = {
  step: number;
  steps: string[];
};

export const StepProgress = forwardRef<HTMLDivElement, StepProgressProps>(
  function StepProgress({ step, steps }, ref) {
    return (
      <div
        ref={ref}
        className="flex items-center justify-between rounded-2xl border border-charcoal/5 bg-ivory/90 p-6"
      >
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;

          return (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition ${
                  isDone
                    ? "bg-charcoal text-ivory"
                    : isActive
                    ? "bg-gold text-charcoal"
                    : "bg-charcoal/5 text-charcoal/40"
                }`}
              >
                {isDone ? "✓" : stepNum}
              </div>
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
