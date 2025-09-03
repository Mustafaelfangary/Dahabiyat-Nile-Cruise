import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for dahabiya updates
const updateDahabiyaSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required").optional(),
  shortDescription: z.string().optional(),
  pricePerDay: z.number().positive("Price must be positive").optional(),
  capacity: z.number().positive("Capacity must be positive").optional(),
  cabins: z.number().optional(),
  crew: z.number().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  yearBuilt: z.number().optional(),
  mainImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  specificationsImage: z.string().optional(),
  videoUrl: z.string().optional(),
  virtualTourUrl: z.string().optional(),
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  diningOptions: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  routes: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  category: z.enum(['LUXURY', 'DELUXE', 'PREMIUM', 'BOUTIQUE']).optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /api/dahabiyas/[id] - Get single dahabiya by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if it's a CUID (ID) or slug
    const isCUID = /^c[a-z0-9]{24,25}$/i.test(id);
    
    const dahabiya = await prisma.dahabiya.findUnique({
      where: isCUID ? { id } : { slug: id },
    });

    if (!dahabiya) {
      return NextResponse.json(
        { error: "Dahabiya not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(dahabiya);
  } catch (error) {
    console.error("Error fetching dahabiya:", error);
    return NextResponse.json(
      { error: "Failed to fetch dahabiya" },
      { status: 500 }
    );
  }
}

// PUT /api/dahabiyas/[id] - Update dahabiya
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    console.log('PUT /api/dahabiyas/[id] - Received body:', JSON.stringify(body, null, 2));

    // Convert string numbers to actual numbers
    const processedBody = {
      ...body,
      pricePerDay: body.pricePerDay ? Number(body.pricePerDay) : undefined,
      capacity: body.capacity ? Number(body.capacity) : undefined,
      cabins: body.cabins ? Number(body.cabins) : undefined,
      crew: body.crew ? Number(body.crew) : undefined,
      length: body.length ? Number(body.length) : undefined,
      width: body.width ? Number(body.width) : undefined,
      yearBuilt: body.yearBuilt ? Number(body.yearBuilt) : undefined,
      rating: body.rating ? Number(body.rating) : undefined,
      reviewCount: body.reviewCount ? Number(body.reviewCount) : undefined,
    };

    console.log('PUT /api/dahabiyas/[id] - Processed body:', JSON.stringify(processedBody, null, 2));

    const validatedData = updateDahabiyaSchema.parse(processedBody);

    // Check if dahabiya exists
    const isCUID = /^c[a-z0-9]{24,25}$/i.test(id);
    const existingDahabiya = await prisma.dahabiya.findUnique({
      where: isCUID ? { id } : { slug: id },
    });

    if (!existingDahabiya) {
      return NextResponse.json(
        { error: "Dahabiya not found" },
        { status: 404 }
      );
    }

    // Generate new slug if name is being updated
    let updateData = { ...validatedData };
    if (validatedData.name && validatedData.name !== existingDahabiya.name) {
      const baseSlug = generateSlug(validatedData.name);
      let slug = baseSlug;
      let counter = 1;

      while (await prisma.dahabiya.findFirst({
        where: { slug, id: { not: existingDahabiya.id } }
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      updateData = { ...updateData, slug };
    }

    // Filter out undefined values to satisfy exactOptionalPropertyTypes
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    const dahabiya = await prisma.dahabiya.update({
      where: { id: existingDahabiya.id },
      data: filteredUpdateData,
    });

    return NextResponse.json(dahabiya);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating dahabiya:", error);
    return NextResponse.json(
      { error: "Failed to update dahabiya" },
      { status: 500 }
    );
  }
}

// DELETE /api/dahabiyas/[id] - Delete dahabiya
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if dahabiya exists
    const isCUID = /^c[a-z0-9]{24,25}$/i.test(id);
    const existingDahabiya = await prisma.dahabiya.findUnique({
      where: isCUID ? { id } : { slug: id },
    });

    if (!existingDahabiya) {
      return NextResponse.json(
        { error: "Dahabiya not found" },
        { status: 404 }
      );
    }

    await prisma.dahabiya.delete({
      where: { id: existingDahabiya.id },
    });

    return NextResponse.json({ message: "Dahabiya deleted successfully" });
  } catch (error) {
    console.error("Error deleting dahabiya:", error);
    return NextResponse.json(
      { error: "Failed to delete dahabiya" },
      { status: 500 }
    );
  }
}
