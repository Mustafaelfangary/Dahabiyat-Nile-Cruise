const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupHomepageAndNavbar() {
  console.log('🧹 Starting homepage and navbar cleanup...');
  
  // Step 1: Check current homepage content
  console.log('\n📋 Current homepage content:');
  const currentHomepageContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      key: true,
      title: true,
      section: true,
      order: true,
      createdAt: true
    },
    orderBy: [
      { section: 'asc' },
      { order: 'asc' }
    ]
  });

  console.log(`Found ${currentHomepageContent.length} homepage content items`);
  
  // Group by section
  const sectionGroups = {};
  currentHomepageContent.forEach(item => {
    if (!sectionGroups[item.section]) {
      sectionGroups[item.section] = [];
    }
    sectionGroups[item.section].push(item.key);
  });

  Object.keys(sectionGroups).forEach(section => {
    console.log(`  ${section}: ${sectionGroups[section].length} items`);
  });

  // Step 2: Identify old/duplicate content to remove
  const oldContentKeys = [
    // Old boat-specific content
    'boat_1_title', 'boat_1_description', 'boat_1_image',
    'boat_2_title', 'boat_2_description', 'boat_2_image',
    'boat_3_title', 'boat_3_description', 'boat_3_image',
    'boat_4_title', 'boat_4_description', 'boat_4_image',
    'our_boats_section_title',
    
    // Old dahabiya-specific content
    'dahabiyat_section_title', 'dahabiyat_section_subtitle', 'dahabiyat_section_content',
    'refreshing_data_text',
    
    // Duplicate site branding
    'site_name_duplicate', 'site_tagline_duplicate', 'site_description_duplicate',
    
    // Old testimonial content
    'testimonial_1_text', 'testimonial_1_author', 'testimonial_1_location',
    'testimonial_2_text', 'testimonial_2_author', 'testimonial_2_location',
    'testimonial_3_text', 'testimonial_3_author', 'testimonial_3_location',
    
    // Old gallery content
    'gallery_image_1', 'gallery_image_2', 'gallery_image_3',
    'gallery_image_4', 'gallery_image_5', 'gallery_image_6',
    
    // Old contact form content
    'contact_form_title', 'contact_form_subtitle',
    'contact_form_name_placeholder', 'contact_form_email_placeholder',
    'contact_form_message_placeholder', 'contact_form_submit_text',
    
    // Old CTA content
    'cta_background_image', 'cta_overlay_text',
    
    // Any content with "About section" in the key (old format)
    'About section title', 'About section content',
    
    // Old feature content
    'feature_1_icon', 'feature_1_title', 'feature_1_description',
    'feature_2_icon', 'feature_2_title', 'feature_2_description',
    'feature_3_icon', 'feature_3_title', 'feature_3_description',
    
    // Old pricing content
    'pricing_section_title', 'pricing_section_subtitle',
    'price_1_title', 'price_1_amount', 'price_1_description',
    'price_2_title', 'price_2_amount', 'price_2_description',
    'price_3_title', 'price_3_amount', 'price_3_description'
  ];

  // Step 3: Remove old content
  console.log('\n🗑️ Removing old/duplicate content...');
  let removedCount = 0;

  for (const key of oldContentKeys) {
    try {
      const deleteResult = await prisma.websiteContent.deleteMany({
        where: {
          page: 'homepage',
          key: key
        }
      });
      if (deleteResult.count > 0) {
        console.log(`  ✅ Removed: ${key} (${deleteResult.count} items)`);
        removedCount += deleteResult.count;
      }
    } catch (error) {
      console.log(`  ⚠️ Could not remove ${key}: ${error.message}`);
    }
  }

  // Also remove any content with old patterns
  const oldPatternDeletes = await prisma.websiteContent.deleteMany({
    where: {
      page: 'homepage',
      OR: [
        { key: { contains: 'About section' } },
        { key: { contains: 'boat_' } },
        { key: { contains: 'testimonial_' } },
        { key: { contains: 'gallery_image_' } },
        { key: { contains: 'contact_form_' } },
        { key: { contains: 'feature_' } },
        { key: { contains: 'price_' } }
      ]
    }
  });

  removedCount += oldPatternDeletes.count;
  console.log(`  ✅ Removed ${oldPatternDeletes.count} items with old patterns`);

  // Step 4: Remove duplicate entries (keep the most recent)
  console.log('\n🔍 Removing duplicate entries...');
  const duplicates = await prisma.$queryRaw`
    SELECT key, COUNT(*) as count 
    FROM website_content 
    WHERE page = 'homepage'
    GROUP BY key 
    HAVING COUNT(*) > 1
  `;

  let duplicatesRemoved = 0;
  for (const duplicate of duplicates) {
    // Keep the most recent, delete the rest
    const items = await prisma.websiteContent.findMany({
      where: {
        page: 'homepage',
        key: duplicate.key
      },
      orderBy: { createdAt: 'desc' }
    });

    // Delete all but the first (most recent)
    const itemsToDelete = items.slice(1);
    for (const item of itemsToDelete) {
      await prisma.websiteContent.delete({
        where: { id: item.id }
      });
      duplicatesRemoved++;
    }
    
    if (itemsToDelete.length > 0) {
      console.log(`  ✅ Removed ${itemsToDelete.length} duplicates of: ${duplicate.key}`);
    }
  }

  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   Old content removed: ${removedCount} items`);
  console.log(`   Duplicates removed: ${duplicatesRemoved} items`);
  console.log(`   Total removed: ${removedCount + duplicatesRemoved} items`);

  // Step 5: Check final homepage content
  const finalHomepageContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      key: true,
      title: true,
      section: true
    },
    orderBy: [
      { section: 'asc' },
      { order: 'asc' }
    ]
  });

  console.log(`\n✅ Final homepage content: ${finalHomepageContent.length} items`);
  
  const finalSectionGroups = {};
  finalHomepageContent.forEach(item => {
    if (!finalSectionGroups[item.section]) {
      finalSectionGroups[item.section] = [];
    }
    finalSectionGroups[item.section].push(item.key);
  });

  Object.keys(finalSectionGroups).forEach(section => {
    console.log(`  ${section}: ${finalSectionGroups[section].length} items`);
  });

  console.log('\n🎉 Homepage cleanup completed successfully!');
}

async function main() {
  try {
    await cleanupHomepageAndNavbar();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
