"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Loader, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Mail,
  Settings,
  Send,
  Database,
  Server
} from 'lucide-react';

interface EmailDiagnostic {
  category: string;
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  fixAvailable?: boolean;
}

export default function EmailDiagnosticsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [results, setResults] = useState<EmailDiagnostic[]>([]);
  const [testing, setTesting] = useState(false);
  const [bookingTestEmails, setBookingTestEmails] = useState({
    customer: '',
    admin: ''
  });
  const [bookingTesting, setBookingTesting] = useState(false);

  const runEmailDiagnostics = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const diagnosticResults: EmailDiagnostic[] = [];

      // 1. Check email settings
      try {
        const emailResponse = await fetch('/api/admin/email-settings');
        const emailData = await emailResponse.json();
        
        if (emailResponse.ok && emailData.settings) {
          const settings = emailData.settings;
          
          // Check SMTP configuration
          if (settings.smtpConfigured) {
            diagnosticResults.push({
              category: 'Configuration',
              name: 'SMTP Settings',
              status: 'success',
              message: 'SMTP is properly configured',
              details: {
                host: settings.smtpHost,
                port: settings.smtpPort,
                user: settings.smtpUser ? '***configured***' : 'Not set',
                from: settings.smtpFrom
              }
            });
          } else {
            diagnosticResults.push({
              category: 'Configuration',
              name: 'SMTP Settings',
              status: 'error',
              message: 'SMTP is not properly configured',
              details: settings,
              fixAvailable: true
            });
          }

          // Check email enabled status
          if (settings.emailEnabled) {
            diagnosticResults.push({
              category: 'Configuration',
              name: 'Email System',
              status: 'success',
              message: 'Email system is enabled'
            });
          } else {
            diagnosticResults.push({
              category: 'Configuration',
              name: 'Email System',
              status: 'warning',
              message: 'Email system is disabled',
              fixAvailable: true
            });
          }

          // Check notification settings
          if (settings.customerNotifications && settings.adminNotifications) {
            diagnosticResults.push({
              category: 'Configuration',
              name: 'Notifications',
              status: 'success',
              message: 'Customer and admin notifications are enabled'
            });
          } else {
            diagnosticResults.push({
              category: 'Configuration',
              name: 'Notifications',
              status: 'warning',
              message: `Customer: ${settings.customerNotifications ? 'enabled' : 'disabled'}, Admin: ${settings.adminNotifications ? 'enabled' : 'disabled'}`,
              fixAvailable: true
            });
          }

          // Check admin emails
          if (settings.adminEmails && settings.adminEmails.length > 0) {
            diagnosticResults.push({
              category: 'Configuration',
              name: 'Admin Emails',
              status: 'success',
              message: `${settings.adminEmails.length} admin email(s) configured`,
              details: { adminEmails: settings.adminEmails }
            });
          } else {
            diagnosticResults.push({
              category: 'Configuration',
              name: 'Admin Emails',
              status: 'warning',
              message: 'No admin emails configured',
              fixAvailable: true
            });
          }
        }
      } catch (error) {
        diagnosticResults.push({
          category: 'Configuration',
          name: 'Email Settings',
          status: 'error',
          message: 'Failed to check email settings',
          fixAvailable: false
        });
      }

      // 2. Check email templates
      try {
        const templatesResponse = await fetch('/api/admin/email-templates');
        const templatesData = await templatesResponse.json();
        
        if (templatesResponse.ok && templatesData.templates) {
          const requiredTemplates = ['booking-confirmation', 'admin-booking-notification'];
          const existingTemplates = templatesData.templates.map((t: any) => t.id);
          const missingTemplates = requiredTemplates.filter(t => !existingTemplates.includes(t));
          
          if (missingTemplates.length === 0) {
            diagnosticResults.push({
              category: 'Templates',
              name: 'Email Templates',
              status: 'success',
              message: 'All required email templates are available',
              details: { templates: existingTemplates }
            });
          } else {
            diagnosticResults.push({
              category: 'Templates',
              name: 'Email Templates',
              status: 'warning',
              message: `Missing templates: ${missingTemplates.join(', ')}`,
              details: { missing: missingTemplates, existing: existingTemplates },
              fixAvailable: true
            });
          }
        }
      } catch (error) {
        diagnosticResults.push({
          category: 'Templates',
          name: 'Email Templates',
          status: 'error',
          message: 'Failed to check email templates',
          fixAvailable: false
        });
      }

      // 3. Check environment variables
      const envVars = [
        'EMAIL_SERVER_HOST',
        'EMAIL_SERVER_USER', 
        'EMAIL_SERVER_PASSWORD',
        'SMTP_FROM'
      ];

      let envConfigured = 0;
      envVars.forEach(envVar => {
        // We can't directly check env vars from client, but we can infer from settings
      });

      diagnosticResults.push({
        category: 'Environment',
        name: 'Environment Variables',
        status: 'warning',
        message: 'Check server logs for environment variable configuration',
        details: { 
          required: envVars,
          note: 'Environment variables are checked server-side'
        }
      });

      setResults(diagnosticResults);
      
    } catch (error) {
      console.error('Email diagnostics error:', error);
      toast.error('Failed to run email diagnostics');
    } finally {
      setLoading(false);
    }
  };

  const testEmailSending = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setTesting(true);
    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: [testEmail],
          testType: 'booking'
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Test email sent to ${testEmail}!`);
      } else {
        toast.error(data.error || 'Failed to send test email');
      }
    } catch (error) {
      toast.error('Failed to send test email');
    } finally {
      setTesting(false);
    }
  };

  const testBookingEmails = async () => {
    if (!bookingTestEmails.customer || !bookingTestEmails.admin) {
      toast.error('Please enter both customer and admin email addresses');
      return;
    }

    setBookingTesting(true);
    try {
      const response = await fetch('/api/admin/test-booking-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingTestEmails)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Booking test emails sent! ${data.summary.successful}/${data.summary.total} successful`);
        console.log('Booking email test results:', data.results);
      } else {
        toast.error(data.error || 'Failed to send booking test emails');
      }
    } catch (error) {
      toast.error('Failed to send booking test emails');
    } finally {
      setBookingTesting(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      runEmailDiagnostics();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Configuration': return <Settings className="w-5 h-5" />;
      case 'Templates': return <Mail className="w-5 h-5" />;
      case 'Environment': return <Server className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 text-egyptian-gold mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Email System Diagnostics</h1>
          <p className="text-gray-600">Check and fix email configuration issues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-egyptian-gold" />
                Run Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={runEmailDiagnostics}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Running Diagnostics...
                  </>
                ) : (
                  'Run Email Diagnostics'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-egyptian-gold" />
                Test Email Sending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={testEmailSending}
                disabled={testing || !testEmail}
                className="w-full bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
              >
                {testing ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Sending Test Email...
                  </>
                ) : (
                  'Send Test Email'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-egyptian-gold" />
                Test Booking Emails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="customer@example.com"
                  value={bookingTestEmails.customer}
                  onChange={(e) => setBookingTestEmails(prev => ({ ...prev, customer: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  value={bookingTestEmails.admin}
                  onChange={(e) => setBookingTestEmails(prev => ({ ...prev, admin: e.target.value }))}
                />
              </div>
              <Button
                onClick={testBookingEmails}
                disabled={bookingTesting || !bookingTestEmails.customer || !bookingTestEmails.admin}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {bookingTesting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Testing Booking Emails...
                  </>
                ) : (
                  'Test Booking Emails'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {getCategoryIcon(result.category)}
                    <span>{result.category}</span>
                    {getStatusIcon(result.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{result.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{result.message}</p>
                  
                  {result.fixAvailable && (
                    <div className="text-xs text-blue-600 font-medium mb-2">
                      ✓ Fix Available
                    </div>
                  )}
                  
                  {result.details && (
                    <details className="mt-3">
                      <summary className="text-xs text-gray-500 cursor-pointer">View Details</summary>
                      <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">📧 Common Email Issues & Solutions</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>SMTP Not Configured:</strong> Set EMAIL_SERVER_HOST, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD in environment</li>
            <li>• <strong>Emails Not Sending:</strong> Check SMTP credentials and firewall settings</li>
            <li>• <strong>Templates Missing:</strong> Ensure booking-confirmation and admin-booking-notification templates exist</li>
            <li>• <strong>Admin Emails:</strong> Configure admin email addresses in email settings</li>
            <li>• <strong>Gmail SMTP:</strong> Use app passwords instead of regular passwords</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
