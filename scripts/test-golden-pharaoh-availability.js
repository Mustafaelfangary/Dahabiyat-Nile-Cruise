// Test script to debug Golden Pharaoh availability issue
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testGoldenPharaohAvailability() {
  try {
    console.log('🏺 Testing Golden Pharaoh Availability...\n');

    // 1. Find Golden Pharaoh dahabiya
    console.log('1️⃣ Looking for Golden Pharaoh dahabiya...');
    const goldenPharaoh = await prisma.dahabiya.findFirst({
      where: {
        OR: [
          { name: { contains: 'Golden Pharaoh', mode: 'insensitive' } },
          { name: { contains: 'golden pharaoh', mode: 'insensitive' } },
          { slug: { contains: 'golden-pharaoh', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        capacity: true,
        pricePerDay: true,
        isActive: true
      }
    });

    if (!goldenPharaoh) {
      console.log('❌ Golden Pharaoh dahabiya not found!');
      console.log('Available dahabiyas:');
      const allDahabiyas = await prisma.dahabiya.findMany({
        select: { id: true, name: true, slug: true, isActive: true }
      });
      allDahabiyas.forEach(d => {
        console.log(`   - ${d.name} (${d.slug}) - Active: ${d.isActive}`);
      });
      return;
    }

    console.log(`✅ Found: ${goldenPharaoh.name}`);
    console.log(`   ID: ${goldenPharaoh.id}`);
    console.log(`   Slug: ${goldenPharaoh.slug}`);
    console.log(`   Capacity: ${goldenPharaoh.capacity} guests`);
    console.log(`   Price: $${goldenPharaoh.pricePerDay}/day`);
    console.log(`   Active: ${goldenPharaoh.isActive}`);

    // 2. Check availability dates
    console.log('\n2️⃣ Checking availability dates...');
    const availabilityDates = await prisma.availabilityDate.findMany({
      where: { dahabiyaId: goldenPharaoh.id },
      orderBy: { date: 'asc' }
    });

    console.log(`📅 Found ${availabilityDates.length} availability date records`);
    
    if (availabilityDates.length > 0) {
      console.log('Available dates:');
      availabilityDates.forEach(date => {
        const status = date.available ? '✅ Available' : '❌ Unavailable';
        console.log(`   ${date.date.toISOString().split('T')[0]} - ${status} (Price: $${date.price || 'default'})`);
      });

      // Find available dates
      const availableDates = availabilityDates.filter(d => d.available);
      console.log(`\n🟢 ${availableDates.length} available dates found`);
      
      if (availableDates.length > 0) {
        const firstAvailable = availableDates[0].date;
        const secondAvailable = availableDates.length > 1 ? availableDates[1].date : new Date(firstAvailable.getTime() + 24 * 60 * 60 * 1000);
        
        console.log(`\n3️⃣ Testing availability check for ${firstAvailable.toISOString().split('T')[0]} to ${secondAvailable.toISOString().split('T')[0]}...`);
        
        // Test the availability service
        const { CleanAvailabilityService } = require('../src/lib/services/availability-service.ts');
        
        const result = await CleanAvailabilityService.checkAvailability({
          type: 'DAHABIYA',
          itemId: goldenPharaoh.id,
          startDate: firstAvailable,
          endDate: secondAvailable,
          guests: 2
        });

        console.log('🔍 Availability check result:');
        console.log(`   Available: ${result.isAvailable}`);
        console.log(`   Message: ${result.message}`);
        console.log(`   Total Price: $${result.totalPrice}`);
        
        if (result.conflictingBookings) {
          console.log(`   Conflicting bookings: ${result.conflictingBookings.length}`);
        }
      }
    } else {
      console.log('⚠️ No availability dates set for this dahabiya');
      console.log('This means the dahabiya should be available by default (unless there are conflicting bookings)');
    }

    // 3. Check existing bookings
    console.log('\n4️⃣ Checking existing bookings...');
    const existingBookings = await prisma.booking.findMany({
      where: { 
        dahabiyaId: goldenPharaoh.id,
        status: { in: ['PENDING', 'CONFIRMED'] }
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        guests: true,
        bookingReference: true
      }
    });

    console.log(`📋 Found ${existingBookings.length} existing bookings`);
    existingBookings.forEach(booking => {
      console.log(`   ${booking.bookingReference}: ${booking.startDate.toISOString().split('T')[0]} to ${booking.endDate.toISOString().split('T')[0]} (${booking.guests} guests, ${booking.status})`);
    });

  } catch (error) {
    console.error('❌ Error testing availability:', error);
    console.error('Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testGoldenPharaohAvailability();
