'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  bookingId: string;
  bookingRef: string;
  onClose: () => void;
}

export default function ConfirmBookingModal({ bookingId, bookingRef, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, { method: 'POST' });
    if (res.ok) {
      onClose();
      window.location.reload();
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl">
        <h2 className="text-lg font-semibold text-charcoal mb-2">Confirm booking?</h2>
        <p className="text-sm text-charcoal/60 mb-6">
          Booking <span className="font-mono font-semibold text-charcoal">{bookingRef}</span> will
          be marked as confirmed. This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" isLoading={loading} onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
