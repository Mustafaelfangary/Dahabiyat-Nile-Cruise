import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const mediaAssetSchema = z.object({
  filename: z.string().min(1),
  originalName: z.string().min(1),
  url: z.string().min(1),
  type: z.enum(["IMAGE", "VIDEO", "DOCUMENT"]),
  size: z.number().min(0),
  mimeType: z.string().min(1),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const whereClause: Record<string, unknown> = {};
    if (type) whereClause.type = type;

    const mediaAssets = await prisma.mediaAsset.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(mediaAssets);
  } catch (error) {
    console.error('Failed to fetch media assets:', error);
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = mediaAssetSchema.parse(body);

    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        filename: validated.filename,
        originalName: validated.originalName,
        url: validated.url,
        type: validated.type,
        size: validated.size,
        mimeType: validated.mimeType,
        alt: validated.alt ?? null,
        caption: validated.caption ?? null,
      },
    });

    return NextResponse.json(mediaAsset);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to create media asset:', error);
    return NextResponse.json({ error: "Failed to create media asset" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Media asset ID is required" }, { status: 400 });
    }

    const validated = mediaAssetSchema.partial().parse(updateData);

    // Filter out undefined values
    const updateDataFiltered: Record<string, unknown> = {};
    Object.keys(validated).forEach(key => {
      const value = validated[key as keyof typeof validated];
      if (value !== undefined) {
        updateDataFiltered[key] = value;
      }
    });

    const updatedMediaAsset = await prisma.mediaAsset.update({
      where: { id },
      data: updateDataFiltered
    });

    return NextResponse.json(updatedMediaAsset);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to update media asset:', error);
    return NextResponse.json({ error: "Failed to update media asset" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Media asset ID is required" }, { status: 400 });
    }

    await prisma.mediaAsset.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete media asset:', error);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
