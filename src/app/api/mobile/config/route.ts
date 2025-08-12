import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/mobile/config - Get mobile app configuration
export async function GET(request: NextRequest) {
  try {
    console.log('📱 Mobile config requested');

    // Get mobile configuration from database
    let mobileConfig = await prisma.mobileConfig.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    // If no config exists, create default one
    if (!mobileConfig) {
      console.log('🔧 Creating default mobile config');
      mobileConfig = await prisma.mobileConfig.create({
        data: {
          appVersion: '2.0.0',
          minRequiredVersion: '1.0.0',
          maintenanceMode: false,
          maintenanceMessage: null,
          featuredDahabiyas: [],
          featuredPackages: [],
          splashScreenDuration: 3000,
          enablePushNotifications: true,
          contactInfo: {
            email: 'info@dahabiyatnilecruise.com',
            phone: '+20 123 456 7890',
            whatsapp: '+20 123 456 7890',
            website: 'https://dahabiyatnilecruise.com',
          },
          socialMedia: {
            facebook: 'https://facebook.com/dahabiyatnilecruise',
            instagram: 'https://instagram.com/dahabiyatnilecruise',
            twitter: 'https://twitter.com/dahabiyatnile',
          },
          appSettings: {
            enableOfflineMode: true,
            cacheImages: true,
            autoRefreshInterval: 300000, // 5 minutes
            maxImageCacheSize: 100, // MB
            enableAnalytics: true,
            enableCrashReporting: true,
          }
        }
      });
    }

    // Get featured dahabiyas and packages
    const [featuredDahabiyas, featuredPackages] = await Promise.all([
      prisma.dahabiya.findMany({
        where: { 
          isActive: true,
          isFeatured: true 
        },
        select: {
          id: true,
          name: true,
          slug: true,
          mainImage: true,
          pricePerDay: true,
          rating: true,
          reviewCount: true,
        },
        take: 5,
        orderBy: { rating: 'desc' }
      }),
      
      // Assuming you have a Package model
      // prisma.package.findMany({
      //   where: { 
      //     isActive: true,
      //     isFeatured: true 
      //   },
      //   select: {
      //     id: true,
      //     name: true,
      //     slug: true,
      //     mainImageUrl: true,
      //     price: true,
      //   },
      //   take: 3,
      //   orderBy: { createdAt: 'desc' }
      // })
    ]);

    // Prepare response with full image URLs
    const response = {
      ...mobileConfig,
      featuredDahabiyas: featuredDahabiyas.map(d => ({
        ...d,
        mainImage: d.mainImage ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://dahabiyatnilecruise.com'}${d.mainImage}` : null
      })),
      featuredPackages: featuredPackages || [],
      serverTime: new Date().toISOString(),
      apiVersion: '2.0',
    };

    console.log('✅ Mobile config sent successfully');
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5 min cache
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('❌ Error fetching mobile config:', error);
    
    // Return minimal fallback config
    const fallbackConfig = {
      id: 'fallback',
      appVersion: '2.0.0',
      minRequiredVersion: '1.0.0',
      maintenanceMode: false,
      maintenanceMessage: null,
      featuredDahabiyas: [],
      featuredPackages: [],
      splashScreenDuration: 3000,
      enablePushNotifications: true,
      contactInfo: {
        email: 'info@dahabiyatnilecruise.com',
        phone: '+20 123 456 7890',
        whatsapp: '+20 123 456 7890',
        website: 'https://dahabiyatnilecruise.com',
      },
      socialMedia: {},
      appSettings: {
        enableOfflineMode: false,
        cacheImages: false,
        autoRefreshInterval: 600000,
        maxImageCacheSize: 50,
        enableAnalytics: false,
        enableCrashReporting: false,
      },
      serverTime: new Date().toISOString(),
      apiVersion: '2.0',
      error: 'Fallback configuration loaded',
    };

    return NextResponse.json(fallbackConfig, { 
      status: 200, // Return 200 with fallback instead of error
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      }
    });
  }
}

// POST /api/mobile/config - Update mobile configuration (Admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    // const session = await getServerSession(authOptions);
    // if (!session?.user || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    console.log('📱 Updating mobile config:', body);

    const updatedConfig = await prisma.mobileConfig.upsert({
      where: { id: body.id || 'default' },
      update: {
        appVersion: body.appVersion,
        minRequiredVersion: body.minRequiredVersion,
        maintenanceMode: body.maintenanceMode || false,
        maintenanceMessage: body.maintenanceMessage,
        featuredDahabiyas: body.featuredDahabiyas || [],
        featuredPackages: body.featuredPackages || [],
        splashScreenDuration: body.splashScreenDuration || 3000,
        enablePushNotifications: body.enablePushNotifications !== false,
        contactInfo: body.contactInfo || {},
        socialMedia: body.socialMedia || {},
        appSettings: body.appSettings || {},
      },
      create: {
        appVersion: body.appVersion || '2.0.0',
        minRequiredVersion: body.minRequiredVersion || '1.0.0',
        maintenanceMode: body.maintenanceMode || false,
        maintenanceMessage: body.maintenanceMessage,
        featuredDahabiyas: body.featuredDahabiyas || [],
        featuredPackages: body.featuredPackages || [],
        splashScreenDuration: body.splashScreenDuration || 3000,
        enablePushNotifications: body.enablePushNotifications !== false,
        contactInfo: body.contactInfo || {},
        socialMedia: body.socialMedia || {},
        appSettings: body.appSettings || {},
      }
    });

    console.log('✅ Mobile config updated successfully');
    return NextResponse.json(updatedConfig);

  } catch (error) {
    console.error('❌ Error updating mobile config:', error);
    return NextResponse.json(
      { error: 'Failed to update mobile configuration' },
      { status: 500 }
    );
  }
}

// DELETE /api/mobile/config - Reset to default configuration (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    
    await prisma.mobileConfig.deleteMany({});
    
    console.log('🗑️ Mobile config reset to default');
    return NextResponse.json({ message: 'Mobile configuration reset successfully' });

  } catch (error) {
    console.error('❌ Error resetting mobile config:', error);
    return NextResponse.json(
      { error: 'Failed to reset mobile configuration' },
      { status: 500 }
    );
  }
}
