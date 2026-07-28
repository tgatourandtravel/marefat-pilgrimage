/**
 * Tours Data - Edit this file to manage all tours
 *
 * This file contains all tour information for the website.
 * To add a new tour, copy an existing tour object and modify it.
 * To remove a tour, delete its entire object from the array.
 *
 * Image paths should be placed in /public/images/tours/
 * Example: "/images/tours/ramadan-umrah-1.jpg"
 */

// Types for tour data
export type TourType = "Umrah" | "Hajj" | "Ziyarat" | "Combo";
export type Region = "Makkah/Madinah" | "Iraq" | "Iran" | "Multi";
export type PackageLevel = "Premium" | "Economy";
export type MealsType = "Breakfast only" | "Dinner" | "Breakfast & Dinner" | "Full Board";

export type TourPackage = {
  name: string;
  price: string;
  description: string;
};

export type EarlyBirdDiscount = {
  discountedPrice: number;
  originalPrice: number;
  deadline: string; // ISO date format: "2026-02-10"
};

export type SpecialNotes = {
  deadline?: string; // ISO date format: "2026-01-27"
  limitedSeats?: boolean;
  earlyBirdAvailable?: boolean;
  customNote?: string;
};

export type Tour = {
  // Basic Info (Required)
  slug: string;
  title: string;
  subtitle?: string; // Optional subtitle like "Elevate Your Spiritual Journey"
  destination: string;
  region: Region;
  type: TourType;
  packageLevel: PackageLevel;

  // Dates & Duration (Required)
  startDate: string; // ISO format: "2026-03-15"
  endDate: string;
  durationDays: number;

  // Pricing (Required)
  priceFrom: number; // Base price in USD, use 0 for "On request"

  // Room-type pricing — optional. When set, a RoomSelector is shown on the tour detail page.
  // priceFrom should equal roomPricing.quad (the base/default occupancy).
  roomPricing?: {
    quad: number;    // 4-person room — default occupancy
    triple?: number; // 3-person room
    double?: number; // 2-person room
    single?: number; // 1-person room
  };

  // Features (Required)
  hotelStars: 3 | 4 | 5;
  flightIncluded: boolean;
  meals: MealsType;
  transfer: boolean;
  spiritualGuide: boolean;
  spiritualGuideName?: string; // e.g., "Sayed M. Sadiq Qazwini"

  // Flight city preference fields shown when "Flight booking request" is checked.
  // Both fields are enabled by default (when the key is absent or true).
  // Set a field to false to hide it for tours where it is not applicable.
  flightCityOptions?: {
    departureCity?: boolean; // default: true
    returnCity?: boolean;    // default: true
  };

  // Optional features
  popularityScore?: number; // 0-100, used for sorting
  earlyBirdDiscount?: EarlyBirdDiscount;
  isFeatured?: boolean; // Show on homepage
  isArchived?: boolean; // If true, hidden from all listings. Keep data for reuse.
  specialNotes?: SpecialNotes; // Special notes, deadlines, limited seats

  // Detail Page Content (Required for detail page)
  description: string;
  highlights: string[];
  itinerary: string[];
  hotelInfo: string;
  flightsInfo: string;
  included: string[];
  excluded: string[];
  documentsNeeded: string[];
  packages: TourPackage[];

  // Images (paths relative to /public)
  images?: string[];

  // Exclusive display mode — title-only card + custom detail layout
  exclusiveDisplay?: boolean;
  exclusiveServices?: {
    heading: string;
    intro?: string;
    freeNote?: string;
    sections: {
      title: string;
      items: string[];
    }[];
  };
};

// ============================================
// TOURS DATA - Only 4 Real Tours
// ============================================

