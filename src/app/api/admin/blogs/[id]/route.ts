import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch individual blog for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id }
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

// PUT - Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Generate slug from title if not provided
    let slug = data.slug;
    if (!slug && data.title) {
      slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if slug is unique (excluding current blog)
    if (slug) {
      const existingBlog = await prisma.blog.findFirst({
        where: {
          slug: slug,
          NOT: { id: id }
        }
      });

      if (existingBlog) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Calculate read time (average 200 words per minute)
    const wordCount = data.content ? data.content.split(/\s+/).length : 0;
    const readTime = Math.ceil(wordCount / 200);

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        excerpt: data.excerpt,
        content: data.content,
        mainImageUrl: data.mainImageUrl,
        heroImageUrl: data.heroImageUrl,
        author: data.author || "Cleopatra Dahabiyat",
        tags: data.tags || [],
        category: data.category,
        isPublished: data.isPublished ?? false,
        featured: data.featured ?? false,
        publishedAt: data.isPublished ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null,
        readTime: readTime,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// PATCH - Update specific blog fields (like status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id }
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Update only the provided fields
    const updateData: Record<string, unknown> = {};
    if ('isPublished' in data) updateData.isPublished = data.isPublished;
    if ('featured' in data) updateData.featured = data.featured;
    if ('publishedAt' in data) updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id }
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Delete the blog
    await prisma.blog.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
