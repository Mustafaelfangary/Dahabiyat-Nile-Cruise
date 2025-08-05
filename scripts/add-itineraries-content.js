const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addItinerariesContent() {
  try {
    console.log('🗺️ Adding Itineraries Page Content...');

    const itinerariesContent = [
      // Hero Section
      {
        key: 'itineraries_hero_title',
        title: 'Itineraries Hero Title',
        content: 'Discover Ancient Egypt',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'hero',
        order: 1
      },
      {
        key: 'itineraries_hero_subtitle',
        title: 'Itineraries Hero Subtitle',
        content: 'Journey Through Time on the Eternal Nile',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'hero',
        order: 2
      },
      {
        key: 'itineraries_hero_description',
        title: 'Itineraries Hero Description',
        content: 'Explore our carefully crafted itineraries that take you through 5000 years of Egyptian history. Each journey is designed to immerse you in the wonders of ancient civilization while enjoying modern luxury aboard our traditional dahabiyas.',
        contentType: 'TEXTAREA',
        page: 'itineraries',
        section: 'hero',
        order: 3
      },
      {
        key: 'itineraries_hero_cta_text',
        title: 'Itineraries CTA Button Text',
        content: 'Explore All Journeys',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'hero',
        order: 4
      },
      {
        key: 'itineraries_hero_background_image',
        title: 'Itineraries Hero Background Image',
        content: '/images/itineraries/hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'itineraries',
        section: 'hero',
        order: 5
      },

      // Main Content Section
      {
        key: 'itineraries_main_title',
        title: 'Main Section Title',
        content: 'Our Signature Journeys',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'main',
        order: 1
      },
      {
        key: 'itineraries_main_description',
        title: 'Main Section Description',
        content: 'Each itinerary is a masterpiece of cultural immersion, combining historical exploration with luxurious comfort. Our expert guides bring ancient stories to life as you sail the same waters that carried pharaohs and queens.',
        contentType: 'TEXTAREA',
        page: 'itineraries',
        section: 'main',
        order: 2
      },

      // Filter Section
      {
        key: 'itineraries_filter_title',
        title: 'Filter Section Title',
        content: 'Find Your Perfect Journey',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'filter',
        order: 1
      },
      {
        key: 'itineraries_filter_duration_label',
        title: 'Duration Filter Label',
        content: 'Duration',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'filter',
        order: 2
      },
      {
        key: 'itineraries_filter_price_label',
        title: 'Price Filter Label',
        content: 'Price Range',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'filter',
        order: 3
      },
      {
        key: 'itineraries_filter_guests_label',
        title: 'Guests Filter Label',
        content: 'Number of Guests',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'filter',
        order: 4
      },

      // Empty State
      {
        key: 'itineraries_no_itineraries_title',
        title: 'No Itineraries Title',
        content: 'No Journeys Found',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'empty_state',
        order: 1
      },
      {
        key: 'itineraries_no_itineraries_description',
        title: 'No Itineraries Description',
        content: 'We couldn\'t find any itineraries matching your criteria. Please adjust your filters or contact us to create a custom journey just for you.',
        contentType: 'TEXTAREA',
        page: 'itineraries',
        section: 'empty_state',
        order: 2
      },
      {
        key: 'itineraries_no_itineraries_cta_text',
        title: 'No Itineraries CTA Text',
        content: 'Create Custom Journey',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'empty_state',
        order: 3
      },

      // Loading State
      {
        key: 'itineraries_loading_text',
        title: 'Loading Text',
        content: 'Discovering your perfect journey...',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'loading',
        order: 1
      },

      // Features Section
      {
        key: 'itineraries_features_title',
        title: 'Features Section Title',
        content: 'What Makes Our Itineraries Special',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'features',
        order: 1
      },
      {
        key: 'itineraries_feature_1_title',
        title: 'Feature 1 Title',
        content: 'Expert Egyptologists',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'features',
        order: 2
      },
      {
        key: 'itineraries_feature_1_description',
        title: 'Feature 1 Description',
        content: 'Our guides are certified Egyptologists who bring ancient history to life with fascinating stories and deep knowledge.',
        contentType: 'TEXTAREA',
        page: 'itineraries',
        section: 'features',
        order: 3
      },
      {
        key: 'itineraries_feature_2_title',
        title: 'Feature 2 Title',
        content: 'Authentic Experiences',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'features',
        order: 4
      },
      {
        key: 'itineraries_feature_2_description',
        title: 'Feature 2 Description',
        content: 'Visit hidden gems and experience local culture beyond the typical tourist sites.',
        contentType: 'TEXTAREA',
        page: 'itineraries',
        section: 'features',
        order: 5
      },
      {
        key: 'itineraries_feature_3_title',
        title: 'Feature 3 Title',
        content: 'Luxury Comfort',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'features',
        order: 6
      },
      {
        key: 'itineraries_feature_3_description',
        title: 'Feature 3 Description',
        content: 'Enjoy modern amenities and luxury accommodations while exploring ancient wonders.',
        contentType: 'TEXTAREA',
        page: 'itineraries',
        section: 'features',
        order: 7
      },

      // CTA Section
      {
        key: 'itineraries_cta_title',
        title: 'CTA Section Title',
        content: 'Ready to Begin Your Journey?',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'cta',
        order: 1
      },
      {
        key: 'itineraries_cta_description',
        title: 'CTA Section Description',
        content: 'Contact our travel experts to customize your perfect Egyptian adventure or book one of our signature itineraries today.',
        contentType: 'TEXTAREA',
        page: 'itineraries',
        section: 'cta',
        order: 2
      },
      {
        key: 'itineraries_cta_primary_text',
        title: 'Primary CTA Button Text',
        content: 'Book Your Journey',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'cta',
        order: 3
      },
      {
        key: 'itineraries_cta_secondary_text',
        title: 'Secondary CTA Button Text',
        content: 'Contact Us',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'cta',
        order: 4
      }
    ];

    console.log(`📝 Creating ${itinerariesContent.length} itineraries content entries...`);

    let created = 0;
    let updated = 0;

    for (const content of itinerariesContent) {
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

        console.log(`✅ itineraries: ${content.key}`);
      } catch (error) {
        console.error(`❌ Failed to create ${content.key}:`, error.message);
      }
    }

    console.log(`\n🎉 Itineraries content population completed!`);
    console.log(`📊 Summary:`);
    console.log(`  - Created: ${created} new entries`);
    console.log(`  - Updated: ${updated} existing entries`);
    console.log(`  - Total: ${created + updated} entries processed`);

    // Show final count
    const count = await prisma.websiteContent.count({
      where: { page: 'itineraries', isActive: true }
    });
    console.log(`  - Itineraries page: ${count} content blocks`);

  } catch (error) {
    console.error('❌ Error adding itineraries content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addItinerariesContent();
