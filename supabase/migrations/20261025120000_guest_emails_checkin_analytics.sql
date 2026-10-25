-- =============================================================================
-- Guest emails, QR check-in, and booking-funnel analytics.
--
-- Apply AFTER 20261024000000_backend_hardening.sql, in the Supabase SQL editor
-- (or `supabase db push`). Every statement is idempotent; re-running is safe.
--
-- The application code tolerates this file not being applied yet:
--   * emails still send, but without the "sent at" dedupe/retry columns;
--   * check-in works, but without the checked_in_at / checked_in_by audit;
--   * analytics events are dropped and the Insights page asks for this file.
-- =============================================================================


-- 1. Day-pass columns -----------------------------------------------------------
DO $$
DECLARE
  had_email_column boolean;
BEGIN
  IF to_regclass('public.day_pass_bookings') IS NULL THEN
    RETURN;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'day_pass_bookings'
      AND column_name = 'confirmation_email_sent_at'
  ) INTO had_email_column;

  ALTER TABLE public.day_pass_bookings
    ADD COLUMN IF NOT EXISTS confirmation_email_sent_at timestamptz,
    ADD COLUMN IF NOT EXISTS reminder_email_sent_at timestamptz,
    ADD COLUMN IF NOT EXISTS review_email_sent_at timestamptz,
    ADD COLUMN IF NOT EXISTS checked_in_at timestamptz,
    ADD COLUMN IF NOT EXISTS checked_in_by text,
    -- Marketing source of the session that made the booking (utm_source or
    -- referring site), recorded at checkout for revenue-by-source reporting.
    ADD COLUMN IF NOT EXISTS source text;

  -- Bookings made before this release never got a confirmation email; don't
  -- let the daily retry job send one now, weeks later.
  IF NOT had_email_column THEN
    UPDATE public.day_pass_bookings
       SET confirmation_email_sent_at = COALESCE(created_at, now())
     WHERE payment_status <> 'RESERVED';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_day_pass_visit_date
  ON public.day_pass_bookings (visit_date);


-- 2. Analytics events -----------------------------------------------------------
-- Anonymous, first-party funnel events. No names, emails, phones or IPs:
-- session_id is a random per-tab id generated in the browser.
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text        NOT NULL,
  session_id  text        NOT NULL,
  path        text,
  source      text,
  props       jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON public.analytics_events (created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created
  ON public.analytics_events (name, created_at);

-- Written and read only by the server (service_role bypasses these).
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.analytics_events FROM anon, authenticated;


-- 3. Insights summary ------------------------------------------------------------
-- One round trip for the admin Insights page. Funnel steps count distinct
-- sessions, so refreshes and repeat clicks don't inflate conversion.
CREATE OR REPLACE FUNCTION public.analytics_summary(p_since timestamptz)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH ev AS (
    SELECT name, session_id, source, props, created_at
      FROM public.analytics_events
     WHERE created_at >= p_since
  ),
  session_source AS (
    -- First-touch source per session.
    SELECT DISTINCT ON (session_id) session_id, COALESCE(source, 'direct') AS source
      FROM ev
     ORDER BY session_id, created_at
  )
  SELECT jsonb_build_object(
    'sessions', (SELECT count(DISTINCT session_id) FROM ev),
    'steps', COALESCE((
      SELECT jsonb_object_agg(name, sessions)
        FROM (SELECT name, count(DISTINCT session_id) AS sessions FROM ev GROUP BY name) s
    ), '{}'::jsonb),
    'clicks', COALESCE((
      SELECT jsonb_object_agg(name, total)
        FROM (SELECT name, count(*) AS total FROM ev
               WHERE name IN ('room_book_click', 'whatsapp_click', 'phone_click')
               GROUP BY name) c
    ), '{}'::jsonb),
    'whatsapp_contexts', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('context', context, 'clicks', clicks) ORDER BY clicks DESC)
        FROM (SELECT COALESCE(props->>'context', 'other') AS context, count(*) AS clicks
                FROM ev WHERE name = 'whatsapp_click' GROUP BY 1) w
    ), '[]'::jsonb),
    'sources', COALESCE((
      SELECT jsonb_agg(row_to_json(x) ORDER BY x.sessions DESC)
        FROM (
          SELECT ss.source,
                 count(*) AS sessions,
                 count(*) FILTER (WHERE EXISTS (
                   SELECT 1 FROM ev e WHERE e.session_id = ss.session_id
                     AND e.name = 'daypass_payment_start')) AS daypass_checkouts,
                 count(*) FILTER (WHERE EXISTS (
                   SELECT 1 FROM ev e WHERE e.session_id = ss.session_id
                     AND e.name = 'room_book_click')) AS room_clicks
            FROM session_source ss
           GROUP BY ss.source
           ORDER BY sessions DESC
           LIMIT 25
        ) x
    ), '[]'::jsonb),
    'daily', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('day', day, 'sessions', sessions) ORDER BY day)
        FROM (SELECT (created_at AT TIME ZONE 'Africa/Lagos')::date AS day,
                     count(DISTINCT session_id) AS sessions
                FROM ev GROUP BY 1) d
    ), '[]'::jsonb)
  );
$$;

REVOKE ALL ON FUNCTION public.analytics_summary(timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_summary(timestamptz) TO service_role;
