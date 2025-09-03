'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bookingStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
});

export async function updateBookingStatus(formData: FormData) {
  const validated = bookingStatusSchema.parse({
    id: formData.get('id'),
    status: formData.get('status'),
  });

  try {
    const booking = await prisma.booking.update({
      where: { id: validated.id },
      data: { status: validated.status },
    });

    // Revalidate both the bookings list and dashboard stats
    revalidatePath('/dashboard/bookings');
    revalidatePath('/dashboard');
    
    return { success: true, data: booking };
  } catch {
    return { success: false, error: 'Failed to update booking status' };
  }
}

export async function getBookingStats() {
  try {
    const bookings = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        _all: true
      }
    });

    const stats = {
      totalBookings: 0,
      confirmedBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0
    };

    bookings.forEach(booking => {
      stats.totalBookings += booking._count._all;
      switch (booking.status) {
        case 'CONFIRMED':
          stats.confirmedBookings = booking._count._all;
          break;
        case 'PENDING':
          stats.pendingBookings = booking._count._all;
          break;
        case 'CANCELLED':
          stats.cancelledBookings = booking._count._all;
          break;
      }
    });

    return { success: true, data: stats };
  } catch {
    return { success: false, error: 'Failed to fetch booking stats' };
  }
}