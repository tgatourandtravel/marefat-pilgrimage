//import { NextRequest, NextResponse } from 'next/server';
//import { supabaseAdmin } from '@/lib/supabase/server';

/*export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, booking: data });
}
*/