import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Default content for dahabiya cards
    const dahabiyaContent = [
      // Card Labels
      {
        key: 'dahabiyas_card_featured_label',
        title: 'Featured Badge Label',
        content: 'Featured',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 1
      },
      {
        key: 'dahabiyas_card_features_title',
        title: 'Features Section Title',
        content: 'Premium Features',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 2
      },
      {
        key: 'dahabiyas_card_quick_book_text',
        title: 'Quick Book Button Text',
        content: 'Quick Book',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 3
      },
      {
        key: 'dahabiyas_card_full_booking_text',
        title: 'Full Booking Button Text',
        content: 'View Details & Book',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 4
      },
      
      // Price Labels
      {
        key: 'dahabiyas_card_price_suffix',
        title: 'Price Suffix',
        content: '/night per person',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 5
      },
      {
        key: 'dahabiyas_card_price_from',
        title: 'Price From Label',
        content: 'From',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 6
      },
      
      // Specification Labels
      {
        key: 'dahabiyas_card_cabins_label',
        title: 'Cabins Label',
        content: 'cabins',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 7
      },
      {
        key: 'dahabiyas_card_length_label',
        title: 'Length Label',
        content: 'long',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 8
      },
      {
        key: 'dahabiyas_card_built_label',
        title: 'Built Year Label',
        content: 'Built',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 9
      },
      
      // Departure Labels
      {
        key: 'dahabiyas_card_next_departure',
        title: 'Next Departure Label',
        content: 'Next Departure',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 10
      },
      {
        key: 'dahabiyas_card_departure_date',
        title: 'Departure Date Example',
        content: 'Dec 15 • $2,500',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'card',
        order: 11
      },
      
      // List Page Labels (from DahabiyaList)
      {
        key: 'dahabiyas_loading_text',
        title: 'Loading Text',
        content: 'Loading Sacred Vessels...',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'list',
        order: 1
      },
      {
        key: 'dahabiyas_empty_title',
        title: 'Empty State Title',
        content: 'No Vessels Found',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'list',
        order: 2
      },
      {
        key: 'dahabiyas_empty_description_active',
        title: 'Empty Description for Active Only',
        content: 'The fleet is currently preparing for their next journey. Please check back soon for available vessels.',
        contentType: 'TEXTAREA',
        page: 'dahabiyas',
        section: 'list',
        order: 3
      },
      {
        key: 'dahabiyas_empty_description_all',
        title: 'Empty Description for All',
        content: 'No dahabiyas have been blessed and added to our collection yet.',
        contentType: 'TEXTAREA',
        page: 'dahabiyas',
        section: 'list',
        order: 4
      },
      {
        key: 'dahabiyas_fleet_title',
        title: 'Fleet Collection Title',
        content: 'Sacred Fleet Collection',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'list',
        order: 5
      },
      {
        key: 'dahabiyas_fleet_description',
        title: 'Fleet Description',
        content: 'Showing',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'list',
        order: 6
      }
    ];

    let created = 0;
    let updated = 0;

    for (const contentItem of dahabiyaContent) {
      try {
        // Check if the content already exists
        const existing = await prisma.websiteContent.findUnique({
          where: { key: contentItem.key }
        });

        if (existing) {
          // Update existing content
          await prisma.websiteContent.update({
            where: { key: contentItem.key },
            data: {
              title: contentItem.title,
              content: contentItem.content,
              contentType: contentItem.contentType,
              page: contentItem.page,
              section: contentItem.section,
              order: contentItem.order
            }
          });
          updated++;
        } else {
          // Create new content
          await prisma.websiteContent.create({
            data: contentItem
          });
          created++;
        }
      } catch (error) {
        console.error(`Error processing content item ${contentItem.key}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Dahabiya content added successfully',
      summary: { created, updated, total: dahabiyaContent.length }
    });
  } catch (error) {
    console.error('Error adding dahabiya content:', error);
    return NextResponse.json({ error: 'Failed to add dahabiya content' }, { status: 500 });
  }
}
