-- Add modal CTA button text column to popups table
ALTER TABLE popups 
ADD COLUMN IF NOT EXISTS modal_cta_text TEXT;
