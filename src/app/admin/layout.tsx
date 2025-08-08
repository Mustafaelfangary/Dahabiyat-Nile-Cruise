'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import '../globals.css';
import '../../styles/admin.css';

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
          <AdminHeader />
          <main className="admin-content w-full">
            <div className="w-full max-w-full overflow-x-hidden">
              {children}
            </div>
          </main>
        </div>
      </SessionProvider>
    </QueryClientProvider>
  );
}
