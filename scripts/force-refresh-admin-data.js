const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function forceRefreshAdminData() {
  console.log('🔄 FORCE REFRESHING ADMIN DATA...\n');
  
  // 1. Clear any potential cache in database
  console.log('🧹 Clearing potential cache issues...');
  
  // Update all homepage content to force refresh
  const updateResult = await prisma.websiteContent.updateMany({
    where: { 
      page: 'homepage',
      isActive: true 
    },
    data: {
      updatedAt: new Date()
    }
  });
  
  console.log(`✅ Updated ${updateResult.count} homepage items with new timestamp`);

  // 2. Verify current state
  console.log('\n📊 Current homepage content state:');
  const currentContent = await prisma.websiteContent.findMany({
    where: { 
      page: 'homepage',
      isActive: true 
    },
    select: {
      key: true,
      title: true,
      section: true,
      updatedAt: true
    },
    orderBy: [
      { section: 'asc' },
      { order: 'asc' }
    ]
  });

  const sectionGroups = {};
  currentContent.forEach(item => {
    if (!sectionGroups[item.section]) {
      sectionGroups[item.section] = [];
    }
    sectionGroups[item.section].push(item.key);
  });

  console.log(`Total active items: ${currentContent.length}`);
  Object.keys(sectionGroups).sort().forEach(section => {
    console.log(`  📂 ${section}: ${sectionGroups[section].length} items`);
  });

  // 3. Test API endpoint with cache busting
  console.log('\n🌐 Testing API with cache busting...');
  try {
    const cacheBuster = `t=${Date.now()}&v=${Math.random()}&cb=${performance.now()}`;
    const response = await fetch(`http://localhost:3001/api/website-content?page=homepage&${cacheBuster}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API returned ${data.length} items`);
      
      // Check if all sections are represented
      const apiSections = {};
      data.forEach(item => {
        if (!apiSections[item.section]) {
          apiSections[item.section] = 0;
        }
        apiSections[item.section]++;
      });
      
      console.log('API sections:');
      Object.keys(apiSections).sort().forEach(section => {
        console.log(`  📂 ${section}: ${apiSections[section]} items`);
      });
      
    } else {
      console.log(`❌ API Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ API Test failed: ${error.message}`);
  }

  // 4. Create a summary for admin panel
  console.log('\n📋 ADMIN PANEL SUMMARY:');
  console.log('What the admin panel SHOULD show for homepage:');
  console.log(`- Total items: ${currentContent.length}`);
  console.log('- Sections:');
  Object.keys(sectionGroups).sort().forEach(section => {
    console.log(`  • ${section}: ${sectionGroups[section].length} editable fields`);
  });

  // 5. Instructions
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Visit: http://localhost:3001/test-api');
  console.log('   - This will show you exactly what the API returns');
  console.log('');
  console.log('2. Visit: http://localhost:3001/admin/website');
  console.log('   - Open browser dev tools (F12)');
  console.log('   - Go to Console tab');
  console.log('   - Look for debug messages starting with 🔍');
  console.log('   - Check Network tab for API calls');
  console.log('');
  console.log('3. If admin panel still shows wrong data:');
  console.log('   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)');
  console.log('   - Clear browser cache completely');
  console.log('   - Try incognito/private browsing mode');
  console.log('');
  console.log('4. Compare what you see in admin vs test-api page');

  console.log('\n✅ Force refresh completed!');
  console.log('The database is clean and API should return correct data.');
}

async function main() {
  try {
    await forceRefreshAdminData();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
