const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanSettingsAndCache() {
  console.log('🧹 Cleaning settings table and cache issues...');
  
  // Step 1: Check settings table for old content
  console.log('\n📋 Checking settings table...');
  const allSettings = await prisma.setting.findMany({
    select: {
      id: true,
      key: true,
      value: true,
      group: true
    },
    orderBy: { key: 'asc' }
  });

  console.log(`Total settings: ${allSettings.length}`);

  // Group by group
  const settingsGroups = {};
  allSettings.forEach(setting => {
    if (!settingsGroups[setting.group]) {
      settingsGroups[setting.group] = [];
    }
    settingsGroups[setting.group].push(setting.key);
  });

  console.log('Settings by group:');
  Object.keys(settingsGroups).sort().forEach(group => {
    console.log(`  ${group}: ${settingsGroups[group].length} items`);
  });

  // Step 2: Remove old content-related settings
  console.log('\n🗑️ Removing old content from settings...');
  
  const oldContentPatterns = [
    'homepage_', 'home_', 'hero_', 'about_', 'featured_', 'testimonial_',
    'gallery_', 'contact_', 'cta_', 'footer_', 'why_', 'how_', 'blog_',
    'boat_', 'dahabiya', 'vessel', 'ship', 'cruise', 'tour_', 'trip_',
    'logo', 'navbar_', 'site_logo', 'branding_'
  ];

  let settingsRemoved = 0;
  for (const pattern of oldContentPatterns) {
    const deleteResult = await prisma.setting.deleteMany({
      where: {
        OR: [
          { key: { contains: pattern, mode: 'insensitive' } },
          { value: { contains: pattern, mode: 'insensitive' } }
        ]
      }
    });
    
    if (deleteResult.count > 0) {
      console.log(`  ✅ Removed ${deleteResult.count} settings with pattern: ${pattern}`);
      settingsRemoved += deleteResult.count;
    }
  }

  // Step 3: Remove settings from content-related groups
  console.log('\n📂 Removing content-related setting groups...');
  const contentGroups = [
    'homepage', 'home', 'website-content', 'content', 'page-content',
    'hero', 'about', 'featured', 'testimonials', 'gallery', 'contact',
    'cta', 'footer', 'why', 'how', 'blog'
  ];

  let groupSettingsRemoved = 0;
  for (const group of contentGroups) {
    const deleteResult = await prisma.setting.deleteMany({
      where: { group: group }
    });
    
    if (deleteResult.count > 0) {
      console.log(`  ✅ Removed ${deleteResult.count} settings from group: ${group}`);
      groupSettingsRemoved += deleteResult.count;
    }
  }

  // Step 4: Check PageContent table (if it exists and has old data)
  console.log('\n📄 Checking PageContent table...');
  try {
    const pageContent = await prisma.pageContent.findMany({
      select: {
        id: true,
        key: true,
        page: true,
        section: true
      }
    });

    console.log(`PageContent items: ${pageContent.length}`);
    
    if (pageContent.length > 0) {
      // Remove old page content that might conflict
      const oldPageContentResult = await prisma.pageContent.deleteMany({
        where: {
          OR: [
            { page: 'homepage' },
            { page: 'home' },
            { key: { contains: 'boat_' } },
            { key: { contains: 'dahabiya' } },
            { key: { contains: 'vessel' } },
            { key: { contains: 'ship' } },
            { key: { contains: 'cruise' } }
          ]
        }
      });
      
      if (oldPageContentResult.count > 0) {
        console.log(`  ✅ Removed ${oldPageContentResult.count} old PageContent items`);
      }
    }
  } catch (error) {
    console.log('  ℹ️ PageContent table not accessible or doesn\'t exist');
  }

  // Step 5: Final verification of remaining settings
  console.log('\n📊 Final settings verification...');
  const finalSettings = await prisma.setting.findMany({
    select: {
      key: true,
      group: true
    },
    orderBy: { group: 'asc' }
  });

  const finalSettingsGroups = {};
  finalSettings.forEach(setting => {
    if (!finalSettingsGroups[setting.group]) {
      finalSettingsGroups[setting.group] = [];
    }
    finalSettingsGroups[setting.group].push(setting.key);
  });

  console.log(`Final settings: ${finalSettings.length} items`);
  Object.keys(finalSettingsGroups).sort().forEach(group => {
    console.log(`  ${group}: ${finalSettingsGroups[group].length} items`);
  });

  // Step 6: Check for any remaining homepage content issues
  console.log('\n🔍 Final homepage content check...');
  const finalHomepageContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      key: true,
      title: true,
      section: true,
      content: true
    },
    orderBy: [
      { section: 'asc' },
      { order: 'asc' }
    ]
  });

  console.log(`Final homepage content: ${finalHomepageContent.length} items`);
  
  // Check for any suspicious content
  const suspiciousContent = finalHomepageContent.filter(item => {
    const text = `${item.key} ${item.title} ${item.content}`.toLowerCase();
    return text.includes('boat') || text.includes('dahabiya') || 
           text.includes('vessel') || text.includes('ship') ||
           text.includes('cruise ship') || text.includes('sailing');
  });

  if (suspiciousContent.length > 0) {
    console.log(`⚠️ Found ${suspiciousContent.length} items with suspicious content:`);
    suspiciousContent.forEach(item => {
      console.log(`  - ${item.key}: ${item.title}`);
    });
  } else {
    console.log('✅ No suspicious content found');
  }

  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   Settings removed by pattern: ${settingsRemoved}`);
  console.log(`   Settings removed by group: ${groupSettingsRemoved}`);
  console.log(`   Total settings removed: ${settingsRemoved + groupSettingsRemoved}`);
  console.log(`   Final settings count: ${finalSettings.length}`);
  console.log(`   Final homepage content: ${finalHomepageContent.length} items`);

  console.log('\n💡 Recommendations:');
  console.log('   1. Clear browser cache and refresh the page');
  console.log('   2. Restart the development server');
  console.log('   3. Check admin panel for clean content display');

  console.log('\n🎉 Settings and cache cleanup completed!');
}

async function main() {
  try {
    await cleanSettingsAndCache();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
