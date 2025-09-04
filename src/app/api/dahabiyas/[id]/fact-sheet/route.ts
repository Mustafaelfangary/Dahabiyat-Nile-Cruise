import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch the dahabiya by id or slug
    const dahabiya = await prisma.dahabiya.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      }
    });

    if (!dahabiya) {
      return NextResponse.json({ error: 'Dahabiya not found' }, { status: 404 });
    }

    // Generate enhanced fact sheet HTML content
    const htmlContent = generateEnhancedFactSheetHTML(dahabiya);
    
    // Return HTML content as downloadable file with enhanced pharaonic styling
    const response = new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${dahabiya.name || 'dahabiya'}-royal-fact-sheet.html"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

    return response;

  } catch (error) {
    console.error('Error generating fact sheet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateEnhancedFactSheetHTML(dahabiya: {
  id: string;
  name: string | null;
  description?: string | null;
  shortDescription?: string | null;
  capacity?: number | null;
  cabins?: number | null;
  crew?: number | null;
  length?: number | null;
  width?: number | null;
  yearBuilt?: number | null;
  features?: string[];
  amenities?: string[];
  activities?: string[];
  category?: string | null;
  pricePerDay?: number | null;
  mainImage?: string | null;
  specificationsImage?: string | null;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dahabiya.name} - Royal Fact Sheet</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Cormorant Garamond', serif;
            line-height: 1.8;
            color: #2c2c2c;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #1a237e 0%, #3949ab 25%, #5c6bc0 50%, #7986cb 75%, #9fa8da 100%);
            min-height: 100vh;
        }
        
        .royal-header {
            text-align: center;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #ffffff 100%);
            padding: 40px 30px;
            border-radius: 20px;
            margin-bottom: 40px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1);
            border: 3px solid #d4af37;
            position: relative;
            overflow: hidden;
        }
        
        .royal-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.1) 50%, transparent 70%);
            animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .pharaonic-symbol {
            font-size: 4rem;
            color: #d4af37;
            margin-bottom: 15px;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            from { text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(212, 175, 55, 0.4); }
            to { text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3), 0 0 30px rgba(212, 175, 55, 0.8); }
        }
        
        .royal-title {
            font-family: 'Cinzel', serif;
            color: #1a237e;
            font-size: 3.5em;
            font-weight: 700;
            margin-bottom: 15px;
            text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
            letter-spacing: 2px;
            position: relative;
            z-index: 2;
        }
        
        .royal-subtitle {
            font-size: 1.8em;
            color: #d4af37;
            font-weight: 600;
            font-style: italic;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
            position: relative;
            z-index: 2;
        }
        
        .divider {
            width: 200px;
            height: 3px;
            background: linear-gradient(to right, transparent, #d4af37, transparent);
            margin: 20px auto;
            border-radius: 2px;
        }
        
        .royal-section {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #ffffff 100%);
            margin-bottom: 35px;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8);
            border: 2px solid #e8eaf6;
            position: relative;
            overflow: hidden;
        }
        
        .royal-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #d4af37 0%, #f9e79f 50%, #d4af37 100%);
        }
        
        .section-title {
            font-family: 'Cinzel', serif;
            color: #1a237e;
            font-size: 2.2em;
            font-weight: 600;
            margin-bottom: 25px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        
        .section-title::before,
        .section-title::after {
            content: '𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿';
            font-size: 1.5rem;
            color: #d4af37;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .specs-showcase {
            background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            box-shadow: 0 15px 35px rgba(26, 35, 126, 0.4);
            position: relative;
            overflow: hidden;
        }
        
        .specs-showcase::before {
            content: '𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿';
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 2rem;
            color: rgba(212, 175, 55, 0.3);
            z-index: 1;
        }
        
        .specs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 25px;
            position: relative;
            z-index: 2;
        }
        
        .spec-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 12px;
            border: 2px solid rgba(212, 175, 55, 0.6);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .spec-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
        }
        
        .spec-icon {
            font-size: 2.5rem;
            color: #d4af37;
            margin-bottom: 10px;
            display: block;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .spec-label {
            font-weight: 600;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #d4af37;
            margin-bottom: 8px;
        }
        
        .spec-value {
            font-size: 1.4em;
            font-weight: 700;
            color: white;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        }
        
        .specifications-image-section {
            text-align: center;
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #f8f9ff 0%, #e8eaf6 100%);
            border-radius: 15px;
            border: 3px solid #d4af37;
        }
        
        .specifications-image {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            border: 2px solid #d4af37;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            margin-top: 25px;
        }
        
        .feature-item {
            background: linear-gradient(135deg, #f8f9ff 0%, #e8eaf6 50%, #f8f9ff 100%);
            padding: 18px 22px;
            border-radius: 10px;
            border-left: 5px solid #d4af37;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .feature-item:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(26, 35, 126, 0.2);
        }
        
        .feature-item::before {
            content: '𓇳';
            font-size: 1.2rem;
            color: #d4af37;
            font-weight: bold;
        }
        
        .description {
            font-size: 1.2em;
            line-height: 1.8;
            color: #444;
            text-align: justify;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
            border-radius: 10px;
            border: 1px solid #e8eaf6;
        }
        
        .price-showcase {
            background: linear-gradient(135deg, #d4af37 0%, #f9e79f 50%, #d4af37 100%);
            color: #1a237e;
            text-align: center;
            padding: 40px;
            border-radius: 20px;
            margin: 40px 0;
            box-shadow: 0 15px 35px rgba(212, 175, 55, 0.5);
            position: relative;
            overflow: hidden;
        }
        
        .price-showcase::before {
            content: '𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿';
            position: absolute;
            top: 15px;
            left: 15px;
            font-size: 1.5rem;
            opacity: 0.3;
        }
        
        .price-showcase::after {
            content: '𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿';
            position: absolute;
            bottom: 15px;
            right: 15px;
            font-size: 1.5rem;
            opacity: 0.3;
        }
        
        .price-amount {
            font-family: 'Cinzel', serif;
            font-size: 3.5em;
            font-weight: 700;
            text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
            margin-bottom: 10px;
        }
        
        .price-label {
            font-size: 1.4em;
            font-weight: 600;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .royal-footer {
            background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
            color: white;
            text-align: center;
            padding: 40px 30px;
            border-radius: 20px;
            margin-top: 50px;
            box-shadow: 0 15px 35px rgba(26, 35, 126, 0.4);
            position: relative;
            overflow: hidden;
        }
        
        .royal-footer::before {
            content: '𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿';
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 3rem;
            color: rgba(212, 175, 55, 0.2);
            z-index: 1;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
            position: relative;
            z-index: 2;
        }
        
        .contact-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 25px;
            border-radius: 12px;
            border: 2px solid rgba(212, 175, 55, 0.6);
            text-align: center;
        }
        
        .contact-icon {
            font-size: 2rem;
            margin-bottom: 15px;
            display: block;
            color: #d4af37;
        }
        
        .print-hide {
            display: block;
        }
        
        @media print {
            body { background: white; }
            .print-hide { display: none; }
            .royal-section, .specs-showcase, .royal-footer {
                box-shadow: none;
                border: 1px solid #ccc;
            }
        }
    </style>
</head>
<body>
    <div class="royal-header">
        <div class="pharaonic-symbol">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</div>
        <h1 class="royal-title">${dahabiya.name}</h1>
        <div class="divider"></div>
        <p class="royal-subtitle">Royal Dahabiya Fact Sheet</p>
    </div>

    ${dahabiya.shortDescription ? `
    <div class="section">
        <h2 class="section-title">Overview</h2>
        <p class="description">${dahabiya.shortDescription}</p>
    </div>
    ` : ''}

    <div class="royal-section">
        <h2 class="section-title">Sacred Vessel Description</h2>
        <div class="description">${dahabiya.description}</div>
    </div>

    <div class="specs-showcase">
        <h2 class="section-title" style="color: #d4af37; margin-bottom: 30px;">Royal Specifications</h2>
        <div class="specs-grid">
            <div class="spec-card">
                <span class="spec-icon">👑</span>
                <div class="spec-label">Capacity</div>
                <div class="spec-value">${dahabiya.capacity || 'N/A'} Guests</div>
            </div>
            ${dahabiya.cabins ? `
            <div class="spec-card">
                <span class="spec-icon">🏺</span>
                <div class="spec-label">Cabins</div>
                <div class="spec-value">${dahabiya.cabins} Suites</div>
            </div>
            ` : ''}
            ${dahabiya.crew ? `
            <div class="spec-card">
                <span class="spec-icon">⚓</span>
                <div class="spec-label">Crew</div>
                <div class="spec-value">${dahabiya.crew} Members</div>
            </div>
            ` : ''}
            ${dahabiya.length ? `
            <div class="spec-card">
                <span class="spec-icon">📏</span>
                <div class="spec-label">Length</div>
                <div class="spec-value">${dahabiya.length}m</div>
            </div>
            ` : ''}
            ${dahabiya.width ? `
            <div class="spec-card">
                <span class="spec-icon">📐</span>
                <div class="spec-label">Width</div>
                <div class="spec-value">${dahabiya.width}m</div>
            </div>
            ` : ''}
            ${dahabiya.yearBuilt ? `
            <div class="spec-card">
                <span class="spec-icon">🗓️</span>
                <div class="spec-label">Year Built</div>
                <div class="spec-value">${dahabiya.yearBuilt}</div>
            </div>
            ` : ''}
            <div class="spec-card">
                <span class="spec-icon">💎</span>
                <div class="spec-label">Category</div>
                <div class="spec-value">${dahabiya.category || 'Deluxe'}</div>
            </div>
        </div>
    </div>

    ${dahabiya.specificationsImage ? `
    <div class="royal-section">
        <h2 class="section-title">Vessel Specifications & Dimensions</h2>
        <div class="specifications-image-section">
            <img src="${dahabiya.specificationsImage}" alt="${dahabiya.name} Specifications" class="specifications-image" />
        </div>
    </div>
    ` : ''}

    ${dahabiya.features && dahabiya.features.length > 0 ? `
    <div class="royal-section">
        <h2 class="section-title">Royal Features & Amenities</h2>
        <div class="features-grid">
            ${dahabiya.features.map((feature: string) => `<div class="feature-item">${feature}</div>`).join('')}
        </div>
    </div>
    ` : ''}

    ${dahabiya.amenities && dahabiya.amenities.length > 0 ? `
    <div class="royal-section">
        <h2 class="section-title">Onboard Luxuries</h2>
        <div class="features-grid">
            ${dahabiya.amenities.map((amenity: string) => `<div class="feature-item">${amenity}</div>`).join('')}
        </div>
    </div>
    ` : ''}

    ${dahabiya.activities && dahabiya.activities.length > 0 ? `
    <div class="royal-section">
        <h2 class="section-title">Sacred Activities</h2>
        <div class="features-grid">
            ${dahabiya.activities.map((activity: string) => `<div class="feature-item">${activity}</div>`).join('')}
        </div>
    </div>
    ` : ''}

    ${dahabiya.pricePerDay ? `
    <div class="price-showcase">
        <div class="price-amount">$${dahabiya.pricePerDay.toLocaleString()}</div>
        <div class="price-label">Per Royal Day</div>
    </div>
    ` : ''}

    <div class="royal-footer">
        <h3 style="font-family: 'Cinzel', serif; font-size: 2rem; margin-bottom: 30px; color: #d4af37; position: relative; z-index: 2;">Royal Contact Information</h3>
        <div class="contact-grid">
            <div class="contact-card">
                <span class="contact-icon">📧</span>
                <strong style="color: #d4af37; font-size: 1.1em;">Royal Email</strong><br>
                <span style="font-size: 1.1em;">info@cleopatradahabiya.com</span>
            </div>
            <div class="contact-card">
                <span class="contact-icon">📞</span>
                <strong style="color: #d4af37; font-size: 1.1em;">Sacred Hotline</strong><br>
                <span style="font-size: 1.1em;">+20 123 456 7890</span>
            </div>
            <div class="contact-card">
                <span class="contact-icon">🌐</span>
                <strong style="color: #d4af37; font-size: 1.1em;">Royal Portal</strong><br>
                <span style="font-size: 1.1em;">www.dahabiyatnilecruise.com</span>
            </div>
        </div>
        <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid rgba(212, 175, 55, 0.5); position: relative; z-index: 2;">
            <p style="font-size: 1.2em; font-weight: 600; color: #d4af37;">
                <strong>Generated on ${new Date().toLocaleDateString()}</strong><br>
            </p>
            <p style="font-size: 1.4em; font-family: 'Cinzel', serif; font-weight: 700; margin-top: 15px;">
                Cleopatra Dahabiyat Nile Cruise<br>
                <span style="font-size: 0.9em; color: #d4af37;">Sailing the Sacred Nile Since Ancient Times</span>
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
}
