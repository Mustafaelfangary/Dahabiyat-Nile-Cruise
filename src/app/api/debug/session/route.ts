import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      session,
      isAuthenticated: !!session,
      isAdmin: session?.user?.role === 'ADMIN',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Session debug error:', error);
    return NextResponse.json(
      { error: 'Failed to get session', details: error },
      { status: 500 }
    );
  }
}
