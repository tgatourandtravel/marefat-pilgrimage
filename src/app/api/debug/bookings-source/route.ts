import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sourceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const sourceProjectRef = sourceUrl.split("://")[1]?.split(".")[0] || "unknown";

  const implicit = await supabaseAdmin
    .from("bookings")
    .select("id,booking_ref,created_at")
    .order("created_at", { ascending: false });

  const explicit = await supabaseAdmin
    .schema("public")
    .from("bookings")
    .select("id,booking_ref,created_at")
    .order("created_at", { ascending: false });

  const implicitCount = await supabaseAdmin
    .from("bookings")
    .select("*", { count: "exact", head: true });

  const explicitCount = await supabaseAdmin
    .schema("public")
    .from("bookings")
    .select("*", { count: "exact", head: true });

  const travelersCount = await supabaseAdmin
    .from("travelers")
    .select("*", { count: "exact", head: true });

  const codesCount = await supabaseAdmin
    .from("verification_codes")
    .select("*", { count: "exact", head: true });

  return NextResponse.json(
    {
      sourceProjectRef,
      now: new Date().toISOString(),
      implicit: {
        error: implicit.error?.message ?? null,
        rows: implicit.data?.length ?? 0,
        refs: (implicit.data ?? []).slice(0, 10).map((r) => r.booking_ref),
      },
      explicit: {
        error: explicit.error?.message ?? null,
        rows: explicit.data?.length ?? 0,
        refs: (explicit.data ?? []).slice(0, 10).map((r) => r.booking_ref),
      },
      counts: {
        implicitBookings: implicitCount.count ?? 0,
        explicitBookings: explicitCount.count ?? 0,
        travelers: travelersCount.count ?? 0,
        verificationCodes: codesCount.count ?? 0,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

