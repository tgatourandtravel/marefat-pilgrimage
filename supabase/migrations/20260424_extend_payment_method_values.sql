-- Extend payment_method column to support 'wire' and 'zelle' transfer types.
-- Drops any existing CHECK constraint on payment_method and replaces it with
-- an updated one. Safe to run even if no prior constraint exists.

DO $$
DECLARE
  v_constraint_name text;
BEGIN
  -- Find any check constraint on bookings that mentions payment_method
  SELECT conname
    INTO v_constraint_name
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
   WHERE n.nspname = 'public'
     AND t.relname  = 'bookings'
     AND c.contype  = 'c'
     AND pg_get_constraintdef(c.oid) ILIKE '%payment_method%'
   LIMIT 1;

  IF v_constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.bookings DROP CONSTRAINT %I', v_constraint_name);
  END IF;
END $$;

-- Add updated constraint allowing all current payment method values
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_payment_method_check
  CHECK (payment_method IN ('bank_transfer', 'wire', 'zelle', 'card'));

-- Migrate any legacy 'bank_transfer' rows to 'wire' (wire is the default
-- offline method; existing rows were created before Zelle was an option).
UPDATE public.bookings
   SET payment_method = 'wire'
 WHERE payment_method = 'bank_transfer';
