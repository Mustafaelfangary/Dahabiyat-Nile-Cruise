import nodemailer from 'nodemailer';
import { passwordResetTemplate } from './email-templates/password-reset';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}

interface EmailUser {
  name: string;
  email: string;
}

interface EmailBooking {
  id: string;
  bookingReference?: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
}

interface EmailData {
  user: EmailUser;
  booking?: EmailBooking;
  name?: string;
  email?: string;
  message?: string;
  verificationCode?: string;
  resetUrl?: string;
  resetToken?: string;
  expiryTime?: string;
  supportEmail?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || process.env.SMTP_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER || process.env.SMTP_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD || process.env.SMTP_PASSWORD,
  },
});

const templates = {
  'email-verification': (data: EmailData) => ({
    subject: 'Verify Your Account - Dahabiyat Nile Cruise',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background: #2c5aa0; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Account Verification</h1>
          <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Dahabiyat Nile Cruise</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 18px; color: #333333; margin: 0 0 20px 0;">Hello ${data.user.name},</p>

          <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 25px;">
            Thank you for creating an account with Dahabiyat Nile Cruise. To complete your registration, please verify your email address using the verification code below:
          </p>

          <!-- Verification Code Box -->
          <div style="background: #f8f9fa; border: 2px solid #2c5aa0; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; color: #333333; font-size: 14px; font-weight: bold; text-transform: uppercase;">Verification Code</p>
            <div style="font-size: 32px; font-weight: bold; color: #2c5aa0; letter-spacing: 6px; font-family: 'Courier New', monospace;">${data.verificationCode}</div>
            <p style="margin: 10px 0 0 0; color: #666666; font-size: 12px;">Valid for 15 minutes</p>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #856404; font-weight: bold;">Important:</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #856404; line-height: 1.5;">
              This verification code will expire in 15 minutes. If you didn't create this account, please ignore this email.
            </p>
          </div>

          <div style="margin-top: 30px;">
            <p style="font-size: 14px; color: #666666; margin: 0 0 15px 0;">
              Once verified, you'll have access to:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #333333;">
              <li style="margin: 5px 0; font-size: 14px;">Book dahabiya cruises</li>
              <li style="margin: 5px 0; font-size: 14px;">Manage your reservations</li>
              <li style="margin: 5px 0; font-size: 14px;">Receive special offers</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 5px 0; font-size: 16px; color: #2c5aa0; font-weight: bold;">Dahabiyat Nile Cruise</p>
          <p style="margin: 0; font-size: 12px; color: #666666; line-height: 1.4;">
            Experience the beauty of the Nile River<br>
            Contact us: info@dahabiyatnilecruise.com
          </p>
        </div>
      </div>
    `,
  }),

  'booking-confirmation': (data: Record<string, unknown>) => ({
    subject: 'Booking Confirmed - Dahabiyat Nile Cruise',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background: #2c5aa0; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Booking Confirmed</h1>
          <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Dahabiyat Nile Cruise</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 18px; color: #333333; margin: 0 0 20px 0;">Hello ${data.user.name},</p>

          <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 25px;">
            Your booking has been confirmed! We're excited to welcome you aboard the <strong>${data.dahabiya?.name || 'Dahabiya'}</strong> for an unforgettable Nile cruise experience.
          </p>

          <!-- Booking Details Card -->
          <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 25px; margin: 25px 0;">
            <h3 style="margin: 0 0 20px 0; color: #2c5aa0; font-size: 18px; text-align: center;">Booking Details</h3>

            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 12px 0; color: #666666; font-weight: 500;">Booking Reference:</td>
                <td style="padding: 12px 0; color: #333333; font-weight: bold; text-align: right;">${data.booking.bookingReference || data.booking.id}</td>
              </tr>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 12px 0; color: #666666; font-weight: 500;">Vessel:</td>
                <td style="padding: 12px 0; color: #333333; text-align: right;">${data.dahabiya?.name || 'Luxury Dahabiya'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 12px 0; color: #666666; font-weight: 500;">Check-in:</td>
                <td style="padding: 12px 0; color: #333333; text-align: right;">${new Date(data.booking.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 12px 0; color: #666666; font-weight: 500;">Check-out:</td>
                <td style="padding: 12px 0; color: #333333; text-align: right;">${new Date(data.booking.endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 12px 0; color: #666666; font-weight: 500;">Guests:</td>
                <td style="padding: 12px 0; color: #333333; text-align: right;">${data.booking.guests} ${data.booking.guests === 1 ? 'Guest' : 'Guests'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #666666; font-weight: 500;">Total Price:</td>
                <td style="padding: 12px 0; color: #2c5aa0; font-weight: bold; font-size: 18px; text-align: right;">$${data.booking.totalPrice?.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          ${data.booking.specialRequests ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #856404; font-weight: bold;">Special Requests:</p>
            <p style="margin: 0; font-size: 14px; color: #856404;">${data.booking.specialRequests}</p>
          </div>
          ` : ''}

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <p style="margin: 0 0 15px 0; color: #2c5aa0; font-weight: bold; text-align: center;">What to Expect:</p>
            <ul style="margin: 0; padding-left: 20px; color: #333333;">
              <li style="margin: 8px 0; font-size: 14px;">Luxurious accommodations with Nile views</li>
              <li style="margin: 8px 0; font-size: 14px;">Gourmet Egyptian and international cuisine</li>
              <li style="margin: 8px 0; font-size: 14px;">Expert-guided temple and monument visits</li>
              <li style="margin: 8px 0; font-size: 14px;">Unforgettable sunrises and sunsets on the Nile</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 5px 0; font-size: 16px; color: #2c5aa0; font-weight: bold;">Dahabiyat Nile Cruise</p>
          <p style="margin: 0; font-size: 12px; color: #666666; line-height: 1.4;">
            For questions or changes, contact us at info@dahabiyatnilecruise.com<br>
            We look forward to welcoming you aboard!
          </p>
        </div>
      </div>
    `,
  }),
  'booking-modification': (data: Record<string, unknown>) => ({
    subject: 'Booking Modification Confirmation',
    html: `
      <h1>Booking Modification Confirmation</h1>
      <p>Dear ${data.user.name},</p>
      <p>Your booking has been modified. Here are your updated booking details:</p>
      <ul>
        <li>Booking ID: ${data.booking.id}</li>
        <li>Check-in: ${new Date(data.booking.startDate).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(data.booking.endDate).toLocaleDateString()}</li>
        <li>Guests: ${data.booking.guests}</li>
        <li>Total Price: $${data.booking.totalPrice}</li>
      </ul>
      <p>Thank you for choosing Dahabiyat Nile Cruise!</p>
    `,
  }),
  'booking-cancellation': (data: Record<string, unknown>) => ({
    subject: 'Booking Cancellation Confirmation',
    html: `
      <h1>Booking Cancellation Confirmation</h1>
      <p>Dear ${data.user.name},</p>
      <p>Your booking has been cancelled. Here are the details of the cancelled booking:</p>
      <ul>
        <li>Booking ID: ${data.booking.id}</li>
        <li>Check-in: ${new Date(data.booking.startDate).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(data.booking.endDate).toLocaleDateString()}</li>
        <li>Guests: ${data.booking.guests}</li>
        <li>Total Price: $${data.booking.totalPrice}</li>
      </ul>
      <p>We hope to welcome you back soon!</p>
    `,
  }),
  'welcome-email': (data: Record<string, unknown>) => ({
    subject: '𓇳 Welcome to the Royal Kingdom - Dahabiyat Nile Cruise 𓇳',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
        <!-- Pharaonic Border Pattern -->
        <div style="height: 8px; background: repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 20px, #b8941f 20px, #b8941f 40px);"></div>

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #d4af37 0%, #b8941f 50%, #d4af37 100%); padding: 40px 20px; text-align: center;">
          <div style="font-size: 24px; margin-bottom: 10px; letter-spacing: 10px;">𓇳 𓊪 𓈖 𓏏 𓇳</div>
          <div style="font-size: 48px; margin-bottom: 10px;">👑</div>
          <h1 style="margin: 0; color: #1a1a2e; font-size: 32px; font-weight: bold;">Welcome to the Royal Kingdom</h1>
          <p style="margin: 10px 0 0 0; color: #2c2c2c; font-size: 16px;">Your Sacred Journey Begins</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <p style="font-size: 20px; color: #d4af37; margin: 0;">Greetings, Noble ${data.user.name}!</p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 25px; text-align: justify;">
            Your royal account has been successfully verified! Welcome to the realm of Dahabiyat Nile Cruise, where ancient Egyptian luxury meets modern comfort. You are now part of our exclusive pharaonic family.
          </p>

          <div style="background: rgba(0, 128, 255, 0.1); border-left: 4px solid #d4af37; padding: 20px; margin: 25px 0; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #d4af37; font-weight: bold;">🏺 Your Royal Benefits:</p>
            <div style="margin-top: 15px;">
              <p style="margin: 5px 0; font-size: 14px; color: #e0e0e0;">🚢 Priority booking on all dahabiyas</p>
              <p style="margin: 5px 0; font-size: 14px; color: #e0e0e0;">👑 Exclusive royal packages and experiences</p>
              <p style="margin: 5px 0; font-size: 14px; color: #e0e0e0;">🏺 Personalized Nile journey recommendations</p>
              <p style="margin: 5px 0; font-size: 14px; color: #e0e0e0;">💎 Loyalty rewards and special offers</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: rgba(0,0,0,0.3); padding: 25px; text-align: center; border-top: 1px solid rgba(0, 128, 255, 0.3);">
          <p style="margin: 0 0 10px 0; font-size: 18px; color: #d4af37; font-weight: bold;">Dahabiyat Nile Cruise</p>
          <p style="margin: 0; font-size: 12px; color: #888; line-height: 1.4;">
            Sail the eternal Nile in pharaonic luxury<br>
            Experience the magic of ancient Egypt
          </p>
        </div>
      </div>
    `
  }),

  'package-booking-confirmation': (data: Record<string, unknown>) => ({
    subject: '𓇳 Your Sacred Package Journey Confirmed - Dahabiyat Nile Cruise 𓇳',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
        <!-- Pharaonic Border Pattern -->
        <div style="height: 8px; background: repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 20px, #b8941f 20px, #b8941f 40px);"></div>

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #d4af37 0%, #b8941f 50%, #d4af37 100%); padding: 40px 20px; text-align: center;">
          <div style="font-size: 24px; margin-bottom: 10px; letter-spacing: 10px;">𓇳 𓊪 𓈖 𓏏 𓇳</div>
          <div style="font-size: 48px; margin-bottom: 10px;">🏺</div>
          <h1 style="margin: 0; color: #1a1a2e; font-size: 32px; font-weight: bold;">Sacred Package Journey Confirmed</h1>
          <p style="margin: 10px 0 0 0; color: #2c2c2c; font-size: 16px;">Your Egyptian Adventure Awaits</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <p style="font-size: 20px; color: #d4af37; margin: 0;">Greetings, Noble ${data.user.name}!</p>
          <p style="font-size: 16px; line-height: 1.6;">Your package booking has been confirmed! Prepare for an unforgettable journey through ancient Egypt.</p>

          <div style="background: rgba(0, 128, 255, 0.1); border: 1px solid #d4af37; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #d4af37; margin-top: 0;">📦 Package Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 10px 0;"><strong>Package:</strong> ${data.package?.name || 'Journey Package'}</li>
              <li style="margin: 10px 0;"><strong>Booking ID:</strong> ${data.booking.bookingReference || data.booking.id}</li>
              <li style="margin: 10px 0;"><strong>Start Date:</strong> ${new Date(data.booking.startDate).toLocaleDateString()}</li>
              <li style="margin: 10px 0;"><strong>End Date:</strong> ${new Date(data.booking.endDate).toLocaleDateString()}</li>
              <li style="margin: 10px 0;"><strong>Guests:</strong> ${data.booking.guests}</li>
              <li style="margin: 10px 0;"><strong>Total Price:</strong> $${data.booking.totalPrice}</li>
              <li style="margin: 10px 0;"><strong>Status:</strong> ${data.booking.status}</li>
            </ul>
          </div>

          <p style="font-size: 16px; line-height: 1.6;">We will contact you soon with detailed itinerary and preparation instructions for your journey.</p>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #d4af37; font-size: 18px;">𓇳 Thank you for choosing Dahabiyat Nile Cruise! 𓇳</p>
          </div>
        </div>
      </div>
    `,
  }),
  'admin-booking-notification': (data: Record<string, unknown>) => ({
    subject: 'New Dahabiya Booking Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d4af37;">🚨 New Dahabiya Booking Alert</h1>
        <p>A new dahabiya booking has been received on your website.</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Customer Details</h3>
          <ul>
            <li><strong>Name:</strong> ${data.user.name}</li>
            <li><strong>Email:</strong> ${data.user.email}</li>
          </ul>

          <h3>Booking Details</h3>
          <ul>
            <li><strong>Dahabiya:</strong> ${data.dahabiya?.name || 'N/A'}</li>
            <li><strong>Booking ID:</strong> ${data.booking.id}</li>
            <li><strong>Check-in:</strong> ${new Date(data.booking.startDate).toLocaleDateString()}</li>
            <li><strong>Check-out:</strong> ${new Date(data.booking.endDate).toLocaleDateString()}</li>
            <li><strong>Guests:</strong> ${data.booking.guests}</li>
            <li><strong>Total Price:</strong> $${data.booking.totalPrice}</li>
            <li><strong>Status:</strong> ${data.booking.status}</li>
            <li><strong>Special Requests:</strong> ${data.booking.specialRequests || 'None'}</li>
          </ul>
        </div>

        <p><strong>Action Required:</strong> Please review and confirm this booking in your admin dashboard.</p>
      </div>
    `,
  }),
  'admin-package-booking-notification': (data: Record<string, unknown>) => ({
    subject: 'New Package Booking Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d4af37;">🚨 New Package Booking Alert</h1>
        <p>A new package booking has been received on your website.</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Customer Details</h3>
          <ul>
            <li><strong>Name:</strong> ${data.user.name}</li>
            <li><strong>Email:</strong> ${data.user.email}</li>
          </ul>

          <h3>Package Booking Details</h3>
          <ul>
            <li><strong>Package:</strong> ${data.package?.name || 'N/A'}</li>
            <li><strong>Booking ID:</strong> ${data.booking.bookingReference || data.booking.id}</li>
            <li><strong>Start Date:</strong> ${new Date(data.booking.startDate).toLocaleDateString()}</li>
            <li><strong>End Date:</strong> ${new Date(data.booking.endDate).toLocaleDateString()}</li>
            <li><strong>Guests:</strong> ${data.booking.guests}</li>
            <li><strong>Total Price:</strong> $${data.booking.totalPrice}</li>
            <li><strong>Status:</strong> ${data.booking.status}</li>
            <li><strong>Special Requests:</strong> ${data.booking.specialRequests || 'None'}</li>
          </ul>
        </div>

        <p><strong>Action Required:</strong> Please review and confirm this package booking in your admin dashboard.</p>
      </div>
    `,
  }),
  'contact': (data: Record<string, unknown>) => ({
    subject: 'New Contact Form Submission',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d4af37;">📧 New Contact Form Submission</h1>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Contact Details</h3>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Subject:</strong> ${data.subject}</li>
          </ul>

          <h3>Message</h3>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #d4af37;">
            ${data.message}
          </div>
        </div>

        <p><strong>Action Required:</strong> Please respond to this inquiry promptly.</p>
      </div>
    `,
  }),
  'password-reset': (data: Record<string, unknown>) => ({
    subject: passwordResetTemplate.subject,
    html: passwordResetTemplate.html(data)
  }),
};

