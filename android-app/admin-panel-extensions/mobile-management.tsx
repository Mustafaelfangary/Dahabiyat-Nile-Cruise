// Mobile Management Component for Admin Panel
// Add this to your existing admin panel

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Users, 
  Bell, 
  Settings, 
  BarChart3, 
  Download,
  Send,
  Eye,
  Trash2
} from 'lucide-react';

export default function MobileManagement() {
  const [mobileUsers, setMobileUsers] = useState([]);
  const [appConfig, setAppConfig] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState({});

  // Fetch mobile data
  useEffect(() => {
    fetchMobileUsers();
    fetchAppConfig();
    fetchNotifications();
    fetchAnalytics();
  }, []);

  const fetchMobileUsers = async () => {
    try {
      const response = await fetch('/api/admin/mobile/users');
      const data = await response.json();
      setMobileUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching mobile users:', error);
    }
  };

  const fetchAppConfig = async () => {
    try {
      const response = await fetch('/api/admin/mobile/config');
      const data = await response.json();
      setAppConfig(data.config || {});
    } catch (error) {
      console.error('Error fetching app config:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/mobile/notifications');
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/mobile/analytics');
      const data = await response.json();
      setAnalytics(data.analytics || {});
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const sendPushNotification = async (notificationData) => {
    try {
      const response = await fetch('/api/admin/mobile/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
      
      if (response.ok) {
        alert('Notification sent successfully!');
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const updateAppConfig = async (config) => {
    try {
      const response = await fetch('/api/admin/mobile/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (response.ok) {
        alert('App configuration updated!');
        fetchAppConfig();
      }
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Smartphone className="w-8 h-8 text-ocean-blue" />
        <h1 className="text-3xl font-bold">Mobile App Management</h1>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Mobile Users
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Push Notifications
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            App Configuration
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Offline Content
          </TabsTrigger>
        </TabsList>

        {/* Mobile Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mobileUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-ocean-blue rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">
                            {user.platform} {user.appVersion}
                          </Badge>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="text-sm">{new Date(user.lastAppLogin).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{user.totalBookings} bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Push Notifications Tab */}
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Send Notification */}
            <Card>
              <CardHeader>
                <CardTitle>Send Push Notification</CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationSender onSend={sendPushNotification} />
              </CardContent>
            </Card>

            {/* Notification History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="p-3 border rounded-lg">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline">
                          {notification.recipientCount} recipients
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.sentAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* App Configuration Tab */}
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>App Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <AppConfigEditor config={appConfig} onUpdate={updateAppConfig} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Downloads</p>
                    <p className="text-2xl font-bold">{analytics.totalDownloads || 0}</p>
                  </div>
                  <Download className="w-8 h-8 text-ocean-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold">{analytics.activeUsers || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-ocean-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Mobile Bookings</p>
                    <p className="text-2xl font-bold">{analytics.mobileBookings || 0}</p>
                  </div>
                  <Smartphone className="w-8 h-8 text-ocean-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Session</p>
                    <p className="text-2xl font-bold">{analytics.avgSession || '0m'}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-ocean-blue" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Offline Content Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Offline Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <OfflineContentManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Notification Sender Component
function NotificationSender({ onSend }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');

  const handleSend = () => {
    if (!title || !message) {
      alert('Please fill in title and message');
      return;
    }

    onSend({
      title,
      message,
      target,
      data: {
        type: 'general',
        timestamp: new Date().toISOString()
      }
    });

    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Notification Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Notification Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
      />
      <select
        className="w-full p-2 border rounded-md"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      >
        <option value="all">All Users</option>
        <option value="android">Android Users Only</option>
        <option value="recent">Recent Users</option>
      </select>
      <Button onClick={handleSend} className="w-full">
        <Send className="w-4 h-4 mr-2" />
        Send Notification
      </Button>
    </div>
  );
}

// App Config Editor Component
function AppConfigEditor({ config, onUpdate }) {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleUpdate = () => {
    onUpdate(localConfig);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">App Version</label>
          <Input
            value={localConfig.appVersion || ''}
            onChange={(e) => setLocalConfig({...localConfig, appVersion: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Minimum Version</label>
          <Input
            value={localConfig.minAppVersion || ''}
            onChange={(e) => setLocalConfig({...localConfig, minAppVersion: e.target.value})}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={localConfig.maintenanceMode || false}
            onChange={(e) => setLocalConfig({...localConfig, maintenanceMode: e.target.checked})}
          />
          Maintenance Mode
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={localConfig.forceUpdate || false}
            onChange={(e) => setLocalConfig({...localConfig, forceUpdate: e.target.checked})}
          />
          Force Update
        </label>
      </div>

      <Button onClick={handleUpdate}>
        Update Configuration
      </Button>
    </div>
  );
}

// Offline Content Manager Component
function OfflineContentManager() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Manage content that will be cached in the mobile app for offline viewing.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Dahabiyas</h3>
            <p className="text-sm text-gray-600 mb-3">12 items cached</p>
            <Button size="sm" variant="outline">Update Cache</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Packages</h3>
            <p className="text-sm text-gray-600 mb-3">8 items cached</p>
            <Button size="sm" variant="outline">Update Cache</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Gallery</h3>
            <p className="text-sm text-gray-600 mb-3">45 images cached</p>
            <Button size="sm" variant="outline">Update Cache</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
