import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🧹 Starting content cleanup and deduplication...');

    // Step 1: Remove duplicate entries from WebsiteContent
    console.log('📋 Analyzing WebsiteContent duplicates...');
    
    const websiteContentDuplicates = await prisma.websiteContent.groupBy({
      by: ['key'],
      having: {
        key: {
          _count: {
            gt: 1
          }
        }
      },
      _count: {
        key: true
      }
    });

    console.log(`Found ${websiteContentDuplicates.length} duplicate keys in WebsiteContent`);

    let duplicatesRemoved = 0;

    // Remove duplicates, keeping the most recent one
    for (const duplicate of websiteContentDuplicates) {
      const records = await prisma.websiteContent.findMany({
        where: { key: duplicate.key },
        orderBy: { updatedAt: 'desc' }
      });

      // Keep the first (most recent) and delete the rest
      const toDelete = records.slice(1);
      for (const record of toDelete) {
        await prisma.websiteContent.delete({
          where: { id: record.id }
        });
        console.log(`🗑️  Deleted duplicate WebsiteContent: ${record.key} (${record.id})`);
        duplicatesRemoved++;
      }
    }

    // Step 2: Remove unused/orphaned content fields
    console.log('🔍 Removing unused content fields...');
    
    const unusedFields = [
      'old_hero_title',
      'old_hero_subtitle', 
      'deprecated_section',
      'unused_media',
      'legacy_content',
      'temp_field',
      'test_content',
      'duplicate_',
      'copy_of_',
      'backup_'
    ];

    let unusedRemoved = 0;

    for (const field of unusedFields) {
      const deleted = await prisma.websiteContent.deleteMany({
        where: {
          key: {
            contains: field
          }
        }
      });
      unusedRemoved += deleted.count;
      if (deleted.count > 0) {
        console.log(`🗑️  Removed ${deleted.count} unused fields containing: ${field}`);
      }
    }

    // Step 3: Remove duplicate entries from PageContent
    console.log('📋 Analyzing PageContent duplicates...');
    
    const pageContentDuplicates = await prisma.pageContent.groupBy({
      by: ['key'],
      having: {
        key: {
          _count: {
            gt: 1
          }
        }
      },
      _count: {
        key: true
      }
    });

    console.log(`Found ${pageContentDuplicates.length} duplicate keys in PageContent`);

    // Remove duplicates from PageContent, keeping the most recent one
    for (const duplicate of pageContentDuplicates) {
      const records = await prisma.pageContent.findMany({
        where: { key: duplicate.key },
        orderBy: { updatedAt: 'desc' }
      });

      // Keep the first (most recent) and delete the rest
      const toDelete = records.slice(1);
      for (const record of toDelete) {
        await prisma.pageContent.delete({
          where: { id: record.id }
        });
        console.log(`🗑️  Deleted duplicate PageContent: ${record.key} (${record.id})`);
        duplicatesRemoved++;
      }
    }

    // Step 4: Standardize content structure
    console.log('📝 Standardizing content structure...');
    
    const standardFields = {
      // Hero Section
      'hero_video_title': {
        title: 'Hero Video Title',
        page: 'homepage',
        section: 'hero',
        contentType: 'TEXT',
        order: 1
      },
      'hero_video_subtitle': {
        title: 'Hero Video Subtitle', 
        page: 'homepage',
        section: 'hero',
        contentType: 'TEXTAREA',
        order: 2
      },
      'hero_video_cta_text': {
        title: 'Hero CTA Button Text',
        page: 'homepage', 
        section: 'hero',
        contentType: 'TEXT',
        order: 3
      },
      // Site Branding
      'site_name': {
        title: 'Site Name',
        page: 'global_media',
        section: 'branding',
        contentType: 'TEXT',
        order: 1
      },
      'site_tagline': {
        title: 'Site Tagline',
        page: 'global_media', 
        section: 'branding',
        contentType: 'TEXT',
        order: 2
      }
    };

    for (const [key, config] of Object.entries(standardFields)) {
      await prisma.websiteContent.updateMany({
        where: { key },
        data: {
          title: config.title,
          page: config.page,
          section: config.section,
          contentType: config.contentType as any,
          order: config.order,
          isActive: true
        }
      });
    }

    // Step 5: Clean up Settings table duplicates
    console.log('🔧 Cleaning up Settings duplicates...');
    
    const settingsDuplicates = await prisma.setting.groupBy({
      by: ['key'],
      having: {
        key: {
          _count: {
            gt: 1
          }
        }
      },
      _count: {
        key: true
      }
    });

    console.log(`Found ${settingsDuplicates.length} duplicate keys in Settings`);

    for (const duplicate of settingsDuplicates) {
      const records = await prisma.setting.findMany({
        where: { key: duplicate.key },
        orderBy: { updatedAt: 'desc' }
      });

      // Keep the first (most recent) and delete the rest
      const toDelete = records.slice(1);
      for (const record of toDelete) {
        await prisma.setting.delete({
          where: { id: record.id }
        });
        console.log(`🗑️  Deleted duplicate Setting: ${record.key} (${record.id})`);
        duplicatesRemoved++;
      }
    }

    console.log('✅ Content cleanup completed successfully!');

    // Generate summary report
    const websiteContentCount = await prisma.websiteContent.count();
    const pageContentCount = await prisma.pageContent.count();
    const settingsCount = await prisma.setting.count();

    const summary = {
      duplicatesRemoved,
      unusedRemoved,
      finalCounts: {
        websiteContent: websiteContentCount,
        pageContent: pageContentCount,
        settings: settingsCount
      }
    };

    console.log('\n📊 CLEANUP SUMMARY:', summary);

    return NextResponse.json({
      success: true,
      message: 'Content cleanup completed successfully',
      summary
    });

  } catch (error) {
    console.error('❌ Error during content cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
