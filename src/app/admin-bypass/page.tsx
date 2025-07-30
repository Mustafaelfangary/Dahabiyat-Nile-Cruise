"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Crown, Users, Ship, Package, Settings, BarChart3, Mail, FileText } from 'lucide-react';

export default function AdminBypassPage() {
  const { data: session, status } = useSession();
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Fetch session data from API
    fetch('/api/debug/session')
      .then(res => res.json())
      .then(data => {
        console.log('Session API response:', data);
        setSessionData(data);
      })
      .catch(err => console.error('Session fetch error:', err));
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-amber-700">Loading session...</p>
        </div>
      </div>
    );
  }

  const isAdmin = session?.user?.role === 'ADMIN' || sessionData?.isAdmin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10 text-amber-600" />
            </div>
            <CardTitle className="text-4xl font-bold text-amber-900">
              👑 Admin Control Panel 👑
            </CardTitle>
            <p className="text-amber-700 text-lg">
              Direct access to administrative functions
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Client Session:</h3>
                <div className="text-sm bg-gray-100 p-3 rounded">
                  <p><strong>Status:</strong> {status}</p>
                  <p><strong>Role:</strong> {session?.user?.role || 'None'}</p>
                  <p><strong>Email:</strong> {session?.user?.email || 'None'}</p>
                  <p><strong>Name:</strong> {session?.user?.name || 'None'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Server Session:</h3>
                <div className="text-sm bg-gray-100 p-3 rounded">
                  {sessionData ? (
                    <>
                      <p><strong>Authenticated:</strong> {sessionData.isAuthenticated ? 'Yes' : 'No'}</p>
                      <p><strong>Is Admin:</strong> {sessionData.isAdmin ? 'Yes' : 'No'}</p>
                      <p><strong>Server Role:</strong> {sessionData.session?.user?.role || 'None'}</p>
                    </>
                  ) : (
                    <p>Loading server session...</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Functions */}
        {isAdmin ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-green-800">✅ Admin Access Granted</CardTitle>
                <p className="text-green-600">You have administrative privileges</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Dashboard */}
                  <Button 
                    onClick={() => window.open('/admin', '_blank')}
                    className="h-24 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <BarChart3 className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Button>

                  {/* Users */}
                  <Button
                    onClick={() => window.open('/admin/users', '_blank')}
                    className="h-24 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Users className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Users & Admins</span>
                  </Button>

                  {/* Dahabiyas */}
                  <Button 
                    onClick={() => window.open('/admin/dahabiyas', '_blank')}
                    className="h-24 flex flex-col items-center justify-center bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <Ship className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Dahabiyas</span>
                  </Button>

                  {/* Packages */}
                  <Button 
                    onClick={() => window.open('/admin/packages', '_blank')}
                    className="h-24 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Package className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Packages</span>
                  </Button>

                  {/* Bookings */}
                  <Button 
                    onClick={() => window.open('/admin/bookings', '_blank')}
                    className="h-24 flex flex-col items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <FileText className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Bookings</span>
                  </Button>

                  {/* Email Settings */}
                  <Button 
                    onClick={() => window.open('/admin/email-settings', '_blank')}
                    className="h-24 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Mail className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Email</span>
                  </Button>

                  {/* Settings */}
                  <Button 
                    onClick={() => window.open('/admin/settings', '_blank')}
                    className="h-24 flex flex-col items-center justify-center bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    <Settings className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Settings</span>
                  </Button>

                  {/* Direct Link */}
                  <Button 
                    onClick={() => window.location.href = '/admin'}
                    className="h-24 flex flex-col items-center justify-center bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Crown className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Direct Access</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-red-800">❌ Admin Access Denied</CardTitle>
              <p className="text-red-600">You need admin privileges to access this panel</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Current role: <strong>{session?.user?.role || 'Not logged in'}</strong>
                </p>
                <div className="flex gap-4">
                  <Link href="/admin-login">
                    <Button className="bg-amber-600 hover:bg-amber-700">
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
