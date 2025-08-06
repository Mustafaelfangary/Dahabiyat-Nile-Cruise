"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Eye, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  MousePointer,
  FileText,
  Search,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalBookings: number;
    totalRevenue: number;
    pageViews: number;
    bounceRate: number;
  };
  pageViews: Array<{
    page: string;
    views: number;
    title: string;
  }>;
  engagement: {
    avgTimeOnPage: number;
    scrollDepthStats: Array<{
      depth: string;
      count: number;
    }>;
    buttonClicks: number;
    formSubmissions: number;
  };
  conversions: {
    bookingConversions: number;
    contactFormSubmissions: number;
    newsletterSignups: number;
    conversionFunnel: Array<{
      step: string;
      count: number;
    }>;
  };
  errors: {
    totalErrors: number;
    errorsBySeverity: Array<{
      severity: string;
      count: number;
    }>;
    topErrors: Array<{
      message: string;
      count: number;
    }>;
    errorTrends: Array<{
      date: string;
      count: number;
    }>;
  };
  performance: Array<{
    metric: string;
    avg: number;
    min: number;
    max: number;
    count: number;
  }>;
  period: string;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/dashboard?period=${period}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Failed to load analytics data
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ocean-blue">Analytics Dashboard</h1>
          <p className="text-blue-600">Monitor your website performance and user behavior</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchAnalyticsData} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-ocean-blue">{formatNumber(data.overview.totalUsers)}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-ocean-blue">{formatNumber(data.overview.activeUsers)}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-ocean-blue">{formatNumber(data.overview.pageViews)}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-ocean-blue">{formatNumber(data.overview.totalBookings)}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-ocean-blue">{formatCurrency(data.overview.totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-ocean-blue">{data.overview.bounceRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.pageViews.slice(0, 10).map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{page.title || page.page}</p>
                    <p className="text-xs text-gray-500">{page.page}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ocean-blue">{formatNumber(page.views)}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.conversions.conversionFunnel.map((step, index) => {
                const isLast = index === data.conversions.conversionFunnel.length - 1;
                const nextStep = data.conversions.conversionFunnel[index + 1];
                const conversionRate = nextStep ? (nextStep.count / step.count) * 100 : 100;
                
                return (
                  <div key={step.step} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{step.step}</span>
                      <span className="font-bold text-ocean-blue">{formatNumber(step.count)}</span>
                    </div>
                    {!isLast && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-ocean-blue h-2 rounded-full transition-all duration-300"
                            style={{ width: `${conversionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{conversionRate.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="w-5 h-5" />
              User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-ocean-blue">{formatTime(data.engagement.avgTimeOnPage)}</p>
                <p className="text-sm text-gray-600">Avg. Time on Page</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <MousePointer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-800">{formatNumber(data.engagement.buttonClicks)}</p>
                <p className="text-sm text-gray-600">Button Clicks</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-800">{formatNumber(data.engagement.formSubmissions)}</p>
                <p className="text-sm text-gray-600">Form Submissions</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-800">{data.conversions.bookingConversions}</p>
                <p className="text-sm text-gray-600">Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Error Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-800">{data.errors.totalErrors}</p>
                <p className="text-sm text-gray-600">Total Errors</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">By Severity</h4>
                {data.errors.errorsBySeverity.map(error => (
                  <div key={error.severity} className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      error.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      error.severity === 'HIGH' ? 'bg-blue-100 text-blue-800' :
                      error.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {error.severity}
                    </span>
                    <span className="font-bold">{error.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {data.performance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.performance.map(metric => (
                <div key={metric.metric} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">{metric.metric}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Avg:</span>
                      <span className="text-sm font-medium">{metric.avg.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Min:</span>
                      <span className="text-sm">{metric.min.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Max:</span>
                      <span className="text-sm">{metric.max.toFixed(0)}ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
