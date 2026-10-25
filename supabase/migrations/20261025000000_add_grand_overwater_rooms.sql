-- =============================================================================
-- Add the Grand Overwater Loft Room (room10) and Grand Overwater Studio Room
-- (room11) to the rooms table so their price and status can be managed in
-- the admin. Room facts shown on the site live in lib/room-catalog.ts.
--
-- The rooms table schema is not versioned in this repo, so this inserts only
-- the columns that actually exist. Existing rows are left untouched.
-- Idempotent: safe to re-run.
-- =============================================================================

DO $$
DECLARE
  r record;
  cols text[];
  vals text[];
BEGIN
  IF to_regclass('public.rooms') IS NULL THEN
    RAISE NOTICE 'public.rooms does not exist; skipping';
    RETURN;
  END IF;

  FOR r IN
    SELECT * FROM (VALUES
      ('room10', 'Grand Overwater Loft Room',
       'A spacious two-level loft above the signature overwater pool with a separate living and dining area, an upper-level bedroom and a private balcony overlooking the pool and ocean.',
       295111, 2),
      ('room11', 'Grand Overwater Studio Room',
       'A contemporary overwater studio for two with floor-to-ceiling glass doors, direct pool access, an open-plan double vanity and water and ocean views.',
       251556, 2)
    ) AS t(id, title, description, price, capacity)
  LOOP
    IF EXISTS (SELECT 1 FROM public.rooms WHERE id::text = r.id) THEN
      CONTINUE;
    END IF;

    cols := ARRAY['id'];
    vals := ARRAY[quote_literal(r.id)];

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rooms' AND column_name = 'title') THEN
      cols := cols || quote_ident('title');            vals := vals || quote_literal(r.title);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rooms' AND column_name = 'name') THEN
      cols := cols || quote_ident('name');             vals := vals || quote_literal(r.title);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rooms' AND column_name = 'description') THEN
      cols := cols || quote_ident('description');      vals := vals || quote_literal(r.description);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rooms' AND column_name = 'pricengn') THEN
      cols := cols || quote_ident('pricengn');         vals := vals || r.price::text;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rooms' AND column_name = 'capacity') THEN
      cols := cols || quote_ident('capacity');         vals := vals || r.capacity::text;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rooms' AND column_name = 'status') THEN
      cols := cols || quote_ident('status');           vals := vals || quote_literal('available');
    END IF;

    -- Timestamp and array columns (either naming style) in case they are
    -- NOT NULL without defaults.
    SELECT cols || array_agg(quote_ident(c.column_name)),
           vals || array_agg(CASE WHEN c.data_type = 'ARRAY' THEN '''{}''' ELSE 'now()' END)
      INTO cols, vals
      FROM information_schema.columns c
     WHERE c.table_schema = 'public' AND c.table_name = 'rooms'
       AND c.column_name IN ('createdAt', 'updatedAt', 'created_at', 'updated_at', 'amenities', 'images');
    cols := array_remove(cols, NULL);
    vals := array_remove(vals, NULL);

    EXECUTE format(
      'INSERT INTO public.rooms (%s) VALUES (%s)',
      array_to_string(cols, ', '),
      array_to_string(vals, ', ')
    );
    RAISE NOTICE 'Inserted room %', r.id;
  END LOOP;
END $$;
