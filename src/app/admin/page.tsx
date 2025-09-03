"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Users,
  Calendar,
  DollarSign,
  FileText,
  Package,
  Image,
  MapPin,
  Star,
  Crown,
  Ship,
  Mail,
  Bell,
  Settings,
  Code
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalPackages: 0
  });

  // Fetch dashboard data
  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch('/api/dashboard/metrics');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          totalBookings: statsData.overview?.totalBookings || 0,
          totalUsers: statsData.overview?.totalUsers || 0,
          totalRevenue: 0,
          totalPackages: statsData.overview?.totalPackages || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard</h1>
            <p className="text-gray-600">Preparing your admin panel...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show signin prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-6">Please sign in with your admin credentials to access the dashboard.</p>
            <Link href="/auth/signin?callbackUrl=/admin">
              <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-900 mb-4">Access Denied</h1>
            <p className="text-red-700 mb-6">You do not have the required permissions to access this area.</p>
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {session.user.name}</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Crown className="w-4 h-4 mr-1" />
              Admin
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                  <p className="text-xs text-green-600 mt-1">↗ Active reservations</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-purple-600 mt-1">↗ Registered customers</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Packages</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalPackages}</p>
                  <p className="text-xs text-blue-600 mt-1">↗ Available packages</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue}</p>
                  <p className="text-xs text-orange-600 mt-1">↗ This month</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Content Management */}
          <Link href="/admin/website">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Website Content</h3>
                <p className="text-sm text-gray-600">Manage homepage, pages, and content</p>
              </CardContent>
            </Card>
          </Link>

          {/* Dahabiyas Management */}
          <Link href="/admin/dahabiyas">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ship className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Dahabiyas</h3>
                <p className="text-sm text-gray-600">Manage fleet and vessel details</p>
              </CardContent>
            </Card>
          </Link>

          {/* Packages Management */}
          <Link href="/admin/packages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Packages</h3>
                <p className="text-sm text-gray-600">Create and manage cruise packages</p>
              </CardContent>
            </Card>
          </Link>

          {/* Blogs Management */}
          <Link href="/admin/blogs">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Blogs</h3>
                <p className="text-sm text-gray-600">Create and manage blog posts</p>
              </CardContent>
            </Card>
          </Link>

          {/* Bookings Management */}
          <Link href="/admin/bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Bookings</h3>
                <p className="text-sm text-gray-600">View and manage reservations</p>
              </CardContent>
            </Card>
          </Link>

          {/* User Management */}
          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Users</h3>
                <p className="text-sm text-gray-600">Manage user accounts and roles</p>
              </CardContent>
            </Card>
          </Link>

          {/* Media Library */}
          <Link href="/admin/media">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Media Library</h3>
                <p className="text-sm text-gray-600">Upload and manage images</p>
              </CardContent>
            </Card>
          </Link>

          {/* Itineraries */}
          <Link href="/admin/itineraries">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Itineraries</h3>
                <p className="text-sm text-gray-600">Create and manage journeys</p>
              </CardContent>
            </Card>
          </Link>

          {/* Email Templates */}
          <Link href="/admin/email-templates">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Templates</h3>
                <p className="text-sm text-gray-600">Design email layouts</p>
              </CardContent>
            </Card>
          </Link>

          {/* Settings */}
          <Link href="/admin/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Settings</h3>
                <p className="text-sm text-gray-600">System configuration</p>
              </CardContent>
            </Card>
          </Link>

          {/* Reviews */}
          <Link href="/admin/reviews">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Reviews</h3>
                <p className="text-sm text-gray-600">Manage customer reviews</p>
              </CardContent>
            </Card>
          </Link>

          {/* Notifications */}
          <Link href="/admin/notification-settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                <p className="text-sm text-gray-600">Configure notifications</p>
              </CardContent>
            </Card>
          </Link>

          {/* Developer Settings */}
          <Link href="/admin/developer-settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Developer</h3>
                <p className="text-sm text-gray-600">Advanced settings</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
