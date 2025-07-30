"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserPlus, Download, Shield, Crown, User, ArrowLeft, Eye, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersManagement() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN'
  });

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await fetch('/api/admin/export/users');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `users-export-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to export users');
      }
    } catch (error) {
      console.error('Error exporting users:', error);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Admin user created successfully!');
        setShowCreateModal(false);
        setFormData({ name: '', email: '', password: '', role: 'ADMIN' });
        fetchUsers(); // Refresh the users list
      } else {
        toast.error(data.message || 'Failed to create admin user');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Failed to create admin user');
    } finally {
      setCreateLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="admin-container admin-font-pharaonic flex items-center justify-center">
        <Card className="admin-card w-96">
          <CardContent className="p-8 text-center">
            <div className="admin-spinner"></div>
            <h1 className="text-2xl font-bold text-amber-900 mb-2">𓇳 Loading Users 𓇳</h1>
            <p className="text-amber-700 admin-text-justify">
              Accessing the royal archives and retrieving user information from the pharaonic database...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center admin-font-pharaonic">
        <Card className="admin-card w-96 border-red-200">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-900 mb-4">𓊪 Access Denied 𓊪</h1>
            <p className="text-red-700 mb-6 admin-text-justify">
              You do not have the royal privileges required to access this chamber. Only those blessed with administrative powers may enter these hallowed halls.
            </p>
            <a href="/admin">
              <Button className="bg-red-600 hover:bg-red-700 admin-focus flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Dashboard
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-container admin-font-pharaonic">
      {/* Pharaonic Header */}
      <div className="admin-header">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full shadow-lg">
                <Crown className="w-8 h-8 text-amber-900" />
              </div>
              <div>
                <h1 className="admin-header-title">
                  𓇳 User Management 𓇳
                </h1>
                <p className="admin-header-subtitle admin-text-justify">
                  Royal Administration of Users and Their Privileges
                </p>
              </div>
            </div>
            <a href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200 shadow-lg admin-focus flex items-center gap-1 h-8 text-xs font-medium"
              >
                <ArrowLeft className="w-3 h-3" />
                Return to Dashboard
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="admin-stat-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
              <span className="admin-stat-label text-blue-900">Total Users</span>
            </div>
            <div className="admin-stat-number text-blue-800">{users.length}</div>
            <p className="admin-stat-description admin-text-justify">
              Complete registry of all users enrolled in the royal dahabiya system, including administrators and valued customers.
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Crown className="w-6 h-6 text-purple-700" />
              </div>
              <span className="admin-stat-label text-purple-900">Admin Users</span>
            </div>
            <div className="admin-stat-number text-purple-800">
              {users.filter(u => u.role === 'ADMIN').length}
            </div>
            <p className="admin-stat-description admin-text-justify">
              Royal administrators blessed with full privileges to manage the dahabiya fleet and oversee all operations.
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <User className="w-6 h-6 text-green-700" />
              </div>
              <span className="admin-stat-label text-green-900">Customer Users</span>
            </div>
            <div className="admin-stat-number text-green-800">
              {users.filter(u => u.role === 'USER').length}
            </div>
            <p className="admin-stat-description admin-text-justify">
              Valued customers and distinguished guests who have chosen to embark on magical journeys along the eternal Nile.
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-amber-700" />
              </div>
              <span className="admin-stat-label text-amber-900">Active Sessions</span>
            </div>
            <div className="admin-stat-number text-amber-800">
              {users.filter(u => u.role === 'ADMIN').length + users.filter(u => u.role === 'USER').length}
            </div>
            <p className="admin-stat-description admin-text-justify">
              Currently active user sessions within the royal system, representing ongoing engagement with our services.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="admin-card mb-8">
          <CardHeader className="admin-card-header">
            <CardTitle className="admin-card-title">
              <UserPlus className="w-6 h-6" />
              <span>𓊪 Quick Actions 𓊪</span>
            </CardTitle>
            <p className="admin-card-description">
              Perform administrative tasks with royal efficiency and precision. These powerful tools allow you to manage users, export data, and configure permissions with the wisdom of the pharaohs.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button className="admin-btn-secondary h-12 admin-focus">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add New Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white border-2 border-amber-200 shadow-2xl">
                  <DialogHeader className="pb-4 border-b border-amber-100">
                    <DialogTitle className="flex items-center gap-2 text-amber-800 text-xl font-bold">
                      <Crown className="w-6 h-6 text-amber-600" />
                      Create New Admin User
                    </DialogTitle>
                    <p className="text-amber-600 text-sm mt-2">
                      Add a new administrator to the royal system
                    </p>
                  </DialogHeader>
                  <form onSubmit={handleCreateAdmin} className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-amber-800 font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        required
                        className="border-2 border-amber-200 focus:border-amber-400 focus:ring-amber-200 bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-amber-800 font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        required
                        className="border-2 border-amber-200 focus:border-amber-400 focus:ring-amber-200 bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-amber-800 font-semibold">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password (min 6 characters)"
                        required
                        minLength={6}
                        className="border-2 border-amber-200 focus:border-amber-400 focus:ring-amber-200 bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-amber-800 font-semibold">
                        Role *
                      </Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger className="border-2 border-amber-200 focus:border-amber-400 focus:ring-amber-200 bg-white text-gray-900">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-amber-200">
                          <SelectItem value="ADMIN" className="text-gray-900 hover:bg-amber-50">
                            👑 Admin
                          </SelectItem>
                          <SelectItem value="USER" className="text-gray-900 hover:bg-amber-50">
                            👤 User
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-amber-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateModal(false)}
                        disabled={createLoading}
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={createLoading}
                      >
                        {createLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Creating Admin...
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 mr-2" />
                            Create Admin User
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                className="admin-btn-primary h-12 admin-focus"
                onClick={handleExportUsers}
              >
                <Download className="w-5 h-5 mr-2" />
                Export User List
              </Button>
              <Button className="admin-btn-secondary h-12 admin-focus">
                <Shield className="w-5 h-5 mr-2" />
                User Permissions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="admin-card">
          <CardHeader className="admin-card-header">
            <CardTitle className="admin-card-title">
              <Users className="w-6 h-6" />
              <span>𓇳 All Users 𓇳</span>
            </CardTitle>
            <p className="admin-card-description">
              Complete registry of all users in the royal system with their roles and privileges. This comprehensive archive contains detailed information about every soul who has joined our pharaonic journey.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-text-justify">
                        User Details
                      </th>
                      <th className="admin-text-justify">
                        Role & Status
                      </th>
                      <th className="admin-text-justify">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              user.role === 'ADMIN' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                            }`}>
                              {user.role === 'ADMIN' ? <Crown className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-900">
                                {user.name || user.email}
                              </div>
                              <div className="text-sm text-gray-600 admin-text-justify">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge
                            className={`admin-badge ${
                              user.role === 'ADMIN'
                                ? 'admin-badge-purple'
                                : 'admin-badge-blue'
                            }`}
                          >
                            {user.role === 'ADMIN' ? '👑 Royal Admin' : '👤 Customer'}
                          </Badge>
                          <div className="text-sm text-gray-600 mt-1">
                            Active Member
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 admin-focus">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 admin-focus">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 admin-focus">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-loading flex-col py-16">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Users Found</h3>
                <p className="text-gray-600 admin-text-justify max-w-md mx-auto mb-6">
                  The royal archives appear to be empty. Begin by adding the first administrator to establish the kingdom's digital presence and unlock the full potential of this powerful system.
                </p>
                <Button className="admin-btn-primary admin-focus">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add First User
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
