import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get loyalty button configuration
    const config = await prisma.loyaltyConfig.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (!config) {
      // Return default configuration if none exists
      return NextResponse.json({
        buttons: [
          {
            id: 'book-package',
            label: 'Book a Package',
            points: 500,
            enabled: true,
            url: '/packages',
            action: 'redirect',
            description: 'Browse and book our luxury packages',
            color: 'bg-gradient-to-r from-amber-500 to-orange-500'
          },
          {
            id: 'like-facebook',
            label: 'Like Us',
            points: 50,
            enabled: true,
            url: 'https://facebook.com/cleopatradahabiya',
            action: 'redirect',
            description: 'Follow us on Facebook',
            color: 'bg-gradient-to-r from-blue-600 to-blue-700'
          },
          {
            id: 'follow-instagram',
            label: 'Follow Us',
            points: 50,
            enabled: true,
            url: 'https://instagram.com/cleopatradahabiya',
            action: 'redirect',
            description: 'Follow us on Instagram',
            color: 'bg-gradient-to-r from-pink-500 to-purple-600'
          },
          {
            id: 'subscribe-youtube',
            label: 'Subscribe',
            points: 75,
            enabled: true,
            url: 'https://youtube.com/@cleopatradahabiya',
            action: 'redirect',
            description: 'Subscribe to our YouTube channel',
            color: 'bg-gradient-to-r from-red-500 to-red-600'
          },
          {
            id: 'share-memories',
            label: 'Share Memories',
            points: 100,
            enabled: true,
            action: 'internal',
            description: 'Share your travel memories with us',
            color: 'bg-gradient-to-r from-green-500 to-emerald-600'
          }
        ]
      });
    }

    return NextResponse.json({
      buttons: JSON.parse(config.buttonsConfig)
    });

  } catch (error) {
    console.error('Error fetching loyalty button config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { buttons } = await request.json();

    if (!buttons || !Array.isArray(buttons)) {
      return NextResponse.json(
        { error: 'Invalid button configuration' },
        { status: 400 }
      );
    }

    // Validate button structure
    for (const button of buttons) {
      if (!button.id || !button.label || typeof button.points !== 'number') {
        return NextResponse.json(
          { error: 'Invalid button structure' },
          { status: 400 }
        );
      }
    }

    // Update or create loyalty configuration
    const config = await prisma.loyaltyConfig.upsert({
      where: { id: 'default' },
      update: {
        buttonsConfig: JSON.stringify(buttons),
        updatedAt: new Date()
      },
      create: {
        id: 'default',
        buttonsConfig: JSON.stringify(buttons)
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Loyalty button configuration updated successfully'
    });

  } catch (error) {
    console.error('Error updating loyalty button config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
