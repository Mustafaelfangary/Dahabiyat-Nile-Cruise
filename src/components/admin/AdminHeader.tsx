"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  LogOut, 
  User, 
  Crown,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { useContent } from '@/hooks/useContent';

export function AdminHeader() {
  const { data: session } = useSession();
  const { getContent } = useContent();

  // Get dynamic logo from database, fallback to static
  const getAdminLogo = () => {
    return getContent('navbar_logo', '/images/logo.png');
  };

  return (
    <div className="bg-white border-b border-blue-200 shadow-sm sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-ocean-blue to-blue-500 p-1">
                <Image
                  src={getAdminLogo()}
                  alt="Admin Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain rounded-md"
                  onError={(e) => {
                    // Fallback to static logo if dynamic fails
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/logo.png';
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-black">
                  Admin Panel
                </h1>
                <p className="text-xs text-blue-600">
                  Dahabiyat Nile Cruise
                </p>
              </div>
            </Link>

            {/* Ocean Blue Separator */}
            <div className="hidden md:block text-ocean-blue text-lg">
              𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿
            </div>
          </div>

          {/* Right Side - Navigation and User */}
          <div className="flex items-center space-x-4">
            {/* Quick Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-black hover:bg-blue-50">
                  <Home className="w-4 h-4 mr-2" />
                  Site
                </Button>
              </Link>

              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-black hover:bg-blue-50">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>

              <Link href="/admin/settings">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-black hover:bg-blue-50">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>

            {/* User Info and Logout */}
            {session && (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-black flex items-center">
                    <Crown className="w-4 h-4 mr-1 text-ocean-blue" />
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-blue-600">
                    {session.user?.role || 'Admin'}
                  </p>
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-ocean-blue to-blue-500 rounded-full flex items-center justify-center">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-blue-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
