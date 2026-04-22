"use client";

import Link from "next/link";
import Image from "next/image";
import { PackageBadge } from "./PackageBadge";
import { urlFor } from "@/lib/sanity/queries";

interface TourCardProps {
  tour: any; // Accept both Sanity and static tour formats
}

/**
 * TourCard Component
 *
 * Displays a tour preview card with:
 * - Image with 16:9 aspect ratio (optimized for 1200x675px)
 * - Package badge and type
 * - Title, dates, and key features
 * - Early bird pricing if available
 */
export function TourCard({ tour }: TourCardProps) {
  const hasEarlyBird = tour.earlyBirdDiscount && new Date() <= new Date(tour.earlyBirdDiscount.deadline);
  const isOnRequest = tour.priceFrom === 0;

  // Get the first image - handle both Sanity and static formats
  const firstImage = tour.images?.[0];
  let cardImage: string | null = null;

  if (firstImage) {
    if (typeof firstImage === "string") {
      // Static format - direct path
      cardImage = firstImage;
    } else if (firstImage.asset) {
      // Sanity format - use image URL builder
      try {
        cardImage = urlFor(firstImage).width(800).height(450).quality(85).url();
      } catch (error) {
        console.error("Error building Sanity image URL:", error);
      }
    }
  }

  // Normalize slug (handle both string and {current: string} formats)
  const tourSlug = typeof tour.slug === "string" ? tour.slug : tour.slug?.current || "";

  // ── Exclusive display variant (Hajj / special tours) ──────────────────────
  if (tour.exclusiveDisplay) {
    return (
      <Link
        href={`/tours/${tourSlug}`}
        className="group relative flex min-h-[200px] overflow-hidden rounded-2xl border border-gold/25 shadow-soft transition hover:border-gold/50 hover:shadow-[0_8px_40px_rgba(199,165,106,0.18)] sm:min-h-[220px]"
      >
        {/* Background image */}
        {cardImage ? (
          <div className="absolute inset-0">
            <Image
              src={cardImage}
              alt={tour.title}
              fill
              sizes="(max-width: 640px) 100vw, 800px"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c1005]/97 via-[#1c1005]/82 to-charcoal/25" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c1005]/97 to-charcoal/70" />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-between p-8 sm:p-10">
          <div className="space-y-3">
            <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
              Hajj · 1448 AH
            </span>
            <h2 className="text-2xl font-semibold text-gold/90 transition group-hover:text-gold sm:text-3xl">
              {tour.title}
            </h2>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm font-medium text-gold/50 transition group-hover:text-gold">
            <span>Explore this journey</span>
            <svg
              className="h-4 w-4 transition group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Decorative crescent — right side */}
        <div className="relative z-10 hidden items-center pr-10 sm:flex">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 text-3xl opacity-50 transition group-hover:opacity-75">
            ☪
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tours/${tourSlug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-charcoal/5 bg-ivory/90 p-5 shadow-sm shadow-charcoal/5 transition hover:-translate-y-1 hover:border-gold/20 hover:shadow-soft"
    >
      {/* Image - 16:9 aspect ratio */}
      <div className="relative aspect-[16/9] w-full flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-tr from-charcoal/80 via-charcoal/40 to-gold-soft/70">
        {cardImage ? (
          <Image
            src={cardImage}
            alt={tour.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover opacity-90 transition group-hover:opacity-100 group-hover:scale-105"
          />
        ) : (
          // Placeholder gradient when no image
          <div className="absolute inset-0 flex items-center justify-center opacity-80 transition group-hover:opacity-100">
            <span className="text-sm font-medium text-ivory/60">{tour.type}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-2">
        {/* Badge + Type tag */}
        <div className="flex items-center gap-2">
          <PackageBadge level={tour.packageLevel} />
          <span className="text-[11px] uppercase tracking-[0.16em] text-charcoal/60">
            {tour.type}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-sm font-semibold text-charcoal transition group-hover:text-gold sm:text-base">
          {tour.title}
        </h2>

        {/* Date & Duration */}
        <p className="text-xs text-charcoal/70">
          {new Date(tour.startDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - {new Date(tour.endDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })} • {tour.durationDays} days
        </p>

        {/* Details */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-charcoal/70">
            <span>{tour.hotelStars}★ hotel</span>
            <span>•</span>
            <span>Meals: {tour.meals}</span>
            {tour.flightIncluded && (
              <>
                <span>•</span>
                <span>✓ Flight included</span>
              </>
            )}
          </div>
          {/* Spiritual Guide - emphasized */}
          {tour.spiritualGuideName && (
            <p className="text-[11px] font-semibold text-gold-dark">
              Guide: {tour.spiritualGuideName}
            </p>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between gap-3 pt-3">
          <div>
            {isOnRequest ? (
              <div>
                <p className="text-xs text-charcoal/60">Price</p>
                <p className="text-lg font-semibold text-charcoal">On request</p>
              </div>
            ) : hasEarlyBird ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gold">
                  Early Bird • Until {new Date(tour.earlyBirdDiscount!.deadline).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xs text-charcoal/50 line-through">
                    ${tour.earlyBirdDiscount!.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-charcoal">
                    ${tour.earlyBirdDiscount!.discountedPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-charcoal/60">From</p>
                <p className="text-lg font-semibold text-charcoal">
                  ${tour.priceFrom.toLocaleString()}
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
    </Link>
  );
}
