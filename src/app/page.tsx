import { getFeaturedTours } from "@/data/tours";

// Get featured tours from central data file
const featuredTours = getFeaturedTours();

const testimonials = [
  {
    name: "A. Rahmani",
    location: "Hamburg, Germany",
    quote:
      "Every detail was taken care of quietly. The spiritual focus of our Umrah was never disturbed by logistics.",
  },
  {
    name: "S. Alavi",
    location: "Zurich, Switzerland",
    quote:
      "Hotels, transport, ziyarat schedule – all felt curated. The group size was intimate and respectful.",
  },
  {
    name: "Family Karimi",
    location: "Tehran, Iran",
    quote:
      "For our parents’ first Umrah, Marefat made sure they felt supported and at ease at every step.",
  },
];

const faqsPreview = [
  {
    question: "Are you a licensed and registered agency?",
    answer:
      "Yes. Marefat Pilgrimage operates with full licensing and works only with accredited partners in Saudi Arabia, Iraq, and Iran.",
  },
  {
    question: "Can you assist with visas and documentation?",
    answer:
      "Our team guides you through all required documents, from passports and photos to vaccination and insurance confirmations.",
  },
  {
    question: "Do you offer private or family-only groups?",
    answer:
      "Yes. In addition to scheduled departures, we create fully private itineraries for families, executives, and small closed groups.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-y-0 right-[-20%] w-1/2 bg-[radial-gradient(circle_at_top,_rgba(199,165,106,0.18),_transparent)]" />
        </div>

        {/* Background image - Desktop only */}
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <div className="relative h-full w-full">
            <img
              src="/Gemini_Generated_Image_wjtkogwjtkogwjtk.png"
              alt=""
              className="h-full w-full object-cover object-left"
            />
            {/* Gradient overlay to blend with background */}
            <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-ivory/60 via-transparent to-ivory/60" />
          </div>
        </div>

        {/* Content */}
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-start justify-center px-6 py-16 sm:px-8 lg:px-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Marefat Pilgrimage
          </p>
          <h1 className="max-w-3xl text-balance font-display text-4xl tracking-tight text-charcoal sm:text-5xl lg:max-w-2xl lg:text-6xl">
            A Journey for Your Soul &amp;{" "}
            <br />
            <span className="inline bg-gradient-to-r from-gold-soft to-gold bg-clip-text text-transparent sm:text-5xl">
              Cared for by Hands You Can Trust
            </span>
            <br />
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-charcoal/70 sm:text-base lg:max-w-lg">
            Your pilgrimage to Makkah, Madinah, Iraq, or Iran is the journey of a lifetime. We honor your sacred intent by providing a sanctuary of calm—pairing handpicked 5-star hotels with a supportive, human presence that handles every detail. Focus on your devotion; let us care for the rest.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/tours"
              className="inline-flex items-center justify-center rounded-full bg-charcoal px-7 py-3 text-sm font-medium text-ivory shadow-soft transition hover:bg-charcoal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              View Tours
            </a>
            <a
              href="/consultation"
              className="inline-flex items-center justify-center rounded-full border border-charcoal/15 bg-ivory/70 px-7 py-3 text-sm font-medium text-charcoal shadow-sm shadow-charcoal/5 backdrop-blur-sm transition hover:border-gold hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Trust blocks */}
      <section className="border-y border-charcoal/5 bg-ivory/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-3 sm:px-8 lg:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/60">
            Faithful Guidance &amp; Expertise
            </p>
            <p className="mt-2 text-sm text-charcoal/80">
            As a registered agency, we offer more than logistics. Our dedicated scholars and on-ground teams walk with you at every step, ensuring your rituals are performed with spiritual accuracy and peace of mind.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/60">
              Integrity in Every Detail
            </p>
            <p className="mt-2 text-sm text-charcoal/80">
            We believe a sacred journey should be free from worldly worry. Our pricing and itineraries are fully transparent, allowing you and your family to travel with a clear heart, knowing every detail is honored as promised
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/60">
             A Companion for Your Journey
            </p>
            <p className="mt-2 text-sm text-charcoal/80">
            You are never alone on your path. Your personal Marefat companion is available around the clock via WhatsApp or phone—providing discreet, thoughtful care from the moment you begin your preparations until you return home.
            </p>
          </div>
        </div>
      </section>

      {/* Featured tours */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-charcoal sm:text-2xl">
                Signature itineraries
              </h2>
              <p className="mt-2 text-sm text-charcoal/70">
                A selection of small‑group Umrah, Hajj, and Ziyarat programs
                crafted for comfort and spiritual focus.
              </p>
            </div>
            <a
              href="/tours"
              className="text-sm font-medium text-charcoal/80 underline-offset-4 hover:underline"
            >
              View all tours
            </a>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTours.map((tour) => (
              <a
                key={tour.slug}
                href={`/tours/${tour.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-charcoal/5 bg-ivory/90 p-5 shadow-sm shadow-charcoal/5 transition hover:-translate-y-1 hover:shadow-soft hover:border-gold/20 cursor-pointer"
              >
                {/* Image */}
                <div className="h-40 w-full flex-shrink-0 rounded-xl bg-gradient-to-tr from-charcoal/80 via-charcoal/40 to-gold-soft/70 opacity-80 transition group-hover:opacity-100" />

                {/* Content */}
                <div className="flex flex-1 flex-col space-y-2">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      tour.packageLevel === "Premium"
                        ? "bg-gradient-to-r from-gold/20 to-gold-soft/20 text-gold-dark border border-gold/30 shadow-sm"
                        : "bg-gradient-to-r from-charcoal/5 to-charcoal/10 text-charcoal/80 border border-charcoal/15 shadow-sm"
                    }`}>
                      {tour.packageLevel === "Premium" ? (
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                      {tour.packageLevel}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-charcoal/60">
                      {tour.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-sm font-semibold text-charcoal transition group-hover:text-gold sm:text-base">
                    {tour.title}
                  </h2>

                  {/* Date */}
                  <p className="text-xs text-charcoal/70">
                    {new Date(tour.startDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })} • {tour.durationDays} days
                  </p>

                  {/* Details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-charcoal/70">
                      <span>{tour.hotelStars}★ hotel</span>
                      <span>•</span>
                      <span>{tour.flightIncluded ? "✓ Flight included" : "✗ Flight not included"}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-charcoal/70">
                      <span>Meals: {tour.meals}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-end justify-between gap-3 pt-3">
                    <div>
                      {tour.earlyBirdDiscount && new Date() <= new Date(tour.earlyBirdDiscount.deadline) ? (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-gold">
                            Early Bird • Until {new Date(tour.earlyBirdDiscount.deadline).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-xs text-charcoal/50 line-through">
                              €{tour.earlyBirdDiscount.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-lg font-bold text-charcoal">
                              €{tour.earlyBirdDiscount.discountedPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-charcoal/60">From</p>
                          <p className="text-lg font-semibold text-charcoal">
                            {tour.priceFrom > 0 ? `€${tour.priceFrom.toLocaleString()}` : "On request"}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-charcoal/70 transition group-hover:text-gold">
                      <span>View</span>
                      <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ivory/80">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-12">
          <h2 className="text-xl font-semibold text-charcoal sm:text-2xl">
            Pilgrims’ words
          </h2>
          <p className="mt-2 text-sm text-charcoal/70">
            Discreet, attentive service for families and individuals who wish
            to focus on ibadah.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-charcoal/5 bg-ivory p-5 shadow-sm shadow-charcoal/5"
              >
                <p className="text-sm leading-relaxed text-charcoal/80">
                  “{t.quote}”
                </p>
                <div className="mt-4 text-xs text-charcoal/70">
                  <p className="font-medium">{t.name}</p>
                  <p>{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview + CTA */}
      <section className="border-y border-charcoal/5 bg-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:px-12">
          <div>
            <h2 className="text-xl font-semibold text-charcoal sm:text-2xl">
              Common questions
            </h2>
            <p className="mt-2 text-sm text-charcoal/70">
              A few essentials about safety, visas, and group sizes. For more
              detail, explore the full FAQ.
            </p>
            <div className="mt-6 space-y-4">
              {faqsPreview.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-xl border border-charcoal/5 bg-ivory/80 p-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-charcoal">
                    <span>{item.question}</span>
                    <span className="ml-4 text-xs text-charcoal/50 group-open:hidden">
                      +
                    </span>
                    <span className="ml-4 hidden text-xs text-charcoal/50 group-open:inline">
                      –
                    </span>
                  </summary>
                  <p className="mt-3 text-xs leading-relaxed text-charcoal/70">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
            <a
              href="/faq"
              className="mt-5 inline-flex text-sm font-medium text-charcoal/80 underline-offset-4 hover:underline"
            >
              View full FAQ
            </a>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gold/40 bg-gradient-to-br from-gold-soft/20 via-ivory to-gold/10 p-6 shadow-soft">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/70">
                Private consultation
              </p>
              <h3 className="mt-2 text-lg font-semibold text-charcoal">
                Speak with a Marefat advisor
              </h3>
              <p className="mt-2 text-sm text-charcoal/75">
                Share your preferred dates, destinations, and any special needs.
                We’ll propose a tailored program within 24–48 hours.
              </p>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <a
                href="/consultation"
                className="inline-flex w-full items-center justify-center rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-ivory shadow-soft transition hover:bg-charcoal/90"
              >
                Start online booking
              </a>
              <a
                href="https://wa.me/0000000000"
                className="inline-flex w-full items-center justify-center rounded-full border border-charcoal/15 bg-ivory/80 px-6 py-3 text-sm font-medium text-charcoal shadow-sm shadow-charcoal/5 transition hover:border-gold"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / WhatsApp CTA */}
      <section className="bg-ivory/70">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 rounded-2xl border border-charcoal/5 bg-ivory p-6 shadow-sm shadow-charcoal/5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-charcoal sm:text-lg">
                Quiet updates about upcoming groups
              </h3>
              <p className="mt-1 text-xs text-charcoal/70 sm:text-sm">
                Be informed first about new Umrah dates, Hajj allocation, and
                limited Ziyarat departures. No frequent marketing.
              </p>
            </div>
            <form className="flex w-full flex-col gap-3 sm:max-w-md sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="h-10 flex-1 rounded-full border border-charcoal/15 bg-ivory px-4 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-ivory"
              />
              <button
                type="submit"
                className="h-10 rounded-full bg-charcoal px-6 text-sm font-medium text-ivory shadow-soft transition hover:bg-charcoal/90"
              >
                Join quietly
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}



