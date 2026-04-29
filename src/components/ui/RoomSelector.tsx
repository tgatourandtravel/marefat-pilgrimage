"use client";

import { useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { useSetFloatingHidden } from "@/contexts/StickyBarContext";

export type RoomOption = {
  type: "quad" | "triple" | "double" | "single";
  label: string;
  occupancy: string; // e.g. "4 per room"
  price: number;
  badge?: string;
};

// ─── Desktop / in-page 2×2 grid selector ────────────────────────────────────

interface RoomSelectorProps {
  options: RoomOption[];
  selected: RoomOption;
  onChange: (option: RoomOption) => void;
}

export function RoomSelector({ options, selected, onChange }: RoomSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
        Room Type
      </p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isSelected = option.type === selected.type;
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => onChange(option)}
              className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition ${
                isSelected
                  ? "border-gold bg-gold/8 ring-1 ring-gold/30"
                  : "border-charcoal/8 bg-ivory/50 hover:border-charcoal/15 hover:bg-ivory"
              }`}
            >
              {option.badge && (
                <span className="mb-1.5 inline-block rounded-full bg-gold/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gold-dark">
                  {option.badge}
                </span>
              )}
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-charcoal/70">
                {option.label}
              </span>
              <span className="text-[10px] text-charcoal/45 leading-tight">
                {option.occupancy}
              </span>
              <span className={`mt-1.5 text-base font-bold leading-none ${isSelected ? "text-charcoal" : "text-charcoal/70"}`}>
                ${option.price.toLocaleString()}
              </span>
              <span className="text-[9px] text-charcoal/40">per person</span>

              {isSelected && (
                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold">
                  <svg className="h-2.5 w-2.5 text-ivory" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mobile CTA pill trigger + bottom sheet ──────────────────────────────────

interface RoomSelectorTriggerProps {
  options: RoomOption[];
  selected: RoomOption;
  onChange: (option: RoomOption) => void;
}

export function RoomSelectorTrigger({ options, selected, onChange }: RoomSelectorTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Local pending selection — only committed on "Confirm"
  const [pending, setPending] = useState<RoomOption>(selected);
  const setFloatingHidden = useSetFloatingHidden();

  const handleOpen = () => {
    setPending(selected);
    setIsOpen(true);
    setFloatingHidden(true);
  };

  const handleConfirm = () => {
    onChange(pending);
    setIsOpen(false);
    setFloatingHidden(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFloatingHidden(false);
  };

  return (
    <>
      {/* Pill trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/8 px-3.5 py-2 text-left transition active:bg-gold/15"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/50">
          Room
        </span>
        <span className="text-sm font-semibold text-charcoal">
          {selected.label}
        </span>
        <span className="text-sm font-bold text-charcoal">
          · ${selected.price.toLocaleString()}
        </span>
        <svg
          className="ml-0.5 h-3.5 w-3.5 shrink-0 text-charcoal/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Bottom sheet */}
      <BottomSheet isOpen={isOpen} onClose={handleClose} title="Choose Your Room">
        <div className="space-y-2">
          {options.map((option) => {
            const isSelected = option.type === pending.type;
            return (
              <button
                key={option.type}
                type="button"
                onClick={() => setPending(option)}
                className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition ${
                  isSelected
                    ? "border-gold bg-gold/8"
                    : "border-charcoal/8 bg-ivory/50 hover:border-charcoal/15"
                }`}
              >
                {/* Radio indicator */}
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    isSelected ? "border-gold bg-gold" : "border-charcoal/25 bg-transparent"
                  }`}
                >
                  {isSelected && (
                    <svg className="h-2.5 w-2.5 text-ivory" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>

                {/* Label + occupancy */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-charcoal">
                      {option.label}
                    </span>
                    {option.badge && (
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gold-dark">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-charcoal/50">{option.occupancy}</span>
                </div>

                {/* Price */}
                <div className="text-right">
                  <span className={`text-base font-bold ${isSelected ? "text-charcoal" : "text-charcoal/70"}`}>
                    ${option.price.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-charcoal/40">per person</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Confirm button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="mt-4 w-full rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-ivory shadow-soft transition hover:bg-charcoal/90 active:scale-[0.98]"
        >
          Confirm — {pending.label} · ${pending.price.toLocaleString()}
        </button>
      </BottomSheet>
    </>
  );
}

// ─── Helper ─────────────────────────────────────────────────────────────────

/**
 * Converts a tour's roomPricing object into a sorted array of RoomOption.
 * Only includes defined price tiers.
 */
export function buildRoomOptions(
  roomPricing: NonNullable<import("@/data/tours").Tour["roomPricing"]>
): RoomOption[] {
  const options: RoomOption[] = [];

  if (roomPricing.quad !== undefined) {
    options.push({
      type: "quad",
      label: "Quad",
      occupancy: "4 per room",
      price: roomPricing.quad,
      badge: "Most Popular",
    });
  }
  if (roomPricing.triple !== undefined) {
    options.push({
      type: "triple",
      label: "Triple",
      occupancy: "3 per room",
      price: roomPricing.triple,
    });
  }
  if (roomPricing.double !== undefined) {
    options.push({
      type: "double",
      label: "Double",
      occupancy: "2 per room",
      price: roomPricing.double,
    });
  }
  if (roomPricing.single !== undefined) {
    options.push({
      type: "single",
      label: "Single",
      occupancy: "1 per room",
      price: roomPricing.single,
    });
  }

  return options;
}
