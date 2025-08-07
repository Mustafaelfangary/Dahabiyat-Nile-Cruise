// Script to add missing footer content to the CMS
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const footerContent = [
  {
    key: 'footer-title',
    value: 'Cleopatra Dahabiyat',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-description',
    value: 'Experience the magic of the Nile with our luxury dahabiya cruises. Authentic Egyptian hospitality meets modern comfort.',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer_quick_links_title',
    value: 'Quick Links',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-link-home',
    value: 'Home',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-link-dahabiyat',
    value: 'Dahabiyas',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-link-packages',
    value: 'Packages',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-link-about',
    value: 'About',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-link-contact',
    value: 'Contact',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-address',
    value: 'Luxor, Egypt',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-phone',
    value: '+20 123 456 789',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-email',
    value: 'info@cleopatradahabiyat.com',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer_follow_us_title',
    value: 'Follow Us',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-facebook',
    value: 'https://facebook.com/cleopatradahabiyat',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-twitter',
    value: 'https://twitter.com/cleopatradahabiyat',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-instagram',
    value: 'https://instagram.com/cleopatradahabiyat',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer_newsletter_title',
    value: 'Newsletter',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-newsletter-text',
    value: 'Subscribe to get updates on our latest offers and journeys.',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer_subscribe_button_text',
    value: 'Subscribe',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer_developer_logo',
    value: '/images/logo-white.png',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer-company-name',
    value: 'Cleopatra Dahabiyat',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer_developer_contact_text',
    value: 'Contact Developer',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'footer_loading_text',
    value: 'Loading Royal Footer...',
    section: 'footer',
    page: 'footer'
  },
  {
    key: 'site_name',
    value: 'Cleopatra Dahabiyat',
    section: 'global',
    page: 'global'
  }
];

async function addFooterContent() {
  try {
    console.log('🏺 Adding footer content to CMS...\n');

    for (const content of footerContent) {
      try {
        // Check if content already exists
        const existing = await prisma.websiteContent.findFirst({
          where: {
            key: content.key,
            page: content.page
          }
        });

        if (existing) {
          console.log(`⚠️  Content already exists: ${content.key}`);
          continue;
        }

        // Create new content
        await prisma.websiteContent.create({
          data: {
            key: content.key,
            content: content.value, // Use 'content' instead of 'value'
            section: content.section,
            page: content.page,
            contentType: 'TEXT', // Use 'contentType' instead of 'type'
            isActive: true
          }
        });

        console.log(`✅ Added: ${content.key} = "${content.value}"`);
      } catch (error) {
        console.error(`❌ Error adding ${content.key}:`, error.message);
      }
    }

    console.log('\n🎉 Footer content added successfully!');
    console.log('The footer warnings should now be resolved.');

  } catch (error) {
    console.error('❌ Error adding footer content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addFooterContent();
