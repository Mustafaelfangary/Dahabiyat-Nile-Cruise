import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateLoyaltyTier, LOYALTY_TIERS, checkActionEligibility } from '@/lib/loyalty-automation';

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
        loyaltyPoints: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentPoints = user.loyaltyPoints || 0;
    const currentTier = calculateLoyaltyTier(currentPoints);
    const nextTier = LOYALTY_TIERS.find(tier => tier.minPoints > currentPoints);

    // Get recent loyalty actions
    const recentActions = await prisma.loyaltyAction.findMany({
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

    const monthlyActions = await prisma.loyaltyAction.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: monthStart }
      },
      select: { points: true }
    });

    const pointsThisMonth = monthlyActions.reduce((sum, action) => sum + action.points, 0);

    // Get action eligibility for common actions
    const commonActions = ['like-facebook', 'follow-instagram', 'subscribe-youtube', 'share-memories', 'download-app'];
    const actionEligibility = await Promise.all(
      commonActions.map(async (action) => {
        const eligibility = await checkActionEligibility(session.user.id, action);
        return {
          action,
          ...eligibility
        };
      })
    );

    // Calculate progress to next tier
    const progressToNext = nextTier ? {
      current: currentPoints,
      required: nextTier.minPoints,
      remaining: nextTier.minPoints - currentPoints,
      percentage: Math.min(100, (currentPoints / nextTier.minPoints) * 100)
    } : null;

    // Get tier statistics
    const tierStats = await Promise.all(
      LOYALTY_TIERS.map(async (tier) => {
        const count = await prisma.user.count({
          where: {
            loyaltyPoints: {
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
    const totalActions = await prisma.loyaltyAction.count({
      where: { userId: session.user.id }
    });

    const totalPointsEarned = await prisma.loyaltyAction.aggregate({
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
    console.error('Error fetching loyalty dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
