const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleBlogPosts() {
  console.log('📝 Creating sample blog posts...\n');
  
  const sampleBlogs = [
    {
      title: 'The Magic of Sailing the Nile at Sunset',
      slug: 'magic-sailing-nile-sunset',
      excerpt: 'Experience the breathtaking beauty of the Nile River as the sun sets over ancient temples and timeless landscapes.',
      content: `There's something truly magical about watching the sun set over the Nile River from the deck of a traditional Dahabiya. As the golden light reflects off the water and illuminates the ancient temples along the banks, you can't help but feel connected to thousands of years of history.

The gentle breeze fills the white sails as we glide silently through the water, passing by scenes that have remained unchanged for millennia. Fishermen cast their nets from small feluccas, children wave from the riverbank, and the call to prayer echoes across the water from nearby villages.

This is what makes a Dahabiya cruise so special - it's not just about visiting the monuments, it's about experiencing the timeless rhythm of life along the Nile.`,
      mainImageUrl: '/images/blogs/nile-sunset.jpg',
      author: 'Captain Ahmed Hassan',
      readTime: 5,
      featured: true,
      isPublished: true,
      publishedAt: new Date('2024-12-01'),
      tags: ['Nile', 'Sunset', 'Dahabiya', 'Experience']
    },
    {
      title: 'Ancient Temples: A Journey Through Time',
      slug: 'ancient-temples-journey-through-time',
      excerpt: 'Discover the incredible temples of ancient Egypt and learn about the pharaohs who built these magnificent monuments.',
      content: `The temples of ancient Egypt are more than just stone monuments - they are gateways to understanding one of the world's greatest civilizations. Each temple tells a story of the pharaohs who built them, the gods they worshipped, and the people who lived in their shadows.

From the massive columns of Karnak to the intimate beauty of Philae, every temple offers a unique glimpse into ancient Egyptian life. The hieroglyphs carved into the walls are not just decorations - they are historical records, religious texts, and artistic masterpieces all rolled into one.

When you visit these temples from a Dahabiya, you have the luxury of time. Unlike the rushed tours from large cruise ships, you can sit quietly in the shade of ancient columns and truly absorb the magnitude of what you're seeing.`,
      mainImageUrl: '/images/blogs/ancient-temples.jpg',
      author: 'Dr. Sarah Mitchell',
      readTime: 8,
      featured: true,
      isPublished: true,
      publishedAt: new Date('2024-11-28'),
      tags: ['Temples', 'History', 'Pharaohs', 'Culture']
    },
    {
      title: 'Traditional Egyptian Cuisine on the Nile',
      slug: 'traditional-egyptian-cuisine-nile',
      excerpt: 'Savor the authentic flavors of Egypt with traditional dishes prepared fresh on board your Dahabiya.',
      content: `One of the unexpected pleasures of a Dahabiya cruise is the incredible food. Our chefs prepare traditional Egyptian dishes using fresh ingredients sourced from local markets along the Nile.

Start your day with ful medames (fava beans) and fresh bread, enjoy a lunch of grilled fish caught from the Nile, and end with a dinner of lamb tagine under the stars. Every meal is a celebration of Egyptian culinary traditions.

The intimate size of a Dahabiya means our chef can accommodate dietary preferences and even teach interested guests how to prepare some of these traditional dishes. It's cultural immersion through cuisine.`,
      mainImageUrl: '/images/blogs/egyptian-cuisine.jpg',
      author: 'Chef Omar Farouk',
      readTime: 6,
      featured: true,
      isPublished: true,
      publishedAt: new Date('2024-11-25'),
      tags: ['Food', 'Cuisine', 'Culture', 'Cooking']
    },
    {
      title: 'Wildlife Along the Nile: Birds and Beyond',
      slug: 'wildlife-along-nile-birds-beyond',
      excerpt: 'The Nile River is home to incredible wildlife. Discover the birds, fish, and other creatures that call this ancient river home.',
      content: `The Nile River is not just a highway through history - it's a thriving ecosystem teeming with wildlife. From the deck of a Dahabiya, you'll have front-row seats to observe the incredible variety of birds that call the Nile home.

Herons stand motionless in the shallows, waiting for the perfect moment to strike. Kingfishers dart between the reeds, their brilliant blue feathers flashing in the sunlight. And if you're lucky, you might spot a Nile crocodile sunning itself on a sandbank.

The slower pace of Dahabiya travel means you have time to appreciate these natural wonders. Our guides are knowledgeable about local wildlife and can help you identify the various species you'll encounter.`,
      mainImageUrl: '/images/blogs/nile-wildlife.jpg',
      author: 'Naturalist Guide Amira',
      readTime: 7,
      featured: false,
      isPublished: true,
      publishedAt: new Date('2024-11-20'),
      tags: ['Wildlife', 'Birds', 'Nature', 'Photography']
    },
    {
      title: 'Planning Your First Dahabiya Adventure',
      slug: 'planning-first-dahabiya-adventure',
      excerpt: 'Everything you need to know to plan the perfect Dahabiya cruise, from what to pack to what to expect.',
      content: `Planning your first Dahabiya cruise can feel overwhelming, but it doesn't have to be. Here's everything you need to know to make your journey unforgettable.

First, consider the time of year. October through April offers the most comfortable weather, with warm days and cool evenings. Pack light, breathable clothing for the day and a warm layer for evenings on deck.

Unlike large cruise ships, Dahabiyas offer a more intimate experience. You'll be traveling with just 8-12 other guests, creating opportunities for meaningful connections and personalized service.

Most importantly, come with an open mind and a sense of adventure. The magic of the Nile reveals itself to those who are ready to embrace the unexpected.`,
      mainImageUrl: '/images/blogs/planning-dahabiya.jpg',
      author: 'Travel Consultant Layla',
      readTime: 10,
      featured: false,
      isPublished: true,
      publishedAt: new Date('2024-11-15'),
      tags: ['Planning', 'Travel Tips', 'First Time', 'Advice']
    },
    {
      title: 'The Art of Traditional Boat Building',
      slug: 'art-traditional-boat-building',
      excerpt: 'Learn about the ancient craft of building Dahabiyas and how traditional techniques are preserved today.',
      content: `The art of building a Dahabiya is a tradition that has been passed down through generations of Egyptian craftsmen. These beautiful boats are not mass-produced - each one is carefully handcrafted using techniques that have remained largely unchanged for centuries.

The process begins with selecting the right wood, traditionally acacia or sycamore. The hull is built using traditional joinery techniques, without nails or screws. The distinctive lateen sails are hand-sewn from heavy cotton canvas.

Today's Dahabiyas combine this traditional craftsmanship with modern safety features and comfort amenities. The result is a vessel that honors the past while providing the luxury and security that modern travelers expect.`,
      mainImageUrl: '/images/blogs/boat-building.jpg',
      author: 'Master Craftsman Mahmoud',
      readTime: 9,
      featured: false,
      isPublished: true,
      publishedAt: new Date('2024-11-10'),
      tags: ['Craftsmanship', 'Tradition', 'Boats', 'Heritage']
    }
  ];

  let created = 0;
  let updated = 0;

  for (const blog of sampleBlogs) {
    try {
      const result = await prisma.blog.upsert({
        where: { slug: blog.slug },
        update: {
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          mainImageUrl: blog.mainImageUrl,
          author: blog.author,
          readTime: blog.readTime,
          featured: blog.featured,
          isPublished: blog.isPublished,
          publishedAt: blog.publishedAt,
          tags: blog.tags
        },
        create: {
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          mainImageUrl: blog.mainImageUrl,
          author: blog.author,
          readTime: blog.readTime,
          featured: blog.featured,
          isPublished: blog.isPublished,
          publishedAt: blog.publishedAt,
          tags: blog.tags
        }
      });

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++;
        console.log(`✅ Created: ${blog.title} ${blog.featured ? '(Featured)' : ''}`);
      } else {
        updated++;
        console.log(`🔄 Updated: ${blog.title} ${blog.featured ? '(Featured)' : ''}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create ${blog.title}:`, error.message);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created} blog posts`);
  console.log(`   Updated: ${updated} blog posts`);

  // Verify creation
  const finalBlogs = await prisma.blog.findMany({
    where: { isPublished: true },
    select: { title: true, featured: true }
  });

  const featuredCount = finalBlogs.filter(blog => blog.featured).length;
  console.log(`\n✅ Final blog count: ${finalBlogs.length} published (${featuredCount} featured)`);

  await prisma.$disconnect();
}

createSampleBlogPosts().catch(console.error);
