"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BLOG_CATEGORIES, BLOG_POSTS } from "./data";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let posts = BLOG_POSTS;

    // Filter by category
    if (selectedCategory !== "All") {
      posts = posts.filter((post) => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query)
      );
    }

    return posts;
  }, [selectedCategory, searchQuery]);

  return (
    <main className="bg-ivory">
      <section className="border-b border-charcoal/5 bg-ivory/90">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Guides
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-charcoal sm:text-3xl">
            Quiet guidance for your pilgrimage
          </h1>
          <p className="mt-3 text-sm text-charcoal/75">
            Short, practical notes on Umrah, Hajj, and Ziyarat — written to
            reduce stress and help you travel with clarity.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-8 sm:px-8 lg:px-12">
        {/* Category Filter Tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-charcoal/5 pb-4">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                selectedCategory === cat
                  ? "border-gold/60 bg-gold/10 text-charcoal shadow-sm"
                  : "border-charcoal/10 bg-ivory text-charcoal/70 hover:border-gold/40 hover:text-charcoal"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search (optional, can be added if needed) */}
        {false && (
          <div className="mb-6">
            <input
              type="search"
              placeholder="Search articles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-xs rounded-full border border-charcoal/10 bg-ivory px-4 py-2 text-xs text-charcoal placeholder:text-charcoal/40 transition focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
            />
          </div>
        )}

        {/* Blog Grid */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-charcoal/5 bg-ivory/50 p-12 text-center">
            <p className="text-sm text-charcoal/60">
              No articles found in this category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal/5 bg-ivory shadow-sm shadow-charcoal/5 transition hover:-translate-y-1 hover:shadow-soft"
              >
                {/* Image with Badge Overlay */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-charcoal/10 via-charcoal/5 to-gold-soft/30">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  {/* Badge on Image */}
                  <div className="absolute left-3 top-3">
                    <span className="inline-block rounded-full border border-ivory/80 bg-ivory/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal shadow-sm backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-base font-semibold leading-snug text-charcoal transition group-hover:text-gold">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-charcoal/70">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-charcoal/5 pt-3">
                    <span className="text-[11px] text-charcoal/60">{post.author}</span>
                    <span className="text-[11px] font-medium text-gold transition group-hover:text-charcoal">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


