const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testContentAPI() {
  console.log('🔍 Testing content API and database...');
  
  // Test pages we're interested in
  const testPages = ['packages', 'dahabiyas', 'itineraries', 'blog'];
  
  for (const page of testPages) {
    console.log(`\n📄 Testing ${page} page:`);
    
    // Check database directly
    const dbContent = await prisma.websiteContent.findMany({
      where: { 
        page: page,
        isActive: true 
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });
    
    console.log(`  Database: Found ${dbContent.length} items`);
    
    if (dbContent.length > 0) {
      console.log('  Items:');
      dbContent.forEach(item => {
        console.log(`    - ${item.key} (${item.section}): "${item.title}"`);
      });
    }
    
    // Test API endpoint
    try {
      const response = await fetch(`http://localhost:3000/api/website-content?page=${page}`);
      if (response.ok) {
        const apiData = await response.json();
        console.log(`  API: Returned ${apiData.length} items`);
      } else {
        console.log(`  API: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`  API: Failed to connect - ${error.message}`);
    }
  }
  
  // Check all pages in database
  console.log('\n📊 All pages in database:');
  const allPages = await prisma.websiteContent.groupBy({
    by: ['page'],
    _count: {
      page: true
    },
    orderBy: {
      page: 'asc'
    }
  });
  
  allPages.forEach(pageGroup => {
    console.log(`  ${pageGroup.page}: ${pageGroup._count.page} items`);
  });
}

async function main() {
  try {
    await testContentAPI();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
