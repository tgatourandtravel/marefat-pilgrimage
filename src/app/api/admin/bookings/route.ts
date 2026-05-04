import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const sourceProjectRef = supabaseUrl.split('://')[1]?.split('.')[0] || 'unknown';
  const runId = `admin-bookings-${Date.now()}`;

  // #region agent log
  fetch('http://127.0.0.1:7308/ingest/75ffad5b-1248-480c-a1b9-38e4ca190d00',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8724d0'},body:JSON.stringify({sessionId:'8724d0',runId,hypothesisId:'H1',location:'src/app/api/admin/bookings/route.ts:GET:start',message:'Admin bookings API called',data:{sourceProjectRef},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  const { count: bookingsCount } = await supabaseAdmin
    .from('bookings')
    .select('*', { count: 'exact', head: true });
  const { count: travelersCount } = await supabaseAdmin
    .from('travelers')
    .select('*', { count: 'exact', head: true });
  const { count: codesCount } = await supabaseAdmin
    .from('verification_codes')
    .select('*', { count: 'exact', head: true });

  // #region agent log
  fetch('http://127.0.0.1:7308/ingest/75ffad5b-1248-480c-a1b9-38e4ca190d00',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8724d0'},body:JSON.stringify({sessionId:'8724d0',runId,hypothesisId:'H2',location:'src/app/api/admin/bookings/route.ts:GET:post-query',message:'Admin bookings query results',data:{returnedRows:Array.isArray(data)?data.length:null,bookingsCount,travelersCount,codesCount,firstRefs:Array.isArray(data)?data.slice(0,3).map((b)=>b.booking_ref):[]},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  if (error) {
    // #region agent log
    fetch('http://127.0.0.1:7308/ingest/75ffad5b-1248-480c-a1b9-38e4ca190d00',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8724d0'},body:JSON.stringify({sessionId:'8724d0',runId,hypothesisId:'H3',location:'src/app/api/admin/bookings/route.ts:GET:error',message:'Admin bookings query failed',data:{error:error.message},timestamp:Date.now()})}).catch(()=>{});
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

  return NextResponse.json(
    {
      bookings: data,
      sourceProjectRef,
      fetchedAt: new Date().toISOString(),
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
