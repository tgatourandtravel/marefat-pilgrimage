/* All Tours listing with advanced filters */
import { getAllTours as getSanityTours } from "@/lib/sanity/queries";
import { Tour } from "@/lib/sanity/types";
import ToursClient from "./ToursClient";

export default async function ToursPage() {
  // Fetch tours from Sanity (fallback to static data if Sanity not configured)
  let tours: any[] = [];
  
  try {
    tours = await getSanityTours();
  } catch (error) {
    console.error("Failed to fetch tours from Sanity:", error);
    // Fallback to static data
    const { getAllTours } = await import("@/data/tours");
    tours = getAllTours();
  }

  return <ToursClient tours={tours} />;
}
