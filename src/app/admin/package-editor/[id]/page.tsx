"use client";

import { useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PackageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Properly unwrap the async params using React.use()
  const resolvedParams = use(params);
  const packageId = resolvedParams.id;

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/admin');
      return;
    }

    // Redirect to the proper package management interface
    router.push('/admin/packages');
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-egyptian-gold mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-hieroglyph-brown mb-2">
          Redirecting to Package Management...
        </h2>
        <p className="text-amber-700">
          Taking you to the proper package editor interface
        </p>
      </div>
    </div>
  );
}
