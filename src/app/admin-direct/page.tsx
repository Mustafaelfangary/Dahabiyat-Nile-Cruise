"use client";

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Crown, Shield, Users, Ship, Package, Settings } from 'lucide-react';

export default function AdminDirectPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-ocean-blue-lightest to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-ocean-blue">
              👑 Direct Admin Access 👑
            </CardTitle>
            <p className="text-blue-700">
              Bypass middleware for testing admin functionality
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Session Status:</h3>
                <p className="text-sm bg-gray-100 p-2 rounded">{status}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">User Role:</h3>
                <p className="text-sm bg-gray-100 p-2 rounded">
                  {session?.user?.role || 'Not logged in'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">User Email:</h3>
                <p className="text-sm bg-gray-100 p-2 rounded">
                  {session?.user?.email || 'Not logged in'}
                </p>
              </div>

              {session?.user?.role === 'ADMIN' ? (
                <div className="p-4 bg-green-100 border border-green-300 rounded">
                  <p className="text-green-800 font-semibold mb-4">✅ You are logged in as ADMIN</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/admin" className="block">
                      <Button className="w-full h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700">
                        <Crown className="w-6 h-6 mb-2" />
                        <span>Main Dashboard</span>
                      </Button>
                    </Link>
                    
                    <Link href="/admin/users" className="block">
                      <Button className="w-full h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700">
                        <Users className="w-6 h-6 mb-2" />
                        <span>User Management</span>
                      </Button>
                    </Link>
                    
                    <Link href="/admin/dahabiyas" className="block">
                      <Button className="w-full h-20 flex flex-col items-center justify-center bg-teal-600 hover:bg-teal-700">
                        <Ship className="w-6 h-6 mb-2" />
                        <span>Dahabiyas</span>
                      </Button>
                    </Link>
                    
                    <Link href="/admin/packages" className="block">
                      <Button className="w-full h-20 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700">
                        <Package className="w-6 h-6 mb-2" />
                        <span>Packages</span>
                      </Button>
                    </Link>
                    
                    <Link href="/admin/settings" className="block">
                      <Button className="w-full h-20 flex flex-col items-center justify-center bg-gray-600 hover:bg-gray-700">
                        <Settings className="w-6 h-6 mb-2" />
                        <span>Settings</span>
                      </Button>
                    </Link>
                    
                    <Button 
                      onClick={() => window.open('/admin', '_blank')}
                      className="w-full h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                    >
                      <Shield className="w-6 h-6 mb-2" />
                      <span>Open in New Tab</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-100 border border-red-300 rounded">
                  <p className="text-red-800 font-semibold">❌ You are NOT logged in as admin</p>
                  <p className="text-red-600 text-sm mt-1">
                    Current role: {session?.user?.role || 'Not logged in'}
                  </p>
                  <div className="mt-4 space-x-2">
                    <Link href="/admin-login">
                      <Button className="bg-red-600 hover:bg-red-700">
                        Admin Login
                      </Button>
                    </Link>
                    <Link href="/auth/signin">
                      <Button variant="outline">
                        Regular Login
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
