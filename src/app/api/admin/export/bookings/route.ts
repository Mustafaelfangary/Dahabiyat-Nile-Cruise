import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { exportBookingsToExcel } from '@/lib/excel';

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
    const format = searchParams.get('format') || 'excel';

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (bookingType) {
      where.bookingType = bookingType;
    }

    // Handle date range filtering
    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      let endDate: Date = now;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }

      where.startDate = {
        gte: startDate,
        lt: endDate
      };
    }

    // Fetch bookings with all necessary relations
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        dahabiya: {
          select: {
            name: true,
            pricePerDay: true
          }
        },
        package: {
          select: {
            name: true,
            price: true,
            durationDays: true
          }
        },
        cabin: {
          select: {
            name: true,
            capacity: true
          }
        },
        guestDetails: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (format === 'json') {
      return NextResponse.json({ 
        bookings,
        total: bookings.length,
        exportedAt: new Date().toISOString()
      });
    }

    // Convert Decimal values to numbers for export
    const formattedBookings = bookings.map(booking => ({
      ...booking,
      totalPrice: Number(booking.totalPrice),
      dahabiya: booking.dahabiya ? {
        ...booking.dahabiya,
        pricePerDay: Number(booking.dahabiya.pricePerDay)
      } : null
    }));

    // Generate Excel file
    const buffer = await exportBookingsToExcel(formattedBookings as any);

    const filename = `bookings-export-${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Error exporting bookings:', error);
    return NextResponse.json(
      { error: 'Failed to export bookings' },
      { status: 500 }
    );
  }
}
