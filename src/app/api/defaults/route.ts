import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get default ship
    const defaultShip = await prisma.ship.findFirst({
      where: { name: 'Default Ship' },
      select: { id: true, name: true }
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
