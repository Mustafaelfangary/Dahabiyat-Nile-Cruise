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

    console.log('🔍 Starting admin debug check...');

    // Test database connection
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection test:', dbTest);

    // Check packages count
    const packagesCount = await prisma.package.count();
    console.log('📦 Packages count:', packagesCount);

    // Check dahabiyas count
    const dahabiyasCount = await prisma.dahabiya.count();
    console.log('🚢 Dahabiyas count:', dahabiyasCount);

    // Check itineraries count
    const itinerariesCount = await prisma.itinerary.count();
    console.log('🗺️ Itineraries count:', itinerariesCount);

    // Get sample packages
    const samplePackages = await prisma.package.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true
      }
    });
    console.log('📦 Sample packages:', samplePackages);

    // Get sample dahabiyas
    const sampleDahabiyas = await prisma.dahabiya.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true
      }
    });
    console.log('🚢 Sample dahabiyas:', sampleDahabiyas);

    // Get sample itineraries
    const sampleItineraries = await prisma.itinerary.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true
      }
    });
    console.log('🗺️ Sample itineraries:', sampleItineraries);

    const debugInfo = {
      database: {
        connected: true,
        testQuery: dbTest
      },
      counts: {
        packages: packagesCount,
        dahabiyas: dahabiyasCount,
        itineraries: itinerariesCount
      },
      samples: {
        packages: samplePackages,
        dahabiyas: sampleDahabiyas,
        itineraries: sampleItineraries
      },
      session: {
        userId: session.user.id,
        userRole: session.user.role,
        userEmail: session.user.email
      }
    };

    console.log('🎯 Debug info complete:', debugInfo);

    return NextResponse.json({
      success: true,
      message: 'Admin debug check completed',
      data: debugInfo
    });

  } catch (error) {
    console.error('❌ Admin debug error:', error);
    return NextResponse.json(
      { 
        error: 'Debug check failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
