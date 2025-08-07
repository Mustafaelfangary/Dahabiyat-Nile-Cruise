import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

// Clean unified booking validation schema
export const bookingSchema = z.object({
  type: z.enum(['DAHABIYA', 'PACKAGE']),
  dahabiyaId: z.string().optional(),
  packageId: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  guests: z.number().min(1, "At least 1 guest is required"),
  specialRequests: z.string().optional(),
  totalPrice: z.number().min(0, "Total price must be positive"),
  guestDetails: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    age: z.number().optional(),
    nationality: z.string().optional(),
  })).min(1, "At least one guest is required"),
});

export type BookingData = z.infer<typeof bookingSchema>;

export interface BookingResult {
  success: boolean;
  booking?: any;
  error?: string;
}

export class CleanBookingService {
  /**
   * Create a new booking (dahabiya or package)
   */
  static async createBooking(userId: string, data: BookingData): Promise<BookingResult> {
    try {
      // Validate input data
      const validatedData = bookingSchema.parse(data);
      
      // Verify the item exists and get details
      let itemDetails: any = null;
      if (validatedData.type === 'DAHABIYA' && validatedData.dahabiyaId) {
        itemDetails = await prisma.dahabiya.findUnique({
          where: { id: validatedData.dahabiyaId },
          select: { id: true, name: true, pricePerDay: true, capacity: true }
        });
        if (!itemDetails) {
          return { success: false, error: 'Dahabiya not found' };
        }
      } else if (validatedData.type === 'PACKAGE' && validatedData.packageId) {
        itemDetails = await prisma.package.findUnique({
          where: { id: validatedData.packageId },
          select: { id: true, name: true, price: true, maxGuests: true }
        });
        if (!itemDetails) {
          return { success: false, error: 'Package not found' };
        }
      } else {
        return { success: false, error: 'Invalid booking type or missing item ID' };
      }

      // Validate guest capacity
      const maxCapacity = validatedData.type === 'DAHABIYA' ? itemDetails.capacity : itemDetails.maxGuests;
      if (validatedData.guests > maxCapacity) {
        return { 
          success: false, 
          error: `Maximum ${maxCapacity} guests allowed for this ${validatedData.type.toLowerCase()}` 
        };
      }

      // Generate unique booking reference
      const bookingReference = `${validatedData.type.charAt(0)}${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

      // Create booking with guest details
      const booking = await prisma.booking.create({
        data: {
          userId,
          type: validatedData.type,
          dahabiyaId: validatedData.dahabiyaId,
          packageId: validatedData.packageId,
          startDate: new Date(validatedData.startDate),
          endDate: new Date(validatedData.endDate),
          guests: validatedData.guests,
          totalPrice: validatedData.totalPrice,
          specialRequests: validatedData.specialRequests,
          status: 'PENDING',
          bookingReference,
          guestDetails: validatedData.guestDetails ? {
            create: validatedData.guestDetails
          } : undefined,
        },
        include: {
          dahabiya: {
            select: {
              id: true,
              name: true,
              mainImageUrl: true,
              pricePerDay: true
            }
          },
          package: {
            select: {
              id: true,
              name: true,
              mainImageUrl: true,
              price: true
            }
          },
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

      // Send confirmation emails
      await this.sendBookingEmails(booking, itemDetails);

      return { success: true, booking };
    } catch (error) {
      console.error('Booking creation error:', error);
      if (error instanceof z.ZodError) {
        return { 
          success: false, 
          error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') 
        };
      }
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create booking' 
      };
    }
  }

  /**
   * Get user bookings
   */
  static async getUserBookings(userId: string) {
    return await prisma.booking.findMany({
      where: { userId },
      include: {
        dahabiya: {
          select: {
            id: true,
            name: true,
            mainImageUrl: true,
            pricePerDay: true
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            mainImageUrl: true,
            price: true
          }
        },
        guestDetails: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get all bookings (admin only)
   */
  static async getAllBookings() {
    return await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        dahabiya: {
          select: {
            id: true,
            name: true,
            mainImageUrl: true,
            pricePerDay: true
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            mainImageUrl: true,
            price: true
          }
        },
        guestDetails: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(bookingId: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') {
    try {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          dahabiya: {
            select: {
              id: true,
              name: true,
              mainImageUrl: true
            }
          },
          package: {
            select: {
              id: true,
              name: true,
              mainImageUrl: true
            }
          }
        }
      });

      // Send status update email
      await this.sendStatusUpdateEmail(booking);

      return { success: true, booking };
    } catch (error) {
      console.error('Status update error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update booking status' 
      };
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(bookingId: string, userId?: string) {
    try {
      const whereClause = userId 
        ? { id: bookingId, userId } // User can only cancel their own bookings
        : { id: bookingId }; // Admin can cancel any booking

      const booking = await prisma.booking.update({
        where: whereClause,
        data: { status: 'CANCELLED' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          dahabiya: {
            select: {
              id: true,
              name: true
            }
          },
          package: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      // Send cancellation email
      await this.sendCancellationEmail(booking);

      return { success: true, booking };
    } catch (error) {
      console.error('Booking cancellation error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to cancel booking' 
      };
    }
  }

  /**
   * Send booking confirmation emails
   */
  private static async sendBookingEmails(booking: any, itemDetails: any) {
    try {
      const itemName = booking.type === 'DAHABIYA' ? itemDetails.name : itemDetails.name;
      const startDate = new Date(booking.startDate).toLocaleDateString();
      const endDate = new Date(booking.endDate).toLocaleDateString();

      // Email to customer
      await sendEmail({
        to: booking.user.email,
        subject: `Booking Confirmation - ${booking.bookingReference}`,
        html: `
          <h2>Booking Confirmation</h2>
          <p>Dear ${booking.user.name},</p>
          <p>Your booking has been received and is being processed.</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>Booking Details</h3>
            <p><strong>Reference:</strong> ${booking.bookingReference}</p>
            <p><strong>Type:</strong> ${booking.type}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Dates:</strong> ${startDate} - ${endDate}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
            <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          </div>
          <p>We will contact you shortly to confirm your booking.</p>
          <p>Best regards,<br>Cleopatra Dahabiyat Team</p>
        `
      });
    } catch (error) {
      console.error('Email sending error:', error);
    }
  }

  /**
   * Send status update email
   */
  private static async sendStatusUpdateEmail(booking: any) {
    try {
      const itemName = booking.dahabiya?.name || booking.package?.name;
      const startDate = new Date(booking.startDate).toLocaleDateString();

      await sendEmail({
        to: booking.user.email,
        subject: `Booking Update - ${booking.bookingReference}`,
        html: `
          <h2>Booking Status Update</h2>
          <p>Dear ${booking.user.name},</p>
          <p>Your booking status has been updated to: <strong>${booking.status}</strong></p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Reference:</strong> ${booking.bookingReference}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
          </div>
          <p>Best regards,<br>Cleopatra Dahabiyat Team</p>
        `
      });
    } catch (error) {
      console.error('Status update email error:', error);
    }
  }

  /**
   * Send cancellation email
   */
  private static async sendCancellationEmail(booking: any) {
    try {
      const itemName = booking.dahabiya?.name || booking.package?.name;

      await sendEmail({
        to: booking.user.email,
        subject: `Booking Cancelled - ${booking.bookingReference}`,
        html: `
          <h2>Booking Cancellation</h2>
          <p>Dear ${booking.user.name},</p>
          <p>Your booking has been cancelled.</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Reference:</strong> ${booking.bookingReference}</p>
            <p><strong>Item:</strong> ${itemName}</p>
          </div>
          <p>Best regards,<br>Cleopatra Dahabiyat Team</p>
        `
      });
    } catch (error) {
      console.error('Cancellation email error:', error);
    }
  }
}
