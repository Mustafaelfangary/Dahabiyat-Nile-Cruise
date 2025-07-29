"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Bell,
  Calendar,
  Ship,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Eye,
  Trash2,
  Filter,
  Crown
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

interface UserNotificationCenterProps {
  className?: string;
}

export default function UserNotificationCenter({ className }: UserNotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'bookings'>('all');

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/user/notifications');
      if (!response.ok) {
        // If unauthorized or not found, show empty state
        if (response.status === 401 || response.status === 404) {
          setNotifications([]);
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Show empty state instead of error for better UX
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId, read: true })
      });

      if (!response.ok) throw new Error('Failed to mark notification as read');
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/user/notifications?id=${notificationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete notification');
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_CREATED':
      case 'BOOKING_STATUS_CHANGED':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'DAHABIYA_BOOKING':
        return <Ship className="w-5 h-5 text-ocean-blue" />;
      case 'PACKAGE_BOOKING':
        return <Package className="w-5 h-5 text-amber-600" />;
      case 'PAYMENT_RECEIVED':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'BOOKING_CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'SYSTEM_ALERT':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'BOOKING_CREATED':
        return 'bg-blue-100 text-blue-800';
      case 'BOOKING_STATUS_CHANGED':
        return 'bg-purple-100 text-purple-800';
      case 'BOOKING_CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PAYMENT_RECEIVED':
        return 'bg-green-100 text-green-800';
      case 'SYSTEM_ALERT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'bookings':
        return notification.type.includes('BOOKING');
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl ${className}`}>
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                Royal Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600">Stay updated on your journeys</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-amber-200 rounded px-2 py-1 bg-white"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="bookings">Bookings</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications found</p>
            <p className="text-sm text-gray-400 mt-2">
              {filter === 'unread' ? 'All caught up!' : 'Your notifications will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title || notification.message}
                        </h4>
                        {notification.title && (
                          <p className={`text-sm mt-1 ${
                            notification.read ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getNotificationColor(notification.type)}>
                            {notification.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0 hover:bg-amber-100"
                          >
                            <CheckCircle className="w-4 h-4 text-amber-600" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
