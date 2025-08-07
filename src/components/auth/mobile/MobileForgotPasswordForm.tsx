"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface MobileForgotPasswordFormProps {
  onBack?: () => void;
  className?: string;
}

export default function MobileForgotPasswordForm({ onBack, className = '' }: MobileForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (success) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-ocean-blue-lightest/30 to-slate-50 p-4 flex flex-col ${className}`}>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Check Your Email
            </h1>
            <div className="text-lg text-ocean-blue mb-2">𓇳 𓈖 𓊪 𓏏 𓇳</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mx-auto w-full max-w-sm">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                We've sent a password reset link to
              </p>
              <p className="font-semibold text-gray-800 break-all">
                {email}
              </p>
              <p className="text-sm text-gray-500">
                If you don't see the email in your inbox, please check your spam folder.
                The link will expire in 1 hour.
              </p>
            </div>

            <div className="space-y-3 mt-6">
              <Button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                variant="outline"
                className="w-full h-12 text-base"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Another Email
              </Button>
              
              <Button 
                onClick={onBack} 
                variant="ghost" 
                className="w-full h-12 text-base"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 p-4 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <Button 
          onClick={onBack} 
          variant="ghost" 
          size="sm"
          className="p-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Forgot Password</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Reset Your Password
          </h2>
          <div className="text-lg text-egyptian-gold mb-4">𓇳 𓈖 𓊪 𓏏 𓇳</div>
          <p className="text-gray-600 px-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mx-auto w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-14 text-base rounded-xl border-2 focus:border-egyptian-gold"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-base bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90 rounded-xl font-semibold"
              disabled={loading || !email || !isValidEmail(email)}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Dahabiyat Nile Cruise</p>
          <p>Experience the magic of ancient Egypt</p>
        </div>
      </div>
    </div>
  );
}
