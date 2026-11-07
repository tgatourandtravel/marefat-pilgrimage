/**
 * Billing address for the booker (person paying for the booking).
 * Tours are sold to and depart from North America, so only US and Canadian
 * addresses are accepted (Street / Apt / City / State or Province / ZIP or Postal Code).
 */

export type BillingCountry = "US" | "CA";

export type BillingAddress = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: BillingCountry;
};

export const EMPTY_BILLING_ADDRESS: BillingAddress = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

export const US_STATES: ReadonlyArray<{ code: string; name: string }> = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "AS", name: "American Samoa" },
  { code: "GU", name: "Guam" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "PR", name: "Puerto Rico" },
  { code: "VI", name: "U.S. Virgin Islands" },
];

export const CA_PROVINCES: ReadonlyArray<{ code: string; name: string }> = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

const COUNTRY_NAMES: Record<BillingCountry, string> = {
  US: "United States",
  CA: "Canada",
};

export const COUNTRY_OPTIONS: ReadonlyArray<{ value: BillingCountry; label: string }> = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
];

export function getRegionOptions(country: BillingCountry): ReadonlyArray<{ code: string; name: string }> {
  return country === "CA" ? CA_PROVINCES : US_STATES;
}

export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code as BillingCountry] ?? code;
}

function isBillingCountry(value: string): value is BillingCountry {
  return value === "US" || value === "CA";
}

/** Canadian postal codes: "A1A 1A1" (letters D, F, I, O, Q, U are never used). */
const CA_POSTAL_REGEX = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] \d[ABCEGHJ-NPRSTV-Z]\d$/;

function formatCaPostalCode(value: string): string {
  const compact = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6);
  return compact.length > 3 ? `${compact.slice(0, 3)} ${compact.slice(3)}` : compact;
}

/** Light input masking while the user types. */
export function maskPostalCodeInput(country: BillingCountry, value: string): string {
  if (country === "CA") return formatCaPostalCode(value);
  return value.replace(/[^\d-]/g, "").slice(0, 10);
}

export function isCanadianAddress(address: Pick<BillingAddress, "country">): boolean {
  return address.country === "CA";
}

export function normalizeBillingAddress(input: Partial<BillingAddress> | null | undefined): BillingAddress {
  const clean = (v: unknown) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");
  const rawCountry = clean(input?.country).toUpperCase();
  const country = (rawCountry || "US") as BillingCountry;
  const postal = clean(input?.postalCode).toUpperCase();
  return {
    line1: clean(input?.line1),
    line2: clean(input?.line2),
    city: clean(input?.city),
    state: clean(input?.state).toUpperCase(),
    postalCode: country === "CA" ? formatCaPostalCode(postal) : postal,
    country,
  };
}

export function validateBillingAddress(input: Partial<BillingAddress> | null | undefined): Record<string, string> {
  const a = normalizeBillingAddress(input);
  const errors: Record<string, string> = {};

  if (!isBillingCountry(a.country)) {
    errors.country = "Please select United States or Canada";
    return errors;
  }
  const isCanada = a.country === "CA";

  if (!a.line1) {
    errors.line1 = "Street address is required";
  } else if (a.line1.length < 3 || a.line1.length > 100) {
    errors.line1 = "Please enter a valid street address";
  }

  if (a.line2.length > 100) {
    errors.line2 = "Apartment, suite or unit is too long";
  }

  if (!a.city) {
    errors.city = "City is required";
  } else if (a.city.length < 2 || a.city.length > 60) {
    errors.city = "Please enter a valid city";
  }

  const regionCodes = getRegionOptions(a.country).map((r) => r.code);
  if (!a.state) {
    errors.state = isCanada ? "Please select your province" : "Please select your state";
  } else if (!regionCodes.includes(a.state)) {
    errors.state = isCanada ? "Please select a valid province" : "Please select a valid state";
  }

  if (isCanada) {
    if (!a.postalCode) {
      errors.postalCode = "Postal code is required";
    } else if (!CA_POSTAL_REGEX.test(a.postalCode)) {
      errors.postalCode = "Please enter a valid postal code (e.g. M5V 2T6)";
    }
  } else if (!a.postalCode) {
    errors.postalCode = "ZIP code is required";
  } else if (!/^\d{5}(-\d{4})?$/.test(a.postalCode)) {
    errors.postalCode = "Please enter a 5-digit ZIP code (e.g. 33101)";
  }

  return errors;
}

/**
 * North American mailing format:
 *   123 Main St, Apt 4B
 *   Miami, FL 33101
 *   United States
 */
export function formatBillingAddressLines(input: Partial<BillingAddress> | null | undefined): string[] {
  const a = normalizeBillingAddress(input);
  if (!a.line1 && !a.city) return [];
  const street = [a.line1, a.line2].filter(Boolean).join(", ");
  const statePostal = [a.state, a.postalCode].filter(Boolean).join(" ");
  const cityLine = [a.city, statePostal].filter(Boolean).join(", ");
  return [street, cityLine, getCountryName(a.country)].filter(Boolean);
}

/** Maps database columns (nullable for bookings created before this field existed). */
export function billingAddressFromBooking(booking: {
  billing_address_line1?: string | null;
  billing_address_line2?: string | null;
  billing_city?: string | null;
  billing_state?: string | null;
  billing_postal_code?: string | null;
  billing_country?: string | null;
}): BillingAddress | null {
  if (!booking.billing_address_line1) return null;
  return normalizeBillingAddress({
    line1: booking.billing_address_line1 ?? "",
    line2: booking.billing_address_line2 ?? "",
    city: booking.billing_city ?? "",
    state: booking.billing_state ?? "",
    postalCode: booking.billing_postal_code ?? "",
    country: (booking.billing_country ?? "US") as BillingCountry,
  });
}

export function billingAddressToColumns(address: BillingAddress) {
  return {
    billing_address_line1: address.line1,
    billing_address_line2: address.line2 || null,
    billing_city: address.city,
    billing_state: address.state || null,
    billing_postal_code: address.postalCode || null,
    billing_country: address.country,
  };
}
