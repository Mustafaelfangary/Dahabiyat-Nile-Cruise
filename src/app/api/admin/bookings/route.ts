import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const bookingType = searchParams.get('bookingType');
    const dateRange = searchParams.get('dateRange');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (bookingType) {
      where.bookingType = bookingType;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 'week':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
          endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          break;
        case 'upcoming':
          startDate = now;
          endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
          break;
        default:
          startDate = new Date(0);
          endDate = new Date();
      }

      where.startDate = {
        gte: startDate,
        lt: endDate
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        package: {
          select: {
            name: true,
            price: true,
            durationDays: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ bookings });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      bookingType,
      dahabiyaId,
      packageId,
      startDate,
      endDate,
      guests,
      totalPrice,
      specialRequests
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !bookingType || !startDate || !endDate || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate booking type specific fields
    if (bookingType === 'DAHABIYA' && !dahabiyaId) {
      return NextResponse.json(
        { error: 'Dahabiya ID is required for dahabiya bookings' },
        { status: 400 }
      );
    }

    if (bookingType === 'PACKAGE' && !packageId) {
      return NextResponse.json(
        { error: 'Package ID is required for package bookings' },
        { status: 400 }
      );
    }

    // Note: Dahabiya availability checking has been removed as part of system cleanup
    // Only package bookings are now supported

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id, // Assuming we have a user session
        type: bookingType,
        packageId: bookingType === 'PACKAGE' ? packageId : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guests: parseInt(guests),
        totalPrice: parseFloat(totalPrice),
        specialRequests,
        status: 'PENDING'
      },
      include: {
        package: {
          select: {
            name: true,
            price: true,
            durationDays: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Block the dates for dahabiya bookings
    if (bookingType === 'DAHABIYA') {
      const dates = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }

      await prisma.availabilityDate.updateMany({
        where: {
          dahabiyaId,
          date: {
            in: dates
          }
        },
        data: {
          available: false
        }
      });
    }

    return NextResponse.json({ booking }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
