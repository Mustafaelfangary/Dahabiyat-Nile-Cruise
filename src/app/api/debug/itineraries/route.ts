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

    // Get all itineraries
    const itineraries = await prisma.itinerary.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            days: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      count: itineraries.length,
      itineraries
    });

  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch itineraries',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
