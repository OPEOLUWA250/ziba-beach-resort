-- Add payment_type column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'online';

-- Add date_of_booking column to bookings table for immutable booking audit trail
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS date_of_booking TIMESTAMPTZ;

-- Add payment_type column to day_pass_bookings table
ALTER TABLE day_pass_bookings 
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'online';

-- Add date_of_booking column to day_pass_bookings table for immutable booking audit trail
ALTER TABLE day_pass_bookings
ADD COLUMN IF NOT EXISTS date_of_booking TIMESTAMPTZ;

-- Ensure new rows always get a booking timestamp
ALTER TABLE bookings
ALTER COLUMN date_of_booking SET DEFAULT NOW();

ALTER TABLE day_pass_bookings
ALTER COLUMN date_of_booking SET DEFAULT NOW();

-- Update existing admin-created bookings (PENDING status) to have payment_type = 'manual'
UPDATE bookings 
SET payment_type = 'manual' 
WHERE payment_status = 'PENDING' AND payment_type IS NULL;

-- Update existing customer bookings to have payment_type = 'online'
UPDATE bookings 
SET payment_type = 'online' 
WHERE payment_status IN ('RESERVED', 'CONFIRMED', 'ACTIVATED', 'COMPLETED') AND payment_type IS NULL;

-- Backfill date_of_booking for existing room bookings
UPDATE bookings
SET date_of_booking = COALESCE(created_at, NOW())
WHERE date_of_booking IS NULL;

-- Update existing day-pass bookings
UPDATE day_pass_bookings 
SET payment_type = 'manual' 
WHERE payment_status = 'PENDING' AND payment_type IS NULL;

UPDATE day_pass_bookings 
SET payment_type = 'online' 
WHERE payment_status IN ('RESERVED', 'CONFIRMED', 'ACTIVATED', 'COMPLETED') AND payment_type IS NULL;

-- Backfill date_of_booking for existing day-pass bookings
UPDATE day_pass_bookings
SET date_of_booking = COALESCE(created_at, NOW())
WHERE date_of_booking IS NULL;
