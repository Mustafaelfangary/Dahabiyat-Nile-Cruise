"use client";

import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

export function HomeButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show home button on the home page
  if (pathname === '/') {
    return null;
  }

  return (
    <button
      onClick={() => router.push('/')}
      className="fixed bottom-36 right-6 z-50 w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
      aria-label="Go to Home"
    >
      <Home className="w-5 h-5" />
    </button>
  );
}
