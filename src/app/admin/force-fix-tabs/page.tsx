'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export default function ForceFixTabsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const forceFixTabs = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Add itineraries content
      const itinerariesContent = [
        {
          key: 'itineraries_hero_title',
          title: 'Itineraries Hero Title',
          content: 'Discover Ancient Egypt',
          contentType: 'TEXT',
          page: 'itineraries',
          section: 'hero',
          order: 1
        },
        {
          key: 'itineraries_main_title',
          title: 'Main Section Title',
          content: 'Our Signature Journeys',
          contentType: 'TEXT',
          page: 'itineraries',
          section: 'main',
          order: 1
        },
        {
          key: 'itineraries_filter_title',
          title: 'Filter Section Title',
          content: 'Find Your Perfect Journey',
          contentType: 'TEXT',
          page: 'itineraries',
          section: 'filter',
          order: 1
        }
      ];

      // Add global media content
      const globalMediaContent = [
        {
          key: 'site_logo',
          title: 'Site Logo',
          content: '/images/logo.png',
          contentType: 'IMAGE',
          page: 'global_media',
          section: 'branding',
          order: 1
        },
        {
          key: 'navbar_logo',
          title: 'Navigation Bar Logo',
          content: '/images/logo.png',
          contentType: 'IMAGE',
          page: 'global_media',
          section: 'navigation',
          order: 1
        },
        {
          key: 'footer_logo',
          title: 'Footer Logo',
          content: '/images/logo.png',
          contentType: 'IMAGE',
          page: 'global_media',
          section: 'footer',
          order: 1
        }
      ];

      const allContent = [...itinerariesContent, ...globalMediaContent];
      let created = 0;
      let errors = 0;

      for (const content of allContent) {
        try {
          const response = await fetch('/api/website-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(content),
          });

          if (response.ok) {
            created++;
          } else {
            errors++;
          }
        } catch (error) {
          errors++;
        }
      }

      setResult({
        success: true,
        created,
        errors,
        total: allContent.length
      });

      toast.success(`Content added! Created: ${created}, Errors: ${errors}`);

    } catch (error) {
      console.error('Error fixing tabs:', error);
      toast.error('Failed to fix tabs');
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const refreshPage = () => {
    window.location.href = '/admin/website';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Force Fix Admin Tabs
        </h1>
        <p className="text-gray-600">
          This will directly add the missing content to make all 8 tabs appear.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Emergency Tab Fix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">This will add:</h3>
            <ul className="text-red-800 text-sm space-y-1">
              <li>• Itineraries page content (3 fields)</li>
              <li>• Global media content (3 fields)</li>
              <li>• Force the tabs to appear immediately</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={forceFixTabs}
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fixing Tabs...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Force Fix Tabs Now
                </>
              )}
            </Button>

            <Button
              onClick={refreshPage}
              variant="outline"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Go to Admin Panel
            </Button>
          </div>

          {result && (
            <Card className={result.error ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <CardContent className="pt-6">
                {result.error ? (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">Error</h4>
                      <p className="text-red-800 text-sm">{result.error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">Success!</h4>
                      <p className="text-green-800 text-sm mb-3">Content has been added to the database.</p>
                      
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <h5 className="font-medium text-green-900 mb-2">Results:</h5>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-green-700">Created:</span>
                            <span className="font-semibold ml-2">{result.created}</span>
                          </div>
                          <div>
                            <span className="text-green-700">Errors:</span>
                            <span className="font-semibold ml-2">{result.errors}</span>
                          </div>
                          <div>
                            <span className="text-green-700">Total:</span>
                            <span className="font-semibold ml-2">{result.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">After clicking "Force Fix":</h3>
            <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
              <li>Click "Go to Admin Panel" button</li>
              <li>Hard refresh the page (Ctrl+Shift+R)</li>
              <li>You should see 8 tabs including "Itineraries Page" and "Logo & Media"</li>
              <li>Test mobile responsiveness by resizing browser</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
