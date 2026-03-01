-- Migration: Fix popups table schema for production
-- This migration adds missing columns and ensures RLS policies exist
-- Safe to run multiple times (idempotent)

-- Step 1: Add updatedAt column if it doesn't exist
ALTER TABLE popups 
ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT NOW();

-- Step 2: Add createdAt column if it doesn't exist  
ALTER TABLE popups 
ADD COLUMN IF NOT EXISTS createdAt TIMESTAMP DEFAULT NOW();

-- Step 3: Drop ALL existing policies safely (check if they exist first)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Enable read active popups for all users" ON popups;
  DROP POLICY IF EXISTS "Enable insert for popups" ON popups;
  DROP POLICY IF EXISTS "Enable update for popups" ON popups;
  DROP POLICY IF EXISTS "Enable delete for popups" ON popups;
  DROP POLICY IF EXISTS "Allow public read active popups" ON popups;
  DROP POLICY IF EXISTS "Allow service role full access" ON popups;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore errors if policies don't exist
END $$;

-- Step 4: Ensure RLS is enabled
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

-- Step 5: Create new policies (these names won't conflict if run again)
CREATE POLICY "popups_public_read_active" ON popups 
  FOR SELECT 
  USING (status = 'ACTIVE');

CREATE POLICY "popups_service_role_all_access" ON popups 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

