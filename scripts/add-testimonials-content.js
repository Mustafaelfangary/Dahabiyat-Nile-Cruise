const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestimonialsContent() {
  console.log('🌟 Adding testimonials page content...');

  try {
    const testimonialsContent = [
      {
        key: 'testimonials_hero_title',
        title: 'Testimonials Hero Title',
        content: 'What Our Guests Say',
        contentType: 'TEXT',
        page: 'testimonials',
        section: 'hero',
        order: 1
      },
      {
        key: 'testimonials_hero_subtitle',
        title: 'Testimonials Hero Subtitle',
        content: 'Read reviews from travelers who experienced the magic of the Nile',
        contentType: 'TEXT',
        page: 'testimonials',
        section: 'hero',
        order: 2
      },
      {
        key: 'testimonials_hero_background',
        title: 'Testimonials Hero Background',
        content: '/images/testimonials-hero.jpg',
        contentType: 'IMAGE',
        page: 'testimonials',
        section: 'hero',
        order: 3
      },
      {
        key: 'testimonials_section_title',
        title: 'Testimonials Section Title',
        content: 'Guest Reviews',
        contentType: 'TEXT',
        page: 'testimonials',
        section: 'content',
        order: 4
      },
      {
        key: 'testimonials_description',
        title: 'Testimonials Description',
        content: 'Discover what makes our Nile cruises special through the words of our satisfied guests.',
        contentType: 'TEXTAREA',
        page: 'testimonials',
        section: 'content',
        order: 5
      },
      {
        key: 'testimonials_cta_title',
        title: 'Testimonials CTA Title',
        content: 'Ready for Your Own Adventure?',
        contentType: 'TEXT',
        page: 'testimonials',
        section: 'cta',
        order: 6
      },
      {
        key: 'testimonials_cta_subtitle',
        title: 'Testimonials CTA Subtitle',
        content: 'Join thousands of satisfied guests and book your Nile cruise today',
        contentType: 'TEXT',
        page: 'testimonials',
        section: 'cta',
        order: 7
      },
      {
        key: 'testimonials_cta_button',
        title: 'Testimonials CTA Button',
        content: 'Book Now',
        contentType: 'TEXT',
        page: 'testimonials',
        section: 'cta',
        order: 8
      }
    ];

    console.log(`📝 Creating ${testimonialsContent.length} testimonials content entries...`);

    let created = 0;
    let updated = 0;

    for (const content of testimonialsContent) {
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

        console.log(`✅ testimonials: ${content.key}`);
      } catch (error) {
        console.error(`❌ Failed to create ${content.key}:`, error.message);
      }
    }

    console.log(`\n🎉 Testimonials content completed!`);
    console.log(`📊 Summary:`);
    console.log(`  - Created: ${created} new entries`);
    console.log(`  - Updated: ${updated} existing entries`);

    // Check final count
    const count = await prisma.websiteContent.count({
      where: { page: 'testimonials', isActive: true }
    });
    console.log(`  - testimonials: ${count} content blocks`);

  } catch (error) {
    console.error('❌ Error adding testimonials content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addTestimonialsContent();
