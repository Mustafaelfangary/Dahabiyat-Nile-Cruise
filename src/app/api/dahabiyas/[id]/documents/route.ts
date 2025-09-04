import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public endpoint: list documents (PDFs) attached to a dahabiya (by id or slug)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Resolve dahabiya by id or slug
    const dahabiya = await prisma.dahabiya.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      select: { id: true },
    });

    if (!dahabiya) {
      return NextResponse.json({ error: 'Dahabiya not found' }, { status: 404 });
    }

    const documents = await prisma.pDFDocument.findMany({
      where: { dahabiyaId: dahabiya.id },
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        name: true,
        type: true,
        url: true,
        size: true,
        uploadedAt: true,
      },
    });

    // Public-safe response
    return NextResponse.json(documents, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching dahabiya documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
