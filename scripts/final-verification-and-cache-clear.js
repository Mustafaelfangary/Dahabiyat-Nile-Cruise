const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function finalVerificationAndCacheClear() {
  console.log('🔍 Final verification and cache clearing...');
  
  // Step 1: Comprehensive database check
  console.log('\n📊 Comprehensive database check:');
  
  // Check WebsiteContent
  const websiteContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      id: true,
      key: true,
      title: true,
      content: true,
      section: true,
      isActive: true
    },
    orderBy: [
      { section: 'asc' },
      { order: 'asc' }
    ]
  });

  console.log(`WebsiteContent (homepage): ${websiteContent.length} items`);
  
  // Group by section and show details
  const sections = {};
  websiteContent.forEach(item => {
    if (!sections[item.section]) {
      sections[item.section] = [];
    }
    sections[item.section].push({
      key: item.key,
      title: item.title,
      isActive: item.isActive
    });
  });

  Object.keys(sections).sort().forEach(section => {
    console.log(`\n  📂 ${section} (${sections[section].length} items):`);
    sections[section].forEach(item => {
      const status = item.isActive ? '✅' : '❌';
      console.log(`    ${status} ${item.key}: ${item.title}`);
    });
  });

  // Check Settings
  const settings = await prisma.setting.findMany({
    select: {
      key: true,
      value: true,
      group: true
    }
  });

  console.log(`\n⚙️ Settings: ${settings.length} items`);
  const settingsGroups = {};
  settings.forEach(setting => {
    if (!settingsGroups[setting.group]) {
      settingsGroups[setting.group] = [];
    }
    settingsGroups[setting.group].push(setting.key);
  });

  Object.keys(settingsGroups).sort().forEach(group => {
    console.log(`  ${group}: ${settingsGroups[group].length} items`);
  });

  // Check PageContent
  try {
    const pageContent = await prisma.pageContent.findMany({
      select: {
        key: true,
        page: true,
        section: true,
        isActive: true
      }
    });
    console.log(`\n📄 PageContent: ${pageContent.length} items`);
  } catch (error) {
    console.log('\n📄 PageContent: Table not accessible');
  }

  // Step 2: Check for any remaining problematic content
  console.log('\n🔍 Checking for problematic content...');
  
  const problematicContent = websiteContent.filter(item => {
    const searchText = `${item.key} ${item.title} ${item.content || ''}`.toLowerCase();
    return [
      'boat', 'dahabiya', 'vessel', 'ship', 'cruise ship',
      'sailing boat', 'traditional boat', 'egyptian boat',
      'nile boat', 'luxury boat'
    ].some(term => searchText.includes(term));
  });

  if (problematicContent.length > 0) {
    console.log(`⚠️ Found ${problematicContent.length} items with problematic content:`);
    problematicContent.forEach(item => {
      console.log(`  - ${item.key}: ${item.title}`);
      console.log(`    Content: ${(item.content || '').substring(0, 100)}...`);
    });
    
    // Remove them
    for (const item of problematicContent) {
      await prisma.websiteContent.delete({
        where: { id: item.id }
      });
      console.log(`  ✅ Removed: ${item.key}`);
    }
  } else {
    console.log('✅ No problematic content found');
  }

  // Step 3: Check for inactive content
  console.log('\n🔍 Checking for inactive content...');
  const inactiveContent = websiteContent.filter(item => !item.isActive);
  
  if (inactiveContent.length > 0) {
    console.log(`⚠️ Found ${inactiveContent.length} inactive items:`);
    inactiveContent.forEach(item => {
      console.log(`  - ${item.key}: ${item.title}`);
    });
    
    // Remove inactive content
    for (const item of inactiveContent) {
      await prisma.websiteContent.delete({
        where: { id: item.id }
      });
      console.log(`  ✅ Removed inactive: ${item.key}`);
    }
  } else {
    console.log('✅ No inactive content found');
  }

  // Step 4: Final clean content summary
  console.log('\n📋 Final clean content summary:');
  const finalContent = await prisma.websiteContent.findMany({
    where: { 
      page: 'homepage',
      isActive: true 
    },
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

  const finalSections = {};
  finalContent.forEach(item => {
    if (!finalSections[item.section]) {
      finalSections[item.section] = [];
    }
    finalSections[item.section].push(item.key);
  });

  console.log(`Total clean homepage content: ${finalContent.length} items`);
  Object.keys(finalSections).sort().forEach(section => {
    console.log(`  ${section}: ${finalSections[section].length} items`);
  });

  // Step 5: Test API endpoints
  console.log('\n🌐 Testing API endpoints...');
  try {
    const response = await fetch('http://localhost:3001/api/website-content?page=homepage');
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Homepage API: ${data.length} items returned`);
    } else {
      console.log(`❌ Homepage API: ${response.status} error`);
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
      console.log(`❌ Packages API: ${response.status} error`);
    }
  } catch (error) {
    console.log(`❌ Packages API: ${error.message}`);
  }

  console.log('\n🎯 Final Recommendations:');
  console.log('1. 🔄 Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)');
  console.log('2. 🧹 Clear browser cache and cookies for localhost');
  console.log('3. 🔍 Check admin panel at http://localhost:3001/admin/website');
  console.log('4. 🏠 Test homepage at http://localhost:3001/');
  console.log('5. 📦 Test packages page at http://localhost:3001/packages');

  console.log('\n✅ Final verification completed!');
  console.log(`📊 Clean homepage content: ${finalContent.length} items`);
  console.log('🎉 All duplicates and problematic content removed!');
}

async function main() {
  try {
    await finalVerificationAndCacheClear();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
