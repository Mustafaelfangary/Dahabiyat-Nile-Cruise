'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function AvailabilityDebugPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const testAPI = async (endpoint: string, description: string) => {
    try {
      console.log(`🔍 Testing ${description}: ${endpoint}`);
      const response = await fetch(endpoint);
      const data = await response.json();
      
      console.log(`✅ ${description} Response:`, {
        status: response.status,
        ok: response.ok,
        data
      });

      return {
        success: response.ok,
        status: response.status,
        data,
        error: response.ok ? null : data.error || 'Unknown error'
      };
    } catch (error) {
      console.error(`❌ ${description} Error:`, error);
      return {
        success: false,
        status: 0,
        data: null,
        error: error.message
      };
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults({});
    setErrors({});

    const tests = [
      {
        key: 'session',
        endpoint: '/api/auth/session',
        description: 'Authentication Session'
      },
      {
        key: 'dahabiyas',
        endpoint: '/api/dahabiyas?active=true',
        description: 'Active Dahabiyas'
      },
      {
        key: 'dashboard_dahabiyas',
        endpoint: '/api/dashboard/dahabiyat',
        description: 'Dashboard Dahabiyas'
      },
      {
        key: 'availability_sample',
        endpoint: '/api/dashboard/dahabiyat/availability?dahabiyaId=test&month=0&year=2025',
        description: 'Availability API (Sample)'
      }
    ];

    const testResults = {};
    const testErrors = {};

    for (const test of tests) {
      const result = await testAPI(test.endpoint, test.description);
      testResults[test.key] = result;
      
      if (!result.success) {
        testErrors[test.key] = result.error;
      }
    }

    setResults(testResults);
    setErrors(testErrors);
    setLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (result: any) => {
    if (!result) return <Loader2 className="w-4 h-4 animate-spin" />;
    return result.success ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusColor = (result: any) => {
    if (!result) return 'border-gray-200';
    return result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Availability Debug Page
        </h1>
        <p className="text-gray-600">
          Testing all API endpoints to identify the availability page issue.
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={runAllTests} disabled={loading} className="mr-4">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Run All Tests'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'session', title: 'Authentication Session', description: 'Check if user is logged in as admin' },
          { key: 'dahabiyas', title: 'Active Dahabiyas', description: 'Fetch active dahabiyas for dropdown' },
          { key: 'dashboard_dahabiyas', title: 'Dashboard Dahabiyas', description: 'Alternative dahabiyas endpoint' },
          { key: 'availability_sample', title: 'Availability API', description: 'Test availability data fetching' }
        ].map((test) => {
          const result = results[test.key];
          return (
            <Card key={test.key} className={`${getStatusColor(result)}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(result)}
                  {test.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                
                {result && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Status:</span>
                      <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                        {result.status} {result.success ? 'Success' : 'Error'}
                      </span>
                    </div>
                    
                    {result.error && (
                      <div className="bg-red-100 border border-red-200 rounded p-2">
                        <span className="font-semibold text-red-800">Error:</span>
                        <span className="text-red-700 ml-2">{result.error}</span>
                      </div>
                    )}
                    
                    {result.data && (
                      <div className="bg-gray-100 border border-gray-200 rounded p-2">
                        <span className="font-semibold">Data:</span>
                        <pre className="text-xs mt-1 overflow-auto max-h-32">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(errors).length > 0 && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(errors).map(([key, error]) => (
                <li key={key} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">{key}:</span>
                    <span className="ml-2 text-red-700">{error as string}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Check the test results above to identify which API is failing</li>
            <li>If authentication fails, make sure you're logged in as an admin</li>
            <li>If dahabiyas API fails, check if your "Azhar" dahabiya exists and is active</li>
            <li>If availability API fails, check database schema and permissions</li>
            <li>Copy any error messages and share them for further debugging</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
