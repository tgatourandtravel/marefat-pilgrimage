"use client";

import { Suspense, useState, useEffect } from "react";
import { useSetStickyBarOffset } from "@/contexts/StickyBarContext";
import Link from "next/link";
import { Tour } from "@/data/tours";
import { Button, InfoCard, Tabs, TabsList, TabsTrigger, TabsContent, Card, ImageGallery, RoomSelector, RoomSelectorTrigger, buildRoomOptions, type RoomOption } from "@/components/ui";

// Icons
const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HotelIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4 text-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PlaneIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

interface TourDetailClientProps {
  tour: Tour;
}

export default function TourDetailClient({ tour }: TourDetailClientProps) {
  // Build room options from tour data (if roomPricing is defined)
  const roomOptions: RoomOption[] = tour.roomPricing ? buildRoomOptions(tour.roomPricing) : [];
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(
    roomOptions.length > 0 ? roomOptions[0] : null
  );

  // Tell FloatingWhatsApp to shift above the mobile sticky CTA bar (~72px)
  const setStickyBarOffset = useSetStickyBarOffset();
  useEffect(() => {
    setStickyBarOffset(80);
    return () => setStickyBarOffset(0);
  }, [setStickyBarOffset]);

  const handleBookNow = () => {
    const params = selectedRoom
      ? `?room=${selectedRoom.type}&price=${selectedRoom.price}`
      : "";
    window.location.href = `/tours/${tour.slug}/book${params}`;
  };

  // Check if early bird discount is active
  const hasEarlyBird = tour.earlyBirdDiscount && new Date() <= new Date(tour.earlyBirdDiscount.deadline);
  const isOnRequest = tour.priceFrom === 0;

  // Get the display price — room selection overrides early bird / base price
  const baseDisplayPrice = hasEarlyBird
    ? tour.earlyBirdDiscount!.discountedPrice
    : tour.priceFrom;
  const displayPrice = selectedRoom ? selectedRoom.price : baseDisplayPrice;
  const originalPrice = hasEarlyBird && !selectedRoom
    ? tour.earlyBirdDiscount!.originalPrice
    : null;

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-charcoal/5 bg-ivory/90">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <nav className="flex items-center gap-2 text-xs text-charcoal/60">
              <Link href="/" className="hover:text-charcoal">Home</Link>
              <span>/</span>
              <Link href="/tours" className="hover:text-charcoal">Tours</Link>
              <span>/</span>
              <span className="text-charcoal">{tour.title}</span>
            </nav>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal">
                {tour.type}
              </span>
              <span className="rounded-full border border-charcoal/10 bg-ivory/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/70">
                {tour.destination}
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-charcoal sm:text-4xl">
              {tour.title}
            </h1>
            <p className="text-base text-charcoal/70">{tour.description}</p>
          </div>
        </div>
      </section>

      {/* Combo Tour Info - Only show for combo tours */}
      {tour.type === "Combo" && (
        <section className="border-b border-charcoal/5 bg-gradient-to-br from-gold/5 to-ivory/90">
          <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
            <div className="rounded-2xl border border-gold/20 bg-ivory/80 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gold/10 p-3">
                  <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-charcoal">
                    Combination Tour Package
                  </h3>
                  <p className="mt-1 text-sm text-charcoal/70">
                    This special package combines two complete spiritual journeys with a discounted price. Experience both destinations with seamless travel arrangements and dedicated guidance.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/tours/spring-break-umrah-2026"
                      className="group flex items-center gap-3 rounded-xl border border-charcoal/10 bg-ivory p-4 transition hover:border-gold/40 hover:bg-gold/5"
                    >
                      <div className="flex-shrink-0 text-2xl">🕋</div>
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-charcoal/60">Included Tour 1</p>
                        <p className="mt-0.5 text-sm font-semibold text-charcoal group-hover:text-gold">Umrah 2026 - Thanksgiving</p>
                        <p className="mt-0.5 text-xs text-charcoal/60">March 29 - April 5 (7 days)</p>
                      </div>
                      <svg className="h-4 w-4 flex-shrink-0 text-charcoal/30 transition group-hover:text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      href="/tours/karbala-spring-break-2026"
                      className="group flex items-center gap-3 rounded-xl border border-charcoal/10 bg-ivory p-4 transition hover:border-gold/40 hover:bg-gold/5"
                    >
                      <div className="flex-shrink-0 text-2xl">🕌</div>
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-charcoal/60">Included Tour 2</p>
                        <p className="mt-0.5 text-sm font-semibold text-charcoal group-hover:text-gold">Karbala 2026 - Spring Break</p>
                        <p className="mt-0.5 text-xs text-charcoal/60">April 5 - April 12 (7 days)</p>
                      </div>
                      <svg className="h-4 w-4 flex-shrink-0 text-charcoal/30 transition group-hover:text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="mt-4 rounded-lg bg-gold/10 px-4 py-2 text-center">
                    <p className="text-xs font-medium text-charcoal/70">
                      💰 Special Combo Discount: Save by booking both tours together
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Image Gallery - Only show if images exist */}
      {tour.images && tour.images.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-10 sm:px-8 lg:px-12">
          <ImageGallery images={tour.images} tourTitle={tour.title} />
        </section>
      )}

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]">
          {/* Left Column: Content */}
          <div className="space-y-8">
            {/* Info Cards — hidden for exclusive display tours */}
            {!tour.exclusiveDisplay && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <InfoCard
                  icon={<CalendarIcon />}
                  label="Travel Dates"
                  value={`${new Date(tour.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })} - ${new Date(tour.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`}
                  subtitle={new Date(tour.startDate).getFullYear().toString()}
                />
                <InfoCard
                  icon={<ClockIcon />}
                  label="Duration"
                  value={`${tour.durationDays} days`}
                />
                <InfoCard
                  icon={<HotelIcon />}
                  label="Hotel"
                  value={`${tour.hotelStars}★`}
                  subtitle={tour.hotelInfo.split(",")[0]}
                />
                <InfoCard
                  icon={<UsersIcon />}
                  label="Available"
                  value="12 seats"
                />
              </div>
            )}

            {/* ── Exclusive Services Layout (Hajj / special tours) ── */}
            {tour.exclusiveDisplay && tour.exclusiveServices ? (
              <div className="space-y-8">
                {/* Heading */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    What We Offer
                  </p>
                  <h2 className="text-2xl font-semibold text-charcoal sm:text-3xl">
                    {tour.exclusiveServices.heading}
                  </h2>
                </div>

                {/* Intro — Nusuk + guide context */}
                {tour.exclusiveServices.intro && (
                  <div className="rounded-2xl border border-charcoal/8 bg-ivory/60 px-6 py-5">
                    <p className="text-sm leading-relaxed text-charcoal/70">
                      {tour.exclusiveServices.intro.split("Nusuk").map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="font-semibold text-charcoal">Nusuk</span>
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                )}

                {/* Service Sections */}
                <div className="space-y-5">
                  {tour.exclusiveServices.sections.map((section, idx) => (
                    <div
                      key={section.title}
                      className="rounded-2xl border border-charcoal/8 bg-ivory/80 p-6 shadow-sm"
                    >
                      {/* Section header */}
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-[11px] font-bold text-gold-dark">
                          {idx + 1}
                        </span>
                        <h3 className="text-base font-semibold text-charcoal">
                          {section.title}
                        </h3>
                      </div>

                      {/* Items */}
                      <ul className="mt-4 space-y-3 pl-10">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm leading-relaxed text-charcoal/75"
                          >
                            <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Free of charge — trust signal */}
                {tour.exclusiveServices.freeNote && (
                  <div className="flex items-start gap-3 rounded-2xl border border-gold/25 bg-gold/8 px-5 py-4">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-dark"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium leading-relaxed text-charcoal">
                      {tour.exclusiveServices.freeNote}
                    </p>
                  </div>
                )}

                {/* Limited seats — urgency note */}
                <div className="rounded-xl border border-gold/20 bg-gold/5 px-5 py-4">
                  <p className="text-sm text-charcoal/70">
                    Seats for Hajj 2027 are extremely limited. Contact our team early to begin your application and secure your place.
                  </p>
                </div>
              </div>
            ) : (
              /* ── Standard Layout (all other tours) ── */
              <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-charcoal/5" />}>
                <Tabs defaultValue="overview" urlSync className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="included">What's Included</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                {/* Tab Content: Overview */}
                <TabsContent value="overview" className="space-y-8">
                  {/* Highlights */}
                  <div>
                    <h2 className="text-lg font-semibold text-charcoal">
                      Highlights
                    </h2>
                    <ul className="mt-4 grid gap-2 text-sm text-charcoal/80 md:grid-cols-2">
                      {tour.highlights?.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 rounded-xl border border-charcoal/5 bg-ivory/90 px-3 py-2"
                        >
                          <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Itinerary */}
                  <div>
                    <h2 className="text-lg font-semibold text-charcoal">
                      Day-by-day itinerary
                    </h2>
                    <ol className="mt-4 space-y-3 border-l border-charcoal/10 pl-4 text-sm text-charcoal/80">
                      {tour.itinerary.map((item, index) => (
                        <li key={item} className="relative">
                          <span className="absolute -left-[19px] mt-[4px] h-2.5 w-2.5 rounded-full border border-gold/60 bg-ivory" />
                          <span className="mr-2 text-[11px] font-medium text-charcoal/60">
                            Day {index + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Hotels & Flights */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card variant="elevated" padding="md">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                        Hotels
                      </h3>
                      <p className="mt-2 text-sm text-charcoal/75">{tour.hotelInfo}</p>
                    </Card>
                    <Card variant="elevated" padding="md">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                        Flights
                      </h3>
                      <p className="mt-2 text-sm text-charcoal/75">{tour.flightsInfo}</p>
                    </Card>
                  </div>
                </TabsContent>

                {/* Tab Content: What's Included */}
                <TabsContent value="included" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <CheckIcon />
                        <h3 className="text-sm font-semibold text-charcoal">
                          Included
                        </h3>
                      </div>
                      <ul className="space-y-2 text-sm text-charcoal/75">
                        {tour.included.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckIcon />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <XIcon />
                        <h3 className="text-sm font-semibold text-charcoal">
                          Not Included
                        </h3>
                      </div>
                      <ul className="space-y-2 text-sm text-charcoal/75">
                        {tour.excluded.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <XIcon />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab Content: Documents */}
                <TabsContent value="documents" className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-charcoal">
                      Required Documents
                    </h3>
                    <ul className="grid gap-2 text-sm text-charcoal/75 md:grid-cols-2">
                      {tour.documentsNeeded.map((doc) => (
                        <li
                          key={doc}
                          className="flex items-center gap-2 rounded-xl border border-charcoal/5 bg-ivory/90 px-3 py-2"
                        >
                          <CheckIcon />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Card variant="elevated" padding="md">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                      Important Notes
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-charcoal/75">
                      <li className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                        <span>
                          Passport must be valid for at least 6 months from the tour start date
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                        <span>
                          We assist with visa processing for all participants
                        </span>
                      </li>
                    </ul>
                  </Card>
                </TabsContent>
                </Tabs>
              </Suspense>
            )}

            {/* Testimonials Section */}
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-charcoal">
                What Pilgrims Say
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card variant="elevated" padding="lg">
                  <div className="space-y-4">
                    <div className="text-4xl text-gold/40">"</div>
                    <p className="text-sm text-charcoal/80">
                      "Marefat made our family's first Umrah absolutely seamless. From the moment
                      we landed to our departure, every detail was handled with care. The spiritual
                      guidance was exceptional."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-charcoal">
                        A
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">Ahmed Hassan</p>
                        <p className="text-xs text-charcoal/60">London, UK • Umrah</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" padding="lg">
                  <div className="space-y-4">
                    <div className="text-4xl text-gold/40">"</div>
                    <p className="text-sm text-charcoal/80">
                      "After years of waiting, our Hajj experience exceeded all expectations.
                      The team's dedication to our comfort while maintaining the spiritual essence
                      was remarkable."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-charcoal">
                        F
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">Fatima Rezaei</p>
                        <p className="text-xs text-charcoal/60">Frankfurt, Germany • Hajj</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Price Widget */}
            <Card variant="elevated" padding="lg">
              <div className="space-y-4">
                {/* Price Display */}
                <div className="text-center">
                  {isOnRequest ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                        Price
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-charcoal">
                        On Request
                      </p>
                      <p className="mt-1 text-xs text-charcoal/60">
                        Contact us for pricing based on your preferences
                      </p>
                    </>
                  ) : hasEarlyBird ? (
                    <>
                      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1">
                        <svg className="h-3.5 w-3.5 text-gold-dark" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-gold-dark">
                          Early Bird until {new Date(tour.earlyBirdDiscount!.deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-charcoal/50 line-through">
                        ${originalPrice?.toLocaleString()}
                      </p>
                      <p className="text-3xl font-semibold text-charcoal">
                        ${displayPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-charcoal/60">per person</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                        Price
                      </p>
                      <p className="mt-1 text-3xl font-semibold text-charcoal">
                        ${displayPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-charcoal/60">per person</p>
                    </>
                  )}
                </div>

                {/* Room Type Selector — only shown when tour has roomPricing */}
                {roomOptions.length > 0 && selectedRoom && (
                  <div className="border-t border-charcoal/5 pt-4">
                    <RoomSelector
                      options={roomOptions}
                      selected={selectedRoom}
                      onChange={setSelectedRoom}
                    />
                  </div>
                )}

                {/* Special Note if exists */}
                {tour.specialNotes?.customNote && (
                  <div className="rounded-xl bg-gold/10 p-3 text-center">
                    <p className="text-xs text-charcoal/75">
                      {tour.specialNotes.customNote}
                    </p>
                  </div>
                )}

                {/* Key Features — hidden for exclusive display tours */}
                {!tour.exclusiveDisplay && (
                  <div className="space-y-2 border-t border-charcoal/5 pt-4 text-sm text-charcoal/80">
                    {tour.flightIncluded && (
                      <div className="flex items-center gap-2">
                        <PlaneIcon />
                        <span>Flights included</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <HotelIcon />
                      <span>{tour.hotelStars}★ Hotel • {tour.hotelInfo.split(",")[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon />
                      <span>12 seats remaining</span>
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="space-y-2 border-t border-charcoal/5 pt-4">
                  {isOnRequest ? (
                    <a
                      href="https://wa.me/19543308904"
                      className="flex w-full items-center justify-center rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-ivory shadow-soft transition hover:bg-charcoal/90"
                    >
                      Request Quote
                    </a>
                  ) : (
                    <Button
                      onClick={handleBookNow}
                      className="w-full"
                      size="md"
                    >
                      Book Now
                    </Button>
                  )}
                  <a
                    href="https://wa.me/19543308904"
                    className="flex items-center justify-center rounded-full border border-charcoal/15 bg-ivory/80 px-6 py-2.5 text-sm font-medium text-charcoal shadow-sm shadow-charcoal/5 transition hover:border-gold"
                  >
                    WhatsApp our team
                  </a>
                  {!isOnRequest && (
                    <p className="pt-1 text-center text-[11px] text-charcoal/55">
                      Secure your spot with a 30% deposit
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Support Card */}
            <Card variant="elevated" padding="md">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                Support & Assurance
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-charcoal/75">
                <li className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  24/7 concierge via WhatsApp
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  Licensed partners and vetted transport
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  Clear refund and change policies
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/10 bg-ivory/95 px-4 py-3 shadow-[0_-8px_30px_rgba(15,15,15,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          {/* Room selector trigger pill — only shown when roomPricing is available */}
          {roomOptions.length > 0 && selectedRoom ? (
            <RoomSelectorTrigger
              options={roomOptions}
              selected={selectedRoom}
              onChange={setSelectedRoom}
            />
          ) : (
            <div className="flex-1">
              {isOnRequest ? (
                <p className="text-sm font-medium text-charcoal">Price on request</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-charcoal">
                    ${displayPrice.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-charcoal/60">per person</span>
                  </p>
                  {hasEarlyBird && (
                    <p className="text-[10px] text-gold-dark">Early Bird Price</p>
                  )}
                </>
              )}
            </div>
          )}

          <div className="ml-auto shrink-0">
            {isOnRequest ? (
              <a
                href="https://wa.me/19543308904"
                className="rounded-full bg-charcoal px-5 py-2 text-sm font-medium text-ivory shadow-soft transition hover:bg-charcoal/90"
              >
                Request Quote
              </a>
            ) : (
              <Button onClick={handleBookNow} size="sm">
                Book Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Add padding at bottom for mobile CTA */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
