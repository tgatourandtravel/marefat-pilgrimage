'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Booking, Traveler } from '@/lib/supabase/types';
import ConfirmBookingModal from '@/components/admin/ConfirmBookingModal';

// ─── Section Component ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card variant="elevated" padding="lg">
      <h2 className="text-xs uppercase tracking-widest text-charcoal/40 font-semibold mb-4">
        {title}
      </h2>
      {children}
    </Card>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-charcoal/5 last:border-0">
      <span className="text-xs text-charcoal/50 w-40 shrink-0">{label}</span>
      <span className="text-sm text-charcoal font-medium text-right">
        {value ?? <span className="text-charcoal/30 font-normal">—</span>}
      </span>
    </div>
  );
}

// ─── Status Pills ─────────────────────────────────────────────────────────────

const PAYMENT_STATUS: Record<string, string> = {
  unpaid:          'bg-danger/10 text-danger border-danger/20',
  paid:            'bg-gold/10 text-gold-dark border-gold/30',
  requires_action: 'bg-charcoal/5 text-charcoal/60 border-charcoal/10',
  failed:          'bg-danger/10 text-danger border-danger/20',
};

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${className}`}>
      {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/admin/bookings/${id}`);
    if (!res.ok) { router.push('/admin/bookings' as never); return; }
    const data = await res.json();
    setBooking(data.booking);
    setTravelers(data.travelers);
    setLoading(false);
  }, [id, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleMarkPaid() {
    if (!confirm('Mark this booking as paid? This cannot be undone.')) return;
    setMarkingPaid(true);
    await fetch(`/api/admin/bookings/${id}/mark-paid`, { method: 'POST' });
    await fetchData();
    setMarkingPaid(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-sm text-charcoal/40">Loading…</p>
      </div>
    );
  }

  if (!booking) return null;

  const canMarkPaid = booking.payment_status === 'unpaid' && booking.payment_method !== 'card';
  const paymentStatusClass = PAYMENT_STATUS[booking.payment_status] ?? 'bg-charcoal/5 text-charcoal/40 border-charcoal/10';

  return (
    <div className="min-h-screen bg-ivory">

      {/* Header */}
      <header className="bg-ivory/80 backdrop-blur-sm border-b border-charcoal/8 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/bookings' as never)}
              className="text-xs text-charcoal/40 hover:text-charcoal transition"
            >
              ← Bookings
            </button>
            <span className="text-charcoal/20">/</span>
            <p className="text-sm font-mono text-charcoal">{booking.booking_ref}</p>
          </div>
          <StatusPill label={booking.payment_status} className={paymentStatusClass} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">

        {/* Action Bar */}
        {canMarkPaid && (
          <div className="bg-gold/10 border border-gold/20 rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">Awaiting payment confirmation</p>
              <p className="text-xs text-charcoal/50 mt-0.5">
                {booking.payment_method.toUpperCase()} — ${booking.deposit_amount.toLocaleString('en-US')} deposit
              </p>
            </div>
            <Button variant="secondary" size="sm" isLoading={markingPaid} onClick={handleMarkPaid}>
              Mark as Paid
            </Button>
          </div>
        )}

        {booking.payment_status === 'paid' && booking.status !== 'confirmed' && (
          <div className="bg-charcoal/5 border border-charcoal/10 rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">Deposit received</p>
              <p className="text-xs text-charcoal/50 mt-0.5">Ready to confirm this booking</p>
            </div>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="rounded-xl bg-charcoal px-5 py-2.5 text-sm font-semibold text-white hover:bg-charcoal/80"
            >
              Confirm Booking
            </button>
          </div>
        )}

        {/* Booking Info */}
        <Section title="Booking">
          <Row label="Reference"      value={booking.booking_ref} />
          <Row label="Tour"           value={booking.tour_title} />
          <Row label="Destination"    value={booking.tour_destination ?? undefined} />
          <Row label="Travel Date"    value={booking.tour_start_date
            ? new Date(booking.tour_start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            : undefined}
          />
          <Row label="Duration"       value={booking.tour_duration_days ? `${booking.tour_duration_days} days` : undefined} />
          <Row label="Travelers"      value={booking.number_of_travelers} />
          <Row label="Status"         value={booking.status} />
          <Row label="Created"        value={new Date(booking.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
        </Section>

        {/* Contact */}
        <Section title="Booking Contact">
          <Row label="Name"   value={`${booking.contact_first_name} ${booking.contact_last_name}`} />
          <Row label="Email"  value={booking.contact_email} />
          <Row label="Phone"  value={booking.contact_phone} />
        </Section>

        {/* Payment */}
        <Section title="Payment">
          <Row label="Method"       value={booking.payment_method.toUpperCase()} />
          <Row label="Status"       value={booking.payment_status} />
          <Row label="Deposit"      value={`$${booking.deposit_amount.toLocaleString('en-US')}`} />
          <Row label="Grand Total"  value={`$${booking.grand_total.toLocaleString('en-US')}`} />
          <Row label="Paid At"      value={booking.payment_paid_at
            ? new Date(booking.payment_paid_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            : undefined}
          />
          {booking.stripe_payment_intent_id && (
            <Row label="Stripe ID" value={booking.stripe_payment_intent_id} />
          )}
        </Section>

        {/* Flight Request */}
        {booking.has_flight_booking && (
          <Section title="Flight Request">
            <Row label="Departure City" value={booking.preferred_departure_city ?? undefined} />
            <Row label="Return City"    value={booking.preferred_return_city ?? undefined} />
            <p className="text-xs text-charcoal/40 mt-3">
              Flight pricing is quoted separately by the operations team.
            </p>
          </Section>
        )}

        {/* Travelers */}
        <Section title={`Travelers (${travelers.length})`}>
          <div className="space-y-4">
            {travelers.map((traveler, index) => (
              <div key={traveler.id} className="pt-4 first:pt-0 border-t border-charcoal/5 first:border-0">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold text-charcoal">
                    Traveler {traveler.traveler_order}
                  </p>
                  {traveler.is_primary_contact && (
                    <Badge variant="gold" size="xs">Booker</Badge>
                  )}
                </div>
                <Row label="Full Name"        value={`${traveler.first_name} ${traveler.last_name}`} />
                <Row label="Date of Birth"    value={traveler.date_of_birth} />
                <Row label="Nationality"      value={traveler.nationality} />
                <Row label="Passport No."     value={traveler.passport_number} />
                <Row label="Passport Expiry"  value={traveler.passport_expiry} />
              </div>
            ))}
          </div>
        </Section>

      </div>

      {showConfirmModal && (
        <ConfirmBookingModal
          bookingId={booking.id}
          bookingRef={booking.booking_ref}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}