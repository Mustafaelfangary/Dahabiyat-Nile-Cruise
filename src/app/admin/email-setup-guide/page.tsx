"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Settings, 
  Crown, 
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Shield,
  Key,
  Server,
  Users,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

export default function EmailSetupGuidePage() {
  const [copiedText, setCopiedText] = useState<string>('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const envVariables = [
    {
      name: 'EMAIL_SERVER_HOST',
      value: 'smtp.gmail.com',
      description: 'SMTP server hostname'
    },
    {
      name: 'EMAIL_SERVER_PORT',
      value: '587',
      description: 'SMTP server port (587 for TLS, 465 for SSL)'
    },
    {
      name: 'EMAIL_SERVER_USER',
      value: 'your-email@gmail.com',
      description: 'Your Gmail address'
    },
    {
      name: 'EMAIL_SERVER_PASSWORD',
      value: 'your-app-password',
      description: 'Gmail App Password (not your regular password)'
    },
    {
      name: 'SMTP_FROM',
      value: 'noreply@dahabiyatnilecruise.com',
      description: 'From address for outgoing emails'
    },
    {
      name: 'SMTP_SECURE',
      value: 'false',
      description: 'Use SSL/TLS (false for STARTTLS on port 587)'
    },
    {
      name: 'ADMIN_BOOKING_EMAILS',
      value: 'admin1@company.com,admin2@company.com,manager@company.com',
      description: 'Comma-separated list of admin emails for booking notifications'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/10 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              𓇳 Email System Setup Guide 𓇳
            </h1>
            <p className="text-gray-600 text-lg">
              Complete guide to configure automatic email verification and booking notifications
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gmail-setup">Gmail Setup</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="admin-emails">Admin Emails</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Email System Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Email Verification
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Automatic 6-digit code generation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        15-minute code expiration
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Egyptian-themed email templates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Resend code functionality
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-600" />
                      Booking Notifications
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Multiple admin email recipients
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Customer booking confirmations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Professional email templates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Real-time booking alerts
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Setup Process Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-medium">Configure Gmail SMTP</h4>
                      <p className="text-sm text-gray-600">Set up Gmail App Password for secure SMTP access</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-medium">Set Environment Variables</h4>
                      <p className="text-sm text-gray-600">Configure SMTP settings in your .env file</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-medium">Configure Admin Emails</h4>
                      <p className="text-sm text-gray-600">Set up multiple admin emails for booking notifications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="font-medium">Test Configuration</h4>
                      <p className="text-sm text-gray-600">Verify email system is working correctly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gmail Setup Tab */}
          <TabsContent value="gmail-setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Gmail SMTP Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Important Security Note</p>
                      <p>Never use your regular Gmail password. You must create an App Password for secure SMTP access.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Step-by-Step Gmail Setup:</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">Enable 2-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Go to your Google Account settings and enable 2-Factor Authentication. This is required for App Passwords.
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open('https://myaccount.google.com/security', '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Google Security Settings
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">Generate App Password</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          In Google Security settings, find "App passwords" and generate a new password for "Mail".
                        </p>
                        <div className="bg-white border rounded p-3 text-sm font-mono">
                          Select app: Mail<br/>
                          Select device: Other (Custom name)<br/>
                          Name: Dahabiyat Nile Cruise SMTP
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">Copy App Password</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Google will generate a 16-character app password. Copy this password - you'll need it for the environment variables.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Example:</strong> abcd efgh ijkl mnop (remove spaces when using)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environment Variables Tab */}
          <TabsContent value="environment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Environment Variables Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Add these environment variables to your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:
                </p>

                <div className="space-y-4">
                  {envVariables.map((env, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {env.name}
                          </code>
                          <Badge variant="outline" className="text-xs">
                            {env.name.includes('PASSWORD') ? 'Secret' : 'Config'}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(`${env.name}=${env.value}`, env.name)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          {copiedText === env.name ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <div className="bg-gray-50 rounded p-3 mb-2">
                        <code className="text-sm font-mono">
                          {env.name}={env.value}
                        </code>
                      </div>
                      <p className="text-sm text-gray-600">{env.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Complete .env Example</p>
                      <div className="bg-white border rounded p-3 mt-2 font-mono text-xs overflow-x-auto">
                        {envVariables.map(env => (
                          <div key={env.name}>{env.name}={env.value}</div>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        className="mt-3"
                        onClick={() => copyToClipboard(
                          envVariables.map(env => `${env.name}=${env.value}`).join('\n'),
                          'Complete .env configuration'
                        )}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All Variables
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Emails Tab */}
          <TabsContent value="admin-emails" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Multiple Admin Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Configure multiple admin emails to receive booking notifications. All specified emails will receive booking alerts simultaneously.
                </p>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Environment Variable Method (Recommended)
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Set multiple admin emails in your .env file using comma separation:
                    </p>
                    <div className="bg-white border rounded p-3 font-mono text-sm">
                      ADMIN_BOOKING_EMAILS=admin1@company.com,admin2@company.com,manager@company.com
                    </div>
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => copyToClipboard(
                        'ADMIN_BOOKING_EMAILS=admin1@company.com,admin2@company.com,manager@company.com',
                        'Admin emails environment variable'
                      )}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Example
                    </Button>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Admin Panel Method
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Alternatively, configure admin emails through the admin panel:
                    </p>
                    <Button
                      size="sm"
                      onClick={() => window.open('/admin/email-settings', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Email Settings
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Email Notification Flow:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-sm">Customer submits booking</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-sm">Booking confirmation sent to customer</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-sm">Booking alert sent to ALL admin emails</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <span className="text-sm">In-app notifications created for admin users</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Test Your Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  After configuring your environment variables, test the email system to ensure everything is working correctly.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Automatic Tests Available:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        SMTP Configuration Test
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Email Verification Test
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Booking Notification Test
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Multiple Admin Email Test
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Testing Steps:</h4>
                    <ol className="space-y-2 text-sm list-decimal list-inside">
                      <li>Configure environment variables</li>
                      <li>Restart your development server</li>
                      <li>Go to Email Settings page</li>
                      <li>Click "Test Email Configuration"</li>
                      <li>Check all admin email inboxes</li>
                    </ol>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => window.open('/admin/email-settings', '_blank')}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Open Email Settings
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open('/auth/signup', '_blank')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Test User Registration
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Success Indicators</p>
                      <ul className="space-y-1">
                        <li>• Test emails arrive in all admin inboxes</li>
                        <li>• New user registrations receive verification codes</li>
                        <li>• Booking confirmations are sent to customers</li>
                        <li>• Admin booking alerts work correctly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
