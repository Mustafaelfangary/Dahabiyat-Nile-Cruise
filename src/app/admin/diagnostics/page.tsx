"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Loader, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Ship, 
  Users, 
  Calendar, 
  Mail,
  Database,
  Settings,
  RefreshCw
} from 'lucide-react';

interface DiagnosticResult {
  category: string;
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  fixAvailable?: boolean;
}

export default function DiagnosticsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [fixing, setFixing] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const diagnosticResults: DiagnosticResult[] = [];

      // 1. Check Princess Cleopatra dahabiya
      try {
        const princessResponse = await fetch('/api/dahabiyat/check-princess');
        const princessData = await princessResponse.json();
        
        if (princessData.found) {
          const issues = princessData.issues;
          if (issues.missingSlug || issues.notFeatured || issues.noHomepageOrder) {
            diagnosticResults.push({
              category: 'Dahabiyat',
              name: 'Princess Cleopatra Configuration',
              status: 'error',
              message: `Issues found: ${Object.entries(issues).filter(([_, v]) => v).map(([k]) => k).join(', ')}`,
              details: princessData,
              fixAvailable: true
            });
          } else {
            diagnosticResults.push({
              category: 'Dahabiyat',
              name: 'Princess Cleopatra Configuration',
              status: 'success',
              message: 'Princess Cleopatra is properly configured',
              details: princessData
            });
          }
        } else {
          diagnosticResults.push({
            category: 'Dahabiyat',
            name: 'Princess Cleopatra Configuration',
            status: 'error',
            message: 'Princess Cleopatra dahabiya not found',
            fixAvailable: false
          });
        }
      } catch (error) {
        diagnosticResults.push({
          category: 'Dahabiyat',
          name: 'Princess Cleopatra Configuration',
          status: 'error',
          message: 'Failed to check Princess Cleopatra status',
          fixAvailable: false
        });
      }

      // 2. Check all dahabiyat for missing slugs
      try {
        const dahabiyatResponse = await fetch('/api/dahabiyat?limit=100');
        const dahabiyatData = await dahabiyatResponse.json();
        
        if (dahabiyatData.dahabiyat) {
          const missingSlugCount = dahabiyatData.dahabiyat.filter((d: any) => !d.slug).length;
          if (missingSlugCount > 0) {
            diagnosticResults.push({
              category: 'Dahabiyat',
              name: 'Dahabiyat Slugs',
              status: 'warning',
              message: `${missingSlugCount} dahabiyat missing slugs`,
              details: { missingSlugCount, total: dahabiyatData.dahabiyat.length },
              fixAvailable: true
            });
          } else {
            diagnosticResults.push({
              category: 'Dahabiyat',
              name: 'Dahabiyat Slugs',
              status: 'success',
              message: 'All dahabiyat have proper slugs',
              details: { total: dahabiyatData.dahabiyat.length }
            });
          }
        }
      } catch (error) {
        diagnosticResults.push({
          category: 'Dahabiyat',
          name: 'Dahabiyat Slugs',
          status: 'error',
          message: 'Failed to check dahabiyat slugs',
          fixAvailable: false
        });
      }

      // 3. Check bookings in admin panel
      try {
        const bookingsResponse = await fetch('/api/admin/bookings');
        const bookingsData = await bookingsResponse.json();
        
        if (bookingsResponse.ok && bookingsData.bookings) {
          diagnosticResults.push({
            category: 'Bookings',
            name: 'Admin Bookings Access',
            status: 'success',
            message: `Found ${bookingsData.bookings.length} bookings in admin panel`,
            details: { count: bookingsData.bookings.length }
          });
        } else {
          diagnosticResults.push({
            category: 'Bookings',
            name: 'Admin Bookings Access',
            status: 'error',
            message: 'Failed to fetch bookings in admin panel',
            details: bookingsData,
            fixAvailable: false
          });
        }
      } catch (error) {
        diagnosticResults.push({
          category: 'Bookings',
          name: 'Admin Bookings Access',
          status: 'error',
          message: 'Error accessing admin bookings API',
          fixAvailable: false
        });
      }

      // 4. Check users in admin panel
      try {
        const usersResponse = await fetch('/api/admin/users');
        const usersData = await usersResponse.json();
        
        if (usersResponse.ok && Array.isArray(usersData)) {
          diagnosticResults.push({
            category: 'Users',
            name: 'Admin Users Access',
            status: 'success',
            message: `Found ${usersData.length} users in admin panel`,
            details: { count: usersData.length }
          });
        } else {
          diagnosticResults.push({
            category: 'Users',
            name: 'Admin Users Access',
            status: 'error',
            message: 'Failed to fetch users in admin panel',
            details: usersData,
            fixAvailable: false
          });
        }
      } catch (error) {
        diagnosticResults.push({
          category: 'Users',
          name: 'Admin Users Access',
          status: 'error',
          message: 'Error accessing admin users API',
          fixAvailable: false
        });
      }

      // 5. Check notifications system
      try {
        const notificationsResponse = await fetch('/api/admin/notifications');
        const notificationsData = await notificationsResponse.json();
        
        if (notificationsResponse.ok) {
          diagnosticResults.push({
            category: 'Notifications',
            name: 'Notification System',
            status: 'success',
            message: 'Notification system is accessible',
            details: notificationsData
          });
        } else {
          diagnosticResults.push({
            category: 'Notifications',
            name: 'Notification System',
            status: 'error',
            message: 'Failed to access notification system',
            details: notificationsData,
            fixAvailable: false
          });
        }
      } catch (error) {
        diagnosticResults.push({
          category: 'Notifications',
          name: 'Notification System',
          status: 'error',
          message: 'Error accessing notifications API',
          fixAvailable: false
        });
      }

      // 6. Check email configuration
      try {
        const emailResponse = await fetch('/api/admin/email-settings');
        const emailData = await emailResponse.json();

        if (emailResponse.ok && emailData.settings) {
          const configured = emailData.settings.smtpConfigured && emailData.settings.emailEnabled;
          diagnosticResults.push({
            category: 'Email',
            name: 'Email Configuration',
            status: configured ? 'success' : 'warning',
            message: configured ? 'Email system is configured and enabled' : 'Email system needs configuration',
            details: emailData.settings,
            fixAvailable: !configured
          });
        } else {
          diagnosticResults.push({
            category: 'Email',
            name: 'Email Configuration',
            status: 'error',
            message: 'Failed to check email configuration',
            fixAvailable: false
          });
        }
      } catch (error) {
        diagnosticResults.push({
          category: 'Email',
          name: 'Email Configuration',
          status: 'warning',
          message: 'Email configuration check not available',
          fixAvailable: false
        });
      }

      setResults(diagnosticResults);
      
    } catch (error) {
      console.error('Diagnostics error:', error);
      toast.error('Failed to run diagnostics');
    } finally {
      setLoading(false);
    }
  };

  const runFixes = async () => {
    setFixing(true);
    try {
      // Fix Princess Cleopatra
      const princessFix = await fetch('/api/dahabiyat/fix-princess-cleopatra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (princessFix.ok) {
        toast.success('Princess Cleopatra fixed successfully');
      }

      // Fix all slugs
      const slugsFix = await fetch('/api/dahabiyat/fix-all-slugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (slugsFix.ok) {
        toast.success('All dahabiyat slugs fixed successfully');
      }

      // Re-run diagnostics
      await runDiagnostics();
      
    } catch (error) {
      toast.error('Failed to run fixes');
    } finally {
      setFixing(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      runDiagnostics();
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
      case 'Dahabiyat': return <Ship className="w-5 h-5" />;
      case 'Bookings': return <Calendar className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'Notifications': return <Settings className="w-5 h-5" />;
      case 'Email': return <Mail className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Database className="w-16 h-16 text-egyptian-gold mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">System Diagnostics</h1>
          <p className="text-gray-600">Check and fix system issues</p>
        </div>

        <div className="flex gap-4 mb-8 justify-center">
          <Button 
            onClick={runDiagnostics} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Diagnostics
              </>
            )}
          </Button>
          
          <Button 
            onClick={runFixes} 
            disabled={fixing || results.filter(r => r.fixAvailable).length === 0}
            className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
          >
            {fixing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Running Fixes...
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Run Available Fixes
              </>
            )}
          </Button>
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
                    <div className="text-xs text-blue-600 font-medium">
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
      </div>
    </div>
  );
}
