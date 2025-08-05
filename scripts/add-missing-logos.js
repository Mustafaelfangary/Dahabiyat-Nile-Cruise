const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMissingLogos() {
  try {
    console.log('🎨 Adding missing logo content...');

    const logoContent = [
      {
        key: 'navbar_logo',
        title: 'Navigation Bar Logo',
        content: '/images/logo.png',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'navigation',
        order: 1
      },
      {
        key: 'footer_logo',
        title: 'Footer Logo',
        content: '/images/logo.png',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'footer',
        order: 1
      },
      {
        key: 'site_logo',
        title: 'Site Logo',
        content: '/images/logo.png',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'branding',
        order: 1
      }
    ];

    let created = 0;
    let updated = 0;

    for (const content of logoContent) {
      try {
        const result = await prisma.websiteContent.upsert({
          where: { key: content.key },
          update: {
            title: content.title,
            content: content.content,
            contentType: content.contentType,
            page: content.page,
            section: content.section,
            order: content.order,
            isActive: true
          },
          create: {
            key: content.key,
            title: content.title,
            content: content.content,
            contentType: content.contentType,
            page: content.page,
            section: content.section,
            order: content.order,
            isActive: true
          }
        });

        if (result.createdAt === result.updatedAt) {
          created++;
        } else {
          updated++;
        }

        console.log(`✅ ${content.key}: ${content.content}`);
      } catch (error) {
        console.error(`❌ Failed to create ${content.key}:`, error.message);
      }
    }

    console.log(`\n🎉 Logo content update completed!`);
    console.log(`📊 Summary:`);
    console.log(`  - Created: ${created} new entries`);
    console.log(`  - Updated: ${updated} existing entries`);

    // Verify the content
    const globalMediaCount = await prisma.websiteContent.count({
      where: { page: 'global_media', isActive: true }
    });

    console.log(`\n📋 Final Count:`);
    console.log(`  - Global media: ${globalMediaCount} content blocks`);

    console.log(`\n🚀 Next Steps:`);
    console.log(`  1. Refresh your browser`);
    console.log(`  2. Check console - should see no more "navbar_logo not found" errors`);
    console.log(`  3. Go to Admin Panel → Logo & Media tab`);
    console.log(`  4. Upload your custom logos`);

  } catch (error) {
    console.error('❌ Error adding logo content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addMissingLogos();
