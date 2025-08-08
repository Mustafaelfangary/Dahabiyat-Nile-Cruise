import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch the itinerary
    const itinerary = await prisma.itinerary.findUnique({
      where: { 
        OR: [
          { id: params.id },
          { slug: params.id }
        ]
      }
    });

    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    // Check if you have an existing PDF generation function
    // For now, I'll create a simple HTML to PDF conversion
    // You can replace this with your existing PDF generation logic

    const htmlContent = generateItineraryHTML(itinerary);
    
    // If you have a PDF generation service/function, use it here
    // For example: const pdfBuffer = await generatePDF(htmlContent);
    
    // For now, return the HTML content as a downloadable file
    // You should replace this with actual PDF generation
    const response = new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${itinerary.name || 'itinerary'}.html"`,
      },
    });

    return response;

  } catch (error) {
    console.error('Error generating itinerary download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateItineraryHTML(itinerary: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${itinerary.name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #0080ff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .title {
            color: #0080ff;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .duration {
            font-size: 1.2em;
            color: #666;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            color: #0080ff;
            font-size: 1.5em;
            border-bottom: 1px solid #0080ff;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .highlights, .included, .not-included {
            list-style: none;
            padding: 0;
        }
        .highlights li, .included li, .not-included li {
            padding: 5px 0;
            border-bottom: 1px dotted #ccc;
        }
        .highlights li:before {
            content: "✨ ";
            color: #0080ff;
        }
        .included li:before {
            content: "✅ ";
            color: #28a745;
        }
        .not-included li:before {
            content: "❌ ";
            color: #dc3545;
        }
        .description {
            text-align: justify;
            line-height: 1.8;
        }
        .price {
            font-size: 1.3em;
            color: #0080ff;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${itinerary.name}</h1>
        <p class="duration">${itinerary.durationDays} Days Journey</p>
        ${itinerary.price ? `<p class="price">Starting from $${itinerary.price}</p>` : ''}
    </div>

    ${itinerary.shortDescription ? `
    <div class="section">
        <h2 class="section-title">Overview</h2>
        <p class="description">${itinerary.shortDescription}</p>
    </div>
    ` : ''}

    <div class="section">
        <h2 class="section-title">Description</h2>
        <p class="description">${itinerary.description}</p>
    </div>

    ${itinerary.highlights && itinerary.highlights.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Highlights</h2>
        <ul class="highlights">
            ${itinerary.highlights.map((highlight: string) => `<li>${highlight}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${itinerary.included && itinerary.included.length > 0 ? `
    <div class="section">
        <h2 class="section-title">What's Included</h2>
        <ul class="included">
            ${itinerary.included.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${itinerary.notIncluded && itinerary.notIncluded.length > 0 ? `
    <div class="section">
        <h2 class="section-title">What's Not Included</h2>
        <ul class="not-included">
            ${itinerary.notIncluded.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${itinerary.childrenPolicy ? `
    <div class="section">
        <h2 class="section-title">Children Policy</h2>
        <p class="description">${itinerary.childrenPolicy}</p>
    </div>
    ` : ''}

    ${itinerary.cancellationPolicy ? `
    <div class="section">
        <h2 class="section-title">Cancellation Policy</h2>
        <p class="description">${itinerary.cancellationPolicy}</p>
    </div>
    ` : ''}

    ${itinerary.observations ? `
    <div class="section">
        <h2 class="section-title">Important Notes</h2>
        <p class="description">${itinerary.observations}</p>
    </div>
    ` : ''}

    <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>Cleopatra Dahabiyat Nile Cruise</p>
    </div>
</body>
</html>
  `.trim();
}
