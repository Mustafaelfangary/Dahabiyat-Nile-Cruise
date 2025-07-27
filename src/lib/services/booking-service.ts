import { prisma } from '@/lib/prisma';
import { AvailabilityService } from './availability-service';
import { sendEmail } from '@/lib/email';

export interface BookingModification {
  bookingId: string;
  startDate?: Date;
  endDate?: Date;
  guests?: number;
  specialRequests?: string;
}

export class BookingService {
  static async modifyBooking({
    bookingId,
    startDate,
    endDate,
    guests,
    specialRequests,
  }: BookingModification) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        dahabiya: true,
        user: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check if new dates are available
    if (startDate || endDate) {
      const availability = await AvailabilityService.checkAvailability({
        dahabiyaId: booking.dahabiyaId!,
        startDate: startDate || booking.startDate,
        endDate: endDate || booking.endDate,
        guests: guests || booking.guests,
      });

      if (!availability.isAvailable) {
        throw new Error('Selected dates are not available');
      }
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        startDate: startDate || booking.startDate,
        endDate: endDate || booking.endDate,
        guests: guests || booking.guests,
        specialRequests: specialRequests || booking.specialRequests,
      },
      include: {
        dahabiya: true,
        user: true,
      },
    });

    // Send email notification
    await sendEmail({
      to: booking.user.email!,
      subject: 'Booking Modification Confirmation',
      template: 'booking-modification',
      data: {
        booking: updatedBooking,
        user: booking.user,
      },
    });

    return updatedBooking;
  }

  static async cancelBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
      },
    });

    // Send cancellation email
    await sendEmail({
      to: booking.user.email!,
      subject: 'Booking Cancellation Confirmation',
      template: 'booking-cancellation',
      data: {
        booking,
        user: booking.user,
      },
    });

    return updatedBooking;
  }

  static async getBookingDetails(bookingId: string) {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        // dahabiya: true,  // REMOVED: dahabiya relation removed
        // cabin: true,     // REMOVED: cabin relation removed
        user: true,
        payment: true,
        guestDetails: true,
      },
    });
  }
} 