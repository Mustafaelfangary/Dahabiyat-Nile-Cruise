import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting minimal seed...');
  
  // Create admin user
  const hashedPassword = await hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cleopatra-cruises.com' },
    update: {},
    create: {
      email: 'admin@cleopatra-cruises.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create minimal essential settings
  const essentialSettings = [
    // Contact
    { key: 'contact_email', value: 'info@dahabiyatnilecruise.com', group: 'contact' },
    { key: 'contact_phone', value: '+20 123 456 7890', group: 'contact' },
    
    // SEO
    { key: 'meta_title', value: 'Dahabiyat Nile Cruise - Luxury Nile Experience', group: 'seo' },
    { key: 'meta_description', value: 'Experience luxury Nile cruises with Dahabiyat Nile Cruise.', group: 'seo' },
    
    // Basic settings
    { key: 'currency', value: 'USD', group: 'payment' },
    { key: 'booking_lead_time', value: '7', group: 'booking' },
  ];

  for (const setting of essentialSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('✅ Essential settings created');

  // Create comprehensive homepage content
  const homepageContent = [
    // Hero Section
    {
      key: 'hero_video_title',
      title: 'Hero Video Title',
      content: 'Sail the Eternal Nile in Pharaonic Splendor',
      page: 'homepage',
      section: 'hero',
      contentType: 'TEXT',
      order: 1
    },
    {
      key: 'hero_video_subtitle',
      title: 'Hero Video Subtitle',
      content: 'Journey through 5000 years of history aboard our luxury dahabiyas, where every moment is touched by the magic of ancient Egypt.',
      page: 'homepage',
      section: 'hero',
      contentType: 'TEXTAREA',
      order: 2
    },
    {
      key: 'hero_video_cta_text',
      title: 'Hero CTA Button Text',
      content: 'Begin Your Royal Journey',
      page: 'homepage',
      section: 'hero',
      contentType: 'TEXT',
      order: 3
    },
    {
      key: 'hero_video_cta_link',
      title: 'Hero CTA Button Link',
      content: '/dahabiyat',
      page: 'homepage',
      section: 'hero',
      contentType: 'TEXT',
      order: 4
    },
    {
      key: 'hero_scroll_text',
      title: 'Hero Scroll Text',
      content: 'Scroll to explore',
      page: 'homepage',
      section: 'hero',
      contentType: 'TEXT',
      order: 5
    },

    // Dahabiyat Section
    {
      key: 'dahabiyat_section_title',
      title: 'Dahabiyat Section Title',
      content: 'Our Luxury Dahabiyat Fleet',
      page: 'homepage',
      section: 'dahabiyat',
      contentType: 'TEXT',
      order: 1
    },
    {
      key: 'dahabiyat_section_subtitle',
      title: 'Dahabiyat Section Subtitle',
      content: 'Discover our collection of traditional sailing vessels, each offering a unique journey through Egypt\'s timeless landscapes',
      page: 'homepage',
      section: 'dahabiyat',
      contentType: 'TEXTAREA',
      order: 2
    },
    {
      key: 'dahabiyat_view_all_text',
      title: 'Dahabiyat View All Button Text',
      content: 'View All Dahabiyat',
      page: 'homepage',
      section: 'dahabiyat',
      contentType: 'TEXT',
      order: 3
    },

    // Our Story Section
    {
      key: 'our_story_title',
      title: 'Our Story Title',
      content: 'Our Story',
      page: 'homepage',
      section: 'story',
      contentType: 'TEXT',
      order: 1
    },
    {
      key: 'our_story_content',
      title: 'Our Story Content',
      content: 'Our journey began over 30 years ago when Captain Ahmed Hassan, a third-generation Nile navigator, had a vision to revive the authentic way of exploring Egypt\'s ancient wonders. Growing up along the banks of the Nile, he witnessed the transformation of river travel and felt called to preserve the traditional Dahabiya experience.',
      page: 'homepage',
      section: 'story',
      contentType: 'TEXTAREA',
      order: 2
    },
    {
      key: 'founder_name',
      title: 'Founder Name',
      content: 'Captain Ahmed Hassan',
      page: 'homepage',
      section: 'story',
      contentType: 'TEXT',
      order: 3
    },
    {
      key: 'founder_title',
      title: 'Founder Title',
      content: 'Founder & Master Navigator',
      page: 'homepage',
      section: 'story',
      contentType: 'TEXT',
      order: 4
    },
    {
      key: 'founder_image',
      title: 'Founder Image',
      content: '/images/our-story-founder.jpg',
      page: 'homepage',
      section: 'story',
      contentType: 'IMAGE',
      order: 5
    },

    // Safety Section
    {
      key: 'safety_title',
      title: 'Safety Section Title',
      content: 'Your Safety is Our Priority',
      page: 'homepage',
      section: 'safety',
      contentType: 'TEXT',
      order: 1
    },
    {
      key: 'safety_subtitle',
      title: 'Safety Section Subtitle',
      content: 'All our Dahabiyas are certified and regularly inspected to ensure the highest safety standards',
      page: 'homepage',
      section: 'safety',
      contentType: 'TEXTAREA',
      order: 2
    }
  ];

  for (const content of homepageContent) {
    await prisma.websiteContent.upsert({
      where: { key: content.key },
      update: {
        title: content.title,
        content: content.content,
        page: content.page,
        section: content.section,
        contentType: content.contentType as any,
        order: content.order
      },
      create: {
        ...content,
        isActive: true
      } as any,
    });
  }

  console.log('✅ Minimal homepage content created');

  // Create footer content
  const footerContent = [
    {
      key: 'footer_company_name',
      title: 'Company Name',
      content: 'Cleopatra Cruises',
      page: 'footer',
      section: 'company',
      contentType: 'TEXT',
      order: 1
    },
    {
      key: 'footer_company_description',
      title: 'Company Description',
      content: 'Experience the magic of the Nile with our luxury cruise experiences.',
      page: 'footer',
      section: 'company',
      contentType: 'TEXT',
      order: 2
    },
    {
      key: 'footer_contact_email',
      title: 'Contact Email',
      content: 'info@cleopatra-cruises.com',
      page: 'footer',
      section: 'contact',
      contentType: 'TEXT',
      order: 1
    },
    {
      key: 'footer_contact_phone',
      title: 'Contact Phone',
      content: '+20 123 456 7890',
      page: 'footer',
      section: 'contact',
      contentType: 'TEXT',
      order: 2
    },
    {
      key: 'footer_address',
      title: 'Address',
      content: '123 Nile Street, Cairo, Egypt',
      page: 'footer',
      section: 'contact',
      contentType: 'TEXT',
      order: 3
    },
    {
      key: 'footer_copyright',
      title: 'Copyright',
      content: '© 2024 Dahabiyat Nile Cruise. All rights reserved.',
      page: 'footer',
      section: 'legal',
      contentType: 'TEXT',
      order: 1
    }
  ];

  for (const content of footerContent) {
    await prisma.websiteContent.upsert({
      where: { key: content.key },
      update: {
        title: content.title,
        content: content.content,
        page: content.page,
        section: content.section,
        contentType: content.contentType as any,
        order: content.order
      },
      create: {
        ...content,
        isActive: true
      } as any,
    });
  }

  console.log('✅ Footer content created');

  // Create global media content (for common elements)
  const globalMediaContent = [
    {
      key: 'site_logo',
      title: 'Site Logo',
      content: '/images/logo.png',
      page: 'global_media',
      section: 'branding',
      contentType: 'IMAGE',
      order: 1
    },
    {
      key: 'site_favicon',
      title: 'Site Favicon',
      content: '/favicon.ico',
      page: 'global_media',
      section: 'branding',
      contentType: 'IMAGE',
      order: 2
    }
  ];

  for (const content of globalMediaContent) {
    await prisma.websiteContent.upsert({
      where: { key: content.key },
      update: {
        title: content.title,
        content: content.content,
        page: content.page,
        section: content.section,
        contentType: content.contentType as any,
        order: content.order
      },
      create: {
        ...content,
        isActive: true
      } as any,
    });
  }

  console.log('✅ Global media content created');

  // Create a sample FAQ
  await prisma.faq.upsert({
    where: { id: 'sample-faq' },
    update: {},
    create: {
      id: 'sample-faq',
      question: 'What is included in a Nile cruise?',
      answer: 'Our Nile cruises include accommodation, meals, guided tours, and transportation.',
      order: 1
    }
  });

  console.log('✅ Sample FAQ created');

  console.log('🎉 Minimal seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
