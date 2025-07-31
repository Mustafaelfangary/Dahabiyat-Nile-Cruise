import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus } = body;

    // Validate status values
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    const validPaymentStatuses = ['PENDING', 'PARTIAL', 'PAID', 'REFUNDED'];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status value' },
        { status: 400 }
      );
    }

    // Get the current booking
    const currentBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        // dahabiya: true,  // REMOVED: dahabiya relation removed
        package: true,
        user: true
      }
    });

    if (!currentBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Handle availability changes for dahabiya bookings
    if (currentBooking.dahabiyaId && status) {
      const dates = [];
      const start = new Date(currentBooking.startDate);
      const end = new Date(currentBooking.endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }

      if (status === 'CANCELLED' && currentBooking.status !== 'CANCELLED') {
        // Free up the dates
        await prisma.availabilityDate.updateMany({
          where: {
            dahabiyaId: currentBooking.dahabiyaId!,
            date: {
              in: dates
            }
          },
          data: {
            available: true
          }
        });
      } else if (status === 'CONFIRMED' && currentBooking.status === 'CANCELLED') {
        // Block the dates again
        await prisma.availabilityDate.updateMany({
          where: {
            dahabiyaId: currentBooking.dahabiyaId!,
            date: {
              in: dates
            }
          },
          data: {
            available: false
          }
        });
      }
    }

    // Update the booking
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    updateData.updatedAt = new Date();

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
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
        }
      }
    });

    // Create notification for status change
    if (status && status !== currentBooking.status) {
      await prisma.notification.create({
        data: {
          type: 'BOOKING_STATUS_CHANGED',
          title: `Booking Status Updated`,
          message: `Booking for ${currentBooking.user.name || 'Guest'} has been ${status.toLowerCase()}`,
          data: {
            bookingId: id,
            oldStatus: currentBooking.status,
            newStatus: status,
            customerName: currentBooking.user.name || 'Guest',
            bookingType: currentBooking.dahabiya ? 'DAHABIYA' : 'PACKAGE'
          },
          userId: session.user.id
        }
      });

      // Award loyalty points when booking is completed
      if (status === 'COMPLETED' && currentBooking.status !== 'COMPLETED') {
        const loyaltyPoints = 500; // Points for completing a booking

        // Record the loyalty action
        await prisma.loyaltyAction.create({
          data: {
            userId: currentBooking.userId,
            action: 'book-package',
            points: loyaltyPoints,
            description: `Completed booking for ${currentBooking.dahabiya?.name || currentBooking.package?.name || 'cruise'}`
          }
        });

        // Update user's total loyalty points
        await prisma.user.update({
          where: { id: currentBooking.userId },
          data: {
            loyaltyPoints: {
              increment: loyaltyPoints
            }
          }
        });

        // Create notification for user about loyalty points earned
        await prisma.notification.create({
          data: {
            type: 'LOYALTY_POINTS_EARNED',
            title: `Loyalty Points Earned!`,
            message: `You earned ${loyaltyPoints} loyalty points for completing your booking!`,
            data: {
              points: loyaltyPoints,
              action: 'book-package',
              bookingId: id
            },
            userId: currentBooking.userId
          }
        });
      }
    }

    return NextResponse.json({ booking: updatedBooking });

  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
