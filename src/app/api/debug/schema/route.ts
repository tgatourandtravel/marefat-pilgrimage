import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'not-set';
  const hasServiceKey = !!(process.env.SUPABASE_SERVICE_ROLE_KEY?.length);

  // 1. Check column existence
  const testCols = ['contact_first_name', 'contact_last_name', 'preferred_departure_city', 'preferred_return_city'];
  const colResults: Record<string, string> = {};
  for (const col of testCols) {
    const { error } = await supabaseAdmin.from('bookings').select(col).limit(0);
    colResults[col] = error ? `MISSING: code=${error.code} msg=${error.message}` : 'EXISTS';
  }

  // 2. Try a real insert with ONLY original columns (no new ones) to isolate auth vs schema errors
  const { error: insertErr } = await supabaseAdmin.from('bookings').insert({
    booking_ref: 'DBG-TEST-DELETE-ME',
    tour_slug: 'test',
    tour_title: 'test',
    contact_email: 'test@test.com',
    contact_phone: '0000',
    base_price_per_person: 1,
    number_of_travelers: 1,
    insurance_total: 0,
    flight_total: 0,
    grand_total: 1,
    deposit_amount: 1,
    has_insurance: false,
    has_flight_booking: false,
    payment_method: 'wire',
    payment_status: 'unpaid',
    status: 'pending_verification',
    is_verified: false,
  });

  // Clean up test row if it was inserted
  if (!insertErr) {
    await supabaseAdmin.from('bookings').delete().eq('booking_ref', 'DBG-TEST-DELETE-ME');
  }

  return NextResponse.json({
    project_url: projectUrl,
    has_service_key: hasServiceKey,
    columns: colResults,
    insert_with_original_cols: insertErr
      ? { failed: true, code: insertErr.code, message: insertErr.message }
      : { failed: false },
  });
}
