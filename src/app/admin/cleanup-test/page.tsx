'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CleanupTestPage() {
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<any>(null);

  const runCleanup = async () => {
    setIsCleaningUp(true);
    setCleanupResult(null);
    
    try {
      const response = await fetch('/api/admin/cleanup-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCleanupResult(result);
        toast.success('Cleanup completed successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Cleanup failed');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      toast.error(error instanceof Error ? error.message : 'Cleanup failed');
    } finally {
      setIsCleaningUp(false);
    }
  };

  const runAdvancedCleanup = async () => {
    setIsCleaningUp(true);
    setCleanupResult(null);
    
    try {
      const response = await fetch('/api/admin/cleanup-content-advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCleanupResult(result);
        toast.success('Advanced cleanup completed successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Advanced cleanup failed');
      }
    } catch (error) {
      console.error('Error during advanced cleanup:', error);
      toast.error(error instanceof Error ? error.message : 'Advanced cleanup failed');
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-hieroglyph-brown mb-2 flex items-center gap-2">
          <Trash2 className="text-egyptian-gold" />
          Content Cleanup Test
        </h1>
        <p className="text-gray-600">
          Test and run content cleanup operations to remove duplicates
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Basic Cleanup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Remove duplicate entries from WebsiteContent table, keeping the most recent version.
            </p>
            <Button
              onClick={runCleanup}
              disabled={isCleaningUp}
              className="w-full bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
            >
              {isCleaningUp ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running Cleanup...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Run Basic Cleanup
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Advanced Cleanup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Migrate content from Settings table to WebsiteContent and remove duplicates.
            </p>
            <Button
              onClick={runAdvancedCleanup}
              disabled={isCleaningUp}
              className="w-full bg-red-600 text-white hover:bg-red-700"
            >
              {isCleaningUp ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running Advanced Cleanup...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Run Advanced Cleanup
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {cleanupResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Cleanup Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(cleanupResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
