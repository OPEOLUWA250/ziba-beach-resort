-- Add missing Paystack columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS paystack_access_code TEXT;

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS paystack_authorization_url TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_paystack_reference 
  ON bookings(paystack_reference);

CREATE INDEX IF NOT EXISTS idx_bookings_payment_status 
  ON bookings(payment_status);
