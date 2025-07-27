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
    
    // Generate slug from name if not provided
    const slug = data.slug || data.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

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
      },
      include: {
        days: true,
        pricingTiers: true
      }
    });

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json({ error: 'Failed to create itinerary' }, { status: 500 });
  }
}
