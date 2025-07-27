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
    const { emails, testType = 'configuration' } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Email addresses are required' },
        { status: 400 }
      );
    }

    const results = [];
    const timestamp = new Date().toLocaleString();

    for (const email of emails) {
      try {
        let subject, template, data;

        switch (testType) {
          case 'configuration':
            subject = '🏺 SMTP Configuration Test - Cleopatra Dahabiyat';
            template = 'test-email';
            data = {
              adminName: session.user.name || 'Admin',
              testType: 'SMTP Configuration',
              timestamp,
              message: 'This is a test email to verify your SMTP configuration is working correctly.'
            };
            break;

          case 'booking':
            subject = '🚨 Test Booking Notification - Cleopatra Dahabiyat';
            template = 'admin-booking-notification';
            data = {
              booking: {
                id: 'TEST-' + Date.now(),
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                guests: 2,
                totalPrice: 2500,
                specialRequests: 'This is a test booking notification',
                status: 'PENDING'
              },
              user: {
                name: 'Test Customer',
                email: 'test@example.com',
                phoneNumber: '+1234567890'
              },
              dahabiya: {
                name: 'Test Dahabiya',
                capacity: 12
              }
            };
            break;

          case 'verification':
            subject = '𓇳 Test Email Verification - Cleopatra Dahabiyat';
            template = 'email-verification';
            data = {
              user: {
                name: session.user.name || 'Admin',
                email: email
              },
              verificationCode: '123456',
              expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            };
            break;

          default:
            throw new Error('Invalid test type');
        }

        await sendEmail({
          to: email,
          subject,
          template,
          data
        });

        results.push({
          email,
          status: 'success',
          message: 'Test email sent successfully'
        });

      } catch (emailError) {
        console.error(`Failed to send test email to ${email}:`, emailError);
        results.push({
          email,
          status: 'error',
          message: emailError instanceof Error ? emailError.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    return NextResponse.json({
      success: errorCount === 0,
      message: `Test completed: ${successCount} successful, ${errorCount} failed`,
      results,
      summary: {
        total: emails.length,
        successful: successCount,
        failed: errorCount
      }
    });

  } catch (error) {
    console.error('Error sending test emails:', error);
    return NextResponse.json(
      { error: 'Failed to send test emails' },
      { status: 500 }
    );
  }
}
