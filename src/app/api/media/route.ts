import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Shapes returned to the client
interface MediaItem {
  id: string;
  url: string;
  type: string; // mimeType (best-effort)
  name: string; // original file name
  filename: string; // stored file name
  size: number;
  createdAt: string; // ISO string
  uploadedAt: string; // ISO string
  source?: "database" | "filesystem" | "images" | "videos";
}

// Recursively scan a directory for media files
async function scanDirectory(dirPath: string, baseUrl: string): Promise<MediaItem[]> {
  const items: MediaItem[] = [];

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const urlPath = `${baseUrl}/${entry.name}`;

      if (entry.isDirectory()) {
        // Skip certain directories
        if (entry.name.includes("_files") || entry.name.includes(".html")) {
          continue;
        }

        // Recursively scan subdirectories
        const subItems = await scanDirectory(fullPath, urlPath);
        items.push(...subItems);
        continue;
      }

      if (!entry.isFile()) continue;

      // Images
      if (/\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff)$/i.test(entry.name)) {
        try {
          const stats = await stat(fullPath);
          items.push({
            id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
            url: urlPath,
            type: "image/jpeg", // best-effort default
            name: entry.name,
            filename: entry.name,
            size: stats.size,
            createdAt: stats.mtime.toISOString(),
            uploadedAt: stats.mtime.toISOString(),
          });
        } catch (e) {
          console.warn(`Could not stat file ${fullPath}:`, e);
        }
        continue;
      }

      // Videos
      if (/\.(mp4|webm|mov|avi|mkv)$/i.test(entry.name)) {
        try {
          const stats = await stat(fullPath);
          items.push({
            id: `vid_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
            url: urlPath,
            type: "video/mp4", // best-effort default
            name: entry.name,
            filename: entry.name,
            size: stats.size,
            createdAt: stats.mtime.toISOString(),
            uploadedAt: stats.mtime.toISOString(),
          });
        } catch (e) {
          console.warn(`Could not stat file ${fullPath}:`, e);
        }
      }
    }
  } catch (error) {
    console.warn(`Could not read directory ${dirPath}:`, error);
  }

  return items;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mediaItems: MediaItem[] = [];

    // 1) Database-backed assets (if table exists)
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      try {
        const dbMediaAssets = await prisma.mediaAsset.findMany({
          orderBy: { createdAt: "desc" },
        });

        for (const asset of dbMediaAssets) {
          mediaItems.push({
            id: `db_${asset.id}`,
            url: asset.url,
            type: asset.mimeType || "image/jpeg",
            name: asset.originalName,
            filename: asset.filename,
            size: asset.size,
            createdAt: asset.createdAt.toISOString(),
            uploadedAt: asset.createdAt.toISOString(),
            source: "database",
          });
        }
      } finally {
        await prisma.$disconnect();
      }
    } catch (dbError) {
      // Table might not exist; ignore
    }

    // 2) Scan public/uploads
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (existsSync(uploadsDir)) {
      try {
        const uploadItems = await scanDirectory(uploadsDir, "/uploads");
        for (const item of uploadItems) {
          const existsInDb = mediaItems.some((dbItem) => dbItem.url === item.url);
          if (!existsInDb) {
            mediaItems.push({ ...item, source: "filesystem" });
          }
        }
      } catch (e) {
        console.error("Error scanning uploads directory:", e);
      }
    }

    // 3) Scan key images directories
    const keyDirectories: Array<{ path: string; url: string }> = [
      { path: join(process.cwd(), "public", "images", "about"), url: "/images/about" },
      { path: join(process.cwd(), "public", "images", "uploads"), url: "/images/uploads" },
      { path: join(process.cwd(), "public", "images"), url: "/images" },
    ];

    for (const dir of keyDirectories) {
      if (!existsSync(dir.path)) continue;
      try {
        const items = await scanDirectory(dir.path, dir.url);
        for (const item of items) {
          const existsInList = mediaItems.some((existing) => existing.url === item.url);
          if (!existsInList) {
            mediaItems.push({ ...item, source: "images" });
          }
        }
      } catch (e) {
        console.error(`Error scanning ${dir.path}:`, e);
      }
    }

    // 4) Scan public/videos
    const videosDir = join(process.cwd(), "public", "videos");
    if (existsSync(videosDir)) {
      try {
        const videoItems = await scanDirectory(videosDir, "/videos");
        for (const item of videoItems) {
          const existsInList = mediaItems.some((existing) => existing.url === item.url);
          if (!existsInList) {
            mediaItems.push({ ...item, source: "videos" });
          }
        }
      } catch (e) {
        console.error("Error scanning videos directory:", e);
      }
    }

    // 5) Sort: DB first, then newest
    mediaItems.sort((a, b) => {
      if (a.source === "database" && b.source !== "database") return -1;
      if (b.source === "database" && a.source !== "database") return 1;
      return new Date(b.createdAt || b.uploadedAt).getTime() - new Date(a.createdAt || a.uploadedAt).getTime();
    });

    return NextResponse.json({ media: mediaItems, total: mediaItems.length });
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

    const filename = url.split("/").pop();
    if (!filename) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const isVideo = /\.(mp4|webm|mov)$/i.test(filename);
    const directory = isVideo ? "videos" : "images";
    const filePath = join(process.cwd(), "public", directory, filename);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const { unlink } = await import("fs/promises");
    await unlink(filePath);

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Failed to delete media:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}

