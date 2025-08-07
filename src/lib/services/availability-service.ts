import { prisma } from '@/lib/prisma';

export interface AvailabilityCheck {
  type: 'DAHABIYA' | 'PACKAGE';
  itemId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  excludeBookingId?: string;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  message: string;
  totalPrice: number;
  availableDates?: Date[];
  conflictingBookings?: any[];
  alternatives?: any[];
}

export class CleanAvailabilityService {
  /**
   * Check availability for dahabiya or package
   */
  static async checkAvailability({
    type,
    itemId,
    startDate,
    endDate,
    guests,
    excludeBookingId
  }: AvailabilityCheck): Promise<AvailabilityResult> {
    try {
      console.log(`🔍 Checking ${type} availability:`, { itemId, startDate, endDate, guests });

      // Validate dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        return {
          isAvailable: false,
          message: 'Start date cannot be in the past',
          totalPrice: 0
        };
      }

      if (startDate >= endDate) {
        return {
          isAvailable: false,
          message: 'End date must be after start date',
          totalPrice: 0
        };
      }

      if (type === 'DAHABIYA') {
        return await this.checkDahabiyaAvailability(itemId, startDate, endDate, guests, excludeBookingId);
      } else {
        return await this.checkPackageAvailability(itemId, startDate, endDate, guests, excludeBookingId);
      }
    } catch (error) {
      console.error('Availability check error:', error);
      return {
        isAvailable: false,
        message: 'Error checking availability',
        totalPrice: 0
      };
    }
  }

  /**
   * Check dahabiya availability
   */
  private static async checkDahabiyaAvailability(
    dahabiyaId: string,
    startDate: Date,
    endDate: Date,
    guests: number,
    excludeBookingId?: string
  ): Promise<AvailabilityResult> {
    // Get dahabiya details
    const dahabiya = await prisma.dahabiya.findUnique({
      where: { id: dahabiyaId },
      select: {
        id: true,
        name: true,
        capacity: true,
        pricePerDay: true,
        isActive: true
      }
    });

    if (!dahabiya) {
      return {
        isAvailable: false,
        message: 'Dahabiya not found',
        totalPrice: 0
      };
    }

    if (!dahabiya.isActive) {
      return {
        isAvailable: false,
        message: 'Dahabiya is not currently available',
        totalPrice: 0
      };
    }

    // Check capacity
    if (guests > dahabiya.capacity) {
      return {
        isAvailable: false,
        message: `Maximum ${dahabiya.capacity} guests allowed`,
        totalPrice: 0
      };
    }

    // Check for conflicting bookings
    const whereClause: any = {
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
    };

    if (excludeBookingId) {
      whereClause.id = { not: excludeBookingId };
    }

    const conflictingBookings = await prisma.booking.findMany({
      where: whereClause,
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        bookingReference: true
      }
    });

    if (conflictingBookings.length > 0) {
      return {
        isAvailable: false,
        message: 'Selected dates are not available',
        totalPrice: 0,
        conflictingBookings
      };
    }

    // Check admin-set availability dates
    const unavailableDates = await prisma.availabilityDate.findMany({
      where: {
        dahabiyaId,
        date: {
          gte: startDate,
          lte: endDate
        },
        available: false
      }
    });

    if (unavailableDates.length > 0) {
      return {
        isAvailable: false,
        message: 'Some dates in the selected range are not available',
        totalPrice: 0
      };
    }

    // Calculate total price
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = durationDays * dahabiya.pricePerDay;

    return {
      isAvailable: true,
      message: 'Available',
      totalPrice
    };
  }

  /**
   * Check package availability
   */
  private static async checkPackageAvailability(
    packageId: string,
    startDate: Date,
    endDate: Date,
    guests: number,
    excludeBookingId?: string
  ): Promise<AvailabilityResult> {
    // Get package details
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      select: {
        id: true,
        name: true,
        maxGuests: true,
        price: true,
        isActive: true,
        durationDays: true
      }
    });

    if (!packageData) {
      return {
        isAvailable: false,
        message: 'Package not found',
        totalPrice: 0
      };
    }

    if (!packageData.isActive) {
      return {
        isAvailable: false,
        message: 'Package is not currently available',
        totalPrice: 0
      };
    }

    // Check capacity
    if (guests > packageData.maxGuests) {
      return {
        isAvailable: false,
        message: `Maximum ${packageData.maxGuests} guests allowed`,
        totalPrice: 0
      };
    }

    // Validate duration matches package
    const requestedDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (requestedDays !== packageData.durationDays) {
      return {
        isAvailable: false,
        message: `This package requires exactly ${packageData.durationDays} days`,
        totalPrice: 0
      };
    }

    // Check for conflicting package bookings
    const whereClause: any = {
      packageId,
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
    };

    if (excludeBookingId) {
      whereClause.id = { not: excludeBookingId };
    }

    const conflictingBookings = await prisma.booking.findMany({
      where: whereClause,
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        bookingReference: true
      }
    });

    if (conflictingBookings.length > 0) {
      return {
        isAvailable: false,
        message: 'Selected dates are not available for this package',
        totalPrice: 0,
        conflictingBookings
      };
    }

    // Calculate total price (packages have fixed pricing)
    const totalPrice = packageData.price * guests;

    return {
      isAvailable: true,
      message: 'Available',
      totalPrice
    };
  }

  /**
   * Get available dates for a dahabiya (for calendar display)
   */
  static async getAvailableDates(dahabiyaId: string, startMonth: Date, endMonth: Date) {
    try {
      // Get all bookings in the date range
      const bookings = await prisma.booking.findMany({
        where: {
          dahabiyaId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          startDate: { lte: endMonth },
          endDate: { gte: startMonth }
        },
        select: {
          startDate: true,
          endDate: true
        }
      });

      // Get admin-set unavailable dates
      const unavailableDates = await prisma.availabilityDate.findMany({
        where: {
          dahabiyaId,
          date: {
            gte: startMonth,
            lte: endMonth
          },
          available: false
        },
        select: {
          date: true
        }
      });

      // Create array of unavailable dates
      const unavailableDateSet = new Set();

      // Add booking dates
      bookings.forEach(booking => {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          unavailableDateSet.add(d.toISOString().split('T')[0]);
        }
      });

      // Add admin-set unavailable dates
      unavailableDates.forEach(date => {
        unavailableDateSet.add(date.date.toISOString().split('T')[0]);
      });

      return {
        success: true,
        unavailableDates: Array.from(unavailableDateSet)
      };
    } catch (error) {
      console.error('Error getting available dates:', error);
      return {
        success: false,
        error: 'Failed to get available dates'
      };
    }
  }

  /**
   * Find alternative dates if requested dates are not available
   */
  static async findAlternatives(
    type: 'DAHABIYA' | 'PACKAGE',
    itemId: string,
    preferredStartDate: Date,
    duration: number,
    guests: number
  ) {
    try {
      const alternatives = [];
      const searchRange = 30; // Search 30 days before and after preferred date

      for (let offset = -searchRange; offset <= searchRange; offset += 7) {
        if (alternatives.length >= 3) break; // Limit to 3 alternatives

        const testStartDate = new Date(preferredStartDate);
        testStartDate.setDate(testStartDate.getDate() + offset);
        
        const testEndDate = new Date(testStartDate);
        testEndDate.setDate(testEndDate.getDate() + duration);

        const availability = await this.checkAvailability({
          type,
          itemId,
          startDate: testStartDate,
          endDate: testEndDate,
          guests
        });

        if (availability.isAvailable) {
          alternatives.push({
            startDate: testStartDate,
            endDate: testEndDate,
            totalPrice: availability.totalPrice
          });
        }
      }

      return alternatives;
    } catch (error) {
      console.error('Error finding alternatives:', error);
      return [];
    }
  }
}
