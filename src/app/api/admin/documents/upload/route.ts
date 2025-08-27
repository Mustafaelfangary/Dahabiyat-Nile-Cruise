import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const dahabiyaId = formData.get('dahabiyaId') as string;
    const itineraryId = formData.get('itineraryId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Create unique filename
    const uniqueId = uuidv4();
    const extension = file.name.split('.').pop();
    const filename = `${type.toLowerCase()}-${uniqueId}.${extension}`;

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'documents');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the URL
    const url = `/uploads/documents/${filename}`;

    // Save to database
    try {
      await prisma.pDFDocument.create({
        data: {
          name: file.name,
          type: type as 'FACTSHEET' | 'ITINERARY' | 'BROCHURE',
          url,
          size: file.size,
          dahabiyaId: dahabiyaId || null,
          itineraryId: itineraryId || null,
        },
      });
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      url,
      filename,
      originalName: file.name,
      size: file.size,
      type,
    });

  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
