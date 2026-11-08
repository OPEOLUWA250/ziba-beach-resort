-- =============================================================================
-- Security update (2026-11-08)
--
-- ORDER OF OPERATIONS
--   1. Deploy the application code from the same change first. Before it, the
--      blog and popup editors uploaded images from the browser with the public
--      (anon) key; the new code uploads through /api/admin/uploads with the
--      server key. Section 1 removes the anon key's write access to Storage,
--      which would break the OLD editors.
--   2. Paste this file into the Supabase SQL editor and run it.
--
-- Every statement is idempotent; re-running is safe.
-- =============================================================================


-- 1. Storage: nobody may change files with the public key ---------------------
-- The anon key ships in every visitor's browser, so any policy that lets
-- anon/authenticated/public INSERT, UPDATE or DELETE in storage.objects lets
-- anyone replace or delete the site's images, or host their own files on the
-- resort's storage. Reading stays as it is (public buckets serve images by URL
-- without any policy). The server key bypasses these policies, so admin
-- uploads through the API keep working.
DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT policyname, cmd, roles
      FROM pg_policies
     WHERE schemaname = 'storage'
       AND tablename  = 'objects'
       AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
       AND roles && ARRAY['anon', 'authenticated', 'public']::name[]
  LOOP
    RAISE NOTICE 'Dropping storage policy "%" (% for %)', p.policyname, p.cmd, p.roles;
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', p.policyname);
  END LOOP;
END $$;


-- 2. Re-assert the table lockdown --------------------------------------------
-- Same as section 6 of 20261024000000_backend_hardening.sql, repeated so this
-- file is safe to run on its own: guest data and admin tables are reachable
-- only through the server; the public catalogue is read-only for the anon key.
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'bookings', 'day_pass_bookings', 'honeymoon_bookings',
    'admin_users', 'admin_audit_logs', 'operations_booking_notes',
    'users', 'paystack_events', 'analytics_events'
  ] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
    END IF;
  END LOOP;

  FOREACH t IN ARRAY ARRAY[
    'rooms', 'blogs', 'menus', 'popups', 'day_pass_experiences'
  ] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.%I FROM anon, authenticated', t);
    END IF;
  END LOOP;
END $$;


-- 3. Sign every admin out once ------------------------------------------------
-- Admin sessions are now checked against current_session_token on every
-- request. Clearing it once means any admin cookie copied before this update
-- (including from a shared or stolen device) stops working; admins simply sign
-- in again.
UPDATE public.admin_users SET current_session_token = NULL
 WHERE current_session_token IS NOT NULL;


-- =============================================================================
-- Checks (run after applying):
--
--   -- Should return no rows: write policies the public key could use.
--   SELECT policyname, cmd, roles FROM pg_policies
--    WHERE schemaname = 'storage' AND tablename = 'objects'
--      AND cmd IN ('INSERT','UPDATE','DELETE','ALL')
--      AND roles && ARRAY['anon','authenticated','public']::name[];
--
--   -- Should return no rows: guest/admin tables the anon role can read.
--   SELECT table_name, privilege_type FROM information_schema.role_table_grants
--    WHERE grantee = 'anon' AND table_schema = 'public'
--      AND table_name IN ('bookings','day_pass_bookings','honeymoon_bookings',
--                         'admin_users','admin_audit_logs','users');
-- =============================================================================
