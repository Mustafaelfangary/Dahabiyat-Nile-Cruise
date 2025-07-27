"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, Shield, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Email parameter is missing');
      router.push('/auth/signin');
    }
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setIsVerified(true);
      toast.success('Email verified successfully! Welcome to Dahabiyat Nile Cruise!');

      // Immediate redirect with fallback
      try {
        // Try immediate redirect first
        router.push('/auth/signin?verified=true');

        // Fallback redirect after 1 second if the first one fails
        setTimeout(() => {
          if (!window.location.pathname.includes('/auth/signin')) {
            window.location.href = '/auth/signin?verified=true';
          }
        }, 1000);

        // Final fallback after 3 seconds
        setTimeout(() => {
          if (!window.location.pathname.includes('/auth/signin')) {
            window.location.replace('/auth/signin?verified=true');
          }
        }, 3000);
      } catch (redirectError) {
        console.error('Redirect error:', redirectError);
        // Force redirect using window.location as last resort
        window.location.href = '/auth/signin?verified=true';
      }

    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      toast.success('Verification code sent! Check your email.');

    } catch (error) {
      console.error('Resend error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Email Verified!</h2>
            <p className="text-green-600 mb-4">
              Welcome to your royal journey with Dahabiyat Nile Cruise
            </p>
            <div className="text-2xl mb-4">🏺 👑 🚢</div>
            <p className="text-sm text-green-600 mb-4">
              Redirecting you to sign in...
            </p>
            <Button
              onClick={() => router.push('/auth/signin?verified=true')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Continue to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Sign In */}
        <div className="text-center">
          <Link 
            href="/auth/signin"
            className="inline-flex items-center text-amber-700 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Verify Your Royal Email
            </CardTitle>
            <CardDescription className="text-gray-600">
              We've sent a 6-digit verification code to<br />
              <strong className="text-amber-700">{email}</strong>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl font-mono tracking-widest border-amber-200 focus:border-amber-400"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Email
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-amber-100 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Check your email</p>
                  <p>
                    The verification code expires in 15 minutes. 
                    If you don't see the email, check your spam folder.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-2">𓇳 𓊪 𓇳</div>
              <p className="text-xs text-gray-500">
                Securing your royal account
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
