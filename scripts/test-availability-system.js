/**
 * Test Availability System Fix
 * This script tests the availability checking logic to ensure it works correctly
 * Updated to fix date comparison issues
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAvailabilitySystem() {
  try {
    console.log('🧪 Testing Availability System...\n');

    // Get a test dahabiya
    const dahabiya = await prisma.dahabiya.findFirst({
      where: { isActive: true }
    });

    if (!dahabiya) {
      console.log('❌ No active dahabiya found. Please create one first.');
      return;
    }

    console.log(`✅ Testing with dahabiya: ${dahabiya.name} (ID: ${dahabiya.id})`);

    // Test dates - next week
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3);

    console.log(`📅 Test dates: ${startDate.toDateString()} to ${endDate.toDateString()}`);

    // Check if availability dates exist for these dates
    const existingAvailability = await prisma.availabilityDate.findMany({
      where: {
        dahabiyaId: dahabiya.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    console.log(`📊 Found ${existingAvailability.length} existing availability records`);

    // Create availability dates if they don't exist
    if (existingAvailability.length === 0) {
      console.log('🔧 Creating test availability dates...');
      
      const dates = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        dates.push({
          dahabiyaId: dahabiya.id,
          date: new Date(currentDate),
          price: Number(dahabiya.pricePerDay) || 500,
          available: true
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      await prisma.availabilityDate.createMany({
        data: dates,
        skipDuplicates: true
      });

      console.log(`✅ Created ${dates.length} availability dates`);
    }

    // Test the availability logic manually
    console.log('\n🔍 Testing availability logic manually...');
    
    // Get availability dates
    const availabilityDates = await prisma.availabilityDate.findMany({
      where: {
        dahabiyaId: dahabiya.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    console.log('📅 Availability dates found:');
    availabilityDates.forEach(ad => {
      const dateStr = new Date(ad.date.getTime() + ad.date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      console.log(`  ${dateStr}: ${ad.available ? 'Available' : 'Blocked'}`);
    });

    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        dahabiyaId: dahabiya.id,
        AND: [
          { startDate: { lt: endDate } },
          { endDate: { gt: startDate } },
          { status: { in: ['CONFIRMED', 'PENDING'] } }
        ]
      }
    });

    console.log(`\n📋 Conflicting bookings: ${conflictingBookings.length}`);
    if (conflictingBookings.length > 0) {
      conflictingBookings.forEach(booking => {
        console.log(`  ${booking.startDate.toDateString()} to ${booking.endDate.toDateString()} (${booking.status})`);
      });
    }

    // Generate date range for checking
    const dateRange = [];
    const currentDate = new Date(startDate.getTime());
    const endDateTime = new Date(endDate.getTime());
    
    while (currentDate < endDateTime) {
      dateRange.push(new Date(currentDate.getTime()).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`\n📅 Date range to check: ${dateRange.join(', ')}`);

    // Check each date
    const unavailableDates = [];
    for (const dateStr of dateRange) {
      const availabilityDate = availabilityDates.find(ad => {
        const adDateStr = new Date(ad.date.getTime() + ad.date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        return adDateStr === dateStr;
      });

      if (!availabilityDate) {
        console.log(`❌ No availability data for date: ${dateStr}`);
        unavailableDates.push(dateStr);
      } else if (!availabilityDate.available) {
        console.log(`❌ Date marked as blocked: ${dateStr}`);
        unavailableDates.push(dateStr);
      } else {
        console.log(`✅ Date available: ${dateStr}`);
      }
    }

    const isAvailable = unavailableDates.length === 0 && conflictingBookings.length === 0;

    console.log(`\n🎯 Final Result: ${isAvailable ? '✅ AVAILABLE' : '❌ NOT AVAILABLE'}`);
    
    if (!isAvailable) {
      console.log(`   Unavailable dates: ${unavailableDates.join(', ')}`);
      console.log(`   Conflicting bookings: ${conflictingBookings.length}`);
    }

    // Test API endpoint
    console.log('\n🌐 Testing API endpoint...');
    
    const testData = {
      dahabiyaId: dahabiya.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      guests: 2
    };

    console.log('Test data:', testData);
    console.log('You can test this by making a POST request to /api/availability with this data');

  } catch (error) {
    console.error('❌ Error testing availability system:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testAvailabilitySystem();
