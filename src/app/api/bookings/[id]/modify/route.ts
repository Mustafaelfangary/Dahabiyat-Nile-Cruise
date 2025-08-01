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
    const { type, startDate, endDate, guests, specialRequests, priceChange } = body;

    // Fetch existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
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

    // Check if booking can be modified (not cancelled or completed)
    if (['CANCELLED', 'COMPLETED'].includes(existingBooking.status)) {
      return NextResponse.json(
        { error: 'Cannot modify cancelled or completed bookings' },
        { status: 400 }
      );
    }

    let updateData: any = {
      updatedAt: new Date()
    };

    // Handle different modification types
    switch (type) {
      case 'dates':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'Start date and end date are required' },
            { status: 400 }
          );
        }

        // Check availability for new dates
        const availabilityEndpoint = existingBooking.type === 'DAHABIYA'
          ? '/api/availability/dahabiya'
          : '/api/availability/package';
        
        // For now, we'll assume availability is checked on frontend
        // In production, you'd want to verify availability here
        
        updateData.startDate = new Date(startDate);
        updateData.endDate = new Date(endDate);
        
        if (priceChange) {
          updateData.totalPrice = existingBooking.totalPrice + priceChange;
        }
        
        break;

      case 'guests':
        if (!guests || guests < 1) {
          return NextResponse.json(
            { error: 'Valid guest count is required' },
            { status: 400 }
          );
        }
        
        updateData.guests = guests;
        break;

      case 'requests':
        updateData.specialRequests = specialRequests || '';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid modification type' },
          { status: 400 }
        );
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        user: true,
        package: true
      }
    });

    // Create modification log
    await prisma.bookingModification.create({
      data: {
        bookingId,
        modificationType: type.toUpperCase(),
        oldValues: JSON.stringify({
          startDate: existingBooking.startDate,
          endDate: existingBooking.endDate,
          guests: existingBooking.guests,
          specialRequests: existingBooking.specialRequests,
          totalPrice: existingBooking.totalPrice
        }),
        newValues: JSON.stringify(updateData),
        modifiedBy: session.user.id,
        reason: `${type} modification requested by user`
      }
    });

    // Send modification confirmation email
    try {
      await sendEmail({
        to: updatedBooking.user.email!,
        subject: '𓇳 Booking Modified - Cleopatra Dahabiyat 𓇳',
        template: 'booking-modification',
        data: {
          user: updatedBooking.user,
          booking: updatedBooking,
          modificationType: type,
          package: updatedBooking.package
        }
      });
    } catch (emailError) {
      console.error('Failed to send modification email:', emailError);
      // Don't fail the modification if email fails
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking modified successfully'
    });

  } catch (error) {
    console.error('Booking modification error:', error);
    return NextResponse.json(
      { error: 'Failed to modify booking' },
      { status: 500 }
    );
  }
}
