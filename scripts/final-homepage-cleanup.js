const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function finalHomepageCleanup() {
  console.log('🧹 Final homepage cleanup - removing outdated sections...');
  
  // Step 1: Check current content
  const currentContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      id: true,
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

  console.log(`📋 Current homepage content: ${currentContent.length} items`);

  // Step 2: Identify sections to remove or update
  const sectionsToRemove = ['boats', 'tours']; // These are old sections
  const sectionsToKeep = ['hero', 'about', 'featured', 'testimonials', 'contact', 'cta', 'footer', 'why', 'how'];

  // Step 3: Remove old sections
  let removedCount = 0;
  
  for (const section of sectionsToRemove) {
    const deleteResult = await prisma.websiteContent.deleteMany({
      where: {
        page: 'homepage',
        section: section
      }
    });
    
    if (deleteResult.count > 0) {
      console.log(`✅ Removed section "${section}": ${deleteResult.count} items`);
      removedCount += deleteResult.count;
    }
  }

  // Step 4: Remove any content with old patterns in the content or title
  const oldPatterns = [
    'boat', 'dahabiya', 'vessel', 'ship',
    'tour', 'trip', 'journey',
    'cruise ship', 'large vessel'
  ];

  for (const pattern of oldPatterns) {
    const deleteResult = await prisma.websiteContent.deleteMany({
      where: {
        page: 'homepage',
        OR: [
          { content: { contains: pattern, mode: 'insensitive' } },
          { title: { contains: pattern, mode: 'insensitive' } },
          { key: { contains: pattern, mode: 'insensitive' } }
        ]
      }
    });
    
    if (deleteResult.count > 0) {
      console.log(`✅ Removed items containing "${pattern}": ${deleteResult.count} items`);
      removedCount += deleteResult.count;
    }
  }

  // Step 5: Update remaining content to be package-focused
  const updates = [
    {
      section: 'featured',
      updates: [
        {
          key: 'featured_section_title',
          title: 'Featured Section Title',
          content: 'Our Premium Packages'
        },
        {
          key: 'featured_section_subtitle', 
          title: 'Featured Section Subtitle',
          content: 'Discover our most popular Nile cruise experiences'
        }
      ]
    },
    {
      section: 'about',
      updates: [
        {
          key: 'about_section_title',
          title: 'About Section Title',
          content: 'Experience Ancient Egypt'
        },
        {
          key: 'about_section_content',
          title: 'About Section Content',
          content: 'Journey through time on our luxury Nile cruises. We offer carefully curated packages that combine comfort, adventure, and authentic cultural experiences along the eternal river.'
        }
      ]
    },
    {
      section: 'why',
      updates: [
        {
          key: 'why_choose_title',
          title: 'Why Choose Us Title',
          content: 'Why Choose Our Nile Cruises?'
        }
      ]
    }
  ];

  let updatedCount = 0;
  for (const sectionUpdate of updates) {
    for (const update of sectionUpdate.updates) {
      try {
        const result = await prisma.websiteContent.upsert({
          where: { key: update.key },
          update: {
            title: update.title,
            content: update.content,
            page: 'homepage',
            section: sectionUpdate.section,
            isActive: true
          },
          create: {
            key: update.key,
            title: update.title,
            content: update.content,
            page: 'homepage',
            section: sectionUpdate.section,
            contentType: 'TEXT',
            order: 0,
            isActive: true
          }
        });
        
        console.log(`✅ Updated: ${update.key}`);
        updatedCount++;
      } catch (error) {
        console.log(`⚠️ Could not update ${update.key}: ${error.message}`);
      }
    }
  }

  // Step 6: Final check
  const finalContent = await prisma.websiteContent.findMany({
    where: { page: 'homepage' },
    select: {
      section: true
    }
  });

  const finalSections = {};
  finalContent.forEach(item => {
    if (!finalSections[item.section]) {
      finalSections[item.section] = 0;
    }
    finalSections[item.section]++;
  });

  console.log(`\n📊 Final Summary:`);
  console.log(`   Removed: ${removedCount} old items`);
  console.log(`   Updated: ${updatedCount} items`);
  console.log(`   Final content: ${finalContent.length} items`);
  
  console.log(`\n📋 Final sections:`);
  Object.keys(finalSections).sort().forEach(section => {
    console.log(`   ${section}: ${finalSections[section]} items`);
  });

  console.log('\n🎉 Final homepage cleanup completed!');
}

async function main() {
  try {
    await finalHomepageCleanup();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
