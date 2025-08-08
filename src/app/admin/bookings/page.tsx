'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import EnhancedBookingManager from '@/components/admin/EnhancedBookingManager';
import NotificationCenter from '@/components/admin/NotificationCenter';
import { Container } from '@/components/ui/container';
import { AnimatedSection } from '@/components/ui/animated-section';

export default function AdminBookingsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-blue"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-navy-blue-50/10 w-full overflow-x-hidden">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <AnimatedSection animation="fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
            {/* Main Booking Management */}
            <div className="lg:col-span-2 xl:col-span-3 min-w-0">
              <EnhancedBookingManager />
            </div>

            {/* Notification Center Sidebar */}
            <div className="lg:col-span-1 xl:col-span-1 min-w-0">
              <NotificationCenter className="sticky top-20 sm:top-24" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}