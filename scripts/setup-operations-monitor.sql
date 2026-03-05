/**
 * SQL Script: Setup Operations Checked-In Monitor Notes
 */

CREATE TABLE IF NOT EXISTS public.operations_booking_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id BIGINT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL DEFAULT 'note' CHECK (note_type IN ('note', 'issue')),
  note TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (booking_id, note_type)
);

CREATE INDEX IF NOT EXISTS idx_operations_notes_booking_id
  ON public.operations_booking_notes(booking_id);

ALTER TABLE public.operations_booking_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read operations notes" ON public.operations_booking_notes;
DROP POLICY IF EXISTS "Enable write operations notes" ON public.operations_booking_notes;

CREATE POLICY "Enable read operations notes" ON public.operations_booking_notes
  FOR SELECT USING (true);

CREATE POLICY "Enable write operations notes" ON public.operations_booking_notes
  FOR ALL USING (true) WITH CHECK (true);
