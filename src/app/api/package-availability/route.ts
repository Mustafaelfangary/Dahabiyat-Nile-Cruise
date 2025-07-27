import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityService } from '@/lib/services/availability-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageId, startDate, endDate, guests } = body;

    if (!packageId || !startDate || !endDate || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get all dahabiyat to check availability for package
    const dahabiyat = await prisma.dahabiya.findMany({
      where: {
        // Only include active dahabiyat
        // You can add more filters here based on package requirements
      },
      select: {
        id: true,
        name: true,
        pricePerDay: true,
        capacity: true,
      }
    });

    if (dahabiyat.length === 0) {
      return NextResponse.json({
        isAvailable: false,
        message: 'No dahabiyat available for packages',
        availableDahabiyat: [],
        totalPrice: 0
      });
    }

    // Check availability for each dahabiya
    const availabilityChecks = await Promise.all(
      dahabiyat.map(async (dahabiya) => {
        try {
          const availability = await AvailabilityService.checkAvailability({
            dahabiyaId: dahabiya.id,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            guests: parseInt(guests),
          });

          return {
            dahabiya,
            availability,
            isAvailable: availability.isAvailable
          };
        } catch (error) {
          console.error(`Error checking availability for dahabiya ${dahabiya.id}:`, error);
          return {
            dahabiya,
            availability: { isAvailable: false, totalPrice: 0, availableCabins: [] },
            isAvailable: false
          };
        }
      })
    );

    // Filter available dahabiyat
    const availableDahabiyat = availabilityChecks.filter(check => check.isAvailable);

    if (availableDahabiyat.length === 0) {
      return NextResponse.json({
        isAvailable: false,
        message: 'No dahabiyat available for the selected dates. Please choose different dates.',
        availableDahabiyat: [],
        totalPrice: 0
      });
    }

    // Find the best option (lowest price or highest capacity)
    const recommendedOption = availableDahabiyat.reduce((best, current) => {
      // Prefer dahabiya with sufficient capacity and best price
      if (current.dahabiya.capacity >= guests) {
        if (!best || current.availability.totalPrice < best.availability.totalPrice) {
          return current;
        }
      }
      return best;
    }, null as any);

    const finalRecommended = recommendedOption || availableDahabiyat[0];

    return NextResponse.json({
      isAvailable: true,
      message: `Package available! Recommended vessel: ${finalRecommended.dahabiya.name}`,
      availableDahabiyat: availableDahabiyat.map(check => ({
        id: check.dahabiya.id,
        name: check.dahabiya.name,
        pricePerDay: check.dahabiya.pricePerDay,
        capacity: check.dahabiya.capacity,
        totalPrice: check.availability.totalPrice,
        availableCabins: check.availability.availableCabins
      })),
      recommendedDahabiyaId: finalRecommended.dahabiya.id,
      totalPrice: finalRecommended.availability.totalPrice,
      packageDetails: {
        packageId,
        startDate,
        endDate,
        guests,
        recommendedVessel: finalRecommended.dahabiya.name
      }
    });

  } catch (error) {
    console.error('Package availability check error:', error);
    return NextResponse.json(
      { error: 'Error checking package availability' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const packageId = searchParams.get('packageId');
    const month = parseInt(searchParams.get('month') || '0');
    const year = parseInt(searchParams.get('year') || '2025');

    if (!packageId) {
      return NextResponse.json(
        { error: 'Missing packageId' },
        { status: 400 }
      );
    }

    // Get availability calendar for all dahabiyat for this package
    const dahabiyat = await prisma.dahabiya.findMany({
      select: { id: true, name: true }
    });

    const calendars = await Promise.all(
      dahabiyat.map(async (dahabiya) => {
        try {
          const calendar = await AvailabilityService.getAvailabilityCalendar(
            dahabiya.id,
            month,
            year
          );
          return {
            dahabiyaId: dahabiya.id,
            dahabiyaName: dahabiya.name,
            calendar
          };
        } catch (error) {
          console.error(`Error fetching calendar for dahabiya ${dahabiya.id}:`, error);
          return {
            dahabiyaId: dahabiya.id,
            dahabiyaName: dahabiya.name,
            calendar: []
          };
        }
      })
    );

    return NextResponse.json({
      packageId,
      month,
      year,
      dahabiyatCalendars: calendars
    });

  } catch (error) {
    console.error('Package calendar fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching package availability calendar' },
      { status: 500 }
    );
  }
}
