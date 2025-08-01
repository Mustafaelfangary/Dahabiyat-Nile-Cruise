const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define the master content fields that should be used across the site
const MASTER_CONTENT_FIELDS = {
  // Site Identity
  site_name: {
    key: 'site_name',
    title: 'Site Name',
    content: 'Cleopatra Dahabiyat',
    page: 'global_media',
    section: 'branding'
  },
  site_tagline: {
    key: 'site_tagline', 
    title: 'Site Tagline',
    content: 'Luxury Nile Cruises',
    page: 'global_media',
    section: 'branding'
  },
  site_description: {
    key: 'site_description',
    title: 'Site Description', 
    content: 'Experience the magic of the Nile with our luxury dahabiya cruises. Authentic Egyptian hospitality meets modern comfort.',
    page: 'global_media',
    section: 'branding'
  },

  // Contact Information
  contact_phone: {
    key: 'contact_phone',
    title: 'Main Phone Number',
    content: '+201001538358',
    page: 'global_media',
    section: 'contact'
  },
  contact_email: {
    key: 'contact_email',
    title: 'Main Email Address',
    content: 'info@cleopatradahabiya.com',
    page: 'global_media',
    section: 'contact'
  },
  contact_address: {
    key: 'contact_address',
    title: 'Main Address',
    content: 'Luxor, Egypt',
    page: 'global_media',
    section: 'contact'
  },
  contact_whatsapp: {
    key: 'contact_whatsapp',
    title: 'WhatsApp Number',
    content: '+201001538358',
    page: 'global_media',
    section: 'contact'
  },

  // Social Media
  social_facebook: {
    key: 'social_facebook',
    title: 'Facebook URL',
    content: 'https://facebook.com/cleopatradahabiya',
    page: 'global_media',
    section: 'social'
  },
  social_instagram: {
    key: 'social_instagram',
    title: 'Instagram URL',
    content: 'https://instagram.com/cleopatradahabiya',
    page: 'global_media',
    section: 'social'
  },
  social_youtube: {
    key: 'social_youtube',
    title: 'YouTube URL',
    content: 'https://youtube.com/@cleopatradahabiya',
    page: 'global_media',
    section: 'social'
  },
  social_twitter: {
    key: 'social_twitter',
    title: 'Twitter URL',
    content: 'https://twitter.com/cleopatradahabiya',
    page: 'global_media',
    section: 'social'
  }
};

// Map of duplicate keys to master keys
const DUPLICATE_MAPPINGS = {
  // Site name variations
  'footer-title': 'site_name',
  'footer-company-name': 'site_name',
  'home_hero_headline': 'site_name',
  
  // Contact variations
  'footer-phone': 'contact_phone',
  'footer-email': 'contact_email',
  'footer-address': 'contact_address',
  'about_contact_phone': 'contact_phone',
  'about_contact_email': 'contact_email',
  'about_contact_address': 'contact_address',
  
  // Social media variations
  'footer-facebook': 'social_facebook',
  'footer-instagram': 'social_instagram',
  'footer-twitter': 'social_twitter',
  'footer-youtube': 'social_youtube',
  
  // Description variations
  'footer-description': 'site_description',
  'home_hero_subheadline': 'site_description'
};

