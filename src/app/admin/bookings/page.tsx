'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Booking } from '@/lib/supabase/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'unpaid' | 'paid' | 'archived';
type SortType = 'newest' | 'oldest' | 'amount_desc' | 'amount_asc';
type DatePreset = 'all' | 'today' | '7d' | '30d' | 'custom';

interface StatusConfig {
  label: string;
  className: string;
}

// ─── Status Maps ──────────────────────────────────────────────────────────────

const PAYMENT_STATUS_MAP: Record<string, StatusConfig> = {
  unpaid:          { label: 'Unpaid',   className: 'bg-danger/10 text-danger border-danger/20' },
  paid:            { label: 'Paid',     className: 'bg-gold/10 text-gold-dark border-gold/30' },
  requires_action: { label: 'Pending',  className: 'bg-charcoal/5 text-charcoal/60 border-charcoal/10' },
  failed:          { label: 'Failed',   className: 'bg-danger/10 text-danger border-danger/20' },
  refunded:        { label: 'Refunded', className: 'bg-charcoal/5 text-charcoal/50 border-charcoal/10' },
};

const BOOKING_STATUS_MAP: Record<string, StatusConfig> = {
  pending_verification:  { label: 'Pending',       className: 'bg-charcoal/5 text-charcoal/50 border-charcoal/10' },
  verified:              { label: 'Verified',      className: 'bg-charcoal/10 text-charcoal/70 border-charcoal/15' },
  awaiting_card_payment: { label: 'Awaiting Card', className: 'bg-gold/10 text-gold-dark border-gold/20' },
  deposit_paid:          { label: 'Deposit Paid',  className: 'bg-gold/20 text-gold-dark border-gold/30' },
  fully_paid:            { label: 'Fully Paid',    className: 'bg-gold/30 text-gold-dark border-gold/40' },
  confirmed:             { label: 'Confirmed',     className: 'bg-charcoal/80 text-ivory border-charcoal' },
  cancelled:             { label: 'Cancelled',     className: 'bg-danger/10 text-danger border-danger/20' },
  expired:               { label: 'Expired',       className: 'bg-charcoal/5 text-charcoal/30 border-charcoal/10' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ config }: { config: StatusConfig }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${config.className}`}>
      {config.label}
    </span>
  );
}

function StatCard({ label, value, highlight }: {
  label: string;
  value: number;
  highlight?: 'gold' | 'danger';
}) {
  const valueColor =
    highlight === 'danger' ? 'text-danger' :
    highlight === 'gold'   ? 'text-gold-dark' :
    'text-charcoal';
  return (
    <Card variant="elevated" padding="lg">
      <p className="text-xs uppercase tracking-wider text-charcoal/40 mb-1">{label}</p>
      <p className={`text-3xl font-semibold ${valueColor}`}>{value}</p>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchBookings = useCallback(async () => {
    const res = await fetch('/api/admin/bookings', {
      cache: 'no-store',
      headers: {
        'cache-control': 'no-cache',
        pragma: 'no-cache',
      },
    });
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function handleMarkPaid(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm('Mark this booking as paid? This cannot be undone.')) return;
    setMarkingPaid(id);
    await fetch(`/api/admin/bookings/${id}/mark-paid`, { method: 'POST' });
    await fetchBookings();
    setMarkingPaid(null);
  }

  async function handleArchive(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm('Archive this booking from active lists? You can still view it in Archived tab.')) return;
    setArchivingId(id);
    await fetch(`/api/admin/bookings/${id}/archive`, { method: 'POST' });
    await fetchBookings();
    setArchivingId(null);
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  async function handleExportCSV() {
    const res = await fetch('/api/admin/bookings/export');
    if (!res.ok) { alert('Export failed.'); return; }
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `marefat-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const pendingCount = bookings.filter(b => b.payment_status === 'unpaid' && b.payment_method !== 'card' && b.status !== 'cancelled').length;
  const paidCount    = bookings.filter(b => b.payment_status === 'paid' && b.status !== 'cancelled').length;
  const archivedCount = bookings.filter(b => b.status === 'cancelled').length;

  const filtered = useMemo(() => {
    const now = new Date();
    const query = search.trim().toLowerCase();

    const byTab = bookings.filter(b => {
      if (filter === 'unpaid') return b.payment_status === 'unpaid' && b.payment_method !== 'card' && b.status !== 'cancelled';
      if (filter === 'paid') return b.payment_status === 'paid' && b.status !== 'cancelled';
      if (filter === 'archived') return b.status === 'cancelled';
      return b.status !== 'cancelled';
    });

    const bySearch = byTab.filter((b) => {
      if (!query) return true;
      const haystack = [
        b.booking_ref,
        b.contact_first_name,
        b.contact_last_name,
        b.contact_email,
        b.tour_title,
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });

    const byDate = bySearch.filter((b) => {
      const created = new Date(b.created_at);
      if (datePreset === 'all') return true;
      if (datePreset === 'today') {
        return created.toDateString() === now.toDateString();
      }
      if (datePreset === '7d') {
        return (now.getTime() - created.getTime()) <= 7 * 24 * 60 * 60 * 1000;
      }
      if (datePreset === '30d') {
        return (now.getTime() - created.getTime()) <= 30 * 24 * 60 * 60 * 1000;
      }
      if (!fromDate && !toDate) return true;
      const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
      const to = toDate ? new Date(`${toDate}T23:59:59`) : null;
      if (from && created < from) return false;
      if (to && created > to) return false;
      return true;
    });

    const sorted = [...byDate];
    sorted.sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'amount_desc') return b.deposit_amount - a.deposit_amount;
      if (sortBy === 'amount_asc') return a.deposit_amount - b.deposit_amount;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return sorted;
  }, [bookings, filter, search, sortBy, datePreset, fromDate, toDate]);

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: 'all',    label: 'All Bookings' },
    { key: 'unpaid', label: `Awaiting Payment (${pendingCount})` },
    { key: 'paid',   label: 'Paid' },
    { key: 'archived', label: `Archived (${archivedCount})` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-sm text-charcoal/40 tracking-wide">Loading bookings…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">

      {/* Header */}
      <header className="bg-ivory/80 backdrop-blur-sm border-b border-charcoal/8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-xs tracking-widest uppercase text-charcoal/40">Marefat</p>
            <span className="text-charcoal/20">/</span>
            <p className="text-sm font-medium text-charcoal">Bookings</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-full border border-charcoal/15 px-3.5 py-1.5 text-xs font-medium text-charcoal/60 transition hover:border-charcoal/30 hover:text-charcoal"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M8 2v8M5 7l3 3 3-3M2 12h12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export CSV
            </button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Bookings"   value={bookings.length} />
          <StatCard label="Awaiting Payment" value={pendingCount} highlight="danger" />
          <StatCard label="Paid"             value={paidCount}    highlight="gold" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all border ${
                filter === key
                  ? 'bg-charcoal text-ivory border-charcoal'
                  : 'bg-transparent text-charcoal/50 border-charcoal/15 hover:border-charcoal/30 hover:text-charcoal'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <Card variant="bordered" padding="md">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ref, guest, email, tour..."
              className="rounded-xl border border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal outline-none transition focus:border-charcoal/40"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="rounded-xl border border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal outline-none transition focus:border-charcoal/40"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="amount_desc">Deposit high to low</option>
              <option value="amount_asc">Deposit low to high</option>
            </select>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value as DatePreset)}
              className="rounded-xl border border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal outline-none transition focus:border-charcoal/40"
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="custom">Custom range</option>
            </select>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              disabled={datePreset !== 'custom'}
              className="rounded-xl border border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal outline-none transition focus:border-charcoal/40 disabled:opacity-50"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              disabled={datePreset !== 'custom'}
              className="rounded-xl border border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal outline-none transition focus:border-charcoal/40 disabled:opacity-50"
            />
          </div>
        </Card>

        {/* Table */}
        <Card variant="elevated" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/8">
                  {['Ref', 'Guest', 'Tour', 'Amount', 'Method', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-charcoal/40 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {filtered.map(booking => {
                  const paymentCfg = PAYMENT_STATUS_MAP[booking.payment_status] ?? { label: booking.payment_status, className: 'bg-charcoal/5 text-charcoal/40 border-charcoal/10' };
                  const bookingCfg = BOOKING_STATUS_MAP[booking.status]         ?? { label: booking.status,         className: 'bg-charcoal/5 text-charcoal/40 border-charcoal/10' };
                  const canMarkPaid = booking.payment_status === 'unpaid' && booking.payment_method !== 'card';
                  const canArchive = booking.status !== 'cancelled';

                  return (
                    <tr
                      key={booking.id}
                      onClick={() => router.push(`/admin/bookings/${booking.id}` as never)}
                      className="hover:bg-charcoal/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-charcoal/50">
                        {booking.booking_ref}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-charcoal">
                          {booking.contact_first_name} {booking.contact_last_name}
                        </p>
                        <p className="text-xs text-charcoal/40 mt-0.5">{booking.contact_email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-charcoal">{booking.tour_title}</p>
                        <p className="text-xs text-charcoal/40 mt-0.5">
                          {booking.number_of_travelers} traveler{booking.number_of_travelers > 1 ? 's' : ''}
                        </p>
                        {booking.has_flight_booking && (
                          <p className="text-xs text-gold-dark mt-1 flex items-center gap-1">
                            <span>✈</span>
                            <span>
                              {booking.preferred_departure_city && booking.preferred_return_city
                                ? `${booking.preferred_departure_city} → ${booking.preferred_return_city}`
                                : 'Flight requested'}
                            </span>
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-charcoal">
                          ${booking.deposit_amount.toLocaleString('en-US')}
                          <span className="text-xs text-charcoal/40 font-normal ml-1">deposit</span>
                        </p>
                        <p className="text-xs text-charcoal/40 mt-0.5">
                          of ${booking.grand_total.toLocaleString('en-US')} total
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="charcoal" size="sm">
                          {booking.payment_method}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 space-y-1">
                        <StatusPill config={paymentCfg} />
                        <br />
                        <StatusPill config={bookingCfg} />
                      </td>
                      <td className="px-5 py-4 text-xs text-charcoal/40 whitespace-nowrap">
                        {new Date(booking.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {canMarkPaid && (
                            <Button
                              variant="secondary"
                              size="sm"
                              isLoading={markingPaid === booking.id}
                              onClick={(e) => handleMarkPaid(e, booking.id)}
                            >
                              Mark Paid
                            </Button>
                          )}
                          {canArchive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              isLoading={archivingId === booking.id}
                              onClick={(e) => handleArchive(e, booking.id)}
                            >
                              Archive
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-charcoal/30">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}