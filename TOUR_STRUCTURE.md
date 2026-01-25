# Standard Tour Structure Guide

This document describes the standardized structure for all tours in the Marefat Pilgrimage website.

## Tour Data Location
- **File:** `src/data/tours.ts`
- **Images:** `/public/images/tours/[tour-slug]/`

## Standard Tour Object Structure

```typescript
{
  // ========================================
  // BASIC INFO (Required)
  // ========================================
  slug: "tour-name-year",               // Unique URL identifier
  title: "Tour Name 2026",              // Main title
  subtitle?: "Optional Tagline",        // Optional subtitle/tagline
  destination: "City Names",            // Destination cities
  region: "Makkah/Madinah" | "Iraq" | "Iran" | "Multi",
  type: "Umrah" | "Hajj" | "Ziyarat" | "Combo",
  packageLevel: "Premium" | "Economy",

  // ========================================
  // DATES & DURATION (Required)
  // ========================================
  startDate: "2026-03-15",              // ISO format YYYY-MM-DD
  endDate: "2026-03-25",                // ISO format YYYY-MM-DD
  durationDays: 10,                     // Number of days

  // ========================================
  // PRICING (Required)
  // ========================================
  priceFrom: 2950,                      // Base price in EUR (use 0 for "On request")

  // ========================================
  // FEATURES (Required)
  // ========================================
  hotelStars: 5,                        // 3, 4, or 5
  flightIncluded: true,                 // boolean
  meals: "Breakfast & Dinner",          // "Breakfast only" | "Breakfast & Dinner" | "Full Board"
  transfer: true,                       // boolean
  spiritualGuide: true,                 // boolean

  // ========================================
  // OPTIONAL FEATURES
  // ========================================
  popularityScore: 95,                  // 0-100 (used for sorting)
  isFeatured: true,                     // Show on homepage
  
  // Early bird discount (optional)
  earlyBirdDiscount?: {
    discountedPrice: 1029,              // Discounted price in EUR
    originalPrice: 1499,                // Original price in EUR
    deadline: "2026-02-10",             // ISO date
  },
  
  // Special notes (optional)
  specialNotes?: {
    deadline: "2026-01-27",             // Booking deadline
    limitedSeats: true,                 // Show "Limited seats" badge
    earlyBirdAvailable: false,          // Show early bird badge
    customNote: "Custom message",       // Custom note to display
  },

  // ========================================
  // DETAIL PAGE CONTENT (Required)
  // ========================================
  description: "Main tour description...",

  highlights: [
    "Highlight point 1",
    "Highlight point 2",
    "Highlight point 3",
    // 4-6 highlights recommended
  ],

  itinerary: [
    "Day 1: Activity description",
    "Day 2-3: Activity description",
    "Day 4: Activity description",
    // One entry per day or day range
  ],

  hotelInfo: "Detailed hotel information...",
  
  flightsInfo: "Flight details and options...",

  included: [
    "Item 1",
    "Item 2",
    "Item 3",
    // All included services
  ],

  excluded: [
    "Item 1",
    "Item 2",
    // All excluded items
  ],

  documentsNeeded: [
    "Valid passport (6+ months)",
    "Passport photos",
    "Vaccination certificate",
    // All required documents
  ],

  packages: [
    {
      name: "Standard",
      price: "$1,599" | "€1,499" | "On request",
      description: "Package features...",
    },
    {
      name: "Premium",
      price: "$2,299",
      description: "Premium features...",
    },
    // 1-3 package options
  ],

  // ========================================
  // IMAGES (Optional but recommended)
  // ========================================
  images: [
    "/images/tours/tour-slug/01-hero.png",
    "/images/tours/tour-slug/02-detail.png",
    "/images/tours/tour-slug/03-hotel.png",
    // 1-6 images maximum
  ],
}
```

## Image Guidelines

### Directory Structure
```
/public/images/tours/
  ├── tour-slug-2026/
  │   ├── 01-hero.png          (Main hero image)
  │   ├── 02-detail.png        (Detail/pricing image)
  │   ├── 03-guide.png         (Guide image)
  │   ├── 04-transport.png     (Transport image)
  │   ├── 05-hotel.png         (Hotel image)
  │   └── 06-meals.png         (Meals/amenities image)
```

### Naming Convention
- Use numbered prefixes: `01-`, `02-`, etc.
- Use descriptive names: `hero`, `detail`, `guide`, `transport`, `hotel`, `meals`
- Supported formats: `.png`, `.jpg`, `.jpeg`, `.webp`

### Image Recommendations
- **Minimum:** 1 image (hero)
- **Maximum:** 6 images
- **Aspect Ratio:** 16:9 recommended for hero
- **Size:** Optimize images for web (< 500KB each)

## Adding a New Tour

### Step 1: Prepare Images
1. Create directory: `/public/images/tours/your-tour-slug/`
2. Add 1-6 images with proper naming

### Step 2: Copy Template
Copy an existing tour object from `tours.ts` as a template

### Step 3: Update All Fields
Fill in all required fields following the structure above

### Step 4: Update Image Paths
```typescript
images: [
  "/images/tours/your-tour-slug/01-hero.png",
  "/images/tours/your-tour-slug/02-detail.png",
  // Add 1-6 images
],
```

### Step 5: Test
```bash
npm run build
```

## Field Validation

### Required Fields (Must be filled)
- slug, title, destination, region, type, packageLevel
- startDate, endDate, durationDays
- priceFrom
- hotelStars, flightIncluded, meals, transfer, spiritualGuide
- description, highlights, itinerary, hotelInfo, flightsInfo
- included, excluded, documentsNeeded, packages

### Optional Fields
- subtitle
- popularityScore
- earlyBirdDiscount
- isFeatured
- specialNotes
- images

## Best Practices

1. **Consistency:** Keep the same field order across all tours
2. **Clarity:** Use clear, descriptive text for all fields
3. **Accuracy:** Double-check dates, prices, and details
4. **Images:** Always add at least a hero image
5. **Highlights:** Keep to 4-6 key points
6. **Packages:** Offer 2-3 package tiers when possible
7. **Deadlines:** Use specialNotes.deadline for booking deadlines
8. **Early Bird:** Use earlyBirdDiscount for promotional pricing

## Examples in Codebase

Reference tours in `tours.ts`:
- `hajj-2026-1447` - Complete example with all fields
- `spring-break-umrah-2026` - Example with early bird discount
- `umrah-iraq-combination-premium-2026` - Example combo tour

## Image Gallery Features

When images are provided:
- Main image display with 16:9 aspect ratio
- Thumbnail navigation (max 6 images)
- Active thumbnail highlighting
- Instagram CTA at bottom
- Fully responsive design
- Smooth transitions

---

**Last Updated:** January 2026
**Maintained By:** Marefat Pilgrimage Development Team
