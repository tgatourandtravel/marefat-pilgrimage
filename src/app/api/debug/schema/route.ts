import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Temporary diagnostic endpoint — checks which columns exist in the bookings table
export async function GET() {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'not-set';

  // Try selecting each potentially-missing column individually
  const testCols = [
    'contact_first_name',
    'contact_last_name',
    'preferred_departure_city',
    'preferred_return_city',
  ];

  const results: Record<string, string> = {};
  for (const col of testCols) {
    const { error } = await supabaseAdmin
      .from('bookings')
      .select(col)
      .limit(0);
    results[col] = error ? `MISSING: ${error.message}` : 'EXISTS';
  }

  return NextResponse.json({ project_url: projectUrl, columns: results });
}
