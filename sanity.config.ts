import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Marefat Pilgrimage CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Tours')
              .child(S.documentTypeList('tour').title('Tours')),
            S.listItem()
              .title('Blog')
              .child(
                S.list()
                  .title('Blog Management')
                  .items([
                    S.listItem()
                      .title('Blog Posts')
                      .child(S.documentTypeList('blogPost').title('Blog Posts')),
                    S.listItem()
                      .title('Blog Categories')
                      .child(S.documentTypeList('blogCategory').title('Categories')),
                  ])
              ),
            S.listItem()
              .title('FAQ')
              .child(S.documentTypeList('faq').title('FAQs')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
