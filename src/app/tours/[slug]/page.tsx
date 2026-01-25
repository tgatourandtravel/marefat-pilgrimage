import Link from "next/link";
import type { Metadata } from "next";
import { getTourBySlug, getAllTours } from "@/data/tours";
import TourDetailClient from "./TourDetailClient";

// Generate static params for all tours
export function generateStaticParams() {
  return getAllTours().map((tour) => ({
    slug: tour.slug,
  }));
}

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const tour = getTourBySlug(params.slug);
  if (!tour) {
    return {
      title: "Tour not found – Marefat Pilgrimage",
    };
  }
  return {
    title: `${tour.title} – Marefat Pilgrimage`,
    description: tour.description,
  };
}

export default function TourDetailPage({ params }: Props) {
  const tour = getTourBySlug(params.slug);

  if (!tour) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-12">
        <p className="text-sm text-charcoal/70">
          The requested tour could not be found. You can{" "}
          <Link
            href="/tours"
            className="font-medium text-charcoal underline-offset-4 hover:underline"
          >
            browse all tours
          </Link>{" "}
          or{" "}
          <Link
            href="/contact"
            className="font-medium text-charcoal underline-offset-4 hover:underline"
          >
            contact our team
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="bg-ivory">
      <TourDetailClient tour={tour} />
    </main>
  );
}
