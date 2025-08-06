import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
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

  console.log('Admin user created:', admin);

  // Create initial settings
  const settings = [
    // Contact Settings
    {
      key: 'contact_email',
      value: 'info@cleopatra-cruises.com',
      group: 'contact',
      description: 'Main contact email address',
      type: 'email'
    },
    {
      key: 'contact_phone',
      value: '+20 123 456 7890',
      group: 'contact',
      description: 'Main contact phone number',
      type: 'text'
    },
    {
      key: 'contact_address',
      value: '123 Nile Street, Cairo, Egypt',
      group: 'contact',
      description: 'Physical address',
      type: 'textarea'
    },

    // Social Media Settings
    {
      key: 'facebook_url',
      value: 'https://facebook.com/cleopatra-cruises',
      group: 'social',
      description: 'Facebook page URL',
      type: 'url'
    },
    {
      key: 'instagram_url',
      value: 'https://instagram.com/cleopatra-cruises',
      group: 'social',
      description: 'Instagram profile URL',
      type: 'url'
    },
    {
      key: 'twitter_url',
      value: 'https://twitter.com/cleopatra-cruises',
      group: 'social',
      description: 'Twitter profile URL',
      type: 'url'
    },

    // SEO Settings
    {
      key: 'meta_title',
      value: 'Cleopatra Cruises - Luxury Nile Cruise Experience',
      group: 'seo',
      description: 'Default meta title for SEO',
      type: 'text'
    },
    {
      key: 'meta_description',
      value: 'Experience luxury Nile cruises with Cleopatra Cruises. Discover ancient Egypt in style and comfort.',
      group: 'seo',
      description: 'Default meta description for SEO',
      type: 'textarea'
    },
    {
      key: 'meta_keywords',
      value: 'nile cruise, luxury cruise, egypt tours, cleopatra cruises',
      group: 'seo',
      description: 'Default meta keywords for SEO',
      type: 'text'
    },

    // Appearance Settings
    {
      key: 'primary_color',
      value: '#1a365d',
      group: 'appearance',
      description: 'Primary brand color',
      type: 'color'
    },
    {
      key: 'secondary_color',
      value: '#e2e8f0',
      group: 'appearance',
      description: 'Secondary brand color',
      type: 'color'
    },
    {
      key: 'font_family',
      value: 'Inter, sans-serif',
      group: 'appearance',
      description: 'Main font family',
      type: 'text'
    },

    // Booking Settings
    {
      key: 'booking_lead_time',
      value: '7',
      group: 'booking',
      description: 'Minimum days required for booking',
      type: 'number'
    },
    {
      key: 'max_passengers',
      value: '100',
      group: 'booking',
      description: 'Maximum passengers per cruise',
      type: 'number'
    },
    {
      key: 'cancellation_policy',
      value: 'Free cancellation up to 48 hours before departure',
      group: 'booking',
      description: 'Cancellation policy text',
      type: 'textarea'
    },

    // Payment Settings
    {
      key: 'currency',
      value: 'USD',
      group: 'payment',
      description: 'Default currency',
      type: 'text'
    },
    {
      key: 'payment_methods',
      value: 'credit_card,paypal,bank_transfer',
      group: 'payment',
      description: 'Available payment methods',
      type: 'text'
    },
    {
      key: 'tax_rate',
      value: '14',
      group: 'payment',
      description: 'Tax rate percentage',
      type: 'number'
    },

    // Email Settings
    {
      key: 'smtp_host',
      value: 'smtp.gmail.com',
      group: 'email',
      description: 'SMTP server host',
      type: 'text'
    },
    {
      key: 'smtp_port',
      value: '587',
      group: 'email',
      description: 'SMTP server port',
      type: 'number'
    },
    {
      key: 'smtp_username',
      value: 'noreply@cleopatra-cruises.com',
      group: 'email',
      description: 'SMTP username',
      type: 'text'
    },

    // Homepage Settings (all homepage content stays here)
    { key: 'home_hero_headline', value: 'Discover the Magic of the Nile', group: 'homepage', description: 'Hero section headline', type: 'text' },
    { key: 'home_hero_subheadline', value: 'Experience luxury and adventure on our premium Nile cruises', group: 'homepage', description: 'Hero section subheadline', type: 'text' },
    { key: 'home_hero_image', value: '/images/hero-bg.jpg', group: 'homepage', description: 'Hero section background image', type: 'image' },
    { key: 'home_hero_video', value: '/videos/hero.mp4', group: 'homepage', description: 'Hero section background video', type: 'video' },
    { key: 'home_featured_title', value: 'Our Featured Cruises', group: 'homepage', description: 'Featured cruises section title', type: 'text' },
    { key: 'home_featured_subtitle', value: 'Explore our most popular Nile cruise packages', group: 'homepage', description: 'Featured cruises section subtitle', type: 'textarea' },
    { key: 'home_why_title', value: 'Why Choose Cleopatra Cruises', group: 'homepage', description: 'Why choose us section title', type: 'text' },
    { key: 'home_why_subtitle', value: 'Experience the best of luxury and comfort', group: 'homepage', description: 'Why choose us section subtitle', type: 'textarea' },
    { key: 'home_why_image', value: '/images/why-choose-us.jpg', group: 'homepage', description: 'Why choose us section image', type: 'image' },
    { key: 'home_testimonials_title', value: 'What Our Guests Say', group: 'homepage', description: 'Testimonials section title', type: 'text' },
    { key: 'home_testimonials_subtitle', value: 'Read about experiences from our satisfied guests', group: 'homepage', description: 'Testimonials section subtitle', type: 'textarea' },
    { key: 'home_testimonials_background', value: '/images/testimonials-bg.jpg', group: 'homepage', description: 'Testimonials section background image', type: 'image' },
    { key: 'home_cta_title', value: 'Ready to Start Your Journey?', group: 'homepage', description: 'Call to action section title', type: 'text' },
    { key: 'home_cta_subtitle', value: 'Book your dream Nile cruise today', group: 'homepage', description: 'Call to action section subtitle', type: 'textarea' },
    { key: 'home_cta_button_text', value: 'Book Now', group: 'homepage', description: 'Call to action button text', type: 'text' },
    { key: 'home_cta_background', value: '/images/cta-bg.jpg', group: 'homepage', description: 'Call to action section background image', type: 'image' },
    { key: 'home_footer_logo', value: '/images/footer-logo.png', group: 'homepage', description: 'Footer logo', type: 'image' },
    { key: 'home_footer_background', value: '/images/footer-bg.jpg', group: 'homepage', description: 'Footer background image', type: 'image' },
    // --- New Homepage Sections for dahabiyat.com style ---
    // About Section
    { key: 'home_about_title', value: 'Dahabiyat Nile Cruise', group: 'homepage', description: 'About section title', type: 'text' },
    { key: 'home_about_text', value: 'A Dahabiya is an Arabic word meaning "the golden one." It\'s a large comfortable sailing boat of a simple but elegant form with two large sails. Our boat is a replica of original Dahabiya boats from the 19th century. Built by local craftsmen in Esna following the design of a typical Dahabiya used in the past. They offer the romance of the past combined with the comfort of today.\n\nWhen you sail on our Dahabiya, you will have a great unforgettable experience as you will feel the beauty not just see it, when you pass through the green valley, islands, farms, and villages, off the beaten path attractions, and the romantic view of the pure sky full of stars.', group: 'homepage', description: 'About section text', type: 'textarea' },
    { key: 'home_about_image', value: '/images/about-placeholder.jpg', group: 'homepage', description: 'About section image', type: 'image' },
    // Our Boats Section (4 boats)
    { key: 'home_boats_section_title', value: 'Our Boats', group: 'homepage', description: 'Our Boats section title', type: 'text' },
    { key: 'home_boats_1_title', value: 'Princess Dahabiya', group: 'homepage', description: 'Boat 1 title', type: 'text' },
    { key: 'home_boats_1_desc', value: 'A classic Dahabiya experience.', group: 'homepage', description: 'Boat 1 description', type: 'text' },
    { key: 'home_boats_1_image', value: '/images/boats/princess-cleopatra.jpg', group: 'homepage', description: 'Boat 1 image', type: 'image' },
    { key: 'home_boats_2_title', value: 'Royal Cleopatra Dahabiya', group: 'homepage', description: 'Boat 2 title', type: 'text' },
    { key: 'home_boats_2_desc', value: 'Luxury and comfort on the Nile.', group: 'homepage', description: 'Boat 2 description', type: 'text' },
    { key: 'home_boats_2_image', value: '/images/boats/royal-cleopatra.jpg', group: 'homepage', description: 'Boat 2 image', type: 'image' },
    { key: 'home_boats_3_title', value: 'Queen Cleopatra Dahabiya', group: 'homepage', description: 'Boat 3 title', type: 'text' },
    { key: 'home_boats_3_desc', value: 'A regal Nile adventure.', group: 'homepage', description: 'Boat 3 description', type: 'text' },
    { key: 'home_boats_3_image', value: '/images/boats/queen-cleopatra.jpg', group: 'homepage', description: 'Boat 3 image', type: 'image' },
    { key: 'home_boats_4_title', value: 'Azhar Dahabiya', group: 'homepage', description: 'Boat 4 title', type: 'text' },
    { key: 'home_boats_4_desc', value: 'Modern comfort, classic style.', group: 'homepage', description: 'Boat 4 description', type: 'text' },
    { key: 'home_boats_4_image', value: '/images/boats/azhar.jpg', group: 'homepage', description: 'Boat 4 image', type: 'image' },
    // Sailing Tours Section (3 tours)
    { key: 'home_tours_section_title', value: 'Dahabiya Sailing Tours', group: 'homepage', description: 'Sailing Tours section title', type: 'text' },
    { key: 'home_tours_1_title', value: '3 Nights Aswan to Esna', group: 'homepage', description: 'Tour 1 title', type: 'text' },
    { key: 'home_tours_1_desc', value: 'Sail from Aswan to Esna and discover the Nile.', group: 'homepage', description: 'Tour 1 description', type: 'text' },
    { key: 'home_tours_1_price', value: '$1,350 /Cabin - 2 Persons', group: 'homepage', description: 'Tour 1 price', type: 'text' },
    { key: 'home_tours_1_duration', value: '3 NIGHTS / 4 DAYS', group: 'homepage', description: 'Tour 1 duration', type: 'text' },
    { key: 'home_tours_1_cabins', value: '8 Cabins', group: 'homepage', description: 'Tour 1 cabins', type: 'text' },
    { key: 'home_tours_1_image', value: '/images/tours/aswan-esna.jpg', group: 'homepage', description: 'Tour 1 image', type: 'image' },
    { key: 'home_tours_2_title', value: '4 Nights Esna to Aswan', group: 'homepage', description: 'Tour 2 title', type: 'text' },
    { key: 'home_tours_2_desc', value: 'Experience the Nile from Esna to Aswan.', group: 'homepage', description: 'Tour 2 description', type: 'text' },
    { key: 'home_tours_2_price', value: '$1,800 /Cabin - 2 Persons', group: 'homepage', description: 'Tour 2 price', type: 'text' },
    { key: 'home_tours_2_duration', value: '4 NIGHTS / 5 DAYS', group: 'homepage', description: 'Tour 2 duration', type: 'text' },
    { key: 'home_tours_2_cabins', value: '8 Cabins', group: 'homepage', description: 'Tour 2 cabins', type: 'text' },
    { key: 'home_tours_2_image', value: '/images/tours/esna-aswan.jpg', group: 'homepage', description: 'Tour 2 image', type: 'image' },
    { key: 'home_tours_3_title', value: '7 Nights Luxor to Aswan', group: 'homepage', description: 'Tour 3 title', type: 'text' },
    { key: 'home_tours_3_desc', value: 'A week-long journey from Luxor to Aswan.', group: 'homepage', description: 'Tour 3 description', type: 'text' },
    { key: 'home_tours_3_price', value: '$2,700 /Cabin - 2 Persons', group: 'homepage', description: 'Tour 3 price', type: 'text' },
    { key: 'home_tours_3_duration', value: '7 NIGHTS / 8 DAYS', group: 'homepage', description: 'Tour 3 duration', type: 'text' },
    { key: 'home_tours_3_cabins', value: '8 Cabins', group: 'homepage', description: 'Tour 3 cabins', type: 'text' },
    { key: 'home_tours_3_image', value: '/images/tours/luxor-aswan.jpg', group: 'homepage', description: 'Tour 3 image', type: 'image' },
    // Why Dahabiya Section
    { key: 'home_why_title', value: 'Why is Dahabiya different from the regular Nile Cruises?', group: 'homepage', description: 'Why Dahabiya section title', type: 'text' },
    { key: 'home_why_text', value: 'The regular Nile cruise takes hundreds of people on board, sail very briefly, managed by big and noisy engines, stop only 2 times on the way unlike the Dahabiya, all your time in real sailing, your stops at least double the stops made by the regular cruise. Add to that, Dahabiya normally has a limited number of cabins, varying from 5 to 12 cabins which make it more suitable for families and friends traveling together. All those who tried the comfort of the Dahabiya and experienced the Nile Cruise, they know the big difference between them.', group: 'homepage', description: 'Why Dahabiya section text', type: 'textarea' },
    // How it Works Section (3 steps)
    { key: 'home_how_section_title', value: 'How it works', group: 'homepage', description: 'How it works section title', type: 'text' },
    { key: 'home_how_1_title', value: 'Explore', group: 'homepage', description: 'How it works step 1 title', type: 'text' },
    { key: 'home_how_1_desc', value: 'Browse our cruises and find your perfect journey.', group: 'homepage', description: 'How it works step 1 description', type: 'text' },
    { key: 'home_how_1_icon', value: '/images/icons/explore.png', group: 'homepage', description: 'How it works step 1 icon', type: 'image' },
    { key: 'home_how_2_title', value: 'Book', group: 'homepage', description: 'How it works step 2 title', type: 'text' },
    { key: 'home_how_2_desc', value: 'Reserve your cabin easily online.', group: 'homepage', description: 'How it works step 2 description', type: 'text' },
    { key: 'home_how_2_icon', value: '/images/icons/book.png', group: 'homepage', description: 'How it works step 2 icon', type: 'image' },
    { key: 'home_how_3_title', value: 'Enjoy', group: 'homepage', description: 'How it works step 3 title', type: 'text' },
    { key: 'home_how_3_desc', value: 'Experience the Nile and create memories.', group: 'homepage', description: 'How it works step 3 description', type: 'text' },
    { key: 'home_how_3_icon', value: '/images/icons/enjoy.png', group: 'homepage', description: 'How it works step 3 icon', type: 'image' },
    // Blog Section - Now fully dynamic through admin panel
    // Blog posts are managed through /admin/blogs and displayed dynamically
    // Contact/Support Section
    { key: 'home_contact_title', value: 'Need Help?', group: 'homepage', description: 'Contact section title', type: 'text' },
    { key: 'home_contact_text', value: 'Call & WhatsApp or Email us for any inquiries.', group: 'homepage', description: 'Contact section text', type: 'textarea' },
    { key: 'home_contact_phone', value: '+201001538358', group: 'homepage', description: 'Contact phone', type: 'text' },
    { key: 'home_contact_email', value: 'info@dahabiyat.com', group: 'homepage', description: 'Contact email', type: 'email' },
    // Footer Section
    { key: 'home_footer_logo', value: '/images/footer-logo.png', group: 'homepage', description: 'Footer logo', type: 'image' },
    { key: 'home_footer_text', value: 'Powered by ALTA VIDA TOURS', group: 'homepage', description: 'Footer text', type: 'text' },
    // About Page Circles (Leadership/Team/Values) - ONLY these go to about category
    { key: 'about_circle_1', value: '/images/about/ashraf-elmasry.jpg', group: 'about', description: 'Circle 1 image', type: 'image' },
    { key: 'about_circle_title_1', value: 'CEO', group: 'about', description: 'Circle 1 title', type: 'text' },
    { key: 'about_circle_name_1', value: 'Ashraf El Masry', group: 'about', description: 'Circle 1 name', type: 'text' },
    { key: 'about_circle_2', value: '/images/about/ahmed-abdellah.jpg', group: 'about', description: 'Circle 2 image', type: 'image' },
    { key: 'about_circle_title_2', value: 'Operation Manager', group: 'about', description: 'Circle 2 title', type: 'text' },
    { key: 'about_circle_name_2', value: 'Ahmed Abdellah', group: 'about', description: 'Circle 2 name', type: 'text' },
    { key: 'about_circle_3', value: '/images/about/gomaa.jpg', group: 'about', description: 'Circle 3 image', type: 'image' },
    { key: 'about_circle_title_3', value: 'Dahabiya Captain', group: 'about', description: 'Circle 3 title', type: 'text' },
    { key: 'about_circle_name_3', value: 'Gomaa', group: 'about', description: 'Circle 3 name', type: 'text' },
    { key: 'about_circle_4', value: '/images/about/abdelrehim.jpg', group: 'about', description: 'Circle 4 image', type: 'image' },
    { key: 'about_circle_title_4', value: 'Captain Assistant', group: 'about', description: 'Circle 4 title', type: 'text' },
    { key: 'about_circle_name_4', value: 'Abdelrehim', group: 'about', description: 'Circle 4 name', type: 'text' },
    { key: 'about_circle_5', value: '/images/about/mohamed-chef.jpg', group: 'about', description: 'Circle 5 image', type: 'image' },
    { key: 'about_circle_title_5', value: 'Dahabiya Chef', group: 'about', description: 'Circle 5 title', type: 'text' },
    { key: 'about_circle_name_5', value: 'Mohamed', group: 'about', description: 'Circle 5 name', type: 'text' },
    { key: 'about_circle_6', value: '/images/about/adham.jpg', group: 'about', description: 'Circle 6 image', type: 'image' },
    { key: 'about_circle_title_6', value: 'Dahabiya Waiter', group: 'about', description: 'Circle 6 title', type: 'text' },
    { key: 'about_circle_name_6', value: 'Adham', group: 'about', description: 'Circle 6 name', type: 'text' },

    // Dahabiyat Page Content
    { key: 'dahabiyat_page_title', value: 'Our Royal Dahabiyat Fleet', group: 'dahabiyat', description: 'Main page title', type: 'text' },
    { key: 'dahabiyat_page_subtitle', value: 'Discover the Magic of Traditional Nile Sailing', group: 'dahabiyat', description: 'Page subtitle', type: 'text' },
    { key: 'dahabiyat_page_description', value: 'Experience the timeless beauty of the Nile aboard our carefully curated fleet of traditional dahabiyas. Each vessel combines authentic Egyptian craftsmanship with modern luxury, offering an intimate and unforgettable journey through ancient Egypt.', group: 'dahabiyat', description: 'Page description', type: 'textarea' },
    { key: 'dahabiyat_hero_image', value: '/images/dahabiyat-hero.jpg', group: 'dahabiyat', description: 'Hero section background image', type: 'image' },
    { key: 'dahabiyat_featured_title', value: 'Featured Dahabiyas', group: 'dahabiyat', description: 'Featured section title', type: 'text' },
    { key: 'dahabiyat_featured_subtitle', value: 'Handpicked vessels for the ultimate Nile experience', group: 'dahabiyat', description: 'Featured section subtitle', type: 'text' },
    { key: 'dahabiyat_why_choose_title', value: 'Why Choose Our Dahabiyas?', group: 'dahabiyat', description: 'Why choose section title', type: 'text' },
    { key: 'dahabiyat_why_choose_content', value: 'Our dahabiyas offer an authentic and intimate way to explore the Nile, combining traditional sailing with modern comfort and personalized service. Unlike large cruise ships, our vessels provide a peaceful and exclusive experience with personalized attention.', group: 'dahabiyat', description: 'Why choose section content', type: 'textarea' },
    { key: 'dahabiyat_experience_title', value: 'The Dahabiya Experience', group: 'dahabiyat', description: 'Experience section title', type: 'text' },
    { key: 'dahabiyat_experience_content', value: 'Sail the eternal Nile in pharaonic luxury aboard our traditional dahabiyas. Each journey is a unique adventure combining ancient history, stunning landscapes, and modern comfort.', group: 'dahabiyat', description: 'Experience section content', type: 'textarea' },
  ];

  for (const setting of settings) {
    await prisma.websiteContent.upsert({
      where: { key: setting.key },
      update: {
        title: setting.description,
        content: setting.value,
        contentType: setting.type === 'image' ? 'IMAGE' : setting.type === 'video' ? 'VIDEO' : 'TEXT',
        page: setting.group,
        section: setting.key.split('_')[1] || 'general',
      },
      create: {
        key: setting.key,
        title: setting.description,
        content: setting.value,
        contentType: setting.type === 'image' ? 'IMAGE' : setting.type === 'video' ? 'VIDEO' : 'TEXT',
        page: setting.group,
        section: setting.key.split('_')[1] || 'general',
      },
    });
  }

  console.log('Settings created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 