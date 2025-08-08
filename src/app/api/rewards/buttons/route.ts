import { NextRequest, NextResponse } from 'next/server';
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
        label: 'Follow Instagram',
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
        label: 'Subscribe YouTube',
        icon: 'Youtube',
        points: 75,
        enabled: true,
        url: 'https://youtube.com/@cleopatradahabiya',
        action: 'redirect',
        description: 'Subscribe to our YouTube channel',
        color: 'bg-gradient-to-r from-red-500 to-red-600'
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

    try {
      // Try to get configuration from database
      const config = await prisma.rewardConfig.findUnique({
        where: { id: 'default' }
      });

      if (config && config.buttonsConfig) {
        const buttonsConfig = JSON.parse(config.buttonsConfig);
        return NextResponse.json({
          buttons: buttonsConfig.buttons || defaultButtons,
          socialLinks: config.socialLinks ? JSON.parse(config.socialLinks) : {},
          pointsConfig: config.pointsConfig ? JSON.parse(config.pointsConfig) : {}
        });
      }
    } catch (dbError) {
      console.warn('Could not fetch reward config from database, using defaults:', dbError);
    }

    // Return default configuration
    return NextResponse.json({
      buttons: defaultButtons,
      socialLinks: {
        facebook: 'https://facebook.com/cleopatradahabiya',
        instagram: 'https://instagram.com/cleopatradahabiya',
        youtube: 'https://youtube.com/@cleopatradahabiya',
        tripadvisor: 'https://tripadvisor.com/cleopatradahabiya'
      },
      pointsConfig: {
        'book-package': 500,
        'book-dahabiya': 750,
        'like-facebook': 50,
        'follow-instagram': 50,
        'subscribe-youtube': 75,
        'review-tripadvisor': 50,
        'book-day-tour': 75,
        'share-memories': 100,
        'download-app': 150
      }
    });

  } catch (error) {
    console.error('Error fetching reward buttons config:', error);
    
    // Fallback to hardcoded defaults
    const fallbackButtons = [
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
      buttons: fallbackButtons,
      socialLinks: {},
      pointsConfig: {}
    });
  }
}
