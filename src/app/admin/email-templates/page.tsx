"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { AnimatedSection } from '@/components/ui/animated-section';
import { toast } from 'sonner';
import {
  Mail,
  Settings,
  Eye,
  Send,
  Save,
  RefreshCw,
  Crown,
  Ship,
  Package,
  Shield,
  Bell,
  Edit3,
  Code,
  Palette
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  enabled: boolean;
  variables: string[];
}

interface EmailSettings {
  enabled: boolean;
  adminEmail: string;
  customerNotifications: boolean;
  adminNotifications: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpFrom: string;
}

export default function EmailTemplatesPage() {
  const { data: session, status } = useSession();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [settings, setSettings] = useState<EmailSettings>({
    enabled: true,
    adminEmail: '',
    customerNotifications: true,
    adminNotifications: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpFrom: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (session) {
      fetchTemplates();
      fetchSettings();
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/email-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveTemplate = async (template: EmailTemplate) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });

      if (response.ok) {
        toast.success('Template saved successfully!');
        fetchTemplates();
      } else {
        toast.error('Failed to save template');
      }
    } catch (error) {
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testTemplate = async (template: EmailTemplate) => {
    try {
      setTesting(true);
      const response = await fetch('/api/admin/test-email-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          testEmail: settings.adminEmail
        })
      });

      if (response.ok) {
        toast.success(`Test email sent to ${settings.adminEmail}!`);
      } else {
        toast.error('Failed to send test email');
      }
    } catch (error) {
      toast.error('Failed to send test email');
    } finally {
      setTesting(false);
    }
  };

  const defaultTemplates = [
    {
      id: 'email-verification',
      name: 'Email Verification',
      subject: '🏺 Verify Your Royal Account - Dahabiyat Nile Cruise',
      type: 'user',
      enabled: true,
      variables: ['user.name', 'verificationCode', 'expiresAt'],
      content: 'Pharaonic email verification template with golden styling...'
    },
    {
      id: 'booking-confirmation',
      name: 'Booking Confirmation',
      subject: '🏺 Your Sacred Journey Awaits - Booking Confirmed',
      type: 'customer',
      enabled: true,
      variables: ['user.name', 'booking.id', 'booking.startDate', 'booking.endDate', 'dahabiya.name'],
      content: 'Beautiful booking confirmation with journey details...'
    },
    {
      id: 'admin-booking-notification',
      name: 'Admin Booking Alert',
      subject: '🚨 New Booking Received',
      type: 'admin',
      enabled: true,
      variables: ['user.name', 'booking.totalPrice', 'dahabiya.name'],
      content: 'Admin notification for new bookings...'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth={false} className="py-8">
        <AnimatedSection animation="fade-in">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-heading font-bold text-gray-900">
                  𓇳 Email Template Manager 𓇳
                </h1>
                <p className="text-gray-600 text-lg">
                  Customize all email communications with professional elegance
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl p-1">
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                SMTP Settings
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview & Test
              </TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="templates" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Template List */}
                <Card className="bg-white border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-600" />
                      Email Templates
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage all email templates used throughout the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {defaultTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedTemplate?.id === template.id
                              ? 'border-blue-400 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{template.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant={template.enabled ? 'default' : 'secondary'}>
                                {template.enabled ? 'Active' : 'Disabled'}
                              </Badge>
                              <Badge variant="outline">
                                {template.type}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                          <div className="flex flex-wrap gap-1">
                            {template.variables.slice(0, 3).map((variable) => (
                              <Badge key={variable} variant="outline" className="text-xs">
                                {variable}
                              </Badge>
                            ))}
                            {template.variables.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.variables.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Template Editor */}
                {selectedTemplate && (
                  <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-amber-600" />
                        Edit Template: {selectedTemplate.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="subject">Email Subject</Label>
                        <Input
                          id="subject"
                          value={selectedTemplate.subject}
                          onChange={(e) => setSelectedTemplate({
                            ...selectedTemplate,
                            subject: e.target.value
                          })}
                          className="border-amber-200 focus:border-blue-400"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">Email Content (HTML)</Label>
                        <Textarea
                          id="content"
                          value={selectedTemplate.content}
                          onChange={(e) => setSelectedTemplate({
                            ...selectedTemplate,
                            content: e.target.value
                          })}
                          rows={10}
                          className="border-amber-200 focus:border-blue-400 font-mono text-sm"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="enabled"
                            checked={selectedTemplate.enabled}
                            onCheckedChange={(checked) => setSelectedTemplate({
                              ...selectedTemplate,
                              enabled: checked
                            })}
                          />
                          <Label htmlFor="enabled">Template Enabled</Label>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => testTemplate(selectedTemplate)}
                            disabled={testing}
                            variant="outline"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            {testing ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4 mr-2" />
                            )}
                            Test
                          </Button>
                          <Button
                            onClick={() => saveTemplate(selectedTemplate)}
                            disabled={saving}
                            className="bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 hover:from-ocean-blue-500 hover:to-navy-blue-500"
                          >
                            {saving ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            Save
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl max-w-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-amber-600" />
                    SMTP Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure email server settings for sending notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={settings.smtpHost}
                        onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        value={settings.smtpPort}
                        onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                      placeholder="admin@cleopatradahabiya.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="smtpFrom">From Email</Label>
                    <Input
                      id="smtpFrom"
                      type="email"
                      value={settings.smtpFrom}
                      onChange={(e) => setSettings({...settings, smtpFrom: e.target.value})}
                      placeholder="noreply@cleopatradahabiya.com"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Notification Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailEnabled">Email System Enabled</Label>
                        <Switch
                          id="emailEnabled"
                          checked={settings.enabled}
                          onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="customerNotifs">Customer Notifications</Label>
                        <Switch
                          id="customerNotifs"
                          checked={settings.customerNotifications}
                          onCheckedChange={(checked) => setSettings({...settings, customerNotifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="adminNotifs">Admin Notifications</Label>
                        <Switch
                          id="adminNotifs"
                          checked={settings.adminNotifications}
                          onCheckedChange={(checked) => setSettings({...settings, adminNotifications: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={saveSettings}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 hover:from-ocean-blue-500 hover:to-navy-blue-500"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-amber-600" />
                    Email Preview & Testing
                  </CardTitle>
                  <CardDescription>
                    Preview how emails will look and send test emails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Mail className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Select a template from the Templates tab to preview and test it here.
                    </p>
                    <Button
                      onClick={() => (document.querySelector('[value="templates"]') as HTMLElement)?.click()}
                      variant="outline"
                      className="border-amber-200 text-amber-700 hover:bg-blue-50"
                    >
                      Go to Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </AnimatedSection>
      </Container>
    </div>
  );
}
