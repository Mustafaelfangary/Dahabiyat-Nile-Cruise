"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
}

export default function MobileOptimizedLayout({ children }: MobileOptimizedLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobile(width < 768);
      setIsLandscape(width > height && width < 768);
      setIsSmallScreen(width <= 320 || (width <= 568 && height <= 320));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Apply mobile-specific classes to body when on mobile
    if (isMobile) {
      document.body.classList.add('mobile-optimized');

      // Add orientation and screen size classes
      if (isLandscape) {
        document.body.classList.add('mobile-landscape');
      } else {
        document.body.classList.remove('mobile-landscape');
      }

      if (isSmallScreen) {
        document.body.classList.add('mobile-small-screen');
      } else {
        document.body.classList.remove('mobile-small-screen');
      }

      // Add mobile-specific meta tags
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
    } else {
      document.body.classList.remove('mobile-optimized', 'mobile-landscape', 'mobile-small-screen');
    }

    return () => {
      document.body.classList.remove('mobile-optimized', 'mobile-landscape', 'mobile-small-screen');
    };
  }, [isMobile, isLandscape, isSmallScreen]);

  // Mobile-specific styles with Ocean Blue theme
  const mobileStyles = isMobile ? {
    fontSize: '14px',
    lineHeight: '1.4',
    overflow: 'hidden auto',
    WebkitOverflowScrolling: 'touch',
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: pathname === '/'
      ? 'linear-gradient(to bottom, #ffffff, #f0f8ff, #e6f3ff)'
      : pathname.startsWith('/admin')
      ? 'linear-gradient(to bottom right, #f8fafc, #e0f2fe, #dbeafe)'
      : '#ffffff',
  } : {};

  return (
    <div
      className={`mobile-layout-wrapper ${isMobile ? 'mobile-mode' : 'desktop-mode'} ${isLandscape ? 'landscape-mode' : 'portrait-mode'} ${isSmallScreen ? 'small-screen-mode' : ''}`}
      style={mobileStyles}
    >
      {/* Mobile-specific CSS injection */}
      {isMobile && (
        <style jsx global>{`
          /* Mobile Typography Overrides */
          .mobile-mode h1 {
            font-size: 1.5rem !important;
            line-height: 1.2 !important;
            margin-bottom: 0.75rem !important;
            word-wrap: break-word !important;
            hyphens: auto !important;
          }
          
          .mobile-mode h2 {
            font-size: 1.25rem !important;
            line-height: 1.3 !important;
            margin-bottom: 0.5rem !important;
          }
          
          .mobile-mode h3 {
            font-size: 1.125rem !important;
            line-height: 1.3 !important;
            margin-bottom: 0.5rem !important;
          }
          
          .mobile-mode h4 {
            font-size: 1rem !important;
            line-height: 1.3 !important;
            margin-bottom: 0.5rem !important;
          }

          /* Landscape mode adjustments */
          .landscape-mode section {
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }

          .landscape-mode .mobile-hero-title {
            font-size: 1.25rem !important;
          }

          .landscape-mode .founder-image-section .relative {
            width: 5rem !important;
            height: 5rem !important;
          }

          /* Small screen mode adjustments */
          .small-screen-mode .mobile-title {
            font-size: 1rem !important;
          }

          .small-screen-mode .founder-image-section .relative {
            width: 4rem !important;
            height: 4rem !important;
          }

          .small-screen-mode section {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
          
          .mobile-mode p {
            font-size: 0.875rem !important;
            line-height: 1.4 !important;
            margin-bottom: 0.75rem !important;
          }
          
          /* Mobile Button Styles */
          .mobile-mode button {
            min-height: 44px !important;
            font-size: 0.875rem !important;
            padding: 0.75rem 1rem !important;
            border-radius: 0.5rem !important;
          }
          
          /* Mobile Card Styles */
          .mobile-mode .card-title {
            font-size: 1rem !important;
            line-height: 1.3 !important;
            margin-bottom: 0.5rem !important;
          }
          
          .mobile-mode .card-subtitle {
            font-size: 0.875rem !important;
            line-height: 1.4 !important;
            margin-bottom: 0.5rem !important;
          }
          
          /* Mobile Navigation */
          .mobile-mode .nav-link {
            font-size: 0.875rem !important;
            padding: 0.75rem 1rem !important;
            line-height: 1.2 !important;
          }
          
          /* Mobile Hero Section */
          .mobile-mode .hero-title {
            font-size: 1.5rem !important;
            line-height: 1.2 !important;
            text-align: center !important;
            padding: 0 1rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          .mobile-mode .hero-subtitle {
            font-size: 0.875rem !important;
            line-height: 1.4 !important;
            text-align: center !important;
            padding: 0 1.5rem !important;
            margin-bottom: 1rem !important;
          }
          
          /* Mobile Section Titles */
          .mobile-mode .section-title {
            font-size: 1.25rem !important;
            line-height: 1.3 !important;
            text-align: center !important;
            padding: 0 1rem !important;
            margin-bottom: 1rem !important;
            word-wrap: break-word !important;
            hyphens: auto !important;
          }
          
          /* Mobile Container Spacing */
          .mobile-mode .container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .mobile-mode .section {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
          
          /* Mobile Text Wrapping */
          .mobile-mode * {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
          }
          
          /* Mobile Image Responsiveness */
          .mobile-mode img {
            max-width: 100% !important;
            height: auto !important;
          }
          
          /* Mobile Form Elements */
          .mobile-mode input,
          .mobile-mode textarea,
          .mobile-mode select {
            font-size: 16px !important; /* Prevents zoom on iOS */
            min-height: 44px !important;
            padding: 0.75rem !important;
          }
          
          /* Mobile Dropdown Menus */
          .mobile-mode .dropdown-menu {
            font-size: 0.875rem !important;
            max-width: calc(100vw - 2rem) !important;
          }
          
          .mobile-mode .dropdown-item {
            padding: 0.75rem 1rem !important;
            line-height: 1.2 !important;
          }
          
          /* Mobile Pharaonic Elements */
          .mobile-mode .pharaonic-title {
            font-size: 1.25rem !important;
            line-height: 1.2 !important;
            text-align: center !important;
          }
          
          .mobile-mode .hieroglyph {
            font-size: 1rem !important;
          }
          
          /* Mobile Booking Forms */
          .mobile-mode .booking-form {
            padding: 1rem !important;
          }
          
          .mobile-mode .booking-form .form-group {
            margin-bottom: 1rem !important;
          }
          
          .mobile-mode .booking-form label {
            font-size: 0.875rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          /* Mobile Price Display */
          .mobile-mode .price-display {
            font-size: 1.125rem !important;
            text-align: center !important;
          }
          
          /* Mobile Gallery */
          .mobile-mode .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
          
          /* Mobile Footer */
          .mobile-mode .footer {
            padding: 1.5rem 1rem !important;
          }
          
          .mobile-mode .footer-section {
            margin-bottom: 1.5rem !important;
          }
          
          .mobile-mode .footer-title {
            font-size: 1rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          .mobile-mode .footer-link {
            font-size: 0.875rem !important;
            padding: 0.25rem 0 !important;
          }
          
          /* Mobile Animations - Reduce motion for performance */
          .mobile-mode * {
            animation-duration: 0.2s !important;
            transition-duration: 0.2s !important;
          }
          
          /* Mobile Scroll Behavior */
          .mobile-mode {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Mobile Touch Targets */
          .mobile-mode a,
          .mobile-mode button,
          .mobile-mode [role="button"] {
            min-height: 44px !important;
            min-width: 44px !important;
          }
        `}</style>
      )}
      
      {children}
    </div>
  );
}
