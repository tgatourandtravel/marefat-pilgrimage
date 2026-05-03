import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function escapeCSV(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric',
    });
  } catch {
    return d;
  }
}

export async function GET(request: NextRequest) {
  // Auth check (same pattern as other admin routes)
  const session = request.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !bookings) {
    return NextResponse.json({ error: error?.message ?? 'Failed to fetch' }, { status: 500 });
  }

  // Fetch all travelers in one query then group by booking_id
  const bookingIds = bookings.map((b) => b.id);
  const { data: allTravelers } = await supabaseAdmin
    .from('travelers')
    .select('*')
    .in('booking_id', bookingIds)
    .order('traveler_order', { ascending: true });

  const travelersByBooking = new Map<string, typeof allTravelers>();
  (allTravelers ?? []).forEach((t) => {
    const list = travelersByBooking.get(t.booking_id) ?? [];
    list.push(t);
    travelersByBooking.set(t.booking_id, list);
  });

  // CSV columns
  const headers = [
    'Booking Ref',
    'Created At',
    'Status',
    'Payment Status',
    'Payment Method',
    'Tour Title',
    'Tour Destination',
    'Travel Date',
    'Duration (days)',
    'Number of Travelers',
    'Contact First Name',
    'Contact Last Name',
    'Contact Email',
    'Contact Phone',
    'Base Price / Person',
    'Insurance Total',
    'Flight Total',
    'Grand Total',
    'Deposit Amount',
    'Has Insurance',
    'Has Flight Booking',
    'Preferred Departure City',
    'Preferred Return City',
    'Expires At',
    'Verified At',
    'Travelers (Full Names)',
    'Travelers (Passports)',
    'Travelers (Nationalities)',
    'Travelers (DOB)',
    'Travelers (Passport Expiry)',
  ];

  const rows: string[][] = bookings.map((b) => {
    const travelers = travelersByBooking.get(b.id) ?? [];
    const names     = travelers.map((t) => `${t.first_name} ${t.last_name}`).join(' | ');
    const passports = travelers.map((t) => t.passport_number ?? '').join(' | ');
    const nats      = travelers.map((t) => t.nationality ?? '').join(' | ');
    const dobs      = travelers.map((t) => fmtDate(t.date_of_birth)).join(' | ');
    const expiries  = travelers.map((t) => fmtDate(t.passport_expiry)).join(' | ');

    return [
      b.booking_ref,
      fmtDate(b.created_at),
      b.status,
      b.payment_status,
      b.payment_method,
      b.tour_title,
      b.tour_destination ?? '',
      fmtDate(b.tour_start_date),
      b.tour_duration_days ?? '',
      b.number_of_travelers,
      b.contact_first_name ?? '',
      b.contact_last_name ?? '',
      b.contact_email,
      b.contact_phone,
      b.base_price_per_person,
      b.insurance_total ?? 0,
      b.flight_total ?? 0,
      b.grand_total,
      b.deposit_amount,
      b.has_insurance ? 'Yes' : 'No',
      b.has_flight_booking ? 'Yes' : 'No',
      b.preferred_departure_city ?? '',
      b.preferred_return_city ?? '',
      fmtDate(b.expires_at),
      fmtDate(b.verified_at),
      names,
      passports,
      nats,
      dobs,
      expiries,
    ].map(escapeCSV);
  });

  const csvLines = [
    headers.map(escapeCSV).join(','),
    ...rows.map((r) => r.join(',')),
  ];

  const csv = csvLines.join('\r\n');
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `marefat-bookings-${date}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
