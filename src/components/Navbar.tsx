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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({ siteName: 'Dahabiyat Nile Cruise' });
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const pathname = usePathname();
  const { getContent } = useContent({ page: 'global_media' });
  const { getContent: getHomepageContent } = useContent({ page: 'homepage' });

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
          const items = data.dahabiyas.map((boat: any, index: number) => ({
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
          const items = data.map((itinerary: any, index: number) => ({
            href: `/itineraries/${itinerary.slug || itinerary.id}`,
            label: `${['𓋖', '𓇳', '𓊪', '𓂀', '𓏏'][index % 5]} ${itinerary.name}`,
            hieroglyph: ['𓋖', '𓇳', '𓊪', '𓂀', '𓏏'][index % 5]
          }));
          setItineraryItems(items);
        }
      })
      .catch(err => console.log('Using fallback itinerary items'));
  }, []);

  // Packages dropdown items
  const packagesItems = [
    { href: "/packages/luxury-nile-cruise", label: "𓇳 Luxury Nile Cruise", hieroglyph: "𓇳" },
    { href: "/packages/classic-egypt-explorer", label: "𓊪 Classic Egypt Explorer", hieroglyph: "𓊪" },
    { href: "/packages/adventure-explorer", label: "𓈖 Adventure Explorer", hieroglyph: "𓈖" },
    { href: "/packages/cultural-discovery", label: "𓂀 Cultural Discovery", hieroglyph: "𓂀" },
  ];

  const navLinks = [
    { href: "/dahabiyas", label: `𓊪 ${t('dahabiyat')} 𓊪`, hieroglyph: "𓊪", hasDropdown: true, dropdownItems: dahabiyatItems },
    { href: "/packages", label: `𓇳 ${t('packages')} 𓇳`, hieroglyph: "𓇳", hasDropdown: true, dropdownItems: packagesItems },
    { href: "/itineraries", label: "𓋖 Itineraries 𓋖", hieroglyph: "𓋖", hasDropdown: true, dropdownItems: itineraryItems },
    { href: "/gallery-new", label: "𓂀 Gallery 𓂀", hieroglyph: "𓂀" },
    { href: "/blogs", label: "📜 Chronicles 📜", hieroglyph: "𓂋" },
    { href: "/tailor-made", label: "𓈖 Tailor-Made 𓈖", special: true, hieroglyph: "𓈖", singleLine: true },
    { href: "/about", label: `𓂀 ${t('about')} 𓂀`, hieroglyph: "𓂀" },
    { href: "/contact", label: `𓏏 ${t('contact')} 𓏏`, hieroglyph: "𓏏" },
  ];

  // Pharaonic navbar styling - matching admin panel
  const getNavbarStyle = () => {
    if (isHomepage) {
      // Homepage: Pharaonic sand background with gold accents
      return {
        background: scrolled
          ? 'rgba(254, 247, 237, 0.95)'  // Pharaonic sand
          : 'rgba(254, 243, 199, 0.85)',  // Pharaonic cream
        backdropFilter: scrolled ? 'blur(25px)' : 'blur(15px)',
        boxShadow: scrolled
          ? '0 2px 20px rgba(212, 175, 55, 0.2)'  // Egyptian gold shadow
          : '0 2px 10px rgba(212, 175, 55, 0.1)',
        borderBottom: scrolled
          ? '1px solid rgba(212, 175, 55, 0.3)'  // Gold border
          : '1px solid rgba(212, 175, 55, 0.2)'
      };
    } else {
      // Other pages: Pharaonic cream background with gold accents
      return {
        background: 'rgba(254, 247, 237, 0.98)',  // Pharaonic sand
        backdropFilter: 'blur(20px)',
        boxShadow: '0 2px 20px rgba(212, 175, 55, 0.2)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)'
      };
    }
  };

  // Egyptian text colors for papyrus background
  const getTextColor = (isLogo = false) => {
    // Rich brown colors on papyrus background
    return 'hsl(30, 25%, 15%)';  // Hieroglyph brown
  };

  // Egyptian link colors for papyrus background
  const getLinkColor = () => {
    // Egyptian gold for links
    return 'hsl(45, 100%, 51%)';  // Egyptian amber
  };

  // Egyptian hover colors based on page and scroll state
  const getHoverColor = () => {
    if (isHomepage) {
      return scrolled
        ? 'linear-gradient(135deg, hsl(45, 100%, 51%) 0%, hsl(25, 100%, 60%) 100%)'  // Gold to orange
        : 'linear-gradient(135deg, hsl(45, 100%, 51%) 0%, hsl(25, 100%, 60%) 100%)';
    } else {
      return 'linear-gradient(135deg, hsl(45, 100%, 51%) 0%, hsl(25, 100%, 60%) 100%)';  // Consistent Egyptian gradient
    }
  };

  const navbarStyle = getNavbarStyle();
  
  return (
    <>
    <nav className="navbar-animate hidden lg:block" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      background: navbarStyle.background,
      backdropFilter: navbarStyle.backdropFilter,
      borderBottom: navbarStyle.borderBottom,
      boxShadow: navbarStyle.boxShadow
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: scrolled || !isHomepage ? '4.5rem' : '5rem',
          width: '100%',
          gap: '1rem',
          justifyContent: 'space-between'
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
              src="/images/logo.png"
              alt="Site Logo"
              width={56}
              height={56}
              className="h-14 w-auto"
              style={{
                filter: isHomepage && !scrolled ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' : 'none'
              }}
              priority
            />
            <span style={{
              color: 'hsl(45, 100%, 51%)',
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
            gap: '0.25rem',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            flex: 1,
            overflow: 'hidden'
          }}>
            {navLinks.map((link, index) => (
              <div key={index} style={{ position: 'relative', flexShrink: 0 }}>
                {link.hasDropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        style={{
                          color: getTextColor(),
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          padding: '0.375rem 0.5rem',
                          borderRadius: '0.375rem',
                          transition: 'all 0.3s ease',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.125rem',
                          minWidth: 'fit-content'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = getHoverColor();
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
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
                        background: 'rgba(254, 247, 237, 0.98)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
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
                          backgroundColor: 'rgba(212, 175, 55, 0.1)',
                          border: '1px solid rgba(212, 175, 55, 0.2)'
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
                        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)',
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
                      color: getTextColor(),
                      fontSize: link.special ? '0.75rem' : '0.75rem',
                      fontWeight: link.special ? 600 : 500,
                      padding: link.special ? '0.375rem 0.75rem' : '0.375rem 0.5rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      background: link.special ? 'linear-gradient(135deg, hsl(45, 100%, 51%) 0%, hsl(25, 100%, 60%) 100%)' : 'transparent',
                      color: link.special ? 'white' : getTextColor(),
                      boxShadow: link.special ? '0 2px 8px rgba(212, 175, 55, 0.3)' : 'none',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      minWidth: 'fit-content'
                    }}
                    onMouseEnter={(e) => {
                      if (!link.special) {
                        e.currentTarget.style.background = getHoverColor();
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
                      } else {
                        e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
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
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(212, 175, 55, 0.3)';
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
