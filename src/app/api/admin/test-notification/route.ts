import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message, testType = 'single' } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (testType === 'all-admins') {
      // Create notification for all admins
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, name: true }
      });

      const notifications = await Promise.all(
        adminUsers.map(admin =>
          prisma.notification.create({
            data: {
              userId: admin.id,
              type: 'SYSTEM',
              title: 'Test Notification',
              message: `🧪 TEST: ${message}`,
              read: false
            }
          })
        )
      );

      return NextResponse.json({
        success: true,
        message: `Test notification sent to ${adminUsers.length} admin(s)`,
        notifications: notifications.length,
        adminUsers: adminUsers.map(u => u.name)
      });
    } else {
      // Create notification for current admin only
      const notification = await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: 'SYSTEM',
          title: 'Test Notification',
          message: `🧪 TEST: ${message}`,
          read: false
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Test notification created successfully',
        notification
      });
    }

  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create test notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
