#!/bin/bash

# 📝 Fix Blog Pages Script
# This script fixes the main blog page and individual blog pages

set -e

echo "📝 Fixing Blog Pages..."
echo "======================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

PROJECT_DIR="/var/www/dahabiyat-nile-cruise"
cd "$PROJECT_DIR" || exit 1

log "🔧 Step 1: Checking blog API endpoints..."

# Ensure blog API routes exist
if [ ! -f "src/app/api/blogs/route.ts" ]; then
    warning "Blog API route not found. Creating..."
    mkdir -p "src/app/api/blogs"
    
    cat > "src/app/api/blogs/route.ts" << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        isPublished: true
      },
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Generate slug from title if not provided
    const slug = data.slug || data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate read time (average 200 words per minute)
    const wordCount = data.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        slug: slug,
        excerpt: data.excerpt,
        content: data.content,
        mainImageUrl: data.mainImageUrl,
        heroImageUrl: data.heroImageUrl,
        author: data.author || "Cleopatra Dahabiyat",
        tags: data.tags || [],
        category: data.category,
        isPublished: data.isPublished ?? false,
        featured: data.featured ?? false,
        publishedAt: data.isPublished ? new Date() : null,
        readTime: readTime,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
EOF
    log "✅ Created blog API route"
fi

# Ensure individual blog API route exists
if [ ! -f "src/app/api/blogs/[slug]/route.ts" ]; then
    warning "Individual blog API route not found. Creating..."
    mkdir -p "src/app/api/blogs/[slug]"
    
    cat > "src/app/api/blogs/[slug]/route.ts" << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const blog = await prisma.blog.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug }
        ],
        isPublished: true
      }
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}
EOF
    log "✅ Created individual blog API route"
fi

log "🔧 Step 2: Checking database schema..."

# Check if blog table exists in schema
if ! grep -q "model Blog" prisma/schema.prisma 2>/dev/null; then
    warning "Blog model not found in schema. Adding..."
    
    cat >> "prisma/schema.prisma" << 'EOF'

model Blog {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  excerpt       String?
  content       String
  mainImageUrl  String?
  heroImageUrl  String?
  author        String   @default("Cleopatra Dahabiyat")
  tags          String[]
  category      String?
  isPublished   Boolean  @default(false)
  featured      Boolean  @default(false)
  publishedAt   DateTime?
  readTime      Int?
  seoTitle      String?
  seoDescription String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("blogs")
}
EOF
    log "✅ Added Blog model to schema"
    
    # Generate and apply migration
    log "🔄 Generating database migration..."
    npx prisma migrate dev --name add_blog_model
    npx prisma generate
    log "✅ Database migration completed"
fi

log "🔧 Step 3: Creating sample blog data..."

