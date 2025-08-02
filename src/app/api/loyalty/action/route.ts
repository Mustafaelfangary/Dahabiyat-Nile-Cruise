import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { processLoyaltyAction, checkActionEligibility } from '@/lib/loyalty-automation';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { action, points, metadata } = await request.json();

    if (!action || typeof points !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Use the automated loyalty processing
    const result = await processLoyaltyAction(
      session.user.id,
      action,
      points,
      metadata
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || result.message },
        { status: 400 }
      );
    }

    // Track analytics for engagement actions
    const engagementActions = ['like-facebook', 'review-tripadvisor', 'book-day-tour'];
    if (engagementActions.includes(action)) {
      await prisma.analyticsEvent.create({
        data: {
          event: 'user_engagement',
          userId: session.user.id,
          data: JSON.stringify({
            platform: action.replace('like-', '').replace('review-', '').replace('book-', ''),
            action: action,
            points: result.pointsEarned,
            tierUpgrade: result.tierUpgrade
          })
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      pointsEarned: result.pointsEarned,
      totalPoints: result.totalPoints,
      newTier: result.newTier,
      tierUpgrade: result.tierUpgrade
    });

  } catch (error) {
    console.error('Error processing loyalty action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check action eligibility
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter required' },
        { status: 400 }
      );
    }

    const eligibility = await checkActionEligibility(session.user.id, action);

    return NextResponse.json(eligibility);

  } catch (error) {
    console.error('Error checking action eligibility:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// These functions are now handled by the loyalty-automation module
