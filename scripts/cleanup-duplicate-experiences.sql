/**
 * SQL Script: Remove Duplicate Day Pass Experiences
 * Run this FIRST in Supabase SQL Editor to clean up any duplicate entries
 * before running the main seed script
 */

-- Remove duplicate entries, keeping only the oldest record for each name
DELETE FROM public.day_pass_experiences
WHERE id NOT IN (
  SELECT MIN(id)
  FROM public.day_pass_experiences
  GROUP BY name
);

-- Verify the cleanup
SELECT name, COUNT(*) as count
FROM public.day_pass_experiences
GROUP BY name
HAVING COUNT(*) > 1;
