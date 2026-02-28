-- Supabase Schema for Ziba Beach Resort
-- This SQL file creates all necessary tables and indexes

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT DEFAULT '',
  phone TEXT,
  country TEXT,
  currency TEXT DEFAULT 'NGN',
  passwordHash TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  priceNGN INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'AVAILABLE',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  roomId TEXT NOT NULL,
  checkInDate TIMESTAMP NOT NULL,
  checkOutDate TIMESTAMP NOT NULL,
  numberOfGuests INTEGER NOT NULL,
  specialRequests TEXT,
  status TEXT DEFAULT 'PENDING',
  totalAmount INTEGER,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (roomId) REFERENCES rooms(id)
);

CREATE INDEX IF NOT EXISTS idx_bookings_userId ON bookings(userId);
CREATE INDEX IF NOT EXISTS idx_bookings_roomId ON bookings(roomId);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(checkInDate, checkOutDate);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT,
  category TEXT,
  read_time INTEGER,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);

-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
  id TEXT PRIMARY KEY,
  categoryId TEXT NOT NULL,
  itemId TEXT NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image TEXT,
  available BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menus_category ON menus(category);
CREATE INDEX IF NOT EXISTS idx_menus_available ON menus(available);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic setup)
-- Allow anyone to read public data
CREATE POLICY "Enable read for all users" ON rooms FOR SELECT USING (true);
CREATE POLICY "Enable read for all users" ON blogs FOR SELECT USING (true);
CREATE POLICY "Enable read for all users" ON menus FOR SELECT USING (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (auth.uid()::text = userId);

-- Insert initial mock data for rooms
INSERT INTO rooms (id, title, description, priceNGN, capacity, amenities, images, status) VALUES
  ('room01', 'Beach Facing Room', 'Experience the essence of beach luxury with stunning ocean views and direct access to our pristine shoreline. Perfect for couples or small families seeking an intimate getaway.', 202000, 3, ARRAY['WiFi', 'Minibar', 'Room Service', 'Daily Housekeeping', 'Safe Deposit Box', 'Wake-up Service', '24/7 Concierge', 'Beach Towel Service'], ARRAY['/ziba-rooms/room01.jpg'], 'AVAILABLE'),
  ('room02', 'Beach Facing Family Room', 'Partial View - Spacious family accommodation with flexible sleeping arrangements, perfect for creating unforgettable memories with loved ones.', 225000, 6, ARRAY['WiFi', 'Minibar', 'Kids Welcome Package', 'Childminding Service Available', 'Room Service', 'Family Beach Amenities', 'Game Console', 'Beach Equipment'], ARRAY['/ziba-rooms/room02.jpg'], 'AVAILABLE'),
  ('room03', 'Beach Facing Family Room', 'Full View - Premium family space with expansive pool and ocean views, offering the perfect backdrop for quality family time.', 247500, 6, ARRAY['WiFi', 'Minibar', 'Kids Welcome Package', 'Childminding Service Available', 'Room Service', 'Family Beach Amenities', 'Game Console', 'Beach Equipment', 'Private Balcony'], ARRAY['/ziba-rooms/room03.jpg'], 'AVAILABLE'),
  ('room04', 'Deluxe Sea-Facing Room', 'Elegantly designed with a blend of modern comfort and traditional charm, featuring contemporary bathroom fixtures and premium bedding.', 213000, 2, ARRAY['WiFi', 'Minibar', 'Room Service', 'Daily Housekeeping', 'Safe Deposit Box', 'Wake-up Service', '24/7 Concierge', 'Premium Toiletries'], ARRAY['/ziba-rooms/room04.jpg'], 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;
