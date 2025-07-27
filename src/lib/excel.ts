import ExcelJS from 'exceljs';

interface Booking {
  id: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  totalPrice: number;
  status: string;
  specialRequests?: string | null;
  dahabiya: {
    name: string;
  };
  user: {
    name: string | null;
    email: string | null;
    phone?: string | null;
  } | null;
}

export const exportBookingsToExcel = async (bookings: Booking[]) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Cleopatra Cruises';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Bookings', {
    properties: { tabColor: { argb: '4F81BD' } }
  });

  // Set column widths and headers as per screenshot
  worksheet.columns = [
    { header: 'Booking ID', key: 'id', width: 15 },
    { header: 'Dahabiya', key: 'dahabiya', width: 20 },
    { header: 'Customer Name', key: 'customerName', width: 20 },
    { header: 'phone Number', key: 'phoneNumber', width: 18 },
    { header: 'Customer Email', key: 'customerEmail', width: 25 },
    { header: 'Start Date', key: 'startDate', width: 14 },
    { header: 'End Date', key: 'endDate', width: 14 },
    { header: 'Number of Guests', key: 'guests', width: 16 },
    { header: 'Total Price', key: 'totalPrice', width: 14 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Special Requests', key: 'specialRequests', width: 22 },
  ];

  // Add title row
  const titleRow = worksheet.addRow(['Dahabiyat Bookings']);
  titleRow.font = { size: 16, bold: true };
  titleRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  titleRow.height = 34;
  worksheet.mergeCells(1, 1, 1, 11); // Merge A1:K1
  titleRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'B7E1ED' } // Light blue
  };

  // Add empty row for spacing
  worksheet.addRow([]);

  // Add header row
  const headerRow = worksheet.addRow([
    'Booking ID',
    'Dahabiya',
    'Customer Name',
    'phone Number',
    'Customer Email',
    'Start Date',
    'End Date',
    'Number of Guests',
    'Total Price',
    'Status',
    'Special Requests',
  ]);
  headerRow.height = 34;

  // Header styles by column index (1-based)
  const headerStyles = [
    { fill: 'FFFF00', font: { color: '000000' } }, // Booking ID (yellow)
    { fill: 'FFFF00', font: { color: '000000' } }, // Dahabiya (yellow)
    { fill: 'FFFF00', font: { color: '000000' } }, // Customer Name (yellow)
    { fill: 'FFFF00', font: { color: '000000' } }, // phone Number (yellow)
    { fill: 'FFFF00', font: { color: '000000' } }, // Customer Email (yellow)
    { fill: '00B050', font: { color: 'FFFFFF' } }, // Start Date (green)
    { fill: 'FF0000', font: { color: 'FFFFFF' } }, // End Date (red)
    { fill: 'B7B7B7', font: { color: '000000' } }, // Number of Guests (gray)
    { fill: 'B7B7B7', font: { color: '000000' } }, // Total Price (gray)
    { fill: '000000', font: { color: 'FFFFFF' } }, // Status (black)
    { fill: 'FFFF00', font: { color: '000000' } }, // Special Requests (yellow)
  ];

  headerRow.eachCell((cell, colNumber) => {
    const style = headerStyles[colNumber - 1];
    cell.font = { bold: true, size: 14, color: { argb: style.font.color } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: style.fill }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Add data rows
  bookings.forEach(booking => {
    const row = worksheet.addRow({
      id: booking.id,
      dahabiya: booking.dahabiya.name,
      customerName: booking.user?.name || 'N/A',
      phoneNumber: booking.user?.phone || 'N/A',
      customerEmail: booking.user?.email || 'N/A',
      startDate: new Date(booking.startDate).toLocaleDateString(),
      endDate: new Date(booking.endDate).toLocaleDateString(),
      guests: booking.guests,
      totalPrice: Number(booking.totalPrice),
      status: booking.status,
      specialRequests: booking.specialRequests || 'N/A',
    });
    row.height = 34;
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    // Format Total Price as currency with $
    row.getCell(9).numFmt = '"$"#,##0.00';
  });

  // Generate and return the buffer for server-side use
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}; 