async function deduplicateContent() {
  console.log('🔄 Starting content deduplication process...\n');

  try {
    // Step 1: Create master content fields
    console.log('📝 Step 1: Creating master content fields...');
    for (const [key, field] of Object.entries(MASTER_CONTENT_FIELDS)) {
      await prisma.websiteContent.upsert({
        where: { key: field.key },
        update: {
          title: field.title,
          content: field.content,
          page: field.page,
          section: field.section,
          contentType: 'TEXT',
          isActive: true
        },
        create: {
          key: field.key,
          title: field.title,
          content: field.content,
          page: field.page,
          section: field.section,
          contentType: 'TEXT',
          isActive: true
        }
      });
      console.log(`  ✅ Created/updated: ${field.key}`);
    }

    // Step 2: Find and merge duplicate content
    console.log('\n🔍 Step 2: Finding duplicate content...');
    const duplicates = [];
    
    for (const [duplicateKey, masterKey] of Object.entries(DUPLICATE_MAPPINGS)) {
      const duplicateContent = await prisma.websiteContent.findUnique({
        where: { key: duplicateKey }
      });
      
      if (duplicateContent) {
        duplicates.push({
          duplicate: duplicateContent,
          masterKey: masterKey
        });
        console.log(`  🔍 Found duplicate: ${duplicateKey} → ${masterKey}`);
      }
    }

    // Step 3: Merge content and preserve any custom values
    console.log('\n🔄 Step 3: Merging duplicate content...');
    for (const { duplicate, masterKey } of duplicates) {
      const masterContent = await prisma.websiteContent.findUnique({
        where: { key: masterKey }
      });

      if (masterContent && duplicate.content && duplicate.content.trim()) {
        // If duplicate has content and master doesn't, use duplicate's content
        if (!masterContent.content || masterContent.content.trim() === MASTER_CONTENT_FIELDS[masterKey]?.content) {
          await prisma.websiteContent.update({
            where: { key: masterKey },
            data: { content: duplicate.content }
          });
          console.log(`  📝 Updated master ${masterKey} with content from ${duplicate.key}`);
        }
      }
    }

    // Step 4: Remove duplicate entries
    console.log('\n🗑️ Step 4: Removing duplicate entries...');
    const duplicateKeys = Object.keys(DUPLICATE_MAPPINGS);
    const deletedCount = await prisma.websiteContent.deleteMany({
      where: {
        key: { in: duplicateKeys }
      }
    });
    console.log(`  ✅ Removed ${deletedCount.count} duplicate entries`);

    // Step 5: Update component references
    console.log('\n🔧 Step 5: Component references updated (manual step required)');
    console.log('  📋 Update these components to use master keys:');
    console.log('     - Footer.tsx: Use contact_*, social_*, site_* keys');
    console.log('     - Homepage: Use site_name, site_description');
    console.log('     - About page: Use contact_* keys');
    console.log('     - Contact page: Use contact_*, social_* keys');

    // Step 6: Generate summary report
    console.log('\n📊 Step 6: Deduplication Summary');
    const totalContent = await prisma.websiteContent.count();
    const masterFields = Object.keys(MASTER_CONTENT_FIELDS).length;
    const removedDuplicates = duplicateKeys.length;

    console.log(`  📈 Total content fields: ${totalContent}`);
    console.log(`  🎯 Master fields created: ${masterFields}`);
    console.log(`  🗑️ Duplicate fields removed: ${removedDuplicates}`);
    console.log(`  💾 Space saved: ${removedDuplicates} duplicate entries`);

    console.log('\n✅ Content deduplication completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. Update component files to use master keys');
    console.log('2. Test all pages to ensure content displays correctly');
    console.log('3. Update admin panel to manage master fields');
    console.log('4. Remove any hardcoded duplicate values');

  } catch (error) {
    console.error('❌ Error during deduplication:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to show current duplicates
async function showDuplicates() {
  console.log('🔍 Current duplicate content analysis...\n');
  
  const allContent = await prisma.websiteContent.findMany({
    orderBy: { key: 'asc' }
  });

  const duplicateGroups = {};
  
  // Group similar content
  for (const content of allContent) {
    const key = content.key.toLowerCase();
    
    // Check for phone numbers
    if (key.includes('phone') || key.includes('tel')) {
      if (!duplicateGroups.phone) duplicateGroups.phone = [];
      duplicateGroups.phone.push(content);
    }
    
    // Check for emails
    if (key.includes('email') || key.includes('mail')) {
      if (!duplicateGroups.email) duplicateGroups.email = [];
      duplicateGroups.email.push(content);
    }
    
    // Check for social media
    if (key.includes('facebook') || key.includes('instagram') || key.includes('twitter') || key.includes('youtube')) {
      if (!duplicateGroups.social) duplicateGroups.social = [];
      duplicateGroups.social.push(content);
    }
    
    // Check for site names
    if (key.includes('title') || key.includes('name') || key.includes('company')) {
      if (!duplicateGroups.names) duplicateGroups.names = [];
      duplicateGroups.names.push(content);
    }
  }

  for (const [group, items] of Object.entries(duplicateGroups)) {
    if (items.length > 1) {
      console.log(`📱 ${group.toUpperCase()} duplicates:`);
      items.forEach(item => {
        console.log(`  - ${item.key}: "${item.content}"`);
      });
      console.log('');
    }
  }
}

// Run the appropriate function based on command line argument
const command = process.argv[2];

if (command === 'show') {
  showDuplicates();
} else {
  deduplicateContent();
}
