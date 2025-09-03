import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    const whereClause: Record<string, unknown> = {
      isActive: true
    };

    if (page) {
      whereClause.page = page;
    }

    if (section) {
      whereClause.section = section;
    }

    const content = await prisma.websiteContent.findMany({
      where: whereClause,
      orderBy: [
        { section: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    const response = NextResponse.json(content);

    // Add aggressive cache-busting headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('ETag', `"${Date.now()}"`);
    response.headers.set('Last-Modified', new Date().toUTCString());

    return response;
  } catch (error) {
    console.error('Error fetching website content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, title, content, mediaUrl, contentType, page, section, order } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    const websiteContent = await prisma.websiteContent.upsert({
      where: { key },
      update: {
        title,
        content,
        mediaUrl,
        contentType: contentType || 'TEXT',
        page: page || 'general',
        section: section || 'general',
        order: order || 0,
        isActive: true
      },
      create: {
        key,
        title,
        content,
        mediaUrl,
        contentType: contentType || 'TEXT',
        page: page || 'general',
        section: section || 'general',
        order: order || 0,
        isActive: true
      }
    });

    // Revalidate relevant pages to clear cache
    try {
      revalidatePath('/');
      revalidatePath('/about');
      revalidatePath('/contact');
      revalidatePath('/packages');
      revalidatePath('/dahabiyat');
      revalidatePath('/tailor-made');
    } catch (error) {
      console.log('Cache revalidation failed:', error);
    }

    return NextResponse.json(websiteContent);
  } catch (error) {
    console.error('Error creating/updating website content:', error);
    return NextResponse.json(
      { error: 'Failed to save website content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, title, content, mediaUrl, contentType, page, section, order } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    const websiteContent = await prisma.websiteContent.update({
      where: { key },
      data: {
        title,
        content,
        mediaUrl,
        contentType: contentType || 'TEXT',
        page: page || 'general',
        section: section || 'general',
        order: order || 0,
        isActive: true
      }
    });

    // Revalidate relevant pages to clear cache
    try {
      revalidatePath('/');
      revalidatePath('/about');
      revalidatePath('/contact');
      revalidatePath('/packages');
      revalidatePath('/dahabiyat');
      revalidatePath('/tailor-made');
    } catch (error) {
      console.log('Cache revalidation failed:', error);
    }

    return NextResponse.json(websiteContent);
  } catch (error) {
    console.error('Error updating website content:', error);
    return NextResponse.json(
      { error: 'Failed to update website content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    await prisma.websiteContent.delete({
      where: { key }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting website content:', error);
    return NextResponse.json(
      { error: 'Failed to delete website content' },
      { status: 500 }
    );
  }
}
