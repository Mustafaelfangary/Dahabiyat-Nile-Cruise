import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;

    // Check if content exists
    const existing = await prisma.pageContent.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // If key is being changed, check for conflicts
    if (data.key && data.key !== existing.key) {
      const keyExists = await prisma.pageContent.findUnique({
        where: { key: data.key }
      });

      if (keyExists) {
        return NextResponse.json(
          { error: 'Content with this key already exists' },
          { status: 400 }
        );
      }
    }

    const content = await prisma.pageContent.update({
      where: { id },
      data: {
        key: data.key || existing.key,
        title: data.title || existing.title,
        content: data.content !== undefined ? data.content : existing.content,
        contentType: data.contentType || existing.contentType,
        page: data.page || existing.page,
        section: data.section || existing.section,
        order: data.order !== undefined ? data.order : existing.order,
        isActive: data.isActive !== undefined ? data.isActive : existing.isActive,
        metadata: data.metadata !== undefined ? data.metadata : existing.metadata,
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating page content:', error);
    return NextResponse.json(
      { error: 'Failed to update page content' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if content exists
    const existing = await prisma.pageContent.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    await prisma.pageContent.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting page content:', error);
    return NextResponse.json(
      { error: 'Failed to delete page content' },
      { status: 500 }
    );
  }
}
