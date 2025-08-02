import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';
import sharp from 'sharp';
import { prisma } from '@/lib/prisma';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_SIZE = 150 * 1024 * 1024; // 150MB

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const key = formData.get("key") as string;
    const settingKey = formData.get("settingKey") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type and size
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

    // Enhanced file type validation for external sources
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const validVideoExtensions = ['mp4', 'webm', 'mov', 'avi'];

    const isValidByExtension = isImage
      ? validImageExtensions.includes(fileExtension || '')
      : validVideoExtensions.includes(fileExtension || '');

    if (!allowedTypes.includes(file.type) && !isValidByExtension) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed: ${isImage ? 'JPEG, PNG, WebP, GIF, SVG' : 'MP4, WebM, MOV, AVI'}`,
          details: {
            receivedType: file.type,
            fileName: file.name,
            fileExtension: fileExtension
          }
        },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size must be less than ${isImage ? '20MB' : '150MB'}` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename (using fileExtension from line 39)
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    // Determine the upload directory based on file type
    const uploadDir = isVideo ? "videos" : "images";
    const uploadPath = join(process.cwd(), "public", uploadDir);

    let finalBuffer = buffer;
    let finalExtension = fileExtension;

    // Optimize image if it's an image file
    if (isImage) {
      try {
        // Convert to WebP for better compression
        finalExtension = "webp";
        finalBuffer = await sharp(buffer)
          .webp({ quality: 80 }) // Adjust quality as needed
          .toBuffer();
      } catch (error) {
        console.error("Error optimizing image:", error);
        // If optimization fails, use the original file
        finalBuffer = buffer;
        finalExtension = fileExtension;
      }
    }

    // Ensure upload directory exists
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    // Save the file
    const finalFilename = `${uuidv4()}.${finalExtension}`;
    const filePath = join(uploadPath, finalFilename);
    await writeFile(filePath, finalBuffer);

    // Return the public URL
    const publicUrl = `/${uploadDir}/${finalFilename}`;

    // Create MediaAsset record in database
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        filename: finalFilename,
        originalName: file.name,
        url: publicUrl,
        type: isImage ? "IMAGE" : "VIDEO",
        size: finalBuffer.length,
        mimeType: file.type,
      },
    });

    // If a settingKey is provided, update the setting in the database
    if (settingKey) {
      await prisma.setting.upsert({
        where: { key: settingKey },
        update: { value: publicUrl },
        create: { key: settingKey, value: publicUrl, group: 'homepage' }, // Default group, adjust as needed
      });
    }

    console.log('✅ File uploaded successfully:', {
      originalName: file.name,
      savedAs: finalFilename,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type,
      url: publicUrl,
      optimized: isImage ? 'Yes (WebP)' : 'No'
    });

    return NextResponse.json({
      url: publicUrl,
      mediaAsset: mediaAsset,
      success: true,
      filename: finalFilename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      optimized: isImage
    });
  } catch (error) {
    console.error("❌ Upload error:", error);

    return NextResponse.json({
      error: "Failed to upload file",
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      success: false
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const url = searchParams.get('url');

    if (!filename && !url) {
      return NextResponse.json({ message: 'No filename or URL provided' }, { status: 400 });
    }

    // Find and delete MediaAsset record
    if (url) {
      const mediaAsset = await prisma.mediaAsset.findFirst({
        where: { url: url }
      });

      if (mediaAsset) {
        // Delete file from filesystem
        const filepath = join(process.cwd(), 'public', mediaAsset.url.substring(1)); // Remove leading slash
        if (existsSync(filepath)) {
          await unlink(filepath);
        }

        // Delete database record
        await prisma.mediaAsset.delete({
          where: { id: mediaAsset.id }
        });

        return NextResponse.json({ message: 'Media deleted successfully' });
      }
    }

    // Fallback to filename-based deletion (legacy support)
    if (filename) {
      const filepath = join(process.cwd(), 'public', 'uploads', filename);
      if (existsSync(filepath)) {
        await unlink(filepath);
      }

      // Try to find and delete MediaAsset record by filename
      const mediaAsset = await prisma.mediaAsset.findFirst({
        where: { filename: filename }
      });

      if (mediaAsset) {
        await prisma.mediaAsset.delete({
          where: { id: mediaAsset.id }
        });
      }
    }

    return NextResponse.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ message: 'Error deleting file' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    if (!filename) {
      return NextResponse.json({ message: 'No filename provided' }, { status: 400 });
    }
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }
    // Validate file type and size as in POST
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isImage && !isVideo) {
      return NextResponse.json({ message: 'Only image and video files are allowed' }, { status: 400 });
    }
    const maxSize = isVideo ? 150 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ message: `File size must be less than ${isVideo ? '150MB' : '20MB'}` }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes).buffer);
    const filepath = join(process.cwd(), 'public', 'uploads', filename);
    if (!existsSync(filepath)) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
    await writeFile(filepath, buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error replacing file:', error);
    return NextResponse.json({ message: 'Error replacing file' }, { status: 500 });
  }
} 