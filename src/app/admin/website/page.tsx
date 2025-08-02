"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { 
  Save, 
  RefreshCw, 
  Image as ImageIcon, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Globe,
  Home
} from 'lucide-react';
import HomepageContentSync from '@/components/admin/HomepageContentSync';

interface ContentField {
  key: string;
  title: string;
  value: string;
  type: string;
  section: string;
}

export default function WebsiteContentPage() {
  const [content, setContent] = useState<Record<string, ContentField[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const contentSections = [
    { id: 'homepage', label: 'Homepage Content', icon: Home },
    { id: 'global_media', label: 'Footer & Global', icon: Globe },
  ];

  // Default homepage content structure - Updated to match actual homepage
  const defaultHomepageContent = [
    { key: 'hero_title', title: 'Hero Title', value: 'Discover Ancient Egypt on Luxury Dahabiyas', type: 'text', section: 'hero' },
    { key: 'hero_subtitle', title: 'Hero Subtitle', value: 'Experience the timeless beauty of the Nile River aboard our traditional sailing vessels', type: 'text', section: 'hero' },
    { key: 'hero_description', title: 'Hero Description', value: 'Embark on an unforgettable journey through ancient Egypt aboard our luxury dahabiyas. Sail the legendary Nile River and discover temples, tombs, and treasures that have captivated travelers for millennia.', type: 'textarea', section: 'hero' },
    { key: 'hero_video_url', title: 'Hero Video URL', value: '/videos/home_hero_video.mp4', type: 'text', section: 'hero' },
    { key: 'hero_video_poster', title: 'Hero Video Poster Image', value: '/images/hero-video-poster.jpg', type: 'text', section: 'hero' },

    // Featured Dahabiyas Section (matches actual homepage)
    { key: 'featured_dahabiyas_title', title: 'Featured Dahabiyas Section Title', value: 'Our Luxury Dahabiyas', type: 'text', section: 'featured_dahabiyas' },
    { key: 'featured_dahabiyas_subtitle', title: 'Featured Dahabiyas Subtitle', value: 'Discover our fleet of traditional sailing vessels', type: 'text', section: 'featured_dahabiyas' },

    // Featured Packages Section (matches actual homepage)
    { key: 'featured_packages_title', title: 'Featured Packages Section Title', value: 'Popular Nile Cruise Packages', type: 'text', section: 'featured_packages' },
    { key: 'featured_packages_subtitle', title: 'Featured Packages Subtitle', value: 'Carefully crafted journeys through ancient Egypt', type: 'text', section: 'featured_packages' },

    // About Section
    { key: 'what_is_title', title: 'What is a Dahabiya - Title', value: 'What is a Dahabiya?', type: 'text', section: 'about' },
    { key: 'what_is_description', title: 'What is a Dahabiya - Description', value: 'A dahabiya is a traditional Egyptian sailing boat, once used by royalty and nobility to cruise the Nile. These elegant vessels offer an intimate and authentic way to experience Egypt, with personalized service and access to sites that larger cruise ships cannot reach.', type: 'textarea', section: 'about' },

    // Features Section
    { key: 'why_different_title', title: 'Why Different - Title', value: 'Why Choose Our Dahabiyas?', type: 'text', section: 'features' },
    { key: 'why_different_description', title: 'Why Different - Description', value: 'Our dahabiyas combine traditional charm with modern luxury. Enjoy spacious cabins, gourmet dining, expert guides, and the freedom to explore at your own pace. Experience Egypt as the pharaohs intended.', type: 'textarea', section: 'features' },
  ];

  useEffect(() => {
    loadContent();
  }, []);

  const populateDefaultContent = async () => {
    try {
      setSaving(true);
      toast.loading('Creating default homepage content...');

      for (const item of defaultHomepageContent) {
        const response = await fetch('/api/website-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: item.key,
            title: item.title,
            content: item.value,
            contentType: item.type === 'textarea' ? 'TEXT' : 'TEXT',
            page: 'homepage',
            section: item.section,
            order: 0
          }),
        });

        if (!response.ok) {
          console.warn(`Failed to create ${item.key}:`, await response.text());
        }
      }

      await loadContent();
      toast.success('Default homepage content created successfully!');
    } catch (error) {
      console.error('Error creating default content:', error);
      toast.error('Failed to create default content');
    } finally {
      setSaving(false);
    }
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      const newContent: Record<string, ContentField[]> = {};

      for (const section of contentSections) {
        const response = await fetch(`/api/website-content/${section.id}`);
        if (response.ok) {
          const data = await response.json();
          newContent[section.id] = data.fields || [];
        }
      }

      setContent(newContent);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const updateFieldValue = (sectionId: string, fieldKey: string, newValue: string) => {
    setContent(prev => ({
      ...prev,
      [sectionId]: prev[sectionId]?.map(field => 
        field.key === fieldKey ? { ...field, value: newValue } : field
      ) || []
    }));
  };

  const saveField = async (sectionId: string, field: ContentField) => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/website-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: field.key,
          title: field.title,
          content: field.value,
          contentType: field.type.toUpperCase(),
          page: sectionId,
          section: field.section || 'general'
        }),
      });

      if (response.ok) {
        toast.success(`${field.title} updated successfully!`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const renderContentField = (sectionId: string, field: ContentField) => {
    const isImageField = field.type === 'image' || field.key.includes('image');
    const isTextareaField = field.type === 'textarea' || field.key.includes('content') || field.key.includes('description');

    return (
      <Card key={field.key} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isImageField && <ImageIcon className="w-4 h-4 text-blue-600" />}
              {field.key.includes('founder') && <User className="w-4 h-4 text-purple-600" />}
              {field.key.includes('phone') && <Phone className="w-4 h-4 text-green-600" />}
              {field.key.includes('email') && <Mail className="w-4 h-4 text-red-600" />}
              {field.key.includes('address') && <MapPin className="w-4 h-4 text-orange-600" />}
              <Label className="font-medium text-gray-900">
                {field.title || field.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Label>
            </div>
            <Button
              size="sm"
              onClick={() => saveField(sectionId, field)}
              disabled={saving}
              className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-amber"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
          
          <div className="space-y-2">
            {isTextareaField ? (
              <Textarea
                value={field.value}
                onChange={(e) => updateFieldValue(sectionId, field.key, e.target.value)}
                placeholder={`Enter ${field.title || field.key}`}
                rows={4}
                className="w-full"
              />
            ) : (
              <Input
                value={field.value}
                onChange={(e) => updateFieldValue(sectionId, field.key, e.target.value)}
                placeholder={`Enter ${field.title || field.key}`}
                className="w-full"
              />
            )}
            
            {isImageField && field.value && (
              <div className="mt-2">
                <img 
                  src={field.value} 
                  alt={field.title}
                  className="w-20 h-20 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-egyptian-gold" />
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-hieroglyph-brown mb-2 flex items-center gap-2">
              <Globe className="text-egyptian-gold" />
              Website Content Manager
            </h1>
            <p className="text-gray-600">
              Manage your website content including homepage and footer data
            </p>
          </div>
          <Button
            onClick={populateDefaultContent}
            disabled={saving}
            className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Home className="w-4 h-4 mr-2" />
                Create Default Homepage Content
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Homepage Content Sync Component */}
      <div className="mb-8">
        <HomepageContentSync />
      </div>

      <Tabs defaultValue="homepage" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {contentSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
              <section.icon className="w-4 h-4" />
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {contentSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="w-5 h-5" />
                  {section.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(content[section.id]?.length ?? 0) > 0 ? (
                  <div className="space-y-4">
                    {content[section.id]?.map((field) =>
                      renderContentField(section.id, field)
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
    </div>
  );
}
