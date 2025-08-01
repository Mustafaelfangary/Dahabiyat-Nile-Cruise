import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      includeAlternatives = true 
    } = body;

    if (!type || !itemId || !startDate || !endDate || !guests) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Validate dates
    if (start < today) {
      return NextResponse.json({
        isAvailable: false,
        message: 'Start date cannot be in the past',
        totalPrice: 0
      });
    }

    if (start >= end) {
      return NextResponse.json({
        isAvailable: false,
        message: 'End date must be after start date',
        totalPrice: 0
      });
    }

    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (type === 'PACKAGE') {
      return await checkPackageAvailability({
        packageId: itemId,
        startDate: start,
        endDate: end,
        guests,
        durationDays,
        excludeBookingId,
        includeAlternatives
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be PACKAGE' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Enhanced availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}








async function checkPackageAvailability({
  packageId,
  startDate,
  endDate,
  guests,
  durationDays,
  excludeBookingId,
  includeAlternatives
}: {
  packageId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  durationDays: number;
  excludeBookingId?: string;
  includeAlternatives: boolean;
}) {
  // Fetch package details
  const packageData = await prisma.package.findUnique({
    where: { id: packageId }
  });

  if (!packageData) {
    return NextResponse.json({
      isAvailable: false,
      message: 'Package not found',
      totalPrice: 0
    });
  }

  // Check if duration matches package duration
  if (durationDays !== packageData.durationDays) {
    return NextResponse.json({
      isAvailable: false,
      message: `Package duration is ${packageData.durationDays} days, but ${durationDays} days requested`,
      totalPrice: 0,
      requiredDuration: packageData.durationDays
    });
  }

  // For packages, check if there are conflicting package bookings
  const conflictingBookings = await prisma.booking.count({
    where: {
      packageId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
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

  const isAvailable = conflictingBookings === 0;
  const basePrice = Number(packageData.price || 0);
  let totalPrice = basePrice * guests;

  // Apply seasonal pricing for packages
  const month = startDate.getMonth() + 1;
  if ([12, 1, 2].includes(month)) {
    totalPrice *= 1.2; // 20% increase for peak season
  } else if ([6, 7, 8].includes(month)) {
    totalPrice *= 0.9; // 10% discount for low season
  }

  const result: any = {
    isAvailable,
    totalPrice: Math.round(totalPrice),
    basePrice,
    pricePerPerson: guests > 0 ? Math.round(totalPrice / guests) : 0,
    packageId: packageData.id,
    packageName: packageData.name
  };

  if (!isAvailable) {
    result.message = 'Package is not available for selected dates';

    if (includeAlternatives) {
      // Alternative dates logic could be implemented here
      result.alternativeDates = [];
    }
  } else {
    result.message = 'Package is available for selected dates';
  }

  return NextResponse.json(result);
}




