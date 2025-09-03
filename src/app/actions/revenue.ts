'use server';

import { prisma } from '@/lib/prisma';

export async function getRevenueData() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo
        },
        status: 'CONFIRMED'
      },
      select: {
        totalPrice: true,
        createdAt: true
      }
    });

    const monthlyRevenue = new Array(6).fill(0);
    const months = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.unshift(date.toLocaleString('default', { month: 'short' }));
    }

    bookings.forEach(booking => {
      const monthIndex = 5 - Math.floor((new Date().getTime() - booking.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30));
      if (monthIndex >= 0 && monthIndex < 6) {
        monthlyRevenue[monthIndex] += Number(booking.totalPrice);
      }
    });

    return { 
      success: true, 
      data: { 
        months, 
        monthlyRevenue,
        totalRevenue: monthlyRevenue.reduce((a, b) => a + b, 0)
      }
    };
  } catch {
    return { 
      success: false, 
      error: 'Failed to fetch revenue data' 
    };
  }
}