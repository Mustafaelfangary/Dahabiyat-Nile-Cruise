import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateRewardTier, REWARD_TIERS, checkActionEligibility } from '@/lib/reward-automation';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's current points and tier
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        rewardPoints: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentPoints = user.rewardPoints || 0;
    const currentTier = calculateRewardTier(currentPoints);
    const nextTier = REWARD_TIERS.find(tier => tier.minPoints > currentPoints);

    // Get recent reward actions
    const recentActions = await prisma.rewardAction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        action: true,
        points: true,
        description: true,
        createdAt: true
      }
    });

    // Calculate points earned this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyActions = await prisma.rewardAction.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: monthStart }
      },
      select: { points: true }
    });

    const pointsThisMonth = monthlyActions.reduce((sum, action) => sum + action.points, 0);

    // Calculate progress to next tier
    let progressToNext = null;
    if (nextTier) {
      const pointsToNext = nextTier.minPoints - currentPoints;
      progressToNext = {
        current: currentPoints,
        required: nextTier.minPoints,
        remaining: pointsToNext,
        percentage: Math.min((currentPoints / nextTier.minPoints) * 100, 100)
      };
    }

    // Check eligibility for common actions
    const commonActions = [
      'like-facebook',
      'follow-instagram',
      'subscribe-youtube',
      'share-memories',
      'download-app',
      'review-tripadvisor',
      'book-package',
      'book-dahabiya',
      'book-day-tour'
    ];
    const actionEligibility = await Promise.all(
      commonActions.map(async (action) => {
        const eligibility = await checkActionEligibility(session.user.id, action);
        return {
          action,
          ...eligibility
        };
      })
    );

    // Get tier statistics
    const tierStats = await Promise.all(
      REWARD_TIERS.map(async (tier) => {
        const count = await prisma.user.count({
          where: {
            rewardPoints: {
              gte: tier.minPoints,
              ...(tier.maxPoints !== Infinity && { lte: tier.maxPoints })
            }
          }
        });
        return {
          ...tier,
          userCount: count
        };
      })
    );

    // Calculate total actions and points
    const totalActions = await prisma.rewardAction.count({
      where: { userId: session.user.id }
    });

    const totalPointsEarned = await prisma.rewardAction.aggregate({
      where: { userId: session.user.id },
      _sum: { points: true }
    });

    return NextResponse.json({
      user: {
        id: session.user.id,
        totalPoints: currentPoints,
        pointsThisMonth,
        totalActions,
        totalPointsEarned: totalPointsEarned._sum.points || 0,
        memberSince: user.createdAt
      },
      tier: {
        current: currentTier,
        next: nextTier,
        progress: progressToNext,
        allTiers: tierStats
      },
      actions: {
        recent: recentActions,
        eligibility: actionEligibility
      },
      achievements: {
        // Add achievement logic here if needed
        firstBooking: recentActions.some(a => a.action === 'book-package'),
        socialMediaFollower: recentActions.some(a => ['like-facebook', 'follow-instagram', 'subscribe-youtube'].includes(a.action)),
        memorySharer: recentActions.some(a => a.action === 'share-memories'),
        appDownloader: recentActions.some(a => a.action === 'download-app')
      }
    });

  } catch (error) {
    console.error('Error fetching reward dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
