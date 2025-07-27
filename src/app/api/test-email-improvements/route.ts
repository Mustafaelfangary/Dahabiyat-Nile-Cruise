import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Test the improved email template
    await sendEmail({
      to: email,
      template: 'email-verification',
      data: {
        user: { name: 'Test User' },
        verificationCode: '123456'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully with improvements',
      improvements: [
        'Removed special characters from subject line',
        'Added plain text version',
        'Improved sender name format',
        'Added proper email headers',
        'Added unsubscribe header',
        'Added message ID for tracking'
      ]
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
