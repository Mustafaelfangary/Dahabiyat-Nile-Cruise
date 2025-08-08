"use client";

import React, { useState } from 'react';
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
  LayoutDashboard,
  Menu,
  X,
  Calendar
} from 'lucide-react';
import { useContent } from '@/hooks/useContent';

export function AdminHeader() {
  const { data: session } = useSession();
  const { getContent } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get dynamic logo from database, fallback to static
  const getAdminLogo = () => {
    return getContent('navbar_logo', '/images/logo.png');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 w-full">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16 w-full">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 p-1 flex-shrink-0">
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
              <div className="hidden xs:block min-w-0">
                <h1 className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-600 truncate">
                  Dahabiyat
                </p>
              </div>
            </Link>

            {/* Separator */}
            <div className="hidden lg:block text-blue-600 text-sm sm:text-lg flex-shrink-0">
              𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿
            </div>
          </div>

          {/* Right Side - Navigation and User */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            {/* Quick Navigation */}
            <div className="hidden sm:flex items-center space-x-1 lg:space-x-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 lg:px-3">
                  <Home className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Site</span>
                </Button>
              </Link>

              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 lg:px-3">
                  <LayoutDashboard className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
              </Link>

              <Link href="/admin/settings">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 lg:px-3">
                  <Settings className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Settings</span>
                </Button>
              </Link>
            </div>

            {/* User Info and Logout */}
            {session && (
              <div className="flex items-center space-x-1 sm:space-x-3">
                {/* User Info */}
                <div className="hidden md:block text-right min-w-0">
                  <p className="text-sm font-medium text-gray-900 flex items-center justify-end truncate">
                    <Crown className="w-4 h-4 mr-1 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{session.user?.name}</span>
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {session.user?.role || 'Admin'}
                  </p>
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
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
                  className="text-gray-700 hover:text-red-600 hover:bg-red-50 px-2 sm:px-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="px-2 py-3 space-y-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  <Home className="w-4 h-4 mr-3" />
                  Visit Site
                </Button>
              </Link>

              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  <LayoutDashboard className="w-4 h-4 mr-3" />
                  Dashboard
                </Button>
              </Link>

              <Link href="/admin/bookings" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  <Calendar className="w-4 h-4 mr-3" />
                  Bookings
                </Button>
              </Link>

              <Link href="/admin/settings" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Button>
              </Link>

              {session && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
