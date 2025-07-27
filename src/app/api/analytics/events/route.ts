import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { event, data } = body;

    if (!event) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    // Get client IP and user agent
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Store analytics event
    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        event,
        userId: session?.user?.id || null,
        sessionId: data.session_id || null,
        data: JSON.stringify(data),
        ipAddress: clientIP,
        userAgent,
        timestamp: new Date(data.timestamp || Date.now())
      }
    });

    // Process specific events for business intelligence
    await processBusinessEvent(event, data, session?.user?.id);

    return NextResponse.json({ success: true, id: analyticsEvent.id });

  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json(
      { error: 'Failed to record event' },
      { status: 500 }
    );
  }
}

async function processBusinessEvent(event: string, data: any, userId?: string) {
  try {
    switch (event) {
      case 'page_view':
        await trackPageView(data, userId);
        break;
      
      case 'booking_complete':
        await trackBookingConversion(data, userId);
        break;
      
      case 'form_submit':
        await trackFormSubmission(data, userId);
        break;
      
      case 'button_click':
        await trackButtonClick(data, userId);
        break;
      
      case 'search':
        await trackSearch(data, userId);
        break;
    }
  } catch (error) {
    console.error('Error processing business event:', error);
  }
}

async function trackPageView(data: any, userId?: string) {
  if (!data.page) return; // Skip if page is undefined

  // Update page view statistics
  const pageValue = String(data.page || 'unknown');
  const dateValue = new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10);

  // Try to find existing record
  const existing = await prisma.pageViewStats.findFirst({
    where: {
      page: pageValue,
      date: dateValue
    }
  });

  if (existing) {
    // Update existing record
    const updateData: any = {
      views: { increment: 1 }
    };
    if (userId) {
      updateData.uniqueViews = { increment: 1 };
    }

    await prisma.pageViewStats.update({
      where: { id: existing.id },
      data: updateData
    });
  } else {
    // Create new record
    await prisma.pageViewStats.create({
      data: {
        page: pageValue,
        date: dateValue,
        views: 1,
        uniqueViews: userId ? 1 : 0
      }
    });
  }

}

async function trackBookingConversion(data: any, userId?: string) {
  // Track conversion metrics
  await prisma.conversionStats.create({
    data: {
      type: 'booking',
      source: data.source || 'direct',
      value: parseFloat(data.value) || 0,
      userId: userId || null,
      metadata: JSON.stringify(data)
    }
  });
}

async function trackFormSubmission(data: any, userId?: string) {
  if (!data.label) return; // Skip if label is undefined

  const formId = String(data.label);
  const dateValue = new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10);

  // Track form interaction stats
  await prisma.formStats.upsert({
    where: {
      form_date: {
        formId: formId,
        date: dateValue
      }
    },
    update: {
      submissions: { increment: 1 }
    },
    create: {
      formId: formId,
      date: dateValue,
      submissions: 1
    }
  });
}

async function trackButtonClick(data: any, userId?: string) {
  if (!data.label) return; // Skip if label is undefined

  const buttonId = String(data.label);
  const dateValue = new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10);

  // Track button interaction stats
  await prisma.buttonStats.upsert({
    where: {
      button_date: {
        buttonId: buttonId,
        date: dateValue
      }
    },
    update: {
      clicks: { increment: 1 }
    },
    create: {
      buttonId: buttonId,
      date: dateValue,
      clicks: 1
    }
  });
}

async function trackSearch(data: any, userId?: string) {
  // Track search queries
  await prisma.searchStats.create({
    data: {
      query: data.query,
      results: data.results || 0,
      userId: userId || null,
      timestamp: new Date()
    }
  });
}
