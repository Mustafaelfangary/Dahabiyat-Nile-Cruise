import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');
    const key = searchParams.get('key');

    if (key) {
      // Get specific content by key
      const content = await prisma.websiteContent.findFirst({
        where: {
          key,
          isActive: true
        }
      });

      if (!content) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(content);
    }

    // Get content by page and/or section
    const where: Record<string, unknown> = { isActive: true };
    if (page) where.page = page;
    if (section) where.section = section;

    const contents = await prisma.websiteContent.findMany({
      where,
      orderBy: [
        { section: 'asc' },
        { order: 'asc' },
      ],
    });

    // Group by section for easier frontend consumption
    const grouped = contents.reduce((acc, content) => {
      const section = content.section || 'default';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section]!.push(content);
      return acc;
    }, {} as Record<string, unknown[]>);

    return NextResponse.json({
      contents,
      grouped
    });
  } catch (error) {
    console.error('Error fetching page contents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page contents' },
      { status: 500 }
    );
  }
}
