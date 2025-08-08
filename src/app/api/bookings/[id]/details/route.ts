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
    console.log('Fetching booking details for ID:', bookingId, 'User:', session.user.id);

    // Fetch booking with all related data
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        userId: session.user.id // Ensure user can only access their own bookings
      },
      include: {
        package: true,
        dahabiya: true, // Include dahabiya relation
        guestDetails: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        payment: true, // Include payment information
        modifications: true, // Include booking modifications
        cancellation: true // Include cancellation info if exists
      }
    });

    if (!booking) {
      console.log('Booking not found for ID:', bookingId);
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    console.log('Found booking:', {
      id: booking.id,
      status: booking.status,
      hasPackage: !!booking.package,
      hasDahabiya: !!booking.dahabiya,
      guestDetailsCount: booking.guestDetails?.length || 0
    });

    // Transform the data to match the expected format
    const bookingDetails = {
      id: booking.id,
      status: booking.status,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      guests: booking.guests || 0, // Fixed field name
      totalPrice: Number(booking.totalPrice) || 0,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      type: booking.type,
      dahabiya: booking.dahabiya ? {
        id: booking.dahabiya.id,
        name: booking.dahabiya.name,
        description: booking.dahabiya.description,
        mainImage: booking.dahabiya.mainImage,
        gallery: booking.dahabiya.gallery || [],
        capacity: booking.dahabiya.capacity || 0,
        cabins: booking.dahabiya.cabins || 0,
        features: booking.dahabiya.features || [],
        amenities: booking.dahabiya.amenities || []
      } : null,
      package: booking.package ? {
        id: booking.package.id,
        name: booking.package.name,
        durationDays: booking.package.durationDays || 0,
        description: booking.package.description || '',
        shortDescription: booking.package.shortDescription,
        mainImageUrl: booking.package.mainImageUrl,
        price: Number(booking.package.price) || 0
      } : null,
      guestDetails: (booking.guestDetails || []).map(guest => ({
        id: guest.id,
        firstName: guest.firstName || '',
        lastName: guest.lastName || '',
        email: guest.email || '',
        phone: guest.phone || '',
        dateOfBirth: guest.dateOfBirth ? guest.dateOfBirth.toISOString() : null,
        nationality: guest.nationality || '',
        passport: guest.passport || '',
        dietaryRequirements: guest.dietaryRequirements || ''
      })),
      payment: booking.payment ? {
        id: booking.payment.id,
        amount: Number(booking.payment.amount),
        status: booking.payment.status,
        provider: booking.payment.provider,
        paymentMethod: booking.payment.paymentMethod
      } : null
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
