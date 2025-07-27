import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Try to get privacy content from settings
    const privacySetting = await prisma.setting.findFirst({
      where: {
        group: 'legal',
        key: 'privacy_policy'
      }
    });

    if (privacySetting) {
      return NextResponse.json({
        title: 'Privacy Policy',
        content: privacySetting.value,
        lastUpdated: privacySetting.updatedAt
      });
    }

    // Fallback content if not found in settings
    const defaultContent = `
      <h2>1. Information We Collect</h2>
      <p>1.1. Personal Information: We collect information that you provide directly to us, including your name, email address, phone number, and payment information.</p>
      <p>1.2. Booking Information: Details about your cruise preferences, special requirements, and travel plans.</p>
      <p>1.3. Website Usage: Information about how you interact with our website, including IP address, browser type, and pages visited.</p>

      <h2>2. How We Use Your Information</h2>
      <p>2.1. To process your bookings and payments.</p>
      <p>2.2. To communicate with you about your bookings and provide customer support.</p>
      <p>2.3. To send you marketing communications (with your consent).</p>
      <p>2.4. To improve our website and services.</p>

      <h2>3. Information Sharing</h2>
      <p>3.1. We do not sell your personal information to third parties.</p>
      <p>3.2. We may share your information with:</p>
      <ul>
        <li>Service providers who assist in operating our website and conducting our business</li>
        <li>Legal authorities when required by law</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>4.1. We implement appropriate security measures to protect your personal information.</p>
      <p>4.2. We use secure servers and encryption for sensitive data.</p>

      <h2>5. Your Rights</h2>
      <p>5.1. You have the right to access, correct, or delete your personal information.</p>
      <p>5.2. You can opt-out of marketing communications at any time.</p>
      <p>5.3. You can request a copy of your personal data.</p>

      <h2>6. Cookies</h2>
      <p>6.1. We use cookies to improve your browsing experience and analyze website traffic.</p>
      <p>6.2. You can control cookie settings through your browser preferences.</p>

      <h2>7. Changes to This Policy</h2>
      <p>7.1. We may update this privacy policy from time to time.</p>
      <p>7.2. We will notify you of any significant changes via email or website notice.</p>

      <h2>8. Contact Us</h2>
      <p>If you have any questions about this privacy policy, please contact us at:</p>
      <p>Email: privacy@cleopatradahabiya.com</p>
      <p>Phone: +20 123 456 7890</p>
    `;

    return NextResponse.json({
      title: 'Privacy Policy',
      content: defaultContent,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching privacy content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch privacy content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Update or create privacy policy setting
    const privacySetting = await prisma.setting.upsert({
      where: {
        group_key: {
          group: 'legal',
          key: 'privacy_policy'
        }
      },
      update: {
        value: content,
        updatedAt: new Date()
      },
      create: {
        group: 'legal',
        key: 'privacy_policy',
        value: content,
        type: 'TEXT',
        description: 'Privacy policy content'
      }
    });

    return NextResponse.json({
      title: 'Privacy Policy',
      content: privacySetting.value,
      lastUpdated: privacySetting.updatedAt
    });

  } catch (error) {
    console.error('Error updating privacy content:', error);
    return NextResponse.json(
      { error: 'Failed to update privacy content' },
      { status: 500 }
    );
  }
}
