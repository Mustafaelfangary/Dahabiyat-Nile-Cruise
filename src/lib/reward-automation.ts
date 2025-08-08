import { prisma } from '@/lib/prisma';

// Reward tier definitions
export const REWARD_TIERS = [
  {
    name: 'Traveler',
    minPoints: 0,
    maxPoints: 999,
    color: 'text-green-600',
    multiplier: 1.0,
    benefits: ['Priority booking access', 'Exclusive member rates', 'Complimentary upgrades']
  },
  {
    name: 'Explorer',
    minPoints: 1000,
    maxPoints: 4999,
    color: 'text-blue-600',
    multiplier: 1.2,
    benefits: ['All Traveler benefits', 'Early access to new packages', 'Personal travel consultant', '10% discount on all bookings']
  },
  {
    name: 'Noble',
    minPoints: 5000,
    maxPoints: 9999,
    color: 'text-purple-600',
    multiplier: 1.5,
    benefits: ['All Explorer benefits', 'VIP lounge access', 'Complimentary airport transfers', '15% discount on all bookings']
  },
  {
    name: 'Pharaoh',
    minPoints: 10000,
    maxPoints: Infinity,
    color: 'text-amber-600',
    multiplier: 2.0,
    benefits: ['All Noble benefits', 'Private butler service', 'Exclusive pharaonic experiences', '20% discount on all bookings', 'Lifetime membership']
  }
];

// Action configurations with cooldowns and limits
export const ACTION_CONFIGS = {
  'book-package': {
    dailyLimit: 1,
    weeklyLimit: 3,
    monthlyLimit: 10,
    cooldownHours: 0,
    autoVerify: true,
    description: 'Book a travel package'
  },
  'book-dahabiya': {
    dailyLimit: 1,
    weeklyLimit: 2,
    monthlyLimit: 5,
    cooldownHours: 0,
    autoVerify: true,
    description: 'Book a dahabiya cruise'
  },
  'like-facebook': {
    dailyLimit: 1,
    weeklyLimit: 1,
    monthlyLimit: 1,
    cooldownHours: 24,
    autoVerify: false,
    description: 'Like our Facebook page'
  },
  'follow-instagram': {
    dailyLimit: 1,
    weeklyLimit: 1,
    monthlyLimit: 1,
    cooldownHours: 24,
    autoVerify: false,
    description: 'Follow us on Instagram'
  },
  'subscribe-youtube': {
    dailyLimit: 1,
    weeklyLimit: 1,
    monthlyLimit: 1,
    cooldownHours: 24,
    autoVerify: false,
    description: 'Subscribe to our YouTube channel'
  },
  'review-tripadvisor': {
    dailyLimit: 1,
    weeklyLimit: 2,
    monthlyLimit: 5,
    cooldownHours: 168, // 1 week
    autoVerify: false,
    description: 'Write a review on TripAdvisor'
  },
  'book-day-tour': {
    dailyLimit: 2,
    weeklyLimit: 5,
    monthlyLimit: 15,
    cooldownHours: 0,
    autoVerify: true,
    description: 'Book a day tour'
  },
  'share-memories': {
    dailyLimit: 3,
    weeklyLimit: 10,
    monthlyLimit: 30,
    cooldownHours: 2,
    autoVerify: true,
    description: 'Share travel memories'
  },
  'download-app': {
    dailyLimit: 1,
    weeklyLimit: 1,
    monthlyLimit: 1,
    cooldownHours: 0,
    autoVerify: false,
    description: 'Download our mobile app'
  }
};

export function calculateRewardTier(points: number) {
  return REWARD_TIERS.find(tier => 
    points >= tier.minPoints && points <= tier.maxPoints
  ) || REWARD_TIERS[0];
}

export function calculatePointsWithMultiplier(basePoints: number, currentPoints: number): number {
  const tier = calculateRewardTier(currentPoints);
  return Math.floor(basePoints * tier.multiplier);
}

