// Homepage Content Cleanup and Reorganization Script
// Run this with: node scripts/implement-clean-homepage.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupHomepageContent() {
  console.log('🧹 Starting homepage content cleanup...');

  try {
    // 1. Remove duplicate and outdated content
    console.log('📝 Removing duplicate and outdated content...');
    
    const duplicateKeys = [
      // Duplicate site branding
      'site_name_duplicate', 'site_tagline_duplicate', 'site_description_duplicate',

      // Individual boat/dahabiya references (using actual keys from analysis)
      'home_boats_1_title', 'home_boats_1_desc', 'home_boats_1_image',
      'home_boats_2_title', 'home_boats_2_desc', 'home_boats_2_image',
      'home_boats_3_title', 'home_boats_3_desc', 'home_boats_3_image',
      'home_boats_4_title', 'home_boats_4_desc', 'home_boats_4_image',
      'home_boats_section_title',

      // Outdated dahabiya-specific content (using actual keys)
      'dahabiyat_title', 'dahabiyat_subtitle', 'dahabiyat_content', 'refreshing_data_text',

      // Static blog content (using actual keys from analysis)
      'home_blog_1_title', 'home_blog_1_date', 'home_blog_1_excerpt', 'home_blog_1_image',
      'home_blog_2_title', 'home_blog_2_date', 'home_blog_2_excerpt', 'home_blog_2_image',
      'home_blog_3_title', 'home_blog_3_date', 'home_blog_3_excerpt', 'home_blog_3_image',

      // Static tour content (using actual keys from analysis)
      'home_tours_1_title', 'home_tours_1_desc', 'home_tours_1_price', 'home_tours_1_duration', 'home_tours_1_cabins', 'home_tours_1_image',
      'home_tours_2_title', 'home_tours_2_desc', 'home_tours_2_price', 'home_tours_2_duration', 'home_tours_2_cabins', 'home_tours_2_image',
      'home_tours_3_title', 'home_tours_3_desc', 'home_tours_3_price', 'home_tours_3_duration', 'home_tours_3_cabins', 'home_tours_3_image',
      'home_tours_section_title'
    ];

    const deleteResult = await prisma.websiteContent.deleteMany({
      where: {
        page: 'homepage',
        key: { in: duplicateKeys }
      }
    });
    
    console.log(`✅ Removed ${deleteResult.count} duplicate/outdated content blocks`);

    // 2. Update existing content to be package-focused
    console.log('🔄 Updating content to be package-focused...');
    
    const updates = [
      {
        key: 'home_hero_headline',
        content: 'Discover Egypt with Our Luxury Nile Packages',
        title: 'Hero Section Title'
      },
      {
        key: 'home_hero_subheadline',
        content: 'Experience luxury and adventure on our premium Nile cruise packages',
        title: 'Hero Section Subtitle'
      },
      {
        key: 'home_featured_title',
        content: 'Our Packages',
        title: 'Featured Section Title'
      },
      {
        key: 'home_featured_subtitle',
        content: 'Explore our most popular Nile cruise packages',
        title: 'Featured Section Subtitle'
      },
      {
        key: 'home_about_text',
        content: 'Experience the magic of ancient Egypt on our luxury Nile cruises. We offer carefully curated packages that combine comfort, adventure, and authentic cultural experiences.',
        title: 'About Section Text'
      },
      {
        key: 'what_is_dahabiya_title',
        content: 'What Makes Our Nile Cruises Special?',
        title: 'Experience Section Title'
      },
      {
        key: 'what_is_dahabiya_content',
        content: 'Our Nile cruises offer an intimate and luxurious way to explore Egypt. Unlike large cruise ships, our carefully selected vessels provide personalized service and access to exclusive locations.',
        title: 'Experience Main Content'
      },
      {
        key: 'home_why_title',
        content: 'Why Choose Our Nile Cruises?',
        title: 'Why Choose Us Title'
      },
      {
        key: 'home_why_text',
        content: 'Our cruises offer intimate experiences with small groups, personalized service, and access to exclusive locations that large cruise ships cannot reach.',
        title: 'Why Choose Us Text'
      }
    ];

    for (const update of updates) {
      await prisma.websiteContent.updateMany({
        where: {
          page: 'homepage',
          key: update.key
        },
        data: {
          content: update.content,
          title: update.title
        }
      });
    }
    
    console.log(`✅ Updated ${updates.length} content blocks`);

    // 3. Organize sections properly
    console.log('📂 Organizing sections...');
    
    const sectionMappings = [
      { pattern: 'home_hero_', section: 'hero' },
      { pattern: 'hero_', section: 'hero' },
      { pattern: 'home_about_', section: 'about' },
      { pattern: 'what_is_', section: 'features' },
      { pattern: 'why_different_', section: 'features' },
      { pattern: 'home_why_', section: 'features' },
      { pattern: 'our_story_', section: 'story' },
      { pattern: 'founder_', section: 'story' },
      { pattern: 'safety_', section: 'safety' },
      { pattern: 'home_testimonials_', section: 'testimonials' },
      { pattern: 'home_cta_', section: 'cta' },
      { pattern: 'home_contact_', section: 'contact' },
      { pattern: 'home_featured_', section: 'featured' },
      { pattern: 'home_how_', section: 'features' },
      { pattern: 'share_memories_', section: 'story' }
    ];

    for (const mapping of sectionMappings) {
      await prisma.websiteContent.updateMany({
        where: {
          page: 'homepage',
          key: { contains: mapping.pattern.replace('%', '') }
        },
        data: { section: mapping.section }
      });
    }

    // Update branding section
    await prisma.websiteContent.updateMany({
      where: {
        page: 'homepage',
        key: { in: ['site_name', 'site_tagline', 'site_description'] }
      },
      data: { section: 'branding' }
    });

    console.log('✅ Sections organized');

    // 4. Set proper ordering
    console.log('🔢 Setting section order...');
    
    const sectionOrders = {
      'branding': 1,
      'hero': 2,
      'about': 3,
      'featured': 4,
      'features': 5,
      'safety': 6,
      'story': 7,
      'testimonials': 8,
      'contact': 9,
      'cta': 10
    };

    for (const [section, order] of Object.entries(sectionOrders)) {
      await prisma.websiteContent.updateMany({
        where: {
          page: 'homepage',
          section: section
        },
        data: { order: order }
      });
    }

    console.log('✅ Section ordering set');

    // 5. Verify the cleanup
    console.log('🔍 Verifying cleanup results...');
    
    const sections = await prisma.websiteContent.groupBy({
      by: ['section'],
      where: {
        page: 'homepage',
        isActive: true
      },
      _count: { key: true },
      orderBy: { section: 'asc' }
    });

    console.log('\n📊 Homepage Content Summary:');
    for (const section of sections) {
      console.log(`  ${section.section}: ${section._count.key} fields`);
    }

    // Get total count
    const totalCount = await prisma.websiteContent.count({
      where: {
        page: 'homepage',
        isActive: true
      }
    });

    console.log(`\n✅ Cleanup completed! Total homepage fields: ${totalCount}`);
    console.log('\n🎉 Homepage content is now clean and organized!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupHomepageContent();
