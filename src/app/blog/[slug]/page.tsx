import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "../data";

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: "Guide not found – Marefat Pilgrimage",
    };
  }
  return {
    title: `${post.title} – Marefat Pilgrimage`,
    description: post.introduction.split(".")[0],
  };
}

export default function BlogArticlePage({ params }: Props) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-charcoal/5 bg-ivory/50 p-8 text-center">
          <p className="text-sm text-charcoal/70">
            This guide could not be found. Please return to the{" "}
            <Link
              href="/blog"
              className="font-medium text-gold underline-offset-4 transition hover:underline"
            >
              Marefat guides
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-ivory">
      <article className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:px-8 lg:px-12">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
            {post.category}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-charcoal/60">
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>
        </div>

        <div className="relative mb-10 h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal/10 via-charcoal/5 to-gold-soft/30 sm:h-[500px]">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        </div>

        <div className="mb-10 space-y-4">
          <div className="prose prose-sm max-w-none text-base leading-relaxed text-charcoal/80">
            {post.introduction.split(/(?<=\.) /).map((sentence, idx) => (
              <p key={idx} className={idx === 0 ? "text-lg font-medium text-charcoal" : ""}>
                {sentence}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {post.sections.map((section, sectionIdx) => (
            <section key={sectionIdx} className="space-y-4">
              <h2 className="text-xl font-semibold text-charcoal sm:text-2xl">
                {section.title}
              </h2>
              <div className="prose prose-sm max-w-none space-y-3 text-sm leading-relaxed text-charcoal/75">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
                {section.listItems && (
                  <ul className="mt-4 space-y-2.5 pl-5">
                    {section.listItems.map((item, itemIdx) => (
                      <li key={itemIdx} className="relative pl-2">
                        <span className="absolute left-[-12px] text-gold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.visuals && (
                  <div className="mt-7 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                      {section.visuals.map((visual, visualIdx) => (
                        <figure
                          key={`${sectionIdx}-${visualIdx}`}
                          className={`group overflow-hidden rounded-2xl border border-charcoal/10 bg-ivory shadow-sm shadow-charcoal/5 ${
                            visual.layout === "full"
                              ? "md:col-span-12"
                              : visual.layout === "third"
                                ? "md:col-span-4"
                                : "md:col-span-6"
                          }`}
                        >
                          <div
                            className={`overflow-hidden ${
                              visual.layout === "full" ? "aspect-[16/9]" : "aspect-[4/3]"
                            }`}
                          >
                            <img
                              src={visual.src}
                              alt={visual.alt}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                              loading="lazy"
                            />
                          </div>
                          {visual.caption && (
                            <figcaption className="border-t border-charcoal/10 bg-ivory/80 px-4 py-3 text-xs leading-relaxed text-charcoal/65">
                              {visual.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold-soft/10 via-ivory to-gold/5 p-6 sm:p-8">
          <h2 className="mb-4 text-lg font-semibold text-charcoal sm:text-xl">Conclusion</h2>
          <p className="text-sm leading-relaxed text-charcoal/75">{post.conclusion}</p>
        </section>

        <div className="mt-12 border-t border-charcoal/5 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-medium text-charcoal/70 transition hover:text-charcoal"
          >
            <span>←</span>
            <span>Back to All Articles</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
