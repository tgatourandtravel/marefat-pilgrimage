"use client";

import { useState, useMemo } from "react";

const FAQ_CATEGORIES = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "umrah",
    label: "Umrah & general",
  },
  {
    id: "visa",
    label: "Visa & documents",
  },
  {
    id: "rituals",
    label: "Ihram & rituals",
  },
  {
    id: "practical",
    label: "Practical & packing",
  },
];

const FAQ_ITEMS = [
  {
    category: "umrah",
    question: "Are you a licensed agency for Umrah and Ziyarat tours?",
    answer:
      "Yes. Marefat Pilgrimage operates with full licensing and works exclusively with accredited partners in Saudi Arabia and Iraq. Copies of licenses can be provided on request.",
  },
  {
    category: "umrah",
    question: "How large are your groups?",
    answer:
      "Most of our scheduled groups are kept intentionally small to maintain a calm atmosphere and allow space for individual questions. Private family-only programs are also available.",
  },
  {
    category: "visa",
    question: "Do you assist with e‑visas and other documentation?",
    answer:
      "Yes. Our team will guide you through the visa process step‑by‑step, including required documents, photos, and any health or vaccination confirmations needed at the time of travel.",
  },
  {
    category: "visa",
    question: "How early should I begin the visa process?",
    answer:
      "For most departures, we recommend starting preparations at least 6–8 weeks in advance. For peak seasons such as Ramadan and Hajj, earlier is strongly advised.",
  },
  {
    category: "rituals",
    question: "Will there be guidance for rituals in my language?",
    answer:
      "Yes. Our scholars and guides provide explanations in English, Persian, and Arabic on most departures. German support can be arranged on selected programs or privately.",
  },
  {
    category: "rituals",
    question: "Can you accommodate first‑time pilgrims?",
    answer:
      "Absolutely. Many of our guests are performing Umrah or Hajj for the first time. We provide gentle, step‑by‑step guidance to ensure you feel prepared and reassured.",
  },
  {
    category: "practical",
    question: "Do you provide packing lists and practical guidance?",
    answer:
      "Yes. Before departure you will receive a concise packing list, climate notes, and tips for staying comfortable and healthy during the journey.",
  },
  {
    category: "practical",
    question: "Can you handle special needs or mobility considerations?",
    answer:
      "Please inform us early of any medical needs or mobility limitations. We work with local partners to arrange appropriate rooms, wheelchairs, and support where possible.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    let items = FAQ_ITEMS;

    // Filter by category
    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    return items;
  }, [searchQuery, selectedCategory]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const grouped: Record<string, typeof FAQ_ITEMS> = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [filteredItems]);

  return (
    <main className="bg-ivory">
      <section className="border-b border-charcoal/5 bg-ivory/90">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            FAQ
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-charcoal sm:text-3xl">
            Questions before your journey
          </h1>
          <p className="mt-3 text-sm text-charcoal/75">
            A selection of common questions about visas, rituals, and practical
            details. For anything more specific, you are welcome to contact us
            directly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:px-8 lg:px-12">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Search questions…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-charcoal/10 bg-ivory px-4 py-2 text-xs text-charcoal placeholder:text-charcoal/40 transition focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2 text-xs">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full border px-3 py-1 transition ${
                  selectedCategory === cat.id
                    ? "border-gold/60 bg-gold/10 text-charcoal shadow-sm"
                    : "border-charcoal/10 bg-ivory text-charcoal/70 hover:border-gold/40 hover:text-charcoal"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-charcoal/5 bg-ivory/50 p-8 text-center">
            <p className="text-sm text-charcoal/60">
              No questions found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-3 text-xs text-gold underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedCategory === "all" ? (
              // Show grouped by category when "All" is selected
              FAQ_CATEGORIES.filter((cat) => cat.id !== "all").map((cat) => {
                const categoryItems = groupedItems[cat.id] || [];
                if (categoryItems.length === 0) return null;
                return (
                  <section key={cat.id} className="space-y-3">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                      {cat.label}
                    </h2>
                    <div className="space-y-2">
                      {categoryItems.map((item) => (
                        <details
                          key={item.question}
                          className="group rounded-2xl border border-charcoal/6 bg-ivory/90 p-4 text-sm text-charcoal/80 transition hover:border-charcoal/10"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-charcoal">
                            <span>{item.question}</span>
                            <span className="ml-3 text-xs text-charcoal/50 group-open:hidden">
                              +
                            </span>
                            <span className="ml-3 hidden text-xs text-charcoal/50 group-open:inline">
                              –
                            </span>
                          </summary>
                          <p className="mt-3 text-xs leading-relaxed text-charcoal/75">
                            {item.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              // Show flat list when a specific category is selected
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-2xl border border-charcoal/6 bg-ivory/90 p-4 text-sm text-charcoal/80 transition hover:border-charcoal/10"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-charcoal">
                      <span>{item.question}</span>
                      <span className="ml-3 text-xs text-charcoal/50 group-open:hidden">
                        +
                      </span>
                      <span className="ml-3 hidden text-xs text-charcoal/50 group-open:inline">
                        –
                      </span>
                    </summary>
                    <p className="mt-3 text-xs leading-relaxed text-charcoal/75">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}


