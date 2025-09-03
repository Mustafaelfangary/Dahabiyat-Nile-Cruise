import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET /api/admin/pdf-documents - Get all PDF documents
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documents = await prisma.pDFDocument.findMany({
      orderBy: { uploadedAt: 'desc' },
      include: {
        dahabiya: {
          select: { id: true, name: true }
        },
        itinerary: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching PDF documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/pdf-documents - Upload new PDF document
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const dahabiyaId = formData.get('dahabiyaId') as string;
    const itineraryId = formData.get('itineraryId') as string;

    if (!file || !name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'pdfs');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${timestamp}-${sanitizedName}.pdf`;
    const filepath = path.join(uploadDir, filename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save document info to database
    const document = await prisma.pDFDocument.create({
      data: {
        name,
        type: type as 'BROCHURE' | 'ITINERARY' | 'FACT_SHEET' | 'MENU' | 'OTHER',
        category: category || null,
        url: `/pdfs/${filename}`,
        size: file.size,
        dahabiyaId: dahabiyaId || null,
        itineraryId: itineraryId || null,
      },
      include: {
        dahabiya: {
          select: { id: true, name: true }
        },
        itinerary: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error uploading PDF document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
