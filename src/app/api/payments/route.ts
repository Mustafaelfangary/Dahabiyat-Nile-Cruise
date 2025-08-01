import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Verify the booking belongs to the user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
      },
      include: {
        payment: true,
      },
    });

    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 });
    }

    return NextResponse.json(booking.payment);
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { bookingId, amount, paymentMethod, currency = 'USD' } = body;

    if (!bookingId || !amount || !paymentMethod) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Verify the booking belongs to the user and is in a valid state
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    });

    if (!booking) {
      return new NextResponse('Invalid booking', { status: 400 });
    }

    // Calculate remaining amount
    const existingPayments = await prisma.payment.aggregate({
      where: {
        bookingId,
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    const paidAmount = existingPayments._sum.amount || 0;
    const remainingAmount = Number(booking.totalPrice) - Number(paidAmount);

    if (amount > remainingAmount) {
      return new NextResponse('Payment amount exceeds remaining balance', {
        status: 400,
      });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        currency,
        paymentMethod,
        provider: 'manual', // Placeholder until payment gateway integration
        status: 'PENDING',
        transactionId: `TR${Date.now()}`,
      },
    });

    // TODO: Integrate with actual payment gateway
    // For now, we'll simulate a successful payment
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
      },
    });

    // Check if booking is fully paid and update status
    const allPayments = await prisma.payment.aggregate({
      where: {
        bookingId,
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    const totalPaid = allPayments._sum.amount || 0;
    if (Number(totalPaid) >= Number(booking.totalPrice)) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });
    }

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Failed to process payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status,
      },
    });

    // If payment is completed, check if booking is fully paid
    if (status === 'COMPLETED') {
      const allPayments = await prisma.payment.aggregate({
        where: {
          bookingId: payment.bookingId,
          status: 'COMPLETED',
        },
        _sum: {
          amount: true,
        },
      });

      const booking = payment.bookingId ? await prisma.booking.findUnique({
        where: { id: payment.bookingId },
      }) : null;

      if (booking && payment.bookingId && Number(allPayments._sum.amount || 0) >= Number(booking.totalPrice)) {
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: 'CONFIRMED' },
        });
      }
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Failed to update payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}