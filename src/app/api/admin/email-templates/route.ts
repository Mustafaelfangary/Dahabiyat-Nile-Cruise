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

    // Get email templates from database or return defaults
    // Return default templates since EmailTemplate model doesn't exist yet
    const templates: any[] = [];

    // If no templates in database, return default templates
    if (templates.length === 0) {
      const defaultTemplates = [
        {
          id: 'email-verification',
          name: 'Email Verification',
          subject: '🏺 Verify Your Royal Account - Dahabiyat Nile Cruise',
          content: getEmailVerificationTemplate(),
          type: 'user',
          enabled: true,
          variables: ['user.name', 'verificationCode', 'expiresAt'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'booking-confirmation',
          name: 'Booking Confirmation',
          subject: '🏺 Your Sacred Journey Awaits - Booking Confirmed',
          content: getBookingConfirmationTemplate(),
          type: 'customer',
          enabled: true,
          variables: ['user.name', 'booking.id', 'booking.startDate', 'booking.endDate', 'dahabiya.name'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'admin-booking-notification',
          name: 'Admin Booking Alert',
          subject: '🚨 New Booking Received - Cleopatra Dahabiyat',
          content: getAdminBookingTemplate(),
          type: 'admin',
          enabled: true,
          variables: ['user.name', 'booking.totalPrice', 'dahabiya.name', 'booking.startDate'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      return NextResponse.json({ templates: defaultTemplates });
    }

    return NextResponse.json({ templates });

  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
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
    const { id, name, subject, content, type, enabled, variables } = body;

    if (!name || !subject || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to settings table for now (since EmailTemplate model might not exist)
    const templateData = {
      name,
      subject,
      content,
      type,
      enabled: enabled ?? true,
      variables: variables || []
    };

    await prisma.setting.upsert({
      where: { key: `email_template_${id}` },
      update: {
        value: JSON.stringify(templateData),
        updatedAt: new Date()
      },
      create: {
        key: `email_template_${id}`,
        value: JSON.stringify(templateData),
        group: 'email'
      }
    });

    return NextResponse.json({ success: true, template: { id, ...templateData } });

  } catch (error) {
    console.error('Error saving email template:', error);
    return NextResponse.json(
      { error: 'Failed to save email template' },
      { status: 500 }
    );
  }
}

function getEmailVerificationTemplate() {
  return `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
      <!-- Header with Golden Gradient -->
      <div style="background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); padding: 40px 20px; text-align: center; position: relative;">
        <div style="font-size: 48px; margin-bottom: 10px;">𓇳</div>
        <h1 style="margin: 0; color: #1a1a2e; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">Royal Account Verification</h1>
        <p style="margin: 10px 0 0 0; color: #2c2c2c; font-size: 16px; font-style: italic;">Welcome to the Pharaonic Journey</p>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 40px 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 36px; margin-bottom: 15px;">👑</div>
          <p style="font-size: 20px; color: #d4af37; margin: 0;">Greetings, Noble {{user.name}}!</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 25px;">
          Your royal account has been created successfully. To complete your registration and unlock the treasures of the Nile, please verify your email address using the sacred code below:
        </p>
        
        <!-- Verification Code Box -->
        <div style="background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); border-radius: 10px; padding: 25px; text-align: center; margin: 30px 0; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);">
          <p style="margin: 0 0 10px 0; color: #1a1a2e; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
          <div style="font-size: 36px; font-weight: bold; color: #1a1a2e; letter-spacing: 8px; font-family: 'Courier New', monospace;">{{verificationCode}}</div>
          <p style="margin: 10px 0 0 0; color: #2c2c2c; font-size: 12px;">Valid for 15 minutes</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: rgba(0,0,0,0.3); padding: 25px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.3);">
        <p style="margin: 0 0 10px 0; font-size: 18px; color: #d4af37; font-weight: bold;">Cleopatra Dahabiyat</p>
        <p style="margin: 0; font-size: 12px; color: #888; line-height: 1.4;">
          Sail the eternal Nile in pharaonic luxury<br>
          Experience the magic of ancient Egypt
        </p>
        <div style="margin-top: 15px; font-size: 24px;">𓊪 𓇳 𓊪</div>
      </div>
    </div>
  `;
}

function getBookingConfirmationTemplate() {
  return `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); padding: 40px 20px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">𓇳</div>
        <h1 style="margin: 0; color: #1a1a2e; font-size: 32px; font-weight: bold;">Sacred Journey Confirmed</h1>
        <p style="margin: 10px 0 0 0; color: #2c2c2c; font-size: 16px;">Your Nile Adventure Begins</p>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 40px 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 36px; margin-bottom: 15px;">🚢</div>
          <p style="font-size: 20px; color: #d4af37; margin: 0;">Greetings, Noble {{user.name}}!</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 25px;">
          Your royal booking has been confirmed! Prepare for an unforgettable journey along the eternal Nile aboard the magnificent <strong style="color: #d4af37;">{{dahabiya.name}}</strong>.
        </p>
        
        <!-- Booking Details Card -->
        <div style="background: rgba(212, 175, 55, 0.1); border: 2px solid #d4af37; border-radius: 10px; padding: 25px; margin: 25px 0;">
          <h3 style="margin: 0 0 20px 0; color: #d4af37; font-size: 18px; text-align: center;">📜 Sacred Scroll of Details</h3>
          
          <div style="display: grid; gap: 15px;">
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(212, 175, 55, 0.3);">
              <span style="color: #b0b0b0;">Booking Reference:</span>
              <span style="color: #d4af37; font-weight: bold;">{{booking.id}}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(212, 175, 55, 0.3);">
              <span style="color: #b0b0b0;">Journey Begins:</span>
              <span style="color: #fff;">{{booking.startDate}}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(212, 175, 55, 0.3);">
              <span style="color: #b0b0b0;">Journey Ends:</span>
              <span style="color: #fff;">{{booking.endDate}}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: rgba(0,0,0,0.3); padding: 25px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.3);">
        <p style="margin: 0 0 10px 0; font-size: 18px; color: #d4af37; font-weight: bold;">Cleopatra Dahabiyat</p>
        <div style="margin-top: 15px; font-size: 24px;">𓊪 𓇳 𓊪</div>
      </div>
    </div>
  `;
}

function getAdminBookingTemplate() {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; overflow: hidden;">
      <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🚨 New Booking Alert</h1>
        <p style="margin: 5px 0 0 0;">Cleopatra Dahabiyat Admin Panel</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #333; margin-bottom: 20px;">New Booking Details</h2>
        
        <div style="background: white; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
          <p><strong>Customer:</strong> \${user.name}</p>
          <p><strong>Dahabiya:</strong> \${dahabiya.name}</p>
          <p><strong>Start Date:</strong> \${booking.startDate}</p>
          <p><strong>Total Price:</strong> $\${booking.totalPrice}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Please review this booking in the admin panel and take appropriate action.
        </p>
      </div>
    </div>
  `;
}
