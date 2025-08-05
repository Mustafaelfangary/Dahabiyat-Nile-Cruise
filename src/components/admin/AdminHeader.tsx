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
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-egyptian-gold to-amber-500 p-1">
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
                <h1 className="text-lg font-bold text-slate-800">
                  Admin Panel
                </h1>
                <p className="text-xs text-slate-500">
                  Dahabiyat Nile Cruise
                </p>
              </div>
            </Link>

            {/* Pharaonic Separator */}
            <div className="hidden md:block text-egyptian-gold text-lg">
              𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿
            </div>
          </div>

          {/* Right Side - Navigation and User */}
          <div className="flex items-center space-x-4">
            {/* Quick Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                  <Home className="w-4 h-4 mr-2" />
                  Site
                </Button>
              </Link>
              
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>

              <Link href="/admin/settings">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
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
                  <p className="text-sm font-medium text-slate-800 flex items-center">
                    <Crown className="w-4 h-4 mr-1 text-egyptian-gold" />
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.user?.role || 'Admin'}
                  </p>
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-egyptian-gold to-amber-500 rounded-full flex items-center justify-center">
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
                  className="text-slate-600 hover:text-red-600 hover:bg-red-50"
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
