"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export interface ImageGalleryProps {
  images: string[];
  tourTitle: string;
  autoplayInterval?: number; // ms, default 5000
}

const AUTOPLAY_DELAY = 5000;

export function ImageGallery({
  images,
  tourTitle,
  autoplayInterval = AUTOPLAY_DELAY,
}: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayImages = images.slice(0, 8);
  const count = displayImages.length;

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + count) % count),
    [count]
  );

  const next = useCallback(
    () => setCurrent((i) => (i + 1) % count),
    [count]
  );

  // Autoplay
  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const id = setInterval(next, autoplayInterval);
    return () => clearInterval(id);
  }, [count, isPaused, next, autoplayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStartX(e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    setTouchStartX(null);
  };

  if (!images || count === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main image + controls */}
      <div
        ref={containerRef}
        tabIndex={0}
        className="group relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal/10 to-gold-soft/20 shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        {displayImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== current}
          >
            <Image
              src={src}
              alt={`${tourTitle} — photo ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 800px"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Gradient overlays for arrow visibility */}
        {count > 1 && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-charcoal/20 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-charcoal/20 to-transparent" />
          </>
        )}

        {/* Prev / Next arrows */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition hover:bg-white active:scale-95 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg className="h-4 w-4 text-charcoal" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition hover:bg-white active:scale-95 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg className="h-4 w-4 text-charcoal" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Slide counter badge (top-right) */}
        {count > 1 && (
          <div className="absolute right-3 top-3 rounded-full bg-charcoal/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {current + 1} / {count}
          </div>
        )}
      </div>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Image navigation">
          {displayImages.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === current}
              aria-label={`Go to image ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-6 bg-gold"
                  : "w-1.5 bg-charcoal/25 hover:bg-charcoal/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip — desktop only */}
      {count > 1 && (
        <div className="hidden sm:grid sm:grid-cols-6 sm:gap-3">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl transition ${
                index === current
                  ? "ring-2 ring-gold ring-offset-2 ring-offset-ivory"
                  : "opacity-60 hover:opacity-100 hover:ring-1 hover:ring-charcoal/20"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img}
                alt={`${tourTitle} thumbnail ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Instagram CTA */}
      <div className="rounded-xl border border-charcoal/5 bg-ivory/90 p-4 text-center shadow-sm shadow-charcoal/5">
        <p className="text-sm text-charcoal/70">
          Want to see more photos from hotels and traveler experiences?
        </p>
        <a
          href="https://instagram.com/marefat.pilgrimage"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-gold transition hover:text-gold-dark"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          Check our Instagram @marefatpilgrimage
        </a>
      </div>
    </div>
  );
}
