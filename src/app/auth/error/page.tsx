"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

const errorMessages: Record<string, { title: string; description: string; action?: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to access this resource.',
    action: 'Try signing in with a different account'
  },
  Verification: {
    title: 'Email Verification Required',
    description: 'Please verify your email address before signing in.',
    action: 'Check your email for verification instructions'
  },
  Default: {
    title: 'Authentication Error',
    description: 'An error occurred during authentication. Please try again.',
    action: 'Try signing in again'
  },
  CredentialsSignin: {
    title: 'Invalid Credentials',
    description: 'The email or password you entered is incorrect.',
    action: 'Please check your credentials and try again'
  },
  EmailCreateAccount: {
    title: 'Email Account Creation Failed',
    description: 'Could not create an account with this email address.',
    action: 'Try using a different email address'
  },
  Callback: {
    title: 'Callback Error',
    description: 'An error occurred during the authentication callback.',
    action: 'Please try signing in again'
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'An error occurred while signing in with your OAuth provider.',
    action: 'Please try again or use a different sign in method'
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'An error occurred during OAuth authentication.',
    action: 'Please try signing in again'
  },
  OAuthCreateAccount: {
    title: 'OAuth Account Creation Failed',
    description: 'Could not create an account with your OAuth provider.',
    action: 'Try using a different authentication method'
  },
  EmailSignin: {
    title: 'Email Sign In Error',
    description: 'Could not send sign in email.',
    action: 'Please check your email address and try again'
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You must be signed in to access this page.',
    action: 'Please sign in to continue'
  }
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string>('Default');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam && errorMessages[errorParam]) {
      setError(errorParam);
    }
  }, [searchParams]);

  const errorInfo = errorMessages[error] || errorMessages.Default;

  const handleRetry = () => {
    router.push('/auth/signin');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {errorInfo.action && (
              <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">What you can do:</p>
                    <p>{errorInfo.action}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </div>

            <div className="text-center">
              <Link 
                href="/contact"
                className="text-sm text-gray-600 hover:text-amber-700 transition-colors"
              >
                Still having trouble? Contact support
              </Link>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-2">𓇳 𓊪 𓇳</div>
              <p className="text-xs text-gray-500">
                Dahabiyat Nile Cruise - Royal Nile Journeys
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Debug Information (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-700">
                Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Error Code:</strong> {error}</p>
                <p><strong>URL:</strong> {window.location.href}</p>
                <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
