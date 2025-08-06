"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useContent } from '@/hooks/useContent';

export function SiteNamePreview() {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    siteName: '',
    siteTagline: '',
    siteDescription: ''
  });
  
  const { getContent, loading } = useContent({ page: 'homepage' });

  useEffect(() => {
    // Load current values from content system
    setFormData({
      siteName: getContent('site_name', 'Dahabiyat'),
      siteTagline: getContent('site_tagline', 'Luxury Nile River Cruises in Egypt'),
      siteDescription: getContent('site_description', 'Experience the magic of ancient Egypt aboard our luxury dahabiyas.')
    });
  }, [getContent]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save site name
      const siteNameResponse = await fetch('/api/website-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'site_name',
          title: 'Site Name',
          content: formData.siteName,
          contentType: 'TEXT',
          page: 'homepage',
          section: 'branding'
        })
      });

      // Save site tagline
      const taglineResponse = await fetch('/api/website-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'site_tagline',
          title: 'Site Tagline',
          content: formData.siteTagline,
          contentType: 'TEXT',
          page: 'homepage',
          section: 'branding'
        })
      });

      // Save site description
      const descriptionResponse = await fetch('/api/website-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'site_description',
          title: 'Site Description',
          content: formData.siteDescription,
          contentType: 'TEXTAREA',
          page: 'homepage',
          section: 'branding'
        })
      });

      if (siteNameResponse.ok && taglineResponse.ok && descriptionResponse.ok) {
        toast.success('Site branding updated successfully!');
        
        // Trigger content update event
        window.dispatchEvent(new CustomEvent('content-updated'));
        
        // Refresh the page after a short delay to show changes
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error('Failed to save some fields');
      }
    } catch (error) {
      console.error('Error saving site branding:', error);
      toast.error('Failed to save site branding');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-egyptian-gold" />
            <span className="ml-2">Loading site branding...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-egyptian-gold">𓇳</span>
          Dynamic Site Branding
          <span className="text-egyptian-gold">𓇳</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={formData.siteName}
            onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
            placeholder="Enter your site name"
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            This will appear in the navigation bar and page titles
          </p>
        </div>

        <div>
          <Label htmlFor="siteTagline">Site Tagline</Label>
          <Input
            id="siteTagline"
            value={formData.siteTagline}
            onChange={(e) => setFormData(prev => ({ ...prev, siteTagline: e.target.value }))}
            placeholder="Enter your site tagline"
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Short description that appears in search results
          </p>
        </div>

        <div>
          <Label htmlFor="siteDescription">Site Description</Label>
          <Textarea
            id="siteDescription"
            value={formData.siteDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
            placeholder="Enter your site description"
            className="mt-1"
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-1">
            Detailed description for SEO and social media
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-egyptian-gold hover:bg-amber-600 text-black"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          
          <Button
            onClick={handlePreview}
            variant="outline"
            className="border-egyptian-gold text-egyptian-gold hover:bg-egyptian-gold hover:text-black"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Site
          </Button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-amber-800 mb-2">💡 Quick Access</h4>
          <p className="text-sm text-amber-700">
            You can also edit these fields in the <strong>Website Content Manager</strong> under the <strong>Homepage Content</strong> tab, in the <strong>Branding</strong> section.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
