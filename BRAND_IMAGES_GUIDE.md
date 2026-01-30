# Brand Images and Logos Configuration

This file provides sample image URLs and guidance for adding images to the Inexss brands. After collecting or creating brand images, update each brand in the CRM with the appropriate URLs.

## Image Hosting Options

1. **Supabase Storage** (Recommended for this project)
   - Upload images to your Supabase Storage bucket
   - Make images public or use signed URLs
   - Example: `https://your-project.supabase.co/storage/v1/object/public/brand-images/pelican-systems.jpg`

2. **Cloudinary**
   - Free tier available
   - Automatic image optimization
   - Example: `https://res.cloudinary.com/your-account/image/upload/v1234/pelican-systems.jpg`

3. **AWS S3 / CloudFront**
   - Scalable and reliable
   - Example: `https://your-bucket.s3.amazonaws.com/brands/pelican-systems.jpg`

4. **Imgix**
   - Real-time image processing
   - Example: `https://your-account.imgix.net/brands/pelican-systems.jpg`

## Brand Image Specifications

### Header/Banner Images
- **Dimensions**: 1200px × 400px (3:1 ratio)
- **Format**: JPG or PNG
- **Size**: < 300KB
- **Content**: Brand imagery, product showcase, or themed background

### Logo Images
- **Dimensions**: 500px × 500px (square) or 600px × 300px (horizontal)
- **Format**: PNG (with transparency preferred)
- **Size**: < 100KB
- **Content**: Brand logo on transparent background

## Sample Image URLs Structure

Once you have your images hosted, update the brands using this SQL pattern:

```sql
-- Example: Update Pelican Systems
UPDATE public.brands 
SET 
  image_url = 'https://your-storage.com/brands/pelican-systems-header.jpg',
  logo_url = 'https://your-storage.com/brands/pelican-systems-logo.png'
WHERE name = 'Pelican Systems';

-- Example: Update Live Acoustics
UPDATE public.brands 
SET 
  image_url = 'https://your-storage.com/brands/live-acoustics-header.jpg',
  logo_url = 'https://your-storage.com/brands/live-acoustics-logo.png'
WHERE name = 'Live Acoustics';
```

Or update via the CRM UI:
1. Navigate to Brands & Principals
2. Click Edit on the brand
3. Paste image URLs into "Brand Image URL" and "Brand Logo URL" fields
4. Click Save

## Placeholder Images (Development/Testing)

For testing purposes, you can use placeholder images:

```sql
-- Using placeholder service (for development only)
UPDATE public.brands 
SET 
  image_url = 'https://via.placeholder.com/1200x400/667eea/ffffff?text=Pelican+Systems',
  logo_url = 'https://via.placeholder.com/300x300/667eea/ffffff?text=Logo'
WHERE name = 'Pelican Systems';
```

## Brand-Specific Notes

