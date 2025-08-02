const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSampleData() {
  console.log('🌱 Starting to seed sample data...');

  try {
    // Create sample packages
    console.log('📦 Creating sample packages...');
    
    const samplePackages = [
      {
        name: 'Luxury Nile Discovery',
        slug: 'luxury-nile-discovery',
        description: 'Experience the magic of the Nile with our luxury dahabiya cruise. Discover ancient temples, tombs, and the timeless beauty of Egypt.',
        shortDescription: 'A luxury 5-day journey along the Nile discovering ancient wonders.',
        price: 2500,
        durationDays: 5,
        maxGuests: 12,
        mainImageUrl: '/images/packages/luxury-nile.jpg',
        heroImageUrl: '/images/packages/luxury-nile-hero.jpg',
        highlights: [
          'Visit Karnak and Luxor Temples',
          'Explore Valley of the Kings',
          'Sail on traditional dahabiya',
          'Gourmet dining experience'
        ],
        included: [
          'All meals and beverages',
          'Professional Egyptologist guide',
          'All entrance fees',
          'Airport transfers'
        ],
        notIncluded: [
          'International flights',
          'Personal expenses',
          'Gratuities'
        ],
        isActive: true,
        featured: true,
        isFeaturedOnHomepage: true,
        homepageOrder: 1
      },
      {
        name: 'Classic Nile Journey',
        slug: 'classic-nile-journey',
        description: 'A classic journey along the Nile visiting the most important archaeological sites of ancient Egypt.',
        shortDescription: 'A 4-day classic cruise visiting essential ancient sites.',
        price: 1800,
        durationDays: 4,
        maxGuests: 16,
        mainImageUrl: '/images/packages/classic-nile.jpg',
        heroImageUrl: '/images/packages/classic-nile-hero.jpg',
        highlights: [
          'Philae Temple',
          'Kom Ombo Temple',
          'Edfu Temple',
          'Traditional felucca ride'
        ],
        included: [
          'All meals',
          'Guided tours',
          'Entrance fees',
          'Transportation'
        ],
        notIncluded: [
          'Beverages',
          'Optional excursions',
          'Personal expenses'
        ],
        isActive: true,
        featured: false,
        isFeaturedOnHomepage: true,
        homepageOrder: 2
      },
      {
        name: 'Extended Nile Adventure',
        slug: 'extended-nile-adventure',
        description: 'An extended 7-day adventure covering the complete Nile experience from Aswan to Luxor with additional excursions.',
        shortDescription: 'A comprehensive 7-day Nile adventure with extended excursions.',
        price: 3200,
        durationDays: 7,
        maxGuests: 10,
        mainImageUrl: '/images/packages/extended-nile.jpg',
        heroImageUrl: '/images/packages/extended-nile-hero.jpg',
        highlights: [
          'Abu Simbel excursion',
          'Nubian village visit',
          'Hot air balloon ride',
          'Private tomb visits'
        ],
        included: [
          'All meals and premium beverages',
          'Private Egyptologist guide',
          'All entrance fees and excursions',
          'Luxury transportation'
        ],
        notIncluded: [
          'International flights',
          'Travel insurance',
          'Spa treatments'
        ],
        isActive: true,
        featured: true,
        isFeaturedOnHomepage: false,
        homepageOrder: 3
      }
    ];

    for (const packageData of samplePackages) {
      await prisma.package.upsert({
        where: { slug: packageData.slug },
        update: packageData,
        create: packageData
      });
    }

    // Create sample dahabiyas
    console.log('🚢 Creating sample dahabiyas...');
    
    const sampleDahabiyas = [
      {
        name: 'Cleopatra\'s Pearl',
        description: 'A luxurious dahabiya featuring elegant cabins and traditional Egyptian design.',
        shortDescription: 'Luxury dahabiya with elegant design and modern amenities.',
        pricePerDay: 500,
        capacity: 12,
        cabins: 6,
        crew: 8,
        length: 42,
        width: 8,
        yearBuilt: 2018,
        mainImage: '/images/dahabiyas/cleopatra-pearl.jpg',
        gallery: [
          '/images/dahabiyas/cleopatra-pearl-1.jpg',
          '/images/dahabiyas/cleopatra-pearl-2.jpg',
          '/images/dahabiyas/cleopatra-pearl-3.jpg'
        ],
        features: 'Air conditioning, En-suite bathrooms, Sun deck, Dining area',
        amenities: 'WiFi, Library, Traditional music, Spa services',
        activities: 'Swimming, Fishing, Stargazing, Cultural shows',
        diningOptions: 'Egyptian cuisine, International dishes, Vegetarian options',
        services: '24/7 crew service, Laundry, Room service',
        routes: 'Aswan to Luxor, Luxor to Aswan',
        highlights: 'Panoramic views, Traditional sailing, Intimate atmosphere',
        category: 'LUXURY',
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Nile Goddess',
        description: 'A traditional dahabiya offering authentic Nile sailing experience with modern comfort.',
        shortDescription: 'Traditional sailing experience with modern comfort.',
        pricePerDay: 400,
        capacity: 16,
        cabins: 8,
        crew: 10,
        length: 45,
        width: 9,
        yearBuilt: 2020,
        mainImage: '/images/dahabiyas/nile-goddess.jpg',
        gallery: [
          '/images/dahabiyas/nile-goddess-1.jpg',
          '/images/dahabiyas/nile-goddess-2.jpg'
        ],
        features: 'Traditional design, Modern amenities, Spacious deck',
        amenities: 'Restaurant, Bar, Lounge, Reading area',
        activities: 'Deck games, Photography, Bird watching',
        diningOptions: 'Buffet style, Local specialties, Fresh ingredients',
        services: 'Housekeeping, Concierge, Tour coordination',
        routes: 'Aswan to Kom Ombo, Edfu to Luxor',
        highlights: 'Authentic experience, Peaceful sailing, Cultural immersion',
        category: 'DELUXE',
        isActive: true,
        isFeatured: false
      },
      {
        name: 'Pharaoh\'s Dream',
        description: 'An intimate boutique dahabiya perfect for small groups seeking luxury and privacy.',
        shortDescription: 'Intimate boutique dahabiya for luxury and privacy.',
        pricePerDay: 600,
        capacity: 8,
        cabins: 4,
        crew: 6,
        length: 38,
        width: 7,
        yearBuilt: 2019,
        mainImage: '/images/dahabiyas/pharaoh-dream.jpg',
        gallery: [
          '/images/dahabiyas/pharaoh-dream-1.jpg',
          '/images/dahabiyas/pharaoh-dream-2.jpg',
          '/images/dahabiyas/pharaoh-dream-3.jpg',
          '/images/dahabiyas/pharaoh-dream-4.jpg'
        ],
        features: 'Premium suites, Private balconies, Jacuzzi',
        amenities: 'Personal butler, Premium bar, Spa treatments',
        activities: 'Private excursions, Yoga sessions, Cooking classes',
        diningOptions: 'Gourmet cuisine, Wine pairing, Private dining',
        services: 'Butler service, Personal guide, Luxury transfers',
        routes: 'Custom itineraries, Private charters',
        highlights: 'Ultimate luxury, Personalized service, Exclusive experience',
        category: 'PREMIUM',
        isActive: true,
        isFeatured: true
      }
    ];

    for (const dahabiyaData of sampleDahabiyas) {
      await prisma.dahabiya.upsert({
        where: { name: dahabiyaData.name },
        update: dahabiyaData,
        create: dahabiyaData
      });
    }

    // Create sample itineraries
    console.log('🗺️ Creating sample itineraries...');
    
    const sampleItineraries = [
      {
        name: 'Classic Aswan to Luxor',
        slug: 'classic-aswan-to-luxor',
        description: 'The classic route from Aswan to Luxor, visiting the most important temples and archaeological sites.',
        shortDescription: 'Classic 4-day route visiting essential ancient sites.',
        durationDays: 4,
        mainImageUrl: '/images/itineraries/aswan-luxor.jpg',
        heroImageUrl: '/images/itineraries/aswan-luxor-hero.jpg',
        price: 2000,
        maxGuests: 16,
        highlights: [
          'Philae Temple',
          'Kom Ombo Temple',
          'Edfu Temple',
          'Valley of the Kings'
        ],
        included: [
          'All meals',
          'Guided tours',
          'Entrance fees',
          'Transportation'
        ],
        notIncluded: [
          'Beverages',
          'Personal expenses',
          'Gratuities'
        ],
        isActive: true,
        featured: true
      },
      {
        name: 'Luxor to Aswan Discovery',
        slug: 'luxor-to-aswan-discovery',
        description: 'Discover the wonders of ancient Egypt sailing from Luxor to Aswan with stops at magnificent temples.',
        shortDescription: 'Reverse route from Luxor to Aswan with temple visits.',
        durationDays: 5,
        mainImageUrl: '/images/itineraries/luxor-aswan.jpg',
        heroImageUrl: '/images/itineraries/luxor-aswan-hero.jpg',
        price: 2300,
        maxGuests: 12,
        highlights: [
          'Karnak Temple',
          'Luxor Temple',
          'Esna Temple',
          'Aswan High Dam'
        ],
        included: [
          'All meals and beverages',
          'Professional guide',
          'All entrance fees',
          'Airport transfers'
        ],
        notIncluded: [
          'International flights',
          'Travel insurance',
          'Optional excursions'
        ],
        isActive: true,
        featured: false
      }
    ];

    for (const itineraryData of sampleItineraries) {
      await prisma.itinerary.upsert({
        where: { slug: itineraryData.slug },
        update: itineraryData,
        create: itineraryData
      });
    }

    console.log('✅ Sample data seeding completed successfully!');

    // Print summary
    const packagesCount = await prisma.package.count();
    const dahabiyasCount = await prisma.dahabiya.count();
    const itinerariesCount = await prisma.itinerary.count();

    console.log('\n📊 SEEDING SUMMARY:');
    console.log(`📦 Packages: ${packagesCount}`);
    console.log(`🚢 Dahabiyas: ${dahabiyasCount}`);
    console.log(`🗺️ Itineraries: ${itinerariesCount}`);

  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedSampleData()
    .then(() => {
      console.log('🎉 Sample data seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Sample data seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedSampleData };
