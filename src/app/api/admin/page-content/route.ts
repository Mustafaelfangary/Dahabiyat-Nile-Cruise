import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    const where: {
      page?: string;
      section?: string;
    } = {};
    if (page && page !== 'all') where.page = page;
    if (section && section !== 'all') where.section = section;

    const contents = await prisma.pageContent.findMany({
      where,
      orderBy: [
        { page: 'asc' },
        { section: 'asc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error('Error fetching page contents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page contents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.key || !data.title || !data.content || !data.page || !data.section) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if key already exists
    const existing = await prisma.pageContent.findUnique({
      where: { key: data.key }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Content with this key already exists' },
        { status: 400 }
      );
    }

    const content = await prisma.pageContent.create({
      data: {
        key: data.key,
        title: data.title,
        content: data.content,
        contentType: data.contentType || 'TEXT',
        page: data.page,
        section: data.section,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        metadata: data.metadata || {},
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating page content:', error);
    return NextResponse.json(
      { error: 'Failed to create page content' },
      { status: 500 }
    );
  }
}
