import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  hieroglyph: z.string().optional(),
  color: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const categories = await prisma.galleryCategory.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        images: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        _count: {
          select: { images: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching gallery categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    const validated = categorySchema.parse(data);

    // Transform undefined to null for Prisma
    const createData = {
      ...validated,
      description: validated.description ?? null,
      hieroglyph: validated.hieroglyph ?? null,
      color: validated.color ?? null,
    };

    const category = await prisma.galleryCategory.create({
      data: createData,
      include: {
        images: true,
        _count: {
          select: { images: true },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating gallery category:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create category" },
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
    const validated = categorySchema.partial().parse(updateData);

    // Filter out undefined values and transform to null where needed
    const updateDataFiltered: any = {};
    Object.keys(validated).forEach(key => {
      const value = (validated as any)[key];
      if (value !== undefined) {
        updateDataFiltered[key] = value;
      }
    });

    const category = await prisma.galleryCategory.update({
      where: { id },
      data: updateDataFiltered,
      include: {
        images: true,
        _count: {
          select: { images: true },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating gallery category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
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

    // Check if category has images
    const imageCount = await prisma.galleryImage.count({
      where: { categoryId: id },
    });

    if (imageCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with images. Please move or delete images first." },
        { status: 400 }
      );
    }

    await prisma.galleryCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
