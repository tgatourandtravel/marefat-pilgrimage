import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Umrah & General', value: 'umrah' },
          { title: 'Visa & Documents', value: 'visa' },
          { title: 'Ihram & Rituals', value: 'rituals' },
          { title: 'Practical & Packing', value: 'practical' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Used for sorting (lower number = appears first)',
      initialValue: 0,
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      description: 'Toggle to publish/unpublish this FAQ',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
      order: 'order',
    },
    prepare(selection) {
      const { title, subtitle, order } = selection
      return {
        title: title,
        subtitle: `${subtitle} • Order: ${order}`,
      }
    },
  },

  orderings: [
    {
      title: 'Order (Low to High)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
