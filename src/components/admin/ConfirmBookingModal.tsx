'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface HotelDetails {
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  meal: string;
}

interface Props {
  bookingId: string;
  bookingRef: string;
  onClose: () => void;
}

const emptyHotel = (): HotelDetails => ({
  name: '',
  address: '',
  checkIn: '',
  checkOut: '',
  roomType: '',
  meal: '',
});

const ROOM_TYPES = [
  { value: '', label: 'Select room type' },
  { value: 'Single', label: 'Single' },
  { value: 'Double', label: 'Double' },
  { value: 'Triple', label: 'Triple' },
  { value: 'Quad', label: 'Quad' },
];

const MEAL_PLANS = [
  { value: '', label: 'Select meal plan' },
  { value: 'Room Only', label: 'Room Only' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Half Board', label: 'Half Board (Breakfast & Dinner)' },
  { value: 'Full Board', label: 'Full Board' },
  { value: 'All Inclusive', label: 'All Inclusive' },
];

function HotelSection({
  city,
  hotel,
  errors,
  onChange,
}: {
  city: string;
  hotel: HotelDetails;
  errors: Partial<Record<keyof HotelDetails, string>>;
  onChange: (field: keyof HotelDetails, value: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-charcoal/8" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
          {city}
        </span>
        <div className="h-px flex-1 bg-charcoal/8" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Hotel Name"
          size="sm"
          placeholder={city === 'Medina' ? 'e.g. Hilton Madinah' : 'e.g. Swissôtel Makkah'}
          value={hotel.name}
          onChange={(e) => onChange('name', e.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="Address"
          size="sm"
          placeholder="Street / district"
          value={hotel.address}
          onChange={(e) => onChange('address', e.target.value)}
        />
        <Input
          label="Check-in Date"
          type="date"
          size="sm"
          value={hotel.checkIn}
          onChange={(e) => onChange('checkIn', e.target.value)}
          error={errors.checkIn}
        />
        <Input
          label="Check-out Date"
          type="date"
          size="sm"
          value={hotel.checkOut}
          onChange={(e) => onChange('checkOut', e.target.value)}
          error={errors.checkOut}
        />
        <Select
          label="Room Type"
          size="sm"
          options={ROOM_TYPES}
          value={hotel.roomType}
          onChange={(e) => onChange('roomType', e.target.value)}
        />
        <Select
          label="Meal Plan"
          size="sm"
          options={MEAL_PLANS}
          value={hotel.meal}
          onChange={(e) => onChange('meal', e.target.value)}
        />
      </div>
    </div>
  );
}

export default function ConfirmBookingModal({ bookingId, bookingRef, onClose }: Props) {
  const router = useRouter();

  const [hotelMedina, setHotelMedina] = useState<HotelDetails>(emptyHotel());
  const [hotelMecca,  setHotelMecca]  = useState<HotelDetails>(emptyHotel());
  const [balanceDueDate, setBalanceDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    medina: Partial<Record<keyof HotelDetails, string>>;
    mecca:  Partial<Record<keyof HotelDetails, string>>;
    balanceDueDate?: string;
  }>({ medina: {}, mecca: {} });

  const updateMedina = (field: keyof HotelDetails, value: string) =>
    setHotelMedina((prev) => ({ ...prev, [field]: value }));
  const updateMecca  = (field: keyof HotelDetails, value: string) =>
    setHotelMecca ((prev) => ({ ...prev, [field]: value }));

  function validate() {
    const medina: Partial<Record<keyof HotelDetails, string>> = {};
    const mecca:  Partial<Record<keyof HotelDetails, string>> = {};
    let balance: string | undefined;

    if (!hotelMedina.name.trim()) medina.name = 'Required';
    if (!hotelMecca.name.trim())  mecca.name  = 'Required';
    if (!balanceDueDate)          balance = 'Required';

    setFieldErrors({ medina, mecca, balanceDueDate: balance });
    return !medina.name && !mecca.name && !balance;
  }

  async function handleConfirm() {
    if (!validate()) return;

    setServerError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelMedina, hotelMecca, balanceDueDate, notes }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to confirm booking');
      }

      router.refresh();
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/40 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Sheet */}
      <div className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-ivory shadow-2xl sm:max-w-2xl sm:rounded-2xl">

        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-charcoal/8 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-charcoal">Confirm Booking</h2>
            <p className="mt-0.5 font-mono text-xs text-charcoal/45">{bookingRef}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-4 mt-0.5 rounded-lg p-1.5 text-charcoal/40 transition hover:bg-charcoal/6 hover:text-charcoal"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <p className="text-sm leading-relaxed text-charcoal/60">
            Enter the hotel assignments below. A{' '}
            <span className="font-medium text-charcoal">Registration Confirmation</span> email with
            a PDF attachment will be sent to the customer automatically upon confirming.
          </p>

          <HotelSection
            city="Medina"
            hotel={hotelMedina}
            errors={fieldErrors.medina}
            onChange={updateMedina}
          />

          <HotelSection
            city="Mecca"
            hotel={hotelMecca}
            errors={fieldErrors.mecca}
            onChange={updateMecca}
          />

          <div className="pt-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-charcoal/8" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
                Payment
              </span>
              <div className="h-px flex-1 bg-charcoal/8" />
            </div>

            <Input
              label="Balance Due Date"
              type="date"
              size="sm"
              value={balanceDueDate}
              onChange={(e) => setBalanceDueDate(e.target.value)}
              error={fieldErrors.balanceDueDate}
              required
            />
          </div>

          <Textarea
            label="Notes (optional)"
            size="sm"
            rows={3}
            placeholder="Any additional notes for the customer…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
            >
              <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 10.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm.75-3.25a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 1.5 0v3z" />
              </svg>
              {serverError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-charcoal/8 px-6 py-4">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" isLoading={loading} onClick={handleConfirm}>
            Confirm &amp; Send Email
          </Button>
        </div>
      </div>
    </div>
  );
}
