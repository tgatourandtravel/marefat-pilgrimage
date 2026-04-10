alter table public.bookings
  add column if not exists stripe_payment_intent_id text,
  add column if not exists payment_method text not null default 'bank_transfer',
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists payment_paid_at timestamptz;

create index if not exists idx_bookings_payment_intent_id
  on public.bookings (stripe_payment_intent_id);
