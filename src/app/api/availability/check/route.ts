import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityService } from '@/lib/services/availability-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, itemId, startDate, endDate, guests } = body;

    if (!type || !itemId || !startDate || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'dahabiya') {
      if (!endDate) {
        return NextResponse.json(
          { error: 'End date is required for dahabiya bookings' },
          { status: 400 }
        );
      }

      const availability = await AvailabilityService.checkAvailability({
        dahabiyaId: itemId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guests: parseInt(guests),
      });

      return NextResponse.json({
        isAvailable: availability.isAvailable,
        totalPrice: availability.totalPrice,
        message: availability.isAvailable
          ? `Great! The dahabiya is available for your dates.`
          : 'Sorry, the dahabiya is not available for your selected dates. Please try different dates.',
        // availableCabins: availability.availableCabins  // REMOVED: cabin system removed
      });

    } else if (type === 'package') {
      // For packages, we need to check if any dahabiya is available for the package dates
      const packageData = await prisma.package.findUnique({
        where: { id: itemId }
      });

      if (!packageData) {
        return NextResponse.json(
          { error: 'Package not found' },
          { status: 404 }
        );
      }

      // Calculate end date based on package duration
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + packageData.durationDays);

      // Get all dahabiyat
      const dahabiyat = await prisma.dahabiya.findMany({
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
          totalPrice: 0,
          message: 'No dahabiyat available for packages'
        });
      }

      // Check availability for each dahabiya
      const availabilityChecks = await Promise.all(
        dahabiyat.map(async (dahabiya) => {
          try {
            const availability = await AvailabilityService.checkAvailability({
              dahabiyaId: dahabiya.id,
              startDate: start,
              endDate: end,
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
          totalPrice: 0,
          message: 'No dahabiyat available for the selected dates. Please choose different dates.'
        });
      }

      // Find the best option (sufficient capacity and best price)
      const recommendedOption = availableDahabiyat.find(check =>
        check.dahabiya.capacity >= guests
      ) || availableDahabiyat[0];

      if (!recommendedOption) {
        return NextResponse.json({
          isAvailable: false,
          message: 'No dahabiyat available for the selected dates'
        });
      }

      // Calculate package price (base package price + dahabiya cost)
      const dahabiyaCost = Number(recommendedOption.availability.totalPrice);
      const packagePrice = Number(packageData.price) * guests;
      const totalPrice = packagePrice + dahabiyaCost;

      return NextResponse.json({
        isAvailable: true,
        totalPrice,
        message: `Package available! Recommended vessel: ${recommendedOption.dahabiya.name}`,
        recommendedDahabiya: {
          id: recommendedOption.dahabiya.id,
          name: recommendedOption.dahabiya.name,
          capacity: recommendedOption.dahabiya.capacity
        }
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "dahabiya" or "package"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Error checking availability' },
      { status: 500 }
    );
  }
}
