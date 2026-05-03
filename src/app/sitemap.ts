import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "./blog/data";
import { getSiteUrl } from "@/lib/site";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getAllTours } from "@/lib/sanity/queries";
import { getAllTours as getStaticTours } from "@/data/tours";

export const revalidate = 3600;

async function getTourSlugs(): Promise<string[]> {
  try {
    if (!isSanityConfigured()) {
      throw new Error("Sanity not configured");
    }
    const tours = await getAllTours();
    return tours
      .map((t: { slug?: { current?: string } | string }) =>
        typeof t.slug === "string" ? t.slug : t.slug?.current
      )
      .filter((s: string | undefined): s is string => Boolean(s));
  } catch {
    return getStaticTours().map((t) => t.slug);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths = [
    "/",
    "/tours",
    "/about",
    "/faq",
    "/blog",
    "/contact",
    "/consultation",
    "/booking",
    "/privacy",
    "/terms",
    "/refund-policy",
    "/cookie-policy",
    "/legal-notice",
    "/insurance-disclaimer",
    "/transparency",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/tours" ? 0.9 : 0.7,
  }));

  const tourSlugs = await getTourSlugs();
  for (const slug of tourSlugs) {
    entries.push({
      url: `${base}/tours/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  for (const post of BLOG_POSTS) {
    entries.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  return entries;
}
