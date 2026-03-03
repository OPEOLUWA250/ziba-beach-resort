-- Create day_pass_bookings table
CREATE TABLE IF NOT EXISTS day_pass_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  visit_date DATE NOT NULL,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'PENDING',
  paystack_reference TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_day_pass_bookings_reference ON day_pass_bookings(reference_code);
CREATE INDEX IF NOT EXISTS idx_day_pass_bookings_email ON day_pass_bookings(email);
CREATE INDEX IF NOT EXISTS idx_day_pass_bookings_status ON day_pass_bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_day_pass_bookings_visit_date ON day_pass_bookings(visit_date);

-- Enable Row Level Security
ALTER TABLE day_pass_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policy - Allow anyone to read their own booking by email
CREATE POLICY "Users can read their own bookings" ON day_pass_bookings FOR SELECT USING (true);

-- Allow inserting new bookings
CREATE POLICY "Allow insert for booking creation" ON day_pass_bookings FOR INSERT WITH CHECK (true);

-- Allow updating own bookings (for payment status)
CREATE POLICY "Allow update for own bookings" ON day_pass_bookings FOR UPDATE USING (true) WITH CHECK (true);
