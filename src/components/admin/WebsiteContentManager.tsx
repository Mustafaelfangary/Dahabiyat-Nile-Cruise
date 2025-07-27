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

  const contentSections = [
    { id: 'homepage', label: 'Homepage Content', icon: Home },
    { id: 'about', label: 'About Page', icon: Users },
    { id: 'contact', label: 'Contact Page', icon: Phone },
    { id: 'packages', label: 'Packages Page', icon: Package },
    { id: 'itineraries', label: 'Itineraries Page', icon: Package },
    { id: 'dahabiyas', label: 'Dahabiyas Page', icon: Package },
    { id: 'testimonials', label: 'Testimonials Page', icon: FileText },
    { id: 'tailor-made', label: 'Tailor-Made Page', icon: Wand2 },
    { id: 'footer', label: 'Footer & General', icon: Settings },
    { id: 'global_media', label: 'Global Media', icon: Globe }
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
          // Load from websiteContent table
          const response = await fetch(`/api/website-content?page=${section.id}`);
          if (response.ok) {
            const data = await response.json();
            // Convert websiteContent format to ContentField format
            contentData[section.id] = data.map((item: any) => ({
              key: item.key,
              value: item.content || item.mediaUrl || '',
              group: item.page,
              title: item.title,
              type: item.contentType?.toLowerCase(),
              contentType: item.contentType
            }));
          } else {
            contentData[section.id] = [];
          }
        } catch (error) {
          console.warn(`Failed to load ${section.id} content:`, error);
          contentData[section.id] = [];
        }
      }

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

        // Special handling for footer developer logo updates
        if (field.key === 'footer_developer_logo') {
          console.log('🎨 Footer logo updated, triggering refresh events');
          // Notify all tabs/windows about logo change
          const bc = new BroadcastChannel('content-updates');
          bc.postMessage({ type: 'logo-updated', key: field.key, value: field.value, timestamp });
          bc.close();

          // Additional logo-specific event
          window.dispatchEvent(new CustomEvent('logo-updated', {
            detail: { key: field.key, value: field.value, timestamp }
          }));
        }

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
    const isImageField = field.type === 'image' || field.contentType === 'IMAGE' || field.key.includes('footer_developer_logo') || field.key.includes('image');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Content Manager</h1>
        <p className="text-gray-600">
          Manage all website content including pages, sections, and global settings.
        </p>
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
