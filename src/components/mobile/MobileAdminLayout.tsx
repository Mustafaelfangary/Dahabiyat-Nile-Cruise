"use client";

import { ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useContent } from '@/hooks/useContent';
import { 
  Settings, 
  Users, 
  Ship, 
  Package, 
  Mail, 
  BarChart3, 
  FileText,
  Home,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface MobileAdminLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3, hieroglyph: '𓇳' },
  { href: '/admin/website', label: 'Website Content', icon: FileText, hieroglyph: '𓂋' },
  { href: '/admin/dahabiyas', label: 'Dahabiyas', icon: Ship, hieroglyph: '𓊪' },
  { href: '/admin/packages', label: 'Packages', icon: Package, hieroglyph: '𓈖' },
  { href: '/admin/bookings', label: 'Bookings', icon: FileText, hieroglyph: '𓂋' },
  { href: '/admin/users', label: 'Users', icon: Users, hieroglyph: '𓂀' },
  { href: '/admin/loyalty-system', label: 'Loyalty System', icon: Settings, hieroglyph: '𓇳' },
  { href: '/admin/email-settings', label: 'Email', icon: Mail, hieroglyph: '𓏏' },
  { href: '/admin/developer-settings', label: 'Developer Settings', icon: Settings, hieroglyph: '𓊪' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, hieroglyph: '𓇳' },
];

export default function MobileAdminLayout({ 
  children, 
  title = "Admin Panel",
  showBackButton = true 
}: MobileAdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { getContent } = useContent();

  // Get dynamic logo from database, fallback to static
  const getMobileLogo = () => {
    return getContent('navbar_logo', '/images/logo.png');
  };

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="lg:hidden min-h-screen bg-gray-50">
      {/* Mobile Admin Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Side */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}

            {/* Logo */}
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-egyptian-gold to-deep-blue-500 p-1">
              <Image
                src={getMobileLogo()}
                alt="Admin Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain rounded-md"
                onError={(e) => {
                  // Fallback to static logo if dynamic fails
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/logo.png';
                }}
              />
            </div>

            <div>
              <h1 className="font-bold text-lg text-slate-800">{title}</h1>
              <p className="text-xs text-slate-500">Mobile Admin</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Home className="w-5 h-5 text-gray-600" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Admin Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Sidebar Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Logo in Sidebar */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/20 p-1">
                      <Image
                        src={getMobileLogo()}
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
                    <div>
                      <h2 className="text-xl font-bold">Admin Panel</h2>
                      <p className="text-blue-100 text-sm mt-1">Dahabiyat</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="p-4 space-y-2">
                {adminNavItems.map((item, index) => {
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="text-lg">{item.hieroglyph}</span>
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/admin/email-settings"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Email Settings</span>
                  </Link>
                  <Link
                    href="/admin/bookings"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">View Bookings</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-20 pb-6">
        <div className="px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
