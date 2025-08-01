import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all dahabiyas (ships model was merged into dahabiyas)
    const ships = await prisma.dahabiya.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        capacity: true,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      count: ships.length,
      ships
    });

  } catch (error) {
    console.error('Error fetching ships:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch ships',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
