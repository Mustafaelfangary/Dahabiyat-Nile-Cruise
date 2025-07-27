"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Home,
  Ship,
  Package,
  Phone,
  Info,
  Menu,
  X,
  User,
  Calendar,
  Heart,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  Camera,
  BookOpen,
  Settings,
  LogOut,
  Crown,
  Anchor,
  Compass,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: any;
  hieroglyph?: string;
  hasDropdown?: boolean;
  dropdownItems?: Array<{
    href: string;
    label: string;
    hieroglyph: string;
  }>;
}

export default function MobileNavigation({ isOpen, onToggle }: MobileNavigationProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const [dahabiyatItems, setDahabiyatItems] = useState<Array<{href: string, label: string, hieroglyph: string}>>([]);
  const [packagesItems, setPackagesItems] = useState<Array<{href: string, label: string, hieroglyph: string}>>([]);
  const [itineraryItems, setItineraryItems] = useState<Array<{href: string, label: string, hieroglyph: string}>>([]);
  const [settings, setSettings] = useState({ siteName: 'Dahabiyat Nile Cruise' });
  const { getContent: getHomepageContent } = useContent({ page: 'homepage' });
  const { getContent } = useContent({ page: 'global_media' });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = () => {
      // Get site name from homepage content (dynamic)
      const dynamicSiteName = getHomepageContent('site_name', '');

      if (dynamicSiteName) {
        setSettings({ siteName: dynamicSiteName });
      } else {
        // Fallback to settings API
        fetch('/api/settings?group=general', { cache: 'no-store' })
          .then(res => res.json())
          .then(settingsData => {
            const siteName = settingsData?.site_name || 'Dahabiyat Nile Cruise';
            setSettings({ siteName });
          })
          .catch(() => {
            setSettings({ siteName: 'Dahabiyat Nile Cruise' });
          });
      }
    };

    fetchSettings();

    const handleUpdate = () => fetchSettings();
    window.addEventListener('settings-updated', handleUpdate);
    window.addEventListener('content-updated', handleUpdate);

    return () => {
      window.removeEventListener('settings-updated', handleUpdate);
      window.removeEventListener('content-updated', handleUpdate);
    };
  }, [getHomepageContent]);

  // Helper function to generate slug from name as fallback
  const generateSlugFromName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[𓇳𓈖𓂀𓏏𓆎𓅓𓊖𓋖]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\s/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Fetch dynamic content for dropdowns
  useEffect(() => {
    // Fetch dahabiyas
    fetch('/api/dahabiyas?limit=10&active=true')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.dahabiyas)) {
          const items = data.dahabiyas.map((boat: any, index: number) => ({
            href: `/dahabiyas/${boat.slug || generateSlugFromName(boat.name)}`,
            label: `${['𓇳', '𓊪', '𓈖', '𓂀', '𓏏'][index % 5]} ${boat.name}`,
            hieroglyph: ['𓇳', '𓊪', '𓈖', '𓂀', '𓏏'][index % 5]
          }));
          setDahabiyatItems(items);
        }
      })
      .catch(() => {
        // Fallback items
        setDahabiyatItems([
          { href: "/dahabiyas/royal-dahabiya", label: "𓇳 Royal Dahabiya", hieroglyph: "𓇳" },
          { href: "/dahabiyas/nile-goddess", label: "𓊪 Nile Goddess", hieroglyph: "𓊪" },
          { href: "/dahabiyas/pharaoh-dream", label: "𓈖 Pharaoh's Dream", hieroglyph: "𓈖" },
          { href: "/dahabiyas/golden-horus", label: "𓂀 Golden Horus", hieroglyph: "𓂀" },
        ]);
      });

    // Fetch packages
    fetch('/api/packages?limit=10')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.packages)) {
          const items = data.packages.map((pkg: any, index: number) => ({
            href: `/packages/${pkg.slug || pkg.id}`,
            label: `${['𓇳', '𓊪', '𓈖', '𓂀', '𓏏'][index % 5]} ${pkg.name}`,
            hieroglyph: ['𓇳', '𓊪', '𓈖', '𓂀', '𓏏'][index % 5]
          }));
          setPackagesItems(items);
        }
      })
      .catch(() => {
        // Fallback items
        setPackagesItems([
          { href: "/packages/luxury-nile-cruise", label: "𓇳 Luxury Nile Cruise", hieroglyph: "𓇳" },
          { href: "/packages/classic-egypt-explorer", label: "𓊪 Classic Egypt Explorer", hieroglyph: "𓊪" },
          { href: "/packages/adventure-explorer", label: "𓈖 Adventure Explorer", hieroglyph: "𓈖" },
          { href: "/packages/cultural-discovery", label: "𓂀 Cultural Discovery", hieroglyph: "𓂀" },
        ]);
      });

    // Fetch itineraries
    fetch('/api/itineraries')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          const items = data.map((itinerary: any, index: number) => ({
            href: `/itineraries/${itinerary.slug || itinerary.id}`,
            label: `${['𓋖', '𓊪', '𓈖', '𓂀', '𓏏'][index % 5]} ${itinerary.name}`,
            hieroglyph: ['𓋖', '𓊪', '𓈖', '𓂀', '𓏏'][index % 5]
          }));
          setItineraryItems(items);
        }
      })
      .catch(() => {
        // Fallback items
        setItineraryItems([
          { href: "/itineraries/classic-nile-journey", label: "𓋖 Classic Nile Journey", hieroglyph: "𓋖" },
          { href: "/itineraries/luxor-aswan-cruise", label: "𓊪 Luxor-Aswan Cruise", hieroglyph: "𓊪" },
          { href: "/itineraries/pharaonic-discovery", label: "𓊪 Pharaonic Discovery", hieroglyph: "𓊪" },
          { href: "/itineraries/ancient-temples-tour", label: "𓂀 Ancient Temples Tour", hieroglyph: "𓂀" },
        ]);
      });
  }, []);

  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: Home, hieroglyph: '𓇳' },
    {
      href: '/dahabiyat',
      label: 'Dahabiyat',
      icon: Ship,
      hieroglyph: '𓊪',
      hasDropdown: true,
      dropdownItems: dahabiyatItems
    },
    {
      href: '/packages',
      label: 'Packages',
      icon: Package,
      hieroglyph: '𓇳',
      hasDropdown: true,
      dropdownItems: packagesItems
    },
    {
      href: '/itineraries',
      label: 'Itineraries',
      icon: MapPin,
      hieroglyph: '𓋖',
      hasDropdown: true,
      dropdownItems: itineraryItems
    },
    { href: '/gallery-new', label: 'Gallery', icon: Camera, hieroglyph: '𓂀' },
    { href: '/blogs', label: 'Chronicles', icon: BookOpen, hieroglyph: '𓂋' },
    { href: '/tailor-made', label: 'Tailor-Made', icon: Heart, hieroglyph: '𓈖' },
    { href: '/about', label: 'About', icon: Info, hieroglyph: '𓂀' },
    { href: '/contact', label: 'Contact', icon: Phone, hieroglyph: '𓏏' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      onToggle(); // Close mobile menu
      toast.success("You have been signed out");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const toggleDropdown = (href: string) => {
    setExpandedDropdown(expandedDropdown === href ? null : href);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg border-b border-egyptian-gold/30'
          : 'bg-gradient-to-r from-egyptian-gold/10 to-sunset-orange/10 backdrop-blur-sm bg-white/95'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Dynamic Logo + Site Name */}
          <Link href="/" className="flex items-center space-x-2" onClick={onToggle}>
            <Image
              src="/images/logo.png"
              alt="Site Logo"
              width={64}
              height={64}
              className="h-16 w-16 object-contain rounded-lg shadow-lg"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-hieroglyph-brown leading-tight">
                {settings.siteName.split(' ')[0]}
              </span>
              <span className="text-xs text-egyptian-gold font-medium leading-tight">
                {settings.siteName.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onToggle}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-amber-50 to-orange-50 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="bg-gradient-to-br from-egyptian-gold to-sunset-orange p-6 text-hieroglyph-brown">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <span className="text-2xl">𓇳</span>
                      Dahabiyat Nile Cruise
                    </h2>
                    <p className="text-hieroglyph-brown/80 text-sm mt-1">Royal Nile Adventures</p>
                  </div>
                  <button
                    onClick={onToggle}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* User Profile Section */}
              {session && (
                <div className="p-6 border-b-2 border-egyptian-gold/30 bg-gradient-to-r from-egyptian-gold/10 via-egyptian-gold/5 to-egyptian-gold/10 relative overflow-hidden">
                  {/* Pharaonic decorative elements */}
                  <div className="absolute top-2 left-2 text-egyptian-gold/30 text-xl">𓇳</div>
                  <div className="absolute top-2 right-2 text-egyptian-gold/30 text-xl">𓇳</div>
                  <div className="absolute bottom-2 left-2 text-egyptian-gold/30 text-lg">𓈖</div>
                  <div className="absolute bottom-2 right-2 text-egyptian-gold/30 text-lg">𓈖</div>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-3 border-egyptian-gold/50 shadow-lg shadow-egyptian-gold/30 ring-2 ring-white/50">
                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-egyptian-gold to-egyptian-gold/80 text-hieroglyph-brown font-bold text-xl">
                          {session.user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {/* Pharaonic crown symbol */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-egyptian-gold rounded-full flex items-center justify-center text-hieroglyph-brown text-xs font-bold shadow-lg">
                        𓇳
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-egyptian-gold text-sm">𓂀</span>
                        <p className="font-bold text-hieroglyph-brown text-lg">{session.user.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-egyptian-gold/70 text-xs">𓏏</span>
                        <p className="text-sm text-egyptian-gold/80 font-medium">{session.user.email}</p>
                      </div>
                    </div>

                    <Badge className="bg-gradient-to-r from-egyptian-gold to-egyptian-gold/80 text-hieroglyph-brown border-egyptian-gold/50 shadow-lg px-3 py-1">
                      <Crown className="w-4 h-4 mr-1" />
                      <span className="font-bold">Royal</span>
                    </Badge>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <div className="p-4 space-y-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  const isExpanded = expandedDropdown === item.href;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-1"
                    >
                      {/* Main Navigation Item */}
                      <div className="relative">
                        {item.hasDropdown ? (
                          <button
                            onClick={() => toggleDropdown(item.href)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                              isActive || isExpanded
                                ? 'bg-gradient-to-r from-egyptian-gold/20 to-sunset-orange/20 text-hieroglyph-brown border border-egyptian-gold/30'
                                : 'hover:bg-white/70 text-hieroglyph-brown hover:text-egyptian-gold'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-egyptian-gold/10 flex items-center justify-center">
                                <span className="text-lg">{item.hieroglyph}</span>
                              </div>
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={onToggle}
                            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                              isActive
                                ? 'bg-gradient-to-r from-egyptian-gold/20 to-sunset-orange/20 text-hieroglyph-brown border border-egyptian-gold/30'
                                : 'hover:bg-white/70 text-hieroglyph-brown hover:text-egyptian-gold'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-egyptian-gold/10 flex items-center justify-center">
                              <span className="text-lg">{item.hieroglyph}</span>
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        )}
                      </div>

                      {/* Dropdown Items */}
                      <AnimatePresence>
                        {item.hasDropdown && isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 space-y-1 overflow-hidden"
                          >
                            {/* View All Link */}
                            <Link
                              href={item.href}
                              onClick={onToggle}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-egyptian-gold/10 text-sm text-hieroglyph-brown transition-colors"
                            >
                              <div className="w-6 h-6 rounded bg-egyptian-gold/20 flex items-center justify-center">
                                <Compass className="w-3 h-3 text-egyptian-gold" />
                              </div>
                              <span>View All {item.label}</span>
                            </Link>

                            {/* Individual Items */}
                            {item.dropdownItems?.slice(0, 4).map((dropdownItem, idx) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                onClick={onToggle}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-egyptian-gold/10 text-sm text-hieroglyph-brown transition-colors"
                              >
                                <div className="w-6 h-6 rounded bg-egyptian-gold/20 flex items-center justify-center">
                                  <span className="text-xs">{dropdownItem.hieroglyph}</span>
                                </div>
                                <span>{dropdownItem.label}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-egyptian-gold/20">
                <h3 className="text-sm font-semibold text-hieroglyph-brown uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/booking"
                    onClick={onToggle}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Book Royal Journey</span>
                  </Link>

                  {session ? (
                    <Link
                      href="/profile"
                      onClick={onToggle}
                      className="flex items-center space-x-3 p-3 border border-egyptian-gold/30 rounded-lg hover:bg-egyptian-gold/10 transition-all duration-300"
                    >
                      <User className="w-5 h-5 text-egyptian-gold" />
                      <span className="text-hieroglyph-brown font-medium">My Profile</span>
                    </Link>
                  ) : (
                    <Link
                      href="/auth/signin"
                      onClick={onToggle}
                      className="flex items-center space-x-3 p-3 border border-egyptian-gold/30 rounded-lg hover:bg-egyptian-gold/10 transition-all duration-300"
                    >
                      <User className="w-5 h-5 text-egyptian-gold" />
                      <span className="text-hieroglyph-brown font-medium">Sign In</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Admin Access */}
              {session?.user?.role === "ADMIN" && (
                <div className="p-4 border-t border-egyptian-gold/20">
                  <Link
                    href="/admin"
                    onClick={onToggle}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>
                </div>
              )}

              {/* Auth Section */}
              {session && (
                <div className="p-4 border-t border-egyptian-gold/20">
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full flex items-center space-x-3 p-3 border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </Button>
                </div>
              )}

              {/* Contact Info */}
              <div className="p-4 bg-gradient-to-r from-egyptian-gold/10 to-sunset-orange/10 mt-auto">
                <div className="text-center">
                  <p className="text-sm text-hieroglyph-brown mb-2 font-medium">Need Royal Assistance?</p>
                  <a
                    href="tel:+20952370574"
                    className="text-egyptian-gold font-semibold hover:underline flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    +20 95 237 0574
                  </a>
                  <p className="text-xs text-egyptian-gold/70 mt-2">
                    Available 24/7 for your royal journey
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
