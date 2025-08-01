# Recommended Homepage Content Structure

## Current Issues
- Duplicate content blocks (Site Name appears twice)
- Outdated dahabiya-specific content (individual boat sections)
- Inconsistent field organization
- Orphaned content blocks

## Recommended Clean Structure

### 1. **Branding Section** (order: 1)
- `site_name` - Site Name
- `site_tagline` - Site Tagline  
- `site_description` - Site Description

### 2. **Hero Section** (order: 2)
- `hero_section_headline` - Main Headline
- `hero_section_subheadline` - Subtitle
- `hero_section_background_image` - Background Image
- `hero_section_background_video` - Background Video
- `hero_video_title` - Video Title
- `hero_video_subtitle` - Video Subtitle
- `hero_cta_button_text` - CTA Button Text
- `hero_scroll_text` - Scroll Text

### 3. **About Section** (order: 3)
- `about_section_title` - About Title
- `about_section_text` - About Description
- `about_section_image` - About Image

### 4. **Featured Packages** (order: 4)
- `featured_cruises_section_title` - Section Title
- `featured_cruises_section_subtitle` - Section Subtitle
- *(Packages loaded dynamically from database)*

### 5. **Features/Experience** (order: 5)
- `what_is_dahabiya_section_title` - Experience Title
- `what_is_dahabiya_main_content` - Experience Description
- `what_is_dahabiya_image_1` - Feature Image 1
- `what_is_dahabiya_image_2` - Feature Image 2
- `what_is_dahabiya_image_3` - Feature Image 3
- `why_different_section_title` - Why Choose Us Title
- `why_dahabiya_section_text` - Why Choose Us Text
- `why_different_image_1` - Why Choose Image 1
- `why_different_image_2` - Why Choose Image 2
- `why_different_image_3` - Why Choose Image 3

### 6. **How It Works** (order: 6)
- `how_it_works_section_title` - Section Title
- `how_it_works_step_1_title` - Step 1 Title
- `how_it_works_step_1_description` - Step 1 Description
- `how_it_works_step_1_icon` - Step 1 Icon
- `how_it_works_step_2_title` - Step 2 Title
- `how_it_works_step_2_description` - Step 2 Description
- `how_it_works_step_2_icon` - Step 2 Icon
- `how_it_works_step_3_title` - Step 3 Title
- `how_it_works_step_3_description` - Step 3 Description
- `how_it_works_step_3_icon` - Step 3 Icon

### 7. **Safety Section** (order: 7)
- `safety_section_title` - Safety Title
- `safety_main_content` - Safety Description
- `safety_feature_1_icon` - Feature 1 Icon
- `safety_feature_1_title` - Feature 1 Title
- `safety_feature_1_description` - Feature 1 Description
- `safety_feature_2_icon` - Feature 2 Icon
- `safety_feature_2_title` - Feature 2 Title
- `safety_feature_2_description` - Feature 2 Description
- `safety_feature_3_icon` - Feature 3 Icon
- `safety_feature_3_title` - Feature 3 Title
- `safety_feature_3_description` - Feature 3 Description

### 8. **Our Story** (order: 8)
- `our_story_section_title` - Story Title
- `our_story_cta_button_text` - Story CTA Button
- `our_story_main_content` - Story Main Content
- `our_story_paragraph_2` - Story Paragraph 2
- `our_story_paragraph_3` - Story Paragraph 3
- `our_story_paragraph_4` - Story Paragraph 4
- `founder_image` - Founder Image
- `founder_name` - Founder Name
- `founder_title` - Founder Title

### 9. **Share Memories** (order: 9)
- `share_memories_section_title` - Section Title
- `share_memories_main_content` - Main Content
- `share_memories_paragraph_2` - Paragraph 2
- `share_memories_paragraph_3` - Paragraph 3
- `share_memories_gallery_button` - Gallery Button Text
- `share_memories_reviews_button` - Reviews Button Text
- `share_memories_image_1` - Memory Image 1
- `share_memories_image_2` - Memory Image 2
- `share_memories_image_3` - Memory Image 3

### 10. **Testimonials** (order: 10)
- `testimonials_section_title` - Section Title
- `testimonials_section_subtitle` - Section Subtitle
- `testimonials_section_background_image` - Background Image
- *(Testimonials loaded dynamically from database)*

### 11. **Contact** (order: 11)
- `contact_section_title` - Contact Title
- `contact_section_text` - Contact Description
- `contact_phone` - Phone Number
- `contact_email` - Email Address

### 12. **Call to Action** (order: 12)
- `call_to_action_section_title` - CTA Title
- `call_to_action_section_subtitle` - CTA Subtitle
- `call_to_action_button_text` - CTA Button Text
- `call_to_action_section_background_image` - CTA Background

## Content to Remove

### Duplicate Content
- Any duplicate `site_name`, `site_tagline`, `site_description` entries
- Duplicate hero section fields

### Outdated Dahabiya-Specific Content
- `boat_1_*`, `boat_2_*`, `boat_3_*`, `boat_4_*` fields
- `our_boats_section_title`
- `dahabiyat_section_*` fields
- `refreshing_data_text`

### Static Blog Content (Should be Dynamic)
- `blog_1_*`, `blog_2_*`, `blog_3_*` fields
- `blog_section_title` (keep this one)

### Static Tour Content (Should be Dynamic Packages)
- `tour_1_*`, `tour_2_*`, `tour_3_*` fields
- `sailing_tours_section_title`

## Implementation Steps

1. **Run the cleanup SQL script** to remove duplicates and outdated content
2. **Update content** to be package-focused instead of dahabiya-focused
3. **Reorganize sections** with proper ordering
4. **Test the homepage** to ensure all content displays correctly
5. **Update admin interface** to reflect the new structure

This structure provides a clean, organized homepage that focuses on packages rather than individual dahabiyas, eliminates duplication, and maintains all essential content sections.
