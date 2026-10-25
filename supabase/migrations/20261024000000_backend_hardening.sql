-- =============================================================================
-- Backend hardening: concurrency, integrity, indexes, and access lockdown.
--
-- ORDER OF OPERATIONS
--   1. Deploy the application code from the same change first. The old admin
--      dashboard read/wrote bookings from the browser with the anon key; the
--      new code goes through authenticated API routes. Section 6 below revokes
--      anon access, which would break the OLD dashboard.
--   2. Apply this file:  supabase db push   (or paste into the SQL editor).
--
-- Every statement is idempotent; re-running is safe. Unique indexes are
-- skipped with a NOTICE (not an error) if duplicate data already exists —
-- see the queries at the bottom to find and fix duplicates, then re-run.
-- =============================================================================


-- 1. Columns the code expects ------------------------------------------------
-- Adding nullable columns is metadata-only in Postgres 11+ (no table rewrite,
-- no long lock), so this is safe on a live database.

DO $$
DECLARE
  had_email_column boolean;
BEGIN
  IF to_regclass('public.bookings') IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'bookings'
        AND column_name = 'confirmation_email_sent_at'
    ) INTO had_email_column;

    ALTER TABLE public.bookings
      ADD COLUMN IF NOT EXISTS paid_at timestamptz,
      ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
      ADD COLUMN IF NOT EXISTS date_of_booking timestamptz,
      ADD COLUMN IF NOT EXISTS paystack_access_code text,
      ADD COLUMN IF NOT EXISTS paystack_authorization_url text,
      ADD COLUMN IF NOT EXISTS confirmation_email_sent_at timestamptz;

    -- Existing paid bookings were already emailed by the old flow; mark them
    -- so the reconciliation cron does not email them again.
    IF NOT had_email_column THEN
      UPDATE public.bookings
         SET confirmation_email_sent_at = COALESCE(paid_at, created_at, now())
       WHERE payment_status <> 'RESERVED';
    END IF;
  END IF;

  IF to_regclass('public.day_pass_bookings') IS NOT NULL THEN
    ALTER TABLE public.day_pass_bookings
      ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
      ADD COLUMN IF NOT EXISTS date_of_booking timestamptz;
  END IF;
END $$;


-- 2. Indexes for the hot queries ---------------------------------------------
-- Availability check / booked-dates calendar:
--   WHERE room_id = $1 AND check_out_date > $2 AND check_in_date < $3
CREATE INDEX IF NOT EXISTS idx_bookings_room_dates
  ON public.bookings (room_id, check_in_date, check_out_date);
