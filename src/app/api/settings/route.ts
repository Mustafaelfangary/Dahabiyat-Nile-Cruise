import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from 'next/cache';

const contentBlockSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  content: z.string().optional().nullable(),
  mediaUrl: z.string().optional().nullable(),
  mediaType: z.enum(["IMAGE", "VIDEO", "DOCUMENT"]).optional().nullable(),
  contentType: z.enum([
    "TEXT",
    "TEXTAREA",
    "RICH_TEXT",
    "IMAGE",
    "VIDEO",
    "GALLERY",
    "TESTIMONIAL",
    "FEATURE",
    "CTA"
  ]),
  page: z.string().min(1),
  section: z.string().min(1),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');
    const group = searchParams.get('group');

    // If group parameter is provided, use Settings model
    if (group) {
      const settings = await prisma.setting.findMany({
        where: { group }
      });

      const settingsObject = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json(settingsObject);
    }

    // Fetch content from settings table for now
    let whereClause: any = {};

    if (group) {
      whereClause.group = group;
    } else if (page) {
      whereClause.group = page; // Use page as group for now
    }

    const settings = await prisma.setting.findMany({
      where: whereClause,
      orderBy: {
        key: 'asc'
      }
    });

    // Convert settings to content blocks format
    const contentBlocks = settings.map(setting => ({
      id: setting.id,
      key: setting.key,
      title: setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      content: setting.value,
      mediaUrl: setting.value.startsWith('http') ? setting.value : null,
      mediaType: setting.value.startsWith('http') ? 'IMAGE' : null,
      contentType: setting.value.length > 100 ? 'TEXTAREA' : 'TEXT',
      page: setting.group,
      section: 'general',
      order: 0,
      isActive: true,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
    }));

    // Create a settings object for backward compatibility
    const contentObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    const response = NextResponse.json({
      blocks: contentBlocks, // For ContentManager component
      contentBlocks, // For backward compatibility
      settings: contentObject // For backward compatibility
    });

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Failed to fetch content blocks:', error);
    return NextResponse.json({ error: "Failed to fetch content blocks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Save to settings table for now
    const setting = await prisma.setting.upsert({
      where: { key: body.key },
      update: {
        value: body.content || body.value || '',
        group: body.page || body.group || 'general',
      },
      create: {
        key: body.key,
        value: body.content || body.value || '',
        group: body.page || body.group || 'general',
      },
    });

    revalidatePath('/');
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Failed to create/update setting:', error);
    return NextResponse.json({ error: "Failed to create/update setting" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log('PUT request body:', body);

    // Save to settings table for now
    const setting = await prisma.setting.upsert({
      where: { key: body.key },
      update: {
        value: body.content || body.value || '',
        group: body.page || body.group || 'general',
      },
      create: {
        key: body.key,
        value: body.content || body.value || '',
        group: body.page || body.group || 'general',
      },
    });

    revalidatePath('/');
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Failed to update setting:', error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Content block key is required" }, { status: 400 });
    }

    await prisma.websiteContent.delete({
      where: { key }
    });

    revalidatePath('/');
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete content block:', error);
    return NextResponse.json({ error: "Failed to delete content block" }, { status: 500 });
  }
}