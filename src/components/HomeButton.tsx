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
    <Button
      onClick={() => router.push('/')}
      variant="outline"
      size="sm"
      className="fixed bottom-4 left-4 z-50 bg-amber-600 hover:bg-amber-700 text-black border-amber-600 hover:border-amber-700 shadow-lg"
    >
      <Home className="w-4 h-4 mr-2" />
      Home
    </Button>
  );
}
