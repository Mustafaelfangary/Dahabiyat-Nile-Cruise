import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const preferences = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
    });

    if (!preferences) {
      // Create default preferences if they don't exist
      const defaultPreferences = await prisma.userPreference.create({
        data: {
          userId: session.user.id,
        },
      });

      return NextResponse.json(defaultPreferences);
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Failed to fetch user preferences:', error);
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
    const preferences = await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
      },
      update: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Failed to update user preferences:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}