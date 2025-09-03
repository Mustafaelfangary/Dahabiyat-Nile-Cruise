'use client';

import { useState, useEffect } from 'react';

export default function TestAPIPage() {
  const [homepageData, setHomepageData] = useState<Array<{
    key: string;
    title: string;
    content: string;
    contentType: string;
    section: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🔍 Testing API...');
        const response = await fetch(`/api/website-content?page=homepage&t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📊 API Response:', data);
        setHomepageData(data);
      } catch (err) {
        console.error('❌ API Test Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing API...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">API Test Failed</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Group by section
  const sections: Record<string, Array<{
    key: string;
    title: string;
    content: string;
    contentType: string;
    section: string;
  }>> = {};
  homepageData.forEach(item => {
    if (!sections[item.section]) {
      sections[item.section] = [];
    }
    sections[item.section].push(item);
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Results</h1>
      <p className="mb-4">Total items: <strong>{homepageData.length}</strong></p>
      
      <div className="space-y-6">
        {Object.keys(sections).sort().map(sectionName => (
          <div key={sectionName} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              📂 {sectionName} ({sections[sectionName].length} items)
            </h2>
            
            <div className="space-y-2">
              {sections[sectionName].map((item, index) => (
                <div key={item.key} className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                  <div className="font-medium text-gray-800">{item.key}</div>
                  <div className="text-sm text-gray-600">Title: {item.title}</div>
                  <div className="text-sm text-gray-600">Type: {item.contentType}</div>
                  <div className="text-sm text-gray-500">
                    Content: {(item.content || '').substring(0, 100)}
                    {(item.content || '').length > 100 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Raw JSON Data:</h3>
        <pre className="text-xs overflow-auto max-h-96 bg-white p-2 rounded border">
          {JSON.stringify(homepageData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
