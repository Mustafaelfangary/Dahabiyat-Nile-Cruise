import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the package
    const packageData = await prisma.package.findUnique({
      where: { id: id }
    });

    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // Generate package HTML content
    const htmlContent = generatePackageHTML(packageData);
    
    // Return HTML content as downloadable file
    const response = new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${packageData.name || 'package'}-details.html"`,
      },
    });

    return response;

  } catch (error) {
    console.error('Error generating package download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface PackageData {
  id: string;
  name: string;
  description: string;
  shortDescription?: string | null;
  price?: { toNumber(): number } | null;
  durationDays: number;
  category?: string | null;
  maxGuests?: number | null;
  highlights?: string[] | null;
  included?: string[] | null;
  notIncluded?: string[] | null;
  childrenPolicy?: string | null;
  cancellationPolicy?: string | null;
  observations?: string | null;
}

function generatePackageHTML(packageData: PackageData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${packageData.name} - Package Details</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f5f1e8 0%, #faf8f3 100%);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #0080ff;
            padding-bottom: 20px;
            margin-bottom: 30px;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 128, 255, 0.2);
        }
        .title {
            color: #0080ff;
            font-size: 3em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .subtitle {
            font-size: 1.3em;
            color: #8B4513;
            font-style: italic;
        }
        .duration-price {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
        }
        .duration, .price {
            background: linear-gradient(135deg, #0080ff 0%, #3399ff 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        .section {
            margin-bottom: 30px;
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .section-title {
            color: #0080ff;
            font-size: 1.8em;
            border-bottom: 2px solid #0080ff;
            padding-bottom: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        .section-title::before {
            content: "⚜️";
            margin-right: 10px;
        }
        .highlights-list, .included-list, .not-included-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 10px;
        }
        .highlights-list li, .included-list li, .not-included-list li {
            padding: 10px 15px;
            background: linear-gradient(135deg, #f8f6f0 0%, #faf8f3 100%);
            border-radius: 8px;
            border-left: 3px solid #0080ff;
        }
        .highlights-list li:before {
            content: "✨ ";
            color: #0080ff;
            font-weight: bold;
        }
        .included-list li:before {
            content: "✅ ";
            color: #28a745;
            font-weight: bold;
        }
        .not-included-list li:before {
            content: "❌ ";
            color: #dc3545;
            font-weight: bold;
        }
        .description {
            text-align: justify;
            line-height: 1.8;
            font-size: 1.1em;
            color: #444;
        }
        .category-badge {
            display: inline-block;
            background: linear-gradient(135deg, #0080ff 0%, #3399ff 100%);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }
        .specs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .spec-item {
            background: linear-gradient(135deg, #f8f6f0 0%, #faf8f3 100%);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #0080ff;
            text-align: center;
        }
        .spec-label {
            font-weight: bold;
            color: #8B4513;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .spec-value {
            font-size: 1.5em;
            color: #0080ff;
            margin-top: 5px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #0080ff;
            color: #8B4513;
            background: white;
            padding: 30px;
            border-radius: 10px;
        }
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .contact-item {
            text-align: center;
            padding: 15px;
            background: #f8f6f0;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${packageData.name}</h1>
        <p class="subtitle">Luxury Nile Cruise Package</p>
        ${packageData.category ? `<div class="category-badge">${packageData.category}</div>` : ''}
        <div class="duration-price">
            <div class="duration">${packageData.durationDays} Days Journey</div>
            ${packageData.price ? `<div class="price">$${packageData.price.toNumber().toLocaleString()}</div>` : ''}
        </div>
    </div>

    ${packageData.shortDescription ? `
    <div class="section">
        <h2 class="section-title">Overview</h2>
        <p class="description">${packageData.shortDescription}</p>
    </div>
    ` : ''}

    <div class="section">
        <h2 class="section-title">Package Description</h2>
        <p class="description">${packageData.description}</p>
    </div>

    <div class="section">
        <h2 class="section-title">Package Specifications</h2>
        <div class="specs-grid">
            <div class="spec-item">
                <div class="spec-label">Duration</div>
                <div class="spec-value">${packageData.durationDays} Days</div>
            </div>
            ${packageData.price ? `
            <div class="spec-item">
                <div class="spec-label">Price</div>
                <div class="spec-value">$${packageData.price.toNumber().toLocaleString()}</div>
            </div>
            ` : ''}
            ${packageData.maxGuests ? `
            <div class="spec-item">
                <div class="spec-label">Max Guests</div>
                <div class="spec-value">${packageData.maxGuests}</div>
            </div>
            ` : ''}
            <div class="spec-item">
                <div class="spec-label">Category</div>
                <div class="spec-value">${packageData.category || 'Deluxe'}</div>
            </div>
        </div>
    </div>

    ${packageData.highlights && packageData.highlights.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Package Highlights</h2>
        <ul class="highlights-list">
            ${packageData.highlights.map((highlight: string) => `<li>${highlight}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${packageData.included && packageData.included.length > 0 ? `
    <div class="section">
        <h2 class="section-title">What's Included</h2>
        <ul class="included-list">
            ${packageData.included.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${packageData.notIncluded && packageData.notIncluded.length > 0 ? `
    <div class="section">
        <h2 class="section-title">What's Not Included</h2>
        <ul class="not-included-list">
            ${packageData.notIncluded.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${packageData.childrenPolicy ? `
    <div class="section">
        <h2 class="section-title">Children Policy</h2>
        <p class="description">${packageData.childrenPolicy}</p>
    </div>
    ` : ''}

    ${packageData.cancellationPolicy ? `
    <div class="section">
        <h2 class="section-title">Cancellation Policy</h2>
        <p class="description">${packageData.cancellationPolicy}</p>
    </div>
    ` : ''}

    ${packageData.observations ? `
    <div class="section">
        <h2 class="section-title">Important Notes</h2>
        <p class="description">${packageData.observations}</p>
    </div>
    ` : ''}

    <div class="footer">
        <h3>Contact Information</h3>
        <div class="contact-info">
            <div class="contact-item">
                <strong>📧 Email</strong><br>
                info@dahabiyatnilecruise.com
            </div>
            <div class="contact-item">
                <strong>📞 Phone</strong><br>
                +20 123 456 7890
            </div>
            <div class="contact-item">
                <strong>🌐 Website</strong><br>
                www.dahabiyatnilecruise.com
            </div>
        </div>
        <p style="margin-top: 30px;">
            <strong>Generated on ${new Date().toLocaleDateString()}</strong><br>
            Cleopatra Dahabiyat Nile Cruise
        </p>
    </div>
</body>
</html>
  `.trim();
}
