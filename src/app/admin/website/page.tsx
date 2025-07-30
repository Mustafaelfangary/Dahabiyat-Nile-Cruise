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

  useEffect(() => {
    loadContent();
  }, []);

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
        <h1 className="text-3xl font-bold text-hieroglyph-brown mb-2 flex items-center gap-2">
          <Globe className="text-egyptian-gold" />
          Website Content Manager
        </h1>
        <p className="text-gray-600">
          Manage your website content including founder information and footer data
        </p>
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
                {content[section.id]?.length > 0 ? (
                  <div className="space-y-4">
                    {content[section.id].map((field) => 
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
