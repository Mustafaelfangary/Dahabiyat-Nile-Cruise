const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addFleetsContent() {
  try {
    console.log('🚢 Adding Fleets content...');

    const fleetsContent = [
      {
        key: 'fleets_hero_title',
        title: 'Fleets Hero Title',
        content: 'Our Dahabiya Fleet',
        contentType: 'TEXT',
        page: 'fleets',
        section: 'hero',
        order: 1
      },
      {
        key: 'fleets_hero_subtitle',
        title: 'Fleets Hero Subtitle',
        content: 'Discover our collection of traditional dahabiyas, each offering a unique journey along the sacred Nile River.',
        contentType: 'TEXTAREA',
        page: 'fleets',
        section: 'hero',
        order: 2
      },
      {
        key: 'fleets_hero_image',
        title: 'Fleets Hero Image',
        content: '/images/hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'fleets',
        section: 'hero',
        order: 3
      },
      {
        key: 'fleets_table_title',
        title: 'Fleet Table Title',
        content: 'Our Dahabiya Collection',
        contentType: 'TEXT',
        page: 'fleets',
        section: 'fleet',
        order: 1
      },
      {
        key: 'fleets_table_data',
        title: 'Fleet Table Data',
        content: JSON.stringify([
          {
            name: 'Cleopatra Dahabiya',
            capacity: '12 guests',
            cabins: '6 cabins',
            features: ['Air conditioning', 'Private bathrooms', 'Sun deck', 'Dining area'],
            route: 'Luxor - Aswan',
            status: 'Available',
            image: '/images/boats/cleopatra.jpg'
          },
          {
            name: 'Nefertiti Dahabiya',
            capacity: '10 guests',
            cabins: '5 cabins',
            features: ['Panoramic windows', 'Lounge area', 'Traditional decor', 'Modern amenities'],
            route: 'Aswan - Luxor',
            status: 'Available',
            image: '/images/boats/nefertiti.jpg'
          },
          {
            name: 'Hatshepsut Dahabiya',
            capacity: '14 guests',
            cabins: '7 cabins',
            features: ['Spacious suites', 'Upper deck', 'Restaurant', 'Library'],
            route: 'Luxor - Aswan',
            status: 'Maintenance',
            image: '/images/boats/hatshepsut.jpg'
          }
        ], null, 2),
        contentType: 'TABLE',
        page: 'fleets',
        section: 'fleet',
        order: 2
      },
      {
        key: 'fleets_description',
        title: 'Fleet Description',
        content: 'Each dahabiya in our fleet is carefully maintained to provide the highest standards of comfort and authenticity. Our traditional sailing boats offer an intimate and luxurious way to explore the Nile.',
        contentType: 'TEXTAREA',
        page: 'fleets',
        section: 'description',
        order: 1
      },
      {
        key: 'fleets_cta_title',
        title: 'Fleet CTA Title',
        content: 'Choose Your Perfect Dahabiya',
        contentType: 'TEXT',
        page: 'fleets',
        section: 'cta',
        order: 1
      },
      {
        key: 'fleets_cta_text',
        title: 'Fleet CTA Text',
        content: 'Ready to sail the Nile in style? Contact us to check availability and book your preferred dahabiya.',
        contentType: 'TEXTAREA',
        page: 'fleets',
        section: 'cta',
        order: 2
      }
    ];

    let created = 0;
    let updated = 0;

    for (const content of fleetsContent) {
      const existing = await prisma.websiteContent.findFirst({
        where: {
          key: content.key,
          page: content.page
        }
      });

      if (existing) {
        await prisma.websiteContent.update({
          where: { id: existing.id },
          data: content
        });
        updated++;
        console.log(`✅ Updated: ${content.key}`);
      } else {
        await prisma.websiteContent.create({
          data: content
        });
        created++;
        console.log(`✅ Created: ${content.key}`);
      }
    }

    console.log(`🎉 Fleets content setup complete!`);
    console.log(`📊 Created: ${created} items`);
    console.log(`📊 Updated: ${updated} items`);

    return { created, updated };
  } catch (error) {
    console.error('❌ Error adding fleets content:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  addFleetsContent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { addFleetsContent };
