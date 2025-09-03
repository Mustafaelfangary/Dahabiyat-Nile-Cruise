import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🌱 Starting dahabiya seeding...');

    // Check if dahabiyas already exist
    const existingCount = await prisma.dahabiya.count();
    console.log(`📊 Found ${existingCount} existing dahabiyas`);

    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already has ${existingCount} dahabiyas`,
        existingCount
      });
    }

    // Sample dahabiyas data
    const sampleDahabiyas = [
      {
        name: "Royal Cleopatra",
        slug: "royal-cleopatra",
        description: "Experience the ultimate luxury aboard our flagship dahabiya, Royal Cleopatra. This magnificent vessel combines traditional Egyptian craftsmanship with modern amenities, offering an unforgettable journey through the heart of ancient Egypt.",
        shortDescription: "Luxury flagship dahabiya with premium amenities and traditional Egyptian design",
        pricePerDay: 450.00,
        capacity: 16,
        cabins: 8,
        crew: 12,
        length: 52.0,
        width: 9.5,
        yearBuilt: 2018,
        mainImage: "/images/dahabiyas/royal-cleopatra.jpg",
        gallery: [
          "/images/dahabiyas/royal-cleopatra-1.jpg",
          "/images/dahabiyas/royal-cleopatra-2.jpg",
          "/images/dahabiyas/royal-cleopatra-3.jpg"
        ],
        features: [
          "Air-conditioned cabins",
          "Private bathrooms",
          "Sun deck with lounge area",
          "Traditional Egyptian cuisine",
          "Professional crew",
          "WiFi available"
        ],
        amenities: [
          "Restaurant",
          "Bar",
          "Library",
          "Gift shop",
          "Laundry service",
          "Medical kit"
        ],
        activities: [
          "Temple visits",
          "Felucca sailing",
          "Local market tours",
          "Cooking classes",
          "Evening entertainment"
        ],
        diningOptions: ["Main restaurant", "Outdoor dining", "Room service"],
        services: ["Concierge", "Tour guide", "Transportation"],
        routes: ["Luxor to Aswan", "Aswan to Luxor", "Extended Nile cruise"],
        highlights: ["Valley of the Kings", "Philae Temple", "Kom Ombo Temple", "Edfu Temple"],
        rating: 4.8,
        reviewCount: 127,
        isActive: true,
        isFeatured: true,
        category: "LUXURY",
        metaTitle: "Royal Cleopatra - Luxury Dahabiya Nile Cruise",
        metaDescription: "Experience luxury Nile cruising aboard Royal Cleopatra, our flagship dahabiya with premium amenities and traditional Egyptian hospitality.",
        tags: ["luxury", "premium", "flagship", "traditional"]
      },
      {
        name: "Nile Princess",
        slug: "nile-princess",
        description: "Sail in comfort aboard the elegant Nile Princess, a beautifully appointed dahabiya that offers the perfect blend of traditional charm and modern comfort for your Nile adventure.",
        shortDescription: "Elegant dahabiya with traditional charm and modern comfort",
        pricePerDay: 320.00,
        capacity: 12,
        cabins: 6,
        crew: 8,
        length: 45.0,
        width: 8.5,
        yearBuilt: 2019,
        mainImage: "/images/dahabiyas/nile-princess.jpg",
        gallery: [
          "/images/dahabiyas/nile-princess-1.jpg",
          "/images/dahabiyas/nile-princess-2.jpg"
        ],
        features: [
          "Comfortable cabins",
          "Shared bathrooms",
          "Dining area",
          "Upper deck",
          "Traditional design"
        ],
        amenities: [
          "Restaurant",
          "Lounge area",
          "Reading corner"
        ],
        activities: [
          "Temple tours",
          "Village visits",
          "Sunset viewing"
        ],
        diningOptions: ["Main dining room", "Deck dining"],
        services: ["Guide service", "Meal service"],
        routes: ["Luxor to Aswan", "Day trips"],
        highlights: ["Karnak Temple", "Luxor Temple", "Aswan High Dam"],
        rating: 4.5,
        reviewCount: 89,
        isActive: true,
        isFeatured: false,
        category: "DELUXE",
        metaTitle: "Nile Princess - Traditional Dahabiya Cruise",
        metaDescription: "Discover the Nile aboard Nile Princess, an elegant dahabiya offering traditional charm and comfortable accommodations.",
        tags: ["traditional", "comfortable", "elegant"]
      },
      {
        name: "Golden Pharaoh",
        slug: "golden-pharaoh",
        description: "Journey through time aboard the Golden Pharaoh, a magnificent dahabiya that captures the essence of ancient Egyptian royalty while providing all modern conveniences.",
        shortDescription: "Magnificent dahabiya inspired by ancient Egyptian royalty",
        pricePerDay: 380.00,
        capacity: 14,
        cabins: 7,
        crew: 10,
        length: 48.0,
        width: 9.0,
        yearBuilt: 2020,
        mainImage: "/images/dahabiyas/golden-pharaoh.jpg",
        gallery: [
          "/images/dahabiyas/golden-pharaoh-1.jpg",
          "/images/dahabiyas/golden-pharaoh-2.jpg"
        ],
        features: [
          "Themed cabins",
          "Private facilities",
          "Pharaonic decor",
          "Spacious deck",
          "Modern amenities"
        ],
        amenities: [
          "Themed restaurant",
          "Entertainment area",
          "Souvenir shop"
        ],
        activities: [
          "Historical tours",
          "Cultural shows",
          "Photography sessions"
        ],
        diningOptions: ["Pharaonic dining hall", "Deck service"],
        services: ["Egyptologist guide", "Cultural programs"],
        routes: ["Historical route", "Temple circuit"],
        highlights: ["Abu Simbel", "Philae Temple", "Nubian villages"],
        rating: 4.7,
        reviewCount: 156,
        isActive: true,
        isFeatured: true,
        category: "LUXURY",
        metaTitle: "Golden Pharaoh - Royal Egyptian Dahabiya",
        metaDescription: "Experience royal treatment aboard Golden Pharaoh, a magnificent dahabiya with pharaonic themes and luxury amenities.",
        tags: ["royal", "pharaonic", "luxury", "themed"]
      }
    ];

    console.log(`🚀 Creating ${sampleDahabiyas.length} sample dahabiyas...`);

    // Create dahabiyas
    const createdDahabiyas = [];
    for (const dahabiyaData of sampleDahabiyas) {
      try {
        const dahabiya = await prisma.dahabiya.create({
          data: dahabiyaData
        });
        createdDahabiyas.push(dahabiya);
        console.log(`✅ Created: ${dahabiya.name}`);
      } catch (error) {
        console.error(`❌ Failed to create ${dahabiyaData.name}:`, error);
      }
    }

    console.log(`🎉 Successfully created ${createdDahabiyas.length} dahabiyas`);

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdDahabiyas.length} dahabiyas`,
      dahabiyas: createdDahabiyas.map(d => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        pricePerDay: d.pricePerDay,
        capacity: d.capacity
      }))
    });

  } catch (error) {
    console.error('❌ Seeding error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed dahabiyas',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
