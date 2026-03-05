/**
 * SQL Script: Create & Seed Day Pass Experiences
 * Run this in Supabase SQL Editor to:
 * 1. Create the day_pass_experiences table
 * 2. Set up indexes and RLS policies
 * 3. Populate with "All Day" ticket types
 */

-- Create day_pass_experiences table
CREATE TABLE IF NOT EXISTS public.day_pass_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_per_person INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('day-pass', 'honeymoon', 'team-building')),
  age_group TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_day_pass_experiences_category ON public.day_pass_experiences(category);
CREATE INDEX IF NOT EXISTS idx_day_pass_experiences_available ON public.day_pass_experiences(available);
CREATE INDEX IF NOT EXISTS idx_day_pass_experiences_created_at ON public.day_pass_experiences(created_at DESC);

-- Add unique constraint on name to prevent duplicates
ALTER TABLE public.day_pass_experiences 
  DROP CONSTRAINT IF EXISTS day_pass_experiences_name_key;
  
CREATE UNIQUE INDEX IF NOT EXISTS idx_day_pass_experiences_name 
  ON public.day_pass_experiences(name);

-- Enable Row Level Security
ALTER TABLE public.day_pass_experiences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read for all users" ON public.day_pass_experiences;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.day_pass_experiences;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.day_pass_experiences;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.day_pass_experiences;

-- Create RLS policies for admin access
CREATE POLICY "Enable read for all users" ON public.day_pass_experiences
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.day_pass_experiences
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.day_pass_experiences
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON public.day_pass_experiences
  FOR DELETE USING (true);

-- Insert "All Day" experience cards/tickets
-- Using ON CONFLICT to update existing records instead of creating duplicates
INSERT INTO public.day_pass_experiences (name, description, price_per_person, category, age_group, available)
VALUES 
  -- Day Pass Tickets
  ('Infant Ticket', 'Free access for babies 0-3 years old', 0, 'day-pass', '0-3 years', true),
  ('Kids Ticket', 'Day pass for children 3-12 years old with access to all facilities', 10000, 'day-pass', '3-12 years', true),
  ('Kids Ticket Plus', 'Enhanced day pass with premium activities and exclusive access for children 3-12', 25000, 'day-pass', '3-12 years', true),
  ('Teens Ticket', 'Day pass for teenagers 13-17 years with full resort access', 15000, 'day-pass', '13-17 years', true),
  ('Teen Ticket Plus', 'Premium day pass with VIP activities for teenagers 13-17', 30000, 'day-pass', '13-17 years', true),
  ('Adult Ticket', 'Standard day pass for adults 18+ years with full resort access', 20000, 'day-pass', '18+ years', true),
  ('Adult Ticket Plus', 'Premium day pass for adults 18+ with exclusive amenities and dining privileges', 45000, 'day-pass', '18+ years', true),
  ('Senior Ticket', 'Discounted day pass for seniors 60+ years', 12000, 'day-pass', '60+ years', true),
  
  -- Add-On Experiences
  ('Deep Tissue Massage', 'Therapeutic deep tissue massage session', 35000, 'day-pass', 'All ages', true),
  ('Swedish Massage', 'Relaxing Swedish massage experience', 25000, 'day-pass', 'All ages', true),
  ('Kids Massage', 'Gentle massage designed for children', 11250, 'day-pass', '3-12 years', true),
  ('Horse riding', 'Guided horse riding experience along the beach', 5062, 'day-pass', 'All ages', true),
  ('Paint & Chill in the pool with floating snacks [For 2]', 'Paint and relax in the pool with snacks - perfect for couples', 50000, 'day-pass', 'All ages', true),
  ('Paint & Chill with Canvas', 'Create your own canvas art in a relaxing setting', 15000, 'day-pass', 'All ages', true),
  ('Family/Group Beachside Lunch', 'Group dining experience by the beach', 22500, 'day-pass', 'All ages', true),
  ('Beachfront Picnic', 'Romantic or family picnic setup on the beach', 28125, 'day-pass', 'All ages', true),
  ('Paint & Chill with Tote Bag', 'Design and paint your own tote bag', 13000, 'day-pass', 'All ages', true),
  ('Paint & Chill for Children', 'Fun painting activity specially designed for kids', 10000, 'day-pass', '3-12 years', true)
ON CONFLICT (name) 
DO UPDATE SET 
  description = EXCLUDED.description,
  price_per_person = EXCLUDED.price_per_person,
  category = EXCLUDED.category,
  age_group = EXCLUDED.age_group,
  available = EXCLUDED.available,
  updated_at = CURRENT_TIMESTAMP;
