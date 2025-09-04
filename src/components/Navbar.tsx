"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, createContext, useContext, ReactNode, ChangeEvent } from 'react';
import Image from 'next/image';
import { LogOut, User, LayoutDashboard, UserCircle, Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { usePathname } from 'next/navigation';
import { useContent } from '@/hooks/useContent';
import {
  RoyalCrown,
  EgyptHieroglyphic,
  EGYPTIAN_CROWN_SYMBOLS,
  HieroglyphicDivider
} from '@/components/ui/pharaonic-elements';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileNavigation from '@/components/mobile/MobileNavigation';

// Interfaces for API responses
interface DahabiyaData {
  id: string;
  name: string;
  slug?: string;
}

interface ItineraryData {
  id: string;
  name: string;
  slug?: string;
}

interface PackageData {
  id: string;
  name: string;
  slug?: string;
}

interface AdminLogo {
  key: string;
  content?: string;
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default function Navbar() {
  const { data: session } = useSession();
  const { getContent } = useContent({ page: 'branding_settings' });
  const [logoUrl, setLogoUrl] = useState('/images/logo.png');

  // Fetch logo from admin settings
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/admin/logo');
        if (response.ok) {
          const logos: AdminLogo[] = await response.json();
          const navbarLogo = logos.find((logo: AdminLogo) => logo.key === 'navbar_logo');
          const siteLogo = logos.find((logo: AdminLogo) => logo.key === 'site_logo');
          
          // Use navbar logo first, fallback to site logo
          const logoToUse = navbarLogo?.content || siteLogo?.content || '/images/logo.png';
          setLogoUrl(logoToUse);
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
        // Fallback to content management system
        const contentLogo = getContent('navbar_logo') || getContent('site_logo');
        if (contentLogo) {
          setLogoUrl(contentLogo);
        }
      }
    };

    fetchLogo();
  }, [getContent]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({ siteName: 'Dahabiyat' });
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const pathname = usePathname();
  const { getContent: getHomepageContent } = useContent({ page: 'homepage' });

  // Get dynamic logo from database with fallback
  // const getNavbarLogo = () => {
  //   return getContent('navbar_logo') || '/images/logo.png';
  // };

  // Check if we're on the homepage
  const isHomepage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

  // Dynamic dahabiyas dropdown items
  const [dahabiyatItems, setDahabiyatItems] = useState([
    // Fallback items while loading
    { href: "/dahabiyas/cleopatra-royal", label: "𓇳 Cleopatra Royal", hieroglyph: "𓇳" },
    { href: "/dahabiyas/nile-goddess", label: "𓊪 Nile Goddess", hieroglyph: "𓊪" },
    { href: "/dahabiyas/pharaoh-dream", label: "𓈖 Pharaoh's Dream", hieroglyph: "𓈖" },
    { href: "/dahabiyas/golden-horus", label: "𓂀 Golden Horus", hieroglyph: "𓂀" },
  ]);

  const [itineraryItems, setItineraryItems] = useState([
    // Fallback items while loading
    { href: "/itineraries/classic-nile-journey", label: "𓋖 Classic Nile Journey", hieroglyph: "𓋖" },
    { href: "/itineraries/luxury-nile-experience", label: "𓇳 Luxury Nile Experience", hieroglyph: "𓇳" },
    { href: "/itineraries/pharaonic-discovery", label: "𓊪 Pharaonic Discovery", hieroglyph: "𓊪" },
    { href: "/itineraries/ancient-temples-tour", label: "𓂀 Ancient Temples Tour", hieroglyph: "𓂀" },
  ]);

  useEffect(() => {
    // Fetch actual dahabiyas from API
    fetch('/api/dahabiyas?limit=10&active=true')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.dahabiyas)) {
          const items = data.dahabiyas.map((boat: DahabiyaData, index: number) => ({
            href: `/dahabiyas/${boat.slug || generateSlugFromName(boat.name)}`,
            label: `${['𓇳', '𓊪', '𓈖', '𓂀', '𓏏'][index % 5]} ${boat.name}`,
            hieroglyph: ['𓇳', '𓊪', '𓈖', '𓂀', '𓏏'][index % 5]
          }));
          setDahabiyatItems(items);
        }
      })
      .catch(err => console.log('Using fallback dahabiya items'));
  }, []);

  useEffect(() => {
    // Fetch actual itineraries from API
    fetch('/api/itineraries')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          const items = data.map((itinerary: ItineraryData, index: number) => ({
            href: `/itineraries/${itinerary.slug || itinerary.id}`,
            label: `${['𓋖', '𓇳', '𓊪', '𓂀', '𓏏'][index % 5]} ${itinerary.name}`,
            hieroglyph: ['𓋖', '𓇳', '𓊪', '𓂀', '𓏏'][index % 5] || '𓋖'
          }));
          setItineraryItems(items);
        }
      })
      .catch(err => console.log('Using fallback itinerary items'));
  }, []);

  useEffect(() => {
    // Fetch actual packages from API
    fetch('/api/packages?limit=10')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.packages)) {
          const items = data.packages.map((pkg: PackageData, index: number) => ({
            href: `/packages/${pkg.slug || pkg.id}`,
            label: `${['𓇳', '𓊪', '𓈖', '𓂀', '𓏏'][index % 5]} ${pkg.name}`,
            hieroglyph: ['𓇳', '𓊪', '𓈖', '𓂀', '𓏏'][index % 5]
          }));
          setPackagesItems(items);
        }
      })
      .catch(err => console.log('Using fallback package items'));
  }, []);

  // Dynamic packages dropdown items
  const [packagesItems, setPackagesItems] = useState([
    // Fallback items while loading
    { href: "/packages/luxury-nile-cruise", label: "𓇳 Luxury Nile Cruise", hieroglyph: "𓇳" },
    { href: "/packages/classic-egypt-explorer", label: "𓊪 Classic Egypt Explorer", hieroglyph: "𓊪" },
    { href: "/packages/adventure-explorer", label: "𓈖 Adventure Explorer", hieroglyph: "𓈖" },
    { href: "/packages/cultural-discovery", label: "𓂀 Cultural Discovery", hieroglyph: "𓂀" },
  ]);

  const navLinks = [
    { href: "/dahabiyas", label: `${t('dahabiyat')}`, hieroglyph: "𓊪", hasDropdown: true, dropdownItems: dahabiyatItems },
    { href: "/packages", label: `${t('packages')}`, hieroglyph: "𓇳", hasDropdown: true, dropdownItems: packagesItems },
    { href: "/itineraries", label: "Itineraries", hieroglyph: "𓋖", hasDropdown: true, dropdownItems: itineraryItems },
    { href: "/gallery-new", label: "Gallery", hieroglyph: "𓂀" },
    { href: "/blogs", label: "Blogs", hieroglyph: "𓂋" },
    { href: "/tailor-made", label: "Tailor-Made", special: true, hieroglyph: "𓈖", singleLine: true },
    { href: "/about", label: `${t('about')}`, hieroglyph: "𓂀" },
    { href: "/schedule-and-rates", label: "Schedule & Rates", hieroglyph: "𓂀" },
    { href: "/contact", label: `${t('contact')}`, hieroglyph: "𓏏" },
  ];

  // Pale navbar styling for all pages with dark text
  const getNavbarStyle = () => {
    // All pages: Pale background with dark text for clarity
    return {
      background: scrolled
        ? 'rgba(248, 249, 250, 0.98)'  // Very pale background
        : 'rgba(250, 251, 252, 0.95)',  // Even paler background
      backdropFilter: scrolled ? 'blur(25px)' : 'blur(20px)',
      boxShadow: scrolled
        ? '0 2px 20px rgba(0, 0, 0, 0.08)'  // Subtle shadow
        : '0 2px 15px rgba(0, 0, 0, 0.04)',
      borderBottom: scrolled
        ? '1px solid rgba(0, 0, 0, 0.08)'  // Subtle border
        : '1px solid rgba(0, 0, 0, 0.04)'
    };
  };

  // Black text colors for ocean blue background
  const getTextColor = (isLogo = false) => {
    // Black text on ocean blue background for best clarity
    return 'hsl(0, 0%, 0%)';  // Black
  };

  // Black link colors for ocean blue background
  const getLinkColor = () => {
    // Black for links with hover effect
    return 'hsl(0, 0%, 0%)';  // Black
  };

  // Dark blue hover colors for black text on ocean blue background
  const getHoverColor = () => {
    // Dark blue hover effect for better contrast with black text
    return 'hsl(220, 100%, 30%)';  // Dark blue for hover
  };

  const navbarStyle = getNavbarStyle();
  
  // Calculate banner height based on variant - accurate measurements
  const getBannerHeight = () => {
    // Accurate banner heights including padding, text, and borders:
    // minimal: py-2 (16px) + text-2xl (~32px) + border (1px) = ~49px ≈ 3.1rem
    // default: py-3 (24px) + text-3xl (~36px) + border (2px) = ~62px ≈ 3.9rem
    // elegant: py-4 (32px) + text-4xl (~40px) + border (4px) = ~76px ≈ 4.8rem
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024;
      const isAdmin = pathname.includes('/admin');

      if (isMobile) return '3.1rem'; // minimal variant
      if (isAdmin) return '4.8rem'; // elegant variant
      return '3.9rem'; // default variant
    }
    return '3.9rem'; // fallback
  };

  return (
    <>
    <nav className="navbar-animate hidden lg:block" style={{
      position: 'fixed',
      top: `calc(${getBannerHeight()} + 2px)`, // Dynamic position below HieroglyphicTopBanner with 2px buffer
      left: 0,
      right: 0,
      zIndex: 50,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      background: navbarStyle.background,
      backdropFilter: navbarStyle.backdropFilter,
      borderBottom: navbarStyle.borderBottom,
      boxShadow: navbarStyle.boxShadow
    }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: scrolled || !isHomepage ? '4.5rem' : '5rem',
          width: '100%',
          gap: '1.5rem',
          justifyContent: 'space-between',
          minWidth: 0
        }}>
          {/* Logo + Site Name - Left side */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease-in-out',
            transform: 'scale(1)',
            minWidth: 'fit-content',
            flexShrink: 0
          }}>
            <Image
              src={logoUrl}
              alt={getContent('site_name', 'Cleopatra Dahabiyat')}
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
              onError={() => setLogoUrl('/images/logo.png')}
            />
            <span style={{
              color: 'hsl(0, 0%, 0%)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textShadow: isHomepage && !scrolled ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
              whiteSpace: 'nowrap'
            }}>
              {settings.siteName}
            </span>
          </Link>

          {/* Navigation Links - Center, single line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            flex: 1,
            overflow: 'visible',
            minWidth: 0
          }}>
            {navLinks.map((link, index) => (
              <div key={index} style={{ position: 'relative', flexShrink: 0 }}>
                {link.hasDropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        style={{
                          color: getTextColor(),
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          transition: 'all 0.3s ease',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem',
                          minWidth: 'fit-content',
                          maxWidth: 'none',
                          textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = getHoverColor();
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 128, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = getTextColor();
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {link.label}
                        <ChevronDown size={12} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 128, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '8px',
                        minWidth: '250px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000
                      }}
                    >
                      {/* Main page link */}
                      <DropdownMenuItem asChild>
                        <Link href={link.href} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          color: '#333',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          backgroundColor: 'rgba(0, 128, 255, 0.1)',
                          border: '1px solid rgba(0, 128, 255, 0.2)'
                        }}>
                          <span style={{ fontSize: '16px' }}>
                            {link.href === '/dahabiyas' ? '🚢' :
                             link.href === '/packages' ? '📦' :
                             link.href === '/itineraries' ? '🗺️' : '📋'}
                          </span>
                          {link.href === '/dahabiyas' ? 'View All Dahabiyas' :
                           link.href === '/packages' ? 'View All Packages' :
                           link.href === '/itineraries' ? 'View All Itineraries' : 'View All'}
                        </Link>
                      </DropdownMenuItem>

                      {/* Divider */}
                      <div style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(0, 128, 255, 0.3), transparent)',
                        margin: '8px 0'
                      }} />

                      {/* Dropdown items */}
                      {link.dropdownItems?.map((item, itemIndex) => (
                        <DropdownMenuItem key={itemIndex} asChild>
                          <Link href={item.href} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            transition: 'all 0.2s ease',
                            color: '#555',
                            textDecoration: 'none',
                            fontSize: '13px'
                          }}>
                            <span style={{ fontSize: '14px' }}>{item.hieroglyph}</span>
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={link.href}
                    style={{
                      color: link.special ? 'white' : getTextColor(),
                      fontSize: link.special ? '0.8rem' : '0.8rem',
                      fontWeight: link.special ? 600 : 500,
                      padding: link.special ? '0.5rem 1rem' : '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      background: link.special ? 'linear-gradient(135deg, hsl(200, 100%, 50%) 0%, hsl(220, 100%, 60%) 100%)' : 'transparent',
                      boxShadow: link.special ? '0 2px 8px rgba(0, 128, 255, 0.3)' : 'none',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 'fit-content',
                      maxWidth: 'none',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (!link.special) {
                        e.currentTarget.style.background = getHoverColor();
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 128, 255, 0.3)';
                      } else {
                        e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 128, 255, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!link.special) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = getTextColor();
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      } else {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 128, 255, 0.3)';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Language & Auth */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0
          }}>
            {/* Language Switcher */}
            <div style={{ position: 'relative' }}>
              <select
                value={language}
                onChange={handleLanguageChange}
                style={{
                  appearance: 'none',
                  border: isHomepage && !scrolled
                    ? '2px solid rgba(255, 255, 255, 0.4)'
                    : '2px solid transparent',
                  borderImage: !isHomepage || scrolled
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4)) 1'
                    : 'none',
                  borderRadius: '0.5rem',
                  padding: '0.25rem 1.5rem 0.25rem 0.5rem',
                  fontSize: '0.7rem',
                  minWidth: '3rem',
                  width: 'auto',
                  fontWeight: 600,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: 'hsl(222.2, 84%, 4.9%)',
                  background: isHomepage && !scrolled
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                  backdropFilter: 'blur(15px)',
                  cursor: 'pointer',
                  transform: 'scale(1)',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} style={{
                    color: 'hsl(222.2, 84%, 4.9%)',
                    backgroundColor: 'hsl(43, 75%, 95%)'
                  }}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <Globe size={12} style={{
                position: 'absolute',
                right: '0.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'hsl(222.2, 84%, 4.9%)'
              }} />
            </div>

            {/* Auth Section */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      backdropFilter: 'blur(15px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'white',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 16px rgba(0, 128, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <UserCircle size={14} style={{ marginRight: '0.25rem' }} />
                    {session.user?.name || session.user?.email}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" style={{ background: "white" }}>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'hsl(222.2, 84%, 4.9%)',
                      textDecoration: 'none'
                    }}>
                      <User size={16} />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {session.user?.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'hsl(222.2, 84%, 4.9%)',
                        textDecoration: 'none'
                      }}>
                        <LayoutDashboard size={16} />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'hsl(222.2, 84%, 4.9%)',
                    cursor: 'pointer'
                  }}>
                    <LogOut size={16} />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: isHomepage && !scrolled
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                backdropFilter: 'blur(15px)',
                border: isHomepage && !scrolled
                  ? '2px solid rgba(255, 255, 255, 0.4)'
                  : '2px solid transparent',
                borderImage: !isHomepage || scrolled
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4)) 1'
                  : 'none',
                borderRadius: '0.5rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'hsl(222.2, 84%, 4.9%)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
                textDecoration: 'none'
              }}>
                <User size={14} />
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>
      </div>

    </nav>

    {/* Mobile Navigation Component */}
    <div className="lg:hidden">
      <MobileNavigation
        isOpen={mobileOpen}
        onToggle={() => setMobileOpen(!mobileOpen)}
      />
    </div>
    </>
  );
}
