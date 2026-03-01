-- Add dedicated page CTA columns to popups table
ALTER TABLE popups 
ADD COLUMN IF NOT EXISTS dedicated_page_cta_text TEXT,
ADD COLUMN IF NOT EXISTS dedicated_page_cta_url TEXT;
