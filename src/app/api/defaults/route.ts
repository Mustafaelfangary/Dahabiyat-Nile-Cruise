import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get default dahabiya (ship model was merged into dahabiya)
    const defaultShip = await prisma.dahabiya.findFirst({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { createdAt: 'asc' }
    });

    // Get default itinerary
    const defaultItinerary = await prisma.itinerary.findFirst({
      where: { name: 'Classic Nile Journey' },
      select: { id: true, name: true, slug: true }
    });

    return NextResponse.json({
      success: true,
      defaults: {
        ship: defaultShip,
        itinerary: defaultItinerary
      }
    });

  } catch (error) {
    console.error('Error fetching defaults:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch defaults',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
