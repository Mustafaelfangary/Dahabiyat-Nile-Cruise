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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(unreadOnly && { read: false }),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    });

    return NextResponse.json({
      notifications,
      total,
      pages: Math.ceil(total / limit),
      unreadCount,
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, read } = body;

    if (!id || typeof read !== 'boolean') {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Verify the notification belongs to the user
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!notification) {
      return new NextResponse('Notification not found', { status: 404 });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('Failed to update notification:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all') === 'true';

    if (!id && !all) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    if (all) {
      // Delete all notifications for the user
      await prisma.notification.deleteMany({
        where: { userId: session.user.id },
      });
    } else {
      // Ensure id is a valid string
      if (!id) {
        return new NextResponse('Invalid request', { status: 400 });
      }

      // Verify the notification belongs to the user before deleting
      const notification = await prisma.notification.findFirst({
        where: {
          id,
          userId: session.user.id,
        },
      });

      if (!notification) {
        return new NextResponse('Notification not found', { status: 404 });
      }

      await prisma.notification.delete({
        where: { id },
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete notification(s):', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}