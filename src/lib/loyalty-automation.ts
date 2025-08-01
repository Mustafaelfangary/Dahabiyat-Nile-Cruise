import { prisma } from '@/lib/prisma';

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  benefits: string[];
  multiplier: number;
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'Traveler',
    minPoints: 0,
    maxPoints: 999,
    color: 'text-green-600',
    benefits: ['Basic booking access', 'Email support', 'Welcome bonus'],
    multiplier: 1.0
  },
  {
    name: 'Explorer',
    minPoints: 1000,
    maxPoints: 4999,
    color: 'text-blue-600',
    benefits: ['Priority booking', 'Phone support', '5% discount', 'Exclusive content'],
    multiplier: 1.2
  },
  {
    name: 'Noble',
    minPoints: 5000,
    maxPoints: 9999,
    color: 'text-amber-600',
    benefits: ['VIP treatment', 'Personal concierge', '10% discount', 'Room upgrades'],
    multiplier: 1.5
  },
  {
    name: 'Pharaoh',
    minPoints: 10000,
    maxPoints: Infinity,
    color: 'text-purple-600',
    benefits: ['Royal treatment', '24/7 support', '15% discount', 'Exclusive experiences', 'Free transfers'],
    multiplier: 2.0
  }
];

export interface ActionVerification {
  action: string;
  verificationMethod: 'manual' | 'api' | 'webhook' | 'time_based';
  cooldownHours: number;
  maxPerDay: number;
  maxPerWeek: number;
  maxPerMonth: number;
  requiresVerification: boolean;
  autoVerify: boolean;
}

export const ACTION_CONFIGS: Record<string, ActionVerification> = {
  'like-facebook': {
    action: 'like-facebook',
    verificationMethod: 'manual',
    cooldownHours: 24,
    maxPerDay: 1,
    maxPerWeek: 1,
    maxPerMonth: 1,
    requiresVerification: true,
    autoVerify: false
  },
  'follow-instagram': {
    action: 'follow-instagram',
    verificationMethod: 'manual',
    cooldownHours: 24,
    maxPerDay: 1,
    maxPerWeek: 1,
    maxPerMonth: 1,
    requiresVerification: true,
    autoVerify: false
  },
  'subscribe-youtube': {
    action: 'subscribe-youtube',
    verificationMethod: 'manual',
    cooldownHours: 24,
    maxPerDay: 1,
    maxPerWeek: 1,
    maxPerMonth: 1,
    requiresVerification: true,
    autoVerify: false
  },
  'share-memories': {
    action: 'share-memories',
    verificationMethod: 'manual',
    cooldownHours: 0,
    maxPerDay: 3,
    maxPerWeek: 10,
    maxPerMonth: 30,
    requiresVerification: true,
    autoVerify: true
  },
  'book-package': {
    action: 'book-package',
    verificationMethod: 'api',
    cooldownHours: 0,
    maxPerDay: 5,
    maxPerWeek: 10,
    maxPerMonth: 20,
    requiresVerification: false,
    autoVerify: true
  },
  'download-app': {
    action: 'download-app',
    verificationMethod: 'time_based',
    cooldownHours: 168, // 1 week
    maxPerDay: 1,
    maxPerWeek: 1,
    maxPerMonth: 1,
    requiresVerification: false,
    autoVerify: true
  },
  'book-dahabiya': {
    action: 'book-dahabiya',
    verificationMethod: 'api',
    cooldownHours: 0,
    maxPerDay: 3,
    maxPerWeek: 10,
    maxPerMonth: 15,
    requiresVerification: false,
    autoVerify: true
  },
  'write-review': {
    action: 'write-review',
    verificationMethod: 'manual',
    cooldownHours: 24,
    maxPerDay: 1,
    maxPerWeek: 3,
    maxPerMonth: 10,
    requiresVerification: true,
    autoVerify: false
  },
  'complete-profile': {
    action: 'complete-profile',
    verificationMethod: 'api',
    cooldownHours: 0,
    maxPerDay: 1,
    maxPerWeek: 1,
    maxPerMonth: 1,
    requiresVerification: false,
    autoVerify: true
  }
};

export function calculateLoyaltyTier(points: number): LoyaltyTier {
  return LOYALTY_TIERS.find(tier => 
    points >= tier.minPoints && points <= tier.maxPoints
  ) || LOYALTY_TIERS[0];
}

export function calculatePointsWithMultiplier(basePoints: number, userPoints: number): number {
  const tier = calculateLoyaltyTier(userPoints);
  return Math.round(basePoints * tier.multiplier);
}

