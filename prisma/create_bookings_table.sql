-- Create bookings table with proper Paystack integration
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Guest Information
  guest_email TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  
  -- Booking Details
  room_id TEXT NOT NULL,
  check_in_date TIMESTAMP NOT NULL,
  check_out_date TIMESTAMP NOT NULL,
  number_of_guests INTEGER NOT NULL,
  special_requests TEXT,
  
  -- Pricing
  room_price_ngn INTEGER NOT NULL,
  number_of_nights INTEGER NOT NULL,
  total_amount_ngn INTEGER NOT NULL,
  
  -- Payment Status
  payment_status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
  paystack_reference TEXT UNIQUE,
  paystack_access_code TEXT,
  paystack_authorization_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  
  -- Indexes for fast queries
  CHECK (check_out_date > check_in_date)
);

-- Create indexes
CREATE INDEX idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_paystack_reference ON bookings(paystack_reference);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow all operations (no auth required for demo)
DROP POLICY IF EXISTS "Allow all bookings access" ON bookings;
CREATE POLICY "Allow all bookings access" ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);
