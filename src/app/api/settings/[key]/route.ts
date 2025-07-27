import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from 'next/cache';

const updateContentSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
  contentType: z.enum(['TEXT', 'TEXTAREA', 'RICH_TEXT', 'IMAGE', 'VIDEO', 'GALLERY', 'TESTIMONIAL', 'FEATURE', 'CTA']).optional(),
  page: z.string().optional(),
  section: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const contentBlock = await prisma.setting.findUnique({
      where: { key }
    });

    if (!contentBlock) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(contentBlock);
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateContentSchema.parse(body);
    const { key } = await params;

    const updatedContent = await prisma.setting.update({
      where: { key },
      data: {
        value: validated.content || validated.value || '',
        group: validated.page || validated.group || 'general',
      },
    });

    revalidatePath('/');
    return NextResponse.json(updatedContent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Failed to update content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key } = await params;
    await prisma.setting.delete({
      where: { key }
    });

    revalidatePath('/');
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete content:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}
