import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { message, stack, context, url, user_agent, timestamp, user_id, session_id } = body;

    if (!message) {
      return NextResponse.json({ error: 'Error message is required' }, { status: 400 });
    }

    // Get client IP
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Store error report
    const errorReport = await prisma.errorReport.create({
      data: {
        message,
        stack: stack || null,
        context: context || null,
        url: url || null,
        userAgent: user_agent || request.headers.get('user-agent') || 'unknown',
        ipAddress: clientIP,
        userId: session?.user?.id || user_id || null,
        sessionId: session_id || null,
        timestamp: new Date(timestamp || Date.now()),
        severity: determineSeverity(message, stack),
        resolved: false
      }
    });

    // Send critical errors to admin notification
    if (errorReport.severity === 'CRITICAL') {
      await sendCriticalErrorNotification(errorReport);
    }

    return NextResponse.json({ success: true, id: errorReport.id });

  } catch (error) {
    console.error('Error reporting error:', error);
    return NextResponse.json(
      { error: 'Failed to record error' },
      { status: 500 }
    );
  }
}

function determineSeverity(message: string, stack?: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const criticalKeywords = ['payment', 'booking', 'database', 'auth', 'security'];
  const highKeywords = ['api', 'server', 'network', 'timeout'];
  const mediumKeywords = ['validation', 'form', 'ui', 'component'];

  const text = (message + ' ' + (stack || '')).toLowerCase();

  if (criticalKeywords.some(keyword => text.includes(keyword))) {
    return 'CRITICAL';
  } else if (highKeywords.some(keyword => text.includes(keyword))) {
    return 'HIGH';
  } else if (mediumKeywords.some(keyword => text.includes(keyword))) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}

async function sendCriticalErrorNotification(errorReport: any) {
  try {
    // Send email notification to admin
    const { sendEmail } = await import('@/lib/email');
    
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@cleopatra-dahabiyat.com',
      subject: '🚨 Critical Error Alert - Cleopatra Dahabiyat',
      template: 'critical-error',
      data: {
        error: errorReport,
        dashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/analytics/errors/${errorReport.id}`
      }
    });
  } catch (emailError) {
    console.error('Failed to send critical error notification:', emailError);
  }
}
