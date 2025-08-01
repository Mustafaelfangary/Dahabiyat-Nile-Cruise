import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as Status | undefined;

    const skip = (page - 1) * limit;

    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          package: {
            select: {
              name: true,
              mainImageUrl: true,
              durationDays: true,
              price: true
            }
          },
          guestDetails: true,
          payment: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.booking.count({ where })
    ]);

    const stats = {
      total: await prisma.booking.count({
        where: { userId: session.user.id }
      }),
      completed: await prisma.booking.count({
        where: { userId: session.user.id, status: 'COMPLETED' }
      }),
      upcoming: await prisma.booking.count({
        where: {
          userId: session.user.id,
          status: 'CONFIRMED',
          startDate: { gte: new Date() }
        }
      })
    };

    return NextResponse.json({
      bookings,
      total,
      pages: Math.ceil(total / limit),
      stats
    });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // This route is deprecated - the old Dahabiya booking system has been removed
    // Use the main /api/bookings route instead
    return new NextResponse('This booking endpoint is deprecated. Please use /api/bookings instead.', { status: 410 });

    const body = await request.json();
    const {
      dahabiyaId,
      cabinId,
      startDate,
      endDate,
      guestDetails,
      specialRequests,
      promotionCode,
    } = body;

    // Verify dahabiya availability
    const dahabiya = await prisma.dahabiya.findUnique({
      where: { id: dahabiyaId }
    });

    if (!dahabiya) {
      return new NextResponse('Invalid dahabiya', { status: 400 });
    }

    // Calculate total price based on dahabiya price per day
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    let totalPrice = Number(dahabiya!.pricePerDay) * days;

    // Apply promotion if provided
    if (promotionCode) {
      const promotion = await prisma.promotion.findFirst({
        where: {
          code: promotionCode,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });

      if (promotion) {
        // Apply promotion discount
        totalPrice = totalPrice * (1 - Number(promotion!.discountPercentage) / 100);
      }
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session!.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: Status.PENDING,
        totalPrice,
        specialRequests,
        guests: guestDetails.length,
        type: 'DAHABIYA',
        guestDetails: {
          create: guestDetails,
        },
      },
      include: {
        guestDetails: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Failed to create booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Verify the booking belongs to the user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingBooking) {
      return new NextResponse('Booking not found', { status: 404 });
    }

    let newStatus;
    switch (action) {
      case 'cancel':
        if (existingBooking.status !== Status.PENDING && existingBooking.status !== Status.CONFIRMED) {
          return new NextResponse('Cannot cancel this booking', { status: 400 });
        }
        newStatus = Status.CANCELLED;
        break;
      default:
        return new NextResponse('Invalid action', { status: 400 });
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: newStatus },
      include: {
        package: true,
        guestDetails: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Failed to update booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}