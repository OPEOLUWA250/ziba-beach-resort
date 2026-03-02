-- Seed rooms table with Ziba Beach Resort rooms
INSERT INTO rooms (id, title, description, priceNGN, capacity, amenities, images, status) VALUES
('room01', 'Beach Facing Room', 'Stunning beachfront room with ocean views', 225000, 2, ARRAY['AC', 'WiFi', 'TV', 'Balcony'], ARRAY[]::TEXT[], 'available'),
('room02', 'Beach Facing Family Room - Partial', 'Spacious family room with partial beach view', 275000, 4, ARRAY['AC', 'WiFi', 'TV', 'Kitchen', 'Balcony'], ARRAY[]::TEXT[], 'available'),
('room03', 'Beach Facing Family Room - Full', 'Large family room with full beach views', 325000, 6, ARRAY['AC', 'WiFi', 'TV', 'Kitchen', 'Balcony'], ARRAY[]::TEXT[], 'available'),
('room04', 'Beach Facing Connecting Room', 'Two connecting rooms perfect for groups', 350000, 4, ARRAY['AC', 'WiFi', 'TV', 'Balcony'], ARRAY[]::TEXT[], 'available'),
('room05', 'Beach Facing Suite', 'Luxury suite with premium amenities', 400000, 2, ARRAY['AC', 'WiFi', 'TV', 'Jacuzzi', 'Balcony'], ARRAY[]::TEXT[], 'available'),
('room06', 'Two Bedroom Apartment', 'Full apartment with two bedrooms', 450000, 8, ARRAY['AC', 'WiFi', 'TV', 'Kitchen', 'Balcony', 'Washer'], ARRAY[]::TEXT[], 'available'),
('room07', 'Overwater Terrace Room', 'Unique overwater room with terrace', 350000, 2, ARRAY['AC', 'WiFi', 'TV', 'Terrace'], ARRAY[]::TEXT[], 'available'),
('room08', 'Overwater Terrace Suite', 'Premium overwater suite', 425000, 2, ARRAY['AC', 'WiFi', 'TV', 'Jacuzzi', 'Terrace'], ARRAY[]::TEXT[], 'available'),
('room09', 'Ziba Black Room', 'Exclusive luxury black-themed room', 450000, 2, ARRAY['AC', 'WiFi', 'TV', 'Jacuzzi', 'Balcony'], ARRAY[]::TEXT[], 'available')
ON CONFLICT (id) DO NOTHING;
