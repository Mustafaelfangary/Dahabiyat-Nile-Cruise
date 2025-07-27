import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
    const isEnhanced = fs.existsSync(pageFile);

    return NextResponse.json({ isEnhanced });
  } catch (error) {
    console.error('Error checking enhancement status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
