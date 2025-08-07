import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CleanBookingService } from '@/lib/services/clean-booking-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("📋 Admin fetching all bookings");
    const bookings = await CleanBookingService.getAllBookings();
    return NextResponse.json({ bookings });

  } catch (error) {
    console.error('❌ Error fetching admin bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// PUT endpoint for updating booking status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing bookingId or status' },
        { status: 400 }
      );
    }

    console.log(`📝 Admin updating booking ${bookingId} to status: ${status}`);
    const result = await CleanBookingService.updateBookingStatus(bookingId, status);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log("✅ Booking status updated successfully");
    return NextResponse.json(result.booking);

  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}

// DELETE endpoint for cancelling bookings
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing bookingId' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Admin cancelling booking: ${bookingId}`);
    const result = await CleanBookingService.cancelBooking(bookingId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log("✅ Booking cancelled successfully");
    return NextResponse.json(result.booking);

  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
