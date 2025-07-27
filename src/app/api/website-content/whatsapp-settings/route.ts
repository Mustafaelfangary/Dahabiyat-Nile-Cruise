import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get WhatsApp settings from the settings table
    const whatsappSettings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            'whatsapp_enabled',
            'whatsapp_phone',
            'whatsapp_message',
            'whatsapp_position',
            'whatsapp_delay',
            'whatsapp_business_hours',
            'whatsapp_offline_message'
          ]
        }
      }
    });

    // Convert to the expected format
    const fields = whatsappSettings.map(setting => ({
      key: setting.key,
      value: setting.value,
      group: setting.group
    }));

    // If no settings found, create default ones
    if (fields.length === 0) {
      const defaultSettings = [
        { key: 'whatsapp_enabled', value: 'true', group: 'whatsapp' },
        { key: 'whatsapp_phone', value: '+201234567890', group: 'whatsapp' },
        { key: 'whatsapp_message', value: 'Hello! I\'m interested in your luxury Nile cruise packages. Could you please provide more information?', group: 'whatsapp' },
        { key: 'whatsapp_position', value: 'bottom-right', group: 'whatsapp' },
        { key: 'whatsapp_delay', value: '1', group: 'whatsapp' },
        { key: 'whatsapp_business_hours', value: 'We typically respond within 1-2 hours during business hours (9 AM - 6 PM GMT+2).', group: 'whatsapp' },
        { key: 'whatsapp_offline_message', value: 'Thank you for your interest! We\'ll respond to your message as soon as possible during business hours.', group: 'whatsapp' }
      ];

      // Create default settings in database
      for (const setting of defaultSettings) {
        await prisma.setting.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            group: setting.group
          },
          create: {
            key: setting.key,
            value: setting.value,
            group: setting.group
          }
        });
      }

      return NextResponse.json({
        section: 'whatsapp-settings',
        fields: defaultSettings
      });
    }

    return NextResponse.json({
      section: 'whatsapp-settings',
      fields
    });

  } catch (error) {
    console.error('Error fetching WhatsApp settings:', error);
    
    // Return default settings on error
    const defaultFields = [
      { key: 'whatsapp_enabled', value: 'true', group: 'whatsapp' },
      { key: 'whatsapp_phone', value: '+201234567890', group: 'whatsapp' },
      { key: 'whatsapp_message', value: 'Hello! I\'m interested in your luxury Nile cruise packages. Could you please provide more information?', group: 'whatsapp' },
      { key: 'whatsapp_position', value: 'bottom-right', group: 'whatsapp' },
      { key: 'whatsapp_delay', value: '1', group: 'whatsapp' },
      { key: 'whatsapp_business_hours', value: 'We typically respond within 1-2 hours during business hours (9 AM - 6 PM GMT+2).', group: 'whatsapp' },
      { key: 'whatsapp_offline_message', value: 'Thank you for your interest! We\'ll respond to your message as soon as possible during business hours.', group: 'whatsapp' }
    ];

    return NextResponse.json({
      section: 'whatsapp-settings',
      fields: defaultFields
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    // Update the WhatsApp setting
    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value: value || '',
        group: 'whatsapp'
      },
      create: {
        key,
        value: value || '',
        group: 'whatsapp'
      }
    });

    return NextResponse.json({
      success: true,
      setting
    });

  } catch (error) {
    console.error('Error updating WhatsApp setting:', error);
    return NextResponse.json(
      { error: 'Failed to update WhatsApp setting' },
      { status: 500 }
    );
  }
}
