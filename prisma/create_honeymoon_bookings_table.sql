-- Create honeymoon_bookings table
CREATE TABLE honeymoon_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name VARCHAR NOT NULL,
  package_price BIGINT NOT NULL,
  guest_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  check_in_date DATE NOT NULL,
  payment_status VARCHAR DEFAULT 'PENDING',
  paystack_reference VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_honeymoon_bookings_payment_status ON honeymoon_bookings(payment_status);
CREATE INDEX idx_honeymoon_bookings_email ON honeymoon_bookings(email);
