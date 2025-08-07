import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CleanBookingService } from "@/lib/services/unified-booking-service";
import { CleanAvailabilityService } from "@/lib/services/availability-service";

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
    console.log("📝 Received booking request:", body);

    // Determine booking type and prepare data
    const bookingType = body.packageId ? 'PACKAGE' : 'DAHABIYA';
    const itemId = body.packageId || body.dahabiyaId;
    
    if (!itemId) {
      return NextResponse.json(
        { error: "Missing dahabiya or package ID" },
        { status: 400 }
      );
    }

    const bookingData = {
      type: bookingType as 'DAHABIYA' | 'PACKAGE',
      dahabiyaId: body.dahabiyaId,
      packageId: body.packageId,
      startDate: body.startDate,
      endDate: body.endDate,
      guests: Number(body.guests) || 0,
      specialRequests: body.specialRequests || '',
      totalPrice: Number(body.totalPrice) || 0,
      guestDetails: body.guestDetails || [],
    };

    // Check availability using clean availability service
    console.log("🔍 Checking availability...");
    const availability = await CleanAvailabilityService.checkAvailability({
      type: bookingType,
      itemId,
      startDate: new Date(bookingData.startDate),
      endDate: new Date(bookingData.endDate),
      guests: bookingData.guests,
    });

    if (!availability.isAvailable) {
      console.log("❌ Not available:", availability.message);
      return NextResponse.json(
        { error: availability.message },
        { status: 400 }
      );
    }

    console.log("✅ Available! Total price:", availability.totalPrice);

    // Create the booking using clean booking service
    console.log("📝 Creating booking...");
    const result = await CleanBookingService.createBooking(session.user.id, bookingData);

    if (!result.success) {
      console.log("❌ Booking creation failed:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log("✅ Booking created successfully:", result.booking.bookingReference);
    return NextResponse.json(result.booking);

  } catch (error) {
    console.error("❌ Booking creation error:", error);
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
      console.log("📋 Admin fetching all bookings");
      const bookings = await CleanBookingService.getAllBookings();
      return NextResponse.json({ bookings });
    } else {
      // Regular users get only their bookings
      console.log("📋 User fetching their bookings");
      const bookings = await CleanBookingService.getUserBookings(session.user.id);
      return NextResponse.json({ bookings });
    }
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
