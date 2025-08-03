import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraries = await prisma.itinerary.findMany({
      include: {
        days: {
          orderBy: {
            dayNumber: 'asc'
          }
        },
        pricingTiers: true
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(itineraries);
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    console.log('Creating itinerary with data:', JSON.stringify(data, null, 2));

    // Generate slug from name if not provided
    const baseSlug = data.slug || data.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    console.log('Generated base slug:', baseSlug);

    // Check if slug is unique and generate a unique one if needed
    let slug = baseSlug;
    let counter = 1;
    let existingItinerary = await prisma.itinerary.findUnique({
      where: { slug }
    });

    while (existingItinerary) {
      slug = `${baseSlug}-${counter}`;
      console.log('Trying slug:', slug);
      existingItinerary = await prisma.itinerary.findUnique({
        where: { slug }
      });
      counter++;
    }

    console.log('Final unique slug:', slug);

    const itinerary = await prisma.itinerary.create({
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
        days: {
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

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      error: 'Failed to create itinerary',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
