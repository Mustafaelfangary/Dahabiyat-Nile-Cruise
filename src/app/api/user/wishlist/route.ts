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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        UserWishlist: {
          include: {
            dahabiyat: {
              include: {
                images: true,
                cabins: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Extract dahabiyat from the UserWishlist relation
    const wishlist = user.UserWishlist.map(item => item.dahabiyat);
    return NextResponse.json(wishlist);
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

    // Add dahabiya to user's wishlist
    await prisma.userWishlist.create({
      data: {
        A: dahabiyaId,
        B: session.user.id,
      },
    });

    // Fetch updated wishlist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        UserWishlist: {
          include: {
            dahabiyat: {
              include: {
                images: true,
                cabins: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Extract dahabiyat from the UserWishlist relation
    const wishlist = user?.UserWishlist.map(item => item.dahabiyat) || [];
    return NextResponse.json(wishlist);
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

    // Remove dahabiya from user's wishlist
    await prisma.userWishlist.delete({
      where: {
        A_B: {
          A: dahabiyaId,
          B: session.user.id,
        },
      },
    });

    // Fetch updated wishlist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        UserWishlist: {
          include: {
            dahabiyat: {
              include: {
                images: true,
                cabins: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Extract dahabiyat from the UserWishlist relation
    const wishlist = user?.UserWishlist.map(item => item.dahabiyat) || [];
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}