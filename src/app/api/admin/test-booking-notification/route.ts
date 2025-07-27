import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { adminEmail, testType = 'dahabiya' } = body;

    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Admin email address is required' },
        { status: 400 }
      );
    }

    // Test booking data for dahabiya
    const testDahabiyaBookingData = {
      booking: {
        id: 'test-booking-' + Date.now(),
        bookingReference: 'TEST-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-20'),
        guests: 2,
        totalPrice: 2500,
        status: 'PENDING',
        specialRequests: 'Vegetarian meals, early check-in requested'
      },
      user: {
        name: 'Test Customer',
        email: 'customer@example.com'
      },
      dahabiya: {
        name: 'Royal Cleopatra Dahabiya',
        type: 'PREMIUM',
        pricePerDay: 500
      }
    };

    // Test booking data for package
    const testPackageBookingData = {
      booking: {
        id: 'test-package-booking-' + Date.now(),
        bookingReference: 'PKG-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        startDate: new Date('2024-04-10'),
        endDate: new Date('2024-04-17'),
        guests: 4,
        totalPrice: 3500,
        status: 'PENDING',
        specialRequests: 'Anniversary celebration, special dinner requested'
      },
      user: {
        name: 'Test Package Customer',
        email: 'package-customer@example.com'
      },
      package: {
        name: 'Luxury Nile Discovery Package',
        description: '7-day luxury package with dahabiya cruise and cultural experiences',
        price: 3500
      }
    };

    if (testType === 'dahabiya') {
      // Send test dahabiya booking notification
      await sendEmail({
        to: adminEmail,
        subject: '🧪 TEST: New Dahabiya Booking Received',
        template: 'admin-booking-notification',
        data: testDahabiyaBookingData
      });
    } else if (testType === 'package') {
      // Send test package booking notification
      await sendEmail({
        to: adminEmail,
        subject: '🧪 TEST: New Package Booking Received',
        template: 'admin-package-booking-notification',
        data: testPackageBookingData
      });
    } else {
      // Send both types
      await sendEmail({
        to: adminEmail,
        subject: '🧪 TEST: New Dahabiya Booking Received',
        template: 'admin-booking-notification',
        data: testDahabiyaBookingData
      });

      await sendEmail({
        to: adminEmail,
        subject: '🧪 TEST: New Package Booking Received',
        template: 'admin-package-booking-notification',
        data: testPackageBookingData
      });
    }

    return NextResponse.json({
      success: true,
      message: `Test booking notification(s) sent successfully to ${adminEmail}`,
      testType,
      sentTo: adminEmail
    });

  } catch (error) {
    console.error('Test booking notification error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test booking notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