export const TOURS: Tour[] = [
  // ----------------------------------------
  // TOUR 1: Hajj 2027/1448 (Economy) - MOST IMPORTANT
  // ----------------------------------------
  {
    slug: "hajj-2027-1448",
    title: "Hajj 2027/1448",
    subtitle: "Elevate Your Spiritual Journey",
    destination: "Makkah, Madinah, Mina & Arafat",
    region: "Makkah/Madinah",
    type: "Hajj",
    packageLevel: "Economy",

    startDate: "2027-05-07",
    endDate: "2027-05-20",
    durationDays: 14,

    priceFrom: 12000, // $12,000 USD

    hotelStars: 5,
    flightIncluded: true,
    meals: "Full Board",
    transfer: true,
    spiritualGuide: true,
    spiritualGuideName: "Sayed Jafar Qazwini & Sayed M. Sadiq Qazwini",

    popularityScore: 99,
    isFeatured: true,

    specialNotes: {
      deadline: "2027-01-27",
      limitedSeats: true,
      customNote: "Under the religious guidance of Sayed Jafar Qazwini & Sayed M. Sadiq Qazwini",
    },

    description:
      "The journey of a lifetime awaits. Join Marefat Pilgrimage for a spiritually enriching Hajj experience under the religious guidance of Sayed Jafar Qazwini and Sayed M. Sadiq Qazwini. Every detail has been curated to ensure your peace of mind, allowing you to focus solely on your connection with Allah (SWT).",

    highlights: [
      "Religious guidance by Sayed Jafar Qazwini & Sayed M. Sadiq Qazwini",
      "5★ Pullman Zamzam Hotel in Madinah (3 nights)",
      "5★ Marriott Jabal Omar in Makkah (10 nights)",
      "Haramain High-Speed Train transport",
      "VIP Mina tents with full meals and services",
      "All flights and visa processing included",
    ],

    itinerary: [
      "Day 1-3: Arrival in Madinah, check-in to Pullman Zamzam Hotel, ziyarat at Masjid an-Nabawi",
      "Day 4: Haramain High-Speed Train transfer to Makkah, check-in to Marriott Jabal Omar",
      "Day 5-6: Umrah and Hajj preparation sessions with scholars",
      "Day 7-9: Hajj rituals - Tarwiyah, Arafat, Muzdalifah, Mina",
      "Day 10-11: Days of Tashreeq in Mina with full support",
      "Day 12-13: Return to Makkah hotel, Tawaf al-Wida, final prayers",
      "Day 14: Departure with full support and assistance",
    ],

    hotelInfo:
      "Madinah & Makkah",
      /*"5★ Pullman Zamzam Hotel in Madinah (3 nights) and 5★ Marriott Jabal Omar in Makkah (10 nights). Both hotels are within close proximity to the holy sites.",*/

    flightsInfo:
      "Round-trip flights from major US cities included in the package. Business class upgrades available upon request.",

    included: [
      "Hajj visa processing",
      "Round-trip flights from US",
      "5★ accommodation (Pullman Zamzam & Marriott Jabal Omar)",
      "All meals (breakfast, lunch, dinner)",
      "Haramain High-Speed Train transport",
      "Mina tents with full services",
      "Scholarly guidance throughout",
      "Qurbani (sacrifice)",
      "24/7 support",
    ],

    excluded: [
      "Personal expenses",
      "Travel insurance (recommended)",
      "Optional upgrades",
    ],

    documentsNeeded: [
      "Valid passport (6+ months from travel date)",
      "Passport photos (2x2 inches)",
      "Vaccination certificate",
      "Hajj application forms (we assist)",
      "Medical fitness certificate",
    ],

    packages: [
      {
        name: "Standard",
        price: "$12,000",
        description: "5★ hotels, shared tent, group guidance, all-inclusive.",
      },
      {
        name: "Executive",
        price: "On request",
        description: "Premium rooms, semi-private tent, enhanced services.",
      },
      {
        name: "Royal",
        price: "On request",
        description: "Suite with Haram view, private tent section, VIP services.",
      },
    ],

    images: [
      "/images/tours/hajj-2026/hajj-thumbnail-3.png",
    ],

    exclusiveDisplay: true,
    exclusiveServices: {
      heading: "Exclusive Hajj Services",
      intro: "All stages of the Hajj process are conducted through Nusuk. We support you as your guide — assisting you before your journey with every step of the registration process, and accompanying you throughout the trip as your dedicated guide.",
      freeNote: "Our service is completely free of charge, and you are under no obligation or commitment to us.",
      sections: [
        {
          title: "Before Your Journey",
          items: [
            "Personalized one-on-one consultation prior to registration",
            "Priority assistance with your 2027 Hajj quota application",
            "Expert guidance in selecting a premium, tailored package",
            "Access to exclusive packages accompanied by our elite guides",
            "Smooth, end-to-end booking experience with dedicated support",
          ],
        },
        {
          title: "During & After Booking",
          items: [
            "Private seminar on Hajj rituals and rulings in accordance with Shia Islam",
            "Full-service (companionship) throughout your sacred journey in Saudi Arabia",
            "Continuous, high-touch support from arrival to departure",
          ],
        },
      ],
    },
  },

  // ----------------------------------------
  // TOUR 2: Umrah & Iraq December 2026 — Combo (Premium)
  // ----------------------------------------
  {
    slug: "spring-break-combo-umrah-karbala-2026",
    title: "Umrah & Iraq December 2026",
    subtitle: "Two Sacred Journeys, One Unforgettable Experience",
    destination: "Makkah, Madinah, Karbala & Najaf",
    region: "Multi",
    type: "Combo",
    packageLevel: "Premium",

    startDate: "2026-12-20",
    endDate: "2027-01-03",
    durationDays: 14,

    priceFrom: 2699, // $2,699 USD

    hotelStars: 5,
    flightIncluded: false,
    meals: "Breakfast & Dinner",
    transfer: true,
    spiritualGuide: true,
    spiritualGuideName: "Sheikh Mustafa Akhound & Sayed M. Sadiq Qazwini",

    popularityScore: 98,
    isFeatured: true,
    isArchived: false,

    specialNotes: {
      limitedSeats: true,
      customNote: "Combination of Iraq & Umrah. Under the guidance of Sheikh Mustafa Akhound & Sayed M. Sadiq Qazwini",
    },

    description:
      "Two sacred journeys. One unforgettable experience. A unique opportunity to visit the holy shrines of Karbala and Najaf in Iraq, followed by the holy sites of Makkah and Madinah — all in one complete December journey. This combined package offers the best of both spiritual destinations with premium accommodations and religious guidance throughout.",

    highlights: [
      "Iraq ziyarat: Karbala & Najaf (Dec 20–27)",
      "Umrah in Makkah & Madinah (Dec 27–Jan 3)",
      "Religious guidance by Sheikh Mustafa Akhound & Sayed M. Sadiq Qazwini",
      "5★ hotels in all four destinations",
      "All meals, VIP transfers and visas included",
      "Ground package — no flight included",
    ],

    itinerary: [
      "Day 1 (Dec 20): Arrival in Najaf, VIP transfer to 5★ Qasur al Dur Hotel",
      "Day 2 (Dec 21): Ziyarat at Imam Ali (AS) shrine, spiritual guidance session",
      "Day 3 (Dec 22): Full day — Masjid Kufa, Wadi al-Salam, historical sites of Najaf",
      "Day 4 (Dec 23): Transfer to Karbala, check-in to 5★ Royal Karbala Hotel",
      "Day 5 (Dec 24): Full day at Imam Hussein (AS) and Hazrat Abbas (AS) shrines",
      "Day 6 (Dec 25): Historical sites of Karbala and personal prayers",
      "Day 7 (Dec 26): Final ziyarat in Karbala, preparation for departure to Saudi Arabia",
      "Day 8 (Dec 27): Travel to Saudi Arabia, arrival in Jeddah, transfer to Makkah",
      "Day 9 (Dec 28): Umrah rites with scholar guidance and spiritual preparation",
      "Day 10 (Dec 29): Ziyarat around Makkah, spiritual sessions",
      "Day 11 (Dec 30): Transfer to Madinah by train, check-in to Dar al Iman Intercontinental",
      "Day 12 (Dec 31): Guided ziyarat in Madinah — Quba Mosque, Uhud, historical sites",
      "Day 13 (Jan 1): Spiritual program and free worship time at Prophet's Mosque",
      "Day 14 (Jan 2): Continued ziyarat and personal worship",
      "Day 15 (Jan 3): Departure with full assistance",
    ],

    hotelInfo:
      "Makkah's Hotel: Address Jabal Omar or Similar\nMadinah's Hotel: Dar al Iman Intercontinental\nNajaf's Hotel: Qasur al Dur\nKarbala's Hotel: Royal Karbala",

    flightsInfo:
      "Ground package only — international flights not included.",

    included: [
      "5★ hotel accommodations in all four destinations",
      "All meals throughout the journey",
      "All VIP ground transportation",
      "Visa processing (Saudi & Iraq)",
      "Guided Umrah with Sheikh Mustafa Akhound & Sayed M. Sadiq Qazwini",
      "Guided Iraq ziyarat with Sayed M. Sadiq Qazwini",
      "24/7 support throughout journey",
    ],

    excluded: [
      "International flights",
      "Personal expenses",
      "Travel insurance (recommended)",
      "Optional activities and upgrades",
    ],

    documentsNeeded: [
      "Valid passport (6+ months)",
      "Passport photos (2x2 inches)",
      "Residence permit",
    ],

    packages: [
      {
        name: "Combo Package",
        price: "$2,699",
        description: "Complete Iraq + Umrah ground package with 5★ hotels, all meals, visas and transportation.",
      },
    ],

    images: [
      "/images/tours/spring-break-combo-2026/combo-thumbnail-1.png",
      "/images/tours/spring-break-combo-2026/combo-dec-2026-banner.png",
    ],
  },

  // ----------------------------------------
  // TOUR 3: Iraq — Karbala December 2026 (Premium)
  // ----------------------------------------
  {
    slug: "karbala-spring-break-2026",
    title: "Iraq — Karbala December 2026",
    subtitle: "A Journey of the Heart",
    destination: "Karbala & Najaf",
    region: "Iraq",
    type: "Ziyarat",
    packageLevel: "Premium",

    startDate: "2026-12-20",
    endDate: "2026-12-27",
    durationDays: 7,

    priceFrom: 1199, // $1,199 USD

    hotelStars: 5,
    flightIncluded: false,
    meals: "Full Board",
    transfer: true,
    spiritualGuide: true,
    spiritualGuideName: "Sayed M. Sadiq Qazwini",

    popularityScore: 90,
    isFeatured: true,
    isArchived: false,

    specialNotes: {
      limitedSeats: true,
      customNote: "Under the religious guidance of Sayed M. Sadiq Qazwini",
    },

    description:
      "Karbala is not just a destination. It is a journey of the heart. This December 2026, answer the call of Karbala with a pilgrimage designed for peace, comfort, and deep spiritual focus. Every step is taken with intention, reflection, and tranquility.",

    highlights: [
      "Religious guidance by Sayed M. Sadiq Qazwini",
      "5★ hotels steps from the holy shrines",
      "Visit to Imam Hussein (AS) and Hazrat Abbas (AS) shrines",
      "Visit to Imam Ali (AS) shrine in Najaf",
      "Premium full-board meals (breakfast, lunch & dinner)",
      "Seamless VIP transportation throughout Iraq",
    ],

    itinerary: [
      "Day 1 (Dec 20): Arrival in Najaf International Airport, VIP transfer to 5★ Qasur al Dur Hotel",
      "Day 2 (Dec 21): Morning ziyarat at Imam Ali (AS) shrine, spiritual guidance session",
      "Day 3 (Dec 22): Full day ziyarat — Masjid Kufa, Wadi al-Salam, historical sites",
      "Day 4 (Dec 23): Transfer to Karbala, check-in to 5★ Royal Karbala Hotel near shrines",
      "Day 5 (Dec 24): Full day at Imam Hussein (AS) and Hazrat Abbas (AS) shrines",
      "Day 6 (Dec 25): Historical sites of Karbala and personal prayers with reflection",
      "Day 7 (Dec 26): Final ziyarat, farewell gathering",
      "Day 8 (Dec 27): Departure with full assistance",
    ],

    hotelInfo:
      "Najaf's Hotel: Qasur al Dur\nKarbala's Hotel: Royal Karbala",

    flightsInfo:
      "Ground package only — international flights not included.",

    included: [
      "5★ hotel accommodation near shrines",
      "Full board — breakfast, lunch & dinner daily",
      "All ground VIP transportation within Iraq",
      "Iraqi visa assistance",
      "Guided ziyarat program with Sayed M. Sadiq Qazwini",
      "24/7 support throughout journey",
    ],

    excluded: [
      "International flights",
      "Personal expenses",
      "Travel insurance (recommended)",
      "Optional activities and upgrades",
    ],

    documentsNeeded: [
      "Valid passport (6+ months)",
      "Passport photos (2x2 inches)",
      "Residence permit",
    ],

    packages: [
      {
        name: "Standard",
        price: "$1,199",
        description: "5★ hotels, VIP transfers, guided ziyarat, full board. No flight included.",
      },
    ],

    images: [
      "/images/tours/karbala-spring-break-2026/Karbala-thumbnail-1.png",
      "/images/tours/karbala-spring-break-2026/iraq-dec-2026-banner.png",
    ],
  },

  // ----------------------------------------
  // TOUR 4: Umrah December 2026 (Premium)
  // ----------------------------------------
  {
    slug: "umrah-2026-thanksgiving",
    title: "Umrah December 2026",
    subtitle: "A Carefully Designed Spiritual Journey",
    destination: "Makkah & Madinah",
    region: "Makkah/Madinah",
    type: "Umrah",
    packageLevel: "Premium",

    startDate: "2026-12-27",
    endDate: "2027-01-03",
    durationDays: 7,

    priceFrom: 1599, // $1,599 USD — Ground Package

    hotelStars: 5,
    flightIncluded: false,
    meals: "Breakfast & Dinner",
    transfer: true,
    spiritualGuide: true,
    spiritualGuideName: "Sheikh Mustafa Akhound & Sayed M. Sadiq Qazwini",

    popularityScore: 95,
    isFeatured: true,

    specialNotes: {
      limitedSeats: true,
      customNote: "Under the guidance of Sheikh Mustafa Akhound & Sayed M. Sadiq Qazwini",
    },

    description:
      "This is not just a trip. It's a carefully designed spiritual journey — where comfort supports devotion, and every detail brings peace of mind. Experience the holiest sites in Makkah and Madinah with premium accommodations and religious guidance throughout.",

    highlights: [
      "Religious guidance by Sheikh Mustafa Akhound & Sayed M. Sadiq Qazwini",
      "5★ renowned hotels near the holy sites",
      "Breakfast & dinner daily",
      "Transportation within Saudi Arabia by train",
      "Ground package with accommodation, visa and transportation",
    ],

    itinerary: [
      "Day 1 (Dec 27): Arrival in Jeddah, VIP transfer to Makkah 5★ hotel (Address Jabal Omar or Similar)",
      "Day 2 (Dec 28): Umrah rites with scholar guidance and spiritual preparation",
      "Day 3 (Dec 29): Ziyarat around Makkah, spiritual sessions",
      "Day 4 (Dec 30): Transfer to Madinah by train, check-in to Dar al Iman Intercontinental",
      "Day 5 (Dec 31): Guided ziyarat in Madinah — Quba Mosque, Uhud, historical sites",
      "Day 6 (Jan 1): Spiritual program and free worship time at Prophet's Mosque",
      "Day 7 (Jan 2): Continued ziyarat and personal worship",
      "Day 8 (Jan 3): Departure with full assistance",
    ],

    hotelInfo:
      "Makkah's Hotel: Address Jabal Omar or Similar\nMadinah's Hotel: Dar al Iman Intercontinental",

    flightsInfo:
      "Ground package only — international flights not included.",

    included: [
      "5★ accommodation near holy sites",
      "Breakfast and dinner daily",
      "Umrah visa processing",
      "Transportation within Saudi Arabia by train",
      "Guided Umrah with Sheikh Mustafa Akhound & Sayed M. Sadiq Qazwini",
      "24/7 support throughout journey",
    ],

    excluded: [
      "International flights",
      "Lunch meals",
      "Personal expenses",
      "Travel insurance (recommended)",
      "Optional site visits and upgrades",
    ],

    documentsNeeded: [
      "Valid passport (6+ months)",
      "Passport photos (2x2 inches)",
      "Residence permit",
    ],

    packages: [
      {
        name: "Standard",
        price: "$1,599",
        description: "5★ hotels, train transfers, guided Umrah, breakfast & dinner. No flight included.",
      },
    ],

    images: [
      "/images/tours/spring-break-umrah-2026/umrah-thumbnail-1.png",
      "/images/tours/spring-break-umrah-2026/umrah-dec-2026-banner.png",
      "/images/tours/spring-break-umrah-2026/umrah-thumbnail-2.jpg",
      "/images/tours/spring-break-umrah-2026/umrah-thumbnail-3.jpg",
    ],
  },
  // ----------------------------------------
  // TOUR 5: Internal Payment Test (Hidden)
  // ----------------------------------------
  {
    slug: "internal-payment-test-1usd",
    title: "TEST - Internal Payment Verification",
    subtitle: "Hidden low-value tour for real payment checks",
    destination: "Internal QA Flow",
    region: "Multi",
    type: "Umrah",
    packageLevel: "Economy",

    startDate: "2026-11-25",
    endDate: "2026-11-26",
    durationDays: 2,

    // Deposit is floor(priceFrom * 0.3) => floor(4 * 0.3) = 1 USD
    priceFrom: 4,

    roomPricing: {
      quad: 4,
    },

    hotelStars: 3,
    flightIncluded: false,
    meals: "Breakfast only",
    transfer: false,
    spiritualGuide: false,

    popularityScore: 1,
    isFeatured: false,
    // Hidden from public listings, available only via direct URL/slug for controlled tests.
    isArchived: true,

    description:
      "Internal test-only tour for payment workflow validation. Do not use for public bookings.",

    highlights: [
      "Internal QA scenario for payment flow",
      "Low-value real-charge verification",
      "Credit/debit surcharge behavior validation",
    ],

    itinerary: [
      "Step 1: Create booking in internal test flow",
      "Step 2: Complete card payment and verify webhook updates",
      "Step 3: Validate admin dashboard and PDF output",
    ],

    hotelInfo: "N/A (internal test package)",
    flightsInfo: "No flights included",

    included: [
      "Internal payment workflow validation only",
    ],

    excluded: [
      "All travel services",
      "All accommodation services",
      "All support services outside QA",
    ],

    documentsNeeded: [
      "No travel documents required (internal QA only)",
    ],

    packages: [
      {
        name: "Internal QA",
        price: "$4",
        description: "Low-value package for payment pipeline testing only.",
      },
    ],

    images: [
      "/images/tours/spring-break-umrah-2026/umrah-thumbnail-1.png",
    ],
  },
];

