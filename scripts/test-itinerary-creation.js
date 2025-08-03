const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testItineraryCreation() {
  console.log('🧪 Testing itinerary creation...');

  try {
    // Test data similar to what would be sent from the form
    const testData = {
      name: 'Test Itinerary',
      description: 'A test itinerary for debugging',
      shortDescription: 'Test short description',
      durationDays: 5,
      mainImageUrl: '/images/test.jpg',
      heroImageUrl: '/images/test-hero.jpg',
      price: 1000.00,
      maxGuests: 10,
      highlights: ['Test highlight 1', 'Test highlight 2'],
      included: ['Test included 1', 'Test included 2'],
      notIncluded: ['Test not included 1'],
      childrenPolicy: 'Test children policy',
      cancellationPolicy: 'Test cancellation policy',
      observations: 'Test observations',
      isActive: true,
      featured: false,
      days: [
        {
          dayNumber: 1,
          title: 'Day 1 Title',
          description: 'Day 1 description',
          location: 'Test Location',
          activities: ['Activity 1', 'Activity 2'],
          meals: ['BREAKFAST', 'LUNCH'],
          coordinates: null
        }
      ],
      pricingTiers: [
        {
          category: 'SILVER',
          paxRange: '2-3 PAX',
          price: 1000.00,
          singleSupplement: 200.00
        }
      ]
    };

    // Generate slug
    const baseSlug = testData.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    console.log('📝 Generated slug:', baseSlug);

    // Check if slug is unique
    let slug = baseSlug;
    let counter = 1;
    let existingItinerary = await prisma.itinerary.findUnique({
      where: { slug }
    });

    while (existingItinerary) {
      slug = `${baseSlug}-${counter}`;
      existingItinerary = await prisma.itinerary.findUnique({
        where: { slug }
      });
      counter++;
    }

    console.log('✅ Final unique slug:', slug);

    // Try to create the itinerary
    console.log('🚀 Creating itinerary...');
    
    const itinerary = await prisma.itinerary.create({
      data: {
        name: testData.name,
        slug: slug,
        description: testData.description,
        shortDescription: testData.shortDescription,
        durationDays: parseInt(testData.durationDays),
        mainImageUrl: testData.mainImageUrl,
        heroImageUrl: testData.heroImageUrl,
        videoUrl: testData.videoUrl,
        price: testData.price ? parseFloat(testData.price) : null,
        maxGuests: testData.maxGuests ? parseInt(testData.maxGuests) : null,
        highlights: testData.highlights || [],
        included: testData.included || [],
        notIncluded: testData.notIncluded || [],
        childrenPolicy: testData.childrenPolicy,
        cancellationPolicy: testData.cancellationPolicy,
        observations: testData.observations,
        isActive: testData.isActive ?? true,
        featured: testData.featured ?? false,
        days: {
          create: (testData.days || []).map((day) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            description: day.description,
            location: day.location,
            activities: day.activities || [],
            meals: day.meals || [],
            coordinates: day.coordinates || null,
          }))
        },
        pricingTiers: {
          create: (testData.pricingTiers || []).map((tier) => ({
            category: tier.category,
            paxRange: tier.paxRange,
            price: parseFloat(tier.price),
            singleSupplement: tier.singleSupplement ? parseFloat(tier.singleSupplement) : null,
          }))
        }
      },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' }
        },
        pricingTiers: {
          orderBy: { category: 'asc' }
        }
      }
    });

    console.log('✅ Itinerary created successfully!');
    console.log('📋 Created itinerary:', {
      id: itinerary.id,
      name: itinerary.name,
      slug: itinerary.slug,
      daysCount: itinerary.days.length,
      pricingTiersCount: itinerary.pricingTiers.length
    });

    // Clean up - delete the test itinerary
    await prisma.itinerary.delete({
      where: { id: itinerary.id }
    });

    console.log('🧹 Test itinerary cleaned up');
    console.log('🎉 Itinerary creation test PASSED!');

  } catch (error) {
    console.error('❌ Error creating itinerary:', error);
    console.error('📋 Error details:', error.message);
    if (error.code) {
      console.error('🔍 Error code:', error.code);
    }
    if (error.meta) {
      console.error('🔍 Error meta:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testItineraryCreation();
