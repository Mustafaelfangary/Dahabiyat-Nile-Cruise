import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { z } from "zod";

const uploadSchema = z.object({
  contentKey: z.string().min(1),
  file: z.any(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const contentKey = formData.get("contentKey") as string;

    if (!file || !contentKey) {
      return NextResponse.json({ error: "File and content key are required" }, { status: 400 });
    }

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Only images and videos are allowed" }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${contentKey}_${timestamp}.${extension}`;
    
    // Determine directory
    const directory = isImage ? "images" : "videos";
    const uploadDir = join(process.cwd(), "public", directory);
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Create media asset record
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        filename,
        originalName: file.name,
        url: `/${directory}/${filename}`,
        type: isImage ? "IMAGE" : "VIDEO",
        size: file.size,
        mimeType: file.type,
      },
    });

    // Update content block with new media URL
    const updatedContent = await prisma.websiteContent.update({
      where: { key: contentKey },
      data: {
        mediaUrl: mediaAsset.url,
        mediaType: mediaAsset.type,
      },
    });

    return NextResponse.json({
      mediaAsset,
      updatedContent,
      url: mediaAsset.url,
    });
  } catch (error) {
    console.error("Failed to upload media:", error);
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const contentKey = formData.get("contentKey") as string;
    const oldMediaUrl = formData.get("oldMediaUrl") as string;

    if (!file || !contentKey) {
      return NextResponse.json({ error: "File and content key are required" }, { status: 400 });
    }

    // Delete old file if exists
    if (oldMediaUrl) {
      try {
        const oldFilename = oldMediaUrl.split("/").pop();
        if (oldFilename) {
          const isVideo = oldFilename.match(/\.(mp4|webm|mov)$/i);
          const oldDirectory = isVideo ? "videos" : "images";
          const oldFilePath = join(process.cwd(), "public", oldDirectory, oldFilename);
          
          if (existsSync(oldFilePath)) {
            const { unlink } = await import("fs/promises");
            await unlink(oldFilePath);
          }
        }
      } catch (error) {
        console.warn("Failed to delete old file:", error);
      }
    }

    // Upload new file (same logic as POST)
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Only images and videos are allowed" }, { status: 400 });
    }

    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${contentKey}_${timestamp}.${extension}`;
    
    const directory = isImage ? "images" : "videos";
    const uploadDir = join(process.cwd(), "public", directory);
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Create new media asset record
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        filename,
        originalName: file.name,
        url: `/${directory}/${filename}`,
        type: isImage ? "IMAGE" : "VIDEO",
        size: file.size,
        mimeType: file.type,
      },
    });

    // Update content block
    const updatedContent = await prisma.websiteContent.update({
      where: { key: contentKey },
      data: {
        mediaUrl: mediaAsset.url,
        mediaType: mediaAsset.type,
      },
    });

    return NextResponse.json({
      mediaAsset,
      updatedContent,
      url: mediaAsset.url,
    });
  } catch (error) {
    console.error("Failed to replace media:", error);
    return NextResponse.json({ error: "Failed to replace media" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const contentKey = searchParams.get("contentKey");
    const mediaUrl = searchParams.get("mediaUrl");

    if (!contentKey || !mediaUrl) {
      return NextResponse.json({ error: "Content key and media URL are required" }, { status: 400 });
    }

    // Delete file
    const filename = mediaUrl.split("/").pop();
    if (filename) {
      const isVideo = filename.match(/\.(mp4|webm|mov)$/i);
      const directory = isVideo ? "videos" : "images";
      const filePath = join(process.cwd(), "public", directory, filename);
      
      if (existsSync(filePath)) {
        const { unlink } = await import("fs/promises");
        await unlink(filePath);
      }
    }

    // Update content block to remove media
    const updatedContent = await prisma.websiteContent.update({
      where: { key: contentKey },
      data: {
        mediaUrl: null,
        mediaType: null,
      },
    });

    return NextResponse.json({
      message: "Media deleted successfully",
      updatedContent,
    });
  } catch (error) {
    console.error("Failed to delete media:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
