import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'expired' })
    .lt('expires_at', new Date().toISOString())
    .in('status', ['pending_verification', 'verified'])
    .eq('payment_status', 'unpaid')
    .select('id, booking_ref');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    expired: data?.length ?? 0,
    refs: data?.map(b => b.booking_ref) ?? [],
  });
}