export async function sendEmail({ to, subject, template, data }: EmailOptions) {
  const templateFn = templates[template as keyof typeof templates];
  if (!templateFn) {
    throw new Error(`Email template '${template}' not found`);
  }

  const { subject: templateSubject, html } = templateFn(data);

  // Create plain text version for better deliverability
  const plainText = createPlainTextVersion(template, data);

  await transporter.sendMail({
    from: `"Dahabiyat Nile Cruise" <${process.env.SMTP_FROM}>`,
    to,
    subject: subject || templateSubject,
    html,
    text: plainText,
    headers: {
      'X-Mailer': 'Dahabiyat Nile Cruise System v1.0',
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
      'Importance': 'Normal',
      'List-Unsubscribe': `<mailto:unsubscribe@dahabiyatnilecruise.com>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      'Return-Path': process.env.SMTP_FROM,
      'Reply-To': process.env.SMTP_FROM,
      'Organization': 'Dahabiyat Nile Cruise',
      'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
      'MIME-Version': '1.0',
      'Content-Type': 'multipart/alternative',
    },
    // Add message ID for better tracking and deliverability
    messageId: `${Date.now()}.${Math.random().toString(36).substr(2, 9)}@dahabiyatnilecruise.com`,
    // Add envelope settings for better deliverability
    envelope: {
      from: process.env.SMTP_FROM,
      to: to
    }
  });
}

// Helper function to create plain text versions
function createPlainTextVersion(template: string, data: Record<string, unknown>): string {
  switch (template) {
    case 'password-reset':
      return passwordResetTemplate.text(data);
    case 'email-verification':
      return `
Welcome to Dahabiyat Nile Cruise!

Hello ${data.user.name},

Your royal account has been created successfully. To complete your registration, please verify your email address using the verification code below:

Verification Code: ${data.verificationCode}

This code will expire in 15 minutes.

Once verified, you'll have access to:
- Exclusive dahabiya bookings
- Royal loyalty rewards
- Personalized Nile experiences

If you didn't create this account, please ignore this email.

Best regards,
Dahabiyat Nile Cruise Team
Sail the eternal Nile in pharaonic luxury
      `.trim();

    case 'booking-confirmation':
      return `
Booking Confirmation - Dahabiyat Nile Cruise

Hello ${data.user.name},

Your royal booking has been confirmed!

Booking Details:
- Booking Reference: ${data.booking.bookingReference || data.booking.id}
- Vessel: ${data.dahabiya?.name || 'Luxury Dahabiya'}
- Check-in: ${new Date(data.booking.startDate).toLocaleDateString()}
- Check-out: ${new Date(data.booking.endDate).toLocaleDateString()}
- Guests: ${data.booking.guests}
- Total Price: $${data.booking.totalPrice}

We look forward to welcoming you aboard!

Best regards,
Dahabiyat Nile Cruise Team
      `.trim();

    default:
      return 'Thank you for choosing Dahabiyat Nile Cruise!';
  }
}