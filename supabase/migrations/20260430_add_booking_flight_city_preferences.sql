-- Optional free-text flight preferences when the guest requests flight assistance.
-- Priced separately; not part of booking financial totals until quoted by operations.

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS preferred_departure_city text,
  ADD COLUMN IF NOT EXISTS preferred_return_city text;
