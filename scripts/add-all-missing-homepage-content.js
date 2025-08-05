const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addAllMissingHomepageContent() {
  console.log('🔧 Adding ALL missing homepage content based on actual page usage...\n');
  
  // All content keys found in the homepage with their expected values
  const allHomepageContent = [
    // Loading
    { key: 'loading_text', title: 'Loading Text', content: 'Loading...', section: 'general' },
    
    // Hero Section
    { key: 'hero_video_poster', title: 'Hero Video Poster', content: '/images/hero-bg.jpg', section: 'hero', contentType: 'IMAGE' },
    { key: 'hero_video_url', title: 'Hero Video URL', content: '/videos/home_hero_video.mp4', section: 'hero', contentType: 'VIDEO' },
    { key: 'hero_video_title', title: 'Hero Video Title', content: 'Experience the Magic of the Nile', section: 'hero' },
    { key: 'hero_video_subtitle', title: 'Hero Video Subtitle', content: 'Luxury Dahabiya Cruises Through Ancient Egypt', section: 'hero' },
    { key: 'hero_video_cta_text', title: 'Hero CTA Text', content: 'Explore Fleet', section: 'hero' },
    { key: 'hero_scroll_text', title: 'Hero Scroll Text', content: 'Scroll to explore', section: 'hero' },
    
    // Dahabiyat Section
    { key: 'dahabiyat_section_title', title: 'Dahabiyat Section Title', content: 'Our Luxury Dahabiyat Nile Cruise Fleet', section: 'dahabiyat' },
    { key: 'dahabiyat_section_subtitle', title: 'Dahabiyat Section Subtitle', content: 'Discover our collection of traditional sailing vessels, each offering a unique journey through Egypt\'s timeless landscapes', section: 'dahabiyat' },
    { key: 'guests_label', title: 'Guests Label', content: 'Guests', section: 'general' },
    { key: 'view_details_text', title: 'View Details Text', content: 'View Details', section: 'general' },
    { key: 'dahabiyat_view_all_text', title: 'Dahabiyat View All Text', content: 'View All Dahabiyat', section: 'dahabiyat' },
    
    // What is Dahabiya Section
    { key: 'what_is_dahabiya_title', title: 'What is Dahabiya Title', content: 'What is Dahabiya?', section: 'what_is' },
    { key: 'what_is_dahabiya_content', title: 'What is Dahabiya Content', content: 'A Dahabiya is a traditional Egyptian sailing boat that has been navigating the Nile River for centuries. These elegant vessels, with their distinctive lateen sails and shallow draft, were once the preferred mode of transport for Egyptian nobility and wealthy travelers exploring the ancient wonders along the Nile.', section: 'what_is', contentType: 'TEXTAREA' },
    { key: 'what_is_dahabiya_image_1', title: 'What is Dahabiya Image 1', content: '/images/dahabiya-sailing.jpg', section: 'what_is', contentType: 'IMAGE' },
    { key: 'what_is_dahabiya_image_2', title: 'What is Dahabiya Image 2', content: '/images/dahabiya-deck.jpg', section: 'what_is', contentType: 'IMAGE' },
    { key: 'what_is_dahabiya_image_3', title: 'What is Dahabiya Image 3', content: '/images/dahabiya-sunset.jpg', section: 'what_is', contentType: 'IMAGE' },
    { key: 'read_more_text', title: 'Read More Text', content: 'Read More', section: 'general' },
    { key: 'read_less_text', title: 'Read Less Text', content: 'Read Less', section: 'general' },
    
    // Packages Section
    { key: 'packages_section_title', title: 'Packages Section Title', content: 'Our Journey Packages', section: 'packages' },
    { key: 'packages_section_subtitle', title: 'Packages Section Subtitle', content: 'Choose from our carefully crafted packages, each designed to showcase the best of Egypt\'s ancient wonders and natural beauty', section: 'packages' },
    { key: 'days_label', title: 'Days Label', content: 'Days', section: 'general' },
    { key: 'packages_view_all_text', title: 'Packages View All Text', content: 'View All Packages', section: 'packages' },
    
    // Why Different Section
    { key: 'why_different_title', title: 'Why Different Title', content: 'Why is Dahabiya different from regular Nile Cruises?', section: 'why_different' },
    { key: 'why_different_content', title: 'Why Different Content', content: 'While traditional Nile cruise ships can accommodate 200-400 passengers, Dahabiyas offer an intimate experience with only 8-12 guests. This fundamental difference creates a completely different travel experience that feels more like a private yacht charter than a commercial cruise.', section: 'why_different', contentType: 'TEXTAREA' },
    { key: 'why_different_image_1', title: 'Why Different Image 1', content: '/images/cruise-comparison-1.jpg', section: 'why_different', contentType: 'IMAGE' },
    { key: 'why_different_image_2', title: 'Why Different Image 2', content: '/images/cruise-comparison-2.jpg', section: 'why_different', contentType: 'IMAGE' },
    { key: 'why_different_image_3', title: 'Why Different Image 3', content: '/images/cruise-comparison-3.jpg', section: 'why_different', contentType: 'IMAGE' },
    
    // Share Memories Section
    { key: 'share_memories_title', title: 'Share Memories Title', content: 'Share your memories with us', section: 'share_memories' },
    { key: 'share_memories_content', title: 'Share Memories Content', content: 'Your journey with us doesn\'t end when you disembark. We believe that the memories created during your Dahabiya experience are meant to be shared and cherished forever. Join our community of travelers who have fallen in love with the magic of the Nile.', section: 'share_memories', contentType: 'TEXTAREA' },
    { key: 'share_memories_image_1', title: 'Share Memories Image 1', content: '/images/guest-memories-1.jpg', section: 'share_memories', contentType: 'IMAGE' },
    { key: 'share_memories_image_2', title: 'Share Memories Image 2', content: '/images/guest-memories-2.jpg', section: 'share_memories', contentType: 'IMAGE' },
    { key: 'share_memories_image_3', title: 'Share Memories Image 3', content: '/images/guest-memories-3.jpg', section: 'share_memories', contentType: 'IMAGE' },
    
    // Our Story Section
    { key: 'our_story_title', title: 'Our Story Title', content: 'Our Story', section: 'our_story' },
    { key: 'our_story_content', title: 'Our Story Content', content: 'Our journey began over 30 years ago when Captain Ahmed Hassan, a third-generation Nile navigator, had a vision to revive the authentic way of exploring Egypt\'s ancient wonders. Growing up along the banks of the Nile, he witnessed the transformation of river travel and felt called to preserve the traditional Dahabiya experience.', section: 'our_story', contentType: 'TEXTAREA' },
    { key: 'our_story_paragraph_2', title: 'Our Story Paragraph 2', content: 'What started as a single restored Dahabiya has grown into a fleet of carefully maintained vessels, each one a testament to traditional Egyptian craftsmanship combined with modern comfort and safety standards.', section: 'our_story', contentType: 'TEXTAREA' },
    { key: 'our_story_paragraph_3', title: 'Our Story Paragraph 3', content: 'Today, we continue Captain Hassan\'s legacy by offering intimate, authentic Nile experiences that connect our guests with the timeless beauty and rich history of Egypt, one journey at a time.', section: 'our_story', contentType: 'TEXTAREA' },
    { key: 'our_story_paragraph_4', title: 'Our Story Paragraph 4', content: 'Every member of our crew shares this passion for preserving Egyptian heritage while creating unforgettable memories for travelers from around the world.', section: 'our_story', contentType: 'TEXTAREA' },
    
    // Founder Section
    { key: 'founder_image', title: 'Founder Image', content: '/images/ashraf-elmasry.jpg', section: 'our_story', contentType: 'IMAGE' },
    { key: 'founder_name', title: 'Founder Name', content: 'Ashraf El-Masry', section: 'our_story' },
    { key: 'founder_title', title: 'Founder Title', content: 'Founder & CEO', section: 'our_story' },
    { key: 'founder_quote', title: 'Founder Quote', content: '"Preserving the ancient art of Nile navigation for future generations"', section: 'our_story' },
    
    // Safety Section
    { key: 'safety_title', title: 'Safety Title', content: 'Your Safety is Our Priority', section: 'safety' },
    { key: 'safety_subtitle', title: 'Safety Subtitle', content: 'All our Dahabiyas are certified and regularly inspected to ensure the highest safety standards', section: 'safety' },
    
    // CTA Section
    { key: 'cta_title', title: 'CTA Title', content: 'Ready to Begin Your Journey?', section: 'cta' },
    { key: 'cta_description', title: 'CTA Description', content: 'Contact us today to start planning your unforgettable Dahabiya adventure on the Nile', section: 'cta' },
    { key: 'cta_book_text', title: 'CTA Book Text', content: 'Book Your Journey', section: 'cta' },
    { key: 'cta_contact_text', title: 'CTA Contact Text', content: 'Contact Us', section: 'cta' }
  ];

  console.log(`📋 Processing ${allHomepageContent.length} content items...`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of allHomepageContent) {
    try {
      const result = await prisma.websiteContent.upsert({
        where: { key: item.key },
        update: {
          title: item.title,
          content: item.content,
          contentType: item.contentType || 'TEXT',
          page: 'homepage',
          section: item.section,
          order: 0,
          isActive: true
        },
        create: {
          key: item.key,
          title: item.title,
          content: item.content,
          contentType: item.contentType || 'TEXT',
          page: 'homepage',
          section: item.section,
          order: 0,
          isActive: true
        }
      });

      // Check if it was created or updated
      const wasCreated = result.createdAt.getTime() === result.updatedAt.getTime();
      if (wasCreated) {
        created++;
        console.log(`✅ Created: ${item.key} (${item.section})`);
      } else {
        updated++;
        console.log(`🔄 Updated: ${item.key} (${item.section})`);
      }
    } catch (error) {
      console.error(`❌ Failed to process ${item.key}:`, error.message);
      skipped++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created} new items`);
  console.log(`   Updated: ${updated} existing items`);
  console.log(`   Skipped: ${skipped} failed items`);
  console.log(`   Total processed: ${created + updated + skipped}`);

  // Final verification
  const finalContent = await prisma.websiteContent.findMany({
    where: { 
      page: 'homepage',
      isActive: true 
    },
    select: {
      key: true,
      section: true
    },
    orderBy: [
      { section: 'asc' },
      { order: 'asc' }
    ]
  });

  const finalSections = {};
  finalContent.forEach(item => {
    if (!finalSections[item.section]) {
      finalSections[item.section] = [];
    }
    finalSections[item.section].push(item.key);
  });

  console.log(`\n📋 Final homepage content: ${finalContent.length} items`);
  Object.keys(finalSections).sort().forEach(section => {
    console.log(`  📂 ${section}: ${finalSections[section].length} items`);
  });

  console.log('\n🎯 What should now show in admin panel:');
  console.log('The homepage section should have ALL these sections:');
  Object.keys(finalSections).sort().forEach(section => {
    console.log(`  • ${section} (${finalSections[section].length} editable fields)`);
  });

  console.log('\n✅ All missing homepage content has been added!');
  console.log('Now visit the admin panel to see all sections.');
}

async function main() {
  try {
    await addAllMissingHomepageContent();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
