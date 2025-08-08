#!/usr/bin/env node

/**
 * Test script to verify the booking fix
 * This script tests the booking creation with the new GuestDetail schema
 */

const { PrismaClient } = require('@prisma/client');

async function testBookingFix() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing Booking Fix...\n');

    // 1. Find a test user
    let testUser = await prisma.user.findFirst({
      where: { email: { contains: 'test' } }
    });

    if (!testUser) {
      console.log('Creating test user...');
      testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test-booking-fix@example.com',
          role: 'USER'
        }
      });
    }

    // 2. Find a test dahabiya
    let testDahabiya = await prisma.dahabiya.findFirst({
      where: { isActive: true }
    });

    if (!testDahabiya) {
      console.log('Creating test dahabiya...');
      testDahabiya = await prisma.dahabiya.create({
        data: {
          name: 'Test Dahabiya for Booking Fix',
          slug: 'test-dahabiya-booking-fix',
          description: 'Test dahabiya for booking fix validation',
          pricePerDay: 500,
          capacity: 10,
          isActive: true,
          category: 'DELUXE'
        }
      });
    }

    console.log(`✅ Using test user: ${testUser.name} (${testUser.email})`);
    console.log(`✅ Using test dahabiya: ${testDahabiya.name}\n`);

    // 3. Test booking creation with new schema
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // 7 days from now
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3); // 3-day trip

    console.log('🔄 Creating test booking...');
    
    const booking = await prisma.booking.create({
      data: {
        userId: testUser.id,
        type: 'DAHABIYA',
        dahabiyaId: testDahabiya.id,
        startDate,
        endDate,
        guests: 2,
        totalPrice: 1500,
        specialRequests: 'Test booking - please ignore',
        status: 'PENDING',
        bookingReference: 'TEST-' + Date.now(),
        guestDetails: {
          create: [
            {
              firstName: 'John',
              lastName: 'Doe',
              dateOfBirth: new Date('1990-01-01'),
              nationality: 'American',
              passport: 'US123456789',
              dietaryRequirements: ['Vegetarian']
            },
            {
              firstName: 'Jane',
              lastName: 'Doe',
              dateOfBirth: new Date('1992-05-15'),
              nationality: 'American',
              passport: 'US987654321',
              dietaryRequirements: []
            }
          ]
        }
      },
      include: {
        guestDetails: true,
        dahabiya: {
          select: {
            name: true,
            pricePerDay: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    console.log('✅ Booking created successfully!');
    console.log(`   Booking ID: ${booking.id}`);
    console.log(`   Reference: ${booking.bookingReference}`);
    console.log(`   Guest Details Count: ${booking.guestDetails.length}`);
    console.log(`   Guest 1: ${booking.guestDetails[0].firstName} ${booking.guestDetails[0].lastName}`);
    console.log(`   Guest 2: ${booking.guestDetails[1].firstName} ${booking.guestDetails[1].lastName}`);

    // 4. Clean up - delete the test booking
    console.log('\n🧹 Cleaning up test data...');
    await prisma.booking.delete({
      where: { id: booking.id }
    });

    console.log('✅ Test booking deleted successfully');
    console.log('\n🎉 All tests passed! The booking fix is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\nError details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testBookingFix();
