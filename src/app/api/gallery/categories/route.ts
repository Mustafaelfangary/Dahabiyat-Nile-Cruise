import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const categories = await prisma.galleryCategory.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        images: {
          where: includeInactive ? {} : { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const category = await prisma.galleryCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        order: data.order || 0,
        isActive: data.isActive ?? true
      }
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error creating gallery category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
