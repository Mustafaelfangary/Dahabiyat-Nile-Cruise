import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch availability for a specific dahabiya and month
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const dahabiyaId = searchParams.get('dahabiyaId');
    const month = parseInt(searchParams.get('month') || '0');
    const year = parseInt(searchParams.get('year') || '2025');

    if (!dahabiyaId) {
      return NextResponse.json({ error: 'Missing dahabiyaId' }, { status: 400 });
    }

    // Get availability dates for the specified month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const availabilityDates = await prisma.availabilityDate.findMany({
      where: {
        dahabiyaId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json({ availabilityDates });

  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

// POST - Add new availability dates
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dahabiyaId, dates } = body;

    if (!dahabiyaId || !dates || !Array.isArray(dates)) {
      return NextResponse.json(
        { error: 'Missing required fields: dahabiyaId and dates array' },
        { status: 400 }
      );
    }

    // Verify dahabiya exists
    const dahabiya = await prisma.dahabiya.findUnique({
      where: { id: dahabiyaId }
    });

    if (!dahabiya) {
      return NextResponse.json({ error: 'Dahabiya not found' }, { status: 404 });
    }

    // Create availability dates
    const createdDates = await Promise.all(
      dates.map(async (dateInfo: { date: string; price: number }) => {
        try {
          return await prisma.availabilityDate.create({
            data: {
              dahabiyaId,
              date: new Date(dateInfo.date),
              price: dateInfo.price,
              available: true
            }
          });
        } catch (error) {
          // Handle duplicate dates gracefully
          console.warn(`Date ${dateInfo.date} already exists for dahabiya ${dahabiyaId}`);
          return null;
        }
      })
    );

    const successfulCreations = createdDates.filter(date => date !== null);

    return NextResponse.json({
      message: `Created ${successfulCreations.length} availability dates`,
      createdDates: successfulCreations
    });

  } catch (error) {
    console.error('Error creating availability dates:', error);
    return NextResponse.json(
      { error: 'Failed to create availability dates' },
      { status: 500 }
    );
  }
}

// PATCH - Update availability status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, available, price } = body;

    if (!id || typeof available !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: id and available status' },
        { status: 400 }
      );
    }

    // Update the availability date
    const updateData: any = { available };
    if (price !== undefined) {
      updateData.price = price;
    }

    const updatedDate = await prisma.availabilityDate.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      message: 'Availability updated successfully',
      availabilityDate: updatedDate
    });

  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    );
  }
}

// DELETE - Remove availability date
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing availability date ID' }, { status: 400 });
    }

    await prisma.availabilityDate.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Availability date deleted successfully' });

  } catch (error) {
    console.error('Error deleting availability date:', error);
    return NextResponse.json(
      { error: 'Failed to delete availability date' },
      { status: 500 }
    );
  }
}
