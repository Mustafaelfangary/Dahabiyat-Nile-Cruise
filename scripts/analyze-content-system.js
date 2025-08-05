const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function analyzeContent() {
  console.log('🔍 Analyzing Content Management System...\n');
  
  try {
    // Get all content grouped by page
    const contentByPage = await prisma.websiteContent.groupBy({
      by: ['page'],
      _count: { page: true }
    });
    
    console.log('📊 Content by Page:');
    for (const page of contentByPage) {
      console.log(`  ${page.page}: ${page._count.page} fields`);
    }
    
    // Get homepage content grouped by section
    console.log('\n📋 Homepage Content by Section:');
    const homepageContent = await prisma.websiteContent.findMany({
      where: { page: 'homepage' },
      select: { key: true, section: true, title: true },
      orderBy: { section: 'asc' }
    });
    
    const sectionGroups = {};
    homepageContent.forEach(content => {
      if (!sectionGroups[content.section]) {
        sectionGroups[content.section] = [];
      }
      sectionGroups[content.section].push(content.key);
    });
    
    for (const [section, keys] of Object.entries(sectionGroups)) {
      console.log(`  ${section}: ${keys.length} fields`);
      if (keys.length > 10) {
        console.log(`    First 10: ${keys.slice(0, 10).join(', ')}`);
        console.log(`    ... and ${keys.length - 10} more`);
      } else {
        console.log(`    Keys: ${keys.join(', ')}`);
      }
    }
    
    // Look for duplicates
    console.log('\n🔍 Looking for Duplicate Keys:');
    const duplicates = await prisma.websiteContent.groupBy({
      by: ['key'],
      having: {
        key: { _count: { gt: 1 } }
      },
      _count: { key: true }
    });
    
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate keys:`);
      for (const dup of duplicates) {
        console.log(`  ${dup.key}: ${dup._count.key} entries`);
      }
    } else {
      console.log('No duplicate keys found.');
    }
    
    // Look for unused/orphaned content
    console.log('\n🗑️ Potentially Unused Content (keys with generic names):');
    const potentiallyUnused = await prisma.websiteContent.findMany({
      where: {
        OR: [
          { key: { contains: 'test_' } },
          { key: { contains: 'temp_' } },
          { key: { contains: 'old_' } },
          { key: { contains: 'unused_' } },
          { key: { contains: 'backup_' } },
          { key: { contains: 'duplicate_' } }
        ]
      },
      select: { key: true, page: true, section: true }
    });
    
    if (potentiallyUnused.length > 0) {
      console.log(`Found ${potentiallyUnused.length} potentially unused entries:`);
      potentiallyUnused.forEach(content => {
        console.log(`  ${content.key} (${content.page}/${content.section})`);
      });
    } else {
      console.log('No obviously unused content found.');
    }
    
    // Show all homepage keys for manual review
    console.log('\n📝 All Homepage Keys (for manual review):');
    const allHomepageKeys = homepageContent.map(c => c.key).sort();
    allHomepageKeys.forEach((key, index) => {
      if (index % 5 === 0) console.log('');
      process.stdout.write(`${key.padEnd(30)} `);
    });
    console.log('\n');
    
  } catch (error) {
    console.error('Error analyzing content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeContent();
