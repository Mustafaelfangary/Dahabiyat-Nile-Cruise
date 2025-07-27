import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { customerEmail, adminEmail } = body;

    if (!customerEmail || !adminEmail) {
      return NextResponse.json(
        { error: 'Customer email and admin email are required' },
        { status: 400 }
      );
    }

    const results = [];

    // Test data for booking
    const testBookingData = {
      id: 'TEST-BOOKING-' + Date.now(),
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      totalPrice: 2500,
      guests: 2,
      status: 'PENDING',
      specialRequests: 'Test booking for email verification',
      createdAt: new Date()
    };

    const testUserData = {
      name: 'Test Customer',
      email: customerEmail
    };

    const testDahabiyaData = {
      name: 'Princess Cleopatra',
      description: 'Luxury Nile cruise experience'
    };

    // Test customer confirmation email
    try {
      await sendEmail({
        to: customerEmail,
        subject: '🏺 Test Booking Confirmation - Dahabiyat Nile Cruise',
        template: 'booking-confirmation',
        data: {
          booking: testBookingData,
          user: testUserData,
          dahabiya: testDahabiyaData
        }
      });

      results.push({
        type: 'customer',
        email: customerEmail,
        status: 'success',
        message: 'Customer confirmation email sent successfully'
      });
    } catch (error) {
      console.error('Customer email error:', error);
      results.push({
        type: 'customer',
        email: customerEmail,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test admin notification email
    try {
      await sendEmail({
        to: adminEmail,
        subject: '🚨 Test New Booking Notification',
        template: 'admin-booking-notification',
        data: {
          booking: testBookingData,
          user: testUserData,
          dahabiya: testDahabiyaData
        }
      });

      results.push({
        type: 'admin',
        email: adminEmail,
        status: 'success',
        message: 'Admin notification email sent successfully'
      });
    } catch (error) {
      console.error('Admin email error:', error);
      results.push({
        type: 'admin',
        email: adminEmail,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    return NextResponse.json({
      success: errorCount === 0,
      message: `${successCount} emails sent successfully, ${errorCount} failed`,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: errorCount
      }
    });

  } catch (error) {
    console.error('Test booking email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test booking emails' },
      { status: 500 }
    );
  }
}
