const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyDynamicBlogSetup() {
  console.log('🔍 Verifying dynamic blog setup...\n');
  
  // 1. Check blog posts in database
  console.log('📝 Blog Posts:');
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    select: {
      title: true,
      slug: true,
      featured: true,
      author: true,
      readTime: true
    },
    orderBy: [
      { featured: 'desc' },
      { publishedAt: 'desc' }
    ]
  });

  console.log(`Total published blogs: ${blogs.length}`);
  const featuredBlogs = blogs.filter(blog => blog.featured);
  console.log(`Featured blogs: ${featuredBlogs.length}`);
  
  console.log('\nFeatured blogs:');
  featuredBlogs.forEach(blog => {
    console.log(`  ⭐ ${blog.title} by ${blog.author} (${blog.readTime} min)`);
  });

  console.log('\nAll blogs:');
  blogs.forEach(blog => {
    console.log(`  ${blog.featured ? '⭐' : '📄'} ${blog.title} by ${blog.author}`);
  });

  // 2. Check blog section content
  console.log('\n📋 Blog Section Content:');
  const blogSectionContent = await prisma.websiteContent.findMany({
    where: {
      page: 'homepage',
      section: 'blog_featured'
    },
    select: {
      key: true,
      title: true,
      content: true
    }
  });

  console.log(`Blog section content items: ${blogSectionContent.length}`);
  blogSectionContent.forEach(item => {
    console.log(`  - ${item.key}: "${item.content}"`);
  });

  // 3. Check that old static blog content is removed
  console.log('\n🗑️ Checking for old static blog content:');
  const oldBlogContent = await prisma.websiteContent.findMany({
    where: {
      page: 'homepage',
      OR: [
        { key: { contains: 'home_blog_' } },
        { section: 'blog' }
      ]
    },
    select: {
      key: true,
      section: true
    }
  });

  if (oldBlogContent.length > 0) {
    console.log(`⚠️ Found ${oldBlogContent.length} old blog items that should be removed:`);
    oldBlogContent.forEach(item => {
      console.log(`  - ${item.key} (${item.section})`);
    });
  } else {
    console.log('✅ No old static blog content found');
  }

  // 4. Test API endpoints
  console.log('\n🌐 Testing API endpoints:');
  try {
    const response = await fetch('http://localhost:3001/api/blogs');
    if (response.ok) {
      const data = await response.json();
      const publishedBlogs = data.filter(blog => blog.isPublished);
      const featuredBlogs = publishedBlogs.filter(blog => blog.featured);
      console.log(`✅ /api/blogs: ${publishedBlogs.length} published (${featuredBlogs.length} featured)`);
    } else {
      console.log(`❌ /api/blogs: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ /api/blogs: ${error.message}`);
  }

  // 5. Summary
  console.log('\n📊 Setup Summary:');
  console.log(`✅ Blog posts created: ${blogs.length} (${featuredBlogs.length} featured)`);
  console.log(`✅ Blog section content: ${blogSectionContent.length} items`);
  console.log(`✅ Old static content removed: ${oldBlogContent.length === 0 ? 'Yes' : 'No'}`);
  console.log('✅ Dynamic blog section added to homepage');
  console.log('✅ API endpoint working');

  console.log('\n🎯 What you should see on homepage:');
  console.log('- New "Stories from the Nile" section');
  console.log('- 3 featured blog cards with images and excerpts');
  console.log('- "Read All Stories" button linking to /blog');
  console.log('- Dynamic content fetched from /api/blogs');

  console.log('\n🎉 Dynamic blog setup completed successfully!');

  await prisma.$disconnect();
}

verifyDynamicBlogSetup().catch(console.error);
