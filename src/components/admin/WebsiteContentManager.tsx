'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import {
  Home, Users, Phone, Package, Settings,
  Edit2, Save, X, RefreshCw, Image, Video, Type, Plus
} from 'lucide-react';
import ResponsiveMediaPicker from './ResponsiveMediaPicker';

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
  icon: React.ComponentType<any>;
}

export default function WebsiteContentManager() {
  const [content, setContent] = useState<Record<string, ContentField[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [addingItinerariesContent, setAddingItinerariesContent] = useState(false);

  const contentSections: ContentSection[] = [
    { id: 'homepage', label: 'Homepage Content', icon: Home },
    { id: 'about', label: 'About Page', icon: Users },
    { id: 'contact', label: 'Contact Page', icon: Phone },
    { id: 'packages', label: 'Packages Page', icon: Package },
    { id: 'dahabiyas', label: 'Dahabiyas Page', icon: Package },
    { id: 'itineraries', label: 'Itineraries Page', icon: Package },
    { id: 'blog', label: 'Blog Page', icon: Package },
    { id: 'global_media', label: 'Logo & Media', icon: Image },
    { id: 'footer', label: 'Footer & General', icon: Settings }
  ];

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const contentData: Record<string, ContentField[]> = {};

      for (const section of contentSections) {
        try {
          console.log(`🔍 Loading content for section: ${section.id}`);
          const response = await fetch(`/api/website-content?page=${section.id}&t=${Date.now()}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`📊 Raw data for ${section.id}:`, data.length, 'items');
            console.log(`📋 First item:`, data[0]);

            // Transform WebsiteContent objects to ContentField format
            const transformedData = Array.isArray(data) ? data.map((item: any) => ({
              key: item.key,
              title: item.title || item.key,
              content: item.content || item.mediaUrl || '',
              contentType: item.contentType || 'TEXT',
              section: item.section || 'general',
              page: item.page || section.id,
              order: item.order || 0
            })) : [];

            console.log(`✅ Transformed data for ${section.id}:`, transformedData.length, 'items');
            contentData[section.id] = transformedData;
          } else {
            console.error(`❌ Failed to load ${section.id}: ${response.status} ${response.statusText}`);
            contentData[section.id] = [];
          }
        } catch (error) {
          console.error(`❌ Error loading ${section.id} content:`, error);
          contentData[section.id] = [];
        }
      }

      console.log('🎯 Final content data:', contentData);
      setContent(contentData);
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

  const addGlobalMediaContent = async () => {
    try {
      // Add logo and media content directly
      const mediaContent = [
        {
          key: 'site_logo',
          title: 'Site Logo',
          content: '/images/logo.png',
          contentType: 'IMAGE',
          page: 'global_media',
          section: 'branding',
          order: 1
        },
        {
          key: 'site_favicon',
          title: 'Site Favicon',
          content: '/favicon.ico',
          contentType: 'IMAGE',
          page: 'global_media',
          section: 'branding',
          order: 2
        },
        {
          key: 'navbar_logo',
          title: 'Navigation Bar Logo',
          content: '/images/logo.png',
          contentType: 'IMAGE',
          page: 'global_media',
          section: 'navigation',
          order: 1
        },
        {
          key: 'footer_logo',
          title: 'Footer Logo',
          content: '/images/logo.png',
          contentType: 'IMAGE',
          page: 'global_media',
          section: 'footer',
          order: 1
        }
      ];

      for (const content of mediaContent) {
        await fetch('/api/website-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(content),
        });
      }

      toast.success('Global media content added!');
      await loadContent();
    } catch (error) {
      console.error('Error adding global media content:', error);
      toast.error('Failed to add global media content');
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
      case 'IMAGE': return <Image className="w-4 h-4" />;
      case 'VIDEO': return <Video className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
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
      <Card key={fieldKey} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getFieldIcon(field.contentType)}
              <CardTitle className="text-sm font-medium">{field.title}</CardTitle>
              <Badge
                variant="outline"
                className={`text-xs ${
                  field.contentType === 'IMAGE' ? 'border-blue-300 text-blue-700 bg-blue-50' :
                  field.contentType === 'VIDEO' ? 'border-purple-300 text-purple-700 bg-purple-50' :
                  field.contentType === 'TEXTAREA' ? 'border-green-300 text-green-700 bg-green-50' :
                  'border-gray-300 text-gray-700 bg-gray-50'
                }`}
              >
                {field.contentType}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {field.section}
              </Badge>
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEditing(field)}
                  disabled={isSaving}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              {field.contentType === 'TEXTAREA' ? (
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={4}
                  className="w-full"
                />
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
                />
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => saveField(field)}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
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
            <div className="text-sm text-gray-600">
              <div className="font-mono text-xs text-gray-400 mb-1">Key: {field.key}</div>
              <div className="bg-gray-50 p-2 rounded border">
                {field.content ? (
                  <div>
                    {field.contentType === 'IMAGE' && field.content ? (
                      <div className="space-y-2">
                        <div className="relative inline-block">
                          <img
                            src={field.content}
                            alt={field.title}
                            className="max-w-xs max-h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                            <Image className="w-3 h-3" />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 break-all font-mono bg-gray-100 p-1 rounded">{field.content}</div>
                      </div>
                    ) : field.contentType === 'VIDEO' && field.content ? (
                      <div className="space-y-2">
                        <div className="relative inline-block">
                          <video
                            src={field.content}
                            className="max-w-xs max-h-32 rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            controls
                            preload="metadata"
                          />
                          <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                            <Video className="w-3 h-3" />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 break-all font-mono bg-gray-100 p-1 rounded">{field.content}</div>
                      </div>
                    ) : (
                      <div className="break-all font-mono">{field.content}</div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No content</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Content Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all website content with the new clean, organized structure.
          </p>
        </div>
        <div className="flex gap-2">
          {content.itineraries?.length === 0 && (
            <Button
              onClick={addItinerariesContent}
              disabled={addingItinerariesContent}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {addingItinerariesContent ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Itineraries
                </>
              )}
            </Button>
          )}
          {content.global_media?.length === 0 && (
            <Button
              onClick={addGlobalMediaContent}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Image className="w-4 h-4 mr-2" />
              Add Logo & Media
            </Button>
          )}
          <Button onClick={loadContent} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="homepage" className="w-full">
        {/* Mobile Tabs - Scrollable */}
        <div className="lg:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="flex w-max min-w-full gap-1 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl p-1">
              {contentSections.map((section) => {
                const Icon = section.icon;
                const count = content[section.id]?.length || 0;
                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="flex items-center gap-1 whitespace-nowrap px-2 py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean-blue-400 data-[state=active]:to-navy-blue-400 data-[state=active]:text-white"
                  >
                    <Icon className="w-3 h-3" />
                    <span className="text-xs">{section.label}</span>
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>

        {/* Desktop Tabs - Grid */}
        <div className="hidden lg:block">
          <TabsList className="grid w-full grid-cols-8 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl p-1">
            {contentSections.map((section) => {
              const Icon = section.icon;
              const count = content[section.id]?.length || 0;
              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean-blue-400 data-[state=active]:to-navy-blue-400 data-[state=active]:text-white"
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.label}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {contentSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{section.label}</h2>
                <Badge variant="outline">
                  {content[section.id]?.length || 0} fields
                </Badge>
              </div>
              
              {content[section.id]?.length > 0 ? (
                <div className="space-y-4">
                  {content[section.id]
                    .sort((a, b) => a.section.localeCompare(b.section) || a.order - b.order)
                    .map(renderField)}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No content fields found for this section.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
