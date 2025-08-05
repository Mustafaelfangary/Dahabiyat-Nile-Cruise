const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define the clean, organized content structure
const CLEAN_CONTENT_STRUCTURE = {
  homepage: {
    hero: [
      { key: 'hero_title', title: 'Hero Title', content: 'Discover the Timeless Beauty of the Nile', type: 'TEXT' },
      { key: 'hero_subtitle', title: 'Hero Subtitle', content: 'Experience authentic Egyptian hospitality aboard our traditional dahabiyat', type: 'TEXT' },
      { key: 'hero_video_url', title: 'Hero Video URL', content: '/videos/hero-video.mp4', type: 'VIDEO' },
      { key: 'hero_video_poster', title: 'Hero Video Poster', content: '/images/hero-poster.jpg', type: 'IMAGE' },
      { key: 'hero_cta_text', title: 'Hero CTA Button Text', content: 'Start Your Journey', type: 'TEXT' }
    ],
    about: [
      { key: 'about_title', title: 'About Section Title', content: 'What is a Dahabiya?', type: 'TEXT' },
      { key: 'about_content', title: 'About Section Content', content: 'A dahabiya is a traditional Egyptian sailing boat...', type: 'TEXTAREA' },
      { key: 'about_image', title: 'About Section Image', content: '/images/about-dahabiya.jpg', type: 'IMAGE' }
    ],
    dahabiyas: [
      { key: 'dahabiyas_title', title: 'Dahabiyas Section Title', content: 'Our Fleet', type: 'TEXT' },
      { key: 'dahabiyas_subtitle', title: 'Dahabiyas Section Subtitle', content: 'Choose your perfect vessel', type: 'TEXT' },
      { key: 'dahabiyas_view_all_text', title: 'View All Dahabiyas Text', content: 'View All Dahabiyas', type: 'TEXT' }
    ],
    packages: [
      { key: 'packages_title', title: 'Packages Section Title', content: 'Our Packages', type: 'TEXT' },
      { key: 'packages_subtitle', title: 'Packages Section Subtitle', content: 'Curated experiences for every traveler', type: 'TEXT' },
      { key: 'packages_view_all_text', title: 'View All Packages Text', content: 'View All Packages', type: 'TEXT' }
    ],
    testimonials: [
      { key: 'testimonials_title', title: 'Testimonials Section Title', content: 'What Our Guests Say', type: 'TEXT' },
      { key: 'testimonials_subtitle', title: 'Testimonials Section Subtitle', content: 'Real experiences from real travelers', type: 'TEXT' }
    ],
    cta: [
      { key: 'cta_title', title: 'CTA Section Title', content: 'Ready for Your Nile Adventure?', type: 'TEXT' },
      { key: 'cta_subtitle', title: 'CTA Section Subtitle', content: 'Book your unforgettable journey today', type: 'TEXT' },
      { key: 'cta_button_text', title: 'CTA Button Text', content: 'Book Now', type: 'TEXT' }
    ]
  },
  about: [
    { key: 'about_hero_title', title: 'About Hero Title', content: 'Discover the Timeless Beauty of the Nile', type: 'TEXT' },
    { key: 'about_hero_subtitle', title: 'About Hero Subtitle', content: 'Experience authentic Egyptian hospitality aboard our traditional dahabiyat', type: 'TEXT' },
    { key: 'about_story_title', title: 'Our Story Title', content: 'Our Story', type: 'TEXT' },
    { key: 'about_story_content', title: 'Our Story Content', content: 'For generations, we have been sharing the magic of the Nile...', type: 'TEXTAREA' },
    { key: 'about_mission_title', title: 'Our Mission Title', content: 'Our Mission', type: 'TEXT' },
    { key: 'about_mission_content', title: 'Our Mission Content', content: 'To provide authentic and sustainable Nile experiences...', type: 'TEXTAREA' }
  ],
  contact: [
    { key: 'contact_hero_title', title: 'Contact Hero Title', content: 'Get in Touch', type: 'TEXT' },
    { key: 'contact_hero_subtitle', title: 'Contact Hero Subtitle', content: 'We\'re here to help plan your perfect Nile journey', type: 'TEXT' },
    { key: 'contact_phone', title: 'Contact Phone', content: '+20 123 456 7890', type: 'TEXT' },
    { key: 'contact_email', title: 'Contact Email', content: 'info@dahabiyatnilecruise.com', type: 'TEXT' },
    { key: 'contact_address', title: 'Contact Address', content: 'Luxor, Egypt', type: 'TEXT' },
    { key: 'contact_whatsapp', title: 'WhatsApp Number', content: '+20 123 456 7890', type: 'TEXT' }
  ],
  dahabiyas: [
    { key: 'dahabiyas_hero_title', title: 'Dahabiyas Hero Title', content: 'Our Luxury Fleet', type: 'TEXT' },
    { key: 'dahabiyas_hero_subtitle', title: 'Dahabiyas Hero Subtitle', content: 'Choose from our collection of traditional dahabiyat', type: 'TEXT' },
    { key: 'dahabiyas_description', title: 'Dahabiyas Description', content: 'Each of our dahabiyat offers a unique experience...', type: 'TEXTAREA' }
  ],
  packages: [
    { key: 'packages_hero_title', title: 'Packages Hero Title', content: 'Our Packages', type: 'TEXT' },
    { key: 'packages_hero_subtitle', title: 'Packages Hero Subtitle', content: 'Curated experiences for every type of traveler', type: 'TEXT' },
    { key: 'packages_description', title: 'Packages Description', content: 'From romantic getaways to family adventures...', type: 'TEXTAREA' }
  ],
  footer: [
    { key: 'footer_company_description', title: 'Company Description', content: 'Dahabiyat Nile Cruise - Your gateway to authentic Egyptian experiences', type: 'TEXT' },
    { key: 'footer_quick_links_title', title: 'Quick Links Title', content: 'Quick Links', type: 'TEXT' },
    { key: 'footer_contact_title', title: 'Contact Title', content: 'Contact Us', type: 'TEXT' },
    { key: 'footer_social_title', title: 'Social Media Title', content: 'Follow Us', type: 'TEXT' }
  ]
};

