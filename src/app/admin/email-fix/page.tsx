"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Loader, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Mail,
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function EmailFixPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [envCheck, setEnvCheck] = useState<any>(null);
  const [emailSettings, setEmailSettings] = useState({
    adminEmail: '',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpFrom: ''
  });

  const checkEnvironment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/check-env');
      const data = await response.json();
      setEnvCheck(data);
    } catch (error) {
      toast.error('Failed to check environment variables');
    } finally {
      setLoading(false);
    }
  };

  const saveEmailSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: true,
          adminEmail: emailSettings.adminEmail,
          customerNotifications: true,
          adminNotifications: true,
          smtpHost: emailSettings.smtpHost,
          smtpPort: emailSettings.smtpPort,
          smtpUser: emailSettings.smtpUser,
          smtpFrom: emailSettings.smtpFrom
        })
      });

      if (response.ok) {
        toast.success('Email settings saved successfully!');
      } else {
        toast.error('Failed to save email settings');
      }
    } catch (error) {
      toast.error('Failed to save email settings');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      checkEnvironment();
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const envVarTemplate = `# Email Configuration for Dahabiyat Nile Cruise
# Add these to your .env.local file

# SMTP Configuration (Gmail example)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_SECURE=false

# Admin Email Configuration
ADMIN_BOOKING_EMAILS=admin@dahabiyatnilecruise.com,bookings@dahabiyatnilecruise.com
ADMIN_EMAIL=admin@dahabiyatnilecruise.com

# Alternative SMTP Configuration (if using different provider)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 text-egyptian-gold mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Email System Setup & Fix</h1>
          <p className="text-gray-600">Configure email system for booking confirmations and notifications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Environment Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-egyptian-gold" />
                Environment Variables Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={checkEnvironment} 
                disabled={loading}
                className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Environment Variables'
                )}
              </Button>

              {envCheck && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Configuration Status:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {envCheck.summary?.basicSmtpConfigured ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                        }
                        <span>SMTP Configuration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {envCheck.summary?.fromConfigured ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                        }
                        <span>From Address</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {envCheck.summary?.adminEmailsConfigured ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                        }
                        <span>Admin Emails</span>
                      </div>
                    </div>
                  </div>

                  {envCheck.recommendations && Object.keys(envCheck.recommendations).length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold mb-2 text-yellow-800">Recommendations:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {Object.entries(envCheck.recommendations).map(([key, value]) => (
                          <li key={key}>• {value as string}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Settings Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-egyptian-gold" />
                Email Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@dahabiyatnilecruise.com"
                  value={emailSettings.adminEmail}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.gmail.com"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    placeholder="587"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtpUser">SMTP User</Label>
                <Input
                  id="smtpUser"
                  type="email"
                  placeholder="your-email@gmail.com"
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="smtpFrom">From Email</Label>
                <Input
                  id="smtpFrom"
                  type="email"
                  placeholder="noreply@dahabiyatnilecruise.com"
                  value={emailSettings.smtpFrom}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpFrom: e.target.value }))}
                />
              </div>

              <Button 
                onClick={saveEmailSettings} 
                disabled={loading}
                className="w-full bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Email Settings'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Environment Variables Template */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-egyptian-gold" />
              Environment Variables Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Copy these environment variables to your <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file:
            </p>
            <div className="relative">
              <Textarea
                value={envVarTemplate}
                readOnly
                className="font-mono text-sm h-64 bg-gray-50"
              />
              <Button
                onClick={() => copyToClipboard(envVarTemplate)}
                className="absolute top-2 right-2 h-8 w-8 p-0"
                variant="outline"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gmail Setup Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-egyptian-gold" />
              Gmail Setup Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">1. Enable 2-Factor Authentication</h4>
                <p className="text-gray-600">Go to your Google Account settings and enable 2-factor authentication.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Generate App Password</h4>
                <p className="text-gray-600">Go to Google Account → Security → App passwords → Generate a new app password for "Mail".</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Use App Password</h4>
                <p className="text-gray-600">Use the generated app password (not your regular Gmail password) in EMAIL_SERVER_PASSWORD.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4. Test Configuration</h4>
                <p className="text-gray-600">Use the email diagnostics page to test your configuration.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button
            onClick={() => window.open('/admin/email-diagnostics', '_blank')}
            variant="outline"
          >
            <Settings className="w-4 h-4 mr-2" />
            Email Diagnostics
          </Button>
          <Button
            onClick={() => window.open('/admin/email-setup', '_blank')}
            variant="outline"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Setup
          </Button>
        </div>
      </div>
    </div>
  );
}
