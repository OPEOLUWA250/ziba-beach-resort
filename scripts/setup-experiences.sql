/**
 * Migration Script: Create day_pass_experiences table
 * Run this in Supabase SQL Editor to set up the experiences table for admin management
 * 
 * Each experience can have multiple price tiers (adult, teen, kids, infant)
 * with base and plus options
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

-- Enable Row Level Security
ALTER TABLE public.day_pass_experiences ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Enable read for all users" ON public.day_pass_experiences
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.day_pass_experiences
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.day_pass_experiences
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON public.day_pass_experiences
  FOR DELETE USING (true);

-- Insert default day-pass ticket types
INSERT INTO public.day_pass_experiences (name, description, price_per_person, category, age_group, available)
VALUES 
  ('Infant Ticket', 'Free access for babies 0-3 years', 0, 'day-pass', '0-3 years', true),
  ('Kids Ticket', 'Day pass for children 3-12 years', 10000, 'day-pass', '3-12 years', true),
  ('Kids Ticket Plus', 'Enhanced day pass with premium activities for children 3-12', 25000, 'day-pass', '3-12 years', true),
  ('Teens Ticket', 'Day pass for teenagers 13-17 years', 15000, 'day-pass', '13-17 years', true),
  ('Adult Ticket', 'Standard day pass for adults 18+', 20000, 'day-pass', '18+ years', true)
ON CONFLICT DO NOTHING;
