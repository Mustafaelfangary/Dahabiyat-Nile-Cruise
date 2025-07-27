import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const type = searchParams.get('type') as 'dahabiya' | 'package';

    if (!slug || !type) {
      return NextResponse.json({ error: 'Missing slug or type parameter' }, { status: 400 });
    }

    // Check if enhanced page exists
    const pageDir = path.join(process.cwd(), 'src', 'app', type === 'dahabiya' ? 'dahabiyat' : 'packages', slug);
    const pageFile = path.join(pageDir, 'page.tsx');
    const hasPage = fs.existsSync(pageFile);

    // Check if page has proper enhanced structure
    let hasBookingIntegration = false;
    if (hasPage) {
      const pageContent = fs.readFileSync(pageFile, 'utf8');
      const expectedComponent = type === 'dahabiya' ? 'EnhancedDahabiyaPage' : 'EnhancedPackagePage';
      hasBookingIntegration = pageContent.includes(expectedComponent);
    }

    // Check if content keys exist
    const contentKeys = await prisma.setting.findMany({
      where: { group: slug }
    });

    const expectedKeyCount = type === 'dahabiya' ? 14 : 13; // Based on our enhanced creation utils
    const hasContentKeys = contentKeys.length >= expectedKeyCount;

    const isEnhanced = hasPage && hasContentKeys && hasBookingIntegration;

    return NextResponse.json({
      isEnhanced,
      hasPage,
      hasContentKeys,
      hasBookingIntegration,
      contentKeyCount: contentKeys.length,
      expectedKeyCount
    });
  } catch (error) {
    console.error('Error checking detailed enhancement status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
