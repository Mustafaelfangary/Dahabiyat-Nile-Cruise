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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/10">
      <Container maxWidth={false} className="py-8">
        <AnimatedSection animation="fade-in">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Booking Management */}
            <div className="xl:col-span-3">
              <EnhancedBookingManager />
            </div>

            {/* Notification Center Sidebar */}
            <div className="xl:col-span-1">
              <NotificationCenter className="sticky top-8" />
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </div>
  );
}