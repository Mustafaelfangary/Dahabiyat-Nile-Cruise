const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDeveloperSettings() {
  console.log('🔧 Seeding developer settings...');

  const developerSettings = [
    {
      key: 'footer_developer_contact_text',
      title: 'Contact Developer Button Text',
      content: 'Contact Developer',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 1
    },
    {
      key: 'footer_developer_branding_text',
      title: 'Developer Branding Text',
      content: 'crafted with love in the land of the Pharaohs by Just X',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 2
    },
    {
      key: 'footer_developer_logo',
      title: 'Developer Logo',
      content: '/images/logo-white.png',
      page: 'footer',
      section: 'developer',
      contentType: 'IMAGE',
      order: 3
    },
    {
      key: 'footer_developer_name',
      title: 'Developer Name',
      content: 'Just X Development',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 4
    },
    {
      key: 'footer_developer_company',
      title: 'Developer Company',
      content: 'Just X',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 5
    },
    {
      key: 'footer_developer_phone',
      title: 'Developer Phone',
      content: '+20 123 456 7890',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 6
    },
    {
      key: 'footer_developer_email',
      title: 'Developer Email',
      content: 'developer@justx.com',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 7
    },
    {
      key: 'footer_developer_website',
      title: 'Developer Website',
      content: 'https://justx.com',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 8
    },
    {
      key: 'footer_developer_contact_modal_title',
      title: 'Contact Modal Title',
      content: 'Contact Developer',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 9
    },
    {
      key: 'footer_developer_contact_url',
      title: 'Contact Email URL',
      content: 'mailto:developer@justx.com',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 10
    },
    {
      key: 'footer_developer_phone_url',
      title: 'Contact Phone URL',
      content: 'tel:+201234567890',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 11
    },
    {
      key: 'footer_developer_website_url',
      title: 'Contact Website URL',
      content: 'https://justx.com',
      page: 'footer',
      section: 'developer',
      contentType: 'TEXT',
      order: 12
    },
    // Add some missing global settings
    {
      key: 'site_name',
      title: 'Site Name',
      content: 'Cleopatra Dahabiyat',
      page: 'global_media',
      section: 'branding',
      contentType: 'TEXT',
      order: 1
    },
    {
      key: 'footer_loading_text',
      title: 'Footer Loading Text',
      content: '𓇳 Loading... 𓇳',
      page: 'footer',
      section: 'general',
      contentType: 'TEXT',
      order: 1
    },
    {
      key: 'loading_text',
      title: 'General Loading Text',
      content: 'Loading...',
      page: 'global_media',
      section: 'general',
      contentType: 'TEXT',
      order: 1
    }
  ];

  for (const setting of developerSettings) {
    try {
      await prisma.websiteContent.upsert({
        where: { key: setting.key },
        update: {
          title: setting.title,
          content: setting.content,
          page: setting.page,
          section: setting.section,
          contentType: setting.contentType,
          order: setting.order
        },
        create: {
          key: setting.key,
          title: setting.title,
          content: setting.content,
          page: setting.page,
          section: setting.section,
          contentType: setting.contentType,
          order: setting.order,
          isActive: true
        }
      });
      console.log(`✅ Created/updated: ${setting.key}`);
    } catch (error) {
      console.error(`❌ Failed to create ${setting.key}:`, error);
    }
  }

  console.log('🎉 Developer settings seeded successfully!');
}

async function main() {
  try {
    await seedDeveloperSettings();
  } catch (error) {
    console.error('Error seeding developer settings:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