export function getActionDescription(action: string): string {
  return ACTION_CONFIGS[action]?.description || `Completed action: ${action}`;
}

export async function checkActionEligibility(
  userId: string,
  action: string
): Promise<{
  eligible: boolean;
  reason?: string;
  remainingToday?: number;
  remainingThisWeek?: number;
  remainingThisMonth?: number;
}> {
  const config = ACTION_CONFIGS[action];
  if (!config) {
    return {
      eligible: false,
      reason: 'Unknown action'
    };
  }

  const now = new Date();
  
  // Check daily limit
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  
  const dailyCount = await prisma.rewardAction.count({
    where: {
      userId,
      action,
      createdAt: { gte: dayStart }
    }
  });

  if (dailyCount >= config.dailyLimit) {
    return {
      eligible: false,
      reason: `Daily limit reached (${config.dailyLimit} per day)`,
      remainingToday: 0
    };
  }

  // Check weekly limit
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weeklyCount = await prisma.rewardAction.count({
    where: {
      userId,
      action,
      createdAt: { gte: weekStart }
    }
  });

  if (weeklyCount >= config.weeklyLimit) {
    return {
      eligible: false,
      reason: `Weekly limit reached (${config.weeklyLimit} per week)`,
      remainingThisWeek: 0
    };
  }

  // Check monthly limit
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthlyCount = await prisma.rewardAction.count({
    where: {
      userId,
      action,
      createdAt: { gte: monthStart }
    }
  });

  if (monthlyCount >= config.monthlyLimit) {
    return {
      eligible: false,
      reason: `Monthly limit reached (${config.monthlyLimit} per month)`,
      remainingThisMonth: 0
    };
  }

  // Check cooldown
  if (config.cooldownHours > 0) {
    const cooldownStart = new Date(now.getTime() - (config.cooldownHours * 60 * 60 * 1000));
    
    const recentAction = await prisma.rewardAction.findFirst({
      where: {
        userId,
        action,
        createdAt: { gte: cooldownStart }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (recentAction) {
      const timeSinceAction = now.getTime() - recentAction.createdAt.getTime();
      const cooldownRemaining = (config.cooldownHours * 60 * 60 * 1000) - timeSinceAction;
      
      if (cooldownRemaining > 0) {
        const hoursRemaining = Math.ceil(cooldownRemaining / (60 * 60 * 1000));
        return {
          eligible: false,
          reason: `Cooldown active. Try again in ${hoursRemaining} hour(s)`
        };
      }
    }
  }

  return {
    eligible: true,
    remainingToday: config.dailyLimit - dailyCount,
    remainingThisWeek: config.weeklyLimit - weeklyCount,
    remainingThisMonth: config.monthlyLimit - monthlyCount
  };
}

export async function processRewardAction(
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
      select: { rewardPoints: true }
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
        error: 'User not found'
      };
    }

    const currentPoints = user.rewardPoints || 0;
    const oldTier = calculateRewardTier(currentPoints);

    // Calculate points with tier multiplier
    const pointsEarned = calculatePointsWithMultiplier(basePoints, currentPoints);
    const newTotalPoints = currentPoints + pointsEarned;
    const newTier = calculateRewardTier(newTotalPoints);

    // Record the action
    await prisma.rewardAction.create({
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
      data: { rewardPoints: newTotalPoints }
    });

    const tierUpgrade = newTier.name !== oldTier.name;
    let message = `Earned ${pointsEarned} reward points!`;
    
    if (tierUpgrade) {
      message += ` Congratulations! You've been promoted to ${newTier.name} tier!`;
    }

    return {
      success: true,
      message,
      pointsEarned,
      totalPoints: newTotalPoints,
      tierUpgrade,
      newTier: tierUpgrade ? newTier.name : undefined
    };

  } catch (error) {
    console.error('Error processing reward action:', error);
    return {
      success: false,
      message: 'Failed to process reward action',
      error: 'Internal server error'
    };
  }
}
