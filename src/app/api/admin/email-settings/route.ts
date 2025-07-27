import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get admin emails from environment or database
    let adminEmails = ['info@dahabiyatnilecruise.com'];

    // Try to get from environment variables first
    if (process.env.ADMIN_BOOKING_EMAILS) {
      adminEmails = process.env.ADMIN_BOOKING_EMAILS.split(',').map(email => email.trim());
    }

    // Check if SMTP is configured
    const smtpConfigured = !!(
      process.env.EMAIL_SERVER_HOST &&
      process.env.EMAIL_SERVER_USER &&
      process.env.EMAIL_SERVER_PASSWORD
    );

    // Get email settings from database
    const emailSettings = await prisma.setting.findMany({
      where: {
        group: 'email'
      }
    });

    // Convert to settings object
    const settings = {
      adminEmails,
      customerNotifications: true,
      adminNotifications: true,
      emailEnabled: true,
      smtpConfigured,
      smtpHost: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
      smtpPort: process.env.EMAIL_SERVER_PORT || '587',
      smtpUser: process.env.EMAIL_SERVER_USER || '',
      smtpFrom: process.env.SMTP_FROM || ''
    };

    emailSettings.forEach(setting => {
      switch (setting.key) {
        case 'email_enabled':
          settings.emailEnabled = setting.value === 'true';
          break;
        case 'admin_email':
          settings.adminEmails = [setting.value];
          break;
        case 'customer_notifications':
          settings.customerNotifications = setting.value === 'true';
          break;
        case 'admin_notifications':
          settings.adminNotifications = setting.value === 'true';
          break;
        case 'smtp_host':
          settings.smtpHost = setting.value;
          break;
        case 'smtp_port':
          settings.smtpPort = setting.value;
          break;
        case 'smtp_user':
          settings.smtpUser = setting.value;
          break;
        case 'smtp_from':
          settings.smtpFrom = setting.value;
          break;
      }
    });

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Error fetching email settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      enabled,
      adminEmail,
      customerNotifications,
      adminNotifications,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpFrom
    } = body;

    // Save each setting
    const settingsToSave = [
      { key: 'email_enabled', value: enabled?.toString() || 'true' },
      { key: 'admin_email', value: adminEmail || '' },
      { key: 'customer_notifications', value: customerNotifications?.toString() || 'true' },
      { key: 'admin_notifications', value: adminNotifications?.toString() || 'true' },
      { key: 'smtp_host', value: smtpHost || 'smtp.gmail.com' },
      { key: 'smtp_port', value: smtpPort || '587' },
      { key: 'smtp_user', value: smtpUser || '' },
      { key: 'smtp_from', value: smtpFrom || '' }
    ];

    for (const setting of settingsToSave) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: {
          value: setting.value,
          updatedAt: new Date()
        },
        create: {
          key: setting.key,
          value: setting.value,
          group: 'email'
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error saving email settings:', error);
    return NextResponse.json(
      { error: 'Failed to save email settings' },
      { status: 500 }
    );
  }
}
