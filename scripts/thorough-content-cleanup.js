const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function thoroughContentCleanup() {
  console.log('🧹 Starting thorough content cleanup...');
  
  // Step 1: Check all homepage content with details
  console.log('\n📋 Current homepage content analysis:');
  const allHomepageContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      id: true,
      key: true,
      title: true,
      content: true,
      section: true,
      order: true,
      createdAt: true
    },
    orderBy: [
      { section: 'asc' },
      { key: 'asc' },
      { createdAt: 'asc' }
    ]
  });

  console.log(`Total homepage items: ${allHomepageContent.length}`);

  // Step 2: Find duplicates by key
  console.log('\n🔍 Finding duplicates...');
  const keyGroups = {};
  allHomepageContent.forEach(item => {
    if (!keyGroups[item.key]) {
      keyGroups[item.key] = [];
    }
    keyGroups[item.key].push(item);
  });

  const duplicateKeys = Object.keys(keyGroups).filter(key => keyGroups[key].length > 1);
  console.log(`Found ${duplicateKeys.length} duplicate keys:`);
  
  let duplicatesRemoved = 0;
  for (const key of duplicateKeys) {
    const items = keyGroups[key];
    console.log(`  ${key}: ${items.length} duplicates`);
    
    // Keep the most recent, delete the rest
    const sortedItems = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const itemsToDelete = sortedItems.slice(1);
    
    for (const item of itemsToDelete) {
      await prisma.websiteContent.delete({
        where: { id: item.id }
      });
      duplicatesRemoved++;
    }
  }

  // Step 3: Remove specific problematic content
  console.log('\n🗑️ Removing problematic content...');
  
  const problematicPatterns = [
    // Logo duplicates
    { pattern: 'logo', description: 'logo references' },
    { pattern: 'site_logo', description: 'site logo duplicates' },
    { pattern: 'navbar_logo', description: 'navbar logo duplicates' },
    
    // Footer duplicates
    { pattern: 'footer_', description: 'footer content' },
    
    // Old content patterns
    { pattern: 'boat_', description: 'boat references' },
    { pattern: 'dahabiya', description: 'dahabiya references' },
    { pattern: 'vessel', description: 'vessel references' },
    { pattern: 'ship', description: 'ship references' },
    { pattern: 'cruise', description: 'cruise references' },
    
    // Old sections
    { pattern: 'tour_', description: 'tour references' },
    { pattern: 'trip_', description: 'trip references' },
    
    // Testimonial duplicates
    { pattern: 'testimonial_', description: 'old testimonials' },
    
    // Gallery duplicates
    { pattern: 'gallery_', description: 'old gallery items' },
    
    // Contact form duplicates
    { pattern: 'contact_form_', description: 'old contact forms' },
    
    // Feature duplicates
    { pattern: 'feature_', description: 'old features' },
    
    // Pricing duplicates
    { pattern: 'price_', description: 'old pricing' },
    { pattern: 'pricing_', description: 'old pricing sections' }
  ];

  let patternRemoved = 0;
  for (const { pattern, description } of problematicPatterns) {
    const deleteResult = await prisma.websiteContent.deleteMany({
      where: {
        page: 'homepage',
        OR: [
          { key: { contains: pattern, mode: 'insensitive' } },
          { title: { contains: pattern, mode: 'insensitive' } },
          { content: { contains: pattern, mode: 'insensitive' } }
        ]
      }
    });
    
    if (deleteResult.count > 0) {
      console.log(`  ✅ Removed ${deleteResult.count} items with ${description}`);
      patternRemoved += deleteResult.count;
    }
  }

  // Step 4: Remove content from unwanted sections
  console.log('\n📂 Removing unwanted sections...');
  const unwantedSections = [
    'boats', 'tours', 'trips', 'vessels', 'ships', 'cruises',
    'old_testimonials', 'old_gallery', 'old_contact', 'old_features',
    'pricing', 'packages_old', 'dahabiyas_old'
  ];

  let sectionRemoved = 0;
  for (const section of unwantedSections) {
    const deleteResult = await prisma.websiteContent.deleteMany({
      where: {
        page: 'homepage',
        section: section
      }
    });
    
    if (deleteResult.count > 0) {
      console.log(`  ✅ Removed section "${section}": ${deleteResult.count} items`);
      sectionRemoved += deleteResult.count;
    }
  }

  // Step 5: Clean up any remaining problematic content by content analysis
  console.log('\n🔍 Content analysis cleanup...');
  const remainingContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      id: true,
      key: true,
      title: true,
      content: true,
      section: true
    }
  });

  let contentAnalysisRemoved = 0;
  for (const item of remainingContent) {
    const contentLower = (item.content || '').toLowerCase();
    const titleLower = (item.title || '').toLowerCase();
    const keyLower = item.key.toLowerCase();
    
    // Check for problematic content
    const hasProblematicContent = [
      'boat', 'dahabiya', 'vessel', 'ship', 'cruise ship',
      'tour package', 'trip package', 'sailing boat',
      'traditional boat', 'egyptian boat'
    ].some(term => 
      contentLower.includes(term) || 
      titleLower.includes(term) || 
      keyLower.includes(term)
    );
    
    if (hasProblematicContent) {
      await prisma.websiteContent.delete({
        where: { id: item.id }
      });
      console.log(`  ✅ Removed problematic content: ${item.key}`);
      contentAnalysisRemoved++;
    }
  }

  // Step 6: Final verification
  console.log('\n📊 Final verification...');
  const finalContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      key: true,
      section: true,
      title: true
    },
    orderBy: [
      { section: 'asc' },
      { order: 'asc' }
    ]
  });

  const finalSections = {};
  finalContent.forEach(item => {
    if (!finalSections[item.section]) {
      finalSections[item.section] = [];
    }
    finalSections[item.section].push(item.key);
  });

  console.log(`\n📋 Final homepage content: ${finalContent.length} items`);
  Object.keys(finalSections).sort().forEach(section => {
    console.log(`  ${section}: ${finalSections[section].length} items`);
    if (finalSections[section].length <= 5) {
      finalSections[section].forEach(key => {
        console.log(`    - ${key}`);
      });
    }
  });

  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   Duplicates removed: ${duplicatesRemoved}`);
  console.log(`   Pattern matches removed: ${patternRemoved}`);
  console.log(`   Unwanted sections removed: ${sectionRemoved}`);
  console.log(`   Content analysis removed: ${contentAnalysisRemoved}`);
  console.log(`   Total removed: ${duplicatesRemoved + patternRemoved + sectionRemoved + contentAnalysisRemoved}`);
  console.log(`   Final content count: ${finalContent.length}`);

  console.log('\n🎉 Thorough cleanup completed!');
}

async function main() {
  try {
    await thoroughContentCleanup();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
