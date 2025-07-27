import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    // Allow public access for reading website content
    // No authentication required for GET requests
    const { section } = await params;

    // Get actual content from websiteContent database
    const dbContent = await prisma.websiteContent.findMany({
      where: { 
        page: section,
        isActive: true 
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    // Convert to the format expected by useContent hook
    const fields = dbContent.map(content => ({
      id: content.id,
      key: content.key,
      label: content.title || content.key,
      value: content.content || content.mediaUrl || '',
      type: content.contentType?.toLowerCase() || 'text',
      placeholder: '',
      section: content.section
    }));

    return NextResponse.json({
      section,
      fields
    });

  } catch (error) {
    console.error('Error fetching website content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
