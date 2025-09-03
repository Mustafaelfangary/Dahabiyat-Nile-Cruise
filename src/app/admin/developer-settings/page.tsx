"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MediaPicker from '@/components/admin/MediaPicker';
import {
  Code,
  Save,
  RefreshCw,
  Globe,
  User,
  Building,
  AlertCircle
} from 'lucide-react';

interface DeveloperSettings {
  // Contact Information
  developer_name: string;
  developer_company: string;
  developer_phone: string;
  developer_email: string;
  developer_website: string;
  
  // Branding
  developer_logo: string;
  developer_branding_text: string;
  
  // Contact Button
  contact_button_text: string;
  contact_modal_title: string;
  
  // Contact URLs
  contact_email_url: string;
  contact_phone_url: string;
  contact_website_url: string;
}

export default function DeveloperSettingsPage() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<DeveloperSettings>({
    developer_name: 'Just X Development',
    developer_company: 'Just X',
    developer_phone: '+20 123 456 7890',
    developer_email: 'developer@justx.com',
    developer_website: 'https://justx.com',
    developer_logo: '/images/logo-white.png',
    developer_branding_text: 'crafted with love in the land of the Pharaohs by Just X',
    contact_button_text: 'Contact Developer',
    contact_modal_title: 'Contact Developer',
    contact_email_url: 'mailto:developer@justx.com',
    contact_phone_url: 'tel:+201234567890',
    contact_website_url: 'https://justx.com'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/website-content?page=global_media');
      if (response.ok) {
        const data = await response.json();
        
        const newSettings = { ...settings };
        data.forEach((item: Record<string, unknown>) => {
          if (item.key.startsWith('footer_developer_') || item.key.startsWith('developer_')) {
            const key = item.key.replace('footer_', '') as keyof DeveloperSettings;
            newSettings[key] = item.content || item.mediaUrl || newSettings[key];
          }
        });
        
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching developer settings:', error);
      toast.error('Failed to load developer settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const settingsToSave = [
        // Contact Information
        { key: 'footer_developer_name', content: settings.developer_name, title: 'Developer Name' },
        { key: 'footer_developer_company', content: settings.developer_company, title: 'Developer Company' },
        { key: 'footer_developer_phone', content: settings.developer_phone, title: 'Developer Phone' },
        { key: 'footer_developer_email', content: settings.developer_email, title: 'Developer Email' },
        { key: 'footer_developer_website', content: settings.developer_website, title: 'Developer Website' },
        
        // Branding
        { key: 'footer_developer_logo', content: settings.developer_logo, title: 'Developer Logo', contentType: 'IMAGE' },
        { key: 'footer_developer_branding_text', content: settings.developer_branding_text, title: 'Developer Branding Text' },
        
        // Contact Button
        { key: 'footer_developer_contact_text', content: settings.contact_button_text, title: 'Contact Button Text' },
        { key: 'footer_developer_contact_modal_title', content: settings.contact_modal_title, title: 'Contact Modal Title' },
        
        // Contact URLs
        { key: 'footer_developer_contact_url', content: settings.contact_email_url, title: 'Contact Email URL' },
        { key: 'footer_developer_phone_url', content: settings.contact_phone_url, title: 'Contact Phone URL' },
        { key: 'footer_developer_website_url', content: settings.contact_website_url, title: 'Contact Website URL' }
      ];

      for (const setting of settingsToSave) {
        const response = await fetch('/api/website-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...setting,
            page: 'global_media',
            section: 'developer',
            contentType: setting.contentType || 'TEXT'
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to save ${setting.key}`);
        }
      }

      toast.success('Developer settings saved successfully!');
    } catch (error) {
      console.error('Error saving developer settings:', error);
      toast.error('Failed to save developer settings');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Developer Settings</h1>
        </div>
        <p className="text-gray-600">Configure developer contact information and branding in the footer</p>
      </div>

      <div className="grid gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="developer_name">Developer Name</Label>
                <Input
                  id="developer_name"
                  value={settings.developer_name}
                  onChange={(e) => setSettings({...settings, developer_name: e.target.value})}
                  placeholder="Just X Development"
                />
              </div>

              <div>
                <Label htmlFor="developer_company">Company Name</Label>
                <Input
                  id="developer_company"
                  value={settings.developer_company}
                  onChange={(e) => setSettings({...settings, developer_company: e.target.value})}
                  placeholder="Just X"
                />
              </div>

              <div>
                <Label htmlFor="developer_phone">Phone Number</Label>
                <Input
                  id="developer_phone"
                  value={settings.developer_phone}
                  onChange={(e) => setSettings({...settings, developer_phone: e.target.value})}
                  placeholder="+20 123 456 7890"
                />
              </div>

              <div>
                <Label htmlFor="developer_email">Email Address</Label>
                <Input
                  id="developer_email"
                  type="email"
                  value={settings.developer_email}
                  onChange={(e) => setSettings({...settings, developer_email: e.target.value})}
                  placeholder="developer@justx.com"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="developer_website">Website URL</Label>
                <Input
                  id="developer_website"
                  type="url"
                  value={settings.developer_website}
                  onChange={(e) => setSettings({...settings, developer_website: e.target.value})}
                  placeholder="https://justx.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Branding & Display
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <MediaPicker
                label="Developer Logo"
                value={settings.developer_logo}
                onChange={(url) => setSettings({...settings, developer_logo: url})}
                accept="image/*"
                placeholder="Select logo image..."
                helperText="Logo displayed in footer (48x48px recommended). Supports PNG, JPG, WebP formats."
              />
            </div>

            <div>
              <Label htmlFor="developer_branding_text">Branding Text</Label>
              <Textarea
                id="developer_branding_text"
                value={settings.developer_branding_text}
                onChange={(e) => setSettings({...settings, developer_branding_text: e.target.value})}
                placeholder="crafted with love in the land of the Pharaohs by Just X"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="contact_button_text">Contact Button Text</Label>
              <Input
                id="contact_button_text"
                value={settings.contact_button_text}
                onChange={(e) => setSettings({...settings, contact_button_text: e.target.value})}
                placeholder="Contact Developer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact URLs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Contact URLs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact_email_url">Email Contact URL</Label>
              <Input
                id="contact_email_url"
                value={settings.contact_email_url}
                onChange={(e) => setSettings({...settings, contact_email_url: e.target.value})}
                placeholder="mailto:developer@justx.com"
              />
            </div>

            <div>
              <Label htmlFor="contact_phone_url">Phone Contact URL</Label>
              <Input
                id="contact_phone_url"
                value={settings.contact_phone_url}
                onChange={(e) => setSettings({...settings, contact_phone_url: e.target.value})}
                placeholder="tel:+201234567890"
              />
            </div>

            <div>
              <Label htmlFor="contact_website_url">Website Contact URL</Label>
              <Input
                id="contact_website_url"
                value={settings.contact_website_url}
                onChange={(e) => setSettings({...settings, contact_website_url: e.target.value})}
                placeholder="https://justx.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>

          <Button
            onClick={fetchSettings}
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
