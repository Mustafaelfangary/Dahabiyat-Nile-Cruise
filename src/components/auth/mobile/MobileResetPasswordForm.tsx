"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader, Lock, Eye, EyeOff, CheckCircle, AlertCircle, XCircle, ArrowLeft } from 'lucide-react';

interface MobileResetPasswordFormProps {
  token: string;
  className?: string;
}

export default function MobileResetPasswordForm({ token, className = '' }: MobileResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState<{ email: string; name: string } | null>(null);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await response.json();

        if (response.ok && data.valid) {
          setTokenValid(true);
          setUserInfo(data.user);
        } else {
          setError(data.error || 'Invalid or expired reset token');
        }
      } catch (error) {
        setError('Failed to verify reset token');
      } finally {
        setVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setError('No reset token provided');
      setVerifying(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin?message=Password reset successful. Please sign in with your new password.');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Very Weak', color: 'text-red-500' };
      case 2: return { text: 'Weak', color: 'text-orange-500' };
      case 3: return { text: 'Fair', color: 'text-yellow-500' };
      case 4: return { text: 'Good', color: 'text-blue-500' };
      case 5: return { text: 'Strong', color: 'text-green-500' };
      default: return { text: '', color: '' };
    }
  };

  if (verifying) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 p-4 flex flex-col justify-center ${className}`}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Reset Token</h2>
          <p className="text-gray-600">Please wait while we verify your reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 p-4 flex flex-col justify-center ${className}`}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Invalid Reset Link
          </h1>
          <div className="text-lg text-egyptian-gold mb-4">𓇳 𓈖 𓊪 𓏏 𓇳</div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mx-auto w-full max-w-sm">
          <p className="text-gray-600 text-center mb-6">
            This password reset link is invalid or has expired.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/auth/forgot-password')}
              className="w-full h-12 bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90 rounded-xl"
            >
              Request New Reset Link
            </Button>
            <Button 
              onClick={() => router.push('/auth/signin')}
              variant="ghost" 
              className="w-full h-12 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 p-4 flex flex-col justify-center ${className}`}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Password Reset Successful!
          </h1>
          <div className="text-lg text-egyptian-gold mb-4">𓇳 𓈖 𓊪 𓏏 𓇳</div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mx-auto w-full max-w-sm">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to sign in page in 3 seconds...
            </p>
          </div>
          <Button 
            onClick={() => router.push('/auth/signin')}
            className="w-full h-12 mt-6 bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90 rounded-xl"
          >
            Sign In Now
          </Button>
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 p-4 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <Button 
          onClick={() => router.push('/auth/signin')} 
          variant="ghost" 
          size="sm"
          className="p-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Reset Password</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Create New Password
          </h2>
          <div className="text-lg text-egyptian-gold mb-4">𓇳 𓈖 𓊪 𓏏 𓇳</div>
          {userInfo && (
            <p className="text-gray-600 px-4 break-all">
              Setting new password for <strong>{userInfo.email}</strong>
            </p>
          )}
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
              <Label htmlFor="password" className="text-base font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-14 text-base rounded-xl border-2 focus:border-egyptian-gold pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>Strength:</span>
                  <span className={strengthInfo.color}>{strengthInfo.text}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength <= 1 ? 'bg-red-500' :
                        passwordStrength <= 2 ? 'bg-orange-500' :
                        passwordStrength <= 3 ? 'bg-yellow-500' :
                        passwordStrength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-base font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-14 text-base rounded-xl border-2 focus:border-egyptian-gold pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-base bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90 rounded-xl font-semibold"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword || password.length < 8}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-xs text-gray-500 space-y-1">
            <p className="font-medium">Password requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>At least 8 characters long</li>
              <li>Mix of uppercase and lowercase letters</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </div>
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
