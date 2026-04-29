import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Marefat Pilgrimage | Umrah, Hajj & Ziyarat",
  description:
    "A calm, attentive approach to Umrah, Hajj, and Ziyarat — designed for those who value discretion, comfort, and uninterrupted spiritual focus.",
};

export default function AboutPage() {
  return (
    <main className="bg-ivory">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-charcoal/5">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            About Marefat Pilgrimage
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl">
            A calm, attentive way to travel for ibadah
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/70">
            Marefat Pilgrimage offers a more considered approach to Umrah, Hajj, and
            Ziyarat — designed for those who value{" "}
            <strong className="font-semibold text-charcoal">discretion</strong>,{" "}
            <strong className="font-semibold text-charcoal">comfort</strong>, and{" "}
            <strong className="font-semibold text-charcoal">
              uninterrupted spiritual focus
            </strong>
            .
          </p>
        </div>
        {/* Decorative gradient blob */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-gold-soft/20 via-transparent to-transparent" />
      </section>

      {/* ─── HERO IMAGE + INTRO ─── */}
      <section className="mx-auto max-w-6xl px-6 pt-10 sm:px-8 lg:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_420px]">
          {/* Intro text */}
          <div className="space-y-5 text-sm leading-relaxed text-charcoal/80">
            <p>
              Each journey is arranged with care and restraint — allowing everything to
              flow with{" "}
              <strong className="font-semibold text-charcoal">clarity and ease</strong>.
            </p>
            <p>
              From visas to accommodations and private transfers, every detail is quietly
              managed by a dedicated team, so your attention remains{" "}
              <strong className="font-semibold text-charcoal">undisturbed</strong>.
            </p>
            <p className="text-charcoal/60">
              What should be a deeply reflective journey remains exactly that — without
              the avoidable distractions that so often accompany group travel.
            </p>
          </div>
          {/* Image */}
          <div className="relative h-64 overflow-hidden rounded-2xl bg-charcoal/10 shadow-soft lg:h-80">
            <img
              src="https://images.unsplash.com/photo-1588987278192-09fd57dd55ad?w=840&h=640&fit=crop"
              alt="Holy Kaaba floral decoration, Masjid al-Haram"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── OUR STORY ─── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Our story
            </p>
            <h2 className="text-2xl font-semibold text-charcoal sm:text-3xl">
              A different standard was needed
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-charcoal/80">
              <p>
                Marefat emerged from a quiet but consistent observation.
              </p>
              <p>
                Many pilgrimages, despite their significance, were shaped by avoidable
                disruptions — uncertainty in planning, inconsistent standards, and a lack
                of accountability. What should have been a deeply reflective journey often
                became burdened by unnecessary complexity.
              </p>
              <p>
                Over time, it became clear that a different standard was needed. One
                defined not by{" "}
                <strong className="font-semibold text-charcoal">volume</strong>, but by{" "}
                <strong className="font-semibold text-charcoal">care</strong>.
              </p>
            </div>
          </div>
          {/* Story image */}
          <div className="relative h-72 overflow-hidden rounded-2xl bg-charcoal/10 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1724051526928-ae6f5d53bead?w=840&h=640&fit=crop"
              alt="Pilgrims gathered at Imam Ali Shrine, Najaf"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-charcoal/10" />
          </div>
        </div>
      </section>

      {/* ─── FROM THE FOUNDER ─── */}
      <section className="border-y border-charcoal/5 bg-charcoal">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-center">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                From the founder
              </p>
              <div className="space-y-4 text-sm leading-relaxed text-ivory/80">
                <p>
                  My work in tourism and hospitality began in{" "}
                  <strong className="font-semibold text-ivory">2014</strong>, with
                  experience across Germany and the United States, including time with{" "}
                  <strong className="font-semibold text-ivory">Qatar Airways</strong>. I
                  later completed certification through the{" "}
                  <strong className="font-semibold text-ivory">
                    Chamber of Commerce in Germany
                  </strong>{" "}
                  — a foundation that shaped my understanding of structure, responsibility,
                  and refined service.
                </p>
                <p>
                  Yet Marefat was not created from experience alone.
                </p>
                <p>
                  It was shaped by what I witnessed — journeys where the essential was
                  overshadowed by the avoidable. And the conviction that this could be
                  done differently.
                </p>
              </div>

              {/* Pull quote */}
              <blockquote className="relative border-l-2 border-gold pl-5">
                <p className="text-base font-medium leading-relaxed text-ivory sm:text-lg">
                  Those who travel with Marefat are not regarded as customers, but as{" "}
                  <span className="text-gold">
                    honored guests of Allah and the Ahlulbayt
                  </span>
                  .
                </p>
                <p className="mt-3 text-sm text-ivory/60">This understanding defines everything.</p>
              </blockquote>

              <p className="text-sm leading-relaxed text-ivory/80">
                Each journey is supported by{" "}
                <strong className="font-semibold text-ivory">
                  knowledgeable scholars
                </strong>{" "}
                and a highly experienced team working with precision behind the scenes —
                ensuring that every element is considered, managed, and resolved before it
                reaches you.
              </p>

              <p className="text-sm font-medium italic text-ivory/60">
                So that what remains is simple.{" "}
                <span className="not-italic text-ivory">
                  Presence. Focus. Worship.
                </span>
              </p>
            </div>

            {/* Founder image placeholder */}
            <div className="relative mx-auto h-80 w-full max-w-xs overflow-hidden rounded-2xl bg-charcoal/40 shadow-soft ring-1 ring-inset ring-white/10 lg:mx-0">
              <img
                src="/images/about/founder-ahmad-reshad-tajik.png"
                alt="Marefat Pilgrimage founder"
                className="h-full w-full object-cover object-top opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ivory/60">
                  Ahmad Reshad Tajik
                </p>
                <p className="mt-0.5 text-[11px] text-ivory/40">Founder, Marefat Pilgrimage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MISSION / APPROACH / PROMISE ─── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            What we stand for
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-charcoal sm:text-3xl">
            Built on three principles
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Mission */}
          <div className="flex flex-col gap-4 rounded-2xl border border-charcoal/5 bg-ivory p-7 shadow-sm shadow-charcoal/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
              <span className="text-base text-gold" aria-hidden="true">✦</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Mission
              </p>
              <h3 className="mt-2 text-base font-semibold text-charcoal">
                Clarity over uncertainty
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                To offer pilgrimage experiences where clarity replaces uncertainty, and{" "}
                <strong className="font-medium text-charcoal">
                  every detail serves the purpose of ibadah
                </strong>
                .
              </p>
            </div>
          </div>

          {/* Approach */}
          <div className="flex flex-col gap-4 rounded-2xl border border-charcoal/5 bg-ivory p-7 shadow-sm shadow-charcoal/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
              <span className="text-base text-gold" aria-hidden="true">✦</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Approach
              </p>
              <h3 className="mt-2 text-base font-semibold text-charcoal">
                Nothing excessive. Nothing overlooked.
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-charcoal/70">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold" aria-hidden="true">—</span>
                  Limited groups
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold" aria-hidden="true">—</span>
                  Carefully selected environments
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold" aria-hidden="true">—</span>
                  Measured pacing
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold" aria-hidden="true">—</span>
                  Trusted partnerships
                </li>
              </ul>
            </div>
          </div>

          {/* Promise */}
          <div className="flex flex-col gap-4 rounded-2xl border border-gold/25 bg-gradient-to-br from-gold-soft/15 via-ivory to-gold/5 p-7 shadow-sm shadow-gold/10">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/20">
              <span className="text-base text-gold" aria-hidden="true">✦</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Promise
              </p>
              <h3 className="mt-2 text-base font-semibold text-charcoal">
                Accountability at every stage
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-charcoal/70">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold" aria-hidden="true">—</span>
                  <strong className="font-medium text-charcoal">Clarity</strong> in communication
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold" aria-hidden="true">—</span>
                  <strong className="font-medium text-charcoal">Consistency</strong> in service
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold" aria-hidden="true">—</span>
                  <strong className="font-medium text-charcoal">Responsibility</strong> at every stage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM & SCHOLARS ─── */}
      <section className="border-t border-charcoal/5 bg-ivory/60">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:items-center">
            {/* Image */}
            <div className="relative h-64 overflow-hidden rounded-2xl bg-charcoal/10 shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1572358899655-f63ece97bfa5?w=680&h=480&fit=crop"
                alt="People walking outside Masjid al-Nabawi, Madinah"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent" />
            </div>
            {/* Text */}
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Team &amp; scholars
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-charcoal sm:text-3xl">
                  Knowledge and care, together
                </h2>
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-charcoal/80">
                <p>
                  Every journey is guided with both{" "}
                  <strong className="font-semibold text-charcoal">knowledge</strong> and{" "}
                  <strong className="font-semibold text-charcoal">care</strong>.
                </p>
                <p>
                  <strong className="font-semibold text-charcoal">Scholars</strong> provide
                  clarity where it matters — in rituals, rulings, and moments of personal
                  guidance.
                </p>
                <p>
                  A{" "}
                  <strong className="font-semibold text-charcoal">
                    dedicated operational team
                  </strong>{" "}
                  ensures everything else remains effortless — from pre-departure
                  documentation to day-to-day logistics throughout the journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LICENSING & TRUST ─── */}
      <section className="border-t border-charcoal/5">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Licensing &amp; trust
                </p>
                <h2 className="text-lg font-semibold text-charcoal sm:text-xl">
                  Operating with full accountability
                </h2>
                <p className="max-w-lg text-sm leading-relaxed text-charcoal/70">
                  Marefat operates with accredited partners and in full accordance with all
                  regulatory requirements. Documentation is available upon request.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-xs font-medium text-ivory shadow-soft transition hover:bg-charcoal/90"
                >
                  Request information
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* IATA accreditation badge */}
            <div className="flex flex-col gap-4 rounded-2xl border border-charcoal/8 bg-ivory/60 px-6 py-5 sm:flex-row sm:items-center sm:gap-6">
              <img
                src="/images/iata-accredited.png"
                alt="IATA Accredited Travel Agent"
                className="h-20 w-auto object-contain self-start sm:self-center"
                title="IATA Accredited Travel Agent — International Air Transport Association"
              />
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                  IATA Accredited Travel Agent
                </p>
                <p className="text-sm font-medium text-charcoal">
                  International Air Transport Association
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-charcoal/65">
                  Marefat Pilgrimage is an IATA-accredited travel agency — a globally recognized
                  certification that confirms our compliance with international aviation and
                  travel industry standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
