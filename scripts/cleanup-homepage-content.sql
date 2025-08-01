-- Homepage Content Cleanup Script
-- This script removes duplicate and outdated content, keeping only essential homepage sections

-- First, let's see what we have
-- SELECT key, title, page, section FROM "website_content" WHERE page = 'homepage' ORDER BY section, "order";

-- Remove duplicate and outdated content
DELETE FROM "website_content" WHERE page = 'homepage' AND key IN (
  -- Remove duplicate site branding (keep only one set)
  'site_name_duplicate',
  'site_tagline_duplicate', 
  'site_description_duplicate',
  
  -- Remove individual boat/dahabiya references (replaced by packages)
  'boat_1_title',
  'boat_1_description', 
  'boat_1_image',
  'boat_2_title',
  'boat_2_description',
  'boat_2_image', 
  'boat_3_title',
  'boat_3_description',
  'boat_3_image',
  'boat_4_title', 
  'boat_4_description',
  'boat_4_image',
  'our_boats_section_title',
  
  -- Remove outdated dahabiya-specific content
  'dahabiyat_section_title',
  'dahabiyat_section_subtitle', 
  'dahabiyat_section_content',
  'refreshing_data_text',
  
  -- Remove old blog references (should be dynamic)
  'blog_1_title',
  'blog_1_date',
  'blog_1_excerpt', 
  'blog_1_image',
  'blog_2_title',
  'blog_2_date',
  'blog_2_excerpt',
  'blog_2_image',
  'blog_3_title', 
  'blog_3_date',
  'blog_3_excerpt',
  'blog_3_image',
  
  -- Remove old tour references (should be dynamic packages)
  'tour_1_title',
  'tour_1_description',
  'tour_1_price', 
  'tour_1_duration',
  'tour_1_cabins',
  'tour_1_image',
  'tour_2_title',
  'tour_2_description',
  'tour_2_price',
  'tour_2_duration', 
  'tour_2_cabins',
  'tour_2_image',
  'tour_3_title',
  'tour_3_description',
  'tour_3_price',
  'tour_3_duration',
  'tour_3_cabins', 
  'tour_3_image',
  'sailing_tours_section_title'
);

-- Update existing content to be package-focused instead of dahabiya-focused
UPDATE "website_content" SET 
  content = 'Discover Egypt with Our Luxury Nile Packages',
  title = 'Hero Section Title'
WHERE page = 'homepage' AND key = 'hero_section_headline';

UPDATE "website_content" SET 
  content = 'Experience luxury and adventure on our premium Nile cruise packages',
  title = 'Hero Section Subtitle'  
WHERE page = 'homepage' AND key = 'hero_section_subheadline';

UPDATE "website_content" SET
  content = 'Our Packages',
  title = 'Featured Section Title'
WHERE page = 'homepage' AND key = 'featured_cruises_section_title';

UPDATE "website_content" SET
  content = 'Explore our most popular Nile cruise packages',
  title = 'Featured Section Subtitle'
WHERE page = 'homepage' AND key = 'featured_cruises_section_subtitle';

-- Update About section to be more general
UPDATE "website_content" SET
  content = 'Experience the magic of ancient Egypt on our luxury Nile cruises. We offer carefully curated packages that combine comfort, adventure, and authentic cultural experiences.',
  title = 'About Section Text'
WHERE page = 'homepage' AND key = 'about_section_text';

-- Update What is Dahabiya section to be more general about Nile cruising
UPDATE "website_content" SET
  content = 'What Makes Our Nile Cruises Special?',
  title = 'Experience Section Title'
WHERE page = 'homepage' AND key = 'what_is_dahabiya_section_title';

UPDATE "website_content" SET
  content = 'Our Nile cruises offer an intimate and luxurious way to explore Egypt. Unlike large cruise ships, our carefully selected vessels provide personalized service and access to exclusive locations.',
  title = 'Experience Main Content'
WHERE page = 'homepage' AND key = 'what_is_dahabiya_main_content';

-- Clean up section organization
UPDATE "website_content" SET section = 'hero' WHERE page = 'homepage' AND key LIKE 'hero_%';
UPDATE "website_content" SET section = 'about' WHERE page = 'homepage' AND key LIKE 'about_%';
UPDATE "website_content" SET section = 'features' WHERE page = 'homepage' AND key LIKE 'what_is_%';
UPDATE "website_content" SET section = 'features' WHERE page = 'homepage' AND key LIKE 'why_%';
UPDATE "website_content" SET section = 'story' WHERE page = 'homepage' AND key LIKE 'our_story_%';
UPDATE "website_content" SET section = 'story' WHERE page = 'homepage' AND key LIKE 'founder_%';
UPDATE "website_content" SET section = 'safety' WHERE page = 'homepage' AND key LIKE 'safety_%';
UPDATE "website_content" SET section = 'testimonials' WHERE page = 'homepage' AND key LIKE 'testimonials_%';
UPDATE "website_content" SET section = 'cta' WHERE page = 'homepage' AND key LIKE 'call_to_action_%';
UPDATE "website_content" SET section = 'contact' WHERE page = 'homepage' AND key LIKE 'contact_%';
UPDATE "website_content" SET section = 'featured' WHERE page = 'homepage' AND key LIKE 'featured_%';
UPDATE "website_content" SET section = 'branding' WHERE page = 'homepage' AND key IN ('site_name', 'site_tagline', 'site_description');

-- Set proper ordering
UPDATE "website_content" SET "order" = 1 WHERE page = 'homepage' AND section = 'branding';
UPDATE "website_content" SET "order" = 2 WHERE page = 'homepage' AND section = 'hero';
UPDATE "website_content" SET "order" = 3 WHERE page = 'homepage' AND section = 'about';
UPDATE "website_content" SET "order" = 4 WHERE page = 'homepage' AND section = 'featured';
UPDATE "website_content" SET "order" = 5 WHERE page = 'homepage' AND section = 'features';
UPDATE "website_content" SET "order" = 6 WHERE page = 'homepage' AND section = 'safety';
UPDATE "website_content" SET "order" = 7 WHERE page = 'homepage' AND section = 'story';
UPDATE "website_content" SET "order" = 8 WHERE page = 'homepage' AND section = 'testimonials';
UPDATE "website_content" SET "order" = 9 WHERE page = 'homepage' AND section = 'contact';
UPDATE "website_content" SET "order" = 10 WHERE page = 'homepage' AND section = 'cta';

-- Verify the cleanup
SELECT 
  section,
  COUNT(*) as field_count,
  STRING_AGG(key, ', ' ORDER BY "order") as fields
FROM "website_content" 
WHERE page = 'homepage' AND "isActive" = true
GROUP BY section 
ORDER BY MIN("order");
