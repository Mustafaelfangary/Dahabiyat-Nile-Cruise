#!/usr/bin/env node

/**
 * Content Synchronization Script
 * Ensures all content changes are synchronized across:
 * - Web application (Next.js)
 * - Mobile web version
 * - Android application
 * - PWA version
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

// Content keys that need to be synchronized across all platforms
const SYNC_CONTENT_KEYS = [
  // Itineraries page content
  'itineraries_hero_title',
  'itineraries_hero_subtitle',
  'itineraries_hero_description',
  'itineraries_hero_cta_text',
  'itineraries_loading_text',
  'itineraries_no_itineraries_title',
  'itineraries_no_itineraries_description',
  'itineraries_empty_title',
  'itineraries_empty_description',

  // Dahabiyas page content
  'dahabiyas_hero_title',
  'dahabiyas_hero_subtitle',
  'dahabiyas_hero_description',
  'dahabiyas_empty_title',
  'dahabiyas_empty_description',

  // Packages page content
  'packages_hero_title',
  'packages_hero_subtitle',
  'packages_hero_description',
  'packages_empty_title',
  'packages_empty_description',

  // Contact page content
  'contact_hero_title',
  'contact_hero_subtitle',
  'contact_description',

  // Developer settings
  'footer_developer_name',
  'footer_developer_company',
  'footer_developer_phone',
  'footer_developer_email',
  'footer_developer_website',
  'footer_developer_logo',
  'footer_developer_branding_text',
  'footer_developer_contact_text',
  'footer_developer_contact_modal_title',

  // Global media and logos
  'site_logo',
  'mobile_hero_image_2',
  'mobile_hero_image_3',

  // Contact information
  'footer-company-name',
  'footer-address',
  'footer-phone',
  'footer-email',
  'footer-facebook',
  'footer-twitter',
  'footer-instagram',
  'whatsapp_phone',

  // Homepage content
  'hero_title',
  'hero_subtitle',
  'hero_description',
  'hero_video_url',
  'hero_video_poster',
  'featured_packages_title',
  'featured_packages_subtitle',
  'what_is_title',
  'what_is_description'
];

async function syncContentAcrossPlatforms() {
  console.log('🔄 Starting content synchronization across all platforms...');
  
  try {
    // 1. Get all current content from database
    console.log('📖 Fetching current content from database...');
    const allContent = await prisma.websiteContent.findMany({
      where: {
        key: {
          in: SYNC_CONTENT_KEYS
        },
        isActive: true
      }
    });

    console.log(`✅ Found ${allContent.length} content entries to sync`);

    // 2. Create content map for easy access
    const contentMap = {};
    allContent.forEach(content => {
      contentMap[content.key] = {
        value: content.content || content.mediaUrl || '',
        type: content.contentType,
        title: content.title
      };
    });

    // 3. Update mobile app configuration
    console.log('📱 Updating mobile app configuration...');
    await updateMobileAppConfig(contentMap);

    // 4. Update PWA manifest
    console.log('🌐 Updating PWA manifest...');
    await updatePWAManifest(contentMap);

    // 5. Generate content sync file for mobile app
    console.log('📄 Generating content sync file for mobile app...');
    await generateMobileContentSync(contentMap);

    // 6. Update Android app constants
    console.log('🤖 Updating Android app constants...');
    await updateAndroidConstants(contentMap);

    console.log('✅ Content synchronization completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • ${allContent.length} content entries synchronized`);
    console.log('   • Mobile web version: ✅ Auto-synced via API');
    console.log('   • PWA version: ✅ Updated');
    console.log('   • Android app: ✅ Updated');
    console.log('   • Content sync file: ✅ Generated');

  } catch (error) {
    console.error('❌ Error during content synchronization:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateMobileAppConfig(contentMap) {
  const configPath = path.join(__dirname, '../mobile-app/config/content.json');
  
  const mobileConfig = {
    lastUpdated: new Date().toISOString(),
    apiEndpoint: process.env.NEXT_PUBLIC_API_URL || 'https://dahabiyatnilecruise.com',
    content: {
      developer: {
        name: contentMap['footer_developer_name']?.value || 'Just X Development',
        company: contentMap['footer_developer_company']?.value || 'Just X',
        phone: contentMap['footer_developer_phone']?.value || '+201200958713',
        email: contentMap['footer_developer_email']?.value || 'developer@justx.com',
        website: contentMap['footer_developer_website']?.value || 'https://justx.com',
        brandingText: contentMap['footer_developer_branding_text']?.value || 'Crafted with love in the land of the Pharaohs by Just X',
        logo: contentMap['footer_developer_logo']?.value || '/images/logo-white.png'
      },
      itineraries: {
        heroTitle: contentMap['itineraries_hero_title']?.value || 'Royal Journeys Through Time',
        heroSubtitle: contentMap['itineraries_hero_subtitle']?.value || 'Discover Ancient Egypt Through Carefully Crafted Journeys',
        heroDescription: contentMap['itineraries_hero_description']?.value || 'Explore our collection of meticulously planned itineraries',
        emptyStateTitle: contentMap['itineraries_no_itineraries_title']?.value || 'There are no itineraries yet',
        emptyStateDescription: contentMap['itineraries_no_itineraries_description']?.value || 'Our pharaonic scholars are crafting extraordinary journeys'
      },
      company: {
        name: contentMap['footer-company-name']?.value || 'Cleopatra Dahabiyat',
        address: contentMap['footer-address']?.value || 'Luxor, Egypt',
        phone: contentMap['footer-phone']?.value || '+20 123 456 789',
        email: contentMap['footer-email']?.value || 'info@cleopatradarabiyat.com'
      }
    }
  };

  // Ensure directory exists
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  
  // Write config file
  await fs.writeFile(configPath, JSON.stringify(mobileConfig, null, 2));
  console.log('   ✅ Mobile app config updated');
}

async function updatePWAManifest(contentMap) {
  const manifestPath = path.join(__dirname, '../public/manifest.json');
  
  try {
    // Read existing manifest
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Update with current content
    manifest.name = contentMap['footer-company-name']?.value || manifest.name || 'Cleopatra Dahabiyat';
    manifest.short_name = contentMap['footer-company-name']?.value?.substring(0, 12) || manifest.short_name || 'Cleopatra';
    manifest.description = contentMap['hero_subtitle']?.value || manifest.description || 'Luxury Nile Cruise Experience';
    
    // Write updated manifest
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('   ✅ PWA manifest updated');
  } catch (error) {
    console.log('   ⚠️  PWA manifest not found or invalid, skipping...');
  }
}

async function generateMobileContentSync(contentMap) {
  const syncFilePath = path.join(__dirname, '../public/api/mobile-content-sync.json');
  
  const syncData = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    platform: 'mobile',
    content: contentMap
  };

  // Ensure directory exists
  await fs.mkdir(path.dirname(syncFilePath), { recursive: true });
  
  // Write sync file
  await fs.writeFile(syncFilePath, JSON.stringify(syncData, null, 2));
  console.log('   ✅ Mobile content sync file generated');
}

async function updateAndroidConstants(contentMap) {
  const constantsPath = path.join(__dirname, '../mobile-app/constants/AppConstants.ts');
  
  const constantsContent = `// Auto-generated content constants - DO NOT EDIT MANUALLY
// Last updated: ${new Date().toISOString()}
// Generated by: scripts/sync-content-across-platforms.js

export const APP_CONSTANTS = {
  API_BASE_URL: '${process.env.NEXT_PUBLIC_API_URL || 'https://dahabiyatnilecruise.com'}',
  
  DEVELOPER: {
    NAME: '${contentMap['footer_developer_name']?.value || 'Just X Development'}',
    COMPANY: '${contentMap['footer_developer_company']?.value || 'Just X'}',
    PHONE: '${contentMap['footer_developer_phone']?.value || '+201200958713'}',
    EMAIL: '${contentMap['footer_developer_email']?.value || 'developer@justx.com'}',
    WEBSITE: '${contentMap['footer_developer_website']?.value || 'https://justx.com'}',
    BRANDING_TEXT: '${contentMap['footer_developer_branding_text']?.value || 'Crafted with love in the land of the Pharaohs by Just X'}',
    LOGO: '${contentMap['footer_developer_logo']?.value || '/images/logo-white.png'}'
  },
  
  COMPANY: {
    NAME: '${contentMap['footer-company-name']?.value || 'Cleopatra Dahabiyat'}',
    ADDRESS: '${contentMap['footer-address']?.value || 'Luxor, Egypt'}',
    PHONE: '${contentMap['footer-phone']?.value || '+20 123 456 789'}',
    EMAIL: '${contentMap['footer-email']?.value || 'info@cleopatradarabiyat.com'}'
  },
  
  ITINERARIES: {
    HERO_TITLE: '${contentMap['itineraries_hero_title']?.value || 'Royal Journeys Through Time'}',
    HERO_SUBTITLE: '${contentMap['itineraries_hero_subtitle']?.value || 'Discover Ancient Egypt Through Carefully Crafted Journeys'}',
    EMPTY_STATE_TITLE: '${contentMap['itineraries_no_itineraries_title']?.value || 'There are no itineraries yet'}',
    EMPTY_STATE_DESCRIPTION: '${contentMap['itineraries_no_itineraries_description']?.value || 'Our pharaonic scholars are crafting extraordinary journeys'}'
  }
};

export default APP_CONSTANTS;
`;

  // Ensure directory exists
  await fs.mkdir(path.dirname(constantsPath), { recursive: true });
  
  // Write constants file
  await fs.writeFile(constantsPath, constantsContent);
  console.log('   ✅ Android app constants updated');
}

// Run the synchronization
if (require.main === module) {
  syncContentAcrossPlatforms();
}

module.exports = {
  syncContentAcrossPlatforms,
  SYNC_CONTENT_KEYS
};
