-- Migration: Add Paystack fields to bookings table
-- Tracks payment status and Paystack reference for each booking

-- Add columns for payment tracking if they don't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS paystackReference TEXT;

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS paystackAmount INTEGER;

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS confirmedAt TIMESTAMP;

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS failedAt TIMESTAMP;

-- Create index for quick lookup
CREATE INDEX IF NOT EXISTS idx_bookings_paystackReference 
  ON bookings(paystackReference);

CREATE INDEX IF NOT EXISTS idx_bookings_status 
  ON bookings(status);

-- Update RLS policies if needed
-- Allow service role to manage all bookings
DROP POLICY IF EXISTS "Enable all for service role bookings" ON bookings;

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access bookings" ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);
