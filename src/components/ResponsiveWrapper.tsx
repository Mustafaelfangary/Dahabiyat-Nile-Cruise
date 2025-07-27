"use client";

import { ReactNode } from 'react';
import MobileLayout from './mobile/MobileLayout';

interface ResponsiveWrapperProps {
  children: ReactNode;
  mobileChildren?: ReactNode;
}

export default function ResponsiveWrapper({ children, mobileChildren }: ResponsiveWrapperProps) {
  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        {children}
      </div>
      
      {/* Mobile Version */}
      <MobileLayout>
        {mobileChildren || children}
      </MobileLayout>
    </>
  );
}
