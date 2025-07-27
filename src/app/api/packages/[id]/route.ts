import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        itineraryDays: {
          include: { images: true },
          orderBy: { dayNumber: 'asc' },
        },
        bookings: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // If not found by ID, try to find by slug or name
    if (!pkg) {
      pkg = await prisma.package.findFirst({
        where: {
          name: { contains: id, mode: 'insensitive' }
        },
        include: {
          itineraryDays: {
            include: { images: true },
            orderBy: { dayNumber: 'asc' },
          },
          bookings: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
    }

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Convert Decimal values to numbers and format for frontend
    const formattedPackage = {
      ...pkg,
      price: Number(pkg.price),
      mainImageUrl: pkg.mainImageUrl || '/images/default-package.jpg',
      highlights: [], // Package model doesn't have highlights field
      included: [], // Package model doesn't have included field
      excluded: [], // Package model doesn't have excluded field
      maxGuests: 20, // Package model doesn't have maxGuests field
      slug: pkg.name.toLowerCase().replace(/\s+/g, '-'), // Generate slug from name
      longDescription: pkg.description,
      itineraryDays: pkg.itineraryDays?.map(day => ({
        day: day.dayNumber,
        title: day.title || `Day ${day.dayNumber}`,
        description: day.description || '',
        activities: [], // PackageItineraryDay model doesn't have activities field
        meals: [], // PackageItineraryDay model doesn't have meals field
        accommodation: null, // PackageItineraryDay model doesn't have accommodation field
        images: day.images || []
      })) || [],
      reviews: [] // Booking model doesn't have rating/comment fields
    };

    return NextResponse.json(formattedPackage);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    );
  }
}
