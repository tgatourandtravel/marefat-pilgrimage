"use client";

import { useState } from "react";
import Image from "next/image";

export interface ImageGalleryProps {
  images: string[];
  tourTitle: string;
}

export function ImageGallery({ images, tourTitle }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const displayImages = images.slice(0, 6); // Max 6 images

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal/10 to-gold-soft/20 shadow-soft">
        {displayImages[selectedIndex] ? (
          <Image
            src={displayImages[selectedIndex]}
            alt={`${tourTitle} - Image ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 800px"
            className="object-cover"
            priority={selectedIndex === 0}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-charcoal/40">
            <p className="text-sm">Image coming soon</p>
          </div>
        )}
      </div>

      {/* Thumbnail Grid - Only show if multiple images */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`
                relative aspect-[4/3] overflow-hidden rounded-xl transition
                ${
                  selectedIndex === index
                    ? "ring-2 ring-gold ring-offset-2 ring-offset-ivory"
                    : "opacity-70 hover:opacity-100 hover:ring-1 hover:ring-charcoal/20"
                }
              `}
              aria-label={`View image ${index + 1}`}
            >
              {img ? (
                <Image
                  src={img}
                  alt={`${tourTitle} thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 120px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-charcoal/5">
                  <span className="text-xs text-charcoal/40">{index + 1}</span>
                </div>
              )}
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
