import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tour',
  title: 'Tour',
  type: 'document',
  fields: [
    // Basic Information
    defineField({
      name: 'slug',
      title: 'Slug (URL identifier)',
      type: 'slug',
      description: 'Unique URL identifier for the tour',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'title',
      title: 'Tour Title',
      type: 'string',
      description: 'Main title of the tour',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (Optional)',
      type: 'string',
      description: 'Optional tagline or subtitle',
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'string',
      description: 'Destination cities (e.g., "Makkah & Madinah")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          { title: 'Makkah/Madinah', value: 'Makkah/Madinah' },
          { title: 'Iraq', value: 'Iraq' },
          { title: 'Iran', value: 'Iran' },
          { title: 'Multi', value: 'Multi' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Tour Type',
      type: 'string',
      options: {
        list: [
          { title: 'Umrah', value: 'Umrah' },
          { title: 'Hajj', value: 'Hajj' },
          { title: 'Ziyarat', value: 'Ziyarat' },
          { title: 'Combo', value: 'Combo' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'packageLevel',
      title: 'Package Level',
      type: 'string',
      options: {
        list: [
          { title: 'Premium', value: 'Premium' },
          { title: 'Economy', value: 'Economy' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // Dates & Duration
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      validation: (Rule) =>
        Rule.required().custom((endDate, context) => {
          const startDate = (context.document as any)?.startDate
          if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
            return 'End date must be after start date'
          }
          return true
        }),
    }),
    defineField({
      name: 'durationDays',
      title: 'Duration (Days)',
      type: 'number',
      validation: (Rule) => Rule.required().positive().integer(),
    }),

    // Pricing
    defineField({
      name: 'priceFrom',
      title: 'Price From (USD)',
      type: 'number',
      description: 'Base price in USD. Use 0 for "On request"',
      validation: (Rule) => Rule.required().min(0),
    }),

    // Features
    defineField({
      name: 'hotelStars',
      title: 'Hotel Stars',
      type: 'number',
      options: {
        list: [3, 4, 5],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'flightIncluded',
      title: 'Flight Included',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'meals',
      title: 'Meals',
      type: 'string',
      options: {
        list: [
          { title: 'Breakfast only', value: 'Breakfast only' },
          { title: 'Breakfast & Dinner', value: 'Breakfast & Dinner' },
          { title: 'Full Board', value: 'Full Board' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'transfer',
      title: 'Transfer Included',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'spiritualGuide',
      title: 'Spiritual Guide',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'spiritualGuideName',
      title: 'Spiritual Guide Name (Optional)',
      type: 'string',
      description: 'e.g., "Sayed M. Sadiq Qazwini"',
    }),

    // Optional Features
    defineField({
      name: 'popularityScore',
      title: 'Popularity Score (0-100)',
      type: 'number',
      description: 'Used for sorting. Higher = more popular',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured on Homepage',
      type: 'boolean',
      description: 'Show this tour on the homepage',
    }),
    defineField({
      name: 'earlyBirdDiscount',
      title: 'Early Bird Discount (Optional)',
      type: 'object',
      fields: [
        {
          name: 'discountedPrice',
          title: 'Discounted Price (USD)',
          type: 'number',
          validation: (Rule) => Rule.required().positive(),
        },
        {
          name: 'originalPrice',
          title: 'Original Price (USD)',
          type: 'number',
          validation: (Rule) => Rule.required().positive(),
        },
        {
          name: 'deadline',
          title: 'Deadline',
          type: 'date',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'specialNotes',
      title: 'Special Notes (Optional)',
      type: 'object',
      fields: [
        {
          name: 'deadline',
          title: 'Booking Deadline',
          type: 'date',
        },
        {
          name: 'limitedSeats',
          title: 'Limited Seats',
          type: 'boolean',
        },
        {
          name: 'earlyBirdAvailable',
          title: 'Early Bird Available',
          type: 'boolean',
        },
        {
          name: 'customNote',
          title: 'Custom Note',
          type: 'text',
        },
      ],
    }),

    // Detail Page Content
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Main tour description',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: '4-6 key highlights of the tour',
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'itinerary',
      title: 'Itinerary',
      type: 'array',
      of: [{ type: 'text' }],
      description: 'Day-by-day itinerary',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hotelInfo',
      title: 'Hotel Information',
      type: 'text',
      description: 'Detailed hotel information',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'flightsInfo',
      title: 'Flights Information',
      type: 'text',
      description: 'Flight details and options',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'included',
      title: 'Included',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What is included in the package',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excluded',
      title: 'Excluded',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What is NOT included',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentsNeeded',
      title: 'Documents Needed',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Required documents for the tour',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'packages',
      title: 'Package Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Package Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'price',
              title: 'Price',
              type: 'string',
              description: 'e.g., "$1,599" or "On request"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      description: '1-3 package tiers',
      validation: (Rule) => Rule.required().min(1),
    }),

    // Images
    defineField({
      name: 'images',
      title: 'Tour Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Important for SEO and accessibility',
            },
          ],
        },
      ],
      description: '1-6 images. First image will be used as hero.',
      validation: (Rule) => Rule.max(6),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'destination',
      media: 'images.0',
      price: 'priceFrom',
      type: 'type',
    },
    prepare(selection) {
      const { title, subtitle, media, price, type } = selection
      return {
        title: title,
        subtitle: `${type} • ${subtitle} • $${price}`,
        media: media,
      }
    },
  },
})
