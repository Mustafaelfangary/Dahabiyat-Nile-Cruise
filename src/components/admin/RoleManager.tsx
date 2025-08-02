"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Shield, Users, Eye, Edit, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'GUIDE' | 'MANAGER' | 'ADMIN';
  isEmailVerified: boolean;
  loyaltyPoints: number;
  phone?: string;
  createdAt: string;
  _count?: {
    bookings: number;
    reviews: number;
  };
}

interface RoleManagerProps {
  user: User;
  currentUserRole: string;
  onRoleUpdate: (userId: string, newRole: string) => void;
}

const roleConfig = {
  USER: {
    label: 'User',
    color: 'bg-blue-100 text-blue-800',
    icon: Users,
    description: 'Regular customer with booking and review capabilities',
    permissions: ['View packages', 'Make bookings', 'Write reviews', 'Manage profile']
  },
  GUIDE: {
    label: 'Guide',
    color: 'bg-green-100 text-green-800',
    icon: Eye,
    description: 'Tour guide with limited content management access',
    permissions: ['All user permissions', 'View bookings', 'Update tour information', 'Manage itineraries']
  },
  MANAGER: {
    label: 'Manager',
    color: 'bg-orange-100 text-orange-800',
    icon: Edit,
    description: 'Manager with extensive administrative capabilities',
    permissions: ['All guide permissions', 'Manage users', 'View analytics', 'Content management', 'Booking management']
  },
  ADMIN: {
    label: 'Administrator',
    color: 'bg-red-100 text-red-800',
    icon: Shield,
    description: 'Full system access and control',
    permissions: ['All manager permissions', 'System settings', 'Role management', 'Database access', 'Security settings']
  }
};

export function RoleManager({ user, currentUserRole, onRoleUpdate }: RoleManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentRoleConfig = roleConfig[user.role];
  const RoleIcon = currentRoleConfig.icon;

  const handleRoleUpdate = async () => {
    if (selectedRole === user.role) {
      setIsDialogOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`User role updated to ${selectedRole}`);
        onRoleUpdate(user.id, selectedRole);
        setIsDialogOpen(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  };

  const canChangeRole = currentUserRole === 'ADMIN' && user.role !== 'ADMIN';

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RoleIcon className="w-5 h-5 text-gray-600" />
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <Badge className={currentRoleConfig.color}>
            {currentRoleConfig.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Email Verified:</span>
            <span className={`ml-2 ${user.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
              {user.isEmailVerified ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="font-medium">Loyalty Points:</span>
            <span className="ml-2 text-amber-600">{user.loyaltyPoints}</span>
          </div>
          {user.phone && (
            <div>
              <span className="font-medium">Phone:</span>
              <span className="ml-2">{user.phone}</span>
            </div>
          )}
          <div>
            <span className="font-medium">Member Since:</span>
            <span className="ml-2">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          {user._count && (
            <>
              <div>
                <span className="font-medium">Bookings:</span>
                <span className="ml-2">{user._count.bookings}</span>
              </div>
              <div>
                <span className="font-medium">Reviews:</span>
                <span className="ml-2">{user._count.reviews}</span>
              </div>
            </>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-2">Current Permissions:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {currentRoleConfig.permissions.map((permission, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                {permission}
              </li>
            ))}
          </ul>
        </div>

        {canChangeRole && (
          <div className="border-t pt-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Change Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change User Role</DialogTitle>
                  <DialogDescription>
                    Update the role for {user.name} ({user.email})
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select New Role:</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleConfig).map(([role, config]) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              <config.icon className="w-4 h-4" />
                              <span>{config.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedRole !== user.role && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-800">Role Change Impact:</p>
                          <p className="text-amber-700 mt-1">
                            {roleConfig[selectedRole as keyof typeof roleConfig].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRoleUpdate}
                    disabled={isUpdating || selectedRole === user.role}
                  >
                    {isUpdating ? 'Updating...' : 'Update Role'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
