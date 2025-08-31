'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import {
  Save,
  RefreshCw,
  Settings,
  Globe,
  Mail,
  Database,
  Shield,
  Palette,
  Bell
} from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  group: string;
  label?: string;
  description?: string;
  type?: 'text' | 'email' | 'number' | 'textarea';
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-blue"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login');
  }
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Group settings by category
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = [];
    }
    acc[setting.group]?.push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  const groups = Object.keys(groupedSettings).sort();

  // If no settings exist, create default groups
  if (groups.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600">No settings found. Please check your database configuration.</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Settings Available</h3>
            <p className="text-gray-600">Settings could not be loaded. Please check your API configuration.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        
        // Convert object format to array format if needed
        if (Array.isArray(data)) {
          setSettings(data);
        } else if (data && typeof data === 'object') {
          const settingsArray = Object.entries(data).map(([key, value]) => ({
            key,
            value: String(value),
            group: key.includes('email') ? 'email' : 
                   key.includes('db') || key.includes('database') ? 'database' :
                   key.includes('security') || key.includes('auth') ? 'security' : 'general'
          }));
          setSettings(settingsArray);
        }
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      // Save each setting
      for (const setting of settings) {
        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: setting.key,
            value: setting.value,
            group: setting.group
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save ${setting.key}`);
        }
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Manage your website settings including site information and configuration options.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {groups.map((group) => (
          <TabsContent key={group} value={group} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {group === 'general' && <Globe className="w-5 h-5 text-blue-600" />}
                  {group === 'email' && <Mail className="w-5 h-5 text-green-600" />}
                  {group === 'database' && <Database className="w-5 h-5 text-purple-600" />}
                  {group === 'security' && <Shield className="w-5 h-5 text-red-600" />}
                  {group.charAt(0).toUpperCase() + group.slice(1)} Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedSettings[group]?.map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                      {setting.value.length > 50 ? (
                        <Textarea
                          id={setting.key}
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          rows={3}
                          placeholder={`Enter ${setting.key.replace(/_/g, ' ')}`}
                        />
                      ) : (
                        <Input
                          id={setting.key}
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          placeholder={`Enter ${setting.key.replace(/_/g, ' ')}`}
                        />
                      )}
                      <p className="text-xs text-gray-500">
                        {setting.key === 'site_name' ? 'The name of your website' :
                         setting.key === 'site_description' ? 'Brief description of your website' :
                         setting.key === 'contact_email' ? 'Primary contact email address' :
                         `Current value for ${setting.key}`}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={fetchSettings}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            <strong>Website Configuration:</strong> Use these settings to configure your website's basic information and behavior.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
