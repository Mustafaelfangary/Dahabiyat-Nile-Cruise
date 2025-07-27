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

    // Get notification rules from settings
    const rulesSettings = await prisma.setting.findMany({
      where: {
        group: 'notifications',
        key: { startsWith: 'rule_' }
      }
    });

    const rules = rulesSettings.map(setting => {
      try {
        return JSON.parse(setting.value);
      } catch {
        return null;
      }
    }).filter(Boolean);

    // If no rules exist, return default rules
    if (rules.length === 0) {
      const defaultRules = [
        {
          id: 'booking-created',
          name: 'New Booking Created',
          trigger: 'BOOKING_CREATED',
          enabled: true,
          recipients: ['admins'],
          template: 'admin-booking-notification',
          conditions: {},
          priority: 'high'
        },
        {
          id: 'booking-confirmed',
          name: 'Booking Confirmed',
          trigger: 'BOOKING_STATUS_CHANGED',
          enabled: true,
          recipients: ['customer', 'admins'],
          template: 'booking-confirmation',
          conditions: { status: 'CONFIRMED' },
          priority: 'medium'
        },
        {
          id: 'payment-received',
          name: 'Payment Received',
          trigger: 'PAYMENT_RECEIVED',
          enabled: true,
          recipients: ['customer', 'admins'],
          template: 'payment-confirmation',
          conditions: {},
          priority: 'medium'
        },
        {
          id: 'email-verification',
          name: 'Email Verification Required',
          trigger: 'USER_SIGNUP',
          enabled: true,
          recipients: ['customer'],
          template: 'email-verification',
          conditions: {},
          priority: 'high'
        }
      ];

      return NextResponse.json({ rules: defaultRules });
    }

    return NextResponse.json({ rules });

  } catch (error) {
    console.error('Error fetching notification rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification rules' },
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
    const { id, name, trigger, enabled, recipients, template, conditions, priority } = body;

    if (!name || !trigger) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const rule = {
      id: id || `rule-${Date.now()}`,
      name,
      trigger,
      enabled: enabled ?? true,
      recipients: recipients || [],
      template: template || '',
      conditions: conditions || {},
      priority: priority || 'medium'
    };

    // Save rule to settings
    await prisma.setting.upsert({
      where: { key: `rule_${rule.id}` },
      update: {
        value: JSON.stringify(rule),
        updatedAt: new Date()
      },
      create: {
        key: `rule_${rule.id}`,
        value: JSON.stringify(rule),
        group: 'notifications'
      }
    });

    return NextResponse.json({ success: true, rule });

  } catch (error) {
    console.error('Error saving notification rule:', error);
    return NextResponse.json(
      { error: 'Failed to save notification rule' },
      { status: 500 }
    );
  }
}
