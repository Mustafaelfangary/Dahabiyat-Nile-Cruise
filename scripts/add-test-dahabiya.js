const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestDahabiya() {
  try {
    console.log('🚢 Adding test dahabiya for availability testing...');

    // Check if any dahabiyat exist
    const existingCount = await prisma.dahabiya.count();
    console.log(`📊 Current dahabiyat count: ${existingCount}`);

    if (existingCount === 0) {
      // Create a test dahabiya
      const testDahabiya = await prisma.dahabiya.create({
        data: {
          name: 'Test Dahabiya - Nile Queen',
          description: 'A beautiful test dahabiya for availability management testing',
          capacity: 12,
          pricePerDay: 500.00,
          category: 'LUXURY',
          status: 'ACTIVE',
          features: ['Air Conditioning', 'Private Bathroom', 'Balcony', 'WiFi'],
          location: 'Luxor',
          length: 45.5,
          width: 8.2,
          yearBuilt: 2020,
          maxSpeed: 12.5,
          crewSize: 8,
          safetyFeatures: ['Life Jackets', 'Fire Extinguishers', 'First Aid Kit'],
          entertainmentFeatures: ['Sound System', 'Library', 'Games'],
          diningFeatures: ['Restaurant', 'Bar', 'Room Service'],
          isActive: true,
          isFeatured: true
        }
      });

      console.log(`✅ Created test dahabiya: ${testDahabiya.name} (ID: ${testDahabiya.id})`);

      // Create some sample availability dates for the next 3 months
      const today = new Date();
      const dates = [];
      
      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        dates.push({
          dahabiyaId: testDahabiya.id,
          date: date,
          price: 500.00,
          available: true
        });
      }

      const availabilityDates = await prisma.availabilityDate.createMany({
        data: dates,
        skipDuplicates: true
      });

      console.log(`✅ Created ${availabilityDates.count} availability dates`);
      console.log(`📅 Date range: ${today.toDateString()} to ${new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000).toDateString()}`);

    } else {
      console.log(`✅ Found ${existingCount} existing dahabiyat - no need to create test data`);
      
      // Check if any have availability dates
      const availabilityCount = await prisma.availabilityDate.count();
      console.log(`📅 Total availability dates: ${availabilityCount}`);
      
      if (availabilityCount === 0) {
        console.log('⚠️ No availability dates found - you may need to add some manually');
      }
    }

    // Show summary
    const finalDahabiyatCount = await prisma.dahabiya.count();
    const finalAvailabilityCount = await prisma.availabilityDate.count();
    
    console.log(`\n📊 Final Summary:`);
    console.log(`  - Dahabiyat: ${finalDahabiyatCount}`);
    console.log(`  - Availability dates: ${finalAvailabilityCount}`);
    
    console.log(`\n🚀 Next Steps:`);
    console.log(`  1. Go to: http://localhost:3000/admin/availability`);
    console.log(`  2. Select the dahabiya from dropdown`);
    console.log(`  3. Navigate through months to see/edit availability`);
    console.log(`  4. Click dates to toggle availability on/off`);

  } catch (error) {
    console.error('❌ Error adding test dahabiya:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addTestDahabiya();