-- Admin list (ORDER BY created_at DESC) and reconciliation cron.
CREATE INDEX IF NOT EXISTS idx_bookings_status_created
  ON public.bookings (payment_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at
  ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email
  ON public.bookings (lower(guest_email));

DO $$
BEGIN
  IF to_regclass('public.day_pass_bookings') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_day_pass_status_created
      ON public.day_pass_bookings (payment_status, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_day_pass_created_at
      ON public.day_pass_bookings (created_at DESC);
  END IF;
  IF to_regclass('public.honeymoon_bookings') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_honeymoon_status_created
      ON public.honeymoon_bookings (payment_status, created_at DESC);
  END IF;
END $$;


-- 3. Unique constraints --------------------------------------------------------
-- Booking codes are short random numbers; uniqueness must be enforced by the
-- database (the app retries on 23505). Paystack references must map to
-- exactly one booking. Skipped with a NOTICE if duplicates exist.

CREATE OR REPLACE FUNCTION pg_temp.create_unique_if_clean(
  p_table text, p_column text, p_index text
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  dupes bigint;
BEGIN
  IF to_regclass('public.' || p_table) IS NULL THEN
    RETURN;
  END IF;
  EXECUTE format(
    'SELECT count(*) FROM (SELECT %1$I FROM public.%2$I WHERE %1$I IS NOT NULL GROUP BY %1$I HAVING count(*) > 1) d',
    p_column, p_table
  ) INTO dupes;
  IF dupes > 0 THEN
    RAISE NOTICE 'Skipping unique index % on %.%: % duplicated value(s). Fix and re-run.',
      p_index, p_table, p_column, dupes;
    RETURN;
  END IF;
  EXECUTE format(
    'CREATE UNIQUE INDEX IF NOT EXISTS %I ON public.%I (%I) WHERE %I IS NOT NULL',
    p_index, p_table, p_column, p_column
  );
END $$;

SELECT pg_temp.create_unique_if_clean('bookings', 'booking_reference_code', 'uq_bookings_booking_reference_code');
SELECT pg_temp.create_unique_if_clean('bookings', 'paystack_reference', 'uq_bookings_paystack_reference');
SELECT pg_temp.create_unique_if_clean('day_pass_bookings', 'reference_code', 'uq_day_pass_reference_code');
SELECT pg_temp.create_unique_if_clean('day_pass_bookings', 'paystack_reference', 'uq_day_pass_paystack_reference');
SELECT pg_temp.create_unique_if_clean('honeymoon_bookings', 'paystack_reference', 'uq_honeymoon_paystack_reference');

-- Exactly one SUPER_ADMIN (closes the bootstrap check-then-insert race).
DO $$
BEGIN
  IF to_regclass('public.admin_users') IS NOT NULL
     AND (SELECT count(*) FROM public.admin_users WHERE role = 'SUPER_ADMIN') <= 1 THEN
    CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_single_super_admin
      ON public.admin_users (role) WHERE role = 'SUPER_ADMIN';
  END IF;
END $$;


-- 4. Webhook event log (dedupe for Paystack redeliveries) ---------------------
CREATE TABLE IF NOT EXISTS public.paystack_events (
  event_key   text PRIMARY KEY,
  reference   text,
  outcome     text,
  received_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.paystack_events ENABLE ROW LEVEL SECURITY;


-- 5. Atomic room reservation ---------------------------------------------------
-- Serialises bookings per room with a transaction-scoped advisory lock, then
-- re-checks overlap and inserts inside the same transaction. Under READ
-- COMMITTED a plain check-then-insert lets two requests both pass the check;
-- the lock makes the second one wait and then see the first one's row.
-- Locks are per room and taken one at a time, so this cannot deadlock.
CREATE OR REPLACE FUNCTION public.create_room_booking(
  p_booking jsonb,
  p_hold_minutes integer DEFAULT 10
) RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.bookings;
  v_row public.bookings;
BEGIN
  r := jsonb_populate_record(NULL::public.bookings, p_booking);

  IF r.room_id IS NULL OR r.check_in_date IS NULL OR r.check_out_date IS NULL
     OR r.check_in_date >= r.check_out_date THEN
    RAISE EXCEPTION 'INVALID_BOOKING' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('room_booking:' || r.room_id::text));

  IF EXISTS (
    SELECT 1
      FROM public.bookings b
     WHERE b.room_id = r.room_id
       AND b.check_out_date > r.check_in_date
       AND b.check_in_date  < r.check_out_date
       AND (
             b.payment_status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
          OR (b.payment_status = 'RESERVED'
              AND b.created_at > now() - make_interval(mins => p_hold_minutes))
           )
  ) THEN
    RAISE EXCEPTION 'ROOM_UNAVAILABLE' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.bookings (
    guest_email, guest_name, guest_phone, room_id,
    check_in_date, check_out_date, number_of_guests, special_requests,
    room_price_ngn, number_of_nights, total_amount_ngn,
    payment_status, payment_type, date_of_booking,
    paystack_reference, booking_reference_code
  ) VALUES (
    r.guest_email, r.guest_name, r.guest_phone, r.room_id,
    r.check_in_date, r.check_out_date, r.number_of_guests, r.special_requests,
    r.room_price_ngn, r.number_of_nights, r.total_amount_ngn,
    r.payment_status, r.payment_type, COALESCE(r.date_of_booking, now()),
    r.paystack_reference, r.booking_reference_code
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END $$;

REVOKE ALL ON FUNCTION public.create_room_booking(jsonb, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_room_booking(jsonb, integer) TO service_role;


-- 6. Access lockdown -------------------------------------------------------------
-- The anon key ships in the browser bundle. Guest data and admin tables must
-- only be reachable through the server (service_role bypasses these grants).
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'bookings', 'day_pass_bookings', 'honeymoon_bookings',
    'admin_users', 'admin_audit_logs', 'operations_booking_notes',
    'users', 'paystack_events'
  ] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
    END IF;
  END LOOP;

  -- Public catalogue: readable by anyone, writable only via admin API routes.
  FOREACH t IN ARRAY ARRAY[
    'rooms', 'blogs', 'menus', 'popups', 'day_pass_experiences'
  ] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.%I FROM anon, authenticated', t);
    END IF;
  END LOOP;
END $$;


-- =============================================================================
-- Finding duplicates that blocked a unique index (run manually if NOTICEs):
--
--   SELECT booking_reference_code, count(*) FROM public.bookings
--    WHERE booking_reference_code IS NOT NULL
--    GROUP BY 1 HAVING count(*) > 1;
--
--   SELECT paystack_reference, count(*) FROM public.bookings
--    WHERE paystack_reference IS NOT NULL
--    GROUP BY 1 HAVING count(*) > 1;
--
-- Verifying the availability query uses the index:
--
--   EXPLAIN ANALYZE
--   SELECT id FROM public.bookings
--    WHERE room_id = 'room01'
--      AND check_out_date > now() AND check_in_date < now() + interval '7 days';
-- =============================================================================