export async function checkActionEligibility(
  userId: string, 
  action: string
): Promise<{
  eligible: boolean;
  reason?: string;
  nextEligibleAt?: Date;
  remainingToday?: number;
  remainingThisWeek?: number;
  remainingThisMonth?: number;
}> {
  const config = ACTION_CONFIGS[action];
  if (!config) {
    return { eligible: false, reason: 'Unknown action' };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Check recent actions
  const recentActions = await prisma.loyaltyAction.findMany({
    where: {
      userId,
      action,
      createdAt: {
        gte: new Date(now.getTime() - (config.cooldownHours * 60 * 60 * 1000))
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Check cooldown
  if (config.cooldownHours > 0 && recentActions.length > 0) {
    const lastAction = recentActions[0];
    const nextEligible = new Date(lastAction.createdAt.getTime() + (config.cooldownHours * 60 * 60 * 1000));
    if (now < nextEligible) {
      return {
        eligible: false,
        reason: `Action on cooldown. Try again in ${Math.ceil((nextEligible.getTime() - now.getTime()) / (60 * 60 * 1000))} hours.`,
        nextEligibleAt: nextEligible
      };
    }
  }

  // Check daily limit
  const todayActions = await prisma.loyaltyAction.count({
    where: {
      userId,
      action,
      createdAt: { gte: today }
    }
  });

  if (todayActions >= config.maxPerDay) {
    return {
      eligible: false,
      reason: `Daily limit reached (${config.maxPerDay} per day)`,
      remainingToday: 0
    };
  }

  // Check weekly limit
  const weekActions = await prisma.loyaltyAction.count({
    where: {
      userId,
      action,
      createdAt: { gte: weekStart }
    }
  });

  if (weekActions >= config.maxPerWeek) {
    return {
      eligible: false,
      reason: `Weekly limit reached (${config.maxPerWeek} per week)`,
      remainingThisWeek: 0
    };
  }

  // Check monthly limit
  const monthActions = await prisma.loyaltyAction.count({
    where: {
      userId,
      action,
      createdAt: { gte: monthStart }
    }
  });

  if (monthActions >= config.maxPerMonth) {
    return {
      eligible: false,
      reason: `Monthly limit reached (${config.maxPerMonth} per month)`,
      remainingThisMonth: 0
    };
  }

  return {
    eligible: true,
    remainingToday: config.maxPerDay - todayActions,
    remainingThisWeek: config.maxPerWeek - weekActions,
    remainingThisMonth: config.maxPerMonth - monthActions
  };
}

export async function processLoyaltyAction(
  userId: string,
  action: string,
  basePoints: number,
  metadata?: any
): Promise<{
  success: boolean;
  message: string;
  pointsEarned?: number;
  totalPoints?: number;
  tierUpgrade?: boolean;
  newTier?: string;
  error?: string;
}> {
  try {
    // Check eligibility
    const eligibility = await checkActionEligibility(userId, action);
    if (!eligibility.eligible) {
      return {
        success: false,
        message: eligibility.reason || 'Action not eligible',
        error: eligibility.reason
      };
    }

    // Get user's current points
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyPoints: true }
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
        error: 'User not found'
      };
    }

    const currentPoints = user.loyaltyPoints || 0;
    const oldTier = calculateLoyaltyTier(currentPoints);

    // Calculate points with tier multiplier
    const pointsEarned = calculatePointsWithMultiplier(basePoints, currentPoints);
    const newTotalPoints = currentPoints + pointsEarned;
    const newTier = calculateLoyaltyTier(newTotalPoints);

    // Record the action
    await prisma.loyaltyAction.create({
      data: {
        userId,
        action,
        points: pointsEarned,
        description: getActionDescription(action),
        metadata: metadata ? JSON.stringify(metadata) : null,
        verified: ACTION_CONFIGS[action]?.autoVerify || false
      }
    });

    // Update user's total points
    await prisma.user.update({
      where: { id: userId },
      data: { loyaltyPoints: newTotalPoints }
    });

    // Check for tier upgrade
    const tierUpgrade = newTier.name !== oldTier.name;
    let message = `You earned ${pointsEarned} loyalty points!`;
    
    if (tierUpgrade) {
      message += ` Congratulations! You've been upgraded to ${newTier.name} tier!`;
      
      // Record tier upgrade event
      await prisma.analyticsEvent.create({
        data: {
          event: 'tier_upgrade',
          userId,
          data: JSON.stringify({
            oldTier: oldTier.name,
            newTier: newTier.name,
            totalPoints: newTotalPoints
          })
        }
      });
    }

    return {
      success: true,
      message,
      pointsEarned,
      totalPoints: newTotalPoints,
      tierUpgrade,
      newTier: newTier.name
    };

  } catch (error) {
    console.error('Error processing loyalty action:', error);
    return {
      success: false,
      message: 'Failed to process loyalty action',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
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
    'complete-profile': 'Completed profile',
    'download-app': 'Downloaded mobile app',
    'book-dahabiya': 'Booked a dahabiya'
  };
  
  return descriptions[action] || 'Loyalty action';
}
