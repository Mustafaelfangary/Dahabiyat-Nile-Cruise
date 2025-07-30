"use client";

import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function HomeButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't show home button on the home page or admin dashboard
  if (pathname === '/' || pathname === '/admin') {
    return null;
  }

  const handleClick = () => {
    // Redirect admin users to admin panel, regular users to home
    if (session?.user?.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-40 right-6 z-50 w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
      aria-label={session?.user?.role === 'ADMIN' ? 'Go to Admin Dashboard' : 'Go to Home'}
      style={{ marginBottom: '0.5rem' }}
    >
      <Home className="w-5 h-5" />
    </button>
  );
}
