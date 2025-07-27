"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import MobileResetPasswordForm from '@/components/auth/mobile/MobileResetPasswordForm';
import { Loader } from 'lucide-react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-6">No reset token was provided in the URL.</p>
          <a 
            href="/auth/forgot-password"
            className="inline-block bg-egyptian-gold text-hieroglyph-brown px-6 py-3 rounded-lg font-semibold hover:bg-egyptian-gold/90 transition-colors"
          >
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return <MobileResetPasswordForm token={token} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl text-egyptian-gold">𓇳</div>
        <div className="absolute top-20 right-20 text-4xl text-egyptian-gold">𓈖</div>
        <div className="absolute bottom-20 left-20 text-5xl text-egyptian-gold">𓊪</div>
        <div className="absolute bottom-10 right-10 text-6xl text-egyptian-gold">𓏏</div>
        <div className="absolute top-1/2 left-1/4 text-3xl text-egyptian-gold">𓇳</div>
        <div className="absolute top-1/3 right-1/3 text-4xl text-egyptian-gold">𓈖</div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-hieroglyph-brown mb-2">
            Dahabiyat Nile Cruise
          </h1>
          <div className="text-2xl text-egyptian-gold mb-4">𓇳 𓈖 𓊪 𓏏 𓇳</div>
          <p className="text-gray-600">
            Experience the magic of ancient Egypt in luxury
          </p>
        </div>

        <ResetPasswordForm token={token} />

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; 2024 Dahabiyat Nile Cruise. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading reset password form...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
