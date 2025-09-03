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
    name: z.string().min(1, "Name is required").optional(), // For backward compatibility
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Valid email is required").optional(),
    phone: z.string().optional(),
    age: z.number().optional(),
    nationality: z.string().optional(),
    dateOfBirth: z.string().optional(),
    passport: z.string().optional(),
    dietaryRequirements: z.array(z.string()).optional(),
  })).optional().default([]),
});

export type BookingData = z.infer<typeof bookingSchema>;

export interface BookingResult {
  success: boolean;
  booking?: {
    id: string;
    bookingReference: string;
    type: string;
    status: string;
    startDate: Date;
    endDate: Date;
    guests: number;
    totalPrice: number;
    [key: string]: unknown;
  };
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
        let itemDetails: {
          id: string;
          name: string;
          pricePerDay?: number;
          price?: number;
          capacity?: number;
          maxGuests?: number;
          isActive?: boolean;
          mainImage?: string;
          mainImageUrl?: string;
          durationDays?: number;
        } | null = null;
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
            // Split name into firstName and lastName
            const nameParts = user.name.trim().split(' ');
            const firstName = nameParts[0] || 'Guest';
            const lastName = nameParts.slice(1).join(' ') || 'User';

            guestDetailsToCreate = [{
              firstName,
              lastName,
              dateOfBirth: new Date('1990-01-01'), // Default date of birth
              nationality: 'Unknown', // Default nationality
              passport: null,
              dietaryRequirements: []
            }];
          }
        } else {
          // Transform existing guest details to match schema
          guestDetailsToCreate = guestDetailsToCreate.map(guest => {
            const nameParts = guest.name?.trim().split(' ') || ['Guest', 'User'];
            const firstName = nameParts[0] || 'Guest';
            const lastName = nameParts.slice(1).join(' ') || 'User';

            return {
              firstName,
              lastName,
              dateOfBirth: guest.dateOfBirth ? new Date(guest.dateOfBirth) : new Date('1990-01-01'),
              nationality: guest.nationality || 'Unknown',
              passport: guest.passport || null,
              dietaryRequirements: guest.dietaryRequirements || []
            };
          });
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

      // Create admin notification in database
      try {
        await this.createAdminNotification(result.booking, result.itemDetails);
      } catch (notificationError) {
        console.error('Failed to create admin notification:', notificationError);
        // Don't fail the booking if notification fails
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
    try {
      console.log("📋 Fetching all bookings from database...");

      const bookings = await prisma.booking.findMany({
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

      console.log(`✅ Successfully fetched ${bookings.length} bookings`);
      return bookings;

    } catch (error) {
      console.error("❌ Error in getAllBookings:", error);
      throw new Error(`Failed to fetch bookings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
  private static async sendBookingEmails(booking: Record<string, unknown>, itemDetails: Record<string, unknown>) {
    try {
      console.log('📧 Sending booking confirmation emails...');

      // Prepare email data
      const emailData = {
        user: booking.user,
        booking: {
          ...booking,
          bookingReference: booking.bookingReference,
          startDate: booking.startDate,
          endDate: booking.endDate,
          guests: booking.guests,
          totalPrice: booking.totalPrice,
          status: booking.status,
          specialRequests: booking.specialRequests
        },
        ...(booking.type === 'DAHABIYA' ? { dahabiya: itemDetails } : { package: itemDetails })
      };

      // Send customer confirmation email
      console.log('📧 Sending customer confirmation email to:', booking.user.email);
      if (booking.type === 'PACKAGE') {
        await sendEmail({
          to: booking.user.email,
          subject: '🏺 Your Sacred Journey Awaits - Package Booking Confirmed',
          template: 'package-booking-confirmation',
          data: emailData
        });
      } else {
        await sendEmail({
          to: booking.user.email,
          subject: '🏺 Your Sacred Journey Awaits - Booking Confirmed',
          template: 'booking-confirmation',
          data: emailData
        });
      }

      // Send admin notification email
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@cleopatra-dahabiyat.com';
      console.log('📧 Sending admin notification email to:', adminEmail);

      if (booking.type === 'PACKAGE') {
        await sendEmail({
          to: adminEmail,
          subject: `🚨 New Package Booking Received - ${booking.bookingReference}`,
          template: 'admin-package-booking-notification',
          data: emailData
        });
      } else {
        await sendEmail({
          to: adminEmail,
          subject: `🚨 New Dahabiya Booking Received - ${booking.bookingReference}`,
          template: 'admin-booking-notification',
          data: emailData
        });
      }

      console.log('✅ All booking emails sent successfully');
    } catch (error) {
      console.error('❌ Email sending error:', error);
      throw error; // Re-throw to see the actual error
    }
  }

  /**
   * Create admin notification in database
   */
  private static async createAdminNotification(booking: Record<string, unknown>, itemDetails: Record<string, unknown>) {
    try {
      console.log('🔔 Creating admin notification for booking:', booking.bookingReference);

      const itemName = booking.type === 'DAHABIYA' ? itemDetails.name : itemDetails.name;

      // Get all admin users
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true }
      });

      if (adminUsers.length === 0) {
        console.log('⚠️ No admin users found, skipping notification creation');
        return;
      }

      // Create notification for each admin user
      const notificationPromises = adminUsers.map(admin =>
        prisma.notification.create({
          data: {
            type: 'BOOKING_CREATED',
            title: `New ${booking.type} Booking Received`,
            message: `${booking.user.name || 'Guest'} booked ${itemName} for ${booking.guests} guests`,
            data: {
              bookingId: booking.id,
              bookingReference: booking.bookingReference,
              customerName: booking.user.name || 'Guest',
              customerEmail: booking.user.email,
              bookingType: booking.type,
              itemName: itemName,
              startDate: booking.startDate,
              endDate: booking.endDate,
              guests: booking.guests,
              totalPrice: booking.totalPrice,
              status: booking.status
            },
            userId: admin.id
          }
        })
      );

      await Promise.all(notificationPromises);
      console.log(`✅ Admin notifications created for ${adminUsers.length} admin users`);
    } catch (error) {
      console.error('❌ Failed to create admin notification:', error);
      throw error;
    }
  }

  /**
   * Send status update email
   */
  private static async sendStatusUpdateEmail(booking: Record<string, unknown>) {
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
  private static async sendCancellationEmail(booking: Record<string, unknown>) {
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
  private static async sendCancellationEmail(booking: Record<string, unknown>): Promise<void> {
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
