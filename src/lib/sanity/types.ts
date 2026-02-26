// Sanity document types matching the schemas

export type TourType = 'Umrah' | 'Hajj' | 'Ziyarat' | 'Combo'
export type Region = 'Makkah/Madinah' | 'Iraq' | 'Iran' | 'Multi'
export type PackageLevel = 'Premium' | 'Economy'
export type MealsType = 'Breakfast only' | 'Breakfast & Dinner' | 'Full Board'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface EarlyBirdDiscount {
  discountedPrice: number
  originalPrice: number
  deadline: string
}

export interface SpecialNotes {
  deadline?: string
  limitedSeats?: boolean
  earlyBirdAvailable?: boolean
  customNote?: string
}

export interface TourPackage {
  name: string
  price: string
  description: string
}

export interface Tour {
  _id: string
  slug: {
    current: string
  }
  title: string
  subtitle?: string
  destination: string
  region: Region
  type: TourType
  packageLevel: PackageLevel
  startDate: string
  endDate: string
  durationDays: number
  priceFrom: number
  hotelStars: 3 | 4 | 5
  flightIncluded: boolean
  meals: MealsType
  transfer: boolean
  spiritualGuide: boolean
  spiritualGuideName?: string
  popularityScore?: number
  isFeatured?: boolean
  earlyBirdDiscount?: EarlyBirdDiscount
  specialNotes?: SpecialNotes
  description: string
  highlights: string[]
  itinerary: string[]
  hotelInfo: string
  flightsInfo: string
  included: string[]
  excluded: string[]
  documentsNeeded: string[]
  packages: TourPackage[]
  images?: SanityImage[]
}

export interface BlogCategory {
  _id: string
  name: string
  slug: {
    current: string
  }
  description?: string
}

export interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  category: BlogCategory
  excerpt: string
  content: any[] // Portable text blocks
  author: string
  readingTime: string
  featuredImage?: SanityImage
  publishedAt: string
  seo?: {
    metaDescription?: string
    metaKeywords?: string[]
  }
}

export interface FAQ {
  _id: string
  question: string
  answer: string
  category: 'umrah' | 'visa' | 'rituals' | 'practical'
  order: number
  isPublished: boolean
}
