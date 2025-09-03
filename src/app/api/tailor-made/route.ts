import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// POST - Create new tailor-made request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, duration, budget, interests, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Create the tailor-made request
    const tailorMadeRequest = await prisma.tailorMadeRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        duration: duration || null,
        budget: budget || null,
        interests: interests || null,
        message,
        status: 'PENDING'
      }
    });

    // Send notification to admins
    try {
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, name: true, email: true }
      });

      // Create in-app notifications for admins
      const notifications = adminUsers.map(admin => ({
        userId: admin.id,
        title: 'New Tailor-Made Request',
        message: `${name} has submitted a tailor-made journey request. Budget: ${budget || 'Not specified'}, Duration: ${duration || 'Not specified'}`,
        type: 'TAILOR_MADE_REQUEST' as const,
        relatedId: tailorMadeRequest.id,
        isRead: false
      }));

      if (notifications.length > 0) {
        await prisma.notification.createMany({
          data: notifications
        });
      }

      // TODO: Send email notification to admins
      console.log(`New tailor-made request from ${name} (${email})`);
      
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Don't fail the request if notifications fail
    }

    return NextResponse.json({
      success: true,
      message: 'Your tailor-made request has been submitted successfully! We will contact you within 24 hours.',
      requestId: tailorMadeRequest.id
    });

  } catch (error) {
    console.error('Error creating tailor-made request:', error);
    return NextResponse.json(
      { error: 'Failed to submit request. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET - Fetch tailor-made requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Get total count
    const total = await prisma.tailorMadeRequest.count({ where });

    // Get requests with pagination
    const requests = await prisma.tailorMadeRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching tailor-made requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
