import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch the dahabiya
    const dahabiya = await prisma.dahabiya.findUnique({
      where: { 
        OR: [
          { id: params.id },
          { slug: params.id }
        ]
      }
    });

    if (!dahabiya) {
      return NextResponse.json({ error: 'Dahabiya not found' }, { status: 404 });
    }

    // Generate fact sheet HTML content
    const htmlContent = generateFactSheetHTML(dahabiya);
    
    // For now, return HTML content as downloadable file
    // You can replace this with actual PDF generation using libraries like puppeteer or jsPDF
    const response = new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${dahabiya.name || 'dahabiya'}-fact-sheet.html"`,
      },
    });

    return response;

  } catch (error) {
    console.error('Error generating fact sheet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateFactSheetHTML(dahabiya: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dahabiya.name} - Fact Sheet</title>
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
        }
        .spec-label {
            font-weight: bold;
            color: #8B4513;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .spec-value {
            font-size: 1.2em;
            color: #333;
            margin-top: 5px;
        }
        .features-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 10px;
        }
        .features-list li {
            padding: 10px 15px;
            background: linear-gradient(135deg, #f8f6f0 0%, #faf8f3 100%);
            border-radius: 8px;
            border-left: 3px solid #0080ff;
        }
        .features-list li:before {
            content: "✨ ";
            color: #0080ff;
            font-weight: bold;
        }
        .description {
            text-align: justify;
            line-height: 1.8;
            font-size: 1.1em;
            color: #444;
        }
        .price-section {
            background: linear-gradient(135deg, #0080ff 0%, #3399ff 100%);
            color: white;
            text-align: center;
            padding: 25px;
            border-radius: 15px;
            margin: 30px 0;
            box-shadow: 0 8px 25px rgba(0, 128, 255, 0.4);
        }
        .price {
            font-size: 2.5em;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .price-label {
            font-size: 1.2em;
            margin-top: 10px;
            opacity: 0.9;
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
        <h1 class="title">${dahabiya.name}</h1>
        <p class="subtitle">Luxury Dahabiya Fact Sheet</p>
    </div>

    ${dahabiya.shortDescription ? `
    <div class="section">
        <h2 class="section-title">Overview</h2>
        <p class="description">${dahabiya.shortDescription}</p>
    </div>
    ` : ''}

    <div class="section">
        <h2 class="section-title">Description</h2>
        <p class="description">${dahabiya.description}</p>
    </div>

    <div class="section">
        <h2 class="section-title">Vessel Specifications</h2>
        <div class="specs-grid">
            <div class="spec-item">
                <div class="spec-label">Capacity</div>
                <div class="spec-value">${dahabiya.capacity || 'N/A'} Guests</div>
            </div>
            ${dahabiya.cabins ? `
            <div class="spec-item">
                <div class="spec-label">Cabins</div>
                <div class="spec-value">${dahabiya.cabins}</div>
            </div>
            ` : ''}
            ${dahabiya.crew ? `
            <div class="spec-item">
                <div class="spec-label">Crew</div>
                <div class="spec-value">${dahabiya.crew} Members</div>
            </div>
            ` : ''}
            ${dahabiya.length ? `
            <div class="spec-item">
                <div class="spec-label">Length</div>
                <div class="spec-value">${dahabiya.length}m</div>
            </div>
            ` : ''}
            ${dahabiya.width ? `
            <div class="spec-item">
                <div class="spec-label">Width</div>
                <div class="spec-value">${dahabiya.width}m</div>
            </div>
            ` : ''}
            ${dahabiya.yearBuilt ? `
            <div class="spec-item">
                <div class="spec-label">Year Built</div>
                <div class="spec-value">${dahabiya.yearBuilt}</div>
            </div>
            ` : ''}
            <div class="spec-item">
                <div class="spec-label">Category</div>
                <div class="spec-value">${dahabiya.category || 'Deluxe'}</div>
            </div>
        </div>
    </div>

    ${dahabiya.features && dahabiya.features.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Features & Amenities</h2>
        <ul class="features-list">
            ${dahabiya.features.map((feature: string) => `<li>${feature}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${dahabiya.amenities && dahabiya.amenities.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Onboard Amenities</h2>
        <ul class="features-list">
            ${dahabiya.amenities.map((amenity: string) => `<li>${amenity}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${dahabiya.activities && dahabiya.activities.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Activities</h2>
        <ul class="features-list">
            ${dahabiya.activities.map((activity: string) => `<li>${activity}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${dahabiya.pricePerDay ? `
    <div class="price-section">
        <div class="price">$${dahabiya.pricePerDay.toLocaleString()}</div>
        <div class="price-label">Per Day</div>
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
