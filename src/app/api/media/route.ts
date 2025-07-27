import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Recursive function to scan directories
async function scanDirectory(dirPath: string, baseUrl: string): Promise<any[]> {
  const items: any[] = [];

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const urlPath = `${baseUrl}/${entry.name}`;

      if (entry.isDirectory()) {
        // Skip certain directories
        if (entry.name.includes('_files') || entry.name.includes('.html')) {
          continue;
        }
        // Recursively scan subdirectories
        const subItems = await scanDirectory(fullPath, urlPath);
        items.push(...subItems);
      } else if (entry.isFile()) {
        // Check if it's a media file
        if (entry.name.match(/\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff)$/i)) {
          try {
            const stats = await stat(fullPath);
            items.push({
              id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              url: urlPath,
              type: "image/jpeg", // Default type, could be improved
              name: entry.name,
              filename: entry.name,
              size: stats.size,
              createdAt: stats.mtime.toISOString(),
              uploadedAt: stats.mtime.toISOString(),
            });
          } catch (statError) {
            console.warn(`Could not stat file ${fullPath}:`, statError);
          }
        } else if (entry.name.match(/\.(mp4|webm|mov|avi|mkv)$/i)) {
          try {
            const stats = await stat(fullPath);
            items.push({
              id: `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              url: urlPath,
              type: "video/mp4", // Default type
              name: entry.name,
              filename: entry.name,
              size: stats.size,
              createdAt: stats.mtime.toISOString(),
              uploadedAt: stats.mtime.toISOString(),
            });
          } catch (statError) {
            console.warn(`Could not stat file ${fullPath}:`, statError);
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Could not read directory ${dirPath}:`, error);
  }

  return items;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mediaItems: any[] = [];

    // First, get media assets from database (uploaded files)
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const dbMediaAssets = await prisma.mediaAsset.findMany({
        orderBy: { createdAt: 'desc' }
      });

      dbMediaAssets.forEach((asset: any) => {
        mediaItems.push({
          id: `db_${asset.id}`,
          url: asset.url,
          type: asset.mimeType || 'image/jpeg',
          name: asset.originalName,
          filename: asset.filename,
          size: asset.size,
          createdAt: asset.createdAt.toISOString(),
          uploadedAt: asset.createdAt.toISOString(),
          source: 'database'
        });
      });

      await prisma.$disconnect();
    } catch (dbError) {
      console.error('Error fetching database media assets:', dbError);
    }

    // Scan uploads directory (for files not in database)
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (existsSync(uploadsDir)) {
      try {
        const uploadItems = await scanDirectory(uploadsDir, "/uploads");
        // Only add files that aren't already in database
        uploadItems.forEach(item => {
          const existsInDb = mediaItems.some(dbItem => dbItem.url === item.url);
          if (!existsInDb) {
            mediaItems.push({ ...item, source: 'filesystem' });
          }
        });
      } catch (scanError) {
        console.error('Error scanning uploads directory:', scanError);
      }
    }

    // Scan key images directories (for existing content)
    const keyDirectories = [
      { path: join(process.cwd(), "public", "images", "about"), url: "/images/about" },
      { path: join(process.cwd(), "public", "images", "uploads"), url: "/images/uploads" },
      { path: join(process.cwd(), "public", "images"), url: "/images", maxDepth: 1 }
    ];

    for (const dir of keyDirectories) {
      if (existsSync(dir.path)) {
        try {
          const items = await scanDirectory(dir.path, dir.url);
          items.forEach(item => {
            const existsInList = mediaItems.some(existing => existing.url === item.url);
            if (!existsInList) {
              mediaItems.push({ ...item, source: 'images' });
            }
          });
        } catch (scanError) {
          console.error(`Error scanning ${dir.path}:`, scanError);
        }
      }
    }

    // Scan videos directory
    const videosDir = join(process.cwd(), "public", "videos");
    if (existsSync(videosDir)) {
      try {
        const videoItems = await scanDirectory(videosDir, "/videos");
        videoItems.forEach(item => {
          const existsInList = mediaItems.some(existing => existing.url === item.url);
          if (!existsInList) {
            mediaItems.push({ ...item, source: 'videos' });
          }
        });
      } catch (scanError) {
        console.error('Error scanning videos directory:', scanError);
      }
    }

    // Sort by upload date (newest first), prioritizing database items
    mediaItems.sort((a, b) => {
      // Prioritize database items
      if (a.source === 'database' && b.source !== 'database') return -1;
      if (b.source === 'database' && a.source !== 'database') return 1;

      // Then sort by date
      return new Date(b.createdAt || b.uploadedAt).getTime() - new Date(a.createdAt || a.uploadedAt).getTime();
    });

    return NextResponse.json({
      media: mediaItems,
      total: mediaItems.length,
    });
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // Extract filename from URL
    const filename = url.split("/").pop();
    if (!filename) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Determine directory based on file extension
    const isVideo = filename.match(/\.(mp4|webm|mov)$/i);
    const directory = isVideo ? "videos" : "images";
    const filePath = join(process.cwd(), "public", directory, filename);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete the file
    const { unlink } = await import("fs/promises");
    await unlink(filePath);

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Failed to delete media:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
} 