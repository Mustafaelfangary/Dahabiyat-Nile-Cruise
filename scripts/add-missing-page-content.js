const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMissingPageContent() {
  console.log('🔍 Checking existing content...');
  
  // Check what content currently exists
  const existingContent = await prisma.websiteContent.findMany({
    select: {
      page: true,
      key: true,
      title: true
    },
    orderBy: [
      { page: 'asc' },
      { section: 'asc' },
      { order: 'asc' }
    ]
  });

  console.log('📋 Current content pages:');
  const pageGroups = {};
  existingContent.forEach(content => {
    if (!pageGroups[content.page]) {
      pageGroups[content.page] = [];
    }
    pageGroups[content.page].push(content.key);
  });

  Object.keys(pageGroups).forEach(page => {
    console.log(`  ${page}: ${pageGroups[page].length} items`);
  });

  console.log('\n🚀 Adding missing page content...');

  // Define content for missing pages
  const missingPagesContent = [
    // PACKAGES PAGE CONTENT
    {
      key: 'packages_hero_title',
      title: 'Packages Hero Title',
      content: 'Our Luxury Packages',
      contentType: 'TEXT',
      page: 'packages',
      section: 'hero',
      order: 1
    },
    {
      key: 'packages_hero_subtitle',
      title: 'Packages Hero Subtitle',
      content: 'Curated Experiences for Every Type of Traveler',
      contentType: 'TEXT',
      page: 'packages',
      section: 'hero',
      order: 2
    },
    {
      key: 'packages_hero_description',
      title: 'Packages Hero Description',
      content: 'From romantic getaways to family adventures, discover our carefully crafted packages that combine luxury, culture, and unforgettable experiences along the eternal Nile.',
      contentType: 'TEXTAREA',
      page: 'packages',
      section: 'hero',
      order: 3
    },
    {
      key: 'packages_main_title',
      title: 'Packages Main Title',
      content: 'Choose Your Perfect Journey',
      contentType: 'TEXT',
      page: 'packages',
      section: 'main',
      order: 1
    },
    {
      key: 'packages_filter_title',
      title: 'Filter Section Title',
      content: 'Find Your Ideal Package',
      contentType: 'TEXT',
      page: 'packages',
      section: 'filter',
      order: 1
    },

    // DAHABIYAS PAGE CONTENT
    {
      key: 'dahabiyas_hero_title',
      title: 'Dahabiyas Hero Title',
      content: 'Our Magnificent Fleet',
      contentType: 'TEXT',
      page: 'dahabiyas',
      section: 'hero',
      order: 1
    },
    {
      key: 'dahabiyas_hero_subtitle',
      title: 'Dahabiyas Hero Subtitle',
      content: 'Traditional Sailing Vessels with Modern Luxury',
      contentType: 'TEXT',
      page: 'dahabiyas',
      section: 'hero',
      order: 2
    },
    {
      key: 'dahabiyas_hero_description',
      title: 'Dahabiyas Hero Description',
      content: 'Experience the timeless elegance of traditional Egyptian sailing boats, meticulously restored and equipped with modern amenities for the ultimate Nile journey.',
      contentType: 'TEXTAREA',
      page: 'dahabiyas',
      section: 'hero',
      order: 3
    },
    {
      key: 'dahabiyas_main_title',
      title: 'Dahabiyas Main Title',
      content: 'Choose Your Vessel',
      contentType: 'TEXT',
      page: 'dahabiyas',
      section: 'main',
      order: 1
    },
    {
      key: 'dahabiyas_about_title',
      title: 'About Dahabiyas Title',
      content: 'What is a Dahabiya?',
      contentType: 'TEXT',
      page: 'dahabiyas',
      section: 'about',
      order: 1
    },
    {
      key: 'dahabiyas_about_content',
      title: 'About Dahabiyas Content',
      content: 'A dahabiya is a traditional Egyptian sailing boat that has been used on the Nile for centuries. These elegant vessels combine authentic design with modern comfort, offering an intimate and peaceful way to explore ancient Egypt.',
      contentType: 'TEXTAREA',
      page: 'dahabiyas',
      section: 'about',
      order: 2
    },

    // BLOG PAGE CONTENT
    {
      key: 'blog_hero_title',
      title: 'Blog Hero Title',
      content: 'Stories from the Nile',
      contentType: 'TEXT',
      page: 'blog',
      section: 'hero',
      order: 1
    },
    {
      key: 'blog_hero_subtitle',
      title: 'Blog Hero Subtitle',
      content: 'Discover Egypt Through Our Eyes',
      contentType: 'TEXT',
      page: 'blog',
      section: 'hero',
      order: 2
    },
    {
      key: 'blog_hero_description',
      title: 'Blog Hero Description',
      content: 'Explore ancient mysteries, travel tips, cultural insights, and inspiring stories from fellow travelers who have experienced the magic of Egypt.',
      contentType: 'TEXTAREA',
      page: 'blog',
      section: 'hero',
      order: 3
    },
    {
      key: 'blog_featured_title',
      title: 'Featured Posts Title',
      content: 'Featured Stories',
      contentType: 'TEXT',
      page: 'blog',
      section: 'featured',
      order: 1
    },
    {
      key: 'blog_recent_title',
      title: 'Recent Posts Title',
      content: 'Latest Articles',
      contentType: 'TEXT',
      page: 'blog',
      section: 'recent',
      order: 1
    },
    {
      key: 'blog_categories_title',
      title: 'Categories Title',
      content: 'Explore by Category',
      contentType: 'TEXT',
      page: 'blog',
      section: 'categories',
      order: 1
    }
  ];

  let created = 0;
  let updated = 0;

  for (const content of missingPagesContent) {
    try {
      const result = await prisma.websiteContent.upsert({
        where: { key: content.key },
        update: {
          title: content.title,
          content: content.content,
          contentType: content.contentType,
          page: content.page,
          section: content.section,
          order: content.order,
          isActive: true
        },
        create: {
          key: content.key,
          title: content.title,
          content: content.content,
          contentType: content.contentType,
          page: content.page,
          section: content.section,
          order: content.order,
          isActive: true
        }
      });

      if (result.createdAt === result.updatedAt) {
        created++;
      } else {
        updated++;
      }

      console.log(`✅ ${content.page}: ${content.key}`);
    } catch (error) {
      console.error(`❌ Failed to create ${content.key}:`, error.message);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created} new content items`);
  console.log(`   Updated: ${updated} existing content items`);
  console.log(`   Total: ${created + updated} content items processed`);

  console.log('\n✅ Missing page content added successfully!');
}

async function main() {
  try {
    await addMissingPageContent();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
