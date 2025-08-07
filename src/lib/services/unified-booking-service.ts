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
  })).optional().default([]),
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

      // Use database transaction to ensure atomicity between availability check and booking creation
      const result = await prisma.$transaction(async (tx) => {
        // Verify the item exists and get details
        let itemDetails: any = null;
        if (validatedData.type === 'DAHABIYA' && validatedData.dahabiyaId) {
          itemDetails = await tx.dahabiya.findUnique({
            where: { id: validatedData.dahabiyaId },
            select: { id: true, name: true, pricePerDay: true, capacity: true, isActive: true, mainImage: true }
          });
          if (!itemDetails) {
            throw new Error('Dahabiya not found');
          }
          if (!itemDetails.isActive) {
            throw new Error('Dahabiya is not currently available for booking');
          }
        } else if (validatedData.type === 'PACKAGE' && validatedData.packageId) {
          itemDetails = await tx.package.findUnique({
            where: { id: validatedData.packageId },
            select: { id: true, name: true, price: true, mainImageUrl: true, durationDays: true }
          });
          if (!itemDetails) {
            throw new Error('Package not found');
          }
          // For packages, set a reasonable default max guests
          itemDetails.maxGuests = itemDetails.maxGuests || 50;
        } else {
          throw new Error('Invalid booking type or missing item ID');
        }

        // Validate guest capacity
        const maxCapacity = validatedData.type === 'DAHABIYA' ? itemDetails.capacity : itemDetails.maxGuests;
        if (validatedData.guests > maxCapacity) {
          throw new Error(`Maximum ${maxCapacity} guests allowed for this ${validatedData.type.toLowerCase()}`);
        }

        // ATOMIC AVAILABILITY CHECK - Check for conflicts within the same transaction
        const startDate = new Date(validatedData.startDate);
        const endDate = new Date(validatedData.endDate);

        // Validate dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
          throw new Error('Start date cannot be in the past');
        }

        if (startDate >= endDate) {
          throw new Error('End date must be after start date');
        }

        // Check for conflicting bookings within the transaction
        const conflictingBookings = await tx.booking.findMany({
          where: {
            ...(validatedData.type === 'DAHABIYA' ? { dahabiyaId: validatedData.dahabiyaId } : { packageId: validatedData.packageId }),
            status: { in: ['PENDING', 'CONFIRMED'] },
            OR: [
              {
                startDate: { lte: startDate },
                endDate: { gt: startDate }
              },
              {
                startDate: { lt: endDate },
                endDate: { gte: endDate }
              },
              {
                startDate: { gte: startDate },
                endDate: { lte: endDate }
              }
            ]
          }
        });

        if (conflictingBookings.length > 0) {
          throw new Error('Selected dates are not available. Please choose different dates.');
        }

        // Check admin-set unavailable dates for dahabiyas
        if (validatedData.type === 'DAHABIYA') {
          const unavailableDates = await tx.availabilityDate.findMany({
            where: {
              dahabiyaId: validatedData.dahabiyaId,
              date: {
                gte: startDate,
                lt: endDate
              },
              available: false
            }
          });

          if (unavailableDates.length > 0) {
            throw new Error('Some dates in your selection are marked as unavailable');
          }
        }

        // Generate unique booking reference
        const bookingReference = `${validatedData.type.charAt(0)}${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

        // Get user details for default guest if no guest details provided
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true }
        });

        // If no guest details provided, create a default guest from user info
        let guestDetailsToCreate = validatedData.guestDetails;
        if (!guestDetailsToCreate || guestDetailsToCreate.length === 0) {
          if (user?.name && user?.email) {
            guestDetailsToCreate = [{
              name: user.name,
              email: user.email
            }];
          }
        }

        // Create booking with guest details
        const booking = await tx.booking.create({
          data: {
            userId,
            type: validatedData.type,
            dahabiyaId: validatedData.dahabiyaId,
            packageId: validatedData.packageId,
            startDate,
            endDate,
            guests: validatedData.guests,
            totalPrice: validatedData.totalPrice,
            specialRequests: validatedData.specialRequests,
            status: 'PENDING',
            bookingReference,
            guestDetails: guestDetailsToCreate && guestDetailsToCreate.length > 0 ? {
              create: guestDetailsToCreate
            } : undefined,
          },
          include: {
            dahabiya: {
              select: {
                id: true,
                name: true,
                mainImage: true,
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

        return { booking, itemDetails };
      });

      // Send confirmation emails outside transaction to avoid blocking
      try {
        await this.sendBookingEmails(result.booking, result.itemDetails);
      } catch (emailError) {
        console.error('Failed to send booking emails:', emailError);
        // Don't fail the booking if email fails
      }

      return { success: true, booking: result.booking };
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
   * Get booking by ID with authorization check
   */
  static async getBookingById(bookingId: string, userId: string) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          dahabiya: {
            select: {
              id: true,
              name: true,
              mainImage: true,
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

      if (!booking) {
        return null;
      }

      // Check authorization - user can only see their own bookings unless they're admin
      if (booking.userId !== userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
          return null; // Unauthorized
        }
      }

      return booking;
    } catch (error) {
      console.error('Get booking by ID error:', error);
      return null;
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
            mainImage: true,
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
   * Cancel booking with authorization check
   */
  static async cancelBooking(bookingId: string, userId: string): Promise<BookingResult> {
    try {
      // Verify booking belongs to user or user is admin
      const existingBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { user: true }
      });

      if (!existingBooking) {
        return { success: false, error: 'Booking not found' };
      }

      if (existingBooking.userId !== userId) {
        // Check if user is admin
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
          return { success: false, error: 'Unauthorized to cancel this booking' };
        }
      }

      // Update booking status to cancelled
      const result = await this.updateBookingStatus(bookingId, 'CANCELLED');

      if (result.success) {
        // Send cancellation email
        try {
          await this.sendCancellationEmail(result.booking);
        } catch (emailError) {
          console.error('Failed to send cancellation email:', emailError);
          // Don't fail the cancellation if email fails
        }
      }

      return result;
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

  /**
   * Send booking cancellation email
   */
  private static async sendCancellationEmail(booking: any): Promise<void> {
    try {
      const itemName = booking.dahabiya?.name || booking.package?.name || 'Unknown Item';

      await sendEmail({
        to: booking.user.email,
        subject: `Booking Cancelled - ${booking.bookingReference}`,
        html: `
          <h2>Booking Cancellation</h2>
          <p>Dear ${booking.user.name},</p>
          <p>Your booking has been cancelled.</p>

          <h3>Cancelled Booking Details:</h3>
          <ul>
            <li><strong>Reference:</strong> ${booking.bookingReference}</li>
            <li><strong>Item:</strong> ${itemName}</li>
            <li><strong>Dates:</strong> ${booking.startDate.toDateString()} - ${booking.endDate.toDateString()}</li>
            <li><strong>Guests:</strong> ${booking.guests}</li>
            <li><strong>Total Price:</strong> $${booking.totalPrice}</li>
          </ul>

          <p>If you have any questions about this cancellation, please contact us.</p>
          <p>Thank you for your understanding.</p>
        `
      });
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
      throw error;
    }
  }
}
