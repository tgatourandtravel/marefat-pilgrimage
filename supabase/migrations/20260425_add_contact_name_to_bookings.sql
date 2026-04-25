ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS contact_first_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_last_name text NOT NULL DEFAULT '';

