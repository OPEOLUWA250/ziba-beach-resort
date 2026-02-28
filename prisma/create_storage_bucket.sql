-- Create the blog-images storage bucket
-- Run this in Supabase SQL Editor

-- Create bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set bucket policies to allow public read and authenticated write
CREATE POLICY IF NOT EXISTS "Public read on blog-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY IF NOT EXISTS "Authenticated upload on blog-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY IF NOT EXISTS "Authenticated delete on blog-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images');

CREATE POLICY IF NOT EXISTS "Authenticated update on blog-images"
ON storage.objects FOR UPDATE
WITH CHECK (bucket_id = 'blog-images');
