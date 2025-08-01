import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get dahabiya with its associated itineraries
    const dahabiya = await prisma.dahabiya.findUnique({
      where: { id },
      include: {
        itineraries: {
          include: {
            itinerary: {
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
            }
          },
          orderBy: {
            isDefault: 'desc' // Default itineraries first
          }
        }
      }
    });

    if (!dahabiya) {
      return NextResponse.json(
        { error: 'Dahabiya not found' },
        { status: 404 }
      );
    }

    // Extract itineraries from the junction table
    const itineraries = dahabiya.itineraries
      .filter(di => di.itinerary.isActive) // Only active itineraries
      .map(di => ({
        ...di.itinerary,
        isDefault: di.isDefault
      }));

    return NextResponse.json({
      dahabiya: {
        id: dahabiya.id,
        name: dahabiya.name,
        slug: dahabiya.slug
      },
      itineraries
    });

  } catch (error) {
    console.error('Error fetching dahabiya itineraries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}

// POST - Add itinerary to dahabiya (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { itineraryId, isDefault = false } = body;

    if (!itineraryId) {
      return NextResponse.json(
        { error: 'Itinerary ID is required' },
        { status: 400 }
      );
    }

    // Verify both dahabiya and itinerary exist
    const [dahabiya, itinerary] = await Promise.all([
      prisma.dahabiya.findUnique({ where: { id } }),
      prisma.itinerary.findUnique({ where: { id: itineraryId } })
    ]);

    if (!dahabiya) {
      return NextResponse.json(
        { error: 'Dahabiya not found' },
        { status: 404 }
      );
    }

    if (!itinerary) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    // If setting as default, remove default from other itineraries
    if (isDefault) {
      await prisma.dahabiyaItinerary.updateMany({
        where: { dahabiyaId: id },
        data: { isDefault: false }
      });
    }

    // Create the association
    const dahabiyaItinerary = await prisma.dahabiyaItinerary.create({
      data: {
        dahabiyaId: id,
        itineraryId,
        isDefault
      },
      include: {
        itinerary: {
          include: {
            days: {
              orderBy: { dayNumber: 'asc' }
            }
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Itinerary added to dahabiya successfully',
      association: dahabiyaItinerary
    });

  } catch (error) {
    console.error('Error adding itinerary to dahabiya:', error);
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This itinerary is already associated with this dahabiya' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add itinerary to dahabiya' },
      { status: 500 }
    );
  }
}

// DELETE - Remove itinerary from dahabiya (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const itineraryId = searchParams.get('itineraryId');

    if (!itineraryId) {
      return NextResponse.json(
        { error: 'Itinerary ID is required' },
        { status: 400 }
      );
    }

    // Remove the association
    const deleted = await prisma.dahabiyaItinerary.deleteMany({
      where: {
        dahabiyaId: id,
        itineraryId
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Association not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Itinerary removed from dahabiya successfully'
    });

  } catch (error) {
    console.error('Error removing itinerary from dahabiya:', error);
    return NextResponse.json(
      { error: 'Failed to remove itinerary from dahabiya' },
      { status: 500 }
    );
  }
}