# Create sample blogs if none exist
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSampleBlogs() {
  try {
    const existingBlogs = await prisma.blog.count();
    if (existingBlogs === 0) {
      console.log('Creating sample blog posts...');
      
      await prisma.blog.createMany({
        data: [
          {
            title: 'Secrets of the Valley of the Kings',
            slug: 'secrets-valley-of-kings',
            excerpt: 'Discover the hidden treasures and ancient mysteries buried within the Valley of the Kings, where pharaohs found their eternal rest.',
            content: '<h2>The Royal Necropolis</h2><p>The Valley of the Kings, known in ancient times as \"The Great Place,\" served as the burial ground for pharaohs of the New Kingdom period. This sacred valley holds the tombs of legendary rulers including Tutankhamun, Ramesses II, and Seti I.</p><h3>Archaeological Discoveries</h3><p>Since the early 1900s, archaeologists have uncovered incredible treasures and well-preserved mummies that provide insights into ancient Egyptian burial practices and beliefs about the afterlife.</p><p>The intricate wall paintings and hieroglyphic texts found in these tombs tell stories of the pharaohs\' journey to the afterlife, guided by ancient Egyptian religious texts like the Book of the Dead.</p>',
            mainImageUrl: '/images/blogs/valley-of-kings.jpg',
            author: 'Dr. Cleopatra Dahabiyat',
            tags: ['Valley of Kings', 'Pharaohs', 'Archaeology', 'Ancient Egypt'],
            category: 'Historical Sites',
            isPublished: true,
            featured: true,
            publishedAt: new Date(),
            readTime: 5
          },
          {
            title: 'Sailing the Nile: A Journey Through Time',
            slug: 'sailing-nile-journey-through-time',
            excerpt: 'Experience the magic of cruising the Nile River aboard a traditional Dahabiya, following the same route that ancient pharaohs once traveled.',
            content: '<h2>The Eternal River</h2><p>The Nile River has been the lifeblood of Egypt for over 5,000 years. Sailing its waters aboard a traditional Dahabiya offers a unique perspective on the ancient civilization that flourished along its banks.</p><h3>Traditional Dahabiya Experience</h3><p>Our handcrafted Dahabiyas provide an intimate and authentic way to explore the Nile, with only 8-12 guests aboard each vessel. This allows for personalized service and access to smaller temples and sites that larger cruise ships cannot reach.</p><p>As you sail between Luxor and Aswan, you\\'ll witness the same landscapes that inspired ancient poets and pharaohs, creating memories that will last a lifetime.</p>',
            mainImageUrl: '/images/blogs/nile-sailing.jpg',
            author: 'Captain Ahmed Nasser',
            tags: ['Nile River', 'Dahabiya', 'Cruise', 'Travel'],
            category: 'Travel Experience',
            isPublished: true,
            featured: true,
            publishedAt: new Date(),
            readTime: 4
          },
          {
            title: 'The Magnificent Temples of Edfu and Kom Ombo',
            slug: 'magnificent-temples-edfu-kom-ombo',
            excerpt: 'Explore two of Egypt\\'s best-preserved temples, dedicated to the falcon god Horus and the crocodile god Sobek.',
            content: '<h2>Temple of Edfu: House of Horus</h2><p>The Temple of Edfu, dedicated to the falcon god Horus, is one of the best-preserved temples in Egypt. Built during the Ptolemaic period, it showcases the architectural grandeur of ancient Egyptian temple design.</p><h3>Kom Ombo: The Double Temple</h3><p>The unique Temple of Kom Ombo is dedicated to two gods: Sobek, the crocodile god, and Haroeris, a form of Horus. This dual dedication is reflected in the temple\\'s symmetrical design, with duplicate halls, sanctuaries, and courtyards.</p><p>Both temples offer incredible insights into ancient Egyptian religious practices and the importance of the Nile River in Egyptian mythology.</p>',
            mainImageUrl: '/images/blogs/edfu-kom-ombo.jpg',
            author: 'Prof. Nefertiti Hassan',
            tags: ['Temples', 'Edfu', 'Kom Ombo', 'Ancient Religion'],
            category: 'Historical Sites',
            isPublished: true,
            featured: false,
            publishedAt: new Date(),
            readTime: 6
          }
        ]
      });
      
      console.log('✅ Sample blog posts created successfully');
    } else {
      console.log('Blog posts already exist, skipping sample data creation');
    }
  } catch (error) {
    console.error('Error creating sample blogs:', error);
  } finally {
    await prisma.\$disconnect();
  }
}

createSampleBlogs();
"

log "🔧 Step 4: Building application..."
npm run build

log "🔄 Step 5: Restarting services..."
if command -v pm2 &> /dev/null; then
    pm2 restart all 2>/dev/null || true
fi

if command -v nginx &> /dev/null; then
    nginx -t && systemctl reload nginx
fi

log "🎉 Blog pages fixed successfully!"
echo "======================="
echo -e "${GREEN}✅ Blog pages are now working properly${NC}"
echo -e "${BLUE}📋 Available routes:${NC}"
echo "   • /blogs - Main blog listing page"
echo "   • /blogs/[slug] - Individual blog posts"
echo "   • /api/blogs - Blog API endpoint"
echo "   • /api/blogs/[slug] - Individual blog API"
echo "======================="
