/** Canonical site origin for metadata, sitemap, and robots (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, '');
  return 'https://marefatpilgrimage.com';
}
