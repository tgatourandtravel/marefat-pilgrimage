import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function decodeSupabaseJwtPayload(jwt: string | undefined): Record<string, unknown> | null {
  if (!jwt || jwt.split('.').length < 2) return null;
  try {
    const b64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=');
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function parseContentRangeTotal(contentRange: string | null): number | null {
  if (!contentRange) return null;
  const m = /\/(\d+)\s*$/.exec(contentRange);
  return m ? Number(m[1]) : null;
}

export async function GET(request: NextRequest) {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  const sourceProjectRef = supabaseUrl.split('://')[1]?.split('.')[0] || 'unknown';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const jwtPayload = decodeSupabaseJwtPayload(serviceRoleKey);
  const jwtRef = typeof jwtPayload?.ref === 'string' ? jwtPayload.ref : null;
  const jwtRole = typeof jwtPayload?.role === 'string' ? jwtPayload.role : null;
  const runId = `admin-bookings-${Date.now()}`;
  const publicSchema = supabaseAdmin.schema('public');
  const cacheBuster = request.nextUrl.searchParams.get('cb');
  const routeVersion = 'admin-bookings-route-v7';

  // #region agent log
  fetch('http://127.0.0.1:7308/ingest/75ffad5b-1248-480c-a1b9-38e4ca190d00',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8724d0'},body:JSON.stringify({sessionId:'8724d0',runId,hypothesisId:'H1',location:'src/app/api/admin/bookings/route.ts:GET:start',message:'Admin bookings API called',data:{sourceProjectRef,jwtRefMatchesUrl:jwtRef===sourceProjectRef||jwtRef===null,jwtRole},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: explicitData, error: explicitError } = await publicSchema
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  const { count: bookingsCountStar } = await supabaseAdmin
    .from('bookings')
    .select('*', { count: 'exact', head: true });
  const { count: explicitBookingsCountStar } = await publicSchema
    .from('bookings')
    .select('*', { count: 'exact', head: true });
  const { count: bookingsCountId } = await supabaseAdmin
    .from('bookings')
    .select('id', { count: 'exact', head: true });
  const { count: explicitBookingsCountId } = await publicSchema
    .from('bookings')
    .select('id', { count: 'exact', head: true });
  const { count: travelersCount } = await supabaseAdmin
    .from('travelers')
    .select('*', { count: 'exact', head: true });
  const { count: codesCount } = await supabaseAdmin
    .from('verification_codes')
    .select('*', { count: 'exact', head: true });

  let restBookingRows: Record<string, unknown>[] | null = null;

  let restProbe: {
    ok: boolean;
    status: number | null;
    contentRange: string | null;
    totalFromRange: number | null;
    rowCountFromBody: number | null;
    firstRefs: string[];
    error: string | null;
  } = {
    ok: false,
    status: null,
    contentRange: null,
    totalFromRange: null,
    rowCountFromBody: null,
    firstRefs: [],
    error: null,
  };

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
      const cr = restRes.headers.get('content-range');
      const text = await restRes.text();
      let parsed: unknown = null;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch {
        parsed = null;
      }
      const bodyArr = Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : null;
      if (bodyArr) restBookingRows = bodyArr;
      restProbe = {
        ok: restRes.ok,
        status: restRes.status,
        contentRange: cr,
        totalFromRange: parseContentRangeTotal(cr),
        rowCountFromBody: bodyArr ? bodyArr.length : null,
        firstRefs: bodyArr
          ? bodyArr.slice(0, 5).map((b) => (typeof b.booking_ref === 'string' ? b.booking_ref : ''))
          : [],
        error: restRes.ok ? null : text.slice(0, 200),
      };
    } catch (e) {
      restProbe = {
        ...restProbe,
        error: e instanceof Error ? e.message : 'rest_fetch_failed',
      };
    }
  } else {
    restProbe = { ...restProbe, error: 'missing_supabase_url_or_service_role' };
  }

  if (error) {
    // #region agent log
    fetch('http://127.0.0.1:7308/ingest/75ffad5b-1248-480c-a1b9-38e4ca190d00',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8724d0'},body:JSON.stringify({sessionId:'8724d0',runId,hypothesisId:'H2err',location:'src/app/api/admin/bookings/route.ts:GET:error',message:'Admin bookings query failed',data:{error:error.message,bookingsCountStar,bookingsCountId,restProbe},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
  const restBodyLen = restProbe.rowCountFromBody;
  const useRestBookings =
    restBookingRows &&
    restProbe.ok &&
    typeof restBodyLen === 'number' &&
    restBodyLen !== jsRows &&
    restBodyLen === restBookingRows.length;

  const effectiveBookings = useRestBookings
    ? (restBookingRows as typeof data)
    : data;
  const bookingsSource: 'rest' | 'supabase_js' = useRestBookings ? 'rest' : 'supabase_js';

  // #region agent log
  fetch('http://127.0.0.1:7308/ingest/75ffad5b-1248-480c-a1b9-38e4ca190d00',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8724d0'},body:JSON.stringify({sessionId:'8724d0',runId,hypothesisId:'H2ok',location:'src/app/api/admin/bookings/route.ts:GET:success',message:'Admin bookings resolved',data:{bookingsSource,jsRows,restBodyLen:restProbe.rowCountFromBody,returnedRows:Array.isArray(effectiveBookings)?effectiveBookings.length:null,bookingsCountId,bookingsCountStar,restTotalFromRange:restProbe.totalFromRange,jwtRefMatchesUrl:jwtRef===sourceProjectRef},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  return NextResponse.json(
    {
      bookings: effectiveBookings,
      sourceProjectRef,
      fetchedAt: new Date().toISOString(),
      routeVersion,
      cacheBusterEcho: cacheBuster,
      debug: {
        returnedRows: Array.isArray(effectiveBookings) ? effectiveBookings.length : 0,
        bookingsCount: bookingsCountId ?? bookingsCountStar ?? 0,
        bookingsCountStar: bookingsCountStar ?? 0,
        bookingsCountId: bookingsCountId ?? 0,
        explicitReturnedRows: Array.isArray(explicitData) ? explicitData.length : 0,
        explicitBookingsCount: explicitBookingsCountId ?? explicitBookingsCountStar ?? 0,
        explicitBookingsCountStar: explicitBookingsCountStar ?? 0,
        explicitBookingsCountId: explicitBookingsCountId ?? 0,
        travelersCount: travelersCount ?? 0,
        codesCount: codesCount ?? 0,
        firstRefs: Array.isArray(effectiveBookings)
          ? effectiveBookings.slice(0, 5).map((b) => b.booking_ref)
          : [],
        explicitFirstRefs: Array.isArray(explicitData) ? explicitData.slice(0, 5).map((b) => b.booking_ref) : [],
        explicitError: explicitError?.message ?? null,
        bookingsSource,
        jwtRef,
        jwtRefMatchesUrl: jwtRef === sourceProjectRef,
        jsClientBookingRows: jsRows,
        restProbe,
        restJsRowMismatch:
          typeof restBodyLen === 'number' && restBodyLen !== jsRows ? { restBodyLen, jsRows } : null,
        requestPath: request.nextUrl.pathname,
      },
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
