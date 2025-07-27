import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Unified booking validation schema
export const bookingSchema = z.object({
  type: z.enum(['DAHABIYA', 'PACKAGE']),
  dahabiyaId: z.string().optional(),
  packageId: z.string().optional(),
  cabinId: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  guests: z.number().min(1, "At least 1 guest is required"),
  specialRequests: z.string().optional(),
  totalPrice: z.number().min(0, "Total price must be positive"),
  guestDetails: z.array(z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    age: z.number().optional(),
    nationality: z.string().optional(),
  })).optional(),
});

export type BookingData = z.infer<typeof bookingSchema>;

export class UnifiedBookingService {
  /**
   * Create a new booking (dahabiya or package)
   */
  static async createBooking(userId: string, data: BookingData) {
    const validatedData = bookingSchema.parse(data);
    
    // Verify the item exists
    if (validatedData.type === 'DAHABIYA' && validatedData.dahabiyaId) {
      const dahabiya = await prisma.dahabiya.findUnique({
        where: { id: validatedData.dahabiyaId },
      });
      if (!dahabiya) {
        throw new Error('Dahabiya not found');
      }
    } else if (validatedData.type === 'PACKAGE' && validatedData.packageId) {
      const packageItem = await prisma.package.findUnique({
        where: { id: validatedData.packageId },
      });
      if (!packageItem) {
        throw new Error('Package not found');
      }
    }

    // Create booking with guest details if provided
    const booking = await prisma.booking.create({
      data: {
        userId,
        type: validatedData.type,
        dahabiyaId: validatedData.dahabiyaId,
        packageId: validatedData.packageId,
        cabinId: validatedData.cabinId,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        guests: validatedData.guests,
        totalPrice: validatedData.totalPrice,
        specialRequests: validatedData.specialRequests,
        status: 'PENDING',
        bookingReference: `${validatedData.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        guestDetails: validatedData.guestDetails ? {
          create: validatedData.guestDetails
        } : undefined,
      },
      include: {
        dahabiya: {
          include: {
            images: { take: 1 }
          }
        },
        package: true,
        guestDetails: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return booking;
  }

  /**
   * Get user bookings
   */
  static async getUserBookings(userId: string) {
    return await prisma.booking.findMany({
      where: { userId },
      include: {
        dahabiya: {
          include: {
            images: { take: 1 }
          }
        },
        package: true,
        guestDetails: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(bookingId: string, status: string) {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as any },
      include: {
        dahabiya: true,
        package: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Get all bookings (admin)
   */
  static async getAllBookings(filters?: any) {
    return await prisma.booking.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        dahabiya: {
          select: {
            id: true,
            name: true,
            pricePerDay: true
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            price: true,
            durationDays: true
          }
        },
        guestDetails: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}