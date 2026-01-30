-- Verification Script for Brand Images Migration
-- Run this script in Supabase SQL Editor to verify the migration was successful

-- Check if image columns exist
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'brands'
    AND column_name IN ('image_url', 'logo_url');

-- Expected output: 2 rows showing image_url and logo_url columns

-- Check if all 15 brands were added
SELECT 
    COUNT(*) as total_brands,
    COUNT(CASE WHEN name = 'Pelican Systems' THEN 1 END) as pelican,
    COUNT(CASE WHEN name = 'Live Acoustics' THEN 1 END) as live_acoustics,
    COUNT(CASE WHEN name = 'Live Electronics' THEN 1 END) as live_electronics,
    COUNT(CASE WHEN name = 'Trellidor' THEN 1 END) as trellidor,
    COUNT(CASE WHEN name = 'Isoboard' THEN 1 END) as isoboard,
    COUNT(CASE WHEN name = 'Taylor Blinds & Shutters' THEN 1 END) as taylor,
    COUNT(CASE WHEN name = 'Led Urban' THEN 1 END) as led_urban,
    COUNT(CASE WHEN name = 'Pinnacle Stone' THEN 1 END) as pinnacle,
    COUNT(CASE WHEN name = 'Noel & Marquet' THEN 1 END) as noel,
    COUNT(CASE WHEN name = 'Richmond Plumbing & Sanitaryware' THEN 1 END) as richmond,
    COUNT(CASE WHEN name = 'Rubio Monocoat' THEN 1 END) as rubio,
    COUNT(CASE WHEN name = 'Dreamweaver Studios' THEN 1 END) as dreamweaver,
    COUNT(CASE WHEN name = 'Studio Delta' THEN 1 END) as studio_delta,
    COUNT(CASE WHEN name = 'Hammond Timbers' THEN 1 END) as hammond,
    COUNT(CASE WHEN name = 'DADO Creations' THEN 1 END) as dado
FROM public.brands;

-- Expected output: total_brands should be at least 15, each brand column should be 1

-- List all brands with their categories
SELECT 
    name,
    category,
    website,
    is_active,
    CASE 
        WHEN image_url IS NOT NULL THEN 'Has Image'
        ELSE 'No Image'
    END as image_status,
    CASE 
        WHEN logo_url IS NOT NULL THEN 'Has Logo'
        ELSE 'No Logo'
    END as logo_status
FROM public.brands
ORDER BY name;

-- Expected output: All 15 brands listed with their categories

-- Check for any brands missing descriptions
SELECT 
    name,
    category,
    CASE 
        WHEN description IS NULL OR description = '' THEN 'MISSING DESCRIPTION'
        ELSE 'Has Description'
    END as description_status
FROM public.brands
WHERE name IN (
    'Pelican Systems', 'Live Acoustics', 'Live Electronics', 'Trellidor',
    'Isoboard', 'Taylor Blinds & Shutters', 'Led Urban', 'Pinnacle Stone',
    'Noel & Marquet', 'Richmond Plumbing & Sanitaryware', 'Rubio Monocoat',
    'Dreamweaver Studios', 'Studio Delta', 'Hammond Timbers', 'DADO Creations'
)
ORDER BY name;

-- Expected output: All should show "Has Description"

-- Summary statistics
SELECT 
    'Total Brands' as metric,
    COUNT(*)::text as value
FROM public.brands
UNION ALL
SELECT 
    'Active Brands',
    COUNT(*)::text
FROM public.brands
WHERE is_active = true
UNION ALL
SELECT 
    'Brands with Images',
    COUNT(*)::text
FROM public.brands
WHERE image_url IS NOT NULL
UNION ALL
SELECT 
    'Brands with Logos',
    COUNT(*)::text
FROM public.brands
WHERE logo_url IS NOT NULL
UNION ALL
SELECT 
    'Unique Categories',
    COUNT(DISTINCT category)::text
FROM public.brands;

-- Expected output:
-- Total Brands: 15 or more
-- Active Brands: 15 or more
-- Brands with Images: 0 (until images are added)
-- Brands with Logos: 0 (until logos are added)
-- Unique Categories: various (depending on what was already there)

-- Show all Inexss brand categories
SELECT DISTINCT category, COUNT(*) as brand_count
FROM public.brands
WHERE name IN (
    'Pelican Systems', 'Live Acoustics', 'Live Electronics', 'Trellidor',
    'Isoboard', 'Taylor Blinds & Shutters', 'Led Urban', 'Pinnacle Stone',
    'Noel & Marquet', 'Richmond Plumbing & Sanitaryware', 'Rubio Monocoat',
    'Dreamweaver Studios', 'Studio Delta', 'Hammond Timbers', 'DADO Creations'
)
GROUP BY category
ORDER BY category;

-- Expected output: 15 unique categories with 1 brand each
