-- Extend the status column CHECK constraint to include 'awaiting_card_payment'.
-- This value was added to TypeScript types but the DB constraint was never updated.

DO $$
DECLARE
  v_constraint_name text;
BEGIN
  SELECT conname
    INTO v_constraint_name
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
   WHERE n.nspname = 'public'
     AND t.relname  = 'bookings'
     AND c.contype  = 'c'
     AND pg_get_constraintdef(c.oid) ILIKE '%status%'
   LIMIT 1;

  IF v_constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.bookings DROP CONSTRAINT %I', v_constraint_name);
  END IF;
END $$;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_status_check
  CHECK (status IN (
    'pending_verification',
    'verified',
    'awaiting_card_payment',
    'deposit_paid',
    'fully_paid',
    'confirmed',
    'cancelled',
    'expired'
  ));
