import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check email-related environment variables
    const emailEnvVars = {
      EMAIL_SERVER_HOST: !!process.env.EMAIL_SERVER_HOST,
      EMAIL_SERVER_PORT: !!process.env.EMAIL_SERVER_PORT,
      EMAIL_SERVER_USER: !!process.env.EMAIL_SERVER_USER,
      EMAIL_SERVER_PASSWORD: !!process.env.EMAIL_SERVER_PASSWORD,
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
      SMTP_FROM: !!process.env.SMTP_FROM,
      SMTP_SECURE: !!process.env.SMTP_SECURE,
      ADMIN_BOOKING_EMAILS: !!process.env.ADMIN_BOOKING_EMAILS,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL
    };

    // Get actual values (masked for security)
    const emailEnvValues = {
      EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST || 'Not set',
      EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT || 'Not set',
      EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER ? '***configured***' : 'Not set',
      EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD ? '***configured***' : 'Not set',
      SMTP_HOST: process.env.SMTP_HOST || 'Not set',
      SMTP_PORT: process.env.SMTP_PORT || 'Not set',
      SMTP_USER: process.env.SMTP_USER ? '***configured***' : 'Not set',
      SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '***configured***' : 'Not set',
      SMTP_FROM: process.env.SMTP_FROM || 'Not set',
      SMTP_SECURE: process.env.SMTP_SECURE || 'Not set',
      ADMIN_BOOKING_EMAILS: process.env.ADMIN_BOOKING_EMAILS || 'Not set',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'Not set'
    };

    // Check if basic SMTP is configured
    const basicSmtpConfigured = !!(
      (process.env.EMAIL_SERVER_HOST || process.env.SMTP_HOST) &&
      (process.env.EMAIL_SERVER_USER || process.env.SMTP_USER) &&
      (process.env.EMAIL_SERVER_PASSWORD || process.env.SMTP_PASSWORD)
    );

    // Check if FROM address is configured
    const fromConfigured = !!process.env.SMTP_FROM;

    // Check if admin emails are configured
    const adminEmailsConfigured = !!(process.env.ADMIN_BOOKING_EMAILS || process.env.ADMIN_EMAIL);

    return NextResponse.json({
      configured: emailEnvVars,
      values: emailEnvValues,
      summary: {
        basicSmtpConfigured,
        fromConfigured,
        adminEmailsConfigured,
        overallConfigured: basicSmtpConfigured && fromConfigured
      },
      recommendations: {
        ...((!process.env.EMAIL_SERVER_HOST && !process.env.SMTP_HOST) && {
          host: 'Set EMAIL_SERVER_HOST or SMTP_HOST (e.g., smtp.gmail.com)'
        }),
        ...((!process.env.EMAIL_SERVER_USER && !process.env.SMTP_USER) && {
          user: 'Set EMAIL_SERVER_USER or SMTP_USER (your email address)'
        }),
        ...((!process.env.EMAIL_SERVER_PASSWORD && !process.env.SMTP_PASSWORD) && {
          password: 'Set EMAIL_SERVER_PASSWORD or SMTP_PASSWORD (app password for Gmail)'
        }),
        ...(!process.env.SMTP_FROM && {
          from: 'Set SMTP_FROM (sender email address)'
        }),
        ...(!process.env.ADMIN_BOOKING_EMAILS && !process.env.ADMIN_EMAIL && {
          adminEmails: 'Set ADMIN_BOOKING_EMAILS or ADMIN_EMAIL (comma-separated admin emails)'
        })
      }
    });

  } catch (error) {
    console.error('Error checking environment variables:', error);
    return NextResponse.json(
      { error: 'Failed to check environment variables' },
      { status: 500 }
    );
  }
}
