-- Create popups table for featured offers/promotions
CREATE TABLE IF NOT EXISTS popups (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  cta_button_text TEXT DEFAULT 'Learn More',
  cta_button_url TEXT,
  dedicated_page_cta_text TEXT,
  dedicated_page_cta_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'ACTIVE',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_popups_slug ON popups(slug);
CREATE INDEX IF NOT EXISTS idx_popups_status ON popups(status);

-- Enable RLS for popups
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active popups
CREATE POLICY "Enable read active popups for all users" ON popups FOR SELECT 
  USING (status = 'ACTIVE');

-- Allow admin insert/update/delete (you'll need to handle auth separately)
CREATE POLICY "Enable insert for popups" ON popups FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for popups" ON popups FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for popups" ON popups FOR DELETE USING (true);

-- Insert initial sample popup
INSERT INTO popups (id, title, slug, excerpt, content, featured_image, cta_button_text, cta_button_url, status)
VALUES (
  'popup-001',
  'Summer Beach Getaway Special',
  'summer-beach-special',
  'Enjoy up to 40% off on all beachfront rooms this summer. Limited time offer!',
  'Experience the ultimate beach escape this summer at Ziba Beach Resort! We''re offering exclusive discounts on all our premium beachfront accommodations. Whether you''re planning a romantic getaway, a family vacation, or a corporate retreat, this is the perfect opportunity to enjoy world-class amenities at unbeatable prices.

**What''s Included:**
- Complimentary beach access and equipment
- Daily breakfast buffet
- 20% discount on spa services
- Free WiFi throughout the resort
- Late checkout (until 6 PM)

Don''t miss this limited-time opportunity to create unforgettable memories at Ziba Beach Resort!',
  '/ziba-hero-images/hero-1.jpg',
  'Claim Your Offer',
  '/booking',
  'ACTIVE'
)
ON CONFLICT (id) DO NOTHING;
