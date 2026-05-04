import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  let restBookingRows: Record<string, unknown>[] | null = null;
  let restOk = false;

  if (supabaseUrl && serviceRoleKey) {
    try {
      const restUrl = `${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc`;
      const restRes = await fetch(restUrl, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Accept: 'application/json',
          Prefer: 'count=exact',
        },
        cache: 'no-store',
      });
      const text = await restRes.text();
      let parsed: unknown = null;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch {
        parsed = null;
      }
      const bodyArr = Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : null;
      restOk = restRes.ok;
      if (restRes.ok && bodyArr) restBookingRows = bodyArr;
    } catch {
      restOk = false;
    }
  }

  if (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }

  const jsRows = Array.isArray(data) ? data.length : 0;
  const restRows = Array.isArray(restBookingRows) ? restBookingRows.length : null;
  const useRestBookings =
    restOk &&
    restRows !== null &&
    restRows !== jsRows;
  const effectiveBookings = useRestBookings ? (restBookingRows as typeof data) : data;

  return NextResponse.json(
    {
      bookings: effectiveBookings,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}
