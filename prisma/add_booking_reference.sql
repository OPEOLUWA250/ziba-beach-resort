-- Add booking_reference_code column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_reference_code TEXT UNIQUE;

-- Add index for fast lookup
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference_code);

-- Add email and phone columns for guest bookings (no user account)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS guest_email TEXT,
ADD COLUMN IF NOT EXISTS guest_phone TEXT,
ADD COLUMN IF NOT EXISTS guest_name TEXT;

-- Create index for guest email lookups
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON bookings(guest_email);
