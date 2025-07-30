"use client";

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DebugSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Session Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Status:</h3>
              <p className="text-sm bg-gray-100 p-2 rounded">{status}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Session Data:</h3>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Quick Actions:</h3>
              <div className="flex gap-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" size="sm">Try Admin Access</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="sm">Home</Button>
                </Link>
              </div>
            </div>

            {session?.user?.role === 'ADMIN' ? (
              <div className="p-4 bg-green-100 border border-green-300 rounded">
                <p className="text-green-800 font-semibold">✅ You are logged in as ADMIN</p>
                <Link href="/admin">
                  <Button className="mt-2 bg-green-600 hover:bg-green-700">
                    Go to Admin Panel
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-4 bg-red-100 border border-red-300 rounded">
                <p className="text-red-800 font-semibold">❌ You are NOT logged in as admin</p>
                <p className="text-red-600 text-sm mt-1">
                  Current role: {session?.user?.role || 'Not logged in'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
