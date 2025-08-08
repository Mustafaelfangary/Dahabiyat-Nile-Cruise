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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { AnimatedSection } from '@/components/ui/animated-section';
import { toast } from 'sonner';
import {
  Bell,
  Settings,
  Users,
  Crown,
  Ship,
  Package,
  DollarSign,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  Send,
  Save,
  RefreshCw
} from 'lucide-react';

interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  enabled: boolean;
  recipients: string[];
  template: string;
  conditions: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface NotificationSettings {
  enabledForUsers: boolean;
  enabledForAdmins: boolean;
  retentionDays: number;
  maxNotificationsPerUser: number;
  emailIntegration: boolean;
  smsIntegration: boolean;
  pushNotifications: boolean;
}

export default function NotificationSettingsPage() {
  const { data: session, status } = useSession();
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabledForUsers: true,
    enabledForAdmins: true,
    retentionDays: 30,
    maxNotificationsPerUser: 100,
    emailIntegration: true,
    smsIntegration: false,
    pushNotifications: true
  });
  const [selectedRule, setSelectedRule] = useState<NotificationRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) {
      fetchRules();
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

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/admin/notification-rules');
      if (response.ok) {
        const data = await response.json();
        setRules(data.rules || defaultRules);
      } else {
        setRules(defaultRules);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
      setRules(defaultRules);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/notification-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveRule = async (rule: NotificationRule) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/notification-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });

      if (response.ok) {
        toast.success('Notification rule saved successfully!');
        fetchRules();
      } else {
        toast.error('Failed to save notification rule');
      }
    } catch (error) {
      toast.error('Failed to save notification rule');
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/notification-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Notification settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testNotification = async (rule: NotificationRule) => {
    try {
      const response = await fetch('/api/admin/test-notification-rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId: rule.id })
      });

      if (response.ok) {
        toast.success('Test notification sent successfully!');
      } else {
        toast.error('Failed to send test notification');
      }
    } catch (error) {
      toast.error('Failed to send test notification');
    }
  };

  const defaultRules: NotificationRule[] = [
    {
      id: 'booking-created',
      name: 'New Booking Created',
      trigger: 'BOOKING_CREATED',
      enabled: true,
      recipients: ['admins'],
      template: 'admin-booking-notification',
      conditions: {},
      priority: 'high'
    },
    {
      id: 'booking-confirmed',
      name: 'Booking Confirmed',
      trigger: 'BOOKING_STATUS_CHANGED',
      enabled: true,
      recipients: ['customer', 'admins'],
      template: 'booking-confirmation',
      conditions: { status: 'CONFIRMED' },
      priority: 'medium'
    },
    {
      id: 'payment-received',
      name: 'Payment Received',
      trigger: 'PAYMENT_RECEIVED',
      enabled: true,
      recipients: ['customer', 'admins'],
      template: 'payment-confirmation',
      conditions: {},
      priority: 'medium'
    },
    {
      id: 'email-verification',
      name: 'Email Verification Required',
      trigger: 'USER_SIGNUP',
      enabled: true,
      recipients: ['customer'],
      template: 'email-verification',
      conditions: {},
      priority: 'high'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'BOOKING_CREATED': return <Ship className="w-4 h-4" />;
      case 'BOOKING_STATUS_CHANGED': return <Bell className="w-4 h-4" />;
      case 'PAYMENT_RECEIVED': return <DollarSign className="w-4 h-4" />;
      case 'USER_SIGNUP': return <Users className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-navy-blue-50/10">
      <Container maxWidth={false} className="py-8">
        <AnimatedSection animation="fade-in">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 rounded-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-heading font-bold text-gray-800">
                  𓇳 Notification Center 𓇳
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage all notification rules and system settings
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Notification Rules */}
            <div className="xl:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-amber-600" />
                        Notification Rules
                      </CardTitle>
                      <CardDescription>
                        Configure when and how notifications are sent
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setSelectedRule({
                        id: 'new',
                        name: '',
                        trigger: '',
                        enabled: true,
                        recipients: [],
                        template: '',
                        conditions: {},
                        priority: 'medium'
                      })}
                      className="bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 hover:from-ocean-blue-500 hover:to-navy-blue-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rules.map((rule) => (
                      <div
                        key={rule.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedRule?.id === rule.id
                            ? 'border-amber-400 bg-amber-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                        onClick={() => setSelectedRule(rule)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                              {getTriggerIcon(rule.trigger)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{rule.name}</h4>
                              <p className="text-sm text-gray-600">Trigger: {rule.trigger}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(rule.priority)}>
                              {rule.priority}
                            </Badge>
                            <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                              {rule.enabled ? 'Active' : 'Disabled'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {rule.recipients.map((recipient) => (
                              <Badge key={recipient} variant="outline" className="text-xs">
                                {recipient}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                testNotification(rule);
                              }}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRule(rule);
                              }}
                              className="border-amber-200 text-amber-700 hover:bg-blue-50"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rule Editor & Settings */}
            <div className="space-y-6">
              {/* Rule Editor */}
              {selectedRule && (
                <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-amber-600" />
                      {selectedRule.id === 'new' ? 'New Rule' : 'Edit Rule'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="ruleName">Rule Name</Label>
                      <Input
                        id="ruleName"
                        value={selectedRule.name}
                        onChange={(e) => setSelectedRule({
                          ...selectedRule,
                          name: e.target.value
                        })}
                        placeholder="Enter rule name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="trigger">Trigger Event</Label>
                      <Select
                        value={selectedRule.trigger}
                        onValueChange={(value) => setSelectedRule({
                          ...selectedRule,
                          trigger: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BOOKING_CREATED">Booking Created</SelectItem>
                          <SelectItem value="BOOKING_STATUS_CHANGED">Booking Status Changed</SelectItem>
                          <SelectItem value="PAYMENT_RECEIVED">Payment Received</SelectItem>
                          <SelectItem value="USER_SIGNUP">User Signup</SelectItem>
                          <SelectItem value="SYSTEM_ALERT">System Alert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={selectedRule.priority}
                        onValueChange={(value: any) => setSelectedRule({
                          ...selectedRule,
                          priority: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="enabled">Rule Enabled</Label>
                      <Switch
                        id="enabled"
                        checked={selectedRule.enabled}
                        onCheckedChange={(checked) => setSelectedRule({
                          ...selectedRule,
                          enabled: checked
                        })}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => testNotification(selectedRule)}
                        variant="outline"
                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                      <Button
                        onClick={() => saveRule(selectedRule)}
                        disabled={saving}
                        className="flex-1 bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 hover:from-ocean-blue-500 hover:to-navy-blue-500"
                      >
                        {saving ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* System Settings */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-600" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="userNotifs">User Notifications</Label>
                      <Switch
                        id="userNotifs"
                        checked={settings.enabledForUsers}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          enabledForUsers: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="adminNotifs">Admin Notifications</Label>
                      <Switch
                        id="adminNotifs"
                        checked={settings.enabledForAdmins}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          enabledForAdmins: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailIntegration">Email Integration</Label>
                      <Switch
                        id="emailIntegration"
                        checked={settings.emailIntegration}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          emailIntegration: checked
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="retentionDays">Retention (Days)</Label>
                    <Input
                      id="retentionDays"
                      type="number"
                      value={settings.retentionDays}
                      onChange={(e) => setSettings({
                        ...settings,
                        retentionDays: parseInt(e.target.value) || 30
                      })}
                    />
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
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </div>
  );
}
