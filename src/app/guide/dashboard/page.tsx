"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Eye,
  FileText,
  Camera,
  Star,
  Clock
} from 'lucide-react';

export default function GuideDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin?callbackUrl=/guide/dashboard');
      return;
    }

    if (session.user.role !== 'GUIDE' && session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN') {
      router.push('/profile');
      return;
    }

    loadDashboardStats();
  }, [session, status, router]);

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/guide/dashboard-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!session || !['GUIDE', 'MANAGER', 'ADMIN'].includes(session.user.role)) {
    return null;
  }

  const quickActions = [
    {
      title: 'View Bookings',
      description: 'Check upcoming tours and bookings',
      icon: Calendar,
      href: '/guide/bookings',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Itineraries',
      description: 'Update tour routes and information',
      icon: MapPin,
      href: '/guide/itineraries',
      color: 'bg-green-500'
    },
    {
      title: 'Tour Reports',
      description: 'Submit tour completion reports',
      icon: FileText,
      href: '/guide/reports',
      color: 'bg-purple-500'
    },
    {
      title: 'Photo Gallery',
      description: 'Upload tour photos',
      icon: Camera,
      href: '/guide/gallery',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Guide Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {session.user.name}
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Eye className="w-4 h-4 mr-1" />
              Guide
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming Tours</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.upcomingTours || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Guests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalGuests || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Tours</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedTours || 0}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.averageRating ? `${stats.averageRating}/5` : 'N/A'}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-gray-50"
                  onClick={() => router.push(action.href)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-md ${action.color}`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    {action.description}
                  </p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Morning Briefing</p>
                  <p className="text-sm text-gray-600">9:00 AM - Tour preparation</p>
                </div>
                <Badge variant="outline">Upcoming</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Luxor Temple Tour</p>
                  <p className="text-sm text-gray-600">10:30 AM - 12 guests</p>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Valley of Kings</p>
                  <p className="text-sm text-gray-600">2:00 PM - 8 guests</p>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guide Permissions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Guide Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">View assigned bookings and tours</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Update itinerary information</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Submit tour reports and photos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Communicate with guests</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Limited content editing access</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
