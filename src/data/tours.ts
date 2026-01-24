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
export type MealsType = "Breakfast only" | "Breakfast & Dinner" | "Full Board";

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

export type Tour = {
  // Basic Info (Required)
  slug: string;
  title: string;
  destination: string;
  region: Region;
  type: TourType;
  packageLevel: PackageLevel;

  // Dates & Duration (Required)
  startDate: string; // ISO format: "2026-03-15"
  endDate: string;
  durationDays: number;

  // Pricing (Required)
  priceFrom: number; // Base price in EUR, use 0 for "On request"

  // Features (Required)
  hotelStars: 3 | 4 | 5;
  flightIncluded: boolean;
  meals: MealsType;
  transfer: boolean;
  spiritualGuide: boolean;

  // Optional features
  popularityScore?: number; // 0-100, used for sorting
  earlyBirdDiscount?: EarlyBirdDiscount;
  isFeatured?: boolean; // Show on homepage

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
};

// ============================================
// TOURS DATA - Edit below to manage tours
// ============================================

export const TOURS: Tour[] = [
  // ----------------------------------------
  // TOUR 1: Signature Ramadan Umrah (Premium)
  // ----------------------------------------
  {
    slug: "signature-ramadan-umrah",
    title: "Signature Ramadan Umrah",
    destination: "Makkah & Madinah",
    region: "Makkah/Madinah",
    type: "Umrah",
    packageLevel: "Premium",

    startDate: "2026-03-15",
    endDate: "2026-03-25",
    durationDays: 10,

    priceFrom: 3250,

    hotelStars: 5,
    flightIncluded: true,
    meals: "Breakfast & Dinner",
    transfer: true,
    spiritualGuide: true,

    popularityScore: 95,
    isFeatured: true,

    description:
      "A thoughtfully paced Ramadan Umrah with premium hotels close to the Haramain, guided rituals, and quiet time for personal worship.",

    highlights: [
      "5★ stays within a few minutes' walk to the Haramain",
      "Small, calm groups with scholar guidance in multiple languages",
      "Arrival assistance and private airport transfers available",
      "Flexible pre/post extensions in Madinah or Jeddah",
    ],

    itinerary: [
      "Arrival in Jeddah, transfer to Makkah, check‑in to hotel",
      "Umrah rites with scholar guidance and group orientation",
      "Free day for individual worship in Masjid al‑Haram",
      "Optional ziyarat around Makkah (Thawr, Hira – exterior view)",
      "Transfer to Madinah, check‑in near Masjid an‑Nabawi",
      "Guided ziyarat in Madinah; visit historical sites",
      "Free day in Madinah for prayers and reflection",
      "Return to Makkah for final days of ibadah",
      "Closing gathering and personal dua",
      "Departure and assisted airport transfers",
    ],

    hotelInfo:
      "5★ properties within a few minutes' walk to the Haramain, daily breakfast included. Late check‑out where available.",

    flightsInfo:
      "Return economy flights from major EU hubs can be arranged on request with flexible routing.",

    included: [
      "Visa processing assistance",
      "Airport transfers",
      "Daily breakfast",
      "Guided group Umrah",
      "Scholarly support in group",
    ],

    excluded: [
      "International flights (optional add‑on)",
      "Personal expenses and shopping",
      "Travel insurance",
    ],

    documentsNeeded: [
      "Passport valid for at least 6 months",
      "Passport‑sized photos",
      "Vaccination records (as per latest regulations)",
      "Completed visa application forms",
    ],

    packages: [
      {
        name: "Economy",
        price: "€2,650",
        description: "Quality 4★ hotels with shared transfers.",
      },
      {
        name: "Standard",
        price: "€3,250",
        description: "5★ hotels with small group transfers.",
      },
      {
        name: "VIP",
        price: "On request",
        description: "Suite options, private transfers, and custom dates.",
      },
    ],

    images: [
      // Add your image paths here:
      // "/images/tours/ramadan-umrah-1.jpg",
      // "/images/tours/ramadan-umrah-2.jpg",
    ],
  },

  // ----------------------------------------
  // TOUR 2: Executive Hajj Program (Premium)
  // ----------------------------------------
  {
    slug: "executive-hajj-program",
    title: "Executive Hajj Program",
    destination: "Makkah, Mina, Arafat",
    region: "Makkah/Madinah",
    type: "Hajj",
    packageLevel: "Premium",

    startDate: "2026-06-01",
    endDate: "2026-06-19",
    durationDays: 18,

    priceFrom: 0, // "On request"

    hotelStars: 5,
    flightIncluded: true,
    meals: "Full Board",
    transfer: true,
    spiritualGuide: true,

    popularityScore: 99,
    isFeatured: true,

    description:
      "Our most comprehensive Hajj program with VIP accommodations, dedicated scholar guidance, and premium services throughout the sacred journey.",

    highlights: [
      "5★ hotels in Makkah and Madinah with Haram views",
      "VIP tent accommodations in Mina with air conditioning",
      "Dedicated scholar for spiritual guidance",
      "Private transportation throughout",
      "24/7 medical support and concierge service",
    ],

    itinerary: [
      "Arrival in Madinah, VIP transfer to 5★ hotel",
      "Ziyarat in Madinah, visit to Masjid Quba and historical sites",
      "Free day for prayers at Masjid an-Nabawi",
      "Transfer to Makkah, hotel check-in",
      "Umrah and preparation sessions for Hajj",
      "Days of Hajj rituals with full support",
      "Return to Makkah hotel for rest",
      "Additional Umrah and farewell Tawaf",
      "Departure with VIP airport transfer",
    ],

    hotelInfo:
      "5★ hotels with premium rooms near the Haramain. VIP tents in Mina with all amenities.",

    flightsInfo:
      "Business class flights available upon request. Economy flights included in base package.",

    included: [
      "Hajj visa processing",
      "All accommodations",
      "All meals (Full Board)",
      "Private transportation",
      "Qurbani (sacrifice)",
      "Scholarly guidance throughout",
      "24/7 medical support",
    ],

    excluded: [
      "Personal expenses",
      "Travel insurance",
      "Optional upgrades",
    ],

    documentsNeeded: [
      "Valid passport (6+ months)",
      "Passport photos",
      "Vaccination certificate",
      "Hajj application forms",
      "Medical fitness certificate",
    ],

    packages: [
      {
        name: "Standard",
        price: "On request",
        description: "5★ hotels, shared VIP tent, group transfers.",
      },
      {
        name: "Executive",
        price: "On request",
        description: "Premium suites, private tent section, dedicated guide.",
      },
      {
        name: "Royal",
        price: "On request",
        description: "Suite with Haram view, private tent, personal concierge.",
      },
    ],

    images: [],
  },

  // ----------------------------------------
  // TOUR 3: Karbala & Najaf Retreat (Economy)
  // ----------------------------------------
  {
    slug: "karbala-najaf-retreat",
    title: "Karbala & Najaf Retreat",
    destination: "Karbala & Najaf",
    region: "Iraq",
    type: "Ziyarat",
    packageLevel: "Economy",

    startDate: "2026-02-10",
    endDate: "2026-02-17",
    durationDays: 7,

    priceFrom: 1650,

    hotelStars: 4,
    flightIncluded: false,
    meals: "Breakfast only",
    transfer: true,
    spiritualGuide: true,

    popularityScore: 80,
    isFeatured: true,

    earlyBirdDiscount: {
      discountedPrice: 1450,
      originalPrice: 1650,
      deadline: "2026-01-25",
    },

    description:
      "A spiritual journey to the sacred shrines of Imam Hussein (AS) and Imam Ali (AS) in Iraq. Experience the profound spirituality of these holy cities.",

    highlights: [
      "Visit to Imam Hussein (AS) shrine in Karbala",
      "Visit to Imam Ali (AS) shrine in Najaf",
      "Guided ziyarat to historical sites",
      "Comfortable 4★ hotel near shrines",
      "Experienced spiritual guide",
    ],

    itinerary: [
      "Arrival in Najaf, transfer to hotel, evening ziyarat at Imam Ali shrine",
      "Full day ziyarat in Najaf - Masjid Kufa, Wadi al-Salam",
      "Transfer to Karbala, hotel check-in",
      "Full day at Imam Hussein and Hazrat Abbas shrines",
      "Historical sites of Karbala",
      "Final ziyarat and personal prayers",
      "Departure transfer",
    ],

    hotelInfo:
      "4★ hotels near the holy shrines in both Najaf and Karbala. Daily breakfast included.",

    flightsInfo:
      "Flights not included. We can assist with booking flights from European cities to Najaf International Airport.",

    included: [
      "Hotel accommodation (4★)",
      "Daily breakfast",
      "All ground transportation",
      "Guided ziyarat program",
      "Visa assistance",
    ],

    excluded: [
      "International flights",
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance",
    ],

    documentsNeeded: [
      "Valid passport (6+ months)",
      "Passport photos",
      "Iraqi visa (we assist)",
    ],

    packages: [
      {
        name: "Standard",
        price: "€1,650",
        description: "4★ hotel, group transportation, guided ziyarat.",
      },
      {
        name: "Comfort",
        price: "€2,150",
        description: "5★ hotel, semi-private transfers, extra ziyarat sites.",
      },
    ],

    images: [],
  },

  // ----------------------------------------
  // TOUR 4: Mashhad Spiritual Weekend (Economy)
  // ----------------------------------------
  {
    slug: "mashhad-spiritual-weekend",
    title: "Mashhad Spiritual Weekend",
    destination: "Mashhad",
    region: "Iran",
    type: "Ziyarat",
    packageLevel: "Economy",

    startDate: "2026-01-20",
    endDate: "2026-01-24",
    durationDays: 4,

    priceFrom: 890,

    hotelStars: 4,
    flightIncluded: true,
    meals: "Breakfast only",
    transfer: true,
    spiritualGuide: false,

    popularityScore: 70,

    description:
      "A short spiritual retreat to the holy shrine of Imam Reza (AS) in Mashhad. Perfect for a meaningful weekend getaway.",

    highlights: [
      "Visit to Imam Reza (AS) shrine",
      "4★ hotel near the shrine",
      "Airport transfers included",
      "Flexible schedule for personal prayers",
    ],

    itinerary: [
      "Arrival in Mashhad, transfer to hotel",
      "Full day at Imam Reza shrine",
      "Optional city tour and bazaar visit",
      "Final ziyarat and departure",
    ],

    hotelInfo:
      "4★ hotel within walking distance of Imam Reza shrine complex.",

    flightsInfo:
      "Return flights from major European cities included.",

    included: [
      "Return flights",
      "4★ hotel accommodation",
      "Daily breakfast",
      "Airport transfers",
    ],

    excluded: [
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance",
      "Optional tours",
    ],

    documentsNeeded: [
      "Valid passport (6+ months)",
      "Passport photos",
      "Iranian visa (we assist)",
    ],

    packages: [
      {
        name: "Standard",
        price: "€890",
        description: "4★ hotel, group transfers, basic package.",
      },
      {
        name: "Comfort",
        price: "€1,290",
        description: "5★ hotel near shrine, private transfers.",
      },
    ],

    images: [],
  },

  // ----------------------------------------
  // TOUR 5: Umrah & Iraq Combination (Premium)
  // ----------------------------------------
  {
    slug: "umrah-iraq-combination",
    title: "Umrah & Iraq Ziyarat Combination",
    destination: "Makkah, Madinah, Karbala & Najaf",
    region: "Multi",
    type: "Combo",
    packageLevel: "Premium",

    startDate: "2026-04-05",
    endDate: "2026-04-19",
    durationDays: 14,

    priceFrom: 4150,

    hotelStars: 4,
    flightIncluded: true,
    meals: "Breakfast & Dinner",
    transfer: true,
    spiritualGuide: true,

    popularityScore: 92,

    description:
      "The ultimate spiritual journey combining Umrah in the holy cities of Saudi Arabia with ziyarat to the sacred shrines in Iraq.",

    highlights: [
      "Complete Umrah in Makkah and Madinah",
      "Ziyarat at shrines of Imam Ali and Imam Hussein",
      "Two countries, one spiritual journey",
      "Experienced guide throughout",
      "All flights between destinations included",
    ],

    itinerary: [
      "Arrival in Jeddah, transfer to Makkah",
      "Umrah and prayers in Masjid al-Haram",
      "Ziyarat around Makkah",
      "Transfer to Madinah",
      "Ziyarat in Madinah",
      "Flight to Najaf, Iraq",
      "Ziyarat at Imam Ali shrine",
      "Transfer to Karbala",
      "Full day at Imam Hussein shrine",
      "Historical sites visit",
      "Return flight and departure",
    ],

    hotelInfo:
      "4-5★ hotels in all destinations, selected for proximity to holy sites.",

    flightsInfo:
      "All international and domestic flights included in the package.",

    included: [
      "All flights",
      "Hotel accommodations",
      "Breakfast and dinner daily",
      "All ground transportation",
      "Visa processing",
      "Guided ziyarat",
      "Group Umrah with scholar",
    ],

    excluded: [
      "Lunch",
      "Personal expenses",
      "Travel insurance",
      "Optional activities",
    ],

    documentsNeeded: [
      "Valid passport (6+ months)",
      "Passport photos",
      "Saudi Umrah visa",
      "Iraqi visa",
      "Vaccination records",
    ],

    packages: [
      {
        name: "Standard",
        price: "€4,150",
        description: "4★ hotels, group transportation.",
      },
      {
        name: "Premium",
        price: "€5,500",
        description: "5★ hotels, semi-private transfers, extra sites.",
      },
    ],

    images: [],
  },

  // ----------------------------------------
  // TOUR 6: Off-Peak Private Umrah (Premium)
  // ----------------------------------------
  {
    slug: "off-peak-private-umrah",
    title: "Off‑Peak Private Style Umrah",
    destination: "Makkah & Madinah",
    region: "Makkah/Madinah",
    type: "Umrah",
    packageLevel: "Premium",

    startDate: "2026-11-10",
    endDate: "2026-11-18",
    durationDays: 8,

    priceFrom: 2850,

    hotelStars: 5,
    flightIncluded: false,
    meals: "Breakfast & Dinner",
    transfer: true,
    spiritualGuide: true,

    popularityScore: 88,

    description:
      "A peaceful Umrah experience during the quieter off-peak season. Enjoy less crowded conditions and more personal time at the holy sites.",

    highlights: [
      "Quieter period with fewer crowds",
      "5★ accommodation near Haram",
      "Flexible schedule for personal ibadah",
      "Private transfers available",
      "Scholar guidance throughout",
    ],

    itinerary: [
      "Arrival in Madinah, transfer to 5★ hotel",
      "Prayers at Masjid an-Nabawi, optional ziyarat",
      "Full day for personal worship in Madinah",
      "Transfer to Makkah, hotel check-in",
      "Umrah with group guidance",
      "Free day for worship and optional additional Umrah",
      "Farewell Tawaf and final prayers",
      "Departure transfer to Jeddah airport",
    ],

    hotelInfo:
      "5★ hotels within short walking distance to both Haramain.",

    flightsInfo:
      "Flights not included. We can arrange flights upon request.",

    included: [
      "5★ hotel accommodation",
      "Breakfast and dinner daily",
      "Airport transfers",
      "Ground transportation",
      "Umrah guidance",
      "Visa processing",
    ],

    excluded: [
      "International flights",
      "Lunch",
      "Personal expenses",
      "Travel insurance",
    ],

    documentsNeeded: [
      "Valid passport (6+ months)",
      "Passport photos",
      "Vaccination records",
    ],

    packages: [
      {
        name: "Standard",
        price: "€2,850",
        description: "5★ hotels, group transfers.",
      },
      {
        name: "Private",
        price: "€3,950",
        description: "Premium suites, private car and guide.",
      },
    ],

    images: [],
  },
];

// ============================================
// Helper Functions
// ============================================

/**
 * Get all tours
 */
export function getAllTours(): Tour[] {
  return TOURS;
}

/**
 * Get featured tours (for homepage)
 */
export function getFeaturedTours(): Tour[] {
  return TOURS.filter(tour => tour.isFeatured);
}

/**
 * Get tour by slug
 */
export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find(tour => tour.slug === slug);
}

/**
 * Get tours by type
 */
export function getToursByType(type: TourType): Tour[] {
  return TOURS.filter(tour => tour.type === type);
}

/**
 * Get tours by region
 */
export function getToursByRegion(region: Region): Tour[] {
  return TOURS.filter(tour => tour.region === region);
}
