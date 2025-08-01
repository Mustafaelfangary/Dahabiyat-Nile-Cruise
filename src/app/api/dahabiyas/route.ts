import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for dahabiya creation/update
const dahabiyaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  pricePerDay: z.number().positive("Price must be positive"),
  capacity: z.number().positive("Capacity must be positive"),
  cabins: z.number().optional(),
  crew: z.number().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  yearBuilt: z.number().optional(),
  mainImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
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
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).optional(),
  itineraryIds: z.array(z.string()).optional(),
});

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /api/dahabiyas - List all dahabiyas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const activeOnly = searchParams.get("active") === "true";

    const skip = (page - 1) * limit;

    const where = activeOnly ? { isActive: true } : {};

    const [dahabiyas, total] = await Promise.all([
      prisma.dahabiya.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.dahabiya.count({ where }),
    ]);

    return NextResponse.json({
      dahabiyas,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching dahabiyas:", error);
    return NextResponse.json(
      { error: "Failed to fetch dahabiyas" },
      { status: 500 }
    );
  }
}

// POST /api/dahabiyas - Create new dahabiya
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    console.log('POST /api/dahabiyas - Received body:', JSON.stringify(body, null, 2));

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

    console.log('POST /api/dahabiyas - Processed body:', JSON.stringify(processedBody, null, 2));

    const validatedData = dahabiyaSchema.parse(processedBody);

    // Generate unique slug
    const baseSlug = generateSlug(validatedData.name);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.dahabiya.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Filter out undefined values and prepare data for creation
    const createData = {
      name: validatedData.name,
      description: validatedData.description,
      pricePerDay: validatedData.pricePerDay,
      capacity: validatedData.capacity,
      slug,
      gallery: validatedData.gallery || [],
      features: validatedData.features || [],
      amenities: validatedData.amenities || [],
      activities: validatedData.activities || [],
      diningOptions: validatedData.diningOptions || [],
      services: validatedData.services || [],
      routes: validatedData.routes || [],
      highlights: validatedData.highlights || [],
      tags: validatedData.tags || [],
      isActive: validatedData.isActive ?? true,
      isFeatured: validatedData.isFeatured ?? false,
      category: validatedData.category || 'DELUXE',
      rating: 0,
      reviewCount: 0,
      ...(validatedData.shortDescription !== undefined && { shortDescription: validatedData.shortDescription }),
      ...(validatedData.cabins !== undefined && { cabins: validatedData.cabins }),
      ...(validatedData.crew !== undefined && { crew: validatedData.crew }),
      ...(validatedData.length !== undefined && { length: validatedData.length }),
      ...(validatedData.width !== undefined && { width: validatedData.width }),
      ...(validatedData.yearBuilt !== undefined && { yearBuilt: validatedData.yearBuilt }),
      ...(validatedData.mainImage !== undefined && { mainImage: validatedData.mainImage }),
      ...(validatedData.videoUrl !== undefined && { videoUrl: validatedData.videoUrl }),
      ...(validatedData.virtualTourUrl !== undefined && { virtualTourUrl: validatedData.virtualTourUrl }),
      ...(validatedData.metaTitle !== undefined && { metaTitle: validatedData.metaTitle }),
      ...(validatedData.metaDescription !== undefined && { metaDescription: validatedData.metaDescription }),
    };

    const dahabiya = await prisma.dahabiya.create({
      data: createData,
    });

    // Handle itinerary associations if provided
    if (validatedData.itineraryIds && validatedData.itineraryIds.length > 0) {
      const itineraryAssociations = validatedData.itineraryIds.map((itineraryId, index) => ({
        dahabiyaId: dahabiya.id,
        itineraryId,
        isDefault: index === 0 // First itinerary is default
      }));

      await prisma.dahabiyaItinerary.createMany({
        data: itineraryAssociations,
        skipDuplicates: true
      });
    }

    // Fetch the created dahabiya with its itineraries
    const dahabiyaWithItineraries = await prisma.dahabiya.findUnique({
      where: { id: dahabiya.id },
      include: {
        itineraries: {
          include: {
            itinerary: {
              select: {
                id: true,
                name: true,
                durationDays: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(dahabiyaWithItineraries, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating dahabiya:", error);
    return NextResponse.json(
      { error: "Failed to create dahabiya" },
      { status: 500 }
    );
  }
}
