"use client";

export type RoomOption = {
  type: "quad" | "triple" | "double" | "single";
  label: string;
  occupancy: string; // e.g. "4 per room"
  price: number;
  badge?: string;
};

interface RoomSelectorProps {
  options: RoomOption[];
  selected: RoomOption;
  onChange: (option: RoomOption) => void;
  /** Compact variant for the mobile sticky CTA bar */
  compact?: boolean;
}

export function RoomSelector({ options, selected, onChange, compact = false }: RoomSelectorProps) {
  if (compact) {
    return (
      <div className="flex gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {options.map((option) => {
          const isSelected = option.type === selected.type;
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => onChange(option)}
              className={`flex shrink-0 flex-col items-center rounded-lg border px-2.5 py-1.5 text-center transition ${
                isSelected
                  ? "border-gold bg-gold/10 text-charcoal"
                  : "border-charcoal/10 bg-ivory/60 text-charcoal/60 hover:border-charcoal/20 hover:text-charcoal"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide leading-tight">
                {option.label}
              </span>
              <span className={`text-xs font-bold leading-tight ${isSelected ? "text-charcoal" : "text-charcoal/50"}`}>
                ${option.price.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

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
