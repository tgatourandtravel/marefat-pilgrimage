"use client";

import { useState, useMemo } from "react";

const FAQ_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "general", label: "General & trust" },
  { id: "first-time", label: "First-time travelers" },
  { id: "ziyarat", label: "Ziyarat & experience" },
  { id: "logistics", label: "Travel & logistics" },
  { id: "preparation", label: "Preparation & support" },
  { id: "accommodation", label: "Accommodation" },
  { id: "payment", label: "Payment & booking" },
];

const FAQ_ITEMS = [
  // General & Trust
  {
    category: "general",
    question: "Why choose Marefat Pilgrimage?",
    answer:
      "We plan every journey the way we would want someone to plan ours — with attention to the details that actually matter. Our focus is on giving you the space to be present, while we take care of everything around you.",
  },
  {
    category: "general",
    question: "Are you a licensed travel provider?",
    answer:
      "Yes. Marefat Pilgrimage is a certified and registered travel company based in Florida, and we work exclusively with accredited partners in Saudi Arabia and Iraq. Documentation is available upon request.",
  },
  {
    category: "general",
    question: "How large are your groups?",
    answer:
      "Group sizes vary by season and program. During peak periods, groups tend to be larger — but we scale our on-ground team accordingly, so every traveler still has access to personal support and clear guidance throughout.",
  },
  {
    category: "general",
    question: "Do you offer private or family tours?",
    answer:
      "Yes. Private and family-only programs are available and can be tailored to your schedule and preferences.",
  },

  // First-Time Travelers
  {
    category: "first-time",
    question: "Are your tours suitable for first-time pilgrims?",
    answer:
      "Yes, and many of our travelers are making this journey for the first time. We walk you through each step — before you leave and once you arrive — so you feel prepared rather than overwhelmed.",
  },
  {
    category: "first-time",
    question: "Will I have support throughout the journey?",
    answer:
      "Yes. Our team and guides are with you throughout — not just for the ziyarat itself, but for the practical moments in between. You will always have someone nearby to ask.",
  },

  // Ziyarat & Experience
  {
    category: "ziyarat",
    question: "Do you provide guidance for ziyarat and rituals?",
    answer:
      "Yes. Our guides share the historical context, the significance of each site, and practical guidance for the rituals. The goal is for you to leave each place understanding why it matters, not just where you stood.",
  },
  {
    category: "ziyarat",
    question: "How physically demanding are the journeys?",
    answer:
      "Some portions involve extended walking, particularly in busier environments or during peak seasons. We plan the pace carefully, but it is worth preparing physically beforehand — especially for older travelers or those with mobility considerations.",
  },
  {
    category: "ziyarat",
    question: "Is Ziyarat in Iraq safe?",
    answer:
      "Yes. We work with experienced local partners and follow a structured itinerary throughout. Our team remains with the group at all times, and all logistics are coordinated in advance to ensure a secure and well-managed stay.",
  },

  // Travel & Logistics
  {
    category: "logistics",
    question: "What is included in your packages?",
    answer:
      "Most programs include carefully selected accommodation, meals (breakfast and dinner in Saudi Arabia; full-board in Iraq), visa assistance, all local transportation, and guided ziyarat. Full details are always shared before you book.",
  },
  {
    category: "logistics",
    question: "Are flights included?",
    answer:
      "Flights are not automatically included but can be arranged on request. Many travelers prefer to book independently, and we are happy to coordinate with whichever option works best for you.",
  },
  {
    category: "logistics",
    question: "Do you arrange airport transfers?",
    answer:
      "Yes. Transfers to and from the airport, as well as all movement between sites, are arranged as part of the program.",
  },
  {
    category: "logistics",
    question: "Can I join from a different country?",
    answer:
      "Yes. We accommodate travelers joining from various locations and coordinate arrival logistics to align with the group schedule.",
  },
  {
    category: "logistics",
    question: "Will there be free time during the trip?",
    answer:
      "Yes. Each journey is structured, but not rigid. Time is set aside for personal ziyarat, rest, and quiet reflection.",
  },

  // Preparation & Support
  {
    category: "preparation",
    question: "Do you assist with visa and documentation?",
    answer:
      "Yes. Our team guides you through the full process — required documents, photos, and any confirmations needed for entry. We will let you know exactly what to prepare and when.",
  },
  {
    category: "preparation",
    question: "How early should I begin preparing?",
    answer:
      "We recommend starting at least 6–8 weeks before your departure date. For Ramadan or Hajj season, earlier preparation is strongly advised.",
  },
  {
    category: "preparation",
    question: "Do you provide packing and preparation guidance?",
    answer:
      "Yes. Before departure, you will receive a packing guide with practical recommendations tailored to the season and destination.",
  },

  // Accommodation & Comfort
  {
    category: "accommodation",
    question: "What type of accommodation do you provide?",
    answer:
      "We choose hotels based on location, cleanliness, and overall comfort — prioritizing proximity to key sites so you are not spending unnecessary time in transit.",
  },

  // Payment & Booking
  {
    category: "payment",
    question: "How can I pay for my trip?",
    answer:
      "We accept bank transfer and other secure payment methods. Full details are provided during the booking process.",
  },
  {
    category: "payment",
    question: "Do you offer payment plans?",
    answer:
      "Yes. For selected programs, structured payment plans are available. Our team will walk you through the options for your chosen program.",
  },
  {
    category: "payment",
    question: "Is my payment secure?",
    answer:
      "Yes. All payments are processed through verified channels, and we are transparent about every transaction from deposit to final balance.",
  },
  {
    category: "payment",
    question: "When is full payment required?",
    answer:
      "A deposit secures your booking, with the remaining balance due before departure. We will communicate the exact timeline clearly when you confirm your place.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    let items = FAQ_ITEMS;

    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory);
    }

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
            A selection of common questions about planning, rituals, logistics,
            and practical details. For anything more specific, you are welcome
            to contact us directly.
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
