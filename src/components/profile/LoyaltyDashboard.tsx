'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Star, 
  TrendingUp, 
  Calendar, 
  Award,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Gift
} from 'lucide-react';

interface LoyaltyDashboardData {
  user: {
    id: string;
    totalPoints: number;
    pointsThisMonth: number;
    totalActions: number;
    totalPointsEarned: number;
    memberSince: string;
  };
  tier: {
    current: {
      name: string;
      color: string;
      benefits: string[];
      multiplier: number;
    };
    next?: {
      name: string;
      minPoints: number;
    };
    progress?: {
      current: number;
      required: number;
      remaining: number;
      percentage: number;
    };
    allTiers: Array<{
      name: string;
      minPoints: number;
      color: string;
      userCount: number;
    }>;
  };
  actions: {
    recent: Array<{
      id: string;
      action: string;
      points: number;
      description: string;
      createdAt: string;
    }>;
    eligibility: Array<{
      action: string;
      eligible: boolean;
      reason?: string;
      remainingToday?: number;
      remainingThisWeek?: number;
      remainingThisMonth?: number;
    }>;
  };
  achievements: {
    firstBooking: boolean;
    socialMediaFollower: boolean;
    memorySharer: boolean;
    appDownloader: boolean;
  };
}

export default function LoyaltyDashboard() {
  const [data, setData] = useState<LoyaltyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/loyalty/dashboard');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else {
        setError('Failed to load loyalty dashboard');
      }
    } catch (error) {
      console.error('Error fetching loyalty dashboard:', error);
      setError('Failed to load loyalty dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">{error || 'Failed to load loyalty data'}</p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Tier & Progress */}
      <Card className="bg-gradient-to-r from-ocean-blue-50 to-navy-blue-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Crown className={`w-8 h-8 ${data.tier.current.color}`} />
              <div>
                <h3 className="text-2xl font-bold text-amber-800">{data.tier.current.name}</h3>
                <p className="text-amber-600">Current Tier</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-800">{data.user.totalPoints.toLocaleString()}</p>
              <p className="text-amber-600">Total Points</p>
            </div>
          </div>

          {data.tier.progress && data.tier.next && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress to {data.tier.next.name}</span>
                <span className="text-gray-600">
                  {data.tier.progress.remaining.toLocaleString()} points remaining
                </span>
              </div>
              <Progress value={data.tier.progress.percentage} className="h-3" />
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {data.tier.current.benefits.slice(0, 3).map((benefit, index) => (
              <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800">
                {benefit}
              </Badge>
            ))}
            {data.tier.current.benefits.length > 3 && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                +{data.tier.current.benefits.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{data.user.pointsThisMonth}</p>
            <p className="text-sm text-gray-600">This Month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{data.user.totalActions}</p>
            <p className="text-sm text-gray-600">Total Actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{data.user.totalPointsEarned}</p>
            <p className="text-sm text-gray-600">Points Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-800">Member Since</p>
            <p className="text-xs text-gray-600">{formatDate(data.user.memberSince)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Recent Activity
          </h3>
          
          {data.actions.recent.length > 0 ? (
            <div className="space-y-3">
              {data.actions.recent.slice(0, 5).map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">{action.description}</p>
                      <p className="text-sm text-gray-600">{formatDate(action.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600">+{action.points}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-800">No recent activity</p>
              <p className="text-sm text-gray-700">Start earning points by completing actions!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Eligibility */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            Available Actions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.actions.eligibility.map((eligibility) => (
              <div 
                key={eligibility.action} 
                className={`p-4 rounded-lg border-2 ${
                  eligibility.eligible 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium capitalize">
                    {eligibility.action.replace(/-/g, ' ')}
                  </p>
                  {eligibility.eligible ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                
                {eligibility.eligible ? (
                  <div className="text-sm text-green-700">
                    {eligibility.remainingToday !== undefined && (
                      <p>Remaining today: {eligibility.remainingToday}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-700">{eligibility.reason}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tier Overview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-600" />
            All Tiers
          </h3>
          
          <div className="space-y-3">
            {data.tier.allTiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`p-4 rounded-lg border-2 ${
                  tier.name === data.tier.current.name 
                    ? 'border-amber-300 bg-amber-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className={`w-6 h-6 ${tier.color}`} />
                    <div>
                      <p className="font-bold text-gray-800">{tier.name}</p>
                      <p className="text-sm text-gray-600">
                        {tier.minPoints.toLocaleString()}+ points
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{tier.userCount} members</p>
                    {tier.name === data.tier.current.name && (
                      <Badge className="bg-amber-600 text-white">Current</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