### 1. Pelican Systems
- Category: Building Products
- Color Theme: Purple (#667eea)
- Suggested imagery: Ceiling systems, partition walls, modern interiors

### 2. Live Acoustics
- Category: Acoustics
- Color Theme: Pink-Yellow gradient
- Suggested imagery: Acoustic panels, baffles, sound treatment

### 3. Live Electronics
- Category: Automation
- Color Theme: Blue gradient
- Suggested imagery: Smart home controls, automation interfaces

### 4. Trellidor
- Category: Security
- Color Theme: Pink-Red gradient
- Suggested imagery: Security screens, burglar bars, shutters

### 5. Isoboard
- Category: Insulation
- Color Theme: Cool blue-purple
- Suggested imagery: Insulation boards, thermal barriers

### 6. Taylor Blinds & Shutters
- Category: Blinds & Shutters
- Color Theme: Yellow-Pink gradient
- Suggested imagery: Window blinds, shutters, interior shots

### 7. Led Urban
- Category: Lighting
- Color Theme: Yellow-Orange gradient
- Suggested imagery: LED fixtures, lighting installations

### 8. Pinnacle Stone
- Category: Stone & Surfaces
- Color Theme: Blue gradient
- Suggested imagery: Quartz countertops, stone surfaces, marble

### 9. Noel & Marquet
- Category: Interior Design
- Color Theme: Red-Orange gradient
- Suggested imagery: Cornices, 3D wall panels, decorative elements

### 10. Richmond Plumbing
- Category: Plumbing
- Color Theme: Aqua blue
- Suggested imagery: Bathroom fixtures, taps, plumbing fittings

### 11. Rubio Monocoat
- Category: Wood Finishes
- Color Theme: Brown wood tones
- Suggested imagery: Wood finishes, treated timber, oil applications

### 12. Dreamweaver Studios
- Category: Wallcoverings
- Color Theme: Pink-Yellow gradient
- Suggested imagery: Wallpaper patterns, wall textures, murals

### 13. Studio Delta
- Category: Furniture
- Color Theme: Green gradient
- Suggested imagery: Custom furniture, craftsmanship, bespoke pieces

### 14. Hammond Timbers
- Category: Flooring
- Color Theme: Brown wood tones
- Suggested imagery: Wood flooring, hardwood planks, engineered oak

### 15. DADO Creations
- Category: Bathware
- Color Theme: Light blue
- Suggested imagery: Bathtubs, basins, quartz composite products

## Image Collection Tips

1. **Official Sources**: Contact each brand for official marketing images
2. **Website Screenshots**: Capture hero images from brand websites (with permission)
3. **Professional Photography**: Commission custom photos for consistency
4. **Stock Images**: Use royalty-free images that represent the brand category
5. **Brand Guidelines**: Follow each brand's visual identity guidelines

## Batch Update Script

After preparing all images, use this script template:

```sql
-- Batch update all brand images
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/pelican-systems.jpg', logo_url = 'https://your-storage.com/logos/pelican-systems.png' WHERE name = 'Pelican Systems';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/live-acoustics.jpg', logo_url = 'https://your-storage.com/logos/live-acoustics.png' WHERE name = 'Live Acoustics';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/live-electronics.jpg', logo_url = 'https://your-storage.com/logos/live-electronics.png' WHERE name = 'Live Electronics';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/trellidor.jpg', logo_url = 'https://your-storage.com/logos/trellidor.png' WHERE name = 'Trellidor';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/isoboard.jpg', logo_url = 'https://your-storage.com/logos/isoboard.png' WHERE name = 'Isoboard';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/taylor-blinds.jpg', logo_url = 'https://your-storage.com/logos/taylor-blinds.png' WHERE name = 'Taylor Blinds & Shutters';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/led-urban.jpg', logo_url = 'https://your-storage.com/logos/led-urban.png' WHERE name = 'Led Urban';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/pinnacle-stone.jpg', logo_url = 'https://your-storage.com/logos/pinnacle-stone.png' WHERE name = 'Pinnacle Stone';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/noel-marquet.jpg', logo_url = 'https://your-storage.com/logos/noel-marquet.png' WHERE name = 'Noel & Marquet';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/richmond-plumbing.jpg', logo_url = 'https://your-storage.com/logos/richmond-plumbing.png' WHERE name = 'Richmond Plumbing & Sanitaryware';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/rubio-monocoat.jpg', logo_url = 'https://your-storage.com/logos/rubio-monocoat.png' WHERE name = 'Rubio Monocoat';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/dreamweaver-studios.jpg', logo_url = 'https://your-storage.com/logos/dreamweaver-studios.png' WHERE name = 'Dreamweaver Studios';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/studio-delta.jpg', logo_url = 'https://your-storage.com/logos/studio-delta.png' WHERE name = 'Studio Delta';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/hammond-timbers.jpg', logo_url = 'https://your-storage.com/logos/hammond-timbers.png' WHERE name = 'Hammond Timbers';
UPDATE public.brands SET image_url = 'https://your-storage.com/brands/dado-creations.jpg', logo_url = 'https://your-storage.com/logos/dado-creations.png' WHERE name = 'DADO Creations';
```

## Checklist

- [ ] Choose an image hosting service
- [ ] Collect/create brand header images (1200x400px)
- [ ] Collect/create brand logos (square or horizontal)
- [ ] Optimize images for web (compress file sizes)
- [ ] Upload images to hosting service
- [ ] Get public URLs for each image
- [ ] Update brands via CRM UI or SQL script
- [ ] Verify images display correctly in the CRM
- [ ] Test on mobile devices
- [ ] Update brand websites if they've changed

## Support

For assistance with image hosting or brand image collection, refer to:
- Brand websites for official assets
- Marketing contact at each brand
- Inexss marketing team for coordination
