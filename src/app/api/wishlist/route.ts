import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    // Only allow users to access their own wishlist unless they're admin
    if (userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Since the Wishlist model doesn't exist in the current schema,
    // return an empty wishlist for now
    const wishlistItems: any[] = [];

    // TODO: Implement wishlist functionality when the model is added
    // const wishlistItems = await prisma.wishlist.findMany({
    //   where: { userId },
    //   include: {
    //     dahabiya: {
    //       select: {
    //         id: true,
    //         name: true,
    //         description: true,
    //         mainImage: true,
    //         pricePerDay: true,
    //         capacity: true,
    //         amenities: true,
    //       }
    //     },
    //     package: {
    //       select: {
    //         id: true,
    //         name: true,
    //         description: true,
    //         mainImageUrl: true,
    //         price: true,
    //         durationDays: true,
    //       }
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' },
    //   take: limit,
    // });

    // Transform the data to match the expected format
    const transformedItems = wishlistItems.map(item => ({
      id: item.id,
      dahabiya: item.dahabiya,
      package: item.package,
      createdAt: new Date().toISOString(), // Mock date since no actual data
    }));

    return NextResponse.json({ items: transformedItems });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dahabiyaId, packageId } = body;

    if (!dahabiyaId && !packageId) {
      return NextResponse.json(
        { error: 'Either dahabiyaId or packageId is required' },
        { status: 400 }
      );
    }

    // Mock check for existing item since Wishlist model doesn't exist
    // In a real implementation, this would check the database

    // Mock wishlist functionality since Wishlist model doesn't exist
    const mockWishlistItem = {
      id: Date.now().toString(),
      userId: session.user.id,
      dahabiyaId: dahabiyaId || null,
      packageId: packageId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(mockWishlistItem);

    /*
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        dahabiyaId,
        packageId,
      },
      include: {
        dahabiya: {
          select: {
            id: true,
            name: true,
            description: true,
            mainImageUrl: true,
            pricePerNight: true,
            maxGuests: true,
            location: true,
            amenities: true,
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            description: true,
            mainImageUrl: true,
            price: true,
            durationDays: true,
            highlights: true,
          }
        }
      },
    });

    return NextResponse.json(wishlistItem);
    */

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dahabiyaId, packageId, itemId } = body;

    let whereClause: any = { userId: session.user.id };

    if (itemId) {
      whereClause.id = itemId;
    } else if (dahabiyaId) {
      whereClause.dahabiyaId = dahabiyaId;
    } else if (packageId) {
      whereClause.packageId = packageId;
    } else {
      return NextResponse.json(
        { error: 'Either itemId, dahabiyaId, or packageId is required' },
        { status: 400 }
      );
    }

    // Mock wishlist deletion since Wishlist model doesn't exist
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
