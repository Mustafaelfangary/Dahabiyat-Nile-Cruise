import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return mock data since we don't have a Media model yet
    // In a real implementation, you would fetch from a Media table
    const mockMediaFiles = [
      {
        id: '1',
        url: '/images/hero-bg.jpg',
        name: 'hero-bg.jpg',
        type: 'image/jpeg',
        size: 1024000,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        url: '/images/dahabiya-1.jpg',
        name: 'dahabiya-1.jpg',
        type: 'image/jpeg',
        size: 512000,
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(mockMediaFiles);
  } catch (error) {
    console.error('Error fetching media files:', error);
    return NextResponse.json({ error: 'Failed to fetch media files' }, { status: 500 });
  }
}
