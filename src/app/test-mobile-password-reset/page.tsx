"use client";

import { useState } from 'react';
import MobileForgotPasswordForm from '@/components/auth/mobile/MobileForgotPasswordForm';
import MobileResetPasswordForm from '@/components/auth/mobile/MobileResetPasswordForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestMobilePasswordResetPage() {
  const [currentView, setCurrentView] = useState<'menu' | 'forgot' | 'reset'>('menu');
  const [testToken] = useState('test-token-123'); // Mock token for testing

  const handleBack = () => {
    setCurrentView('menu');
  };

  if (currentView === 'forgot') {
    return <MobileForgotPasswordForm onBack={handleBack} />;
  }

  if (currentView === 'reset') {
    return <MobileResetPasswordForm token={testToken} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Mobile Password Reset Test
            </CardTitle>
            <div className="text-lg text-egyptian-gold">𓇳 𓈖 𓊪 𓏏 𓇳</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center mb-6">
              Test the mobile versions of the password reset forms
            </p>
            
            <Button
              onClick={() => setCurrentView('forgot')}
              className="w-full h-12 bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
            >
              Test Mobile Forgot Password
            </Button>
            
            <Button
              onClick={() => setCurrentView('reset')}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Test Mobile Reset Password
            </Button>

            <div className="pt-4 space-y-2">
              <Button
                onClick={() => window.open('/auth/forgot-password', '_blank')}
                variant="outline"
                className="w-full"
              >
                Test Desktop Forgot Password
              </Button>
              
              <Button
                onClick={() => window.open('/auth/reset-password?token=test-token', '_blank')}
                variant="outline"
                className="w-full"
              >
                Test Desktop Reset Password
              </Button>
            </div>

            <div className="text-center pt-4 text-sm text-gray-500">
              <p>Use browser dev tools to simulate mobile device</p>
              <p>Or resize browser window to &lt; 768px width</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
