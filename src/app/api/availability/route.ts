import { NextRequest, NextResponse } from "next/server";
import { CleanAvailabilityService } from "@/lib/services/availability-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      itemId,
      startDate,
      endDate,
      guests,
      excludeBookingId,
      includeAlternatives = false
    } = body;

    console.log("🔍 Availability check request:", { type, itemId, startDate, endDate, guests });

    if (!type || !itemId || !startDate || !endDate || !guests) {
      return NextResponse.json(
        { error: 'Missing required parameters: type, itemId, startDate, endDate, guests' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['DAHABIYA', 'PACKAGE'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be DAHABIYA or PACKAGE' },
        { status: 400 }
      );
    }

    // Check availability
    const availability = await CleanAvailabilityService.checkAvailability({
      type,
      itemId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      guests: Number(guests),
      excludeBookingId
    });

    const response: {
      isAvailable: boolean;
      message: string;
      totalPrice: number;
      conflictingBookings?: unknown;
      alternatives?: unknown;
    } = {
      isAvailable: availability.isAvailable,
      message: availability.message,
      totalPrice: availability.totalPrice
    };

    // Include additional data if requested
    if (availability.conflictingBookings) {
      response.conflictingBookings = availability.conflictingBookings;
    }

    // Find alternatives if not available and requested
    if (!availability.isAvailable && includeAlternatives) {
      const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const alternatives = await CleanAvailabilityService.findAlternatives(
        type,
        itemId,
        new Date(startDate),
        duration,
        Number(guests)
      );
      response.alternatives = alternatives;
    }

    console.log("✅ Availability check result:", response.isAvailable ? "Available" : "Not available");
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Availability API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('API Error details:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      {
        error: 'Failed to check availability',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dahabiyaId = searchParams.get('dahabiyaId');
    const startMonth = searchParams.get('startMonth');
    const endMonth = searchParams.get('endMonth');

    if (!dahabiyaId || !startMonth || !endMonth) {
      return NextResponse.json(
        { error: 'Missing required parameters: dahabiyaId, startMonth, endMonth' },
        { status: 400 }
      );
    }

    console.log("📅 Getting available dates for dahabiya:", dahabiyaId);

    const result = await CleanAvailabilityService.getAvailableDates(
      dahabiyaId,
      new Date(startMonth),
      new Date(endMonth)
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    console.log("✅ Available dates retrieved");
    return NextResponse.json({
      unavailableDates: result.unavailableDates
    });

  } catch (error) {
    console.error('❌ Error getting available dates:', error);
    return NextResponse.json(
      { error: 'Failed to get available dates' },
      { status: 500 }
    );
  }
}