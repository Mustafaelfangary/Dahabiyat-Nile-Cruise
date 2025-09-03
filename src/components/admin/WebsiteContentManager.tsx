'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useContent } from '@/hooks/useContent';
import { Container } from '@/components/ui/container';
import { AnimatedSection } from '@/components/ui/animated-section';
import TableDataEditor from './TableDataEditor';
import EnhancedScheduleEditor from './EnhancedScheduleEditor';
import UniversalTableEditor from './UniversalTableEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import {
  Home, Users, Phone, Package, Settings, MapPin, FileText, Globe,
  Edit2, Save, X, RefreshCw, Image, Video, Type, Plus, Ship, Calendar, Table
} from 'lucide-react';
import ResponsiveMediaPicker from './ResponsiveMediaPicker';

// Visual Table Editor - No more JSON editing!

interface ContentField {
  key: string;
  title: string;
  content: string;
  contentType: string;
  section: string;
  page: string;
  order: number;
}

interface ContentSection {
  id: string;
  label: string;
  icon: React.ComponentType<Record<string, unknown>>;
}

export default function WebsiteContentManager() {
  const [content, setContent] = useState<Record<string, ContentField[]>>({});
  const [dynamicContent, setDynamicContent] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [addingItinerariesContent, setAddingItinerariesContent] = useState(false);
  const [addingSampleContent, setAddingSampleContent] = useState(false);
  const [populatingPageContent, setPopulatingPageContent] = useState(false);
  const [addingScheduleContent, setAddingScheduleContent] = useState(false);

  const contentSections: ContentSection[] = [
    { id: 'homepage', label: 'Homepage', icon: Home },
    { id: 'about', label: 'About Page', icon: Users },
    { id: 'contact', label: 'Contact Page', icon: Phone },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'dahabiyas', label: 'Dahabiyas', icon: Ship },
    { id: 'fleets', label: 'Fleets', icon: Ship },
    { id: 'itineraries', label: 'Itineraries', icon: MapPin },
    { id: 'schedule-and-rates', label: 'Schedule & Rates', icon: Calendar },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'branding_settings', label: 'Branding & Settings', icon: Settings }
  ];

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const contentData: Record<string, ContentField[]> = {};
      const dynamicData: Record<string, Record<string, unknown>> = {};

      // Load static content from WebsiteContent table
      for (const section of contentSections) {
        try {
          console.log(`🔍 Loading content for section: ${section.id}`);
          
          // For the unified branding_settings section, load from both global_media and footer pages
          const pagesToLoad = section.id === 'branding_settings' ? ['global_media', 'footer'] : [section.id];
          let allData: Record<string, unknown>[] = [];
          
          for (const pageId of pagesToLoad) {
            const response = await fetch(`/api/website-content?page=${pageId}&t=${Date.now()}`, {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });

            if (response.ok) {
              const data = await response.json();
              console.log(`📊 Raw data for ${pageId}:`, data.length, 'items');
              allData = [...allData, ...data];
            } else {
              console.error(`❌ Failed to load ${pageId}: ${response.status} ${response.statusText}`);
            }
          }

          // Transform WebsiteContent objects to ContentField format
          const transformedData = Array.isArray(allData) ? allData.map((item: Record<string, unknown>) => ({
            key: String(item.key || ''),
            title: String(item.title || item.key || ''),
            content: String(item.content || item.mediaUrl || ''),
            contentType: String(item.contentType || 'TEXT'),
            section: String(item.section || 'general'),
            page: section.id === 'branding_settings' ? 'branding_settings' : String(item.page || section.id),
            order: Number(item.order) || 0
          })) : [];

          console.log(`✅ Transformed data for ${section.id}:`, transformedData.length, 'items');
          contentData[section.id] = transformedData;
        } catch (error) {
          console.error(`❌ Error loading ${section.id} content:`, error);
          contentData[section.id] = [];
        }
      }

      // Load dynamic content from dedicated tables
      try {
        console.log('🔍 Loading dynamic content...');

        // Load blogs
        const blogsResponse = await fetch('/api/admin/blogs');
        if (blogsResponse.ok) {
          const blogs = await blogsResponse.json();
          dynamicData.blogs = blogs;
          console.log(`✅ Loaded ${blogs.length} blogs`);
        }

        // Load packages
        const packagesResponse = await fetch('/api/packages');
        if (packagesResponse.ok) {
          const packagesData = await packagesResponse.json();
          dynamicData.packages = packagesData.packages || [];
          console.log(`✅ Loaded ${dynamicData.packages?.length || 0} packages`);
        }

        // Load dahabiyas
        const dahabiyasResponse = await fetch('/api/dahabiyas');
        if (dahabiyasResponse.ok) {
          const dahabiyasData = await dahabiyasResponse.json();
          dynamicData.dahabiyas = dahabiyasData.dahabiyas || [];
          console.log(`✅ Loaded ${dynamicData.dahabiyas?.length || 0} dahabiyas`);
        }

        // Load itineraries
        const itinerariesResponse = await fetch('/api/itineraries');
        if (itinerariesResponse.ok) {
          const itinerariesData = await itinerariesResponse.json();
          dynamicData.itineraries = itinerariesData.itineraries || [];
          console.log(`✅ Loaded ${dynamicData.itineraries?.length || 0} itineraries`);
        }
      } catch (error) {
        console.error('❌ Error loading dynamic content:', error);
      }

      console.log('🎯 Final content data:', contentData);
      console.log('🎯 Final dynamic data:', dynamicData);
      setContent(contentData);
      setDynamicContent(dynamicData);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load website content');
    } finally {
      setLoading(false);
    }
  };

  const addItinerariesContent = async () => {
    setAddingItinerariesContent(true);
    try {
      const response = await fetch('/api/admin/add-itineraries-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Itineraries content added! Created: ${data.summary.created}, Updated: ${data.summary.updated}`);
        // Reload content to show the new itineraries tab
        await loadContent();
      } else {
        throw new Error(data.error || 'Failed to add content');
      }
    } catch (error) {
      console.error('Error adding itineraries content:', error);
      toast.error('Failed to add itineraries content');
    } finally {
      setAddingItinerariesContent(false);
    }
  };

  const addScheduleAndRatesContent = async () => {
    setAddingScheduleContent(true);
    try {
      const defaults = [
        { key: 'schedule_hero_title', title: 'Schedule Hero Title', content: 'Schedule & Rates', contentType: 'TEXT', page: 'schedule-and-rates', section: 'hero', order: 1 },
        { key: 'schedule_hero_subtitle', title: 'Schedule Hero Subtitle', content: 'Plan your sacred Nile journey with our current sailing schedule and transparent rates.', contentType: 'TEXTAREA', page: 'schedule-and-rates', section: 'hero', order: 2 },
        { key: 'schedule_hero_image', title: 'Schedule Hero Image', content: '/images/hero-bg.jpg', contentType: 'IMAGE', page: 'schedule-and-rates', section: 'hero', order: 3 },
        { key: 'schedule_cta_primary', title: 'Primary CTA', content: 'Check Availability', contentType: 'TEXT', page: 'schedule-and-rates', section: 'hero', order: 4 },
        { key: 'schedule_cta_secondary', title: 'Secondary CTA', content: 'Contact Our Experts', contentType: 'TEXT', page: 'schedule-and-rates', section: 'hero', order: 5 },

        { key: 'schedule_intro_title', title: 'Intro Title', content: 'Royal Fleet Schedule𓊪', contentType: 'TEXT', page: 'schedule-and-rates', section: 'intro', order: 1 },
        { key: 'schedule_intro_text', title: 'Intro Text', content: 'We offer weekly departures with thoughtfully curated itineraries between Luxor and Aswan. Explore the schedule and current rates below.', contentType: 'TEXTAREA', page: 'schedule-and-rates', section: 'intro', order: 2 },

        { key: 'schedule_table_title', title: 'Schedule Table Title', content: 'Royal Fleet Schedule𓊪', contentType: 'TEXT', page: 'schedule-and-rates', section: 'schedule', order: 1 },
        { key: 'schedule_table_json', title: 'Schedule Table JSON', content: JSON.stringify([
          { itinerary: 'Luxor → Aswan', nights: 4, departureDay: 'Monday', route: 'Luxor → Esna → Edfu → Kom Ombo → Aswan', season: 'High Season', dates: 'Oct–Apr (weekly departures)' },
          { itinerary: 'Aswan → Luxor', nights: 3, departureDay: 'Friday', route: 'Aswan → Kom Ombo → Edfu → Esna → Luxor', season: 'High Season', dates: 'Oct–Apr (weekly departures)' }
        ]), contentType: 'TEXTAREA', page: 'schedule-and-rates', section: 'schedule', order: 2 },

        { key: 'rates_section_title', title: 'Rates Section Title', content: 'Rates & Inclusions', contentType: 'TEXT', page: 'schedule-and-rates', section: 'rates', order: 1 },
        { key: 'rates_table_title', title: 'Rates Table Title', content: 'Current Cruise Rates (Per Person)', contentType: 'TEXT', page: 'schedule-and-rates', section: 'rates', order: 2 },
        { key: 'rates_table_json', title: 'Rates Table JSON', content: JSON.stringify([
          { itinerary: 'Luxor → Aswan', nights: 4, cabinType: 'Standard Cabin (per person twin share)', season: 'High', pricePerPerson: 'USD 1,350', inclusions: ['Full board meals', 'Sightseeing with guide', 'All taxes'] },
          { itinerary: 'Aswan → Luxor', nights: 3, cabinType: 'Standard Cabin (per person twin share)', season: 'High', pricePerPerson: 'USD 1,050', inclusions: ['Full board meals', 'Sightseeing with guide', 'All taxes'] }
        ]), contentType: 'TEXTAREA', page: 'schedule-and-rates', section: 'rates', order: 3 },
        { key: 'rates_notes_text', title: 'Rates Notes', content: 'Rates are per person based on twin share. Single supplement applies. Seasonal adjustments may occur.', contentType: 'TEXTAREA', page: 'schedule-and-rates', section: 'rates', order: 4 },

        { key: 'schedule_rates_cta_text', title: 'Footer CTA Text', content: 'Ready to embark on a royal journey? Check availability or ask our Egypt experts for tailored advice.', contentType: 'TEXTAREA', page: 'schedule-and-rates', section: 'cta', order: 1 },
        { key: 'schedule_rates_cta_primary', title: 'Footer CTA Primary', content: 'Book Your Dates', contentType: 'TEXT', page: 'schedule-and-rates', section: 'cta', order: 2 },
        { key: 'schedule_rates_cta_secondary', title: 'Footer CTA Secondary', content: 'Request a Custom Quote', contentType: 'TEXT', page: 'schedule-and-rates', section: 'cta', order: 3 },
      ];

      for (const item of defaults) {
        await fetch('/api/website-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }

      toast.success('Schedule & Rates default content added');
      await loadContent();
    } catch (error) {
      console.error('Error adding Schedule & Rates content:', error);
      toast.error('Failed to add Schedule & Rates content');
    } finally {
      setAddingScheduleContent(false);
    }
  };

  const addSampleContent = async () => {
    setAddingSampleContent(true);
    try {
      const response = await fetch('/api/admin/add-sample-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Sample content added! Created: ${data.summary.created}, Updated: ${data.summary.updated}`);
        // Reload content to show the new content
        await loadContent();
      } else {
        throw new Error(data.error || 'Failed to add sample content');
      }
    } catch (error) {
      console.error('Error adding sample content:', error);
      toast.error('Failed to add sample content');
    } finally {
      setAddingSampleContent(false);
    }
  };

  const populatePageContent = async () => {
    setPopulatingPageContent(true);
    try {
      const response = await fetch('/api/admin/populate-page-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Page content populated! Created: ${result.stats.created}, Updated: ${result.stats.updated}`);
        loadContent(); // Reload content
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to populate page content');
      }
    } catch (error) {
      console.error('Error populating page content:', error);
      toast.error('Failed to populate page content');
    } finally {
      setPopulatingPageContent(false);
    }
  };

  const addBrandingAndSettingsContent = async () => {
    try {
      // Unified branding, media, footer, and settings content
      const brandingSettingsContent = [
        // === BRANDING SECTION ===
        {
          key: 'site_logo',
          title: 'Site Logo',
          content: '/images/logo.png',
          contentType: 'IMAGE',
          page: 'branding_settings',
          section: 'branding',
          order: 1
        },
        {
          key: 'site_favicon',
          title: 'Site Favicon',
          content: '/favicon.ico',
          contentType: 'IMAGE',
          page: 'branding_settings',
          section: 'branding',
          order: 2
        },
        {
          key: 'navbar_logo',
          title: 'Navigation Bar Logo',
          content: '/images/logo.png',
          contentType: 'IMAGE',
          page: 'branding_settings',
          section: 'branding',
          order: 3
        },
        {
          key: 'footer_logo',
          title: 'Footer Logo',
          content: '/images/logo.png',
          contentType: 'IMAGE',
          page: 'branding_settings',
          section: 'branding',
          order: 4
        },
        {
          key: 'site_name',
          title: 'Website Name',
          content: 'Cleopatra Dahabiyat',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'branding',
          order: 5
        },
        {
          key: 'site_tagline',
          title: 'Website Tagline',
          content: 'Luxury Nile River Cruises',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'branding',
          order: 6
        },
        
        // === SEO SECTION ===
        {
          key: 'site_meta_title',
          title: 'Site Meta Title',
          content: 'Cleopatra Dahabiyat - Luxury Nile Cruises',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'seo',
          order: 1
        },
        {
          key: 'site_meta_description',
          title: 'Site Meta Description',
          content: 'Experience the magic of the Nile with our luxury dahabiya cruises. Authentic Egyptian hospitality meets modern comfort.',
          contentType: 'TEXTAREA',
          page: 'branding_settings',
          section: 'seo',
          order: 2
        },
        {
          key: 'social_og_image',
          title: 'Social Media Share Image',
          content: '/images/hero-bg.jpg',
          contentType: 'IMAGE',
          page: 'branding_settings',
          section: 'seo',
          order: 3
        },
        {
          key: 'site_keywords',
          title: 'SEO Keywords',
          content: 'nile cruise, dahabiya, luxury cruise, egypt, luxor, aswan',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'seo',
          order: 4
        },
        
        // === CONTACT INFORMATION SECTION ===
        {
          key: 'company_name',
          title: 'Company Name',
          content: 'Cleopatra Dahabiyat',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'contact',
          order: 1
        },
        {
          key: 'company_address',
          title: 'Company Address',
          content: 'Luxor, Egypt',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'contact',
          order: 2
        },
        {
          key: 'company_phone',
          title: 'Company Phone',
          content: '+20 123 456 789',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'contact',
          order: 3
        },
        {
          key: 'company_email',
          title: 'Company Email',
          content: 'info@cleopatradadhabiyat.com',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'contact',
          order: 4
        },
        {
          key: 'company_whatsapp',
          title: 'WhatsApp Number',
          content: '+20 123 456 789',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'contact',
          order: 5
        },
        
        // === SOCIAL MEDIA SECTION ===
        {
          key: 'social_facebook',
          title: 'Facebook URL',
          content: 'https://facebook.com/cleopatradadhabiyat',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'social',
          order: 1
        },
        {
          key: 'social_instagram',
          title: 'Instagram URL',
          content: 'https://instagram.com/cleopatradadhabiyat',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'social',
          order: 2
        },
        {
          key: 'social_twitter',
          title: 'Twitter/X URL',
          content: 'https://twitter.com/cleopatradadhabiyat',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'social',
          order: 3
        },
        {
          key: 'social_youtube',
          title: 'YouTube URL',
          content: 'https://youtube.com/@cleopatradadhabiyat',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'social',
          order: 4
        },
        {
          key: 'social_tiktok',
          title: 'TikTok URL',
          content: 'https://tiktok.com/@cleopatradadhabiyat',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'social',
          order: 5
        },
        
        // === FOOTER SECTION ===
        {
          key: 'footer_description',
          title: 'Footer Description',
          content: 'Experience the magic of the Nile with our luxury dahabiya cruises. Authentic Egyptian hospitality meets modern comfort.',
          contentType: 'TEXTAREA',
          page: 'branding_settings',
          section: 'footer',
          order: 1
        },
        {
          key: 'footer_copyright',
          title: 'Copyright Text',
          content: '© 2025 Cleopatra Dahabiyat. All rights reserved.',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'footer',
          order: 2
        },
        {
          key: 'footer_quick_links_title',
          title: 'Quick Links Section Title',
          content: 'Quick Links',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'footer',
          order: 3
        },
        {
          key: 'footer_newsletter_title',
          title: 'Newsletter Section Title',
          content: 'Newsletter',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'footer',
          order: 4
        },
        {
          key: 'footer_newsletter_text',
          title: 'Newsletter Description',
          content: 'Subscribe to get updates on our latest offers and journeys.',
          contentType: 'TEXTAREA',
          page: 'branding_settings',
          section: 'footer',
          order: 5
        },
        {
          key: 'footer_subscribe_button_text',
          title: 'Newsletter Subscribe Button',
          content: 'Subscribe',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'footer',
          order: 6
        },
        
        // === GENERAL SETTINGS SECTION ===
        {
          key: 'site_timezone',
          title: 'Website Timezone',
          content: 'Africa/Cairo',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'general',
          order: 1
        },
        {
          key: 'site_language',
          title: 'Default Language',
          content: 'en',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'general',
          order: 2
        },
        {
          key: 'site_currency',
          title: 'Default Currency',
          content: 'USD',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'general',
          order: 3
        },
        {
          key: 'booking_email',
          title: 'Booking Notification Email',
          content: 'bookings@cleopatradadhabiyat.com',
          contentType: 'TEXT',
          page: 'branding_settings',
          section: 'general',
          order: 4
        }
      ];

      for (const content of brandingSettingsContent) {
        await fetch('/api/website-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(content),
        });
      }

      toast.success('Branding & Settings content added successfully!');
      await loadContent();
    } catch (error) {
      console.error('Error adding branding & settings content:', error);
      toast.error('Failed to add branding & settings content');
    }
  };

  const saveField = async (field: ContentField) => {
    const fieldKey = `${field.page}_${field.key}`;
    setSaving(fieldKey);

    try {
      const response = await fetch('/api/website-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: field.key,
          title: field.title,
          content: editValue,
          contentType: field.contentType,
          page: field.page,
          section: field.section,
          order: field.order
        }),
      });

      if (response.ok) {
        toast.success('Content saved successfully!');
        setEditingField(null);
        await loadContent();
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving field:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(null);
    }
  };

  const startEditing = (field: ContentField) => {
    setEditingField(`${field.page}_${field.key}`);
    setEditValue(field.content);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const getFieldIcon = (contentType: string) => {
    switch (contentType.toUpperCase()) {
      case 'IMAGE': return <Image className="w-4 h-4 text-blue-600" />;
      case 'VIDEO': return <Video className="w-4 h-4 text-purple-600" />;
      case 'TEXTAREA': return <FileText className="w-4 h-4 text-green-600" />;
      case 'TABLE': return <Table className="w-4 h-4 text-orange-600" />;
      default: return <Type className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName.toLowerCase()) {
      case 'hero': return <Home className="w-5 h-5 text-blue-600" />;
      case 'branding': return <Image className="w-5 h-5 text-purple-600" />;
      case 'seo': return <Globe className="w-5 h-5 text-blue-600" />;
      case 'contact': case 'info': return <Phone className="w-5 h-5 text-green-600" />;
      case 'social': return <Users className="w-5 h-5 text-purple-600" />;
      case 'footer': return <Settings className="w-5 h-5 text-gray-600" />;
      case 'general': return <Settings className="w-5 h-5 text-orange-600" />;
      case 'features': return <Settings className="w-5 h-5 text-orange-600" />;
      case 'testimonials': return <Users className="w-5 h-5 text-yellow-600" />;
      case 'about': case 'our_story': return <FileText className="w-5 h-5 text-indigo-600" />;
      case 'blog': return <FileText className="w-5 h-5 text-green-600" />;
      case 'safety': return <Settings className="w-5 h-5 text-red-600" />;
      case 'cta': return <Plus className="w-5 h-5 text-emerald-600" />;
      default: return <Type className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMediaAcceptType = (contentType: string) => {
    switch (contentType.toUpperCase()) {
      case 'IMAGE': return 'image/*';
      case 'VIDEO': return 'video/*';
      default: return '*/*';
    }
  };

  const getMediaPlaceholder = (contentType: string) => {
    switch (contentType.toUpperCase()) {
      case 'IMAGE': return 'Select an image...';
      case 'VIDEO': return 'Select a video...';
      default: return 'Select media...';
    }
  };

  const getMediaHelperText = (contentType: string) => {
    switch (contentType.toUpperCase()) {
      case 'IMAGE': return 'Choose an image from the media library or upload a new one';
      case 'VIDEO': return 'Choose a video from the media library or upload a new one';
      default: return 'Choose media from the library or upload a new file';
    }
  };

  const renderField = (field: ContentField) => {
    const fieldKey = `${field.page}_${field.key}`;
    const isEditing = editingField === fieldKey;
    const isSaving = saving === fieldKey;

    return (
      <div key={fieldKey} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getFieldIcon(field.contentType)}
            <h4 className="font-medium text-gray-900">{field.title}</h4>
            <Badge
              variant="outline"
              className={`text-xs ${
                field.contentType === 'IMAGE' ? 'border-blue-300 text-blue-700 bg-blue-50' :
                field.contentType === 'VIDEO' ? 'border-purple-300 text-purple-700 bg-purple-50' :
                field.contentType === 'TEXTAREA' ? 'border-green-300 text-green-700 bg-green-50' :
                field.contentType === 'TABLE' ? 'border-orange-300 text-orange-700 bg-orange-50' :
                'border-gray-300 text-gray-700 bg-gray-50'
              }`}
            >
              {field.contentType}
            </Badge>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => startEditing(field)}
                disabled={isSaving}
                className="h-8 px-3"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
        <div>
          {isEditing ? (
            <div className="space-y-3">
              {field.contentType === 'TEXTAREA' ? (
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={4}
                  className="w-full"
                  placeholder={`Enter ${field.title.toLowerCase()}...`}
                />
              ) : field.contentType === 'TABLE' ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Table className="w-4 h-4" />
                      <span className="font-medium">Visual Table Editor</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      Use the visual editor below to manage your table data. No JSON editing required!
                    </p>
                    <div className="text-xs text-gray-600 mt-2">
                      Field: {field.key} | Type: {field.contentType} | Data length: {editValue ? JSON.parse(editValue || '[]').length : 0}
                    </div>
                  </div>
                  
                  {field.key.includes('schedule') ? (
                    <EnhancedScheduleEditor
                      contentKey={field.key}
                      title={field.title}
                      initialData={(() => {
                        try {
                          const parsed = JSON.parse(editValue || '[]');
                          return Array.isArray(parsed) ? parsed : [];
                        } catch {
                          return [];
                        }
                      })()}
                      onSave={async (data) => {
                        console.log('Schedule data being saved:', data);
                        setEditValue(JSON.stringify(data, null, 2));
                        await saveField(field);
                      }}
                    />
                  ) : (
                    <UniversalTableEditor
                      contentKey={field.key}
                      title={field.title}
                      initialData={(() => {
                        try {
                          const parsed = JSON.parse(editValue || '[]');
                          console.log('Parsed table data:', parsed);
                          return Array.isArray(parsed) ? parsed : [];
                        } catch (e) {
                          console.error('Error parsing table data:', e);
                          return [];
                        }
                      })()}
                      onSave={async (data) => {
                        console.log('Universal table data being saved:', data);
                        setEditValue(JSON.stringify(data, null, 2));
                        await saveField(field);
                      }}
                    />
                  )}
                </div>
              ) : (field.contentType === 'IMAGE' || field.contentType === 'VIDEO') ? (
                <ResponsiveMediaPicker
                  label={field.title}
                  value={editValue}
                  onChange={setEditValue}
                  accept={getMediaAcceptType(field.contentType)}
                  placeholder={getMediaPlaceholder(field.contentType)}
                  helperText={getMediaHelperText(field.contentType)}
                />
              ) : (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full"
                  placeholder={`Enter ${field.title.toLowerCase()}...`}
                />
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => saveField(field)}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSaving ? (
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3 mr-1" />
                  )}
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelEditing}
                  disabled={isSaving}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs text-gray-400 mb-2 font-mono">Key: {field.key}</div>
              <div className="bg-white p-3 rounded border">
                {field.content ? (
                  <div>
                    {field.contentType === 'IMAGE' && field.content ? (
                      <div className="space-y-2">
                        <div className="relative inline-block">
                          <img
                            src={field.content}
                            alt={field.title}
                            className="max-w-sm max-h-40 object-cover rounded-lg border shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 break-all font-mono bg-gray-100 p-2 rounded">
                          {field.content}
                        </div>
                      </div>
                    ) : field.contentType === 'VIDEO' && field.content ? (
                      <div className="space-y-2">
                        <div className="relative inline-block">
                          <video
                            src={field.content}
                            className="max-w-sm max-h-40 rounded-lg border shadow-sm"
                            controls
                            preload="metadata"
                          />
                        </div>
                        <div className="text-xs text-gray-500 break-all font-mono bg-gray-100 p-2 rounded">
                          {field.content}
                        </div>
                      </div>
                    ) : field.contentType === 'TABLE' && field.content ? (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 mb-2">Table Preview:</div>
                        <div className="max-h-60 overflow-auto border rounded">
                          {(() => {
                            try {
                              const tableData = JSON.parse(field.content);
                              if (Array.isArray(tableData) && tableData.length > 0) {
                                const columns = Object.keys(tableData[0]);
                                return (
                                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        {columns.map((col) => (
                                          <th key={col} className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">
                                            {col}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {tableData.slice(0, 3).map((row, idx) => (
                                        <tr key={idx}>
                                          {columns.map((col) => (
                                            <td key={col} className="px-2 py-1 text-gray-900">
                                              {Array.isArray(row[col]) ? row[col].join(', ') : (row[col] || '-')}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                );
                              }
                              return <div className="text-gray-500 p-2">Empty table - Click Edit to add data</div>;
                            } catch (e) {
                              return <div className="text-red-500 p-2">Invalid table data - Click Edit to fix</div>;
                            }
                          })()}
                        </div>
                        {(() => {
                          try {
                            const tableData = JSON.parse(field.content);
                            if (Array.isArray(tableData) && tableData.length > 3) {
                              return <div className="text-xs text-gray-500">... and {tableData.length - 3} more rows</div>;
                            }
                          } catch (e) {}
                          return null;
                        })()}
                      </div>
                    ) : field.contentType === 'TABLE' ? (
                      <div className="text-gray-500 italic p-3 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <Table className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Empty table - Click Edit to add data using the visual editor</p>
                      </div>
                    ) : (
                      <div className="text-gray-900 whitespace-pre-wrap">{field.content}</div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No content set</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPageContent = (pageId: string, pageLabel: string) => {
    const pageContent = content[pageId] as ContentField[] || [];
    const pageDynamicContent = dynamicContent[pageId] || [];

    // Show static content fields first, then dynamic content overview if available
    const hasStaticContent = pageContent.length > 0;
    const hasDynamicContent = ['blog', 'packages', 'dahabiyas', 'itineraries', 'contact'].includes(pageId) && Array.isArray(pageDynamicContent) && pageDynamicContent.length > 0;

    // If no static content, show empty state with populate button
    if (!hasStaticContent && !hasDynamicContent) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Type className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Content Available</h3>
              <p className="text-sm">No static content found for {pageLabel}.</p>
              <p className="text-xs text-gray-400 mt-2">Click &ldquo;Populate Page Content&rdquo; above to add default content fields.</p>
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {pageId === 'homepage' && (
                <Button
                  onClick={addSampleContent}
                  disabled={addingSampleContent}
                  className="bg-blue-600 text-white"
                >
                  {addingSampleContent ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Sample Content
                    </>
                  )}
                </Button>
              )}
              {pageId === 'schedule-and-rates' && (
                <Button
                  onClick={addScheduleAndRatesContent}
                  disabled={addingScheduleContent}
                  className="bg-emerald-600 text-white"
                >
                  {addingScheduleContent ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Default Schedule & Rates
                    </>
                  )}
                </Button>
              )}
              {pageId === 'branding_settings' && (
                <Button
                  onClick={addBrandingAndSettingsContent}
                  disabled={saving !== null}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Add Branding & Settings Content
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    // Group content by sections for better organization
    const groupedContent = pageContent.reduce((acc, field) => {
      const section = field.section || 'general';
      if (!acc[section]) acc[section] = [];
      acc[section]!.push(field);
      return acc;
    }, {} as Record<string, ContentField[]>);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{pageLabel}</h2>
          <div className="flex gap-2">
            {hasStaticContent && (
              <Badge variant="outline" className="text-sm">
                {pageContent.length} static fields
              </Badge>
            )}
            {hasDynamicContent && (
              <Badge variant="default" className="text-sm bg-green-100 text-green-800">
                {Array.isArray(pageDynamicContent) ? pageDynamicContent.length : 0} dynamic items
              </Badge>
            )}
          </div>
        </div>

        {/* Static Content Fields */}
        {hasStaticContent && (
          <>
            {Object.entries(groupedContent)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([sectionName, fields]) => (
                <Card key={sectionName} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg capitalize flex items-center gap-2">
                      {getSectionIcon(sectionName)}
                      {sectionName.replace('_', ' ')} Section
                      <Badge variant="secondary" className="text-xs">
                        {fields.length} fields
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fields
                      .sort((a, b) => a.order - b.order)
                      .map(renderField)}
                  </CardContent>
                </Card>
              ))}
          </>
        )}

        {/* Dynamic Content Overview */}
        {hasDynamicContent && (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {pageId === 'blog' && <FileText className="w-5 h-5 text-green-600" />}
                {pageId === 'packages' && <Package className="w-5 h-5 text-green-600" />}
                {pageId === 'dahabiyas' && <Ship className="w-5 h-5 text-green-600" />}
                {pageId === 'itineraries' && <MapPin className="w-5 h-5 text-green-600" />}
                {pageId === 'contact' && <Phone className="w-5 h-5 text-green-600" />}
                Dynamic {pageLabel} Content
                <Badge variant="secondary" className="text-xs">
                  {Array.isArray(pageDynamicContent) ? pageDynamicContent.length : 0} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                This content is managed through dedicated {pageLabel.toLowerCase()} management pages.
              </div>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = `/admin/${pageId}`}>
                Manage {pageLabel} →
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading content...
      </div>
    );
  }

  return (
    <div className="space-y-6 admin-panel">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              Website Content Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage content for all pages of your website in an organized, section-based structure.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Quick Actions */}
            {Object.values(content).every(section => section.length === 0) && (
              <Button
                onClick={addSampleContent}
                disabled={addingSampleContent}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {addingSampleContent ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Sample Content
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={populatePageContent}
              disabled={populatingPageContent}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {populatingPageContent ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Populating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Populate Page Content
                </>
              )}
            </Button>

            <Button onClick={loadContent} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="homepage" className="w-full">
        {/* Responsive Tabs */}
        <div className="mb-6">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full bg-gray-100 rounded-lg p-1">
              {contentSections.map((section) => {
                const Icon = section.icon;
                const count = content[section.id]?.length || 0;
                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{section.label}</span>
                    <span className="sm:hidden">{section.label.split(' ')[0]}</span>
                    {count > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs bg-blue-100 text-blue-700">
                        {count}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>

        {contentSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-6">
            {renderPageContent(section.id, section.label)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
