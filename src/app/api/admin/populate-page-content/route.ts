import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('🚀 Starting to populate missing page content...');

    // Define comprehensive content for all main pages
    const pageContent = [
      // HOMEPAGE CONTENT
      {
        key: 'homepage_hero_title',
        title: 'Homepage Hero Title',
        content: 'Luxury Nile Dahabiya Cruises',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'hero',
        order: 1
      },
      {
        key: 'homepage_hero_subtitle',
        title: 'Homepage Hero Subtitle',
        content: 'Experience the authentic way to explore ancient Egypt aboard traditional sailing vessels',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'hero',
        order: 2
      },
      {
        key: 'homepage_hero_description',
        title: 'Homepage Hero Description',
        content: 'Discover the timeless beauty of the Nile River aboard our authentic Dahabiya sailing boats. Experience luxury, history, and adventure in perfect harmony.',
        contentType: 'TEXTAREA',
        page: 'homepage',
        section: 'hero',
        order: 3
      },
      {
        key: 'homepage_hero_video',
        title: 'Homepage Hero Video',
        content: '/videos/dahabiya-hero.mp4',
        contentType: 'VIDEO',
        page: 'homepage',
        section: 'hero',
        order: 4
      },

      // What is Dahabiya Section
      {
        key: 'what_is_dahabiya_title',
        title: 'What is Dahabiya - Title',
        content: 'What is a Dahabiya?',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'what_is_dahabiya',
        order: 10
      },
      {
        key: 'what_is_dahabiya_content',
        title: 'What is Dahabiya - Content',
        content: 'A Dahabiya is a traditional Egyptian sailing boat that has been used on the Nile River for centuries. These elegant vessels were once the preferred mode of transport for wealthy travelers and dignitaries exploring ancient Egypt. Unlike modern cruise ships, Dahabiyas offer an intimate and authentic experience, carrying only 8-12 guests in luxurious comfort.',
        contentType: 'TEXTAREA',
        page: 'homepage',
        section: 'what_is_dahabiya',
        order: 11
      },
      {
        key: 'what_is_dahabiya_image',
        title: 'What is Dahabiya - Image',
        content: '/images/what-is-dahabiya.jpg',
        contentType: 'IMAGE',
        page: 'homepage',
        section: 'what_is_dahabiya',
        order: 12
      },

      // Why Choose Dahabiya Section
      {
        key: 'why_choose_dahabiya_title',
        title: 'Why Choose Dahabiya - Title',
        content: 'Why is Dahabiya different?',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'why_choose_dahabiya',
        order: 20
      },
      {
        key: 'why_choose_dahabiya_content',
        title: 'Why Choose Dahabiya - Content',
        content: 'Unlike crowded cruise ships with hundreds of passengers, a Dahabiya offers an exclusive and personalized experience. You\'ll enjoy the gentle rhythm of sailing, stop at hidden gems inaccessible to larger vessels, and experience the Nile as ancient travelers once did. Every moment is tailored to create unforgettable memories in an atmosphere of refined elegance.',
        contentType: 'TEXTAREA',
        page: 'homepage',
        section: 'why_choose_dahabiya',
        order: 21
      },
      {
        key: 'why_choose_dahabiya_image',
        title: 'Why Choose Dahabiya - Image',
        content: '/images/why-choose-dahabiya.jpg',
        contentType: 'IMAGE',
        page: 'homepage',
        section: 'why_choose_dahabiya',
        order: 22
      },

      // Share Memories Section
      {
        key: 'share_memories_title',
        title: 'Share Memories - Title',
        content: 'Share Your Memories',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'share_memories',
        order: 30
      },
      {
        key: 'share_memories_content',
        title: 'Share Memories - Content',
        content: 'Your journey with us doesn\'t end when you disembark. We believe that the memories created during your Dahabiya experience are meant to be shared and cherished forever. Join our community of travelers who have fallen in love with the magic of the Nile.',
        contentType: 'TEXTAREA',
        page: 'homepage',
        section: 'share_memories',
        order: 31
      },
      {
        key: 'share_memories_image_1',
        title: 'Share Memories - Image 1',
        content: '/images/guest-memories-1.jpg',
        contentType: 'IMAGE',
        page: 'homepage',
        section: 'share_memories',
        order: 32
      },
      {
        key: 'share_memories_image_2',
        title: 'Share Memories - Image 2',
        content: '/images/guest-memories-2.jpg',
        contentType: 'IMAGE',
        page: 'homepage',
        section: 'share_memories',
        order: 33
      },
      {
        key: 'share_memories_image_3',
        title: 'Share Memories - Image 3',
        content: '/images/guest-memories-3.jpg',
        contentType: 'IMAGE',
        page: 'homepage',
        section: 'share_memories',
        order: 34
      },

      // Our Story Section
      {
        key: 'our_story_title',
        title: 'Our Story - Title',
        content: 'Our Story',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'our_story',
        order: 40
      },
      {
        key: 'our_story_content',
        title: 'Our Story - Content',
        content: 'Our journey began over 30 years ago when Captain Ahmed Hassan, a third-generation Nile navigator, had a vision to revive the authentic way of exploring Egypt\'s ancient wonders. Growing up along the banks of the Nile, he witnessed the transformation of river travel and felt called to preserve the traditional Dahabiya experience.',
        contentType: 'TEXTAREA',
        page: 'homepage',
        section: 'our_story',
        order: 41
      },
      {
        key: 'our_story_paragraph_2',
        title: 'Our Story - Paragraph 2',
        content: 'What started as a single restored Dahabiya has grown into a fleet of carefully maintained traditional vessels, each one a floating piece of Egyptian heritage. We work closely with local communities, ensuring that tourism benefits the people who call the Nile home.',
        contentType: 'TEXTAREA',
        page: 'homepage',
        section: 'our_story',
        order: 42
      },
      {
        key: 'our_story_paragraph_3',
        title: 'Our Story - Paragraph 3',
        content: 'Today, we continue to honor the ancient traditions while providing modern comfort and safety. Every journey is a testament to our commitment to authentic Egyptian hospitality and our deep respect for the mighty Nile River.',
        contentType: 'TEXTAREA',
        page: 'homepage',
        section: 'our_story',
        order: 43
      },
      {
        key: 'founder_name',
        title: 'Founder Name',
        content: 'Ashraf El-Masry',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'our_story',
        order: 44
      },
      {
        key: 'founder_title',
        title: 'Founder Title',
        content: 'Founder & CEO',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'our_story',
        order: 45
      },
      {
        key: 'founder_quote',
        title: 'Founder Quote',
        content: '"Preserving the ancient art of Nile navigation for future generations"',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'our_story',
        order: 46
      },
      {
        key: 'founder_image',
        title: 'Founder Image',
        content: '/images/ashraf-elmasry.jpg',
        contentType: 'IMAGE',
        page: 'homepage',
        section: 'our_story',
        order: 47
      },

      // Blog Section
      {
        key: 'blog_section_title',
        title: 'Blog Section - Title',
        content: 'Stories from the Nile',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'blog',
        order: 50
      },
      {
        key: 'blog_section_subtitle',
        title: 'Blog Section - Subtitle',
        content: 'Discover the magic of Egypt through the eyes of our travelers and guides',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'blog',
        order: 51
      },
      {
        key: 'blog_view_all_text',
        title: 'Blog View All Text',
        content: 'Read All Stories',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'blog',
        order: 52
      },

      // Safety Section
      {
        key: 'safety_title',
        title: 'Safety Section - Title',
        content: 'Your Safety is Our Priority',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'safety',
        order: 60
      },
      {
        key: 'safety_subtitle',
        title: 'Safety Section - Subtitle',
        content: 'All our Dahabiyas are certified and regularly inspected to ensure the highest safety standards',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'safety',
        order: 61
      },

      // Call to Action Section
      {
        key: 'cta_title',
        title: 'CTA - Title',
        content: 'Ready to Begin Your Journey?',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'cta',
        order: 70
      },
      {
        key: 'cta_description',
        title: 'CTA - Description',
        content: 'Contact us today to start planning your unforgettable Dahabiya adventure on the Nile',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'cta',
        order: 71
      },
      {
        key: 'cta_book_text',
        title: 'CTA - Book Button Text',
        content: 'Book Your Journey',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'cta',
        order: 72
      },
      {
        key: 'cta_contact_text',
        title: 'CTA - Contact Button Text',
        content: 'Contact Us',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'cta',
        order: 73
      },

      // Common Text Elements
      {
        key: 'read_more_text',
        title: 'Read More Text',
        content: 'Read More',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'common',
        order: 80
      },
      {
        key: 'read_less_text',
        title: 'Read Less Text',
        content: 'Read Less',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'common',
        order: 81
      },

      // SCHEDULE AND RATES PAGE CONTENT
      {
        key: 'schedule_hero_title',
        title: 'Schedule Hero Title',
        content: 'Schedule & Rates',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'hero',
        order: 1
      },
      {
        key: 'schedule_hero_subtitle',
        title: 'Schedule Hero Subtitle',
        content: 'Plan your sacred Nile journey with our current sailing schedule and transparent rates.',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'hero',
        order: 2
      },
      {
        key: 'schedule_hero_image',
        title: 'Schedule Hero Background Image',
        content: '/images/hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'schedule-and-rates',
        section: 'hero',
        order: 3
      },
      {
        key: 'schedule_hero_video',
        title: 'Schedule Hero Background Video',
        content: '',
        contentType: 'VIDEO',
        page: 'schedule-and-rates',
        section: 'hero',
        order: 4
      },
      {
        key: 'schedule_table_json',
        title: 'Schedule Table Data',
        content: JSON.stringify([
          {
            itinerary: 'Luxor → Aswan',
            nights: 4,
            departureDay: 'Monday',
            route: 'Luxor → Esna → Edfu → Kom Ombo → Aswan',
            season: 'High Season',
            dates: 'Oct–Apr (weekly departures)'
          },
          {
            itinerary: 'Aswan → Luxor',
            nights: 3,
            departureDay: 'Friday',
            route: 'Aswan → Kom Ombo → Edfu → Esna → Luxor',
            season: 'High Season',
            dates: 'Oct–Apr (weekly departures)'
          }
        ], null, 2),
        contentType: 'TABLE',
        page: 'schedule-and-rates',
        section: 'schedule',
        order: 10
      },
      {
        key: 'rates_table_json',
        title: 'Rates Table Data',
        content: JSON.stringify([
          {
            itinerary: 'Luxor → Aswan',
            nights: 4,
            cabinType: 'Standard Cabin (per person twin share)',
            season: 'High',
            pricePerPerson: 'USD 1,350',
            inclusions: ['Full board meals', 'Sightseeing with guide', 'All taxes']
          },
          {
            itinerary: 'Aswan → Luxor',
            nights: 3,
            cabinType: 'Standard Cabin (per person twin share)',
            season: 'High',
            pricePerPerson: 'USD 1,050',
            inclusions: ['Full board meals', 'Sightseeing with guide', 'All taxes']
          }
        ], null, 2),
        contentType: 'TABLE',
        page: 'schedule-and-rates',
        section: 'rates',
        order: 20
      },
      {
        key: 'schedule_intro_title',
        title: 'Schedule Intro Title',
        content: 'Royal Fleet Schedule𓊪',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'intro',
        order: 1
      },
      {
        key: 'schedule_intro_text',
        title: 'Schedule Intro Text',
        content: 'We offer weekly departures with thoughtfully curated itineraries between Luxor and Aswan. Explore the schedule and current rates below.',
        contentType: 'TEXTAREA',
        page: 'schedule-and-rates',
        section: 'intro',
        order: 2
      },
      {
        key: 'schedule_table_title',
        title: 'Schedule Table Title',
        content: 'Royal Fleet Schedule𓊪',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'schedule',
        order: 11
      },
      {
        key: 'rates_section_title',
        title: 'Rates Section Title',
        content: 'Rates & Inclusions',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'rates',
        order: 21
      },
      {
        key: 'rates_table_title',
        title: 'Rates Table Title',
        content: 'Current Cruise Rates (Per Person)',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'rates',
        order: 22
      },
      {
        key: 'rates_notes_text',
        title: 'Rates Notes Text',
        content: 'All rates are per person based on twin share accommodation. Single supplement applies. Rates subject to change based on availability and season.',
        contentType: 'TEXTAREA',
        page: 'schedule-and-rates',
        section: 'rates',
        order: 23
      },
      {
        key: 'schedule_cta_primary',
        title: 'Schedule CTA Primary Button',
        content: 'Check Availability',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'hero',
        order: 5
      },
      {
        key: 'schedule_cta_secondary',
        title: 'Schedule CTA Secondary Button',
        content: 'Contact Our Experts',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'hero',
        order: 6
      },
      {
        key: 'schedule_rates_cta_text',
        title: 'Schedule Rates CTA Text',
        content: 'Ready to embark on a royal journey? Check availability or ask our Egypt experts for tailored advice.',
        contentType: 'TEXTAREA',
        page: 'schedule-and-rates',
        section: 'cta',
        order: 1
      },
      {
        key: 'schedule_rates_cta_primary',
        title: 'Schedule Rates CTA Primary',
        content: 'Book Your Dates',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'cta',
        order: 2
      },
      {
        key: 'schedule_rates_cta_secondary',
        title: 'Schedule Rates CTA Secondary',
        content: 'Request a Custom Quote',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'cta',
        order: 3
      },

      // CONTACT PAGE HERO VIDEO CONTENT
      {
        key: 'contact_hero_video',
        title: 'Contact Hero Background Video',
        content: '/videos/contact-hero.mp4',
        contentType: 'VIDEO',
        page: 'contact',
        section: 'hero',
        order: 1
      },
      {
        key: 'contact_hero_image',
        title: 'Contact Hero Background Image',
        content: '/images/contact-hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'contact',
        section: 'hero',
        order: 2
      },

      // SCHEDULE PAGE HERO VIDEO CONTENT
      {
        key: 'schedule_hero_video',
        title: 'Schedule Hero Background Video',
        content: '/videos/schedule-hero.mp4',
        contentType: 'VIDEO',
        page: 'schedule-and-rates',
        section: 'hero',
        order: 1
      },
      {
        key: 'schedule_hero_image',
        title: 'Schedule Hero Background Image',
        content: '/images/schedule-hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'schedule-and-rates',
        section: 'hero',
        order: 2
      },

      // ITINERARIES PAGE HERO VIDEO CONTENT
      {
        key: 'itineraries_hero_video',
        title: 'Itineraries Hero Background Video',
        content: '/videos/itineraries-hero.mp4',
        contentType: 'VIDEO',
        page: 'itineraries',
        section: 'hero',
        order: 1
      },
      {
        key: 'itineraries_hero_image',
        title: 'Itineraries Hero Background Image',
        content: '/images/itineraries-hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'itineraries',
        section: 'hero',
        order: 2
      },

      // PACKAGES PAGE HERO VIDEO CONTENT
      {
        key: 'packages_hero_video',
        title: 'Packages Hero Background Video',
        content: '/videos/packages-hero.mp4',
        contentType: 'VIDEO',
        page: 'packages',
        section: 'hero',
        order: 1
      },
      {
        key: 'packages_hero_image',
        title: 'Packages Hero Background Image',
        content: '/images/packages-hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'packages',
        section: 'hero',
        order: 2
      },

      // BLOGS PAGE HERO VIDEO CONTENT
      {
        key: 'blogs_hero_video',
        title: 'Blogs Hero Background Video',
        content: '/videos/blogs-hero.mp4',
        contentType: 'VIDEO',
        page: 'blogs',
        section: 'hero',
        order: 1
      },
      {
        key: 'blogs_hero_image',
        title: 'Blogs Hero Background Image',
        content: '/images/blogs-hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'blogs',
        section: 'hero',
        order: 2
      },

      // ABOUT PAGE HERO VIDEO CONTENT
      {
        key: 'about_hero_video',
        title: 'About Hero Background Video',
        content: '/videos/about-hero.mp4',
        contentType: 'VIDEO',
        page: 'about',
        section: 'hero',
        order: 1
      },
      {
        key: 'about_hero_image',
        title: 'About Hero Background Image',
        content: '/images/about-hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'about',
        section: 'hero',
        order: 2
      },
      {
        key: 'homepage_hero_video',
        title: 'Homepage Hero Background Video',
        content: '',
        contentType: 'VIDEO',
        page: 'homepage',
        section: 'hero',
        order: 5
      },
      {
        key: 'homepage_cta_primary',
        title: 'Homepage Primary CTA',
        content: 'Explore Our Cruises',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'hero',
        order: 6
      },
      {
        key: 'homepage_cta_secondary',
        title: 'Homepage Secondary CTA',
        content: 'View Itineraries',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'hero',
        order: 7
      },
      {
        key: 'homepage_features_title',
        title: 'Features Section Title',
        content: 'Why Choose Our Dahabiya Cruises',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'features',
        order: 1
      },
      {
        key: 'homepage_features_subtitle',
        title: 'Features Section Subtitle',
        content: 'Experience the difference of authentic luxury travel',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'features',
        order: 2
      },
      {
        key: 'homepage_testimonials_title',
        title: 'Testimonials Section Title',
        content: 'What Our Guests Say',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'testimonials',
        order: 1
      },
      {
        key: 'homepage_about_title',
        title: 'About Section Title',
        content: 'Discover Ancient Egypt',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'about',
        order: 1
      },
      {
        key: 'homepage_about_description',
        title: 'About Section Description',
        content: 'For over a decade, we have been crafting exceptional Nile cruise experiences aboard traditional dahabiyas. Our passion for Egypt\'s rich history and commitment to authentic hospitality ensures every journey is truly unforgettable.',
        contentType: 'TEXTAREA',
        page: 'homepage',
        section: 'about',
        order: 2
      },

      // CONTACT PAGE CONTENT
      {
        key: 'contact_hero_title',
        title: 'Contact Hero Title',
        content: 'Contact Our Egypt Experts',
        contentType: 'TEXT',
        page: 'contact',
        section: 'hero',
        order: 1
      },
      {
        key: 'contact_hero_subtitle',
        title: 'Contact Hero Subtitle',
        content: 'Ready to embark on your Egyptian adventure? Our expert team is here to help you plan the perfect Nile cruise experience.',
        contentType: 'TEXTAREA',
        page: 'contact',
        section: 'hero',
        order: 2
      },
      {
        key: 'contact_hero_image',
        title: 'Contact Hero Background Image',
        content: '/images/hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'contact',
        section: 'hero',
        order: 3
      },
      {
        key: 'contact_info_title',
        title: 'Contact Information Title',
        content: 'Get in Touch',
        contentType: 'TEXT',
        page: 'contact',
        section: 'info',
        order: 1
      },
      {
        key: 'contact_phone',
        title: 'Contact Phone',
        content: '+20 123 456 7890',
        contentType: 'TEXT',
        page: 'contact',
        section: 'info',
        order: 2
      },
      {
        key: 'contact_email',
        title: 'Contact Email',
        content: 'info@cleopatradahabiyat.com',
        contentType: 'TEXT',
        page: 'contact',
        section: 'info',
        order: 3
      },
      {
        key: 'contact_address',
        title: 'Contact Address',
        content: 'Luxor, Egypt',
        contentType: 'TEXT',
        page: 'contact',
        section: 'info',
        order: 4
      },
      {
        key: 'contact_social_title',
        title: 'Social Media Section Title',
        content: 'Connect with Us Across All Platforms',
        contentType: 'TEXT',
        page: 'contact',
        section: 'social',
        order: 1
      },
      {
        key: 'contact_facebook',
        title: 'Facebook Handle',
        content: 'CleopatraDahabiyat',
        contentType: 'TEXT',
        page: 'contact',
        section: 'social',
        order: 2
      },
      {
        key: 'contact_instagram',
        title: 'Instagram Handle',
        content: '@cleopatra_dahabiyat',
        contentType: 'TEXT',
        page: 'contact',
        section: 'social',
        order: 3
      },
      {
        key: 'contact_whatsapp',
        title: 'WhatsApp Number',
        content: '+20 123 456 7890',
        contentType: 'TEXT',
        page: 'contact',
        section: 'social',
        order: 4
      },

      // ABOUT PAGE CONTENT
      {
        key: 'about_hero_title',
        title: 'About Hero Title',
        content: 'About Cleopatra Dahabiyat',
        contentType: 'TEXT',
        page: 'about',
        section: 'hero',
        order: 1
      },
      {
        key: 'about_hero_subtitle',
        title: 'About Hero Subtitle',
        content: 'Crafting Authentic Nile Experiences Since 2010',
        contentType: 'TEXT',
        page: 'about',
        section: 'hero',
        order: 2
      },
      {
        key: 'about_hero_description',
        title: 'About Hero Description',
        content: 'We are passionate about sharing the timeless beauty and rich history of Egypt through authentic dahabiya cruises. Our commitment to excellence and cultural authenticity has made us a trusted name in luxury Nile travel.',
        contentType: 'TEXTAREA',
        page: 'about',
        section: 'hero',
        order: 3
      },
      {
        key: 'about_mission_title',
        title: 'Mission Title',
        content: 'Our Mission',
        contentType: 'TEXT',
        page: 'about',
        section: 'mission',
        order: 1
      },
      {
        key: 'about_mission_description',
        title: 'Mission Description',
        content: 'To provide authentic, luxurious, and culturally immersive Nile cruise experiences that connect travelers with the ancient wonders and living heritage of Egypt.',
        contentType: 'TEXTAREA',
        page: 'about',
        section: 'mission',
        order: 2
      },
      {
        key: 'about_team_title',
        title: 'Team Section Title',
        content: 'Meet Our Expert Team',
        contentType: 'TEXT',
        page: 'about',
        section: 'team',
        order: 1
      },

      // DAHABIYAS PAGE CONTENT
      {
        key: 'dahabiyas_hero_title',
        title: 'Dahabiyas Hero Title',
        content: 'Traditional Dahabiyas',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'hero',
        order: 1
      },
      {
        key: 'dahabiyas_hero_subtitle',
        title: 'Dahabiyas Hero Subtitle',
        content: 'Sail the Nile in Authentic Traditional Boats',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'hero',
        order: 2
      },
      {
        key: 'dahabiyas_hero_description',
        title: 'Dahabiyas Hero Description',
        content: 'Experience the timeless beauty of the Nile aboard our carefully selected traditional dahabiyas. Each vessel combines authentic Egyptian craftsmanship with modern comfort, offering an intimate and luxurious journey through ancient Egypt.',
        contentType: 'TEXTAREA',
        page: 'dahabiyas',
        section: 'hero',
        order: 3
      },
      {
        key: 'dahabiyas_page_title',
        title: 'Dahabiyas Page Title',
        content: 'Our Fleet of Traditional Dahabiyas',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'main',
        order: 1
      },
      {
        key: 'dahabiyas_cta_packages_title',
        title: 'Dahabiyas CTA Packages Title',
        content: 'Explore Packages',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'cta',
        order: 1
      },
      {
        key: 'dahabiyas_cta_packages_subtitle',
        title: 'Dahabiyas CTA Packages Subtitle',
        content: 'Complete journey experiences',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'cta',
        order: 2
      },

      // PACKAGES PAGE CONTENT
      {
        key: 'packages_hero_title',
        title: 'Packages Hero Title',
        content: 'Luxury Nile Cruise Packages',
        contentType: 'TEXT',
        page: 'packages',
        section: 'hero',
        order: 1
      },
      {
        key: 'packages_hero_subtitle',
        title: 'Packages Hero Subtitle',
        content: 'Curated Experiences for Every Type of Traveler',
        contentType: 'TEXT',
        page: 'packages',
        section: 'hero',
        order: 2
      },
      {
        key: 'packages_hero_description',
        title: 'Packages Hero Description',
        content: 'Discover our carefully crafted cruise packages, each designed to offer you the perfect blend of adventure, culture, and luxury. From intimate journeys to grand expeditions, find the perfect way to explore ancient Egypt.',
        contentType: 'TEXTAREA',
        page: 'packages',
        section: 'hero',
        order: 3
      },
      {
        key: 'packages_featured_title',
        title: 'Featured Packages Title',
        content: 'Featured Packages',
        contentType: 'TEXT',
        page: 'packages',
        section: 'featured',
        order: 1
      },
      {
        key: 'packages_all_title',
        title: 'All Packages Title',
        content: 'All Available Packages',
        contentType: 'TEXT',
        page: 'packages',
        section: 'main',
        order: 1
      },

      // ITINERARIES PAGE CONTENT
      {
        key: 'itineraries_hero_title',
        title: 'Itineraries Hero Title',
        content: 'Discover Ancient Egypt',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'hero',
        order: 1
      },
      {
        key: 'itineraries_hero_subtitle',
        title: 'Itineraries Hero Subtitle',
        content: 'Journey Through Time on the Eternal Nile',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'hero',
        order: 2
      },
      {
        key: 'itineraries_hero_description',
        title: 'Itineraries Hero Description',
        content: 'Explore our carefully crafted itineraries that take you through 5000 years of Egyptian history. Each journey is designed to immerse you in the wonders of ancient civilization while enjoying modern luxury aboard our traditional dahabiyas.',
        contentType: 'TEXTAREA',
        page: 'itineraries',
        section: 'hero',
        order: 3
      },
      {
        key: 'itineraries_featured_title',
        title: 'Featured Itineraries Title',
        content: 'Popular Routes',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'featured',
        order: 1
      },
      {
        key: 'itineraries_all_title',
        title: 'All Itineraries Title',
        content: 'All Available Routes',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'main',
        order: 1
      },

      // BLOG PAGE CONTENT
      {
        key: 'blog_hero_title',
        title: 'Blog Hero Title',
        content: 'Stories from the Nile',
        contentType: 'TEXT',
        page: 'blog',
        section: 'hero',
        order: 1
      },
      {
        key: 'blog_hero_subtitle',
        title: 'Blog Hero Subtitle',
        content: 'Discover Egypt Through Our Eyes',
        contentType: 'TEXT',
        page: 'blog',
        section: 'hero',
        order: 2
      },
      {
        key: 'blog_hero_description',
        title: 'Blog Hero Description',
        content: 'Explore ancient mysteries, travel tips, cultural insights, and inspiring stories from fellow travelers who have experienced the magic of Egypt. Join us on a journey of discovery through words and images.',
        contentType: 'TEXTAREA',
        page: 'blog',
        section: 'hero',
        order: 3
      },
      {
        key: 'blog_featured_title',
        title: 'Featured Posts Title',
        content: 'Featured Stories',
        contentType: 'TEXT',
        page: 'blog',
        section: 'featured',
        order: 1
      },
      {
        key: 'blog_recent_title',
        title: 'Recent Posts Title',
        content: 'Latest Articles',
        contentType: 'TEXT',
        page: 'blog',
        section: 'recent',
        order: 1
      },
      {
        key: 'blog_categories_title',
        title: 'Categories Title',
        content: 'Explore by Category',
        contentType: 'TEXT',
        page: 'blog',
        section: 'categories',
        order: 1
      }
    ];

    let created = 0;
    let updated = 0;

    for (const content of pageContent) {
      try {
        const result = await prisma.websiteContent.upsert({
          where: { key: content.key },
          update: {
            title: content.title,
            content: content.content,
            contentType: content.contentType as 'TEXT' | 'TEXTAREA' | 'IMAGE' | 'VIDEO' | 'TABLE',
            page: content.page,
            section: content.section,
            order: content.order,
            isActive: true
          },
          create: {
            key: content.key,
            title: content.title,
            content: content.content,
            contentType: content.contentType as 'TEXT' | 'TEXTAREA' | 'IMAGE' | 'VIDEO' | 'TABLE',
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
        console.error(`❌ Failed to create ${content.key}:`, error);
      }
    }

    console.log(`\n📊 CONTENT POPULATION SUMMARY:`);
    console.log(`✅ Created: ${created} new content items`);
    console.log(`🔄 Updated: ${updated} existing content items`);
    console.log(`📄 Total processed: ${pageContent.length} items`);

    return NextResponse.json({
      success: true,
      message: 'Page content populated successfully',
      stats: {
        created,
        updated,
        total: pageContent.length
      }
    });

  } catch (error) {
    console.error('❌ Error populating page content:', error);
    return NextResponse.json(
      { error: 'Failed to populate page content' },
      { status: 500 }
    );
  }
}
