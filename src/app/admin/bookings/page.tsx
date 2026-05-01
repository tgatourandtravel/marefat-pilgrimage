'use client';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Booking } from '@/lib/supabase/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'unpaid' | 'paid';

interface StatusConfig {
    label: string;
    className: string;
}

// ─── Status Badge Components ──────────────────────────────────────────────────

const PAYMENT_STATUS_MAP: Record<string, StatusConfig> = {
    unpaid: { label: 'Unpaid', className: 'bg-danger/10 text-danger border-danger/20' },
    paid: { label: 'Paid', className: 'bg-gold/10 text-gold-dark border-gold/30' },
    requires_action: { label: 'Pending', className: 'bg-charcoal/5 text-charcoal/60 border-charcoal/10' },
    failed: { label: 'Failed', className: 'bg-danger/10 text-danger border-danger/20' },
    refunded: { label: 'Refunded', className: 'bg-charcoal/5 text-charcoal/50 border-charcoal/10' },
};

const BOOKING_STATUS_MAP: Record<string, StatusConfig> = {
    pending_verification: { label: 'Pending', className: 'bg-charcoal/5 text-charcoal/50 border-charcoal/10' },
    verified: { label: 'Verified', className: 'bg-charcoal/10 text-charcoal/70 border-charcoal/15' },
    awaiting_card_payment: { label: 'Awaiting Card', className: 'bg-gold/10 text-gold-dark border-gold/20' },
    deposit_paid: { label: 'Deposit Paid', className: 'bg-gold/20 text-gold-dark border-gold/30' },
    fully_paid: { label: 'Fully Paid', className: 'bg-gold/30 text-gold-dark border-gold/40' },
    confirmed: { label: 'Confirmed', className: 'bg-charcoal/80 text-ivory border-charcoal' },
    cancelled: { label: 'Cancelled', className: 'bg-danger/10 text-danger border-danger/20' },
    expired: { label: 'Expired', className: 'bg-charcoal/5 text-charcoal/30 border-charcoal/10' },
};

function StatusPill({ config }: { config: StatusConfig }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${config.className}`}>
            {config.label}
        </span>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, highlight }: {
    label: string;
    value: number;
    highlight?: 'gold' | 'danger';
}) {
    const valueColor =
        highlight === 'danger' ? 'text-danger' :
            highlight === 'gold' ? 'text-gold-dark' :
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
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingPaid, setMarkingPaid] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');

    const fetchBookings = useCallback(async () => {
        const res = await fetch('/api/admin/bookings');
        const data = await res.json();
        setBookings(data.bookings ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    async function handleMarkPaid(id: string) {
        if (!confirm('Mark this booking as paid? This action cannot be undone.')) return;
        setMarkingPaid(id);
        await fetch(`/api/admin/bookings/${id}/mark-paid`, { method: 'POST' });
        await fetchBookings();
        setMarkingPaid(null);
    }

    async function handleLogout() {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    }

    // ── Derived counts ──
    const pendingCount = bookings.filter(b => b.payment_status === 'unpaid' && b.payment_method !== 'card').length;
    const paidCount = bookings.filter(b => b.payment_status === 'paid').length;

    const filtered = bookings.filter(b => {
        if (filter === 'unpaid') return b.payment_status === 'unpaid' && b.payment_method !== 'card';
        if (filter === 'paid') return b.payment_status === 'paid';
        return true;
    });

    const filterTabs: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'All Bookings' },
        { key: 'unpaid', label: `Awaiting Payment (${pendingCount})` },
        { key: 'paid', label: 'Paid' },
    ];

    // ── Loading state ──
    if (loading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <p className="text-sm text-charcoal/40 tracking-wide">Loading bookings…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory">

            {/* ── Header ── */}
            <header className="bg-ivory/80 backdrop-blur-sm border-b border-charcoal/8 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <p className="text-xs tracking-widest uppercase text-charcoal/40">Marefat</p>
                        <span className="text-charcoal/20">/</span>
                        <p className="text-sm font-medium text-charcoal">Bookings</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Sign Out
                    </Button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

                {/* ── Stats ── */}
                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Total Bookings" value={bookings.length} />
                    <StatCard label="Awaiting Payment" value={pendingCount} highlight="danger" />
                    <StatCard label="Paid" value={paidCount} highlight="gold" />
                </div>

                {/* ── Filter Tabs ── */}
                <div className="flex gap-2">
                    {filterTabs.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all border ${filter === key
                                    ? 'bg-charcoal text-ivory border-charcoal'
                                    : 'bg-transparent text-charcoal/50 border-charcoal/15 hover:border-charcoal/30 hover:text-charcoal'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* ── Table ── */}
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
                                    const bookingCfg = BOOKING_STATUS_MAP[booking.status] ?? { label: booking.status, className: 'bg-charcoal/5 text-charcoal/40 border-charcoal/10' };
                                    const canMarkPaid = booking.payment_status === 'unpaid' && booking.payment_method !== 'card';

                                    return (
                                        <tr key={booking.id} className="hover:bg-charcoal/[0.02] transition-colors">
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
                                                {canMarkPaid && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        isLoading={markingPaid === booking.id}
                                                        onClick={() => handleMarkPaid(booking.id)}
                                                    >
                                                        Mark Paid
                                                    </Button>
                                                )}
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