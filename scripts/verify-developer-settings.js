const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyDeveloperSettings() {
  console.log('🔍 Verifying Developer Settings System...');
  console.log('=========================================\n');

  try {
    // 1. Check that developer settings exist in global_media
    const developerSettings = await prisma.websiteContent.findMany({
      where: {
        page: 'global_media',
        section: 'developer'
      },
      orderBy: {
        key: 'asc'
      }
    });

    console.log('1️⃣ Developer Settings in Database:');
    console.log('----------------------------------');
    if (developerSettings.length > 0) {
      console.log(`✅ Found ${developerSettings.length} developer settings in global_media`);
      developerSettings.forEach(setting => {
        console.log(`   📄 ${setting.key}: "${setting.content}"`);
      });
    } else {
      console.log('❌ No developer settings found in global_media');
      return;
    }

    // 2. Check for duplicates in other pages
    const duplicates = await prisma.websiteContent.findMany({
      where: {
        key: {
          startsWith: 'footer_developer_'
        },
        page: {
          not: 'global_media'
        }
      }
    });

    console.log('\n2️⃣ Duplicate Check:');
    console.log('-------------------');
    if (duplicates.length > 0) {
      console.log(`⚠️  Found ${duplicates.length} potential duplicates:`);
      duplicates.forEach(dup => {
        console.log(`   🔄 ${dup.key} in page: ${dup.page}`);
      });
    } else {
      console.log('✅ No duplicates found - all developer settings are in global_media only');
    }

    // 3. Check required keys
    const requiredKeys = [
      'footer_developer_contact_text',
      'footer_developer_branding_text',
      'footer_developer_logo',
      'footer_developer_name',
      'footer_developer_company',
      'footer_developer_phone',
      'footer_developer_email',
      'footer_developer_contact_url',
      'footer_developer_phone_url'
    ];

    console.log('\n3️⃣ Required Keys Check:');
    console.log('----------------------');
    let missingKeys = 0;
    for (const key of requiredKeys) {
      const setting = developerSettings.find(s => s.key === key);
      if (setting) {
        console.log(`✅ ${key}`);
      } else {
        console.log(`❌ ${key} - MISSING`);
        missingKeys++;
      }
    }

    // 4. Summary
    console.log('\n4️⃣ System Status Summary:');
    console.log('-------------------------');
    if (missingKeys === 0 && duplicates.length === 0) {
      console.log('🎉 ✅ Developer Settings System is WORKING CORRECTLY!');
      console.log('   ✅ All required settings present');
      console.log('   ✅ No duplicates found');
      console.log('   ✅ Settings stored in correct location (global_media)');
      console.log('\n📋 Next Steps:');
      console.log('   1. Visit /admin/developer-settings to manage settings');
      console.log('   2. Changes will reflect immediately on the website footer');
      console.log('   3. No more duplicate settings in other admin pages');
    } else {
      console.log('⚠️  Issues found:');
      if (missingKeys > 0) {
        console.log(`   ❌ ${missingKeys} required keys missing`);
      }
      if (duplicates.length > 0) {
        console.log(`   ❌ ${duplicates.length} duplicate settings found`);
      }
    }

  } catch (error) {
    console.error('❌ Error verifying developer settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDeveloperSettings();
