/**
 * Migration Script: Transfer existing data to Sanity
 * 
 * This script migrates:
 * - 4 Tours from src/data/tours.ts
 * - 9 Blog posts from src/app/blog/page.tsx
 * - 8 FAQs from src/app/faq/page.tsx
 * 
 * Run with: npx tsx sanity/migrations/migrate-all.ts
 */

import { writeClient } from '../../src/lib/sanity/client'
import { TOURS } from '../../src/data/tours'
import fs from 'fs'
import path from 'path'

// Blog posts data (from src/app/blog/page.tsx)
const BLOG_POSTS = [
  {
    slug: "complete-guide-first-umrah",
    title: "Complete Guide to Your First Umrah",
    category: "Umrah Tips",
    readingTime: "7 min read",
    author: "Sheikh Ahmad",
    excerpt:
      "Everything you need to know before embarking on your first Umrah journey. From spiritual preparation to practical tips.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
  },
  {
    slug: "understanding-ihram-rituals",
    title: "Understanding the Ihram: Rules and Spiritual Significance",
    category: "Ihram & Rituals",
    readingTime: "8 min read",
    author: "Ustadh Omar",
    excerpt:
      "A comprehensive guide to the state of Ihram, its requirements, and the deep spiritual meaning behind this sacred practice.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
  },
  {
    slug: "essential-packing-list-pilgrimage",
    title: "Essential Packing List for Pilgrimage",
    category: "Packing",
    readingTime: "6 min read",
    author: "Marefat Team",
    excerpt:
      "Don't forget these important items! A comprehensive packing guide for Umrah, Hajj, and Ziyarat trips.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
  },
  {
    slug: "womens-guide-pilgrimage",
    title: "Women's Guide to Pilgrimage",
    category: "Women's Guide",
    readingTime: "7 min read",
    author: "Dr. Aisha Khan",
    excerpt:
      "Special considerations, tips, and guidance for women traveling for Umrah, Hajj, and Ziyarat journeys.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
  },
  {
    slug: "visa-requirements-countries",
    title: "Visa Requirements: Saudi Arabia and Iraq",
    category: "Visa & Documents",
    readingTime: "4 min read",
    author: "Marefat Team",
    excerpt:
      "An overview of visa requirements, documentation needed, and processing timelines for pilgrimage destinations.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
  },
  {
    slug: "spiritual-journey-maximizing-pilgrimage",
    title: "The Spiritual Journey: Maximizing Your Pilgrimage",
    category: "Spiritual",
    readingTime: "9 min read",
    author: "Sheikh Ibrahim",
    excerpt:
      "Deep insights into making the most of your spiritual journey, focusing on intention, presence, and reflection.",
    image: "https://images.unsplash.com/photo-1515595968323-4964db3a2218?w=800&h=600&fit=crop",
  },
  {
    slug: "preparing-for-your-first-umrah",
    title: "Preparing for your first Umrah: a calm, practical guide",
    category: "Umrah Tips",
    readingTime: "7 min read",
    author: "Sheikh Ahmad",
    excerpt:
      "From travel documents to spiritual intentions, this short guide helps you arrive in Makkah feeling prepared and at ease.",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
  },
  {
    slug: "visa-checklist-for-pilgrims",
    title: "Visa & document checklist for pilgrims",
    category: "Visa & Documents",
    readingTime: "5 min read",
    author: "Marefat Team",
    excerpt:
      "An overview of the documents most commonly requested for Umrah, Hajj, and Ziyarat travel, in simple language.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
  },
  {
    slug: "what-to-pack-for-umrah",
    title: "What to pack for Umrah without overpacking",
    category: "Packing",
    readingTime: "6 min read",
    author: "Marefat Team",
    excerpt:
      "A minimal packing list that keeps you comfortable while avoiding unnecessary weight and clutter.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
  },
]

