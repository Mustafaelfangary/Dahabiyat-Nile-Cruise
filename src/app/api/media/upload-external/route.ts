import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({
        error: "Unauthorized access. Admin or Manager role required."
      }, { status: 401 });
    }

    const contentType = request.headers.get('content-type');
    let file: File;
    let originalUrl: string | null = null;

    if (contentType?.includes('application/json')) {
      // Handle URL-based upload
      const body = await request.json();
      const { url } = body;

      if (!url) {
        return NextResponse.json({
          error: "No URL provided"
        }, { status: 400 });
      }

      originalUrl = url;

      // Validate URL
      try {
        new URL(url);
      } catch {
        return NextResponse.json({
          error: "Invalid URL format"
        }, { status: 400 });
      }

      // Fetch the file from the external URL
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        return NextResponse.json({
          error: `Failed to fetch file from URL: ${response.status} ${response.statusText}`
        }, { status: 400 });
      }

      const blob = await response.blob();
      const filename = url.split('/').pop()?.split('?')[0] || 'external-file';

      // Create a File object from the blob
      file = new File([blob], filename, { type: blob.type });
    } else {
      // Handle FormData upload (existing functionality)
      const formData = await request.formData();
      file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json({
          error: "No file provided"
        }, { status: 400 });
      }
    }

    // Enhanced file validation for external sources
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Videos
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi',
      // Documents
      'application/pdf', 'text/plain',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ];

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
      'mp4', 'webm', 'mov', 'avi',
      'pdf', 'txt',
      'mp3', 'wav', 'ogg'
    ];

    // Check both MIME type and file extension for better compatibility
    const isValidType = allowedTypes.includes(file.type);
    const isValidExtension = validExtensions.includes(fileExtension || '');

    if (!isValidType && !isValidExtension) {
      return NextResponse.json({
        error: `Invalid file type: ${file.type}`,
        details: {
          fileName: file.name,
          fileType: file.type,
          fileExtension: fileExtension,
          allowedTypes: allowedTypes,
          allowedExtensions: validExtensions
        }
      }, { status: 400 });
    }

    // File size validation (100MB max for external uploads)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 100MB.`
      }, { status: 400 });
    }

    // Determine upload directory based on file type
    let uploadDir = 'uploads';
    if (file.type.startsWith('image/')) {
      uploadDir = 'images';
    } else if (file.type.startsWith('video/')) {
      uploadDir = 'videos';
    } else if (file.type.startsWith('audio/')) {
      uploadDir = 'audio';
    } else if (file.type === 'application/pdf') {
      uploadDir = 'documents';
    }

    // Create upload directory if it doesn't exist
    const uploadPath = join(process.cwd(), 'public', uploadDir);
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(uploadPath, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const fileUrl = `/${uploadDir}/${filename}`;

    // Log successful upload
    console.log('✅ External file uploaded successfully:', {
      originalName: file.name,
      savedAs: filename,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type,
      url: fileUrl,
      sourceUrl: originalUrl
    });

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadDir: uploadDir,
      sourceUrl: originalUrl
    });

  } catch (error) {
    console.error('❌ External file upload error:', error);
    
    return NextResponse.json({
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
