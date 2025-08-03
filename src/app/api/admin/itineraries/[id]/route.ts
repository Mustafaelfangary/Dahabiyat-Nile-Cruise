import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/admin/itineraries/[id] - Get single itinerary
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const itinerary = await prisma.itinerary.findUnique({
      where: { id: params.id },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' }
        },
        pricingTiers: {
          orderBy: { category: 'asc' }
        }
      }
    });

    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/itineraries/[id] - Update itinerary
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Generate slug if not provided
    const slug = data.slug || data.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug is unique (excluding current itinerary)
    const existingItinerary = await prisma.itinerary.findFirst({
      where: {
        slug: slug,
        NOT: { id: params.id }
      }
    });

    if (existingItinerary) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Update itinerary with related data
    const updatedItinerary = await prisma.itinerary.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: slug,
        description: data.description,
        shortDescription: data.shortDescription,
        durationDays: parseInt(data.durationDays),
        mainImageUrl: data.mainImageUrl,
        heroImageUrl: data.heroImageUrl,
        videoUrl: data.videoUrl,
        price: data.price ? parseFloat(data.price) : null,
        maxGuests: data.maxGuests ? parseInt(data.maxGuests) : null,
        highlights: data.highlights || [],
        included: data.included || [],
        notIncluded: data.notIncluded || [],
        childrenPolicy: data.childrenPolicy,
        cancellationPolicy: data.cancellationPolicy,
        observations: data.observations,
        isActive: data.isActive ?? true,
        featured: data.featured ?? false,
        // Delete existing days and pricing tiers, then recreate
        days: {
          deleteMany: {},
          create: (data.days || []).map((day: any) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            description: day.description,
            location: day.location,
            activities: day.activities || [],
            meals: (day.meals || []).map((meal: string) => {
              // Convert meal strings to MealType enum values
              const mealUpper = meal.toUpperCase();
              switch (mealUpper) {
                case 'BREAKFAST':
                  return 'BREAKFAST';
                case 'LUNCH':
                  return 'LUNCH';
                case 'DINNER':
                  return 'DINNER';
                case 'SNACK':
                  return 'SNACK';
                case 'AFTERNOON_TEA':
                case 'AFTERNOON TEA':
                  return 'AFTERNOON_TEA';
                default:
                  console.warn(`Unknown meal type: ${meal}, defaulting to LUNCH`);
                  return 'LUNCH';
              }
            }),
            coordinates: day.coordinates || null,
          }))
        },
        pricingTiers: {
          deleteMany: {},
          create: (data.pricingTiers || []).map((tier: any) => ({
            category: tier.category,
            paxRange: tier.paxRange,
            price: parseFloat(tier.price),
            singleSupplement: tier.singleSupplement ? parseFloat(tier.singleSupplement) : null,
          }))
        }
      },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' }
        },
        pricingTiers: {
          orderBy: { category: 'asc' }
        }
      }
    });

    return NextResponse.json(updatedItinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/itineraries/[id] - Delete itinerary
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete itinerary (cascade will handle related records)
    await prisma.itinerary.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