// ============================================
// Helper Functions
// ============================================
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toUtcMidnightFromIsoDate(isoDate: string): number | null {
  const [yearStr, monthStr, dayStr] = isoDate.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  return Date.UTC(year, month - 1, day);
}

function getDurationDaysFromDates(startDate: string, endDate: string): number | null {
  const startUtc = toUtcMidnightFromIsoDate(startDate);
  const endUtc = toUtcMidnightFromIsoDate(endDate);
  if (startUtc === null || endUtc === null) {
    return null;
  }

  const diffDays = Math.round((endUtc - startUtc) / MS_PER_DAY);
  if (diffDays < 1) {
    return 1;
  }
  return diffDays;
}

function withComputedDuration(tour: Tour): Tour {
  const computed = getDurationDaysFromDates(tour.startDate, tour.endDate);
  if (computed === null) {
    return tour;
  }
  return {
    ...tour,
    durationDays: computed,
  };
}

/**
 * Get all active (non-archived) tours
 */
export function getAllTours(): Tour[] {
  return TOURS.filter(tour => !tour.isArchived).map(withComputedDuration);
}

/**
 * Get featured tours (for homepage) — excludes archived
 */
export function getFeaturedTours(): Tour[] {
  return TOURS.filter(tour => tour.isFeatured && !tour.isArchived).map(withComputedDuration);
}

/**
 * Get archived tours — for reuse or reference
 */
export function getArchivedTours(): Tour[] {
  return TOURS.filter(tour => tour.isArchived).map(withComputedDuration);
}

/**
 * Get tour by slug
 */
export function getTourBySlug(slug: string): Tour | undefined {
  const tour = TOURS.find(tour => tour.slug === slug);
  return tour ? withComputedDuration(tour) : undefined;
}

/**
 * Get tours by type
 */
export function getToursByType(type: TourType): Tour[] {
  return TOURS.filter(tour => tour.type === type).map(withComputedDuration);
}

/**
 * Get tours by region
 */
export function getToursByRegion(region: Region): Tour[] {
  return TOURS.filter(tour => tour.region === region).map(withComputedDuration);
}