// FAQ data (from src/app/faq/page.tsx)
const FAQ_ITEMS = [
  {
    category: "umrah",
    question: "Are you a licensed agency for Umrah and Ziyarat tours?",
    answer:
      "Yes. Marefat Pilgrimage operates with full licensing and works exclusively with accredited partners in Saudi Arabia and Iraq. Copies of licenses can be provided on request.",
    order: 0,
  },
  {
    category: "umrah",
    question: "How large are your groups?",
    answer:
      "Most of our scheduled groups are kept intentionally small to maintain a calm atmosphere and allow space for individual questions. Private family-only programs are also available.",
    order: 1,
  },
  {
    category: "visa",
    question: "Do you assist with e‑visas and other documentation?",
    answer:
      "Yes. Our team will guide you through the visa process step‑by‑step, including required documents, photos, and any health or vaccination confirmations needed at the time of travel.",
    order: 2,
  },
  {
    category: "visa",
    question: "How early should I begin the visa process?",
    answer:
      "For most departures, we recommend starting preparations at least 6–8 weeks in advance. For peak seasons such as Ramadan and Hajj, earlier is strongly advised.",
    order: 3,
  },
  {
    category: "rituals",
    question: "Will there be guidance for rituals in my language?",
    answer:
      "Yes. Our scholars and guides provide explanations in English, Persian, and Arabic on most departures. German support can be arranged on selected programs or privately.",
    order: 4,
  },
  {
    category: "rituals",
    question: "Can you accommodate first‑time pilgrims?",
    answer:
      "Absolutely. Many of our guests are performing Umrah or Hajj for the first time. We provide gentle, step‑by‑step guidance to ensure you feel prepared and reassured.",
    order: 5,
  },
  {
    category: "practical",
    question: "Do you provide packing lists and practical guidance?",
    answer:
      "Yes. Before departure you will receive a concise packing list, climate notes, and tips for staying comfortable and healthy during the journey.",
    order: 6,
  },
  {
    category: "practical",
    question: "Can you handle special needs or mobility considerations?",
    answer:
      "Please inform us early of any medical needs or mobility limitations. We work with local partners to arrange appropriate rooms, wheelchairs, and support where possible.",
    order: 7,
  },
]

// Category mapping
const BLOG_CATEGORIES = [
  { name: "Umrah Tips", slug: "umrah-tips" },
  { name: "Ihram & Rituals", slug: "ihram-rituals" },
  { name: "Packing", slug: "packing" },
  { name: "Women's Guide", slug: "womens-guide" },
  { name: "Visa & Documents", slug: "visa-documents" },
  { name: "Spiritual", slug: "spiritual" },
]

async function uploadImageFromUrl(imageUrl: string, filename: string) {
  try {
    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()
    
    const asset = await writeClient.assets.upload('image', Buffer.from(buffer), {
      filename: filename,
    })
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`Failed to upload image ${imageUrl}:`, error)
    return null
  }
}

async function uploadLocalImage(imagePath: string) {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath)
    if (!fs.existsSync(fullPath)) {
      console.warn(`Image not found: ${fullPath}`)
      return null
    }

    const buffer = fs.readFileSync(fullPath)
    const filename = path.basename(imagePath)
    
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: filename,
    })
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
      alt: filename,
    }
  } catch (error) {
    console.error(`Failed to upload local image ${imagePath}:`, error)
    return null
  }
}

async function migrateBlogCategories() {
  console.log('\n📁 Migrating Blog Categories...')
  
  for (const category of BLOG_CATEGORIES) {
    const doc = {
      _type: 'blogCategory',
      _id: `blogCategory-${category.slug}`,
      name: category.name,
      slug: {
        _type: 'slug',
        current: category.slug,
      },
    }

    await writeClient.createOrReplace(doc)
    console.log(`  ✓ Created category: ${category.name}`)
  }
}

