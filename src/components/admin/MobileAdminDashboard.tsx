"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Calendar,
  Ship,
  Package,
  Bell,
  TrendingUp,
  Eye,
  Edit
} from 'lucide-react';

interface MobileAdminDashboardProps {
  stats: {
    totalBookings: number;
    totalUsers: number;
    totalRevenue: number;
  };
  className?: string;
}

export function MobileAdminDashboard({ stats, className }: MobileAdminDashboardProps) {
  const quickActions = [
    { icon: Calendar, label: 'View Bookings', href: '/admin/bookings', color: 'bg-blue-500' },
    { icon: Ship, label: 'Manage Dahabiyas', href: '/admin#dahabiyat', color: 'bg-ocean-blue' },
    { icon: Package, label: 'Manage Packages', href: '/admin#packages', color: 'bg-purple-500' },
    { icon: Bell, label: 'Notifications', href: '/admin/notifications', color: 'bg-orange-500' },
  ];

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className={`space-y-3 sm:space-y-4 md:space-y-6 px-2 sm:px-0 ${className}`}>
      {/* Stats Grid - Enhanced Mobile */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow border border-gray-200">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-black mb-1 truncate">
                    {stat.title}
                  </p>
                  <p className="text-base sm:text-lg md:text-2xl font-bold text-black truncate">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-1.5 sm:p-2 md:p-3 rounded-full ${stat.bgColor} flex-shrink-0`}>
                  <stat.icon className={`w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions - Enhanced Mobile */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2 text-black font-bold">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-2 sm:p-3 md:p-4 flex flex-col items-center gap-1 sm:gap-2 hover:shadow-md transition-all border-gray-300 hover:border-blue-400 min-h-[4rem] sm:min-h-[5rem]"
                onClick={() => window.location.href = action.href}
              >
                <div className={`p-1.5 sm:p-2 rounded-full ${action.color} text-white`}>
                  <action.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                  {action.label}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Enhanced Mobile */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2 text-black font-bold">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold truncate text-black">New booking received</p>
                  <p className="text-xs text-black font-medium">2 minutes ago</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="p-1 sm:p-2 flex-shrink-0">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-full flex-shrink-0">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold truncate text-black">New user registered</p>
                  <p className="text-xs text-black font-medium">1 hour ago</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="p-1 sm:p-2 flex-shrink-0">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Package updated</p>
                  <p className="text-xs text-black font-medium">3 hours ago</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
