"use client";

import { useMemo, useState } from "react";
import { TourCard } from "@/components/ui";

type Sorting = "price-asc" | "date-soonest" | "duration";

// Type for both Sanity and static tours
type Tour = {
  slug: string | { current: string };
  title: string;
  destination: string;
  region: string;
  type: string;
  packageLevel: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  priceFrom: number;
  hotelStars: 3 | 4 | 5;
  flightIncluded: boolean;
  images?: any[];
  exclusiveDisplay?: boolean;
  [key: string]: any;
};

interface ToursClientProps {
  tours: Tour[];
}

export default function ToursClient({ tours }: ToursClientProps) {
  const [destination, setDestination] = useState<string>("all");
  const [tourType, setTourType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [durationMax, setDurationMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [hotelStars, setHotelStars] = useState<string>("all");
  const [flightIncluded, setFlightIncluded] = useState<string>("all");
  const [packageLevel, setPackageLevel] = useState<string>("all");
  const [sorting, setSorting] = useState<Sorting>("date-soonest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Normalize tours data (handle both Sanity and static format)
  const normalizedTours = useMemo(() => {
    return tours.map((tour) => ({
      ...tour,
      slug: typeof tour.slug === "string" ? tour.slug : tour.slug?.current || "",
    }));
  }, [tours]);

  const filteredTours = useMemo(() => {
    let result = [...normalizedTours];

    if (destination !== "all") {
      result = result.filter((t) => t.region === destination);
    }
    if (tourType !== "all") {
      result = result.filter((t) => t.type === tourType);
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((t) => new Date(t.startDate) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      result = result.filter((t) => new Date(t.startDate) <= to);
    }
    if (durationMin) {
      const min = Number(durationMin);
      result = result.filter((t) => t.durationDays >= min);
    }
    if (durationMax) {
      const max = Number(durationMax);
      result = result.filter((t) => t.durationDays <= max);
    }
    if (priceMin) {
      const min = Number(priceMin);
      result = result.filter((t) => t.priceFrom >= min);
    }
    if (priceMax) {
      const max = Number(priceMax);
      result = result.filter((t) => t.priceFrom <= max || t.priceFrom === 0);
    }
    if (hotelStars !== "all") {
      const stars = Number(hotelStars) as 3 | 4 | 5;
      result = result.filter((t) => t.hotelStars === stars);
    }
    if (flightIncluded !== "all") {
      const value = flightIncluded === "yes";
      result = result.filter((t) => t.flightIncluded === value);
    }
    if (packageLevel !== "all") {
      result = result.filter((t) => t.packageLevel === packageLevel);
    }

    result.sort((a, b) => {
      switch (sorting) {
        case "price-asc":
          return (a.priceFrom || 999999) - (b.priceFrom || 999999);
        case "date-soonest":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        case "duration":
          return a.durationDays - b.durationDays;
        default:
          return 0;
      }
    });

    return result;
  }, [
    normalizedTours,
    dateFrom,
    dateTo,
    destination,
    durationMax,
    durationMin,
    flightIncluded,
    hotelStars,
    packageLevel,
    priceMax,
    priceMin,
    sorting,
    tourType,
  ]);

  const filtersPanel = (
    <div className="space-y-6">
      {/* Tour Type & Destination */}
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-charcoal/75">
            Tour Type
          </label>
          <select
            value={tourType}
            onChange={(e) => setTourType(e.target.value)}
            className="w-full rounded-xl border border-charcoal/10 bg-ivory px-3 py-2.5 text-xs text-charcoal transition focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
          >
            <option value="all">All Types</option>
            <option value="Hajj">Hajj</option>
            <option value="Umrah">Umrah</option>
            <option value="Ziyarat">Ziyarat</option>
            <option value="Combo">Combination</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-charcoal/75">
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-xl border border-charcoal/10 bg-ivory px-3 py-2.5 text-xs text-charcoal transition focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
          >
            <option value="all">All</option>
            <option value="Makkah/Madinah">Saudi Arabia</option>
            <option value="Iraq">Iraq</option>
            <option value="Multi">Combination</option>
          </select>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="mb-2 block text-xs font-medium text-charcoal/75">
          Price Range: ${priceMin || 0} - ${priceMax || "20,000"}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            max={20000}
            step={100}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Min"
            className="flex-1 rounded-xl border border-charcoal/10 bg-ivory px-3 py-2 text-xs text-charcoal placeholder:text-charcoal/40 transition focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
          />
          <input
            type="number"
            min={0}
            max={20000}
            step={100}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Max"
            className="flex-1 rounded-xl border border-charcoal/10 bg-ivory px-3 py-2 text-xs text-charcoal placeholder:text-charcoal/40 transition focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="mb-2 block text-xs font-medium text-charcoal/75">
          Duration: {durationMin || 1} - {durationMax || 30} days
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={30}
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            placeholder="Min"
            className="flex-1 rounded-xl border border-charcoal/10 bg-ivory px-3 py-2 text-xs text-charcoal placeholder:text-charcoal/40 transition focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
          />
          <input
            type="number"
            min={1}
            max={30}
            value={durationMax}
            onChange={(e) => setDurationMax(e.target.value)}
            placeholder="Max"
            className="flex-1 rounded-xl border border-charcoal/10 bg-ivory px-3 py-2 text-xs text-charcoal placeholder:text-charcoal/40 transition focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
          />
        </div>
      </div>

      {/* Hotel Rating */}
      <div>
        <label className="mb-2 block text-xs font-medium text-charcoal/75">
          Hotel Rating
        </label>
        <div className="flex flex-wrap gap-2">
          {[4, 5].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() =>
                setHotelStars(
                  hotelStars === stars.toString() ? "all" : stars.toString()
                )
              }
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                hotelStars === stars.toString()
                  ? "border-charcoal bg-charcoal text-ivory shadow-sm"
                  : "border-charcoal/10 bg-ivory text-charcoal/70 hover:border-charcoal/30"
              }`}
            >
              {stars}★
            </button>
          ))}
        </div>
      </div>

      {/* Package Level */}
      <div>
        <label className="mb-2 block text-xs font-medium text-charcoal/75">
          Package Type
        </label>
        <div className="flex flex-wrap gap-2">
          {(["Premium", "Economy"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() =>
                setPackageLevel(packageLevel === level ? "all" : level)
              }
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                packageLevel === level
                  ? level === "Premium"
                    ? "border-gold bg-gold/10 text-gold-dark shadow-sm"
                    : "border-charcoal bg-charcoal/10 text-charcoal shadow-sm"
                  : "border-charcoal/10 bg-ivory text-charcoal/70 hover:border-charcoal/30"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Flight Included */}
      <div>
        <label className="mb-2 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={flightIncluded === "yes"}
            onChange={(e) =>
              setFlightIncluded(e.target.checked ? "yes" : "all")
            }
            className="h-4 w-4 cursor-pointer rounded border-charcoal/20 text-gold focus:ring-2 focus:ring-gold/20"
          />
          <span className="text-xs font-medium text-charcoal/75">
            Flight Included
          </span>
        </label>
      </div>

      {/* Reset Button */}
      {(tourType !== "all" ||
        destination !== "all" ||
        priceMin ||
        priceMax ||
        durationMin ||
        durationMax ||
        hotelStars !== "all" ||
        packageLevel !== "all" ||
        flightIncluded !== "all") && (
        <button
          type="button"
          onClick={() => {
            setDestination("all");
            setTourType("all");
            setDateFrom("");
            setDateTo("");
            setDurationMin("");
            setDurationMax("");
            setPriceMin("");
            setPriceMax("");
            setHotelStars("all");
            setFlightIncluded("all");
            setPackageLevel("all");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-charcoal/10 bg-ivory px-3 py-2 text-xs font-medium text-charcoal/70 transition hover:border-charcoal/20 hover:bg-charcoal/5"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Reset Filters
        </button>
      )}
    </div>
  );

  return (
    <main className="bg-ivory">
      <section className="border-b border-charcoal/5 bg-ivory/80">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            All journeys
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-charcoal sm:text-3xl">
            Umrah, Hajj &amp; Ziyarat tours
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-charcoal/70">
            Browse a curated selection of scheduled groups and combination
            programs. For fully private arrangements, please contact our team
            directly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Mobile filter toggle */}
        <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-charcoal/15 bg-ivory px-4 py-2 text-xs font-medium text-charcoal shadow-sm shadow-charcoal/5"
          >
            {mobileFiltersOpen ? "Hide filters" : "Show filters & sorting"}
          </button>
          <select
            value={sorting}
            onChange={(e) => setSorting(e.target.value as Sorting)}
            className="h-9 rounded-full border border-charcoal/10 bg-ivory px-3 text-[11px] text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
          >
            <option value="date-soonest">Soonest departure</option>
            <option value="price-asc">Price (low to high)</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        <div className="grid gap-8 md:grid-cols-[320px_minmax(0,1fr)]">
          {/* Filters sidebar */}
          <aside className="md:sticky md:top-20 md:self-start">
            <div className="hidden rounded-2xl border border-charcoal/5 bg-ivory/90 p-4 shadow-sm shadow-charcoal/5 md:block">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                  Filters
                </p>
                <span className="text-[11px] text-charcoal/50">
                  {filteredTours.length} tours
                </span>
              </div>
              {filtersPanel}
            </div>

            {/* Animated drawer for mobile */}
            {mobileFiltersOpen && (
              <div className="md:hidden">
                <div className="fixed inset-0 z-30 bg-charcoal/20 backdrop-blur-sm" />
                <div className="fixed inset-x-0 bottom-0 z-40 max-h-[80vh] rounded-t-3xl border-t border-charcoal/10 bg-ivory p-5 shadow-soft transition-transform">
                  <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-charcoal/15" />
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                      Filters &amp; sorting
                    </p>
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(false)}
                      className="text-[11px] text-charcoal/60"
                    >
                      Close
                    </button>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-charcoal/70">
                      Sort by
                    </label>
                    <select
                      value={sorting}
                      onChange={(e) => setSorting(e.target.value as Sorting)}
                      className="mt-1 w-full rounded-full border border-charcoal/10 bg-ivory px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
                    >
                      <option value="date-soonest">Soonest departure</option>
                      <option value="price-asc">Price (low to high)</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>
                  <div className="max-h-[55vh] space-y-4 overflow-y-auto pb-3">
                    {filtersPanel}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Results */}
          <section className="md:pl-4">
            <div className="mb-4 hidden items-center justify-between md:flex">
              <p className="text-xs text-charcoal/60">
                Showing <span className="font-medium">{filteredTours.length}</span>{" "}
                curated departures
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-charcoal/60">Sort by</span>
                <select
                  value={sorting}
                  onChange={(e) => setSorting(e.target.value as Sorting)}
                  className="h-8 rounded-full border border-charcoal/10 bg-ivory px-3 text-[11px] text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
                >
                  <option value="date-soonest">Soonest departure</option>
                  <option value="price-asc">Price (low to high)</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {/* Exclusive tours — full-width, above the regular grid */}
              {filteredTours.filter((t) => t.exclusiveDisplay).map((tour) => (
                <TourCard key={tour.slug} tour={tour} />
              ))}

              {/* Regular tours — 2-column grid */}
              <div className="grid gap-6 lg:grid-cols-2">
              {filteredTours.filter((t) => !t.exclusiveDisplay).map((tour) => (
                <TourCard key={tour.slug} tour={tour} />
              ))}

              {filteredTours.filter((t) => !t.exclusiveDisplay).length === 0 &&
                filteredTours.filter((t) => t.exclusiveDisplay).length === 0 && (
                <div className="rounded-2xl border border-charcoal/5 bg-ivory/90 p-6 text-sm text-charcoal/70">
                  No tours match the selected filters. You may adjust your
                  criteria or{" "}
                  <a
                    href="/contact"
                    className="font-medium text-charcoal underline-offset-4 hover:underline"
                  >
                    contact our team
                  </a>{" "}
                  for a tailored proposal.
                </div>
              )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