async function migrateBlogPosts() {
  console.log('\n📝 Migrating Blog Posts...')
  
  for (const post of BLOG_POSTS) {
    const categorySlug = post.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    const doc = {
      _type: 'blogPost',
      _id: `blogPost-${post.slug}`,
      title: post.title,
      slug: {
        _type: 'slug',
        current: post.slug,
      },
      category: {
        _type: 'reference',
        _ref: `blogCategory-${categorySlug}`,
      },
      excerpt: post.excerpt,
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: post.excerpt + '\n\n[Content to be added by admin]',
            },
          ],
        },
      ],
      author: post.author,
      readingTime: post.readingTime,
      publishedAt: new Date().toISOString(),
    }

    await writeClient.createOrReplace(doc)
    console.log(`  ✓ Created blog post: ${post.title}`)
  }
}

async function migrateFAQs() {
  console.log('\n❓ Migrating FAQs...')
  
  for (const faq of FAQ_ITEMS) {
    const doc = {
      _type: 'faq',
      _id: `faq-${faq.category}-${faq.order}`,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      isPublished: true,
    }

    await writeClient.createOrReplace(doc)
    console.log(`  ✓ Created FAQ: ${faq.question}`)
  }
}

async function migrateTours() {
  console.log('\n🕌 Migrating Tours...')
  
  for (const tour of TOURS) {
    console.log(`\n  Processing: ${tour.title}`)
    
    // Upload tour images
    let uploadedImages: any[] = []
    if (tour.images && tour.images.length > 0) {
      console.log(`    Uploading ${tour.images.length} image(s)...`)
      for (const imagePath of tour.images) {
        const image = await uploadLocalImage(imagePath)
        if (image) {
          uploadedImages.push(image)
        }
      }
    }

    const doc = {
      _type: 'tour',
      _id: `tour-${tour.slug}`,
      slug: {
        _type: 'slug',
        current: tour.slug,
      },
      title: tour.title,
      subtitle: tour.subtitle,
      destination: tour.destination,
      region: tour.region,
      type: tour.type,
      packageLevel: tour.packageLevel,
      startDate: tour.startDate,
      endDate: tour.endDate,
      durationDays: tour.durationDays,
      priceFrom: tour.priceFrom,
      hotelStars: tour.hotelStars,
      flightIncluded: tour.flightIncluded,
      meals: tour.meals,
      transfer: tour.transfer,
      spiritualGuide: tour.spiritualGuide,
      spiritualGuideName: tour.spiritualGuideName,
      popularityScore: tour.popularityScore,
      isFeatured: tour.isFeatured,
      earlyBirdDiscount: tour.earlyBirdDiscount,
      specialNotes: tour.specialNotes,
      description: tour.description,
      highlights: tour.highlights,
      itinerary: tour.itinerary,
      hotelInfo: tour.hotelInfo,
      flightsInfo: tour.flightsInfo,
      included: tour.included,
      excluded: tour.excluded,
      documentsNeeded: tour.documentsNeeded,
      packages: tour.packages,
      images: uploadedImages,
    }

    await writeClient.createOrReplace(doc)
    console.log(`  ✓ Created tour: ${tour.title}`)
  }
}

async function main() {
  console.log('🚀 Starting migration to Sanity...\n')
  console.log('================================================')
  
  try {
    // Step 1: Migrate blog categories first (they're referenced by blog posts)
    await migrateBlogCategories()
    
    // Step 2: Migrate blog posts
    await migrateBlogPosts()
    
    // Step 3: Migrate FAQs
    await migrateFAQs()
    
    // Step 4: Migrate tours (takes longer due to images)
    await migrateTours()
    
    console.log('\n================================================')
    console.log('✅ Migration completed successfully!')
    console.log('\nSummary:')
    console.log(`  - ${BLOG_CATEGORIES.length} blog categories`)
    console.log(`  - ${BLOG_POSTS.length} blog posts`)
    console.log(`  - ${FAQ_ITEMS.length} FAQs`)
    console.log(`  - ${TOURS.length} tours`)
    console.log('\n💡 Next steps:')
    console.log('  1. Run "npm run studio" to open Sanity Studio')
    console.log('  2. Verify the migrated data')
    console.log('  3. Add full blog post content')
    console.log('  4. Update images if needed')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

main()
