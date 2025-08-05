'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AddItinerariesContentPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const addItinerariesContent = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/add-itineraries-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast.success('Itineraries content added successfully!');
      } else {
        throw new Error(data.error || 'Failed to add content');
      }
    } catch (error) {
      console.error('Error adding itineraries content:', error);
      toast.error('Failed to add itineraries content');
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add Itineraries Content
        </h1>
        <p className="text-gray-600">
          This utility adds the missing itineraries page content to the database.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Content Setup Utility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What this does:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Adds hero section content for itineraries page</li>
              <li>• Creates filter labels and descriptions</li>
              <li>• Sets up empty state messages</li>
              <li>• Configures loading text and CTA buttons</li>
              <li>• Adds features section content</li>
            </ul>
          </div>

          <Button
            onClick={addItinerariesContent}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Content...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Add Itineraries Content
              </>
            )}
          </Button>

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
                      <p className="text-green-800 text-sm mb-3">{result.message}</p>
                      
                      {result.summary && (
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <h5 className="font-medium text-green-900 mb-2">Summary:</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-green-700">Created:</span>
                              <span className="font-semibold ml-2">{result.summary.created}</span>
                            </div>
                            <div>
                              <span className="text-green-700">Updated:</span>
                              <span className="font-semibold ml-2">{result.summary.updated}</span>
                            </div>
                            <div>
                              <span className="text-green-700">Total:</span>
                              <span className="font-semibold ml-2">{result.summary.total}</span>
                            </div>
                            <div>
                              <span className="text-green-700">Final Count:</span>
                              <span className="font-semibold ml-2">{result.summary.finalCount}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Next Steps:</h3>
            <ol className="text-yellow-800 text-sm space-y-1 list-decimal list-inside">
              <li>Run this utility to add the content</li>
              <li>Go to <a href="/admin/website" className="underline font-medium">Website Content Management</a></li>
              <li>Look for the "Itineraries Page" tab</li>
              <li>Edit the content as needed</li>
              <li>The site logo can be found in "Footer & General" tab</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
