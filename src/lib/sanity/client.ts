import { createClient } from 'next-sanity'

// Check if Sanity is configured
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Only create client if Sanity is configured
export const client = projectId ? createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
}) : null

// Client for server-side operations with token
export const writeClient = (projectId && process.env.SANITY_API_TOKEN) ? createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
}) : null

// Helper to check if Sanity is configured
export const isSanityConfigured = () => !!projectId
