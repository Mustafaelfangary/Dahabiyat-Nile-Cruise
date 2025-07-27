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

    if (type === 'DAHABIYA') {
      return await checkDahabiyaAvailability({
        dahabiyaId: itemId,
        startDate: start,
        endDate: end,
        guests,
        durationDays,
        excludeBookingId,
        includeAlternatives
      });
    } else if (type === 'PACKAGE') {
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
        { error: 'Invalid type. Must be DAHABIYA or PACKAGE' },
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

async function checkDahabiyaAvailability({
  dahabiyaId,
  startDate,
  endDate,
  guests,
  durationDays,
  excludeBookingId,
  includeAlternatives
}: {
  dahabiyaId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  durationDays: number;
  excludeBookingId?: string;
  includeAlternatives: boolean;
}) {
  // Fetch dahabiya details
  const dahabiya = await prisma.dahabiya.findUnique({
    where: { id: dahabiyaId },
    include: {
      cabins: {
        include: {
          cabinType: true
        }
      }
    }
  });

  if (!dahabiya) {
    return NextResponse.json({
      isAvailable: false,
      message: 'Dahabiya not found',
      totalPrice: 0
    });
  }

  // Check guest capacity
  const totalCapacity = dahabiya.cabins.reduce((sum, cabin) => sum + cabin.capacity, 0);
  if (guests > totalCapacity) {
    return NextResponse.json({
      isAvailable: false,
      message: `Maximum capacity is ${totalCapacity} guests`,
      totalPrice: 0,
      maxCapacity: totalCapacity
    });
  }

  // Check for conflicting bookings
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      dahabiyaId,
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

  const isAvailable = conflictingBookings.length === 0;

  // Calculate pricing
  const basePrice = Number(dahabiya.pricePerDay);
  let totalPrice = basePrice * durationDays;

  // Apply seasonal pricing adjustments
  const month = startDate.getMonth() + 1;
  if ([12, 1, 2].includes(month)) {
    // Peak season (winter) - 30% increase
    totalPrice *= 1.3;
  } else if ([6, 7, 8].includes(month)) {
    // Low season (summer) - 20% discount
    totalPrice *= 0.8;
  }

  // Apply group discounts
  if (guests >= 10) {
    totalPrice *= 0.9; // 10% discount for groups of 10+
  } else if (guests >= 6) {
    totalPrice *= 0.95; // 5% discount for groups of 6+
  }

  // Apply duration discounts
  if (durationDays >= 14) {
    totalPrice *= 0.85; // 15% discount for 2+ weeks
  } else if (durationDays >= 7) {
    totalPrice *= 0.9; // 10% discount for 1+ week
  }

  const result: any = {
    isAvailable,
    totalPrice: Math.round(totalPrice),
    basePrice,
    durationDays,
    priceBreakdown: {
      basePrice: basePrice * durationDays,
      seasonalAdjustment: totalPrice - (basePrice * durationDays),
      finalPrice: Math.round(totalPrice)
    }
  };

  if (!isAvailable) {
    result.message = 'Dahabiya is not available for selected dates';
    result.conflictingDates = conflictingBookings.map(booking => ({
      startDate: booking.startDate,
      endDate: booking.endDate
    }));

    // Suggest alternative dates if requested
    if (includeAlternatives) {
      result.alternativeDates = await findAlternativeDates(dahabiyaId, startDate, endDate, durationDays);
    }
  } else {
    result.message = 'Dahabiya is available for selected dates';
    
    // Suggest available cabins
    result.availableCabins = dahabiya.cabins.map(cabin => ({
      id: cabin.id,
      name: cabin.name,
      type: cabin.cabinType?.name,
      capacity: cabin.capacity,
      pricePerNight: Number(cabin.price || 0)
    }));
  }

  return NextResponse.json(result);
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

  // For packages, we need to check dahabiya availability
  // Find available dahabiyas for the package dates
  const availableDahabiyas = await prisma.dahabiya.findMany({
    where: {
      capacity: { gte: guests }
    },
    include: {
      bookings: {
        where: {
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
      }
    }
  });

  const availableDahabiyasForDates = availableDahabiyas.filter(d => d.bookings.length === 0);

  const isAvailable = availableDahabiyasForDates.length > 0;
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
    recommendedDahabiyaId: isAvailable ? availableDahabiyasForDates[0]?.id : null
  };

  if (!isAvailable) {
    result.message = 'No dahabiyas available for package dates';
    
    if (includeAlternatives) {
      result.alternativeDates = await findAlternativePackageDates(packageId, startDate, durationDays, guests);
    }
  } else {
    result.message = 'Package is available for selected dates';
    result.availableDahabiyas = availableDahabiyasForDates.slice(0, 3).map(d => ({
      id: d.id,
      name: d.name,
      maxGuests: d.capacity,
      pricePerDay: Number(d.pricePerDay)
    }));
  }

  return NextResponse.json(result);
}

async function findAlternativeDates(dahabiyaId: string, preferredStart: Date, preferredEnd: Date, duration: number) {
  const alternatives = [];
  const searchRange = 60; // Search within 60 days

  for (let offset = 1; offset <= searchRange; offset++) {
    // Try dates before preferred
    const earlierStart = new Date(preferredStart);
    earlierStart.setDate(earlierStart.getDate() - offset);
    const earlierEnd = new Date(earlierStart);
    earlierEnd.setDate(earlierEnd.getDate() + duration);

    if (earlierStart >= new Date()) {
      const earlierAvailable = await checkDateAvailability(dahabiyaId, earlierStart, earlierEnd);
      if (earlierAvailable) {
        alternatives.push({ startDate: earlierStart, endDate: earlierEnd });
      }
    }

    // Try dates after preferred
    const laterStart = new Date(preferredStart);
    laterStart.setDate(laterStart.getDate() + offset);
    const laterEnd = new Date(laterStart);
    laterEnd.setDate(laterEnd.getDate() + duration);

    const laterAvailable = await checkDateAvailability(dahabiyaId, laterStart, laterEnd);
    if (laterAvailable) {
      alternatives.push({ startDate: laterStart, endDate: laterEnd });
    }

    if (alternatives.length >= 5) break; // Limit to 5 alternatives
  }

  return alternatives;
}

async function findAlternativePackageDates(packageId: string, preferredStart: Date, duration: number, guests: number) {
  // Similar logic for package alternatives
  return [];
}

async function checkDateAvailability(dahabiyaId: string, startDate: Date, endDate: Date): Promise<boolean> {
  const conflicting = await prisma.booking.count({
    where: {
      dahabiyaId,
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

  return conflicting === 0;
}
