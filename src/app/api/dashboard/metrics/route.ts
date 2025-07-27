import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get dashboard metrics
    const [
      totalDahabiyas,
      activeDahabiyas,
      totalPackages,
      activePackages,
      totalUsers,
      totalBookings,
      pendingBookings,
      totalMemories,
      pendingMemories,
      totalContent,
      recentBookings,
      recentMemories
    ] = await Promise.all([
      // Dahabiyas metrics
      prisma.dahabiya.count(),
      prisma.dahabiya.count({ where: { isActive: true } }),
      
      // Packages metrics
      prisma.package.count(),
      prisma.package.count(), // Package model doesn't have isActive field, so count all
      
      // Users metrics
      prisma.user.count(),
      
      // Bookings metrics (if booking table exists)
      prisma.booking?.count().catch(() => 0) || Promise.resolve(0),
      prisma.booking?.count({ where: { status: 'PENDING' } }).catch(() => 0) || Promise.resolve(0),
      
      // Memories metrics (UserMemory model)
      prisma.userMemory.count(),
      prisma.userMemory.count({ where: { status: 'PENDING' } }),
      
      // Content metrics
      prisma.websiteContent.count({ where: { isActive: true } }),
      
      // Recent data
      prisma.booking?.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          package: { select: { name: true } }
          // dahabiya relation removed as it no longer exists in the schema
        }
      }).catch(() => []) || Promise.resolve([]),
      
      prisma.userMemory.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } }
        }
      })
    ]);

    // Calculate growth metrics (simplified - you can enhance this)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      newUsersThisMonth,
      newBookingsThisMonth,
      newMemoriesThisMonth
    ] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.booking?.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }).catch(() => 0) || Promise.resolve(0),
      prisma.userMemory.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      })
    ]);

    const metrics = {
      // Overview metrics
      overview: {
        totalDahabiyas,
        activeDahabiyas,
        totalPackages,
        activePackages,
        totalUsers,
        totalBookings,
        pendingBookings,
        totalMemories,
        pendingMemories,
        totalContent
      },
      
      // Growth metrics
      growth: {
        newUsersThisMonth,
        newBookingsThisMonth,
        newMemoriesThisMonth,
        userGrowthRate: totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100).toFixed(1) : '0',
        bookingGrowthRate: totalBookings > 0 ? ((newBookingsThisMonth / totalBookings) * 100).toFixed(1) : '0',
        memoryGrowthRate: totalMemories > 0 ? ((newMemoriesThisMonth / totalMemories) * 100).toFixed(1) : '0'
      },
      
      // Recent activity
      recent: {
        bookings: recentBookings,
        memories: recentMemories
      },
      
      // System status
      status: {
        databaseConnected: true,
        lastUpdated: new Date().toISOString()
      }
    };

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    
    // Return fallback metrics if there's an error
    const fallbackMetrics = {
      overview: {
        totalDahabiyas: 0,
        activeDahabiyas: 0,
        totalPackages: 0,
        activePackages: 0,
        totalUsers: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalMemories: 0,
        pendingMemories: 0,
        totalContent: 0
      },
      growth: {
        newUsersThisMonth: 0,
        newBookingsThisMonth: 0,
        newMemoriesThisMonth: 0,
        userGrowthRate: '0',
        bookingGrowthRate: '0',
        memoryGrowthRate: '0'
      },
      recent: {
        bookings: [],
        memories: []
      },
      status: {
        databaseConnected: false,
        lastUpdated: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };

    return NextResponse.json(fallbackMetrics, { status: 200 });
  }
}
