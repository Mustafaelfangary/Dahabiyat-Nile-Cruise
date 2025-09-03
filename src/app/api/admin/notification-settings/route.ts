import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get notification settings from database
    const notificationSettings = await prisma.setting.findMany({
      where: {
        group: 'notifications',
        key: { not: { startsWith: 'rule_' } }
      }
    });

    // Convert to settings object
    const settings = {
      enabledForUsers: true,
      enabledForAdmins: true,
      retentionDays: 30,
      maxNotificationsPerUser: 100,
      emailIntegration: true,
      smsIntegration: false,
      pushNotifications: true
    };

    notificationSettings.forEach(setting => {
      switch (setting.key) {
        case 'notifications_enabled_users':
          settings.enabledForUsers = setting.value === 'true';
          break;
        case 'notifications_enabled_admins':
          settings.enabledForAdmins = setting.value === 'true';
          break;
        case 'notifications_retention_days':
          settings.retentionDays = parseInt(setting.value) || 30;
          break;
        case 'notifications_max_per_user':
          settings.maxNotificationsPerUser = parseInt(setting.value) || 100;
          break;
        case 'notifications_email_integration':
          settings.emailIntegration = setting.value === 'true';
          break;
        case 'notifications_sms_integration':
          settings.smsIntegration = setting.value === 'true';
          break;
        case 'notifications_push_enabled':
          settings.pushNotifications = setting.value === 'true';
          break;
      }
    });

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' },
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
      enabledForUsers,
      enabledForAdmins,
      retentionDays,
      maxNotificationsPerUser,
      emailIntegration,
      smsIntegration,
      pushNotifications
    } = body;

    // Save each setting
    const settingsToSave = [
      { key: 'notifications_enabled_users', value: enabledForUsers?.toString() || 'true' },
      { key: 'notifications_enabled_admins', value: enabledForAdmins?.toString() || 'true' },
      { key: 'notifications_retention_days', value: retentionDays?.toString() || '30' },
      { key: 'notifications_max_per_user', value: maxNotificationsPerUser?.toString() || '100' },
      { key: 'notifications_email_integration', value: emailIntegration?.toString() || 'true' },
      { key: 'notifications_sms_integration', value: smsIntegration?.toString() || 'false' },
      { key: 'notifications_push_enabled', value: pushNotifications?.toString() || 'true' }
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
          group: 'notifications'
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error saving notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to save notification settings' },
      { status: 500 }
    );
  }
}
