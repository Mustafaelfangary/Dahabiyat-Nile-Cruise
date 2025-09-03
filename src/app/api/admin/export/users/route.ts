import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const format = searchParams.get('format') || 'excel';

    // Build where clause
    const where: { role?: string } = {};

    if (role) {
      where.role = role;
    }

    // Fetch users with booking statistics
    const users = await prisma.user.findMany({
      where,
      include: {
        bookings: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
            memories: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (format === 'json') {
      return NextResponse.json({ 
        users,
        total: users.length,
        exportedAt: new Date().toISOString()
      });
    }

    // Generate Excel file
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Cleopatra Dahabiyat Admin';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Users', {
      properties: { tabColor: { argb: 'D4AF37' } }
    });

    // Define columns
    worksheet.columns = [
      { header: 'User ID', key: 'id', width: 20 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phoneNumber', width: 20 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Registration Date', key: 'createdAt', width: 20 },
      { header: 'Last Login', key: 'lastLoginAt', width: 20 },
      { header: 'Total Bookings', key: 'totalBookings', width: 15 },
      { header: 'Total Spent', key: 'totalSpent', width: 15 },
      { header: 'Reviews Count', key: 'reviewsCount', width: 15 },
      { header: 'Memories Count', key: 'memoriesCount', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D4AF37' }
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

    // Add data rows
    users.forEach(user => {
      const totalSpent = user.bookings
        .filter(booking => booking.status === 'CONFIRMED' || booking.status === 'COMPLETED')
        .reduce((sum, booking) => sum + Number(booking.totalPrice), 0);

      const row = worksheet.addRow({
        id: user.id,
        name: user.name || 'N/A',
        email: user.email,
        phoneNumber: user.phone || 'N/A',
        role: user.role,
        createdAt: new Date(user.createdAt).toLocaleDateString(),
        lastLoginAt: 'N/A', // Field not available in current schema
        totalBookings: user._count.bookings,
        totalSpent: totalSpent,
        reviewsCount: user._count.reviews,
        memoriesCount: user._count.memories,
        status: user.emailVerified ? 'Verified' : 'Unverified'
      });

      // Style data rows
      row.alignment = { horizontal: 'center', vertical: 'middle' };
      
      // Color code by role
      if (user.role === 'ADMIN') {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6CC' }
        };
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      if (column.header) {
        column.width = Math.max(column.width || 10, column.header.length + 2);
      }
    });

    // Add borders
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    const filename = `users-export-${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Error exporting users:', error);
    return NextResponse.json(
      { error: 'Failed to export users' },
      { status: 500 }
    );
  }
}
