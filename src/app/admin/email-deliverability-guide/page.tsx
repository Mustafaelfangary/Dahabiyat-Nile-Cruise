"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  Server,
  Settings,
  Crown,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

export default function EmailDeliverabilityGuidePage() {
  const [copiedText, setCopiedText] = useState<string>('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-ocean-blue-lightest/10 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-ocean-blue to-blue-600 rounded-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              📧 Email Deliverability Guide
            </h1>
            <p className="text-gray-600 text-lg">
              Fix spam folder issues and improve email delivery rates
            </p>
          </div>
        </div>

        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="issues">Common Issues</TabsTrigger>
            <TabsTrigger value="dns-setup">DNS Setup</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>

          {/* Common Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  Why Emails Go to Spam
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Mail className="w-5 h-5 text-red-600" />
                      Technical Issues
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        Missing SPF record
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        Missing DKIM signature
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        No DMARC policy
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        Poor sender reputation
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Settings className="w-5 h-5 text-amber-600" />
                      Content Issues
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Special characters in subject (𓇳)
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        HTML-only emails (no plain text)
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Missing unsubscribe link
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Suspicious keywords
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">✅ Already Fixed:</p>
                      <ul className="space-y-1">
                        <li>• Removed special characters from subject lines</li>
                        <li>• Added plain text versions to all emails</li>
                        <li>• Added proper email headers</li>
                        <li>• Improved sender name format</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DNS Setup Tab */}
          <TabsContent value="dns-setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  DNS Records Setup
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Add these DNS records to your domain to improve email deliverability
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          SPF Record
                        </Badge>
                        <span className="text-sm font-medium">Sender Policy Framework</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard('v=spf1 include:_spf.google.com ~all', 'SPF Record')}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        {copiedText === 'SPF Record' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <div className="bg-gray-50 rounded p-3 mb-2">
                      <p className="text-sm font-mono">
                        <strong>Type:</strong> TXT<br/>
                        <strong>Name:</strong> @ (or your domain)<br/>
                        <strong>Value:</strong> v=spf1 include:_spf.google.com ~all
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Authorizes Gmail servers to send emails on behalf of your domain.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          DKIM Record
                        </Badge>
                        <span className="text-sm font-medium">DomainKeys Identified Mail</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open('https://admin.google.com/ac/apps/gmail/authenticateemail', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Get DKIM
                      </Button>
                    </div>
                    <div className="bg-gray-50 rounded p-3 mb-2">
                      <p className="text-sm font-mono">
                        <strong>Type:</strong> TXT<br/>
                        <strong>Name:</strong> google._domainkey<br/>
                        <strong>Value:</strong> [Generated by Google Admin Console]
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Get your DKIM record from Google Admin Console → Apps → Gmail → Authenticate Email.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          DMARC Record
                        </Badge>
                        <span className="text-sm font-medium">Domain-based Message Authentication</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard('v=DMARC1; p=quarantine; rua=mailto:dmarc@dahabiyatnilecruise.com', 'DMARC Record')}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        {copiedText === 'DMARC Record' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <div className="bg-gray-50 rounded p-3 mb-2">
                      <p className="text-sm font-mono">
                        <strong>Type:</strong> TXT<br/>
                        <strong>Name:</strong> _dmarc<br/>
                        <strong>Value:</strong> v=DMARC1; p=quarantine; rua=mailto:dmarc@dahabiyatnilecruise.com
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Tells email providers what to do with emails that fail SPF/DKIM checks.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">💡 Pro Tip:</p>
                      <p>
                        DNS changes can take up to 48 hours to propagate. Use tools like 
                        <a href="https://mxtoolbox.com/spf.aspx" target="_blank" className="text-amber-700 underline ml-1">
                          MXToolbox
                        </a> to verify your records.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Best Practices Tab */}
          <TabsContent value="best-practices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Email Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-green-700">✅ Do This</h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div>
                          <strong>Use clear subject lines</strong><br/>
                          "Verify Your Account" instead of "𓇳 Verify Your Royal Account 𓇳"
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div>
                          <strong>Include plain text version</strong><br/>
                          Always send both HTML and plain text
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div>
                          <strong>Use proper sender name</strong><br/>
                          "Dahabiyat Nile Cruise" &lt;noreply@domain.com&gt;
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div>
                          <strong>Add unsubscribe link</strong><br/>
                          Required for commercial emails
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-red-700">❌ Avoid This</h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div>
                          <strong>Special characters in subjects</strong><br/>
                          Hieroglyphics can trigger spam filters
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div>
                          <strong>ALL CAPS text</strong><br/>
                          Looks like spam to filters
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div>
                          <strong>Too many images</strong><br/>
                          High image-to-text ratio is suspicious
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div>
                          <strong>Spam trigger words</strong><br/>
                          "Free", "Urgent", "Act Now", etc.
                        </div>
                      </li>
                    </ul>
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
                  <Settings className="w-5 h-5" />
                  Test Email Deliverability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">🔧 Testing Tools</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open('https://www.mail-tester.com/', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Mail Tester (Spam Score)
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open('https://mxtoolbox.com/deliverability', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        MXToolbox Deliverability
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open('https://postmarkapp.com/spam-check', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Postmark Spam Check
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">📧 Test Process</h3>
                    <ol className="space-y-2 text-sm list-decimal list-inside">
                      <li>Send test email to multiple providers</li>
                      <li>Check Gmail, Outlook, Yahoo inboxes</li>
                      <li>Verify emails don't go to spam</li>
                      <li>Test on mobile and desktop</li>
                      <li>Monitor delivery rates</li>
                    </ol>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => window.open('/admin/email-settings', '_blank')}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Test Email Configuration
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open('/auth/signup', '_blank')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Test User Registration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
