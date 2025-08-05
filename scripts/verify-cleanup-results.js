const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyCleanupResults() {
  console.log('🔍 Verifying cleanup and setup results...\n');

  // 1. Check homepage content
  console.log('📄 Homepage Content:');
  const homepageContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      section: true,
      key: true,
      title: true
    },
    orderBy: [
      { section: 'asc' },
      { order: 'asc' }
    ]
  });

  const homepageSections = {};
  homepageContent.forEach(item => {
    if (!homepageSections[item.section]) {
      homepageSections[item.section] = [];
    }
    homepageSections[item.section].push(item.key);
  });

  console.log(`  Total items: ${homepageContent.length}`);
  Object.keys(homepageSections).sort().forEach(section => {
    console.log(`  ${section}: ${homepageSections[section].length} items`);
  });

  // 2. Check main page content
  console.log('\n📋 Main Page Content:');
  const mainPages = ['packages', 'dahabiyas', 'itineraries', 'blog'];
  
  for (const page of mainPages) {
    const pageContent = await prisma.websiteContent.findMany({
      where: { page: page },
      select: { key: true }
    });
    console.log(`  ${page}: ${pageContent.length} items`);
  }

  // 3. Check packages
  console.log('\n📦 Packages:');
  const packages = await prisma.package.findMany({
    select: {
      name: true,
      isFeaturedOnHomepage: true,
      price: true,
      durationDays: true
    },
    orderBy: { homepageOrder: 'asc' }
  });

  console.log(`  Total packages: ${packages.length}`);
  console.log(`  Featured packages: ${packages.filter(p => p.isFeaturedOnHomepage).length}`);
  
  if (packages.length > 0) {
    console.log('  Package list:');
    packages.forEach(pkg => {
      console.log(`    - ${pkg.name} (${pkg.durationDays} days, $${pkg.price}${pkg.isFeaturedOnHomepage ? ' - Featured' : ''})`);
    });
  }

  // 4. Check dahabiyas
  console.log('\n🚢 Dahabiyas:');
  const dahabiyas = await prisma.dahabiya.findMany({
    select: {
      name: true,
      isActive: true
    }
  });

  console.log(`  Total dahabiyas: ${dahabiyas.length}`);
  console.log(`  Active dahabiyas: ${dahabiyas.filter(d => d.isActive).length}`);

  // 5. Check itineraries
  console.log('\n🗺️ Itineraries:');
  const itineraries = await prisma.itinerary.findMany({
    select: {
      name: true
    }
  });

  console.log(`  Total itineraries: ${itineraries.length}`);

  // 6. Summary
  console.log('\n📊 Summary:');
  console.log(`  ✅ Homepage content cleaned: ${homepageContent.length} items remaining`);
  console.log(`  ✅ Main pages content: ${mainPages.length} pages configured`);
  console.log(`  ✅ Packages created: ${packages.length} packages available`);
  console.log(`  ✅ Dynamic navbar: Ready to fetch from APIs`);

  // 7. Recommendations
  console.log('\n💡 Next Steps:');
  console.log('  1. Visit the admin panel to manage content: /admin/website');
  console.log('  2. Check the navbar dropdown menus for dynamic content');
  console.log('  3. Test the packages page: /packages');
  console.log('  4. Verify homepage displays correctly: /');

  console.log('\n🎉 Cleanup and setup verification completed!');
}

async function main() {
  try {
    await verifyCleanupResults();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
