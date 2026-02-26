# Sanity CMS Setup for Marefat Pilgrimage

This directory contains the Sanity Studio configuration for managing tours, blog posts, and FAQs.

## 🚀 Getting Started

### 1. Create a Sanity Account

1. Go to [sanity.io](https://www.sanity.io/)
2. Sign up or log in
3. Create a new project

### 2. Get Your Project Credentials

After creating your project:

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy your **Project ID**
5. Create a new **API Token** with "Editor" permissions
6. Copy the token

### 3. Configure Environment Variables

Update your `.env` file with your Sanity credentials:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id_here"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your_api_token_here"
```

### 4. Add CORS Origins

In your Sanity project dashboard:

1. Go to **Settings** → **API** → **CORS Origins**
2. Add these origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:3333` (for Sanity Studio)
   - Your production domain (e.g., `https://marefat-pilgrimage.com`)

### 5. Initialize Sanity Dataset

Run this command to create the dataset:

```bash
npx sanity dataset create production
```

## 🎨 Running Sanity Studio

### Development Mode

To run the Sanity Studio locally:

```bash
npm run studio
```

This will start the studio at `http://localhost:3333`

### Build for Production

```bash
npm run studio:build
```

### Deploy Studio

To deploy the studio to Sanity's hosted platform:

```bash
npm run studio:deploy
```

This will give you a URL like: `https://your-project.sanity.studio`

## 📁 Project Structure

```
sanity/
├── schemas/
│   ├── index.ts           # Schema exports
│   ├── tour.ts            # Tour schema
│   ├── blogPost.ts        # Blog post schema
│   ├── blogCategory.ts    # Blog category schema
│   └── faq.ts             # FAQ schema
├── migrations/            # Data migration scripts
└── README.md             # This file

sanity.config.ts           # Sanity configuration
```

## 📝 Content Types

### Tours
Manage all tour packages with:
- Basic info (title, destination, dates)
- Pricing and early bird discounts
- Features (hotels, flights, meals)
- Detailed descriptions and itineraries
- Package options
- Image galleries

### Blog Posts
Create and manage blog content:
- Rich text content editor
- Categories
- Featured images
- SEO metadata
- Publishing dates

### FAQs
Manage frequently asked questions:
- Question and answer
- Categories (Umrah, Visa, Rituals, Practical)
- Ordering
- Publish/unpublish

## 🔄 Migrating Existing Data

We have migration scripts to import your existing tours, blog posts, and FAQs from the static files.

See `sanity/migrations/migrate-all.ts` for details.

## 🆘 Troubleshooting

### "Project ID not found" error
Make sure your `.env` file has the correct `NEXT_PUBLIC_SANITY_PROJECT_ID`

### CORS errors
Add your domain to the CORS origins in Sanity dashboard

### Authentication errors
Check that your `SANITY_API_TOKEN` is valid and has the correct permissions

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity + Next.js Guide](https://www.sanity.io/guides/nextjs)

## 🎯 Next Steps

1. Set up your Sanity project and credentials
2. Run the migration scripts to import existing data
3. Access the studio at `http://localhost:3333`
4. Start managing your content!
