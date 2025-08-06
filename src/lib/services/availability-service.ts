import { prisma } from '@/lib/prisma';

export interface AvailabilityCheck {
  dahabiyaId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  totalPrice: number;
  message?: string;
}

export class AvailabilityService {
  static async checkAvailability({
    dahabiyaId,
    startDate,
    endDate,
    guests,
  }: AvailabilityCheck): Promise<AvailabilityResult> {
    try {
      console.log('🔍 Checking availability for:', { dahabiyaId, startDate, endDate, guests });

      // STEP 1: Check availability dates from admin panel
      const availabilityDates = await prisma.availabilityDate.findMany({
        where: {
          dahabiyaId,
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      console.log('📅 Found availability dates:', availabilityDates.length);
      console.log('📅 Availability dates:', availabilityDates.map(ad => ({
        date: new Date(ad.date.getTime() + ad.date.getTimezoneOffset() * 60000).toISOString().split('T')[0],
        available: ad.available
      })));

      // Check if all dates in the range are marked as available
      const dateRange = [];
      const currentDate = new Date(startDate.getTime());
      const endDateTime = new Date(endDate.getTime());

      // Include start date but exclude end date (standard booking practice)
      while (currentDate < endDateTime) {
        dateRange.push(new Date(currentDate.getTime()).toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      console.log('📅 Date range to check:', dateRange);

      // Check if all dates are available
      const unavailableDates = [];
      for (const dateStr of dateRange) {
        const availabilityDate = availabilityDates.find(ad => {
          // Fix date comparison - normalize both dates to YYYY-MM-DD format
          const adDateStr = new Date(ad.date.getTime() + ad.date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
          return adDateStr === dateStr;
        });

        if (!availabilityDate) {
          console.log('❌ No availability data for date:', dateStr);
          unavailableDates.push(dateStr);
        } else if (!availabilityDate.available) {
          console.log('❌ Date marked as blocked:', dateStr);
          unavailableDates.push(dateStr);
        } else {
          console.log('✅ Date available:', dateStr);
        }
      }

      if (unavailableDates.length > 0) {
        console.log('❌ Unavailable dates found:', unavailableDates);
        return {
          isAvailable: false,
          availableCabins: [],
          totalPrice: 0,
        };
      }

      console.log('✅ All dates are available, checking dahabiya details...');

      // STEP 2: Get the dahabiya with its details
      const dahabiya = await prisma.dahabiya.findUnique({
        where: { id: dahabiyaId },
        include: {
          bookings: {
            where: {
              AND: [
                { startDate: { lt: endDate } },
                { endDate: { gt: startDate } },
                { status: { in: ['CONFIRMED', 'PENDING'] } }
              ]
            },
          },
        },
      });

      if (!dahabiya) {
        return {
          isAvailable: false,
          totalPrice: 0,
          message: 'Dahabiya not found',
        };
      }

      // Calculate nights
      const nights = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check if dahabiya has capacity for guests
      if (dahabiya.capacity < guests) {
        return {
          isAvailable: false,
          totalPrice: 0,
          message: `Dahabiya capacity (${dahabiya.capacity}) is less than requested guests (${guests})`,
        };
      }

      // Check if dahabiya is already booked for the requested dates
      const isBooked = dahabiya.bookings.length > 0;

      if (isBooked) {
        return {
          isAvailable: false,
          totalPrice: 0,
          message: 'Dahabiya is already booked for the selected dates',
        };
      }

      // Calculate total price
      const totalPrice = Number(dahabiya.pricePerDay) * nights;

      return {
        isAvailable: true,
        totalPrice,
        message: 'Dahabiya is available for booking',
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      return {
        isAvailable: false,
        totalPrice: 0,
        message: 'Error checking availability',
      };
    }
  }

  static async getAvailabilityCalendar(
    dahabiyaId: string,
    month: number,
    year: number
  ) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        dahabiyaId,
        OR: [
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
        ],
        status: 'CONFIRMED',
      },
      select: {
        startDate: true,
        endDate: true,
        cabinId: true,
      },
    });

    const calendar: { [key: string]: boolean } = {};
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const isBooked = bookings.some(
        booking =>
          currentDate >= booking.startDate && currentDate <= booking.endDate
      );
      calendar[dateKey] = !isBooked;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  }
} 