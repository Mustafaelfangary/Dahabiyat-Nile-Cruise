"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Save,
  RefreshCw,
  Home,
  Users,
  Phone,
  Package,
  FileText,
  Settings,
  Globe,
  Edit3,
  Trash2,
  Check,
  X,
  Image,
  Video,
  Upload,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import MediaLibrarySelector from '@/components/admin/MediaLibrarySelector';

interface ContentField {
  key: string;
  value: string;
  group: string;
  title?: string;
  description?: string;
  type?: string;
  contentType?: string;
}

interface WebsiteContentManagerProps {
  className?: string;
}

export function WebsiteContentManager({ className }: WebsiteContentManagerProps) {
  const [activeTab, setActiveTab] = useState('homepage');
  const [content, setContent] = useState<Record<string, ContentField[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [currentMediaField, setCurrentMediaField] = useState<string | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const contentSections = [
    { id: 'homepage', label: 'Homepage Content', icon: Home },
    { id: 'about', label: 'About Page', icon: Users },
    { id: 'contact', label: 'Contact Page', icon: Phone },
    { id: 'packages', label: 'Packages Page', icon: Package },
    { id: 'dahabiyas', label: 'Dahabiyas Page', icon: Package },
    { id: 'testimonials', label: 'Testimonials Page', icon: FileText },
    { id: 'tailor-made', label: 'Tailor-Made Page', icon: Wand2 },
    { id: 'footer', label: 'Footer & General', icon: Settings },
    { id: 'global_media', label: 'Global Media', icon: Globe }
  ];

  // Complete list of homepage content fields that are actually used
  const homepageContentFields = [
    // Hero Section
    { key: 'loading_text', title: 'Loading Text', value: 'Loading...', type: 'text', section: 'hero' },
    { key: 'hero_video_url', title: 'Hero Video URL', value: '/videos/home_hero_video.mp4', type: 'video', section: 'hero' },
    { key: 'hero_video_poster', title: 'Hero Video Poster', value: '/images/hero-video-poster.jpg', type: 'image', section: 'hero' },
    { key: 'hero_video_title', title: 'Hero Video Title', value: 'Experience the Magic of the Nile', type: 'text', section: 'hero' },
    { key: 'hero_video_subtitle', title: 'Hero Video Subtitle', value: 'Luxury Dahabiya Cruises Through Ancient Egypt', type: 'text', section: 'hero' },
    { key: 'hero_video_cta_text', title: 'Hero CTA Button Text', value: 'Explore Fleet', type: 'text', section: 'hero' },
    { key: 'hero_scroll_text', title: 'Hero Scroll Text', value: 'Scroll to explore', type: 'text', section: 'hero' },

    // Dahabiyat Section
    { key: 'dahabiyat_section_title', title: 'Dahabiyat Section Title', value: 'Our Luxury Dahabiyat Nile Cruise Fleet', type: 'text', section: 'dahabiyat' },
    { key: 'dahabiyat_section_subtitle', title: 'Dahabiyat Section Subtitle', value: 'Discover our collection of traditional sailing vessels, each offering a unique journey through Egypt\'s timeless landscapes', type: 'textarea', section: 'dahabiyat' },
    { key: 'guests_label', title: 'Guests Label', value: 'Guests', type: 'text', section: 'dahabiyat' },
    { key: 'view_details_text', title: 'View Details Button Text', value: 'View Details', type: 'text', section: 'dahabiyat' },
    { key: 'dahabiyat_view_all_text', title: 'View All Dahabiyat Button Text', value: 'View All Dahabiyat', type: 'text', section: 'dahabiyat' },

    // What is Dahabiya Section
    { key: 'what_is_dahabiya_title', title: 'What is Dahabiya Title', value: 'What is Dahabiya?', type: 'text', section: 'about' },
    { key: 'what_is_dahabiya_content', title: 'What is Dahabiya Content', value: 'A Dahabiya is a traditional Egyptian sailing boat that has been navigating the Nile River for centuries. These elegant vessels, with their distinctive lateen sails and shallow draft, were once the preferred mode of transport for Egyptian nobility and wealthy travelers exploring the ancient wonders along the Nile.', type: 'textarea', section: 'about' },
    { key: 'what_is_dahabiya_image_1', title: 'What is Dahabiya Image 1', value: '/images/dahabiya-sailing.jpg', type: 'image', section: 'about' },
    { key: 'what_is_dahabiya_image_2', title: 'What is Dahabiya Image 2', value: '/images/dahabiya-deck.jpg', type: 'image', section: 'about' },
    { key: 'what_is_dahabiya_image_3', title: 'What is Dahabiya Image 3', value: '/images/dahabiya-sunset.jpg', type: 'image', section: 'about' },

    // Packages Section
    { key: 'packages_section_title', title: 'Packages Section Title', value: 'Our Journey Packages', type: 'text', section: 'packages' },
    { key: 'packages_section_subtitle', title: 'Packages Section Subtitle', value: 'Choose from our carefully crafted packages, each designed to showcase the best of Egypt\'s ancient wonders and natural beauty', type: 'textarea', section: 'packages' },
    { key: 'days_label', title: 'Days Label', value: 'Days', type: 'text', section: 'packages' },
    { key: 'packages_view_all_text', title: 'View All Packages Button Text', value: 'View All Packages', type: 'text', section: 'packages' },

    // Why Different Section
    { key: 'why_different_title', title: 'Why Different Title', value: 'Why is Dahabiya different from regular Nile Cruises?', type: 'text', section: 'comparison' },
    { key: 'why_different_content', title: 'Why Different Content', value: 'While traditional Nile cruise ships can accommodate 200-400 passengers, Dahabiyas offer an intimate experience with only 8-12 guests. This fundamental difference creates a completely different travel experience that feels more like a private yacht charter than a commercial cruise.', type: 'textarea', section: 'comparison' },
    { key: 'why_different_image_1', title: 'Why Different Image 1', value: '/images/cruise-comparison-1.jpg', type: 'image', section: 'comparison' },
    { key: 'why_different_image_2', title: 'Why Different Image 2', value: '/images/cruise-comparison-2.jpg', type: 'image', section: 'comparison' },
    { key: 'why_different_image_3', title: 'Why Different Image 3', value: '/images/cruise-comparison-3.jpg', type: 'image', section: 'comparison' },

    // Share Memories Section
    { key: 'share_memories_title', title: 'Share Memories Title', value: 'Share your memories with us', type: 'text', section: 'memories' },
    { key: 'share_memories_content', title: 'Share Memories Content', value: 'Your journey with us doesn\'t end when you disembark. We believe that the memories created during your Dahabiya experience are meant to be shared and cherished forever. Join our community of travelers who have fallen in love with the magic of the Nile.', type: 'textarea', section: 'memories' },
    { key: 'share_memories_image_1', title: 'Share Memories Image 1', value: '/images/guest-memories-1.jpg', type: 'image', section: 'memories' },
    { key: 'share_memories_image_2', title: 'Share Memories Image 2', value: '/images/guest-memories-2.jpg', type: 'image', section: 'memories' },
    { key: 'share_memories_image_3', title: 'Share Memories Image 3', value: '/images/guest-memories-3.jpg', type: 'image', section: 'memories' },

    // Our Story Section
    { key: 'our_story_title', title: 'Our Story Title', value: 'Our Story', type: 'text', section: 'story' },
    { key: 'our_story_content', title: 'Our Story Content', value: 'Our journey began over 30 years ago when Captain Ahmed Hassan, a third-generation Nile navigator, had a vision to revive the authentic way of exploring Egypt\'s ancient wonders. Growing up along the banks of the Nile, he witnessed the transformation of river travel and felt called to preserve the traditional Dahabiya experience.', type: 'textarea', section: 'story' },
    { key: 'our_story_paragraph_2', title: 'Our Story Paragraph 2', value: '', type: 'textarea', section: 'story' },
    { key: 'our_story_paragraph_3', title: 'Our Story Paragraph 3', value: '', type: 'textarea', section: 'story' },
    { key: 'our_story_paragraph_4', title: 'Our Story Paragraph 4', value: '', type: 'textarea', section: 'story' },
    { key: 'founder_image', title: 'Founder Image', value: '/images/ashraf-elmasry.jpg', type: 'image', section: 'story' },
    { key: 'founder_name', title: 'Founder Name', value: 'Ashraf El-Masry', type: 'text', section: 'story' },
    { key: 'founder_title', title: 'Founder Title', value: 'Founder & CEO', type: 'text', section: 'story' },
    { key: 'founder_quote', title: 'Founder Quote', value: '"Preserving the ancient art of Nile navigation for future generations"', type: 'textarea', section: 'story' },

    // Safety Section
    { key: 'safety_title', title: 'Safety Title', value: 'Your Safety is Our Priority', type: 'text', section: 'safety' },
    { key: 'safety_subtitle', title: 'Safety Subtitle', value: 'All our Dahabiyas are certified and regularly inspected to ensure the highest safety standards', type: 'textarea', section: 'safety' },

    // Call to Action Section
    { key: 'cta_title', title: 'CTA Title', value: 'Ready to Begin Your Journey?', type: 'text', section: 'cta' },
    { key: 'cta_description', title: 'CTA Description', value: 'Contact us today to start planning your unforgettable Dahabiya adventure on the Nile', type: 'textarea', section: 'cta' },
    { key: 'cta_book_text', title: 'CTA Book Button Text', value: 'Book Your Journey', type: 'text', section: 'cta' },
    { key: 'cta_contact_text', title: 'CTA Contact Button Text', value: 'Contact Us', type: 'text', section: 'cta' },

    // Common Text
    { key: 'read_more_text', title: 'Read More Text', value: 'Read More', type: 'text', section: 'common' },
    { key: 'read_less_text', title: 'Read Less Text', value: 'Read Less', type: 'text', section: 'common' },
  ];

  // About page content fields that match the actual about page
  const aboutContentFields = [
    // Loading
    { key: 'about_loading_text', title: 'About Loading Text', value: '𓈖 Loading About Portal... 𓊪', type: 'text', section: 'loading' },

    // Hero Section
    { key: 'about_egypt_label', title: 'Egypt Label', value: 'Egypt', type: 'text', section: 'hero' },
    { key: 'about_hero_title', title: 'About Hero Title', value: 'About Cleopatra Dahabiyat', type: 'text', section: 'hero' },
    { key: 'about_hero_subtitle', title: 'About Hero Subtitle', value: 'Discover the story behind Egypt\'s premier Dahabiya cruise experience', type: 'textarea', section: 'hero' },
    { key: 'about_hero_description', title: 'About Hero Description', value: 'For over three decades, we have been crafting unforgettable journeys along the sacred Nile River, combining authentic Egyptian hospitality with luxury comfort.', type: 'textarea', section: 'hero' },

    // Our Story Section
    { key: 'about_our_story_section_title', title: 'Our Story Section Title', value: 'Our Story', type: 'text', section: 'story' },
    { key: 'about_story', title: 'About Story', value: 'We are dedicated to providing authentic Egyptian experiences through our traditional Dahabiya cruises that connect you with the timeless beauty of the Nile River.', type: 'textarea', section: 'story' },
    { key: 'about_mission_title', title: 'Mission Title', value: 'Our Mission', type: 'text', section: 'story' },
    { key: 'about_mission', title: 'Our Mission', value: 'To provide authentic, luxury Nile experiences that honor Egypt\'s ancient heritage while delivering modern comfort and exceptional service.', type: 'textarea', section: 'story' },
    { key: 'about_vision_title', title: 'Vision Title', value: 'Our Vision', type: 'text', section: 'story' },
    { key: 'about_vision', title: 'Our Vision', value: 'To be the leading provider of authentic Dahabiya experiences, preserving Egypt\'s maritime heritage for future generations.', type: 'textarea', section: 'story' },
    { key: 'about_story_image', title: 'Story Image', value: '/images/about/our-story.jpg', type: 'image', section: 'story' },

    // Company Stats
    { key: 'about_stat_guests', title: 'Guests Stat', value: '10,000+', type: 'text', section: 'stats' },
    { key: 'about_stat_guests_label', title: 'Guests Stat Label', value: 'Happy Guests', type: 'text', section: 'stats' },
    { key: 'about_stat_years', title: 'Years Stat', value: '15+', type: 'text', section: 'stats' },
    { key: 'about_stat_years_label', title: 'Years Stat Label', value: 'Years Experience', type: 'text', section: 'stats' },
    { key: 'about_stat_safety', title: 'Safety Stat', value: '100%', type: 'text', section: 'stats' },
    { key: 'about_stat_safety_label', title: 'Safety Stat Label', value: 'Safety Record', type: 'text', section: 'stats' },
    { key: 'about_stat_destinations', title: 'Destinations Stat', value: '25+', type: 'text', section: 'stats' },
    { key: 'about_stat_destinations_label', title: 'Destinations Stat Label', value: 'Destinations', type: 'text', section: 'stats' },

    // Team Section
    { key: 'about_team_title', title: 'Team Section Title', value: 'Meet Our Team', type: 'text', section: 'team' },
    { key: 'about_team_subtitle', title: 'Team Section Subtitle', value: 'The passionate people behind your unforgettable journey', type: 'text', section: 'team' },

    // Values Section
    { key: 'about_values_title', title: 'Values Section Title', value: 'Our Values', type: 'text', section: 'values' },
    { key: 'about_values_subtitle', title: 'Values Section Subtitle', value: 'The principles that guide everything we do', type: 'text', section: 'values' },

    // CTA Section
    { key: 'about_cta_title', title: 'CTA Title', value: 'Ready to Begin Your Journey?', type: 'text', section: 'cta' },
    { key: 'about_cta_subtitle', title: 'CTA Subtitle', value: 'Let us create an unforgettable Nile experience tailored just for you.', type: 'text', section: 'cta' },
    { key: 'about_cta_primary_text', title: 'CTA Primary Button', value: 'Book Your Journey', type: 'text', section: 'cta' },
    { key: 'about_cta_secondary_text', title: 'CTA Secondary Button', value: 'View Our Packages', type: 'text', section: 'cta' },
  ];

  // Footer content fields that are actually used
  const footerContentFields = [
    // Footer Loading
    { key: 'footer_loading_text', title: 'Footer Loading Text', value: 'Loading Royal Footer...', type: 'text', section: 'loading' },

    // Footer Main Content
    { key: 'footer-title', title: 'Footer Title', value: 'Cleopatra Dahabiyat', type: 'text', section: 'main' },
    { key: 'footer-description', title: 'Footer Description', value: 'Experience the magic of the Nile with our luxury dahabiya cruises. Authentic Egyptian hospitality meets modern comfort.', type: 'textarea', section: 'main' },

    // Quick Links
    { key: 'footer_quick_links_title', title: 'Quick Links Title', value: 'Quick Links', type: 'text', section: 'navigation' },
    { key: 'footer-link-home', title: 'Home Link Text', value: 'Home', type: 'text', section: 'navigation' },
    { key: 'footer-link-dahabiyat', title: 'Dahabiyas Link Text', value: 'Dahabiyas', type: 'text', section: 'navigation' },
    { key: 'footer-link-packages', title: 'Packages Link Text', value: 'Packages', type: 'text', section: 'navigation' },
    { key: 'footer-link-about', title: 'About Link Text', value: 'About', type: 'text', section: 'navigation' },
    { key: 'footer-link-contact', title: 'Contact Link Text', value: 'Contact', type: 'text', section: 'navigation' },

    // Contact Information
    { key: 'footer-address', title: 'Footer Address', value: 'Luxor, Egypt', type: 'text', section: 'contact' },
    { key: 'footer-phone', title: 'Footer Phone', value: '+20 123 456 789', type: 'text', section: 'contact' },
    { key: 'footer-email', title: 'Footer Email', value: 'info@cleopatradadhabiyat.com', type: 'text', section: 'contact' },

    // Social Media
    { key: 'footer_follow_us_title', title: 'Follow Us Title', value: 'Follow Us', type: 'text', section: 'social' },
    { key: 'footer-facebook', title: 'Facebook URL', value: '#', type: 'text', section: 'social' },
    { key: 'footer-twitter', title: 'Twitter URL', value: '#', type: 'text', section: 'social' },
    { key: 'footer-instagram', title: 'Instagram URL', value: '#', type: 'text', section: 'social' },

    // Newsletter
    { key: 'footer_newsletter_title', title: 'Newsletter Title', value: 'Newsletter', type: 'text', section: 'newsletter' },
    { key: 'footer-newsletter-text', title: 'Newsletter Text', value: 'Subscribe to get updates on our latest offers and journeys.', type: 'textarea', section: 'newsletter' },
    { key: 'footer_subscribe_button_text', title: 'Subscribe Button Text', value: 'Subscribe', type: 'text', section: 'newsletter' },

    // Developer Section - Moved to dedicated Developer Settings page (/admin/developer-settings)
    // These settings are now managed separately to avoid duplication

    // Copyright
    { key: 'footer-company-name', title: 'Company Name', value: 'Cleopatra Dahabiyat', type: 'text', section: 'copyright' },
  ];

  useEffect(() => {
    loadContent();
  }, []);

  const cleanupDuplicates = async () => {
    try {
      const response = await fetch('/api/admin/cleanup-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast.success('Content duplicates cleaned up successfully!');
        loadContent(); // Reload content after cleanup
      } else {
        throw new Error('Failed to cleanup duplicates');
      }
    } catch (error) {
      console.error('Error cleaning up duplicates:', error);
      toast.error('Failed to cleanup duplicates');
    }
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      const contentData: Record<string, ContentField[]> = {};

      for (const section of contentSections) {
        try {
          console.log(`🔍 Loading content for section: ${section.id}`);

          // Load ONLY from websiteContent table (not settings)
          const response = await fetch(`/api/website-content?page=${section.id}&t=${Date.now()}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`📦 Raw data for ${section.id}:`, data);

            // Convert websiteContent format to ContentField format
            const fields = Array.isArray(data) ? data : [];
            contentData[section.id] = fields.map((item: any) => ({
              key: item.key,
              value: item.content || item.mediaUrl || '',
              group: item.page,
              title: item.title || item.key,
              type: item.contentType?.toLowerCase() || 'text',
              contentType: item.contentType || 'TEXT'
            }));

            console.log(`✅ Processed ${contentData[section.id].length} fields for ${section.id}`);
          } else {
            console.warn(`⚠️ Failed to load ${section.id}: ${response.status}`);
            contentData[section.id] = [];
          }
        } catch (error) {
          console.warn(`❌ Failed to load ${section.id} content:`, error);
          contentData[section.id] = [];
        }
      }

      console.log('📊 Final content data:', contentData);
      setContent(contentData);
    } catch (error) {
      console.error('❌ Error loading content:', error);
      toast.error('Failed to load website content');
    } finally {
      setLoading(false);
    }
  };

  // Removed getDefaultFields - content is now managed in database

  const saveField = async (sectionId: string, field: ContentField) => {
    const fieldKey = `${sectionId}_${field.key}`;
    setSaving(fieldKey);

    try {
      const isImageOrVideo = field.type === 'image' || field.type === 'video' || field.contentType === 'IMAGE' || field.contentType === 'VIDEO';

      const response = await fetch('/api/website-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: field.key,
          title: field.title,
          content: field.value, // Always store the value in content field for consistency
          mediaUrl: null, // Clear mediaUrl to avoid confusion
          contentType: field.contentType || (isImageOrVideo ? (field.type === 'video' ? 'VIDEO' : 'IMAGE') : 'TEXT'),
          page: sectionId,
          section: field.key.includes('founder') || field.key.includes('our_story') ? 'story' :
                   field.key.includes('hero') ? 'hero' :
                   field.key.includes('dahabiyas') ? 'dahabiyas' :
                   field.key.includes('itineraries') ? 'itineraries' :
                   field.key.includes('safety') ? 'safety' :
                   field.key.includes('featured') ? 'featured' :
                   field.key.includes('testimonials') ? 'testimonials' :
                   field.key.includes('packages') ? 'packages' :
                   'general'
        }),
      });

      if (response.ok) {
        toast.success('Content saved successfully! Changes should appear immediately on the website.');
        setEditingField(null);
        // Reload content to reflect changes
        await loadContent();

        // Aggressive cache invalidation
        const timestamp = Date.now().toString();
        localStorage.setItem('content-updated', timestamp);
        localStorage.setItem('content-version', timestamp);
        sessionStorage.setItem('content-updated', timestamp);

        // Dispatch multiple events for immediate updates
        window.dispatchEvent(new CustomEvent('content-updated', { detail: { timestamp } }));
        window.dispatchEvent(new CustomEvent('storage', {
          detail: { key: 'content-updated', newValue: timestamp }
        }));

        // Developer logo updates are now handled in the dedicated Developer Settings page

        // Force a page refresh for the homepage if we're updating homepage content
        if (field.key.includes('homepage') || sectionId === 'homepage') {
          // Notify all tabs/windows
          const bc = new BroadcastChannel('content-updates');
          bc.postMessage({ type: 'homepage-updated', timestamp });
          bc.close();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save failed:', response.status, errorData);
        throw new Error(errorData.error || `Failed to save (${response.status})`);
      }
    } catch (error) {
      console.error('Error saving field:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save content');
    } finally {
      setSaving(null);
    }
  };

  const updateFieldValue = (sectionId: string, fieldKey: string, newValue: string) => {
    console.log('🔄 UpdateField: Section:', sectionId, 'Key:', fieldKey, 'Value:', newValue);

    setContent(prev => {
      const updated = {
        ...prev,
        [sectionId]: prev[sectionId]?.map(field =>
          field.key === fieldKey ? { ...field, value: newValue } : field
        ) || []
      };

      console.log('🔄 UpdateField: Updated content for section:', sectionId, updated[sectionId]);
      return updated;
    });
  };

  const openMediaPicker = (sectionId: string, fieldKey: string) => {
    // Use a unique separator to avoid conflicts with underscores in field names
    setCurrentMediaField(`${sectionId}|||${fieldKey}`);
    setShowMediaPicker(true);
  };

  const populateHomepageContent = async () => {
    try {
      setSaving('homepage');
      toast.loading('Creating complete homepage content...');

      let successCount = 0;
      let errorCount = 0;

      for (const field of homepageContentFields) {
        try {
          const response = await fetch('/api/website-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: field.key,
              title: field.title,
              content: field.value,
              contentType: field.type.toUpperCase(),
              page: 'homepage',
              section: field.section,
              order: 0
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
            console.warn(`Failed to create ${field.key}:`, await response.text());
          }
        } catch (error) {
          errorCount++;
          console.error(`Error creating ${field.key}:`, error);
        }
      }

      await loadContent();

      if (errorCount === 0) {
        toast.success(`✅ Successfully created ${successCount} homepage content fields!`);
      } else {
        toast.warning(`⚠️ Created ${successCount} fields, ${errorCount} failed. Check console for details.`);
      }
    } catch (error) {
      console.error('Error creating homepage content:', error);
      toast.error('Failed to create homepage content');
    } finally {
      setSaving(null);
    }
  };

  const populateFooterContent = async () => {
    try {
      setSaving('footer');
      toast.loading('Creating complete footer content...');

      let successCount = 0;
      let errorCount = 0;

      for (const field of footerContentFields) {
        try {
          const response = await fetch('/api/website-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: field.key,
              title: field.title,
              content: field.value,
              contentType: field.type.toUpperCase(),
              page: 'footer',
              section: field.section,
              order: 0
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
            console.warn(`Failed to create ${field.key}:`, await response.text());
          }
        } catch (error) {
          errorCount++;
          console.error(`Error creating ${field.key}:`, error);
        }
      }

      await loadContent();

      if (errorCount === 0) {
        toast.success(`✅ Successfully created ${successCount} footer content fields!`);
      } else {
        toast.warning(`⚠️ Created ${successCount} fields, ${errorCount} failed. Check console for details.`);
      }
    } catch (error) {
      console.error('Error creating footer content:', error);
      toast.error('Failed to create footer content');
    } finally {
      setSaving(null);
    }
  };

  const populateAboutContent = async () => {
    try {
      setSaving('about');
      toast.loading('Creating complete about page content...');

      let successCount = 0;
      let errorCount = 0;

      for (const field of aboutContentFields) {
        try {
          const response = await fetch('/api/website-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: field.key,
              title: field.title,
              content: field.value,
              contentType: field.type.toUpperCase(),
              page: 'about',
              section: field.section,
              order: 0
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
            console.warn(`Failed to create ${field.key}:`, await response.text());
          }
        } catch (error) {
          errorCount++;
          console.error(`Error creating ${field.key}:`, error);
        }
      }

      await loadContent();

      if (errorCount === 0) {
        toast.success(`✅ Successfully created ${successCount} about page content fields!`);
      } else {
        toast.warning(`⚠️ Created ${successCount} fields, ${errorCount} failed. Check console for details.`);
      }
    } catch (error) {
      console.error('Error creating about content:', error);
      toast.error('Failed to create about content');
    } finally {
      setSaving(null);
    }
  };

  const handleAdvancedCleanup = async () => {
    if (!confirm('This will remove old duplicate content and create fresh homepage content. Continue?')) {
      return;
    }

    setIsCleaningUp(true);
    try {
      const response = await fetch('/api/admin/cleanup-content-advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Cleanup completed! Deleted ${result.summary.actions.deletedSettings} old settings, created ${result.summary.actions.createdContent} new content entries.`);

        // Reload content
        await loadContent();

        // Force page refresh to clear any cached content
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Cleanup failed');
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      toast.error(error instanceof Error ? error.message : 'Cleanup failed');
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleMediaSelect = (url: string) => {
    console.log('🎯 MediaSelect: URL selected:', url);
    console.log('🎯 MediaSelect: Current field:', currentMediaField);

    if (!currentMediaField) {
      console.log('❌ MediaSelect: No current media field');
      return;
    }

    // Split on the separator to handle field names that contain underscores
    const separatorIndex = currentMediaField.indexOf('|||');
    if (separatorIndex === -1) {
      console.log('❌ MediaSelect: Invalid field format');
      return;
    }

    const sectionId = currentMediaField.substring(0, separatorIndex);
    const fieldKey = currentMediaField.substring(separatorIndex + 3);

    console.log('🎯 MediaSelect: Section:', sectionId, 'Field:', fieldKey);
    console.log('🎯 MediaSelect: Updating field value to:', url);

    updateFieldValue(sectionId, fieldKey, url);
    setShowMediaPicker(false);
    setCurrentMediaField(null);

    console.log('✅ MediaSelect: Field updated and picker closed');
  };

  const renderContentField = (sectionId: string, field: ContentField) => {
    const fieldKey = `${sectionId}_${field.key}`;
    const isEditing = editingField === fieldKey;
    const isSaving = saving === fieldKey;
    const isImageField = field.type === 'image' || field.contentType === 'IMAGE' || field.key.includes('image');
    const isVideoField = field.type === 'video' || field.contentType === 'VIDEO' || field.key.includes('video');

    return (
      <Card key={field.key} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                {isImageField && <Image className="w-4 h-4 text-blue-600" />}
                {isVideoField && <Video className="w-4 h-4 text-purple-600" />}
                {field.title || field.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h4>
              {field.description && (
                <p className="text-sm text-gray-500">{field.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {(isImageField || isVideoField) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openMediaPicker(sectionId, field.key)}
                  disabled={isSaving}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              )}
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => saveField(sectionId, field)}
                    disabled={isSaving}
                  >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingField(null)}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingField(fieldKey)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Media Preview */}
          {(isImageField || isVideoField) && field.value && (
            <div className="mb-3">
              {isImageField ? (
                <img
                  src={field.value}
                  alt={field.title || field.key}
                  className="max-w-xs max-h-32 object-cover rounded border"
                />
              ) : (
                <video
                  src={field.value}
                  className="max-w-xs max-h-32 rounded border"
                  controls
                />
              )}
            </div>
          )}

          {isEditing ? (
            field.value && field.value.length > 100 ? (
              <Textarea
                value={field.value}
                onChange={(e) => updateFieldValue(sectionId, field.key, e.target.value)}
                className="min-h-[100px]"
                disabled={isSaving}
              />
            ) : (
              <Input
                value={field.value}
                onChange={(e) => updateFieldValue(sectionId, field.key, e.target.value)}
                disabled={isSaving}
              />
            )
          ) : (
            <div className="p-3 bg-gray-50 rounded border">
              <p className="text-sm text-gray-700">
                {field.value || <span className="text-gray-400 italic">No content set</span>}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading website content...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Content Manager</h1>
            <p className="text-gray-600">
              Manage all website content including pages, sections, and global settings.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={populateHomepageContent}
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={saving === 'homepage'}
            >
              {saving === 'homepage' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Home className="w-4 h-4 mr-2" />
              )}
              {saving === 'homepage' ? 'Creating...' : 'Create Homepage Content'}
            </Button>
            <Button
              onClick={populateFooterContent}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={saving === 'footer'}
            >
              {saving === 'footer' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Globe className="w-4 h-4 mr-2" />
              )}
              {saving === 'footer' ? 'Creating...' : 'Create Footer Content'}
            </Button>
            <Button
              onClick={populateAboutContent}
              className="bg-purple-600 text-white hover:bg-purple-700"
              disabled={saving === 'about'}
            >
              {saving === 'about' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Users className="w-4 h-4 mr-2" />
              )}
              {saving === 'about' ? 'Creating...' : 'Create About Content'}
            </Button>
            <Button
              onClick={handleAdvancedCleanup}
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
              disabled={isCleaningUp}
            >
              {isCleaningUp ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {isCleaningUp ? 'Cleaning...' : 'Fix Old Content'}
            </Button>
            <Button
              onClick={cleanupDuplicates}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Cleanup Duplicates
            </Button>
            <Button
              onClick={loadContent}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
          {contentSections.map((section) => {
            const Icon = section.icon;
            return (
              <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {contentSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="w-5 h-5" />
                  {section.label} Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {content[section.id]?.length > 0 ? (
                  <div className="space-y-4">
                    {content[section.id].map((field) => 
                      renderContentField(section.id, field)
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No content fields found for this section.</p>
                    <Button 
                      onClick={loadContent} 
                      variant="outline" 
                      className="mt-4"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Content
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Media Library Picker */}
      {showMediaPicker && (
        <MediaLibrarySelector
          onSelect={handleMediaSelect}
          onClose={() => {
            setShowMediaPicker(false);
            setCurrentMediaField(null);
          }}
          currentValue={
            currentMediaField
              ? (() => {
                  const separatorIndex = currentMediaField.indexOf('|||');
                  if (separatorIndex === -1) return '';
                  const sectionId = currentMediaField.substring(0, separatorIndex);
                  const fieldKey = currentMediaField.substring(separatorIndex + 3);
                  return content[sectionId]?.find(field => field.key === fieldKey)?.value || '';
                })()
              : ''
          }
          accept="image/*,video/*"
        />
      )}
    </div>
  );
}
