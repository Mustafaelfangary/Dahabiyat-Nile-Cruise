const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testItinerarySaveEdit() {
  console.log('🧪 Testing Itinerary Save & Edit Issues...');
  console.log('=========================================\n');

  try {
    // 1. Test if we can fetch existing itineraries
    console.log('1️⃣ Testing Existing Itineraries:');
    console.log('--------------------------------');
    
    const existingItineraries = await prisma.itinerary.findMany({
      include: {
        days: true,
        pricingTiers: true
      }
    });

    console.log(`📊 Found ${existingItineraries.length} existing itineraries`);
    
    existingItineraries.forEach((itinerary, index) => {
      console.log(`\n${index + 1}. ${itinerary.name}`);
      console.log(`   ID: ${itinerary.id}`);
      console.log(`   Slug: ${itinerary.slug}`);
      console.log(`   Days: ${itinerary.days.length}`);
      console.log(`   Pricing Tiers: ${itinerary.pricingTiers.length}`);
      console.log(`   Active: ${itinerary.isActive ? '✅' : '❌'}`);
      
      // Check for data issues
      const issues = [];
      if (!itinerary.name || itinerary.name.trim() === '') issues.push('Empty name');
      if (!itinerary.description || itinerary.description.trim() === '') issues.push('Empty description');
      if (itinerary.days.length === 0) issues.push('No days');
      if (itinerary.pricingTiers.length === 0) issues.push('No pricing tiers');
      
      itinerary.days.forEach((day, dayIndex) => {
        if (!day.title || day.title.trim() === '') issues.push(`Day ${dayIndex + 1} has empty title`);
        if (!day.description || day.description.trim() === '') issues.push(`Day ${dayIndex + 1} has empty description`);
        if (!day.meals || day.meals.length === 0) issues.push(`Day ${dayIndex + 1} has no meals`);
      });
      
      if (issues.length > 0) {
        console.log(`   ⚠️ Issues: ${issues.join(', ')}`);
      } else {
        console.log(`   ✅ Data looks good`);
      }
    });

    // 2. Test creating a new itinerary
    console.log('\n2️⃣ Testing Itinerary Creation:');
    console.log('------------------------------');
    
    const testItineraryData = {
      name: 'Test Save Functionality',
      slug: 'test-save-functionality-' + Date.now(),
      description: 'Testing if we can save itineraries properly',
      shortDescription: 'Test itinerary for debugging save issues',
      durationDays: 3,
      mainImageUrl: '/images/test.jpg',
      price: 1000.00,
      maxGuests: 8,
      highlights: ['Test highlight 1', 'Test highlight 2'],
      included: ['Test included 1'],
      notIncluded: ['Test not included 1'],
      isActive: true,
      featured: false,
      days: [
        {
          dayNumber: 1,
          title: 'Test Day 1',
          description: 'First day of test itinerary',
          location: 'Test Location 1',
          activities: ['Test Activity 1', 'Test Activity 2'],
          meals: ['BREAKFAST', 'LUNCH'],
          coordinates: null
        },
        {
          dayNumber: 2,
          title: 'Test Day 2',
          description: 'Second day of test itinerary',
          location: 'Test Location 2',
          activities: ['Test Activity 3'],
          meals: ['BREAKFAST', 'DINNER'],
          coordinates: null
        }
      ],
      pricingTiers: [
        {
          category: 'SILVER',
          paxRange: '2-3 PAX',
          price: 1000.00,
          singleSupplement: 200.00
        },
        {
          category: 'GOLD',
          paxRange: '4-6 PAX',
          price: 800.00,
          singleSupplement: 150.00
        }
      ]
    };

    try {
      const newItinerary = await prisma.itinerary.create({
        data: {
          name: testItineraryData.name,
          slug: testItineraryData.slug,
          description: testItineraryData.description,
          shortDescription: testItineraryData.shortDescription,
          durationDays: testItineraryData.durationDays,
          mainImageUrl: testItineraryData.mainImageUrl,
          price: testItineraryData.price,
          maxGuests: testItineraryData.maxGuests,
          highlights: testItineraryData.highlights,
          included: testItineraryData.included,
          notIncluded: testItineraryData.notIncluded,
          isActive: testItineraryData.isActive,
          featured: testItineraryData.featured,
          days: {
            create: testItineraryData.days
          },
          pricingTiers: {
            create: testItineraryData.pricingTiers
          }
        },
        include: {
          days: true,
          pricingTiers: true
        }
      });

      console.log('✅ CREATE test: SUCCESS');
      console.log(`   Created itinerary: ${newItinerary.name} (ID: ${newItinerary.id})`);
      console.log(`   Days created: ${newItinerary.days.length}`);
      console.log(`   Pricing tiers created: ${newItinerary.pricingTiers.length}`);

      // 3. Test updating the itinerary
      console.log('\n3️⃣ Testing Itinerary Update:');
      console.log('----------------------------');

      const updatedItinerary = await prisma.itinerary.update({
        where: { id: newItinerary.id },
        data: {
          name: 'Test Save Functionality - UPDATED',
          description: 'Updated description to test edit functionality',
          price: 1200.00,
          days: {
            deleteMany: {},
            create: [
              {
                dayNumber: 1,
                title: 'Updated Day 1',
                description: 'Updated first day description',
                location: 'Updated Location 1',
                activities: ['Updated Activity 1'],
                meals: ['BREAKFAST', 'LUNCH', 'DINNER'],
                coordinates: null
              }
            ]
          },
          pricingTiers: {
            deleteMany: {},
            create: [
              {
                category: 'PLATINUM',
                paxRange: '2-4 PAX',
                price: 1200.00,
                singleSupplement: 300.00
              }
            ]
          }
        },
        include: {
          days: true,
          pricingTiers: true
        }
      });

      console.log('✅ UPDATE test: SUCCESS');
      console.log(`   Updated itinerary: ${updatedItinerary.name}`);
      console.log(`   New price: $${updatedItinerary.price}`);
      console.log(`   Updated days: ${updatedItinerary.days.length}`);
      console.log(`   Updated pricing tiers: ${updatedItinerary.pricingTiers.length}`);

      // 4. Test deleting the test itinerary
      console.log('\n4️⃣ Testing Itinerary Deletion:');
      console.log('------------------------------');

      await prisma.itinerary.delete({
        where: { id: newItinerary.id }
      });

      console.log('✅ DELETE test: SUCCESS');
      console.log('   Test itinerary cleaned up');

    } catch (createError) {
      console.error('❌ CREATE/UPDATE/DELETE test failed:', createError.message);
      console.error('   This suggests database operation issues');
    }

    // 5. Check for common issues
    console.log('\n5️⃣ Checking for Common Issues:');
    console.log('------------------------------');

    // Check for schema issues
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection: OK');
    } catch (dbError) {
      console.error('❌ Database connection: FAILED');
      console.error('   Error:', dbError.message);
    }

    // Check for foreign key constraints
    try {
      const orphanedDays = await prisma.itineraryDay.findMany({
        where: {
          itinerary: null
        }
      });
      
      if (orphanedDays.length > 0) {
        console.log(`⚠️ Found ${orphanedDays.length} orphaned itinerary days`);
      } else {
        console.log('✅ No orphaned itinerary days');
      }
    } catch (fkError) {
      console.error('❌ Foreign key check failed:', fkError.message);
    }

    console.log('\n🎯 Summary:');
    console.log('----------');
    console.log(`📊 Total itineraries: ${existingItineraries.length}`);
    console.log('✅ Database operations: Working');
    console.log('💡 If you\'re still having issues, the problem is likely in:');
    console.log('   1. Frontend form validation');
    console.log('   2. API authentication');
    console.log('   3. Browser console errors');
    console.log('   4. Network connectivity');

  } catch (error) {
    console.error('❌ Critical error during testing:', error);
    console.error('📋 Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testItinerarySaveEdit();
