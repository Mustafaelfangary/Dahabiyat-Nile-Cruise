import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const includeInactive = searchParams.get("includeInactive") === "true";
    const featured = searchParams.get("featured") === "true";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (!includeInactive) {
      where.isActive = true;
    }
    
    if (featured) {
      where.isFeatured = true;
    }

    const images = await prisma.galleryImage.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
      ...(limit && { take: limit }),
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const validated = imageSchema.parse(data);

    // Transform undefined to null for Prisma
    const createData = {
      ...validated,
      alt: validated.alt ?? null,
      title: validated.title ?? null,
      description: validated.description ?? null,
    };

    const image = await prisma.galleryImage.create({
      data: createData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error creating gallery image:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;
    const validated = imageSchema.partial().parse(updateData);

    // Filter out undefined values
    const updateDataFiltered: any = {};
    Object.keys(validated).forEach(key => {
      const value = (validated as any)[key];
      if (value !== undefined) {
        updateDataFiltered[key] = value;
      }
    });

    const image = await prisma.galleryImage.update({
      where: { id },
      data: updateDataFiltered,
      include: {
        category: true,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    await prisma.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
