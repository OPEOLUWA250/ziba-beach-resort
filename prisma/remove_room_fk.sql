-- Remove foreign key constraint on bookings.room_id
-- This allows email-based guest bookings without requiring rooms to be pre-registered
ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS bookings_room_id_fkey;

-- Verify room_id column exists (from the new schema)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS room_id TEXT;

-- Make sure the column allows the values we're setting
-- The column should already exist but just in case
