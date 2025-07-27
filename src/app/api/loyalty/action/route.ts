import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { action, points } = await request.json();

    if (!action || typeof points !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Check if user has already performed this action today (for social media actions)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const socialMediaActions = ['like-facebook', 'follow-instagram', 'subscribe-youtube'];
    
    if (socialMediaActions.includes(action)) {
      const existingAction = await prisma.loyaltyAction.findFirst({
        where: {
          userId: session.user.id,
          action: action,
          createdAt: {
            gte: today
          }
        }
      });

      if (existingAction) {
        return NextResponse.json(
          { error: 'You have already earned points for this action today' },
          { status: 400 }
        );
      }
    }

    // Record the loyalty action
    const loyaltyAction = await prisma.loyaltyAction.create({
      data: {
        userId: session.user.id,
        action: action,
        points: points,
        description: getActionDescription(action)
      }
    });

    // Track social media interactions for analytics
    if (socialMediaActions.includes(action)) {
      await prisma.analyticsEvent.create({
        data: {
          event: 'social_media_interaction',
          userId: session.user.id,
          data: JSON.stringify({
            platform: action.replace('like-', '').replace('follow-', '').replace('subscribe-', ''),
            action: action,
            points: points
          })
        }
      });
    }

    // Update user's total loyalty points
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { loyaltyPoints: true }
    });

    const newTotalPoints = (user?.loyaltyPoints || 0) + points;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { loyaltyPoints: newTotalPoints }
    });

    // Check for tier upgrades
    const newTier = calculateLoyaltyTier(newTotalPoints);
    const oldTier = calculateLoyaltyTier((user?.loyaltyPoints || 0));

    let message = `You earned ${points} loyalty points!`;
    if (newTier.name !== oldTier.name) {
      message += ` Congratulations! You've been upgraded to ${newTier.name} tier!`;
    }

    return NextResponse.json({
      success: true,
      message,
      pointsEarned: points,
      totalPoints: newTotalPoints,
      newTier: newTier.name,
      tierUpgrade: newTier.name !== oldTier.name
    });

  } catch (error) {
    console.error('Error processing loyalty action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getActionDescription(action: string): string {
  const descriptions: Record<string, string> = {
    'book-package': 'Booked a cruise package',
    'like-facebook': 'Liked us on Facebook',
    'follow-instagram': 'Followed us on Instagram',
    'subscribe-youtube': 'Subscribed to our YouTube channel',
    'share-memories': 'Shared travel memories',
    'write-review': 'Wrote a review',
    'refer-friend': 'Referred a friend',
    'complete-profile': 'Completed profile'
  };
  
  return descriptions[action] || 'Loyalty action';
}

function calculateLoyaltyTier(points: number) {
  if (points >= 10000) return { name: 'Pharaoh', color: 'text-purple-600' };
  if (points >= 5000) return { name: 'Noble', color: 'text-amber-600' };
  if (points >= 1000) return { name: 'Explorer', color: 'text-blue-600' };
  return { name: 'Traveler', color: 'text-green-600' };
}
