const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDeveloperSettings() {
  console.log('🔍 Testing developer settings...');

  try {
    // First, let's see ALL content in the database
    const allContent = await prisma.websiteContent.findMany({
      where: {
        key: {
          contains: 'developer'
        }
      },
      orderBy: {
        key: 'asc'
      }
    });

    console.log('\n📋 All Developer-related Content in Database:');
    console.log('=============================================');
    allContent.forEach(item => {
      console.log(`📄 ${item.key} (page: ${item.page}, section: ${item.section}): "${item.content}"`);
    });

    // Fetch all footer content
    const footerContent = await prisma.websiteContent.findMany({
      where: {
        page: 'footer',
        section: 'developer'
      },
      orderBy: {
        key: 'asc'
      }
    });

    console.log('\n📋 Current Developer Settings in Database:');
    console.log('==========================================');
    
    if (footerContent.length === 0) {
      console.log('❌ No developer settings found in footer page!');
      return;
    }

    footerContent.forEach(item => {
      console.log(`✅ ${item.key}: "${item.content}"`);
    });

    // Check for duplicates in global_media
    const globalContent = await prisma.websiteContent.findMany({
      where: {
        page: 'global_media',
        section: 'developer'
      }
    });

    if (globalContent.length > 0) {
      console.log('\n⚠️  Found developer settings in global_media (potential duplicates):');
      globalContent.forEach(item => {
        console.log(`🔄 ${item.key}: "${item.content}"`);
      });
    } else {
      console.log('\n✅ No duplicate developer settings found in global_media');
    }

    // Test specific keys that should exist
    const requiredKeys = [
      'footer_developer_contact_text',
      'footer_developer_branding_text',
      'footer_developer_logo',
      'footer_developer_name',
      'footer_developer_company',
      'footer_developer_phone',
      'footer_developer_email'
    ];

    console.log('\n🔍 Checking required keys:');
    console.log('==========================');
    
    for (const key of requiredKeys) {
      const setting = footerContent.find(item => item.key === key);
      if (setting) {
        console.log(`✅ ${key}: Found`);
      } else {
        console.log(`❌ ${key}: Missing`);
      }
    }

    console.log('\n🎉 Developer settings test completed!');

  } catch (error) {
    console.error('❌ Error testing developer settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDeveloperSettings();
