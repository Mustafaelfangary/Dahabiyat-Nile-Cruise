import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Try to get terms content from settings
    const termsSetting = await prisma.setting.findFirst({
      where: {
        group: 'legal',
        key: 'terms_conditions'
      }
    });

    if (termsSetting) {
      return NextResponse.json({
        title: 'Terms and Conditions',
        content: termsSetting.value,
        lastUpdated: termsSetting.updatedAt
      });
    }

    // Fallback content if not found in settings
    const defaultContent = `
      <h2>1. Booking and Payment</h2>
      <p>1.1. All bookings are subject to availability and confirmation by Dahabiyat Nile Cruise.</p>
      <p>1.2. A deposit of 30% of the total booking value is required to secure your reservation.</p>
      <p>1.3. Full payment must be received at least 30 days before the cruise departure date.</p>

      <h2>2. Cancellation Policy</h2>
      <p>2.1. Cancellations made more than 30 days before departure: Full refund minus administrative fees.</p>
      <p>2.2. Cancellations made 15-29 days before departure: 50% refund.</p>
      <p>2.3. Cancellations made less than 14 days before departure: No refund.</p>

      <h2>3. Travel Insurance</h2>
      <p>3.1. We strongly recommend that all passengers obtain comprehensive travel insurance.</p>
      <p>3.2. Insurance should cover medical expenses, trip cancellation, and personal belongings.</p>

      <h2>4. Health and Safety</h2>
      <p>4.1. Passengers must declare any medical conditions or special requirements at the time of booking.</p>
      <p>4.2. We reserve the right to refuse boarding to any passenger who may pose a risk to themselves or others.</p>

      <h2>5. Itinerary Changes</h2>
      <p>5.1. We reserve the right to modify itineraries due to weather conditions, water levels, or other circumstances beyond our control.</p>
      <p>5.2. Alternative arrangements will be made where possible, but no compensation will be offered for changes beyond our control.</p>

      <h2>6. Liability</h2>
      <p>6.1. Cleopatra Dahabiya is not liable for any loss, damage, or injury that occurs during the cruise.</p>
      <p>6.2. Passengers are responsible for their personal belongings and safety during shore excursions.</p>

      <h2>7. Force Majeure</h2>
      <p>7.1. We are not liable for any failure to perform our obligations due to circumstances beyond our reasonable control.</p>
      <p>7.2. Such circumstances include but are not limited to war, civil unrest, natural disasters, and government actions.</p>

      <h2>8. Contact Information</h2>
      <p>For questions regarding these terms and conditions, please contact us at:</p>
      <p>Email: info@cleopatradahabiya.com</p>
      <p>Phone: +20 123 456 7890</p>
    `;

    return NextResponse.json({
      title: 'Terms and Conditions',
      content: defaultContent,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching terms content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch terms content' },
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

    // Update or create terms and conditions setting
    const termsSetting = await prisma.setting.upsert({
      where: {
        group_key: {
          group: 'legal',
          key: 'terms_conditions'
        }
      },
      update: {
        value: content,
        updatedAt: new Date()
      },
      create: {
        group: 'legal',
        key: 'terms_conditions',
        value: content,
        type: 'TEXT',
        description: 'Terms and conditions content'
      }
    });

    return NextResponse.json({
      title: 'Terms and Conditions',
      content: termsSetting.value,
      lastUpdated: termsSetting.updatedAt
    });

  } catch (error) {
    console.error('Error updating terms content:', error);
    return NextResponse.json(
      { error: 'Failed to update terms content' },
      { status: 500 }
    );
  }
}
