import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: bookingId } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason || reason.trim() === '') {
      return NextResponse.json(
        { error: 'Cancellation reason is required' },
        { status: 400 }
      );
    }

    // Fetch existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        dahabiya: true,
        package: true
      }
    });

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if user owns the booking or is admin
    if (existingBooking.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (['CANCELLED', 'COMPLETED'].includes(existingBooking.status)) {
      return NextResponse.json(
        { error: 'Cannot cancel a booking that is already cancelled or completed' },
        { status: 400 }
      );
    }

    // Calculate cancellation fee based on how close to start date
    const today = new Date();
    const startDate = new Date(existingBooking.startDate);
    const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let cancellationFee = 0;
    let refundAmount = Number(existingBooking.totalPrice);
    
    // Cancellation policy:
    // - More than 30 days: 10% fee
    // - 15-30 days: 30% fee
    // - 7-14 days: 50% fee
    // - Less than 7 days: 100% fee (no refund)
    if (daysUntilStart > 30) {
      cancellationFee = Number(existingBooking.totalPrice) * 0.1;
      refundAmount = Number(existingBooking.totalPrice) - cancellationFee;
    } else if (daysUntilStart >= 15) {
      cancellationFee = Number(existingBooking.totalPrice) * 0.3;
      refundAmount = Number(existingBooking.totalPrice) - cancellationFee;
    } else if (daysUntilStart >= 7) {
      cancellationFee = Number(existingBooking.totalPrice) * 0.5;
      refundAmount = Number(existingBooking.totalPrice) - cancellationFee;
    } else {
      cancellationFee = Number(existingBooking.totalPrice);
      refundAmount = 0;
    }

    // Update the booking
    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date()
      },
      include: {
        user: true,
        dahabiya: true,
        package: true
      }
    });

    // Create cancellation record
    await prisma.bookingCancellation.create({
      data: {
        bookingId,
        reason,
        cancelledBy: session.user.id,
        cancellationFee,
        refundAmount,
        cancellationDate: new Date()
      }
    });

    // Send cancellation confirmation email
    try {
      await sendEmail({
        to: cancelledBooking.user.email!,
        subject: '𓇳 Booking Cancellation - Cleopatra Dahabiyat 𓇳',
        template: 'booking-cancellation',
        data: {
          user: cancelledBooking.user,
          booking: cancelledBooking,
          reason,
          cancellationFee,
          refundAmount,
          dahabiya: cancelledBooking.dahabiya,
          package: cancelledBooking.package,
          daysUntilStart
        }
      });
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }

    // Notify admin about cancellation
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@cleopatra-dahabiyat.com',
        subject: 'Booking Cancellation Notification',
        template: 'admin-booking-cancellation',
        data: {
          booking: cancelledBooking,
          user: cancelledBooking.user,
          reason,
          cancellationFee,
          refundAmount,
          dahabiya: cancelledBooking.dahabiya,
          package: cancelledBooking.package
        }
      });
    } catch (adminEmailError) {
      console.error('Failed to send admin cancellation email:', adminEmailError);
    }

    return NextResponse.json({
      success: true,
      booking: cancelledBooking,
      cancellationFee,
      refundAmount,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Booking cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
