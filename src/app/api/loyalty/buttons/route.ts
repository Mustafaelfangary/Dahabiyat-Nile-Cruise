import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Default configuration
    const defaultButtons = [
      {
        id: 'book-package',
        label: 'Book a Package',
        icon: 'Package',
        points: 500,
        enabled: true,
        url: '/packages',
        action: 'redirect',
        description: 'Browse and book our luxury packages',
        color: 'bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500'
      },
      {
        id: 'like-facebook',
        label: 'Like Us',
        icon: 'Facebook',
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
        icon: 'Instagram',
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
        icon: 'Youtube',
        points: 75,
        enabled: true,
        url: 'https://youtube.com/@cleopatradahabiya',
        action: 'redirect',
        description: 'Subscribe to our YouTube channel',
        color: 'bg-gradient-to-r from-red-500 to-red-600'
      },
      {
        id: 'download-app',
        label: 'Download Our App',
        icon: 'Smartphone',
        points: 150,
        enabled: true,
        url: 'https://play.google.com/store/apps/details?id=com.cleopatradahabiya.app',
        action: 'redirect',
        description: 'Download our mobile app from Google Play',
        color: 'bg-gradient-to-r from-indigo-500 to-purple-600'
      },
      {
        id: 'book-dahabiya',
        label: 'Book a Dahabiya',
        icon: 'Ship',
        points: 750,
        enabled: true,
        url: '/dahabiyat',
        action: 'redirect',
        description: 'Explore and book our luxury dahabiyas',
        color: 'bg-gradient-to-r from-teal-500 to-cyan-600'
      },
      {
        id: 'review-tripadvisor',
        label: 'Write a Review on TripAdvisor',
        icon: 'Crown',
        points: 50,
        enabled: true,
        url: 'https://tripadvisor.com/cleopatradahabiya',
        action: 'redirect',
        description: 'Share your experience on TripAdvisor',
        color: 'bg-gradient-to-r from-green-500 to-emerald-600'
      },
      {
        id: 'book-day-tour',
        label: 'Book a One Day Tour',
        icon: 'Gift',
        points: 75,
        enabled: true,
        url: '/day-tours',
        action: 'redirect',
        description: 'Discover our exciting day tour packages',
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600'
      },
      {
        id: 'share-memories',
        label: 'Share Memories',
        icon: 'Camera',
        points: 100,
        enabled: true,
        action: 'internal',
        description: 'Share your travel memories with us',
        color: 'bg-gradient-to-r from-green-500 to-emerald-600'
      }
    ];

    // Get loyalty button configuration
    const config = await prisma.loyaltyConfig.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (!config || !config.buttonsConfig) {
      // Return default configuration if none exists or buttonsConfig is null
      return NextResponse.json({
        buttons: defaultButtons
      });
    }

    try {
      // Try to parse the stored configuration
      const storedButtons = JSON.parse(config.buttonsConfig);
      return NextResponse.json({
        buttons: Array.isArray(storedButtons) ? storedButtons : defaultButtons
      });
    } catch (parseError) {
      console.error('Error parsing stored loyalty button config:', parseError);
      // Return default configuration if JSON parsing fails
      return NextResponse.json({
        buttons: defaultButtons
      });
    }

  } catch (error) {
    console.error('Error fetching loyalty button config:', error);
    // Return default configuration on any error
    const defaultButtons = [
      {
        id: 'book-package',
        label: 'Book a Package',
        icon: 'Package',
        points: 500,
        enabled: true,
        url: '/packages',
        action: 'redirect',
        description: 'Browse and book our luxury packages',
        color: 'bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500'
      },
      {
        id: 'like-facebook',
        label: 'Like Us',
        icon: 'Facebook',
        points: 50,
        enabled: true,
        url: 'https://facebook.com/cleopatradahabiya',
        action: 'redirect',
        description: 'Follow us on Facebook',
        color: 'bg-gradient-to-r from-blue-600 to-blue-700'
      },
      {
        id: 'review-tripadvisor',
        label: 'Write a Review on TripAdvisor',
        icon: 'Crown',
        points: 50,
        enabled: true,
        url: 'https://tripadvisor.com/cleopatradahabiya',
        action: 'redirect',
        description: 'Share your experience on TripAdvisor',
        color: 'bg-gradient-to-r from-green-500 to-emerald-600'
      },
      {
        id: 'book-day-tour',
        label: 'Book a One Day Tour',
        icon: 'Gift',
        points: 75,
        enabled: true,
        url: '/day-tours',
        action: 'redirect',
        description: 'Discover our exciting day tour packages',
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600'
      },
      {
        id: 'share-memories',
        label: 'Share Memories',
        icon: 'Camera',
        points: 100,
        enabled: true,
        action: 'internal',
        description: 'Share your travel memories with us',
        color: 'bg-gradient-to-r from-green-500 to-emerald-600'
      }
    ];

    return NextResponse.json({
      buttons: defaultButtons
    });
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
