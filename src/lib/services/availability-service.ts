import { prisma } from '@/lib/prisma';

export interface AvailabilityCheck {
  dahabiyaId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  availableCabins: {
    id: string;
    name: string;
    price: number;
    capacity: number;
  }[];
  totalPrice: number;
}

export class AvailabilityService {
  static async checkAvailability({
    dahabiyaId,
    startDate,
    endDate,
    guests,
  }: AvailabilityCheck): Promise<AvailabilityResult> {
    try {
      // Get the dahabiya with its details
      const dahabiya = await prisma.dahabiya.findUnique({
        where: { id: dahabiyaId },
        include: {
          cabins: {
            include: {
              bookings: {
                where: {
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
                    {
                      AND: [
                        { startDate: { gte: startDate } },
                        { endDate: { lte: endDate } },
                      ],
                    },
                  ],
                  status: { in: ['CONFIRMED', 'PENDING'] },
                },
              },
            },
          },
          bookings: {
            where: {
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
                {
                  AND: [
                    { startDate: { gte: startDate } },
                    { endDate: { lte: endDate } },
                  ],
                },
              ],
              status: { in: ['CONFIRMED', 'PENDING'] },
            },
          },
        },
      });

      if (!dahabiya) {
        return {
          isAvailable: false,
          availableCabins: [],
          totalPrice: 0,
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
          availableCabins: [],
          totalPrice: 0,
        };
      }

      // If there are cabins, check cabin availability
      if (dahabiya.cabins && dahabiya.cabins.length > 0) {
        const availableCabins = dahabiya.cabins
          .filter(cabin => {
            const isBooked = cabin.bookings.length > 0;
            return !isBooked && cabin.capacity >= guests;
          })
          .map(cabin => ({
            id: cabin.id,
            name: cabin.name,
            price: Number(cabin.price),
            capacity: cabin.capacity,
          }));

        const totalPrice = availableCabins.length > 0
          ? availableCabins[0].price * nights
          : Number(dahabiya.pricePerDay) * nights;

        return {
          isAvailable: availableCabins.length > 0,
          availableCabins,
          totalPrice,
        };
      } else {
        // No specific cabins, check overall dahabiya availability
        const isBooked = dahabiya.bookings.length > 0;
        const totalPrice = Number(dahabiya.pricePerDay) * nights;

        return {
          isAvailable: !isBooked,
          totalPrice: !isBooked ? totalPrice : 0,
        };
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      return {
        isAvailable: false,
        totalPrice: 0,
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