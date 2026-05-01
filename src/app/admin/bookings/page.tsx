'use client';
import { useEffect, useState } from 'react';

type Booking = {
  id: string;
  booking_ref: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  tour_title: string;
  tour_start_date: string | null;
  number_of_travelers: number;
  grand_total: number;
  deposit_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  requires_action: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
};

const bookingStatusColors: Record<string, string> = {
  pending_verification: 'bg-gray-100 text-gray-600',
  verified: 'bg-blue-100 text-blue-700',
  awaiting_card_payment: 'bg-yellow-100 text-yellow-700',
  deposit_paid: 'bg-green-100 text-green-700',
  fully_paid: 'bg-green-200 text-green-800',
  confirmed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  expired: 'bg-gray-200 text-gray-500',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  async function fetchBookings() {
    const res = await fetch('/api/admin/bookings');
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleMarkPaid(id: string) {
    if (!confirm('این رزرو را به عنوان پرداخت‌شده تأیید می‌کنید؟')) return;
    setMarkingPaid(id);
    await fetch(`/api/admin/bookings/${id}/mark-paid`, { method: 'POST' });
    await fetchBookings();
    setMarkingPaid(null);
  }

  const filtered = bookings.filter((b) => {
    if (filter === 'unpaid') return b.payment_status === 'unpaid' && b.payment_method !== 'card';
    if (filter === 'paid') return b.payment_status === 'paid';
    return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">در حال بارگذاری...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin — Bookings</h1>
          <div className="flex gap-2">
            {(['all', 'unpaid', 'paid'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  filter === f ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:border-black'
                }`}
              >
                {f === 'all' ? 'همه' : f === 'unpaid' ? 'پرداخت‌نشده' : 'پرداخت‌شده'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">کل رزروها</p>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">پرداخت‌نشده (Wire/Zelle)</p>
            <p className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.payment_status === 'unpaid' && b.payment_method !== 'card').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">پرداخت‌شده</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.payment_status === 'paid').length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ref</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">مشتری</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">تور</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">مبلغ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">روش پرداخت</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">وضعیت</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">تاریخ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{booking.booking_ref}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{booking.contact_first_name} {booking.contact_last_name}</p>
                    <p className="text-gray-400 text-xs">{booking.contact_email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{booking.tour_title}</p>
                    <p className="text-gray-400 text-xs">{booking.number_of_travelers} نفر</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">${booking.deposit_amount} <span className="text-gray-400 text-xs">deposit</span></p>
                    <p className="text-gray-400 text-xs">total: ${booking.grand_total}</p>
                  </td>
                  <td className="px-4 py-3 uppercase text-xs font-medium">{booking.payment_method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.payment_status] || 'bg-gray-100 text-gray-600'}`}>
                      {booking.payment_status}
                    </span>
                    <br />
                    <span className={`px-2 py-1 rounded-full text-xs mt-1 inline-block ${bookingStatusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(booking.created_at).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="px-4 py-3">
                    {booking.payment_status === 'unpaid' && booking.payment_method !== 'card' && (
                      <button
                        onClick={() => handleMarkPaid(booking.id)}
                        disabled={markingPaid === booking.id}
                        className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {markingPaid === booking.id ? '...' : 'تأیید پرداخت'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">رزروی یافت نشد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}