# Brand Images and Logo Migration

## Overview
This migration adds support for brand images and logos to the CRM system, and populates the database with the 15 official Inexss brands as they appear on inexss.co.za.

## Migration Files

### 1. `migration_add_brand_images.sql`
Adds two new fields to the `brands` table:
- `image_url` (TEXT): URL to the brand header/banner image
- `logo_url` (TEXT): URL to the brand logo image

### 2. `migration_add_inexss_brands.sql`
Inserts the 15 official Inexss brands with their descriptions and website URLs:
1. Pelican Systems - Building Products
2. Live Acoustics - Acoustics
3. Live Electronics - Automation
4. Trellidor - Security
5. Isoboard - Insulation
6. Taylor Blinds & Shutters - Blinds & Shutters
7. Led Urban - Lighting
8. Pinnacle Stone - Stone & Surfaces
9. Noel & Marquet - Interior Design
10. Richmond Plumbing & Sanitaryware - Plumbing
11. Rubio Monocoat - Wood Finishes
12. Dreamweaver Studios - Wallcoverings
13. Studio Delta - Furniture
14. Hammond Timbers - Flooring
15. DADO Creations - Bathware

## How to Apply

### Via Supabase Dashboard (Recommended)

1. Log in to your Supabase project at https://supabase.com
2. Navigate to the SQL Editor
3. Run `migration_add_brand_images.sql` first
4. Run `migration_add_inexss_brands.sql` second

### Via Supabase CLI

```bash
# Apply the image fields migration
supabase db push --file supabase/migration_add_brand_images.sql

# Apply the brands data migration
supabase db push --file supabase/migration_add_inexss_brands.sql
```

## Frontend Changes

The BrandsManager component has been updated to:
- Display brand images as header banners
- Display brand logos overlaying the images or standalone
- Allow adding/editing image_url and logo_url fields in the brand form
- Support new brand categories matching the Inexss brand portfolio

## Adding Images and Logos

After running the migrations, you can add images and logos by:

1. **Using the CRM UI:**
   - Navigate to Brands & Principals
   - Click on a brand to edit it
   - Add URLs to the "Brand Image URL" and "Brand Logo URL" fields

2. **Directly in the Database:**
   ```sql
   UPDATE public.brands 
   SET 
     image_url = 'https://example.com/brand-image.jpg',
     logo_url = 'https://example.com/brand-logo.png'
   WHERE name = 'Brand Name';
   ```

## Image Recommendations

- **Brand Images**: 1200x400px or similar wide format (header/banner style)
- **Brand Logos**: Square or horizontal format, transparent background PNG recommended
- **File Size**: Keep images under 500KB for optimal performance
- **Hosting**: Use a reliable image hosting service (Supabase Storage, Cloudinary, imgix, etc.)

## Rollback

If you need to rollback these changes:

```sql
-- Remove the brands data
DELETE FROM public.brands 
WHERE name IN (
  'Pelican Systems', 'Live Acoustics', 'Live Electronics', 
  'Trellidor', 'Isoboard', 'Taylor Blinds & Shutters',
  'Led Urban', 'Pinnacle Stone', 'Noel & Marquet',
  'Richmond Plumbing & Sanitaryware', 'Rubio Monocoat',
  'Dreamweaver Studios', 'Studio Delta', 'Hammond Timbers',
  'DADO Creations'
);

-- Remove the image columns
ALTER TABLE public.brands 
DROP COLUMN IF EXISTS image_url,
DROP COLUMN IF EXISTS logo_url;
```

## Notes

- The migrations use `ON CONFLICT DO NOTHING` for brand inserts, so running them multiple times is safe
- Brands are created as active by default (`is_active = true`)
- Website URLs are placeholder estimates based on brand names (verify and update as needed)
- Image and logo URLs need to be added separately after the migration
