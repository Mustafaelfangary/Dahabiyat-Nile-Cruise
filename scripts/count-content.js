const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function countContent() {
  try {
    const homepageCount = await prisma.websiteContent.count({
      where: { page: 'homepage' }
    });
    
    const totalCount = await prisma.websiteContent.count();
    
    console.log('📊 Database Content Count:');
    console.log(`  Homepage content blocks: ${homepageCount}`);
    console.log(`  Total content blocks: ${totalCount}`);
    
    // Show recent additions
    const recentContent = await prisma.websiteContent.findMany({
      where: { page: 'homepage' },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { key: true, title: true, updatedAt: true }
    });
    
    console.log('\n🕒 Most Recently Updated:');
    recentContent.forEach(item => {
      console.log(`  ${item.key} - ${item.title} (${item.updatedAt.toISOString().split('T')[0]})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countContent();
