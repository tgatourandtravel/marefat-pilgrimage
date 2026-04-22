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

  // Features (Required)
  hotelStars: 3 | 4 | 5;
  flightIncluded: boolean;
  meals: MealsType;
  transfer: boolean;
  spiritualGuide: boolean;
  spiritualGuideName?: string; // e.g., "Sayed M. Sadiq Qazwini"

  // Optional features
  popularityScore?: number; // 0-100, used for sorting
  earlyBirdDiscount?: EarlyBirdDiscount;
  isFeatured?: boolean; // Show on homepage
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
  // TOUR 2: Spring Break Combo - Umrah + Karbala 2026 (Premium)
  // ----------------------------------------
  {
    slug: "spring-break-combo-umrah-karbala-2026",
    title: "Spring Break Combo: Umrah + Karbala 2026",
    subtitle: "Two Sacred Journeys, One Unforgettable Experience",
    destination: "Makkah, Madinah, Karbala & Najaf",
    region: "Multi",
    type: "Combo",
    packageLevel: "Premium",

    startDate: "2026-03-29",
    endDate: "2026-04-12",
    durationDays: 14,

    priceFrom: 2000, // $2,000 USD (early bird)

    hotelStars: 5,
    flightIncluded: false,
    meals: "Breakfast & Dinner",
    transfer: true,
    spiritualGuide: true,
    spiritualGuideName: "Sayed Jafar Qazwini & Sayed Sadiq Qazwini",

    popularityScore: 98,
    isFeatured: true,

    earlyBirdDiscount: {
      discountedPrice: 2000, // $2,000 USD early bird
      originalPrice: 2699, // $2,699 USD regular price
      deadline: "2026-02-10",
    },

    specialNotes: {
      deadline: "2026-02-10",
      limitedSeats: true,
      customNote: "Combination of both tours with special discount. Umrah guided by Sayed Jafar Qazwini, Karbala guided by Sayed M. Sadiq Qazwini",
    },

    description:
      "Two sacred journeys. One unforgettable experience. A unique opportunity to visit the holy sites of Makkah, Madinah, and Karbala — in one complete journey. This combined package offers the best of both spiritual destinations with premium accommodations and religious guidance throughout.",

    highlights: [
      "Complete Umrah in Makkah & Madinah (Mar 29 - Apr 5)",
      "Karbala & Najaf Ziyarat (Apr 5 - Apr 12)",
      "Religious guidance: Sayed Jafar Qazwini (Umrah) & Sayed M. Sadiq Qazwini (Karbala)",
      "5★ hotels in all destinations",
      "Premium meals & VIP transfers throughout",
      "Special discount with combined package",
    ],

    itinerary: [
      "Day 1-2: Arrival in Jeddah, Umrah in Makkah (Address Jabal Omar)",
      "Day 3-4: Ziyarat around Makkah, spiritual sessions",
      "Day 5-7: Transfer to Madinah (Mövenpick Anwar al Maddinah), ziyarat at Prophet's Mosque",
      "Day 8: Flight to Najaf, Iraq, transfer to 5★ hotel (Qasr Al Dur)",
      "Day 9: Full day ziyarat at Imam Ali (AS) shrine and Masjid Kufa",
      "Day 10: Transfer to Karbala, check-in to Royal Karbala Hotel",
      "Day 11-13: Full days at Imam Hussein (AS) and Hazrat Abbas (AS) shrines",
      "Day 14: Final ziyarat, farewell gathering, departure with full support",
    ],

    hotelInfo:
      "",
      /*"5★ hotels in all destinations. Umrah: Mövenpick (Anwar al Maddinah) & Address Jabal Omar. Karbala: Royal Karbala. Najaf: Qasr Al Dur. All hotels steps from the holy sites.",*/

    flightsInfo:
      "All flights included: US to Saudi Arabia, Saudi to Iraq, Iraq to US. Seamless connections managed by Marefat Pilgrimage.",

    included: [
      "5★ hotel accommodations in all destinations",
      "Breakfast and dinner daily",
      "All VIP ground transportation",
      "Visa processing (Saudi & Iraq)",
      "Guided Umrah with Sayed Jafar Qazwini",
      "Guided Karbala ziyarat with Sayed M. Sadiq Qazwini",
      "24/7 support throughout journey",
    ],

    excluded: [
      "International flights",
      "Lunch meals",
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
        name: "Combo Early Booking",
        price: "$2,000",
        description: "Book by Feb 10 - Both tours combined with special discount.",
      },
      {
        name: "Combo Standard",
        price: "$2,699",
        description: "Complete package: Umrah + Karbala with all amenities.",
      },
    ],

    images: [
      "/images/tours/spring-break-combo-2026/combo-thumbnail-1.png",
    ],
  },

  // ----------------------------------------
  // TOUR 3: Karbala Spring Break 2026 (Premium)
  // ----------------------------------------
  {
    slug: "karbala-spring-break-2026",
    title: "Karbala 2026 - Spring Break",
    subtitle: "A Journey of the Heart",
    destination: "Karbala & Najaf",
    region: "Iraq",
    type: "Ziyarat",
    packageLevel: "Premium",

    startDate: "2026-04-05",
    endDate: "2026-04-12",
    durationDays: 7,

    priceFrom: 1099, // $1,099 USD

    hotelStars: 5,
    flightIncluded: false,
    meals: "Full Board",
    transfer: true,
    spiritualGuide: true,
    spiritualGuideName: "Sayed Sadiq Qazwini",

    popularityScore: 90,
    isFeatured: true,

    earlyBirdDiscount: {
      discountedPrice: 999, // $999 USD early bird
      originalPrice: 1099, // $1,099 USD regular price
      deadline: "2026-02-10",
    },

    specialNotes: {
      deadline: "2026-02-10",
      limitedSeats: true,
      customNote: "Under the religious guidance of Sayed M. Sadiq Qazwini",
    },

    description:
      "Karbala is not just a destination. It is a journey of the heart. This Spring Break 2026, answer the call of Karbala with a pilgrimage designed for peace, comfort, and deep spiritual focus. Every step is taken with intention, reflection, and tranquility.",

    highlights: [
      "Religious guidance by Sayed M. Sadiq Qazwini",
      "5★ hotels steps from the holy shrines",
      "Visit to Imam Hussein (AS) and Hazrat Abbas (AS) shrines",
      "Visit to Imam Ali (AS) shrine in Najaf",
      "Premium full-board meals (breakfast, lunch & dinner)",
      "Seamless VIP transportation throughout the journey",
    ],

    itinerary: [
      "Day 1: Arrival in Najaf International Airport, VIP transfer to 5★ hotel (Qasr Al Dur)",
      "Day 2: Morning ziyarat at Imam Ali (AS) shrine, spiritual guidance session",
      "Day 3: Full day ziyarat - Masjid Kufa, Wadi al-Salam, historical sites",
      "Day 4: Transfer to Karbala, check-in to 5★ Royal Karbala Hotel near shrines",
      "Day 5: Full day at Imam Hussein (AS) and Hazrat Abbas (AS) shrines",
      "Day 6: Historical sites of Karbala and personal prayers with reflection",
      "Day 7: Final ziyarat, farewell gathering, departure with full assistance",
    ],

    hotelInfo:
      "Karbala & Najaf",
      /*"5★ hotels just steps from the holy sites. Karbala: Royal Karbala. Najaf: Qasr Al Dur. Walk with ease to the shrines, day or night. Rest peacefully between prayers in luxury that elevates your spiritual journey.",*/

    flightsInfo:
      "Round-trip flights from major US cities included in the package.",

    included: [
      "5★ hotel accommodation near shrines",
      "Full board - breakfast, lunch & dinner daily",
      "All ground VIP transportation",
      "Guided ziyarat program with scholar",
      "Iraqi visa assistance",
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
        name: "Early Booking",
        price: "$999",
        description: "Book by Feb 10 - Ground package with all essentials.",
      },
      {
        name: "Standard",
        price: "$1,099",
        description: "5★ hotels, VIP transfers, guided ziyarat, full board.",
      },
    ],

    images: [
      "/images/tours/karbala-spring-break-2026/Karbala-thumbnail-1.png",
    ],
  },

  // ----------------------------------------
  // TOUR 4: Spring Break Umrah 2026 (Premium)
  // ----------------------------------------
  {
    slug: "spring-break-umrah-2026",
    title: "Umrah 2026 - Spring Break",
    subtitle: "A Carefully Designed Spiritual Journey",
    destination: "Makkah & Madinah",
    region: "Makkah/Madinah",
    type: "Umrah",
    packageLevel: "Premium",

    startDate: "2026-03-29",
    endDate: "2026-04-05",
    durationDays: 7,

    priceFrom: 1599, // $1,599 USD

    hotelStars: 5,
    flightIncluded: false,
    meals: "Breakfast & Dinner",
    transfer: true,
    spiritualGuide: true,
    spiritualGuideName: "Sayed Jafar Qazwini",

    popularityScore: 95,
    isFeatured: true,

    earlyBirdDiscount: {
      discountedPrice: 1099, // $1,099 USD early bird
      originalPrice: 1599, // $1,599 USD regular price
      deadline: "2026-02-10",
    },

    specialNotes: {
      deadline: "2026-02-10",
      limitedSeats: true,
      customNote: "Under the religious guidance of Sayed M. Sadiq Qazwini",
    },

    description:
      "This is not just a trip. It's a carefully designed spiritual journey — where comfort supports devotion, and every detail brings peace of mind. Experience the holiest sites with premium accommodations and religious guidance.",

    highlights: [
      "Religious guidance by Sayed M. Sadiq Qazwini",
      "5★ renowned hotels near the holy sites",
      "Premium full-course meals crafted fresh daily",
      "Seamless VIP city transfers in premium private vehicles",
      "Ground package with accommodation, breakfast & lunch, visa and transportation",
    ],

    itinerary: [
      "Day 1: Arrival in Jeddah, VIP transfer to Makkah 5★ hotel",
      "Day 2-3: Umrah rites with scholar guidance and spiritual preparation",
      "Day 4: Transfer to Madinah, check-in to 5★ hotel near Prophet's Mosque (Mövenpick)",
      "Day 5: Guided ziyarat in Madinah - Quba Mosque, Uhud, historical sites",
      "Day 6: Return to Makkah (Jabal Omar area) for final prayers and reflection",
      "Day 7: Farewell Tawaf and departure with full assistance",
    ],

    hotelInfo:
      "Madinah & Makkah",
      /*"5★ renowned hotels steps from the holy sites. Madinah: Mövenpick (Anwar al Maddinah). Makkah: Address Jabal Omar. Walk with ease to the Haramain, day or night.",*/

    flightsInfo:
      "Round-trip economy flights from major US cities included. Business class upgrades available upon request.",

    included: [
      "5★ accommodation near holy sites",
      "Breakfast and lunch daily",
      "Umrah visa processing",
      "VIP premium private vehicle transfers",
      "Guided Umrah with religious scholar",
      "24/7 support throughout journey",
    ],

    excluded: [
      "International flights",
      "Dinner meals",
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
        name: "Early Booking",
        price: "$1,099",
        description: "Book by Feb 10, 2026 - Ground package with all essentials.",
      },
      {
        name: "Standard",
        price: "$1,599",
        description: "5★ hotels, VIP transfers, guided Umrah, all-inclusive.",
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
