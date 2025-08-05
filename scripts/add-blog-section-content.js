const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addBlogSectionContent() {
  console.log('📝 Adding blog section content to homepage...\n');
  
  const blogSectionContent = [
    {
      key: 'blog_section_title',
      title: 'Blog Section Title',
      content: 'Stories from the Nile',
      contentType: 'TEXT',
      page: 'homepage',
      section: 'blog_featured',
      order: 1
    },
    {
      key: 'blog_section_subtitle',
      title: 'Blog Section Subtitle',
      content: 'Discover the magic of Egypt through the eyes of our travelers and guides',
      contentType: 'TEXT',
      page: 'homepage',
      section: 'blog_featured',
      order: 2
    },
    {
      key: 'blog_view_all_text',
      title: 'Blog View All Text',
      content: 'Read All Stories',
      contentType: 'TEXT',
      page: 'homepage',
      section: 'blog_featured',
      order: 3
    }
  ];

  let created = 0;
  let updated = 0;

  for (const item of blogSectionContent) {
    try {
      const result = await prisma.websiteContent.upsert({
        where: { key: item.key },
        update: {
          title: item.title,
          content: item.content,
          contentType: item.contentType,
          page: item.page,
          section: item.section,
          order: item.order,
          isActive: true
        },
        create: {
          key: item.key,
          title: item.title,
          content: item.content,
          contentType: item.contentType,
          page: item.page,
          section: item.section,
          order: item.order,
          isActive: true
        }
      });

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++;
        console.log(`✅ Created: ${item.key}`);
      } else {
        updated++;
        console.log(`🔄 Updated: ${item.key}`);
      }
    } catch (error) {
      console.error(`❌ Failed to process ${item.key}:`, error.message);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created} items`);
  console.log(`   Updated: ${updated} items`);

  console.log('\n✅ Blog section content added to homepage!');
  console.log('The homepage will now show featured blog posts dynamically.');

  await prisma.$disconnect();
}

addBlogSectionContent().catch(console.error);
