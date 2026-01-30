-- Migration: Add Inexss brands to the CRM
-- This migration adds the 15 official Inexss brands as they appear on inexss.co.za

-- Insert Pelican Systems
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Pelican Systems',
  'Building Products',
  'A full range of building products for Commercial and Residential interiors: Ceilings, Partitions, Doors, and Hardware. BIM Details are available for enhanced project planning and design.',
  'https://www.pelicansystems.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Live Acoustics
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Live Acoustics',
  'Acoustics',
  'Custom-made Acoustic Solutions designed to enhance sound quality: Baffles, Wall Panels, Acoustic Panels, Drop-in Acoustic Tiles, and Room Dividers for various environments.',
  'https://www.liveacoustics.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Live Electronics
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Live Electronics',
  'Automation',
  'Automation and intelligent building solutions for Residential and Commercial Projects, featuring advanced systems from Crestron, Control 4, and Lutron for seamless control and efficiency.',
  'https://www.liveelectronics.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Trellidor
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Trellidor',
  'Security',
  'Comprehensive security barriers for doors and windows, including Traditional Trellidor, Burglar Bars, Louvre Shutters, Security Screens, Roller Shutters, and Sectional Doors, with BIM4U compatibility.',
  'https://www.trellidor.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Isoboard
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Isoboard',
  'Insulation',
  'A rigid board bulk thermal insulator available in various thicknesses and lengths, designed to meet diverse thermal insulation requirements, utilizing XPS technology for superior performance.',
  'https://www.isoboard.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Taylor Blinds & Shutters
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Taylor Blinds & Shutters',
  'Blinds & Shutters',
  'The preferred choice for home and business owners seeking quality, style, and security, offering locally crafted Indoor Blinds, Outdoor Blinds, and Shutters with a focus on craftsmanship.',
  'https://www.taylorblinds.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Led Urban
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Led Urban',
  'Lighting',
  'Specializes in innovative lighting solutions for Commercial, Hospitality, Medical, Industrial, Retail, and Residential markets, delivering energy-efficient and modern lighting designs.',
  'https://www.ledurban.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Pinnacle Stone
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Pinnacle Stone',
  'Stone & Surfaces',
  'A South African supplier of high-quality engineered quartz, granite, and marble surfaces under the Pinnacle Quartz brand, offering competitive prices and superior craftsmanship.',
  'https://www.pinnaclestone.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Noel & Marquet
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Noel & Marquet',
  'Interior Design',
  'High-quality, sustainably produced design elements for creative interior design, featuring Cornices, Chair Rails, 3D Wall Panels, Skirtings, and Indirect Lighting Profiles.',
  'https://www.noelandmarquet.com',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Richmond Plumbing
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Richmond Plumbing & Sanitaryware',
  'Plumbing',
  'Leading stockist and distributor of high-grade bathroom and kitchen fittings for residential builds, commercial projects, and industrial installations, featuring brands like Duravit, Geberit, Grohe, Cobra, and Franke.',
  'https://www.richmondplumbing.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Rubio Monocoat
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Rubio Monocoat',
  'Wood Finishes',
  'Protects and colors wood in a single layer, offering Interior Oils for wood floors, furniture, kitchens, and cupboards, as well as Exterior Wood Oils for decking, cladding, and pergolas, and Exterior Wood Cream for vertical timber.',
  'https://www.rubiomonocoat.com',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Dreamweaver Studios
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Dreamweaver Studios',
  'Wallcoverings',
  'Specializes in wallcoverings suitable for both Residential and Commercial projects, offering Non-woven Wallcoverings, Textured Vinyl Wallcoverings, Contract Wallcovering, Digital Panels & Murals, Grasscloth Qualities, and Novelties.',
  'https://www.dreamweaverstudios.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Studio Delta
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Studio Delta',
  'Furniture',
  'Specialising in handcrafted furniture pieces that seamlessly blend craftsmanship, aesthetics and functionality. Bespoke pieces can be modified with choices of colour, finishes and dimensions for Residential or Commercial Projects: Steel, Wood, Glass, Fabric. BIM details available on request.',
  'https://www.studiodelta.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert Hammond Timbers
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'Hammond Timbers',
  'Flooring',
  'Solid Wood Flooring Specialists. We offer a wide variety of different hardwoods and engineered French oak, stains and widths to ensure that your wood floors will complement any style of décor.',
  'https://www.hammondtimbers.co.za',
  true
) ON CONFLICT (name) DO NOTHING;

-- Insert DADO Creations
INSERT INTO public.brands (name, category, description, website, is_active)
VALUES (
  'DADO Creations',
  'Bathware',
  'A trusted South African brand in premium bathware, for homes and hospitality spaces. Our signature DADOquartz® is a locally manufactured solid quartz composite, known for its strength, silky finish and timeless designs, with a lifetime warranty on bathtubs, basins, and shower floors. DADOacrylic offers lightweight, modern acrylic luxurious bathtubs. We are proud distributors of JEE-O, a Netherlands brand of bold stainless steel showers and taps.',
  'https://www.dado.co.za',
  true
) ON CONFLICT (name) DO NOTHING;
