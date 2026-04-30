import type { Tour } from '@/data/tours';

/** Max chars per preference field (Stripe metadata + readable notes). */
const MAX_LEN = 120;
/** Avoid empty / garbage single-character entries. */
const MIN_LEN = 2;

export function resolveFlightCityFlags(
  opts?: Tour['flightCityOptions']
): { departureCity: boolean; returnCity: boolean } {
  return {
    departureCity: opts?.departureCity !== false,
    returnCity: opts?.returnCity !== false,
  };
}

function normalize(raw: string | null | undefined): string {
  return (raw ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, MAX_LEN);
}

export type ParsedFlightPrefs =
  | { ok: true; departureCity: string | null; returnCity: string | null }
  | { ok: false; message: string };

/**
 * Validates and normalizes departure/return preference text when flight assistance is requested.
 * When the tour includes flights or the guest did not tick the addon, returns null cities.
 */
export function parseFlightBookingPreferences(input: {
  tour: Pick<Tour, 'flightIncluded' | 'flightCityOptions'>;
  hasFlightBooking: boolean;
  preferredDepartureCity?: string | null;
  preferredReturnCity?: string | null;
}): ParsedFlightPrefs {
  const { tour, hasFlightBooking } = input;
  if (!hasFlightBooking || tour.flightIncluded) {
    return { ok: true, departureCity: null, returnCity: null };
  }

  const flags = resolveFlightCityFlags(tour.flightCityOptions);
  const departureCity = flags.departureCity ? normalize(input.preferredDepartureCity) : null;
  const returnCity = flags.returnCity ? normalize(input.preferredReturnCity) : null;

  if (flags.departureCity && (departureCity ?? '').length < MIN_LEN) {
    return {
      ok: false,
      message: 'Preferred departure city is required (enter at least 2 characters)',
    };
  }
  if (flags.returnCity && (returnCity ?? '').length < MIN_LEN) {
    return {
      ok: false,
      message: 'Preferred return city is required (enter at least 2 characters)',
    };
  }

  return { ok: true, departureCity, returnCity };
}
