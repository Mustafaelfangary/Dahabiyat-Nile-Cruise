"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MessageCircle, Save, RefreshCw, Phone, MessageSquare, Settings, Eye } from 'lucide-react';

interface WhatsAppFieldData {
  key: string;
  value: string;
}

interface WhatsAppApiResponse {
  fields: WhatsAppFieldData[];
}

interface WhatsAppSettings {
  enabled: boolean;
  phone: string;
  message: string;
  position: 'bottom-right' | 'bottom-left';
  delay: number;
  businessHours: string;
  offlineMessage: string;
}

export default function WhatsAppSettingsPage() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<WhatsAppSettings>({
    enabled: true,
    phone: '+201001538358',
    message: 'Hello! I\'m interested in your luxury Nile cruise packages. Could you please provide more information?',
    position: 'bottom-right',
    delay: 1,
    businessHours: 'We typically respond within 1-2 hours during business hours (9 AM - 6 PM GMT+2).',
    offlineMessage: 'Thank you for your interest! We\'ll respond to your message as soon as possible during business hours.'
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
      const response = await fetch('/api/website-content/whatsapp-settings');
      if (response.ok) {
        const data = await response.json();
        
        const apiResponse = data as WhatsAppApiResponse;
        const apiSettings: WhatsAppSettings = {
          enabled: apiResponse.fields?.find((f: WhatsAppFieldData) => f.key === 'whatsapp_enabled')?.value === 'true',
          phone: apiResponse.fields?.find((f: WhatsAppFieldData) => f.key === 'whatsapp_phone')?.value || settings.phone,
          message: apiResponse.fields?.find((f: WhatsAppFieldData) => f.key === 'whatsapp_message')?.value || settings.message,
          position: (apiResponse.fields?.find((f: WhatsAppFieldData) => f.key === 'whatsapp_position')?.value as 'bottom-right' | 'bottom-left') || settings.position,
          delay: parseInt(apiResponse.fields?.find((f: WhatsAppFieldData) => f.key === 'whatsapp_delay')?.value || '1'),
          businessHours: apiResponse.fields?.find((f: WhatsAppFieldData) => f.key === 'whatsapp_business_hours')?.value || settings.businessHours,
          offlineMessage: apiResponse.fields?.find((f: WhatsAppFieldData) => f.key === 'whatsapp_offline_message')?.value || settings.offlineMessage
        };
        
        setSettings(apiSettings);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
      toast.error('Failed to load WhatsApp settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const settingsToSave = [
        { key: 'whatsapp_enabled', value: settings.enabled.toString() },
        { key: 'whatsapp_phone', value: settings.phone },
        { key: 'whatsapp_message', value: settings.message },
        { key: 'whatsapp_position', value: settings.position },
        { key: 'whatsapp_delay', value: settings.delay.toString() },
        { key: 'whatsapp_business_hours', value: settings.businessHours },
        { key: 'whatsapp_offline_message', value: settings.offlineMessage }
      ];

      for (const setting of settingsToSave) {
        const response = await fetch('/api/website-content/whatsapp-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(setting)
        });

        if (!response.ok) {
          throw new Error(`Failed to save ${setting.key}`);
        }
      }

      toast.success('WhatsApp settings saved successfully!');
    } catch (error) {
      console.error('Error saving WhatsApp settings:', error);
      toast.error('Failed to save WhatsApp settings');
    } finally {
      setSaving(false);
    }
  };

  const testWhatsApp = () => {
    const encodedMessage = encodeURIComponent(settings.message);
    const whatsappUrl = `https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
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
          <MessageCircle className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Settings</h1>
        </div>
        <p className="text-gray-600">Configure the floating WhatsApp button for your website</p>
      </div>

      <div className="grid gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Basic Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enabled" className="text-base font-medium">Enable WhatsApp Button</Label>
                <p className="text-sm text-gray-500">Show the floating WhatsApp button on your website</p>
              </div>
              <Switch
                id="enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">WhatsApp Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  placeholder="+201001538358"
                />
                <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +20 for Egypt)</p>
              </div>

              <div>
                <Label htmlFor="position">Button Position</Label>
                <Select value={settings.position} onValueChange={(value: 'bottom-right' | 'bottom-left') => setSettings({...settings, position: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="delay">Show Delay (seconds)</Label>
              <Input
                id="delay"
                type="number"
                min="0"
                max="10"
                value={settings.delay}
                onChange={(e) => setSettings({...settings, delay: parseInt(e.target.value) || 0})}
              />
              <p className="text-xs text-gray-500 mt-1">How long to wait before showing the button</p>
            </div>
          </CardContent>
        </Card>

        {/* Message Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Message Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="message">Default Message</Label>
              <Textarea
                id="message"
                value={settings.message}
                onChange={(e) => setSettings({...settings, message: e.target.value})}
                rows={3}
                placeholder="Hello! I'm interested in your luxury Nile cruise packages..."
              />
              <p className="text-xs text-gray-500 mt-1">This message will be pre-filled when users click the WhatsApp button</p>
            </div>

            <div>
              <Label htmlFor="businessHours">Business Hours Message</Label>
              <Textarea
                id="businessHours"
                value={settings.businessHours}
                onChange={(e) => setSettings({...settings, businessHours: e.target.value})}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="offlineMessage">Offline Message</Label>
              <Textarea
                id="offlineMessage"
                value={settings.offlineMessage}
                onChange={(e) => setSettings({...settings, offlineMessage: e.target.value})}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
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
            onClick={testWhatsApp}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Test WhatsApp
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
