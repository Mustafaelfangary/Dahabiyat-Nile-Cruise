"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Mail, 
  Plus, 
  Trash2, 
  Send, 
  Settings, 
  Crown, 
  AlertCircle,
  CheckCircle,
  Users,
  Bell
} from 'lucide-react';

interface EmailSettings {
  adminEmails: string[];
  customerNotifications: boolean;
  adminNotifications: boolean;
  emailEnabled: boolean;
  smtpConfigured: boolean;
}

export default function EmailSettingsPage() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<EmailSettings>({
    adminEmails: ['info@cleopatradahabiya.com'],
    customerNotifications: true,
    adminNotifications: true,
    emailEnabled: true,
    smtpConfigured: false
  });
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchEmailSettings();
    }
  }, [session]);

  const fetchEmailSettings = async () => {
    try {
      const response = await fetch('/api/admin/email-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching email settings:', error);
      toast.error('Failed to load email settings');
    } finally {
      setLoading(false);
    }
  };

  const saveEmailSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Email settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error('Failed to save email settings');
    } finally {
      setSaving(false);
    }
  };

  const addAdminEmail = () => {
    if (!newEmail) {
      toast.error('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (settings.adminEmails.includes(newEmail)) {
      toast.error('This email is already in the list');
      return;
    }

    setSettings(prev => ({
      ...prev,
      adminEmails: [...prev.adminEmails, newEmail]
    }));
    setNewEmail('');
    toast.success('Admin email added successfully');
  };

  const removeAdminEmail = (emailToRemove: string) => {
    if (settings.adminEmails.length <= 1) {
      toast.error('At least one admin email is required');
      return;
    }

    setSettings(prev => ({
      ...prev,
      adminEmails: prev.adminEmails.filter(email => email !== emailToRemove)
    }));
    toast.success('Admin email removed');
  };

  const testEmailConfiguration = async () => {
    setTestingEmail(true);
    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: settings.adminEmails,
          testType: 'configuration'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Test emails sent successfully! Check your inboxes.');
      } else {
        toast.error(data.error || 'Failed to send test emails');
      }
    } catch (error) {
      console.error('Error testing email:', error);
      toast.error('Failed to test email configuration');
    } finally {
      setTestingEmail(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600">Admin privileges required</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/10 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              𓇳 Email Settings 𓇳
            </h1>
            <p className="text-gray-600 text-lg">
              Configure email notifications and admin recipients
            </p>
          </div>
        </div>

        {/* SMTP Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              SMTP Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {settings.smtpConfigured ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">SMTP Configured</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Ready
                  </Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-700 font-medium">SMTP Not Configured</span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Setup Required
                  </Badge>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admin Email Recipients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Admin Email Recipients
            </CardTitle>
            <p className="text-sm text-gray-600">
              These emails will receive booking notifications and admin alerts
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Admin Emails */}
            <div className="space-y-2">
              {settings.adminEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{email}</span>
                    {index === 0 && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Primary
                      </Badge>
                    )}
                  </div>
                  {settings.adminEmails.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeAdminEmail(email)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Email */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter admin email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAdminEmail()}
                className="flex-1"
              />
              <Button onClick={addAdminEmail} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Email System Enabled</Label>
                <p className="text-sm text-gray-600">Master switch for all email notifications</p>
              </div>
              <Switch
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, emailEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Customer Notifications</Label>
                <p className="text-sm text-gray-600">Send booking confirmations to customers</p>
              </div>
              <Switch
                checked={settings.customerNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, customerNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Admin Notifications</Label>
                <p className="text-sm text-gray-600">Send booking alerts to admin emails</p>
              </div>
              <Switch
                checked={settings.adminNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, adminNotifications: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={saveEmailSettings}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>

          <Button
            onClick={testEmailConfiguration}
            disabled={testingEmail || !settings.emailEnabled}
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            {testingEmail ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></div>
                Testing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Test Email Configuration
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