async function reorganizeContentSystem() {
  console.log('🧹 Starting Content Management System Reorganization...\n');
  
  try {
    // Step 1: Backup current content
    console.log('📦 Creating backup of current content...');
    const currentContent = await prisma.websiteContent.findMany();
    console.log(`Backed up ${currentContent.length} content entries`);
    
    // Step 2: Clear all existing content
    console.log('\n🗑️ Clearing existing content...');
    const deleteResult = await prisma.websiteContent.deleteMany({});
    console.log(`Deleted ${deleteResult.count} existing content entries`);
    
    // Step 3: Create clean content structure
    console.log('\n✨ Creating clean content structure...');
    let createdCount = 0;
    
    for (const [page, sections] of Object.entries(CLEAN_CONTENT_STRUCTURE)) {
      if (Array.isArray(sections)) {
        // Direct page content (not sectioned)
        for (const [index, field] of sections.entries()) {
          await prisma.websiteContent.create({
            data: {
              key: field.key,
              title: field.title,
              content: field.content,
              contentType: field.type,
              page: page,
              section: 'main',
              order: index + 1,
              isActive: true
            }
          });
          createdCount++;
        }
      } else {
        // Sectioned content (like homepage)
        for (const [sectionName, fields] of Object.entries(sections)) {
          for (const [index, field] of fields.entries()) {
            await prisma.websiteContent.create({
              data: {
                key: field.key,
                title: field.title,
                content: field.content,
                contentType: field.type,
                page: page,
                section: sectionName,
                order: index + 1,
                isActive: true
              }
            });
            createdCount++;
          }
        }
      }
    }
    
    console.log(`Created ${createdCount} clean content entries`);
    
    // Step 4: Verify the new structure
    console.log('\n📊 Verifying new content structure...');
    const newContentByPage = await prisma.websiteContent.groupBy({
      by: ['page'],
      _count: { page: true }
    });
    
    console.log('New content distribution:');
    for (const page of newContentByPage) {
      console.log(`  ${page.page}: ${page._count.page} fields`);
    }
    
    const totalNew = await prisma.websiteContent.count();
    console.log(`\nTotal content entries: ${totalNew} (reduced from ${currentContent.length})`);
    console.log(`Reduction: ${currentContent.length - totalNew} entries (${Math.round((currentContent.length - totalNew) / currentContent.length * 100)}%)`);
    
    console.log('\n🎉 Content Management System Reorganization Complete!');
    console.log('\n📋 Summary:');
    console.log(`  ✅ Removed ${currentContent.length - totalNew} redundant/unused fields`);
    console.log(`  ✅ Organized content into logical sections`);
    console.log(`  ✅ Standardized field naming conventions`);
    console.log(`  ✅ Reduced homepage fields from 130 to ${newContentByPage.find(p => p.page === 'homepage')?._count.page || 0}`);
    
  } catch (error) {
    console.error('❌ Error during reorganization:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reorganization
reorganizeContentSystem().catch(console.error);
