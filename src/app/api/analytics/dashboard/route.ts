import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d
    const startDate = getStartDate(period);

    // Get overview metrics
    const overview = await getOverviewMetrics(startDate);
    
    // Get page views
    const pageViews = await getPageViewStats(startDate);
    
    // Get user engagement
    const engagement = await getEngagementStats(startDate);
    
    // Get conversion metrics
    const conversions = await getConversionStats(startDate);
    
    // Get error statistics
    const errors = await getErrorStats(startDate);
    
    // Get performance metrics
    const performance = await getPerformanceStats(startDate);

    return NextResponse.json({
      overview,
      pageViews,
      engagement,
      conversions,
      errors,
      performance,
      period
    });

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

function getStartDate(period: string): Date {
  const now = new Date();
  switch (period) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

async function getOverviewMetrics(startDate: Date) {
  const [
    totalUsers,
    activeUsers,
    totalBookings,
    totalRevenue,
    pageViews,
    bounceRate
  ] = await Promise.all([
    // Total users
    prisma.user.count(),
    
    // Active users (users with events in period)
    prisma.analyticsEvent.groupBy({
      by: ['userId'],
      where: {
        timestamp: { gte: startDate },
        userId: { not: null }
      }
    }).then(result => result.length),
    
    // Total bookings in period
    prisma.booking.count({
      where: {
        createdAt: { gte: startDate }
      }
    }),
    
    // Total revenue in period
    prisma.booking.aggregate({
      where: {
        createdAt: { gte: startDate },
        status: { in: ['CONFIRMED', 'COMPLETED'] }
      },
      _sum: { totalPrice: true }
    }).then(result => Number(result._sum.totalPrice) || 0),
    
    // Page views in period
    prisma.analyticsEvent.count({
      where: {
        event: 'page_view',
        timestamp: { gte: startDate }
      }
    }),
    
    // Bounce rate (sessions with only 1 page view)
    calculateBounceRate(startDate)
  ]);

  return {
    totalUsers,
    activeUsers,
    totalBookings,
    totalRevenue,
    pageViews,
    bounceRate
  };
}

async function getPageViewStats(startDate: Date) {
  const pageViews = await prisma.analyticsEvent.groupBy({
    by: ['data'],
    where: {
      event: 'page_view',
      timestamp: { gte: startDate }
    },
    _count: { id: true }
  });

  return pageViews.map(pv => {
    const data = JSON.parse(pv.data as string);
    return {
      page: data.page,
      views: pv._count.id,
      title: data.title
    };
  }).sort((a, b) => b.views - a.views);
}

async function getEngagementStats(startDate: Date) {
  const [
    avgTimeOnPage,
    scrollDepthStats,
    buttonClicks,
    formSubmissions
  ] = await Promise.all([
    // Average time on page
    prisma.analyticsEvent.findMany({
      where: {
        event: 'time_on_page',
        timestamp: { gte: startDate }
      },
      select: { data: true }
    }).then(results => {
      if (results.length === 0) return 0;
      const values = results.map(r => {
        try {
          return JSON.parse(r.data).value || 0;
        } catch {
          return 0;
        }
      });
      return values.reduce((a, b) => a + b, 0) / values.length;
    }),
    
    // Scroll depth statistics
    prisma.analyticsEvent.groupBy({
      by: ['data'],
      where: {
        event: 'scroll_depth',
        timestamp: { gte: startDate }
      },
      _count: { id: true }
    }),
    
    // Button clicks
    prisma.analyticsEvent.count({
      where: {
        event: 'button_click',
        timestamp: { gte: startDate }
      }
    }),
    
    // Form submissions
    prisma.analyticsEvent.count({
      where: {
        event: 'form_submit',
        timestamp: { gte: startDate }
      }
    })
  ]);

  return {
    avgTimeOnPage,
    scrollDepthStats: scrollDepthStats.map(sd => {
      const data = JSON.parse(sd.data as string);
      return {
        depth: data.label,
        count: sd._count.id
      };
    }),
    buttonClicks,
    formSubmissions
  };
}

async function getConversionStats(startDate: Date) {
  const [
    bookingConversions,
    contactFormSubmissions,
    newsletterSignups,
    conversionFunnel
  ] = await Promise.all([
    // Booking conversions
    prisma.analyticsEvent.count({
      where: {
        event: 'booking_complete',
        timestamp: { gte: startDate }
      }
    }),
    
    // Contact form submissions
    prisma.analyticsEvent.count({
      where: {
        event: 'form_submit',
        timestamp: { gte: startDate },
        data: { contains: 'contact' }
      }
    }),
    
    // Newsletter signups
    prisma.analyticsEvent.count({
      where: {
        event: 'newsletter_signup',
        timestamp: { gte: startDate }
      }
    }),
    
    // Conversion funnel
    getConversionFunnel(startDate)
  ]);

  return {
    bookingConversions,
    contactFormSubmissions,
    newsletterSignups,
    conversionFunnel
  };
}

async function getErrorStats(startDate: Date) {
  const [
    totalErrors,
    errorsBySeverity,
    topErrors,
    errorTrends
  ] = await Promise.all([
    // Total errors
    prisma.errorReport.count({
      where: {
        timestamp: { gte: startDate }
      }
    }),
    
    // Errors by severity
    prisma.errorReport.groupBy({
      by: ['severity'],
      where: {
        timestamp: { gte: startDate }
      },
      _count: { id: true }
    }),
    
    // Top errors by frequency
    prisma.errorReport.groupBy({
      by: ['message'],
      where: {
        timestamp: { gte: startDate }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    }),
    
    // Error trends (daily)
    getErrorTrends(startDate)
  ]);

  return {
    totalErrors,
    errorsBySeverity: errorsBySeverity.map(e => ({
      severity: e.severity,
      count: e._count.id
    })),
    topErrors: topErrors.map(e => ({
      message: e.message,
      count: e._count.id
    })),
    errorTrends
  };
}

async function getPerformanceStats(startDate: Date) {
  const performanceEvents = await prisma.analyticsEvent.findMany({
    where: {
      event: 'performance_metric',
      timestamp: { gte: startDate }
    },
    select: { data: true }
  });

  const metrics: Record<string, number[]> = {};
  
  performanceEvents.forEach(event => {
    const data = JSON.parse(event.data as string);
    if (!metrics[data.label]) {
      metrics[data.label] = [];
    }
    metrics[data.label]!.push(data.value);
  });

  const performanceStats = Object.entries(metrics).map(([metric, values]) => ({
    metric,
    avg: values.reduce((sum, val) => sum + val, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length
  }));

  return performanceStats;
}

async function calculateBounceRate(startDate: Date): Promise<number> {
  // Get all sessions with their page view counts
  const sessions = await prisma.analyticsEvent.groupBy({
    by: ['sessionId'],
    where: {
      event: 'page_view',
      timestamp: { gte: startDate },
      sessionId: { not: null }
    },
    _count: { id: true }
  });

  const totalSessions = sessions.length;
  const bouncedSessions = sessions.filter(s => s._count.id === 1).length;
  
  return totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;
}

async function getConversionFunnel(startDate: Date) {
  const [
    pageViews,
    dahabiyaViews,
    bookingStarts,
    bookingCompletes
  ] = await Promise.all([
    prisma.analyticsEvent.count({
      where: {
        event: 'page_view',
        timestamp: { gte: startDate }
      }
    }),
    
    prisma.analyticsEvent.count({
      where: {
        event: 'page_view',
        timestamp: { gte: startDate },
        data: { contains: '/dahabiyat/' }
      }
    }),
    
    prisma.analyticsEvent.count({
      where: {
        event: 'begin_checkout',
        timestamp: { gte: startDate }
      }
    }),
    
    prisma.analyticsEvent.count({
      where: {
        event: 'booking_complete',
        timestamp: { gte: startDate }
      }
    })
  ]);

  return [
    { step: 'Page Views', count: pageViews },
    { step: 'Dahabiya Views', count: dahabiyaViews },
    { step: 'Booking Started', count: bookingStarts },
    { step: 'Booking Completed', count: bookingCompletes }
  ];
}

async function getErrorTrends(startDate: Date) {
  const errors = await prisma.errorReport.groupBy({
    by: ['timestamp'],
    where: {
      timestamp: { gte: startDate }
    },
    _count: { id: true }
  });

  // Group by day
  const dailyErrors: Record<string, number> = {};
  errors.forEach(error => {
    const day = error.timestamp.toISOString().split('T')[0];
    if (day) {
      dailyErrors[day] = (dailyErrors[day] || 0) + error._count.id;
    }
  });

  return Object.entries(dailyErrors).map(([date, count]) => ({
    date,
    count
  }));
}
