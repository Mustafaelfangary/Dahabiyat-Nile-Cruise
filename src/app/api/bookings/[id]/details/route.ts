import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: bookingId } = await params;

    // Fetch booking with all related data
    const booking = await prisma.booking.findUnique({
      where: { 
        id: bookingId,
        userId: session.user.id // Ensure user can only access their own bookings
      },
      include: {
        dahabiya: {
          include: {
            images: {
              take: 5,
              orderBy: { order: 'asc' }
            }
          }
        },
        package: true,
        guestDetails: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Transform the data to match the expected format
    const bookingDetails = {
      id: booking.id,
      status: booking.status,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      guestCount: booking.guests || 0,
      totalPrice: booking.totalPrice || 0,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      dahabiya: {
        id: booking.dahabiya.id,
        name: booking.dahabiya.name,
        description: booking.dahabiya.description || '',
        images: booking.dahabiya.images.map(img => ({
          url: img.url,
          alt: img.alt || booking.dahabiya.name
        })),
        capacity: booking.dahabiya.capacity || 0,
        cabins: booking.dahabiya.cabins || 0
      },
      package: booking.package ? {
        id: booking.package.id,
        name: booking.package.name,
        duration: booking.package.duration || 0,
        description: booking.package.description || ''
      } : null,
      guestDetails: booking.guestDetails.map(guest => ({
        id: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
        dateOfBirth: guest.dateOfBirth?.toISOString(),
        nationality: guest.nationality
      }))
    };

    return NextResponse.json(bookingDetails);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
