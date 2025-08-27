'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import '../globals.css';
import '../../styles/admin.css';
import '../../styles/admin-contrast-fix.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <div className="admin-layout min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
          <div className="admin-header-mobile">
            <AdminHeader />
          </div>
          <main className="admin-content w-full px-2 sm:px-4 lg:px-6">
            <div className="w-full max-w-full overflow-x-hidden">
              <div className="py-3 sm:py-4 md:py-6 lg:py-8">
                <div className="admin-mobile-container">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </SessionProvider>
    </QueryClientProvider>
  );
}
