import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { Status } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AvailabilityService } from "@/lib/services/availability-service";
import { UnifiedBookingService, bookingSchema } from "@/lib/services/unified-booking-service";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in to make a booking" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Received booking request:", body);

    // Prepare booking data for unified service
    const bookingData = {
      type: 'DAHABIYA' as const,
      dahabiyaId: body.dahabiyaId,
      cabinId: body.cabinId,
      startDate: body.startDate,
      endDate: body.endDate,
      guests: Number(body.guests) || 0,
      specialRequests: body.specialRequests,
      totalPrice: Number(body.totalPrice) || 0,
      guestDetails: body.guestDetails,
    };

    // Check availability using the AvailabilityService
    const availability = await AvailabilityService.checkAvailability({
      dahabiyaId: bookingData.dahabiyaId!,
      startDate: new Date(bookingData.startDate),
      endDate: new Date(bookingData.endDate),
      guests: bookingData.guests,
    });

    if (!availability.isAvailable) {
      return NextResponse.json(
        { error: "Selected dates are not available" },
        { status: 400 }
      );
    }

    // If cabinId is provided, verify it's in the available cabins
    if (bookingData.cabinId) {
      const selectedCabin = availability.availableCabins.find(
        cabin => cabin.id === bookingData.cabinId
      );
      if (!selectedCabin) {
        return NextResponse.json(
          { error: "Selected cabin is not available" },
          { status: 400 }
        );
      }
    }

    // Create the booking using unified service
    const booking = await UnifiedBookingService.createBooking(session.user.id, bookingData);

    // Fetch user data for email notifications
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true }
    });

    // Send confirmation email to customer and admin notification
    try {
      // Get email settings from dashboard
      const emailSettingsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/website-content/email-notifications`);

      // Multiple admin emails for booking notifications
      let adminEmails = [
        'info@dahabiyatnilecruise.com',
        'bookings@dahabiyatnilecruise.com',
        'manager@dahabiyatnilecruise.com'
      ];

      // Try to get admin emails from environment variables
      if (process.env.ADMIN_BOOKING_EMAILS) {
        adminEmails = process.env.ADMIN_BOOKING_EMAILS.split(',').map(email => email.trim());
      }

      let emailEnabled = true;
      let customerNotifications = true;
      let adminNotifications = true;

      // Create in-app notification for all admins
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true }
      });

      for (const admin of adminUsers) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            type: 'BOOKING_CREATED',
            title: 'New Dahabiya Booking',
            message: `New dahabiya booking received. Booking ID: ${booking.id}. Total: $${Number(booking.totalPrice)}`,
            read: false
          }
        });
      }

      if (emailSettingsResponse.ok) {
        const emailData = await emailSettingsResponse.json();
        const fields = emailData.fields || [];

        emailEnabled = fields.find((f: any) => f.key === 'email_enabled')?.value === 'true';
        const adminEmailSetting = fields.find((f: any) => f.key === 'admin_email')?.value;
        if (adminEmailSetting) {
          adminEmails = [adminEmailSetting];
        }
        customerNotifications = fields.find((f: any) => f.key === 'email_customer_notifications')?.value === 'true';
        adminNotifications = fields.find((f: any) => f.key === 'email_admin_notifications')?.value === 'true';
      }

      if (emailEnabled) {
        // Send customer confirmation email
        if (customerNotifications && user?.email) {
          await sendEmail({
            to: user.email,
            subject: '🏺 Booking Confirmation - Dahabiyat Nile Cruise',
            template: 'booking-confirmation',
            data: {
              booking,
              user: user,
              dahabiya: null // Will need to fetch separately if needed
            }
          });
        }

        // Send admin notification emails to all admin addresses
        if (adminNotifications && adminEmails.length > 0) {
          // Send to each admin email
          for (const adminEmail of adminEmails) {
            try {
              await sendEmail({
                to: adminEmail,
                subject: '🚨 New Dahabiya Booking Received',
                template: 'admin-booking-notification',
                data: {
                  booking,
                  user: user,
                  dahabiya: null // Will need to fetch separately if needed
                }
              });
              console.log(`Admin notification sent to: ${adminEmail}`);
            } catch (emailError) {
              console.error(`Failed to send admin notification to ${adminEmail}:`, emailError);
              // Continue sending to other admins even if one fails
            }
          }
        }
      }
    } catch (emailError) {
      console.error('Failed to send booking emails:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Booking creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message).join(", ") },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in to view bookings" },
        { status: 401 }
      );
    }

    // Check if admin is requesting all bookings
    const { searchParams } = new URL(request.url);
    const isAdmin = session.user.role === 'ADMIN';
    const getAllBookings = searchParams.get('all') === 'true';

    if (getAllBookings && isAdmin) {
      // Admin can get all bookings
      const bookings = await prisma.booking.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          // dahabiya: {  // REMOVED: dahabiya relation removed
          //   select: {
          //     name: true,
          //     mainImageUrl: true,
          //   },
          // },
          package: {
            select: {
              name: true,
              mainImageUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ bookings });
    } else {
      // Regular users get only their bookings
      const bookings = await prisma.booking.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          dahabiya: {
            select: {
              name: true,
              mainImageUrl: true,
            },
          },
          package: {
            select: {
              name: true,
              mainImageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return NextResponse.json({ bookings });
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}


