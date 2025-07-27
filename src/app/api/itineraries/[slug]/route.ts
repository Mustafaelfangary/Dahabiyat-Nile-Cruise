import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const itinerary = await prisma.itinerary.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug }
        ],
        isActive: true
      },
      include: {
        days: {
          orderBy: {
            dayNumber: 'asc'
          }
        },
        pricingTiers: {
          orderBy: [
            { category: 'asc' },
            { price: 'asc' }
          ]
        }
      }
    });

    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
  }
}
