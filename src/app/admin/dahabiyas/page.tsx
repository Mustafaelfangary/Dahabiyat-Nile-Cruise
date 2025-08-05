"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DahabiyaManager from '@/components/admin/DahabiyaManager';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock, RefreshCw } from 'lucide-react';

export default function AdminDahabiyasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin?callbackUrl=/admin/dahabiyas');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [session, status, router]);

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You need administrator privileges to access dahabiya management.
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
              >
                Back to Admin
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dahabiya Management</h1>
            <p className="text-gray-600">Manage your fleet of luxury dahabiyas</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        <DahabiyaManager />
      </div>
    </div>
  );
}
