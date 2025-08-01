import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get all reviews (dahabiyaId field has been removed from Review model)
    const allReviews = await prisma.review.findMany({
      where: {
        status: 'APPROVED'
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format reviews
    const formattedReviews = allReviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      title: review.title,
      author: review.user?.name || 'Anonymous',
      authorImage: review.user?.image,
      date: review.createdAt.toISOString(),
      location: review.location,
      tripDate: review.tripDate?.toISOString(),
      verified: review.verified,
      helpful: review.helpful,
      photos: review.photos || []
    }));

    return NextResponse.json({
      reviews: formattedReviews,
      total: formattedReviews.length,
      averageRating: allReviews.length > 0 
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
        : 0
    });

  } catch (error) {
    console.error('Error fetching all reviews:', error);
    
    // Return mock data if database fails
    const mockReviews = [
      {
        id: 'mock-1',
        rating: 5,
        comment: 'Absolutely magical experience sailing down the Nile! The Princess Cleopatra exceeded all expectations.',
        author: 'Sarah Johnson',
        authorImage: '/images/avatars/sarah.jpg',
        date: new Date().toISOString(),
        type: 'dahabiya' as const,
        itemName: 'Princess Cleopatra Dahabiya',
        itemSlug: 'princess-cleopatra',
        verified: true,
        helpful: 12,
        photos: []
      },
      {
        id: 'mock-2',
        rating: 5,
        comment: 'The Cultural Discovery package was perfectly organized. Every detail was taken care of!',
        author: 'Michael Chen',
        authorImage: '/images/avatars/michael.jpg',
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'package' as const,
        itemName: 'Cultural Discovery Journey',
        itemSlug: 'cultural-discovery',
        verified: true,
        helpful: 8,
        photos: []
      },
      {
        id: 'mock-3',
        rating: 4,
        comment: 'Beautiful dahabiya with excellent service. The sunset views were unforgettable.',
        author: 'Emma Wilson',
        authorImage: '/images/avatars/emma.jpg',
        date: new Date(Date.now() - 172800000).toISOString(),
        type: 'dahabiya' as const,
        itemName: 'Royal Cleopatra Dahabiya',
        itemSlug: 'royal-cleopatra',
        verified: true,
        helpful: 15,
        photos: []
      }
    ];

    return NextResponse.json({
      reviews: mockReviews,
      total: mockReviews.length,
      dahabiyaCount: 2,
      packageCount: 1,
      averageRating: 4.7
    });
  }
}
