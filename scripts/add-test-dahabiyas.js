const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestDahabiyas() {
  try {
    console.log('🚢 Adding test dahabiyas...\n');
    
    const testDahabiyas = [
      {
        name: 'Nile Queen',
        slug: 'nile-queen',
        description: 'Experience the ultimate luxury on the Nile with our flagship dahabiya. Featuring elegant cabins, gourmet dining, and personalized service.',
        shortDescription: 'Luxury dahabiya with elegant cabins and gourmet dining',
        pricePerDay: 450.00,
        capacity: 12,
        cabins: 6,
        crew: 8,
        length: 52.0,
        width: 9.5,
        yearBuilt: 2020,
        mainImage: '/images/dahabiyas/nile-queen.jpg',
        gallery: ['/images/dahabiyas/nile-queen-1.jpg', '/images/dahabiyas/nile-queen-2.jpg'],
        features: ['Air Conditioning', 'Private Bathroom', 'Balcony', 'WiFi', 'Mini Bar'],
        amenities: ['Spa', 'Restaurant', 'Bar', 'Library', 'Sun Deck'],
        activities: ['Guided Tours', 'Cooking Classes', 'Stargazing', 'Traditional Music'],
        diningOptions: ['Fine Dining Restaurant', 'Rooftop Bar', 'Room Service'],
        routes: ['Luxor to Aswan', 'Aswan to Luxor'],
        rating: 4.8,
        reviewCount: 156,
        isActive: true,
        isFeatured: true,
        category: 'LUXURY'
      },
      {
        name: 'Pharaoh\'s Dream',
        slug: 'pharaohs-dream',
        description: 'Sail through history aboard this beautifully crafted dahabiya, offering comfort and authenticity in perfect harmony.',
        shortDescription: 'Authentic dahabiya with traditional Egyptian charm',
        pricePerDay: 320.00,
        capacity: 10,
        cabins: 5,
        crew: 6,
        length: 45.0,
        width: 8.0,
        yearBuilt: 2019,
        mainImage: '/images/dahabiyas/pharaohs-dream.jpg',
        gallery: ['/images/dahabiyas/pharaohs-dream-1.jpg'],
        features: ['Air Conditioning', 'Private Bathroom', 'Traditional Decor', 'WiFi'],
        amenities: ['Restaurant', 'Bar', 'Reading Area', 'Sun Deck'],
        activities: ['Temple Visits', 'Local Market Tours', 'Sunset Sailing'],
        diningOptions: ['Traditional Restaurant', 'Outdoor Dining'],
        routes: ['Luxor to Aswan'],
        rating: 4.6,
        reviewCount: 89,
        isActive: true,
        isFeatured: false,
        category: 'DELUXE'
      },
      {
        name: 'Golden Lotus',
        slug: 'golden-lotus',
        description: 'A premium dahabiya offering exceptional service and comfort for discerning travelers seeking an unforgettable Nile experience.',
        shortDescription: 'Premium dahabiya with exceptional service',
        pricePerDay: 380.00,
        capacity: 14,
        cabins: 7,
        crew: 9,
        length: 48.0,
        width: 9.0,
        yearBuilt: 2021,
        mainImage: '/images/dahabiyas/golden-lotus.jpg',
        gallery: ['/images/dahabiyas/golden-lotus-1.jpg', '/images/dahabiyas/golden-lotus-2.jpg'],
        features: ['Air Conditioning', 'Private Bathroom', 'Balcony', 'WiFi', 'Safe'],
        amenities: ['Spa', 'Restaurant', 'Bar', 'Gym', 'Sun Deck', 'Pool'],
        activities: ['Guided Tours', 'Spa Treatments', 'Yoga Classes', 'Cultural Shows'],
        diningOptions: ['Gourmet Restaurant', 'Pool Bar', 'Room Service'],
        routes: ['Luxor to Aswan', 'Aswan to Luxor', 'Extended Nile Tour'],
        rating: 4.9,
        reviewCount: 203,
        isActive: true,
        isFeatured: true,
        category: 'PREMIUM'
      },
      {
        name: 'Desert Rose',
        slug: 'desert-rose',
        description: 'Intimate and charming, this boutique dahabiya offers a personalized Nile journey with attention to every detail.',
        shortDescription: 'Intimate boutique dahabiya with personalized service',
        pricePerDay: 280.00,
        capacity: 8,
        cabins: 4,
        crew: 5,
        length: 38.0,
        width: 7.5,
        yearBuilt: 2018,
        mainImage: '/images/dahabiyas/desert-rose.jpg',
        gallery: ['/images/dahabiyas/desert-rose-1.jpg'],
        features: ['Air Conditioning', 'Private Bathroom', 'WiFi', 'Traditional Decor'],
        amenities: ['Restaurant', 'Lounge', 'Sun Deck'],
        activities: ['Temple Tours', 'Local Experiences', 'Sunset Cocktails'],
        diningOptions: ['Intimate Restaurant', 'Deck Dining'],
        routes: ['Luxor to Aswan'],
        rating: 4.7,
        reviewCount: 67,
        isActive: true,
        isFeatured: false,
        category: 'BOUTIQUE'
      }
    ];
    
    for (const dahabiya of testDahabiyas) {
      const created = await prisma.dahabiya.create({
        data: dahabiya,
        select: {
          id: true,
          name: true,
          pricePerDay: true,
          capacity: true,
          category: true
        }
      });
      
      console.log(`✅ Created: ${created.name}`);
      console.log(`   💰 Price: $${created.pricePerDay}/day`);
      console.log(`   👥 Capacity: ${created.capacity} guests`);
      console.log(`   📊 Category: ${created.category}\n`);
    }
    
    console.log('🎉 All test dahabiyas created successfully!');
    console.log('🌐 Visit http://localhost:3001/dahabiyas to see them with price display');
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Error creating dahabiyas:', error);
    await prisma.$disconnect();
  }
}

addTestDahabiyas();
