import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const images = await prisma.galleryImage.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        category: true
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const image = await prisma.galleryImage.create({
      data: {
        url: data.url,
        alt: data.alt,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        order: data.order || 0,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        tags: data.tags || []
      }
    });

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 });
  }
}
