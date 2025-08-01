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

    // Mock wishlist since UserWishlist model was removed
    const mockWishlist = [
      {
        id: '1',
        name: 'Cleopatra Dahabiya',
        description: 'Luxury traditional dahabiya cruise',
        pricePerDay: 500,
        mainImage: '/images/dahabiyas/cleopatra.jpg',
        capacity: 12,
        addedAt: new Date()
      }
    ];

    return NextResponse.json(mockWishlist);
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
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
    const { dahabiyaId } = body;

    if (!dahabiyaId) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Check if dahabiya exists
    const dahabiya = await prisma.dahabiya.findUnique({
      where: { id: dahabiyaId },
    });

    if (!dahabiya) {
      return new NextResponse('Dahabiya not found', { status: 404 });
    }

    // Mock adding to wishlist since UserWishlist model was removed
    const mockWishlist = [
      {
        id: '1',
        name: 'Cleopatra Dahabiya',
        description: 'Luxury traditional dahabiya cruise',
        pricePerDay: 500,
        mainImage: '/images/dahabiyas/cleopatra.jpg',
        capacity: 12,
        addedAt: new Date()
      },
      {
        id: dahabiyaId,
        name: 'New Dahabiya',
        description: 'Added to wishlist',
        pricePerDay: 400,
        mainImage: '/images/dahabiyas/default.jpg',
        capacity: 10,
        addedAt: new Date()
      }
    ];

    return NextResponse.json(mockWishlist);
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
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
    const dahabiyaId = searchParams.get('dahabiyaId');

    if (!dahabiyaId) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Mock removing from wishlist since UserWishlist model was removed
    const mockWishlist = [
      {
        id: '1',
        name: 'Cleopatra Dahabiya',
        description: 'Luxury traditional dahabiya cruise',
        pricePerDay: 500,
        mainImage: '/images/dahabiyas/cleopatra.jpg',
        capacity: 12,
        addedAt: new Date()
      }
      // Item with dahabiyaId would be removed from the list
    ];

    return NextResponse.json(mockWishlist);
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}