"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileNavigation from '@/components/mobile/MobileNavigation';
import AutoZoomProvider from '@/components/ui/AutoZoomProvider';
import HieroglyphicTopBanner from '@/components/ui/HieroglyphicTopBanner';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if we're on an admin page
  const isAdmin = pathname.startsWith('/admin');
  const showNavbar = !isAdmin;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll for navbar height changes
  useEffect(() => {
    if (!showNavbar) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showNavbar]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <AutoZoomProvider enabled={!isAdmin}>
      {/* Hieroglyphic Top Banner - appears on ALL pages */}
      <HieroglyphicTopBanner
        variant={isMobile ? 'minimal' : isAdmin ? 'elegant' : 'default'}
        animated={true}
      />

      {showNavbar && (
        <>
          {isMobile ? (
            <MobileNavigation
              isOpen={mobileMenuOpen}
              onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          ) : (
            <Navbar />
          )}
        </>
      )}
      <main
        className={`transition-all duration-300 ${
          isMobile && showNavbar ? 'pt-32' : ''
        }`}
        style={{
          paddingTop: showNavbar && !isMobile ? (scrolled ? '8rem' : '9rem') : '0'
        }}
      >
        {children}
      </main>
      {showNavbar && <Footer />}
    </AutoZoomProvider>
  );
}
