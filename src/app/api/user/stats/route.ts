import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's booking statistics
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        package: true
      }
    });

    // Calculate stats
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);
    
    // Find favorite destination (most booked location)
    const destinations: { [key: string]: number } = {};
    bookings.forEach(booking => {
      if (booking.package) {
        destinations['Egypt'] = (destinations['Egypt'] || 0) + 1;
      } else {
        // For non-package bookings, assume they are Nile River cruises
        destinations['Nile River'] = (destinations['Nile River'] || 0) + 1;
      }
    });
    
    const favoriteDestination = Object.keys(destinations).length > 0
      ? Object.keys(destinations).reduce((a, b) =>
          (destinations[a] || 0) > (destinations[b] || 0) ? a : b
        )
      : 'Egypt';

    // Get user creation date
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true }
    });

    const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : '2024';

    // Calculate loyalty points (simplified calculation)
    const loyaltyPoints = Math.floor(totalSpent / 10) + (totalBookings * 100);

    const stats = {
      totalBookings,
      totalSpent,
      favoriteDestination,
      memberSince,
      loyaltyPoints
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
