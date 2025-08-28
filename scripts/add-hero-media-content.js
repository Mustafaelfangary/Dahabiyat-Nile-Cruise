#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addHeroMediaContent() {
  console.log('🎬 Adding Hero Media Content for All Pages...\n');

  const heroMediaContent = [
    // Contact Page Hero Media
    {
      key: 'contact_hero_background_image',
      title: 'Contact Hero Background Image',
      content: '/images/contact/hero-bg.jpg',
      contentType: 'IMAGE',
      page: 'contact',
      section: 'hero',
      order: 1
    },
    {
      key: 'contact_hero_video_url',
      title: 'Contact Hero Video URL',
      content: '/videos/contact-hero.mp4',
      contentType: 'VIDEO',
      page: 'contact',
      section: 'hero',
      order: 2
    },
    {
      key: 'contact_hero_video_poster',
      title: 'Contact Hero Video Poster',
      content: '/images/contact/hero-video-poster.jpg',
      contentType: 'IMAGE',
      page: 'contact',
      section: 'hero',
      order: 3
    },

    // About Page Hero Media
    {
      key: 'about_hero_background_image',
      title: 'About Hero Background Image',
      content: '/images/about/hero-bg.jpg',
      contentType: 'IMAGE',
      page: 'about',
      section: 'hero',
      order: 1
    },
    {
      key: 'about_hero_video_url',
      title: 'About Hero Video URL',
      content: '/videos/about-hero.mp4',
      contentType: 'VIDEO',
      page: 'about',
      section: 'hero',
      order: 2
    },
    {
      key: 'about_hero_video_poster',
      title: 'About Hero Video Poster',
      content: '/images/about/hero-video-poster.jpg',
      contentType: 'IMAGE',
      page: 'about',
      section: 'hero',
      order: 3
    },

    // Blogs Page Hero Media
    {
      key: 'blogs_hero_background_image',
      title: 'Blogs Hero Background Image',
      content: '/images/blogs/hero-bg.jpg',
      contentType: 'IMAGE',
      page: 'blog',
      section: 'hero',
      order: 1
    },
    {
      key: 'blogs_hero_video_url',
      title: 'Blogs Hero Video URL',
      content: '/videos/blogs-hero.mp4',
      contentType: 'VIDEO',
      page: 'blog',
      section: 'hero',
      order: 2
    },
    {
      key: 'blogs_hero_video_poster',
      title: 'Blogs Hero Video Poster',
      content: '/images/blogs/hero-video-poster.jpg',
      contentType: 'IMAGE',
      page: 'blog',
      section: 'hero',
      order: 3
    },

    // Itineraries Page Hero Media (already exists but let's ensure it's complete)
    {
      key: 'itineraries_hero_video_url',
      title: 'Itineraries Hero Video URL',
      content: '/videos/itineraries-hero.mp4',
      contentType: 'VIDEO',
      page: 'itineraries',
      section: 'hero',
      order: 2
    },
    {
      key: 'itineraries_hero_video_poster',
      title: 'Itineraries Hero Video Poster',
      content: '/images/itineraries/hero-video-poster.jpg',
      contentType: 'IMAGE',
      page: 'itineraries',
      section: 'hero',
      order: 3
    },

    // Packages Page Hero Media
    {
      key: 'packages_hero_background_image',
      title: 'Packages Hero Background Image',
      content: '/images/packages/hero-bg.jpg',
      contentType: 'IMAGE',
      page: 'packages',
      section: 'hero',
      order: 1
    },
    {
      key: 'packages_hero_video_url',
      title: 'Packages Hero Video URL',
      content: '/videos/packages-hero.mp4',
      contentType: 'VIDEO',
      page: 'packages',
      section: 'hero',
      order: 2
    },
    {
      key: 'packages_hero_video_poster',
      title: 'Packages Hero Video Poster',
      content: '/images/packages/hero-video-poster.jpg',
      contentType: 'IMAGE',
      page: 'packages',
      section: 'hero',
      order: 3
    },

    // Dahabiyas Page Hero Media
    {
      key: 'dahabiyas_hero_background_image',
      title: 'Dahabiyas Hero Background Image',
      content: '/images/dahabiyas/hero-bg.jpg',
      contentType: 'IMAGE',
      page: 'dahabiyas',
      section: 'hero',
      order: 1
    },
    {
      key: 'dahabiyas_hero_video_url',
      title: 'Dahabiyas Hero Video URL',
      content: '/videos/dahabiyas-hero.mp4',
      contentType: 'VIDEO',
      page: 'dahabiyas',
      section: 'hero',
      order: 2
    },
    {
      key: 'dahabiyas_hero_video_poster',
      title: 'Dahabiyas Hero Video Poster',
      content: '/images/dahabiyas/hero-video-poster.jpg',
      contentType: 'IMAGE',
      page: 'dahabiyas',
      section: 'hero',
      order: 3
    }
  ];

  let created = 0;
  let updated = 0;

  for (const content of heroMediaContent) {
    try {
      const result = await prisma.websiteContent.upsert({
        where: { key: content.key },
        update: {
          title: content.title,
          content: content.content,
          contentType: content.contentType,
          page: content.page,
          section: content.section,
          order: content.order,
          isActive: true
        },
        create: {
          key: content.key,
          title: content.title,
          content: content.content,
          contentType: content.contentType,
          page: content.page,
          section: content.section,
          order: content.order,
          isActive: true
        }
      });

      if (result) {
        console.log(`✅ ${content.title} (${content.page})`);
        created++;
      }
    } catch (error) {
      console.error(`❌ Failed to add ${content.title}:`, error.message);
    }
  }

  console.log(`\n🎉 Hero Media Content Added Successfully!`);
  console.log(`📊 Created/Updated: ${created} items`);
  console.log(`\n📝 Pages with Hero Media:`);
  console.log(`   • Contact Page - Background, Video & Poster`);
  console.log(`   • About Page - Background, Video & Poster`);
  console.log(`   • Blogs Page - Background, Video & Poster`);
  console.log(`   • Itineraries Page - Background, Video & Poster`);
  console.log(`   • Packages Page - Background, Video & Poster`);
  console.log(`   • Dahabiyas Page - Background, Video & Poster`);
  
  console.log(`\n🎬 Admin can now edit hero media in Website Content Manager!`);
}

// Run the script
addHeroMediaContent()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
