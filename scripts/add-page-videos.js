const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addPageVideos() {
  console.log('🎬 Adding video content for all pages...');
  
  const videoContent = [
    // Contact page video
    { key: 'contact_hero_video', title: 'Contact Hero Video', content: '/videos/home_hero_video.mp4', section: 'hero', page: 'contact', contentType: 'VIDEO' },
    
    // About page video
    { key: 'about_hero_video', title: 'About Hero Video', content: '/videos/home_hero_video.mp4', section: 'hero', page: 'about', contentType: 'VIDEO' },
    
    // Itineraries page video
    { key: 'itineraries_hero_video', title: 'Itineraries Hero Video', content: '/videos/home_hero_video.mp4', section: 'hero', page: 'itineraries', contentType: 'VIDEO' },
    
    // Packages page video
    { key: 'packages_hero_video', title: 'Packages Hero Video', content: '/videos/home_hero_video.mp4', section: 'hero', page: 'packages', contentType: 'VIDEO' },
    
    // Blog page video
    { key: 'blog_hero_video', title: 'Blog Hero Video', content: '/videos/home_hero_video.mp4', section: 'hero', page: 'blog', contentType: 'VIDEO' }
  ];
  
  let created = 0;
  let updated = 0;
  
  for (const item of videoContent) {
    try {
      const existing = await prisma.websiteContent.findUnique({
        where: { key: item.key }
      });
      
      if (existing) {
        await prisma.websiteContent.update({
          where: { key: item.key },
          data: {
            content: item.content,
            title: item.title,
            contentType: item.contentType,
            mediaUrl: item.content
          }
        });
        updated++;
        console.log('🔄 Updated:', item.key);
      } else {
        await prisma.websiteContent.create({
          data: {
            key: item.key,
            title: item.title,
            content: item.content,
            contentType: item.contentType,
            page: item.page,
            section: item.section,
            order: 0,
            isActive: true,
            mediaUrl: item.content
          }
        });
        created++;
        console.log('✅ Created:', item.key);
      }
    } catch (error) {
      console.error('❌ Failed to process:', item.key, error.message);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created} items`);
  console.log(`   Updated: ${updated} items`);
  console.log(`   Total: ${created + updated} items`);
  console.log('✅ Page videos added successfully!');
  console.log('\n🎯 Now all pages support both video and image heroes!');
  
  await prisma.$disconnect();
}

addPageVideos().catch(console.error);
