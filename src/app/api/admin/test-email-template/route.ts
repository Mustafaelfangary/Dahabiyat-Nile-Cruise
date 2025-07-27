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
    const { templateId, testEmail } = body;

    if (!templateId || !testEmail) {
      return NextResponse.json(
        { error: 'Template ID and test email are required' },
        { status: 400 }
      );
    }

    // Generate test data based on template type
    const testData = generateTestData(templateId);

    try {
      await sendEmail({
        to: testEmail,
        subject: `[TEST] ${getTemplateSubject(templateId)}`,
        template: templateId,
        data: testData
      });

      return NextResponse.json({
        success: true,
        message: `Test email sent to ${testEmail}`
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send test email. Please check your SMTP settings.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}

function generateTestData(templateId: string) {
  const baseData = {
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
  };

  switch (templateId) {
    case 'email-verification':
      return {
        ...baseData,
        verificationCode: '123456',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      };

    case 'booking-confirmation':
      return {
        ...baseData,
        booking: {
          id: 'BK-2024-001',
          bookingReference: 'CLO-2024-001',
          startDate: new Date('2024-03-15'),
          endDate: new Date('2024-03-22'),
          guests: 2,
          totalPrice: 2500,
          specialRequests: 'Vegetarian meals, early check-in'
        },
        dahabiya: {
          name: 'Royal Cleopatra'
        }
      };

    case 'admin-booking-notification':
      return {
        ...baseData,
        booking: {
          id: 'BK-2024-001',
          startDate: new Date('2024-03-15'),
          totalPrice: 2500
        },
        dahabiya: {
          name: 'Royal Cleopatra'
        }
      };

    default:
      return baseData;
  }
}

function getTemplateSubject(templateId: string) {
  switch (templateId) {
    case 'email-verification':
      return '🏺 Verify Your Royal Account - Cleopatra Dahabiyat';
    case 'booking-confirmation':
      return '🏺 Your Sacred Journey Awaits - Booking Confirmed';
    case 'admin-booking-notification':
      return '🚨 New Booking Received - Cleopatra Dahabiyat';
    default:
      return 'Test Email Template';
  }
}
