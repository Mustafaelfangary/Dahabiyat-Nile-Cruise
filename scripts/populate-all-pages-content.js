const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateAllPagesContent() {
  console.log('🚀 Starting to populate content for all pages...');

  try {
    // About Page Content
    const aboutContent = [
      {
        key: 'about_hero_title',
        title: 'About Hero Title',
        content: 'Discover the Timeless Beauty of the Nile',
        contentType: 'TEXT',
        page: 'about',
        section: 'hero',
        order: 1
      },
      {
        key: 'about_hero_subtitle',
        title: 'About Hero Subtitle',
        content: 'Experience authentic Egyptian hospitality aboard our traditional dahabiyat',
        contentType: 'TEXT',
        page: 'about',
        section: 'hero',
        order: 2
      },
      {
        key: 'about_hero_background',
        title: 'About Hero Background',
        content: '/images/about-hero.jpg',
        contentType: 'IMAGE',
        page: 'about',
        section: 'hero',
        order: 3
      },
      {
        key: 'about_story_title',
        title: 'Our Story Title',
        content: 'Our Story',
        contentType: 'TEXT',
        page: 'about',
        section: 'story',
        order: 4
      },
      {
        key: 'about_story_content',
        title: 'Our Story Content',
        content: 'For generations, we have been sharing the magic of the Nile with travelers from around the world. Our traditional dahabiyat offer an authentic and intimate way to explore ancient Egypt.',
        contentType: 'TEXTAREA',
        page: 'about',
        section: 'story',
        order: 5
      },
      {
        key: 'about_mission_title',
        title: 'Mission Title',
        content: 'Our Mission',
        contentType: 'TEXT',
        page: 'about',
        section: 'mission',
        order: 6
      },
      {
        key: 'about_mission_content',
        title: 'Mission Content',
        content: 'To provide unforgettable Nile cruise experiences that connect our guests with the rich history and culture of ancient Egypt.',
        contentType: 'TEXTAREA',
        page: 'about',
        section: 'mission',
        order: 7
      }
    ];

    // Contact Page Content
    const contactContent = [
      {
        key: 'contact_hero_title',
        title: 'Contact Hero Title',
        content: 'Get in Touch',
        contentType: 'TEXT',
        page: 'contact',
        section: 'hero',
        order: 1
      },
      {
        key: 'contact_hero_subtitle',
        title: 'Contact Hero Subtitle',
        content: 'Ready to embark on your Nile adventure? Contact us today!',
        contentType: 'TEXT',
        page: 'contact',
        section: 'hero',
        order: 2
      },
      {
        key: 'contact_phone',
        title: 'Contact Phone',
        content: '+20 123 456 7890',
        contentType: 'TEXT',
        page: 'contact',
        section: 'info',
        order: 3
      },
      {
        key: 'contact_email',
        title: 'Contact Email',
        content: 'info@cleopatradahabiyat.com',
        contentType: 'TEXT',
        page: 'contact',
        section: 'info',
        order: 4
      },
      {
        key: 'contact_address',
        title: 'Contact Address',
        content: 'Luxor, Egypt',
        contentType: 'TEXT',
        page: 'contact',
        section: 'info',
        order: 5
      },
      {
        key: 'contact_whatsapp',
        title: 'WhatsApp Number',
        content: '+20 123 456 7890',
        contentType: 'TEXT',
        page: 'contact',
        section: 'info',
        order: 6
      }
    ];

    // Packages Page Content
    const packagesContent = [
      {
        key: 'packages_hero_title',
        title: 'Packages Hero Title',
        content: 'Nile Cruise Packages',
        contentType: 'TEXT',
        page: 'packages',
        section: 'hero',
        order: 1
      },
      {
        key: 'packages_hero_subtitle',
        title: 'Packages Hero Subtitle',
        content: 'Choose from our carefully crafted cruise packages',
        contentType: 'TEXT',
        page: 'packages',
        section: 'hero',
        order: 2
      },
      {
        key: 'packages_hero_background',
        title: 'Packages Hero Background',
        content: '/images/packages-hero.jpg',
        contentType: 'IMAGE',
        page: 'packages',
        section: 'hero',
        order: 3
      },
      {
        key: 'packages_description',
        title: 'Packages Description',
        content: 'Discover our range of Nile cruise packages, each designed to offer unique experiences and unforgettable memories.',
        contentType: 'TEXTAREA',
        page: 'packages',
        section: 'content',
        order: 4
      }
    ];

    // Dahabiyas Page Content
    const dahabiyasContent = [
      {
        key: 'dahabiyas_hero_title',
        title: 'Dahabiyas Hero Title',
        content: 'Our Traditional Dahabiyas',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'hero',
        order: 1
      },
      {
        key: 'dahabiyas_hero_subtitle',
        title: 'Dahabiyas Hero Subtitle',
        content: 'Sail the Nile in authentic traditional boats',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'hero',
        order: 2
      },
      {
        key: 'dahabiyas_hero_background',
        title: 'Dahabiyas Hero Background',
        content: '/images/dahabiyas-hero.jpg',
        contentType: 'IMAGE',
        page: 'dahabiyas',
        section: 'hero',
        order: 3
      },
      {
        key: 'dahabiyas_description',
        title: 'Dahabiyas Description',
        content: 'Our fleet of traditional dahabiyas combines authentic Egyptian craftsmanship with modern comfort and luxury.',
        contentType: 'TEXTAREA',
        page: 'dahabiyas',
        section: 'content',
        order: 4
      }
    ];

    // Tailor-Made Page Content
    const tailorMadeContent = [
      {
        key: 'tailor_made_hero_title',
        title: 'Tailor-Made Hero Title',
        content: 'Tailor-Made Experiences',
        contentType: 'TEXT',
        page: 'tailor-made',
        section: 'hero',
        order: 1
      },
      {
        key: 'tailor_made_hero_subtitle',
        title: 'Tailor-Made Hero Subtitle',
        content: 'Create your perfect Nile cruise experience',
        contentType: 'TEXT',
        page: 'tailor-made',
        section: 'hero',
        order: 2
      },
      {
        key: 'tailor_made_description',
        title: 'Tailor-Made Description',
        content: 'Work with our experts to create a personalized Nile cruise that matches your interests, schedule, and preferences.',
        contentType: 'TEXTAREA',
        page: 'tailor-made',
        section: 'content',
        order: 3
      }
    ];

    // Footer Content
    const footerContent = [
      {
        key: 'footer_company_description',
        title: 'Footer Company Description',
        content: 'Experience the magic of the Nile with Cleopatra Dahabiyat. Traditional boats, modern comfort, unforgettable memories.',
        contentType: 'TEXTAREA',
        page: 'footer',
        section: 'company',
        order: 1
      },
      {
        key: 'footer_quick_links_title',
        title: 'Footer Quick Links Title',
        content: 'Quick Links',
        contentType: 'TEXT',
        page: 'footer',
        section: 'links',
        order: 2
      },
      {
        key: 'footer_contact_title',
        title: 'Footer Contact Title',
        content: 'Contact Info',
        contentType: 'TEXT',
        page: 'footer',
        section: 'contact',
        order: 3
      },
      {
        key: 'footer_social_title',
        title: 'Footer Social Title',
        content: 'Follow Us',
        contentType: 'TEXT',
        page: 'footer',
        section: 'social',
        order: 4
      }
    ];

    // Combine all content
    const allContent = [
      ...aboutContent,
      ...contactContent,
      ...packagesContent,
      ...dahabiyasContent,
      ...tailorMadeContent,
      ...footerContent
    ];

    console.log(`📝 Creating ${allContent.length} content entries...`);

    // Insert all content
    let created = 0;
    let updated = 0;

    for (const content of allContent) {
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

        if (result.createdAt === result.updatedAt) {
          created++;
        } else {
          updated++;
        }

        console.log(`✅ ${content.page}: ${content.key}`);
      } catch (error) {
        console.error(`❌ Failed to create ${content.key}:`, error.message);
      }
    }

    console.log(`\n🎉 Content population completed!`);
    console.log(`📊 Summary:`);
    console.log(`  - Created: ${created} new entries`);
    console.log(`  - Updated: ${updated} existing entries`);
    console.log(`  - Total: ${created + updated} entries processed`);

    // Show content by page
    const pages = ['about', 'contact', 'packages', 'dahabiyas', 'tailor-made', 'footer'];
    for (const page of pages) {
      const count = await prisma.websiteContent.count({
        where: { page, isActive: true }
      });
      console.log(`  - ${page}: ${count} content blocks`);
    }

  } catch (error) {
    console.error('❌ Error populating content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateAllPagesContent();
