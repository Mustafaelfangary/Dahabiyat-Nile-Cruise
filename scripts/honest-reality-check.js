const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function honestRealityCheck() {
  console.log('🔍 HONEST REALITY CHECK - What is ACTUALLY in the database right now...\n');
  
  // 1. Raw homepage content check
  console.log('📋 RAW HOMEPAGE CONTENT:');
  const homepageContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      id: true,
      key: true,
      title: true,
      content: true,
      section: true,
      isActive: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`Total homepage items: ${homepageContent.length}`);
  
  if (homepageContent.length === 0) {
    console.log('❌ NO HOMEPAGE CONTENT FOUND!');
    return;
  }

  // Show ALL content with details
  console.log('\n📝 ALL HOMEPAGE CONTENT (showing everything):');
  homepageContent.forEach((item, index) => {
    const status = item.isActive ? '✅' : '❌';
    const contentPreview = (item.content || '').substring(0, 50);
    console.log(`${index + 1}. ${status} [${item.section}] ${item.key}`);
    console.log(`   Title: ${item.title}`);
    console.log(`   Content: ${contentPreview}${contentPreview.length >= 50 ? '...' : ''}`);
    console.log(`   Created: ${item.createdAt}`);
    console.log('');
  });

  // 2. Check for duplicates
  console.log('🔍 CHECKING FOR DUPLICATES:');
  const keyGroups = {};
  homepageContent.forEach(item => {
    if (!keyGroups[item.key]) {
      keyGroups[item.key] = [];
    }
    keyGroups[item.key].push(item);
  });

  const duplicates = Object.keys(keyGroups).filter(key => keyGroups[key].length > 1);
  if (duplicates.length > 0) {
    console.log(`❌ FOUND ${duplicates.length} DUPLICATE KEYS:`);
    duplicates.forEach(key => {
      console.log(`  - ${key}: ${keyGroups[key].length} copies`);
      keyGroups[key].forEach((item, index) => {
        console.log(`    ${index + 1}. ID: ${item.id}, Created: ${item.createdAt}`);
      });
    });
  } else {
    console.log('✅ No duplicates found');
  }

  // 3. Check for problematic content
  console.log('\n🔍 CHECKING FOR PROBLEMATIC CONTENT:');
  const problematicItems = homepageContent.filter(item => {
    const searchText = `${item.key} ${item.title} ${item.content || ''}`.toLowerCase();
    return [
      'boat', 'dahabiya', 'vessel', 'ship', 'cruise ship',
      'sailing', 'traditional boat', 'egyptian boat', 'nile boat'
    ].some(term => searchText.includes(term));
  });

  if (problematicItems.length > 0) {
    console.log(`❌ FOUND ${problematicItems.length} PROBLEMATIC ITEMS:`);
    problematicItems.forEach(item => {
      console.log(`  - ${item.key}: ${item.title}`);
      console.log(`    Content: ${(item.content || '').substring(0, 100)}`);
    });
  } else {
    console.log('✅ No problematic content found');
  }

  // 4. Check main pages content
  console.log('\n📋 MAIN PAGES CONTENT:');
  const mainPages = ['packages', 'dahabiyas', 'itineraries', 'blog'];
  
  for (const page of mainPages) {
    const pageContent = await prisma.websiteContent.findMany({
      where: { page: page },
      select: { key: true, title: true, isActive: true }
    });
    
    const activeCount = pageContent.filter(item => item.isActive).length;
    console.log(`  ${page}: ${pageContent.length} total (${activeCount} active)`);
    
    if (pageContent.length === 0) {
      console.log(`    ❌ NO CONTENT FOR ${page.toUpperCase()} PAGE!`);
    }
  }

  // 5. Check packages
  console.log('\n📦 PACKAGES CHECK:');
  const packages = await prisma.package.findMany({
    select: { id: true, name: true, isFeaturedOnHomepage: true }
  });
  
  console.log(`Total packages: ${packages.length}`);
  if (packages.length === 0) {
    console.log('❌ NO PACKAGES FOUND!');
  } else {
    console.log('Package list:');
    packages.forEach(pkg => {
      console.log(`  - ${pkg.name} ${pkg.isFeaturedOnHomepage ? '(Featured)' : ''}`);
    });
  }

  // 6. Test API endpoints
  console.log('\n🌐 API ENDPOINTS TEST:');
  try {
    const response = await fetch('http://localhost:3001/api/website-content?page=homepage');
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Homepage API: ${data.length} items returned`);
    } else {
      console.log(`❌ Homepage API: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Homepage API: ${error.message}`);
  }

  try {
    const response = await fetch('http://localhost:3001/api/packages?limit=5');
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Packages API: ${data.packages?.length || 0} packages returned`);
    } else {
      console.log(`❌ Packages API: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Packages API: ${error.message}`);
  }

  // 7. HONEST SUMMARY
  console.log('\n📊 HONEST SUMMARY:');
  console.log(`Homepage content items: ${homepageContent.length}`);
  console.log(`Active homepage items: ${homepageContent.filter(item => item.isActive).length}`);
  console.log(`Duplicate keys: ${duplicates.length}`);
  console.log(`Problematic items: ${problematicItems.length}`);
  console.log(`Packages: ${packages.length}`);

  if (duplicates.length > 0 || problematicItems.length > 0) {
    console.log('\n❌ ISSUES STILL EXIST!');
    console.log('The cleanup was NOT completely successful.');
  } else {
    console.log('\n✅ CLEANUP APPEARS SUCCESSFUL');
    console.log('No duplicates or problematic content found.');
  }

  console.log('\n🎯 WHAT YOU SHOULD DO:');
  console.log('1. Check the admin panel at: http://localhost:3001/admin/website');
  console.log('2. Look at the homepage at: http://localhost:3001/');
  console.log('3. Test the navbar dropdowns');
  console.log('4. If you still see issues, let me know EXACTLY what you see');
}

async function main() {
  try {
    await honestRealityCheck();
  } catch (error) {
    console.error('❌ Error during reality check:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
