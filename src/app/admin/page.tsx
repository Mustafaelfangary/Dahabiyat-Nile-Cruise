"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
// import { NotificationCenter } from '@/components/dashboard/NotificationCenter'; // Removed - dashboard components deleted
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WebsiteContentManager } from '@/components/admin/WebsiteContentManager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Package,
  Image,
  MapPin,
  Plus,
  Star,
  Home,
  Phone,
  Video,
  Palette,
  Wand2,
  Info,
  Crown,
  Gem,
  Sparkles,
  Zap,
  Anchor,
  Ship,
  Compass,
  Mail,
  Bell
} from 'lucide-react';
import { FeaturedItemsManager } from '@/components/admin/FeaturedItemsManager';
import { SiteNamePreview } from '@/components/admin/SiteNamePreview';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [packages, setPackages] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);



  // Fetch dashboard data
  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/dashboard/metrics');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }



      // Fetch packages
      const packagesRes = await fetch('/api/packages');
      if (packagesRes.ok) {
        const packagesData = await packagesRes.json();
        setPackages(packagesData.packages || []);
      }

      // Fetch bookings (admin gets all bookings)
      const bookingsRes = await fetch('/api/bookings?all=true');
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="admin-container admin-font-pharaonic flex items-center justify-center">
        <Card className="admin-card w-96">
          <CardContent className="p-8 text-center">
            <div className="admin-spinner"></div>
            <h1 className="text-2xl font-bold text-amber-900 mb-2">𓇳 Loading Dashboard 𓇳</h1>
            <p className="text-amber-700 admin-text-justify">
              Accessing the royal administrative chambers and preparing your pharaonic command center...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show signin prompt if not authenticated
  if (!session) {
    return (
      <div className="admin-container admin-font-pharaonic flex items-center justify-center">
        <Card className="admin-card w-96">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-amber-900 mb-4">𓊪 Admin Access Required 𓊪</h1>
            <p className="text-amber-700 mb-6 admin-text-justify">
              Please sign in with your royal credentials to access the pharaonic administrative dashboard.
            </p>
            <a href="/auth/signin?callbackUrl=/admin">
              <Button className="admin-btn-primary admin-focus">
                Sign In
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (session.user.role !== 'ADMIN') {
    return (
      <div className="admin-container admin-font-pharaonic flex items-center justify-center">
        <Card className="admin-card w-96">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-900 mb-4">𓊪 Access Denied 𓊪</h1>
            <p className="text-red-700 mb-6 admin-text-justify">
              You do not have the royal privileges required to access the administrative chambers. Only those blessed with administrative powers may enter.
            </p>
            <a href="/">
              <Button className="bg-red-600 hover:bg-red-700 admin-focus">
                Return Home
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-container admin-font-pharaonic">
      <div className="admin-header relative">
        {/* NotificationCenter removed - dashboard components deleted */}
        <div className="container mx-auto px-8 py-8 text-center">
          <h1 className="admin-header-title">
            𓇳 Pharaonic Admin Empire 𓇳
          </h1>
          <p className="admin-header-subtitle admin-text-justify max-w-2xl mx-auto">
            Welcome back, {session.user.name} | Command your royal Nile empire with the wisdom of the pharaohs and manage all aspects of your dahabiya kingdom
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white border-b border-slate-200 px-4 overflow-x-auto">
          <TabsList className="flex gap-0.5 bg-transparent p-0 h-auto min-w-max">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-1 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-yellow-50 rounded-none text-xs font-medium whitespace-nowrap"
            >
              <BarChart3 size={14} />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="dahabiyat"
              className="flex items-center gap-1 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-yellow-50 rounded-none text-xs font-medium whitespace-nowrap"
            >
              <Ship size={14} />
              Dahabiyat
            </TabsTrigger>
            <TabsTrigger
              value="packages"
              className="flex items-center gap-1 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-yellow-50 rounded-none text-xs font-medium whitespace-nowrap"
            >
              <Package size={14} />
              Packages
            </TabsTrigger>
            <TabsTrigger
              value="website"
              className="flex items-center gap-1 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-yellow-50 rounded-none text-xs font-medium whitespace-nowrap"
            >
              <FileText size={14} />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="flex items-center gap-1 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-yellow-50 rounded-none text-xs font-medium whitespace-nowrap"
            >
              <Star size={14} />
              Featured
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="flex items-center gap-1 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-yellow-50 rounded-none text-xs font-medium whitespace-nowrap"
            >
              <Image size={14} />
              Media
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="flex items-center gap-1 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-yellow-50 rounded-none text-xs font-medium whitespace-nowrap"
            >
              <Calendar size={14} />
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-1 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-yellow-50 rounded-none text-xs font-medium whitespace-nowrap"
            >
              <Zap size={14} />
              Settings
            </TabsTrigger>

          </TabsList>
        </div>

        <div className="p-8 max-w-7xl mx-auto">
          <TabsContent value="overview">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 size={24} />
                Dashboard Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalBookings}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Users</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-slate-900">${stats.totalRevenue}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Anchor size={20} />
                      Quick Navigation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('dahabiyat')}
                      className="w-full justify-start h-8 text-xs font-medium"
                    >
                      <Ship size={14} className="mr-2" />
                      Dahabiyat Management
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('packages')}
                      className="w-full justify-start h-8 text-xs font-medium"
                    >
                      <Package size={14} className="mr-2" />
                      Packages & Itineraries
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('bookings')}
                      className="w-full justify-start h-8 text-xs font-medium"
                    >
                      <Calendar size={14} className="mr-2" />
                      Bookings & Users
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = '/admin/tailor-made'}
                      className="w-full justify-start h-8 text-xs font-medium"
                    >
                      <Wand2 size={14} className="mr-2" />
                      Tailor-Made Requests
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('settings')}
                      className="w-full justify-start h-8 text-xs font-medium"
                    >
                      <Zap size={14} className="mr-2" />
                      Settings & Tools
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dahabiyat">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Ship size={24} />
                Dahabiyat Management
              </h2>

              {/* Main Dahabiyat Page */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Ship size={20} />
                    Main Dahabiyat Page
                  </h3>
                  <p className="text-slate-600 mb-4">Manage the main dahabiyat page content, overview, and general information.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => setActiveTab('website')}
                      variant="outline"
                      size="sm"
                      className="h-12 flex-col text-xs font-medium"
                    >
                      <Ship size={16} className="mb-1 text-blue-600" />
                      Main Dahabiyat Page
                      <span className="text-xs text-slate-500 mt-0.5">Overview, introduction, and general content</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/dahabiyas', '_blank')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <Anchor size={24} className="mb-2 text-teal-600" />
                      Fleet Management
                      <span className="text-xs text-slate-500 mt-1">Manage dahabiya specifications and details</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Dahabiyas */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Crown size={20} />
                    Individual Dahabiyas
                  </h3>
                  <p className="text-slate-600 mb-4">Manage content for each individual dahabiya including descriptions, galleries, amenities, and specifications.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                      onClick={() => window.open('/admin/website?section=royal-cleopatra', '_blank')}
                      variant="outline"
                      className="h-24 flex-col"
                    >
                      <Crown size={24} className="mb-2 text-yellow-600" />
                      <div className="text-center">
                        <div className="font-medium">Royal Dahabiya</div>
                        <div className="text-xs text-slate-500">👑 Royal Majesty</div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/website?section=queen-cleopatra', '_blank')}
                      variant="outline"
                      className="h-24 flex-col"
                    >
                      <Gem size={24} className="mb-2 text-emerald-600" />
                      <div className="text-center">
                        <div className="font-medium">Queen Dahabiya</div>
                        <div className="text-xs text-slate-500">💎 Supreme Elegance</div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/website?section=princess-cleopatra', '_blank')}
                      variant="outline"
                      className="h-24 flex-col"
                    >
                      <Sparkles size={24} className="mb-2 text-purple-600" />
                      <div className="text-center">
                        <div className="font-medium">Princess Dahabiya</div>
                        <div className="text-xs text-slate-500">✨ Royal Grace</div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('website')}
                      variant="outline"
                      className="h-24 flex-col"
                    >
                      <Zap size={24} className="mb-2 text-blue-600" />
                      <div className="text-center">
                        <div className="font-medium">Azhar Dahabiya</div>
                        <div className="text-xs text-slate-500">⚡ Brilliant Light</div>
                      </div>
                    </Button>
                  </div>

                  {/* Additional Dahabiya Management Tools */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h4 className="text-md font-semibold text-slate-800 mb-3">Additional Tools</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        onClick={() => setActiveTab('website')}
                        variant="outline"
                        className="h-16 flex-col"
                      >
                        <FileText size={20} className="mb-1 text-orange-600" />
                        <div className="text-center">
                          <div className="text-sm font-medium">Fact Sheets</div>
                          <div className="text-xs text-slate-500">PDF brochures</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => window.open('/admin/availability', '_blank')}
                        variant="outline"
                        className="h-16 flex-col"
                      >
                        <Calendar size={20} className="mb-1 text-green-600" />
                        <div className="text-center">
                          <div className="text-sm font-medium">Availability</div>
                          <div className="text-xs text-slate-500">Manage schedules</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => setActiveTab('dahabiyat')}
                        variant="outline"
                        className="h-16 flex-col"
                      >
                        <Ship size={20} className="mb-1 text-indigo-600" />
                        <div className="text-center">
                          <div className="text-sm font-medium">Vessel Specs</div>
                          <div className="text-xs text-slate-500">Now in Dahabiyat</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="website">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText size={24} />
                Website Content Management
              </h2>

              {/* Dynamic Site Branding Section */}
              <SiteNamePreview />

              {/* Main Website Content Manager */}
              <WebsiteContentManager />
            </div>
          </TabsContent>



          <TabsContent value="packages">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Package size={24} />
                Packages & Itineraries Management
              </h2>

              {/* Quick Package Access */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Crown size={20} />
                    Quick Package Access
                  </h3>
                  <p className="text-slate-600 mb-4">Quick access to edit your packages including itineraries, pricing, and details.</p>
                  <div className="mb-4 flex gap-3">
                    <Button
                      onClick={() => window.open('/admin/packages', '_blank')}
                      className="bg-egyptian-gold hover:bg-amber-600 text-black font-semibold"
                    >
                      <Package size={16} className="mr-2" />
                      Manage All Packages
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/packages', '_blank')}
                      variant="outline"
                      className="border-egyptian-gold text-egyptian-gold hover:bg-egyptian-gold hover:text-black"
                    >
                      <Plus size={16} className="mr-2" />
                      Create New Package
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {packages.slice(0, 4).map((pkg, index) => {
                      const icons = [Crown, Star, Compass, Package];
                      const colors = ['text-purple-600', 'text-amber-600', 'text-green-600', 'text-blue-600'];
                      const IconComponent = icons[index % icons.length];
                      const iconColor = colors[index % colors.length];

                      return (
                        <div key={pkg.id} className="space-y-2">
                          <Button
                            variant="outline"
                            onClick={() => window.open(`/packages/${pkg.id}`, '_blank')}
                            className="h-16 w-full flex-col"
                          >
                            <IconComponent size={20} className={`mb-1 ${iconColor}`} />
                            <div className="text-center">
                              <div className="font-medium text-xs">{pkg.name}</div>
                              <div className="text-xs text-slate-500">Preview</div>
                            </div>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => window.open(`/admin/packages`, '_blank')}
                            className="w-full bg-egyptian-gold hover:bg-amber-600 text-black text-xs"
                          >
                            Edit Package
                          </Button>
                        </div>
                      );
                    })}
                    {packages.length === 0 && (
                      <div className="col-span-full text-center py-8 text-slate-500">
                        <Package size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="font-medium">No packages available</p>
                        <p className="text-sm mb-4">Create your first package to get started</p>
                        <Button
                          onClick={() => window.open('/admin/packages', '_blank')}
                          size="sm"
                          className="bg-egyptian-gold hover:bg-amber-600 text-black"
                        >
                          <Plus size={16} className="mr-2" />
                          Create First Package
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>



              {/* Itineraries Management */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    Royal Journeys & Itineraries
                  </h3>
                  <p className="text-slate-600 mb-4">Create and manage your pharaonic itineraries and royal journeys.</p>
                  <div className="flex gap-4 mb-4">
                    <Button
                      onClick={() => window.open('/admin/itineraries', '_blank')}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <MapPin size={16} className="mr-2" />
                      Manage Itineraries
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/itineraries/new', '_blank')}
                      variant="outline"
                      className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    >
                      <Plus size={16} className="mr-2" />
                      Add New Itinerary
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Blogs Management */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Ancient Chronicles & Blogs
                  </h3>
                  <p className="text-slate-600 mb-4">Create and manage your blog posts and ancient chronicles.</p>
                  <div className="flex gap-4 mb-4">
                    <Button
                      onClick={() => window.open('/admin/blogs', '_blank')}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <FileText size={16} className="mr-2" />
                      Manage Blogs
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/blogs/new', '_blank')}
                      variant="outline"
                      className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    >
                      <Plus size={16} className="mr-2" />
                      Add New Blog
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <FeaturedItemsManager />
          </TabsContent>

          <TabsContent value="media">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Image size={24} />
                Media & Gallery Management
              </h2>

              {/* Global Media Assets */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Image size={20} />
                    Global Media Assets
                  </h3>
                  <p className="text-slate-600 mb-4">Manage site-wide media assets including logos, placeholders, and global images.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setActiveTab('website')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <Image size={24} className="mb-2 text-blue-600" />
                      Global Media
                      <span className="text-xs text-slate-500 mt-1">Logos, placeholders, site-wide assets</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('website')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <Video size={24} className="mb-2 text-purple-600" />
                      Video Assets
                      <span className="text-xs text-slate-500 mt-1">Site-wide video content</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/media', '_blank')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <Image size={24} className="mb-2 text-green-600" />
                      Media Library
                      <span className="text-xs text-slate-500 mt-1">Upload and manage media files</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Gallery Management */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Palette size={20} />
                    Gallery Management
                  </h3>
                  <p className="text-slate-600 mb-4">Manage gallery pages and photo collections.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => window.open('/admin/website?section=gallery', '_blank')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <Palette size={24} className="mb-2 text-orange-600" />
                      Gallery Page
                      <span className="text-xs text-slate-500 mt-1">Gallery page images and content</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/gallery', '_blank')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <Image size={24} className="mb-2 text-teal-600" />
                      Gallery Manager
                      <span className="text-xs text-slate-500 mt-1">Advanced gallery management</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calendar size={24} />
                Bookings & Users Management
              </h2>

              {/* Bookings Management */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Bookings Management
                  </h3>
                  <p className="text-slate-600 mb-4">View and manage customer bookings and reservations.</p>
                  <Button
                    onClick={() => window.open('/admin/bookings', '_blank')}
                    className="mb-4"
                  >
                    <Calendar size={16} className="mr-2" />
                    View All Bookings
                  </Button>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">
                                {booking.customerName || `Booking ${index + 1}`}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {booking.dahabiya?.name || 'Dahabiya'} | {booking.startDate || 'Date TBD'}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {booking.status || 'Pending'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {bookings.length === 0 && (
                      <p className="text-center text-slate-500 py-8">No recent bookings found</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* User Management */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Users size={20} />
                    User Management
                  </h3>
                  <p className="text-slate-600 mb-4">Manage users, permissions, and customer accounts.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => window.open('/admin/users', '_blank')}
                      variant="outline"
                      size="sm"
                      className="h-12 flex-col text-xs font-medium"
                    >
                      <Users size={16} className="mb-1 text-blue-600" />
                      Manage Users
                      <span className="text-xs text-slate-500 mt-0.5">View and edit user accounts</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/loyalty-system', '_blank')}
                      variant="outline"
                      size="sm"
                      className="h-12 flex-col text-xs font-medium"
                    >
                      <Crown size={16} className="mb-1 text-amber-600" />
                      Loyalty System
                      <span className="text-xs text-slate-500 mt-0.5">Manage loyalty buttons & points</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Zap size={24} />
                Settings & Tools
              </h2>

              {/* System Settings */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Zap size={20} />
                    System Settings
                  </h3>
                  <p className="text-slate-600 mb-4">Manage system settings, availability, and administrative tools.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button
                      onClick={() => window.open('/admin/availability', '_blank')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <Calendar size={24} className="mb-2 text-green-600" />
                      Availability
                      <span className="text-xs text-slate-500 mt-1">Manage dahabiya schedules</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/email-templates', '_blank')}
                      variant="outline"
                      size="sm"
                      className="h-12 flex-col text-xs font-medium"
                    >
                      <Mail size={16} className="mb-1 text-blue-600" />
                      Email Templates
                      <span className="text-xs text-slate-500 mt-0.5">Manage email designs</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/notification-settings', '_blank')}
                      variant="outline"
                      size="sm"
                      className="h-12 flex-col text-xs font-medium"
                    >
                      <Bell size={16} className="mb-1 text-purple-600" />
                      Notifications
                      <span className="text-xs text-slate-500 mt-0.5">Configure notification rules</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/email-setup', '_blank')}
                      variant="outline"
                      size="sm"
                      className="h-12 flex-col text-xs font-medium"
                    >
                      <Phone size={16} className="mb-1 text-green-600" />
                      SMTP Setup
                      <span className="text-xs text-slate-500 mt-0.5">Email server settings</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/settings', '_blank')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <Zap size={24} className="mb-2 text-orange-600" />
                      General Settings
                      <span className="text-xs text-slate-500 mt-1">System configuration</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Development Tools */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Wand2 size={20} />
                    Development Tools
                  </h3>
                  <p className="text-slate-600 mb-4">Development and testing tools for administrators.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button
                      onClick={() => window.open('/admin/seed', '_blank')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <Sparkles size={24} className="mb-2 text-amber-600" />
                      Database Seed
                      <span className="text-xs text-slate-500 mt-1">Initialize sample data</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/media-test', '_blank')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <Image size={24} className="mb-2 text-teal-600" />
                      Media Test
                      <span className="text-xs text-slate-500 mt-1">Test media functionality</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/admin/website-test', '_blank')}
                      variant="outline"
                      className="h-20 flex-col"
                    >
                      <FileText size={24} className="mb-2 text-red-600" />
                      Website Test
                      <span className="text-xs text-slate-500 mt-1">Test website features</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
