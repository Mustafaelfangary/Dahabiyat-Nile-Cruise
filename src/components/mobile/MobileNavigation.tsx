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
  LayoutDashboard,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';

const LANGUAGES = [
  { code: 'en', label: '🇺🇸 English', flag: '🇺🇸', name: 'English' },
  { code: 'ar', label: '🇪🇬 العربية', flag: '🇪🇬', name: 'العربية' },
  { code: 'fr', label: '🇫🇷 Français', flag: '🇫🇷', name: 'Français' },
  { code: 'de', label: '🇩🇪 Deutsch', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'es', label: '🇪🇸 Español', flag: '🇪🇸', name: 'Español' },
  { code: 'it', label: '🇮🇹 Italiano', flag: '🇮🇹', name: 'Italiano' },
  { code: 'ru', label: '🇷🇺 Русский', flag: '🇷🇺', name: 'Русский' },
  { code: 'zh', label: '🇨🇳 中文', flag: '🇨🇳', name: '中文' },
  { code: 'ja', label: '🇯🇵 日本語', flag: '🇯🇵', name: '日本語' },
];

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
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const [dahabiyatItems, setDahabiyatItems] = useState<Array<{href: string, label: string, hieroglyph: string}>>([]);
  const [packagesItems, setPackagesItems] = useState<Array<{href: string, label: string, hieroglyph: string}>>([]);
  const [itineraryItems, setItineraryItems] = useState<Array<{href: string, label: string, hieroglyph: string}>>([]);
  const [settings, setSettings] = useState({ siteName: 'Dahabiyat' });
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { getContent: getHomepageContent } = useContent({ page: 'homepage' });
  const { getContent } = useContent({ page: 'global_media' });

  // Get dynamic mobile logo
  const getMobileLogo = () => {
    return getContent('navbar_logo', '/images/logo.png');
  };

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
            const siteName = settingsData?.site_name || 'Dahabiyat';
            setSettings({ siteName });
          })
          .catch(() => {
            setSettings({ siteName: 'Dahabiyat' });
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
          const hieroglyphs = ['𓇳', '𓊪', '𓈖', '𓂀', '𓏏'];
          const items = data.dahabiyas.map((boat: any, index: number) => {
            const hieroglyph = hieroglyphs[index % hieroglyphs.length] || '𓇳';
            return {
              href: `/dahabiyas/${boat.slug || generateSlugFromName(boat.name)}`,
              label: `${hieroglyph} ${boat.name}`,
              hieroglyph: hieroglyph
            };
          });
          setDahabiyatItems(items);
        }
      })
      .catch(() => {
        // Fallback items
        setDahabiyatItems([
          { href: "/dahabiyas/royal-dahabiya", label: "𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿 Royal Dahabiya", hieroglyph: "𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿" },
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
          const hieroglyphs = ['𓇳', '𓊪', '𓈖', '𓂀', '𓏏'];
          const items = data.packages.map((pkg: any, index: number) => {
            const hieroglyph = hieroglyphs[index % hieroglyphs.length] || '𓇳';
            return {
              href: `/packages/${pkg.slug || pkg.id}`,
              label: `${hieroglyph} ${pkg.name}`,
              hieroglyph: hieroglyph
            };
          });
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
          const hieroglyphs = ['𓋖', '𓊪', '𓈖', '𓂀', '𓏏'];
          const items = data.map((itinerary: any, index: number) => {
            const hieroglyph = hieroglyphs[index % hieroglyphs.length] || '𓋖';
            return {
              href: `/itineraries/${itinerary.slug || itinerary.id}`,
              label: `${hieroglyph} ${itinerary.name}`,
              hieroglyph: hieroglyph
            };
          });
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

  // Language change handler
  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setShowLanguageDropdown(false);

    // Store language preference
    localStorage.setItem('preferred-language', languageCode);

    // Here you would typically trigger a language change in your i18n system
    // For now, we'll just show a toast
    const selectedLanguage = LANGUAGES.find(lang => lang.code === languageCode);
    toast.success(`Language changed to ${selectedLanguage?.name}`);

    // Close mobile menu
    onToggle();
  };

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && LANGUAGES.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: Home, hieroglyph: '𓇳' },
    {
      href: '/dahabiyas',
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
    { href: '/blogs', label: 'Blogs', icon: BookOpen, hieroglyph: '𓂋' },
    { href: '/schedule-and-rates', label: 'Schedule & Rates', icon: Calendar, hieroglyph: '𓂀' },
    { href: '/tailor-made', label: 'Tailor-Made', icon: Heart, hieroglyph: '𓈖' },
    { href: '/about', label: 'About', icon: Info, hieroglyph: '𓂀' },
    { href: '/contact', label: 'Contact', icon: Phone, hieroglyph: '𓏏' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      onToggle(); // Close mobile menu
      window.location.href = '/';
      toast.success("You have been signed out");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out");
    }
  };

  const toggleDropdown = (href: string) => {
    setExpandedDropdown(expandedDropdown === href ? null : href);
  };

  return (
    <>
      {/* Mobile Header */}
      <div
        className={`fixed left-0 right-0 z-[50] mobile-header fixed-top-mobile transition-all duration-300 ${
          scrolled
            ? 'bg-gradient-to-r from-ocean-blue/30 to-blue-400/30 shadow-xl border-b-2 border-blue-300/30 backdrop-blur-md'
            : 'bg-gradient-to-r from-ocean-blue/25 to-blue-400/25 backdrop-blur-md border-b border-blue-200/20'
        }`}
        style={{
          top: '0'
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Dynamic Logo + Site Name - Optimized for small screens */}
          <Link href="/" className="flex items-center space-x-2" onClick={onToggle}>
            <Image
              src={getMobileLogo()}
              alt="Site Logo"
              width={64}
              height={64}
              className="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-lg shadow-sm border-2 border-white/20"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg text-white leading-tight drop-shadow-sm">
                {settings.siteName.split(' ')[0]}
              </span>
              <span className="text-xs text-blue-100 font-medium leading-tight drop-shadow-sm hidden xs:block">
                {settings.siteName.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </Link>

          {/* Enhanced Mobile Menu Button - Optimized for small screens */}
          <button
            onClick={onToggle}
            className={`relative p-2 sm:p-3 rounded-xl transition-all duration-300 transform ${
              isOpen
                ? 'bg-white/20 shadow-lg scale-105 rotate-180'
                : 'bg-white/10 hover:bg-white/20 hover:shadow-lg hover:scale-110'
            } border border-white/30 backdrop-blur-sm min-h-[44px] min-w-[44px] flex items-center justify-center`}
          >
            <div className="relative">
              {isOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
              )}
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-white/10 blur-sm -z-10"></div>
            </div>
            {/* Ripple effect indicator */}
            <div className={`absolute inset-0 rounded-xl bg-white/20 transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}></div>
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
              className="fixed inset-0 bg-black/70 z-40"
              onClick={onToggle}
            />

            {/* Enhanced Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-white via-blue-50/95 to-blue-100/90 shadow-2xl z-50 overflow-y-auto border-l-2 border-ocean-blue/20 backdrop-blur-sm"
            >
              {/* Enhanced Menu Header */}
              <div className="bg-gradient-to-br from-ocean-blue via-deep-blue to-ocean-blue p-6 text-white relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 drop-shadow-sm">
                      <span className="text-2xl animate-pulse">𓇳</span>
                      Dahabiyat
                    </h2>
                    <p className="text-white/90 text-sm mt-1 drop-shadow-sm">Royal Nile Adventures</p>
                  </div>
                  <button
                    onClick={onToggle}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/30 backdrop-blur-sm"
                  >
                    <X className="w-5 h-5 drop-shadow-sm" />
                  </button>
                </div>

                {/* Decorative bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>

              {/* User Profile Section */}
              {session && (
                <div className="p-6 border-b-2 border-ocean-blue/30 bg-gradient-to-r from-ocean-blue/10 via-ocean-blue/5 to-ocean-blue/10 relative overflow-hidden">
                  {/* Pharaonic decorative elements */}
                  <div className="absolute top-2 left-2 text-ocean-blue/30 text-xl">𓇳</div>
                  <div className="absolute top-2 right-2 text-ocean-blue/30 text-xl">𓇳</div>
                  <div className="absolute bottom-2 left-2 text-ocean-blue/30 text-lg">𓈖</div>
                  <div className="absolute bottom-2 right-2 text-ocean-blue/30 text-lg">𓈖</div>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-3 border-ocean-blue/50 shadow-lg shadow-ocean-blue/30 ring-2 ring-white/50">
                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-ocean-blue to-ocean-blue/80 text-white font-bold text-xl">
                          {session.user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {/* Pharaonic crown symbol */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-ocean-blue rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        𓇳
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-ocean-blue text-sm">𓂀</span>
                        <p className="font-bold text-hieroglyph-brown text-lg">{session.user.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-ocean-blue/70 text-xs">𓏏</span>
                        <p className="text-sm text-ocean-blue/80 font-medium">{session.user.email}</p>
                      </div>
                    </div>

                    <Badge className="bg-gradient-to-r from-ocean-blue to-ocean-blue/80 text-white border-ocean-blue/50 shadow-lg px-3 py-1">
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
                            className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-300 min-h-[48px] ${
                              isActive || isExpanded
                                ? 'bg-gradient-to-r from-ocean-blue/10 to-deep-blue/10 text-black border border-ocean-blue/30 font-semibold'
                                : 'hover:bg-gray-50 text-black hover:text-ocean-blue font-medium'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-ocean-blue/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-base sm:text-lg">{item.hieroglyph}</span>
                              </div>
                              <span className="font-medium text-sm sm:text-base">{item.label}</span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 flex-shrink-0 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={onToggle}
                            className={`flex items-center space-x-3 p-3 sm:p-4 rounded-xl transition-all duration-300 min-h-[48px] ${
                              isActive
                                ? 'bg-gradient-to-r from-ocean-blue/10 to-deep-blue/10 text-black border border-ocean-blue/30 font-semibold'
                                : 'hover:bg-gray-50 text-black hover:text-ocean-blue font-medium'
                            }`}
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-ocean-blue/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-base sm:text-lg">{item.hieroglyph}</span>
                            </div>
                            <span className="font-medium text-sm sm:text-base">{item.label}</span>
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
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-egyptian-gold/10 text-sm text-black font-medium transition-colors"
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
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-egyptian-gold/10 text-sm text-black font-medium transition-colors"
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
                <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/booking"
                    onClick={onToggle}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-egyptian-gold to-sunset-orange text-black rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Book Dahabiya</span>
                  </Link>

                  {status === "loading" ? (
                    <div className="flex items-center space-x-3 p-3 border border-egyptian-gold/30 rounded-lg">
                      <User className="w-5 h-5 text-egyptian-gold animate-pulse" />
                      <span className="text-black font-semibold">Loading...</span>
                    </div>
                  ) : session ? (
                    <Link
                      href="/profile"
                      onClick={onToggle}
                      className="flex items-center space-x-3 p-3 border border-egyptian-gold/30 rounded-lg hover:bg-egyptian-gold/10 transition-all duration-300"
                    >
                      <User className="w-5 h-5 text-egyptian-gold" />
                      <span className="text-black font-semibold">My Profile</span>
                    </Link>
                  ) : (
                    <Link
                      href="/auth/signin"
                      onClick={onToggle}
                      className="flex items-center space-x-3 p-3 border border-egyptian-gold/30 rounded-lg hover:bg-egyptian-gold/10 transition-all duration-300"
                    >
                      <User className="w-5 h-5 text-egyptian-gold" />
                      <span className="text-black font-semibold">Sign In</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Language Switcher */}
              <div className="p-4 border-t border-egyptian-gold/20">
                <div className="space-y-2">
                  <button
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-egyptian-gold/10 to-sunset-orange/10 border border-egyptian-gold/30 rounded-lg hover:bg-egyptian-gold/20 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-egyptian-gold/20 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-egyptian-gold" />
                      </div>
                      <div className="text-left">
                        <span className="text-hieroglyph-brown font-medium block">Language</span>
                        <span className="text-xs text-gray-600">
                          {LANGUAGES.find(lang => lang.code === currentLanguage)?.label}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-egyptian-gold transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showLanguageDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 overflow-hidden"
                      >
                        {LANGUAGES.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={`w-full flex items-center space-x-3 p-2 rounded-lg text-sm transition-all duration-200 ${
                              currentLanguage === language.code
                                ? 'bg-egyptian-gold/20 text-hieroglyph-brown border border-egyptian-gold/40'
                                : 'hover:bg-egyptian-gold/10 text-gray-600 hover:text-hieroglyph-brown'
                            }`}
                          >
                            <span className="text-lg">{language.flag}</span>
                            <span className="font-medium">{language.name}</span>
                            {currentLanguage === language.code && (
                              <div className="ml-auto w-2 h-2 bg-egyptian-gold rounded-full"></div>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
