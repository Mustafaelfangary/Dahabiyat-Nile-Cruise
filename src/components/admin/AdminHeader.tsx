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
  Calendar,
  Ship,
  Package,
  Users,
  FileText,
  Mail,
  ChevronDown,
  Globe,
  Palette,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { useContent } from '@/hooks/useContent';

export function AdminHeader() {
  const { data: session } = useSession();
  const { getContent } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Main admin navigation items
  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/dahabiyas', label: 'Dahabiyas', icon: Ship },
    { href: '/admin/packages', label: 'Packages', icon: Package },
    {
      href: '/admin/blogs',
      label: 'Blogs',
      icon: FileText,
      submenu: [
        { href: '/admin/blogs', label: 'Manage Blogs', icon: FileText },
        { href: '/admin/blogs/new', label: 'Add New Blog', icon: Plus }
      ]
    },
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  // Website dropdown items
  const websiteDropdownItems = [
    { href: '/admin/website', label: 'Website Content', icon: FileText, description: 'Manage page content' },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon, description: 'Upload and manage media' },
    { href: '/admin/blogs', label: 'Blog Management', icon: FileText, description: 'Create and edit blogs' },
    { href: '/admin/gallery', label: 'Gallery', icon: Palette, description: 'Manage photo galleries' },
    { href: '/admin/email-templates', label: 'Email Templates', icon: Mail, description: 'Design email layouts' },
  ];

  // Get dynamic logo from database, fallback to static
  const getAdminLogo = () => {
    return getContent('navbar_logo', '/images/logo.png');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 w-full">
      {/* Main Admin Header - Mobile Enhanced */}
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-12 sm:h-14 md:h-16 w-full">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-1">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 min-w-0">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 sm:p-1 flex-shrink-0">
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
              <div className="hidden sm:block min-w-0">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-black truncate">
                  Admin Panel
                </h1>
                <p className="text-xs sm:text-sm text-black truncate font-semibold">
                  Dahabiyat
                </p>
              </div>
            </Link>

            {/* Mobile Title - Visible on small screens */}
            <div className="block sm:hidden min-w-0 flex-1">
              <h1 className="text-sm font-bold text-black truncate text-center">
                Admin
              </h1>
            </div>

            {/* Separator */}
            <div className="hidden lg:block text-blue-600 text-sm sm:text-lg flex-shrink-0">
              𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
            </div>
          </div>

          {/* Right Side - Navigation and User */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden text-black p-1.5 min-w-0 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            {/* Quick Navigation */}
            <div className="hidden sm:flex items-center space-x-1 lg:space-x-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-700 px-2 lg:px-3">
                  <Home className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Site</span>
                </Button>
              </Link>

              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-gray-700 px-2 lg:px-3">
                  <LayoutDashboard className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
              </Link>

              <Link href="/admin/settings">
                <Button variant="ghost" size="sm" className="text-gray-700 px-2 lg:px-3">
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
                  className="text-gray-700 px-2 sm:px-3"
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
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700">
                  <Home className="w-4 h-4 mr-3" />
                  Visit Site
                </Button>
              </Link>

              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700">
                  <LayoutDashboard className="w-4 h-4 mr-3" />
                  Dashboard
                </Button>
              </Link>

              {adminNavItems.slice(1).map((item) => {
                const Icon = item.icon;

                // Handle blogs submenu
                if (item.submenu) {
                  return (
                    <div key={item.href} className="space-y-1">
                      <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700">
                          <Icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Button>
                      </Link>
                      <div className="pl-6 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <Link key={subItem.href} href={subItem.href} onClick={() => setMobileMenuOpen(false)}>
                              <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600">
                                <SubIcon className="w-3 h-3 mr-3" />
                                <span className="text-xs">{subItem.label}</span>
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700">
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              {/* Website submenu items in mobile */}
              <div className="pl-4 border-l-2 border-gray-200 ml-2">
                <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  Website
                </div>
                {websiteDropdownItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 mb-1">
                        <Icon className="w-3 h-3 mr-3" />
                        <span className="text-xs">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {session && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full justify-start text-red-600"
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
