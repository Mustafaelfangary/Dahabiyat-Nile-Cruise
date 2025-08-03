const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addGlobalMediaContent() {
  console.log('🌐 Adding global media content...');

  try {
    const globalMediaContent = [
      {
        key: 'site_logo',
        title: 'Site Logo',
        content: '/images/logo.png',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'branding',
        order: 1
      },
      {
        key: 'site_logo_dark',
        title: 'Site Logo (Dark)',
        content: '/images/logo-dark.png',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'branding',
        order: 2
      },
      {
        key: 'site_favicon',
        title: 'Site Favicon',
        content: '/favicon.ico',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'branding',
        order: 3
      },
      {
        key: 'default_hero_background',
        title: 'Default Hero Background',
        content: '/images/default-hero.jpg',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'backgrounds',
        order: 4
      },
      {
        key: 'default_package_image',
        title: 'Default Package Image',
        content: '/images/default-package.jpg',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'defaults',
        order: 5
      },
      {
        key: 'default_dahabiya_image',
        title: 'Default Dahabiya Image',
        content: '/images/default-dahabiya.jpg',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'defaults',
        order: 6
      },
      {
        key: 'loading_animation',
        title: 'Loading Animation',
        content: '/images/loading.gif',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'ui',
        order: 7
      },
      {
        key: 'error_image',
        title: 'Error Page Image',
        content: '/images/error.jpg',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'ui',
        order: 8
      },
      {
        key: 'social_share_image',
        title: 'Social Media Share Image',
        content: '/images/social-share.jpg',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'social',
        order: 9
      },
      {
        key: 'og_image',
        title: 'Open Graph Image',
        content: '/images/og-image.jpg',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'social',
        order: 10
      }
    ];

    console.log(`📝 Creating ${globalMediaContent.length} global media content entries...`);

    let created = 0;
    let updated = 0;

    for (const content of globalMediaContent) {
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

        console.log(`✅ global_media: ${content.key}`);
      } catch (error) {
        console.error(`❌ Failed to create ${content.key}:`, error.message);
      }
    }

    console.log(`\n🎉 Global media content completed!`);
    console.log(`📊 Summary:`);
    console.log(`  - Created: ${created} new entries`);
    console.log(`  - Updated: ${updated} existing entries`);

    // Check final count
    const count = await prisma.websiteContent.count({
      where: { page: 'global_media', isActive: true }
    });
    console.log(`  - global_media: ${count} content blocks`);

  } catch (error) {
    console.error('❌ Error adding global media content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addGlobalMediaContent();
