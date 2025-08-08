"use client";

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();
  
  // Check if we're on a page that needs special mobile handling
  const isHomepage = pathname === '/';
  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/auth');
  
  return (
    <div className="lg:hidden">
      {/* Mobile Content Container */}
      <div className={`min-h-screen ${
        isHomepage
          ? 'bg-gradient-to-b from-white via-blue-50/20 to-blue-100/10'
          : isAdminPage
          ? 'bg-gradient-to-br from-white via-blue-50/10 to-indigo-50/5'
          : isAuthPage
          ? 'bg-gradient-to-br from-white via-blue-50/10 to-blue-100/5'
          : 'bg-white'
      }`}>
        {/* Mobile Top Spacing */}
        <div className="pt-20">
          {/* Mobile Content Wrapper */}
          <div className={`${
            isAdminPage 
              ? 'px-4 py-6' 
              : isAuthPage
              ? 'px-4 py-8'
              : 'px-4 py-6'
          }`}>
            {children}
          </div>
        </div>
        
        {/* Mobile Bottom Spacing */}
        <div className="pb-6"></div>
      </div>
    </div>
  );
}
