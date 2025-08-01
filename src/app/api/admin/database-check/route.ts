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

    // Get comprehensive database statistics
    const [
      totalUsers,
      totalBookings,
      totalPackages,
      totalNotifications,
      recentBookings,
      recentUsers,
      featuredPackages
    ] = await Promise.all([
      // Count totals
      prisma.user.count(),
      prisma.booking.count(),
      prisma.package.count(),
      prisma.notification.count(),
      
      // Get recent data
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
          package: {
            select: { name: true }
          }
        }
      }),
      
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      }),

      // Check featured packages
      prisma.package.findMany({
        where: { isFeaturedOnHomepage: true },
        select: {
          id: true,
          name: true,
          isFeaturedOnHomepage: true,
          homepageOrder: true
        },
        orderBy: { homepageOrder: 'asc' }
      })
    ]);

    // Check for users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });

    // Check for bookings by status
    const bookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Note: Dahabiya-specific checks have been removed as the dahabiya system was removed

    return NextResponse.json({
      summary: {
        totalUsers,
        totalBookings,
        totalPackages,
        totalNotifications
      },
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {} as Record<string, number>),
      bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      recentBookings: recentBookings.map(booking => ({
        id: booking.id,
        customerName: booking.user?.name || 'Unknown',
        customerEmail: booking.user?.email || 'Unknown',
        packageName: booking.package?.name || 'Unknown',
        status: booking.status,
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt
      })),
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      })),
      featuredPackages
    });

  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { error: 'Failed to check database' },
      { status: 500 }
    );
  }
}
