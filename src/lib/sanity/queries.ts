import { client, isSanityConfigured } from './client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Image URL builder (only if Sanity is configured)
const builder = client ? imageUrlBuilder(client) : null

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    throw new Error('Sanity is not configured')
  }
  return builder.image(source)
}

// Tour Queries
export async function getAllTours() {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  
  const query = `*[_type == "tour"] | order(popularityScore desc, startDate asc) {
    _id,
    slug,
    title,
    subtitle,
    destination,
    region,
    type,
    packageLevel,
    startDate,
    endDate,
    durationDays,
    priceFrom,
    hotelStars,
    flightIncluded,
    meals,
    transfer,
    spiritualGuide,
    spiritualGuideName,
    popularityScore,
    isFeatured,
    earlyBirdDiscount,
    specialNotes,
    images
  }`
  return client.fetch(query)
}

export async function getFeaturedTours() {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  
  const query = `*[_type == "tour" && isFeatured == true] | order(popularityScore desc) {
    _id,
    slug,
    title,
    subtitle,
    destination,
    region,
    type,
    packageLevel,
    startDate,
    endDate,
    durationDays,
    priceFrom,
    hotelStars,
    flightIncluded,
    meals,
    transfer,
    spiritualGuide,
    spiritualGuideName,
    popularityScore,
    isFeatured,
    earlyBirdDiscount,
    specialNotes,
    images
  }`
  return client.fetch(query)
}

export async function getTourBySlug(slug: string) {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  
  const query = `*[_type == "tour" && slug.current == $slug][0] {
    _id,
    slug,
    title,
    subtitle,
    destination,
    region,
    type,
    packageLevel,
    startDate,
    endDate,
    durationDays,
    priceFrom,
    hotelStars,
    flightIncluded,
    meals,
    transfer,
    spiritualGuide,
    spiritualGuideName,
    popularityScore,
    isFeatured,
    earlyBirdDiscount,
    specialNotes,
    description,
    highlights,
    itinerary,
    hotelInfo,
    flightsInfo,
    included,
    excluded,
    documentsNeeded,
    packages,
    images
  }`
  return client.fetch(query, { slug })
}

export async function getToursByType(type: string) {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  
  const query = `*[_type == "tour" && type == $type] | order(startDate asc) {
    _id,
    slug,
    title,
    destination,
    startDate,
    endDate,
    durationDays,
    priceFrom,
    images
  }`
  return client.fetch(query, { type })
}

// Blog Queries
export async function getAllBlogPosts() {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  
  const query = `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    author,
    readingTime,
    featuredImage,
    publishedAt,
    "category": category->{
      name,
      slug
    }
  }`
  return client.fetch(query)
}

export async function getBlogPostBySlug(slug: string) {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    author,
    readingTime,
    featuredImage,
    publishedAt,
    seo,
    "category": category->{
      name,
      slug
    }
  }`
  return client.fetch(query, { slug })
}

export async function getBlogPostsByCategory(categorySlug: string) {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  
  const query = `*[_type == "blogPost" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    author,
    readingTime,
    featuredImage,
    publishedAt,
    "category": category->{
      name,
      slug
    }
  }`
  return client.fetch(query, { categorySlug })
}

export async function getAllBlogCategories() {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  
  const query = `*[_type == "blogCategory"] | order(name asc) {
    _id,
    name,
    slug,
    description
  }`
  return client.fetch(query)
}

// FAQ Queries
export async function getAllFAQs() {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  
  const query = `*[_type == "faq" && isPublished == true] | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }`
  return client.fetch(query)
}

export async function getFAQsByCategory(category: string) {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  
  const query = `*[_type == "faq" && category == $category && isPublished == true] | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }`
  return client.fetch(query, { category })
}
