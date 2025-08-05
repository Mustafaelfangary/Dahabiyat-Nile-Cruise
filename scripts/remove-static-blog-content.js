const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeStaticBlogContent() {
  console.log('🗑️ Removing old static blog content from homepage...\n');
  
  // Remove all static blog content from homepage
  const staticBlogKeys = [
    'home_blog_section_title',
    'home_blog_1_date',
    'home_blog_1_image',
    'home_blog_2_date', 
    'home_blog_2_image',
    'home_blog_3_date',
    'home_blog_3_image'
  ];

  let removedCount = 0;
  
  for (const key of staticBlogKeys) {
    try {
      const deleteResult = await prisma.websiteContent.deleteMany({
        where: {
          key: key,
          page: 'homepage'
        }
      });
      
      if (deleteResult.count > 0) {
        console.log(`✅ Removed: ${key} (${deleteResult.count} items)`);
        removedCount += deleteResult.count;
      }
    } catch (error) {
      console.log(`❌ Failed to remove ${key}: ${error.message}`);
    }
  }

  // Also remove any content from blog section on homepage
  const blogSectionResult = await prisma.websiteContent.deleteMany({
    where: {
      page: 'homepage',
      section: 'blog'
    }
  });

  if (blogSectionResult.count > 0) {
    console.log(`✅ Removed blog section: ${blogSectionResult.count} items`);
    removedCount += blogSectionResult.count;
  }

  console.log(`\n📊 Summary: Removed ${removedCount} static blog items`);
  
  // Verify removal
  const remainingBlogContent = await prisma.websiteContent.findMany({
    where: {
      page: 'homepage',
      OR: [
        { key: { contains: 'blog' } },
        { section: 'blog' }
      ]
    },
    select: { key: true, section: true }
  });

  if (remainingBlogContent.length > 0) {
    console.log(`⚠️ Still found ${remainingBlogContent.length} blog items:`);
    remainingBlogContent.forEach(item => {
      console.log(`  - ${item.key} (${item.section})`);
    });
  } else {
    console.log('✅ All static blog content removed from homepage');
  }

  await prisma.$disconnect();
}

removeStaticBlogContent().catch(console.error);
