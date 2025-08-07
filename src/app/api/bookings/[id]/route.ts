import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CleanBookingService } from '@/lib/services/unified-booking-service';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/bookings/[id] - Get booking details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const booking = await CleanBookingService.getBookingById(id, session.user.id);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Failed to get booking' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/bookings/[id] - Update booking status or cancel booking
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, action } = body;

    // Handle booking cancellation
    if (action === 'cancel') {
      const result = await CleanBookingService.cancelBooking(id, session.user.id);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        message: 'Booking cancelled successfully',
        booking: result.booking
      });
    }

    // Handle status updates (admin only)
    if (status) {
      // Check if user is admin
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      });

      if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }

      const result = await CleanBookingService.updateBookingStatus(id, status);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        message: 'Booking status updated successfully',
        booking: result.booking
      });
    }

    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/bookings/[id] - Delete booking (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    // Use the service method if it exists, otherwise direct deletion
    try {
      await prisma.booking.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } catch (deleteError) {
      console.error('Error deleting booking:', deleteError);
      return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
    }
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}