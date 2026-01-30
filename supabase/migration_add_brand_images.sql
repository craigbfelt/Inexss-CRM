-- Migration: Add image_url and logo_url to brands table
-- This migration adds support for brand images and logos

-- Add new columns to the brands table
ALTER TABLE public.brands 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add comments to document the new columns
COMMENT ON COLUMN public.brands.image_url IS 'URL to the brand header/banner image';
COMMENT ON COLUMN public.brands.logo_url IS 'URL to the brand logo image';

-- Update the updated_at trigger to ensure it fires on these new columns
-- (The trigger already exists, just confirming it works with new columns)
