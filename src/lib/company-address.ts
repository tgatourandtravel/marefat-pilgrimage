/**
 * Physical / registered business address for TGA Tour and Travel LLC (Marefat Pilgrimage).
 * Update here to reflect across the site.
 */
export const COMPANY_ADDRESS_STREET = "515 E Las Olas Boulevard Suite 1301-K89";
export const COMPANY_ADDRESS_CITY_LINE = "Fort Lauderdale, FL 33301";

export const COMPANY_ADDRESS_LINES = [
  COMPANY_ADDRESS_STREET,
  COMPANY_ADDRESS_CITY_LINE,
  "United States",
] as const;

/** Single-line forms (Privacy Policy contact block, etc.) */
export const COMPANY_ADDRESS_USA = `${COMPANY_ADDRESS_STREET}, ${COMPANY_ADDRESS_CITY_LINE}, USA`;

export const COMPANY_ADDRESS_US_LEGAL = `${COMPANY_ADDRESS_STREET}, ${COMPANY_ADDRESS_CITY_LINE}, United States of America`;

/** For HTML email templates (insert inside a block that already allows HTML). */
export const COMPANY_ADDRESS_HTML = COMPANY_ADDRESS_LINES.join("<br />");

/** Schema.org PostalAddress — keep in sync with street/city constants above */
export const COMPANY_POSTAL_ADDRESS_JSONLD = {
  "@type": "PostalAddress" as const,
  streetAddress: COMPANY_ADDRESS_STREET,
  addressLocality: "Fort Lauderdale",
  addressRegion: "FL",
  postalCode: "33301",
  addressCountry: "US",
};
