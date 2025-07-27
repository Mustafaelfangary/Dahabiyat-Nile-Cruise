"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  Loader, 
  CheckCircle, 
  XCircle, 
  Mail,
  Lock,
  TestTube,
  User
} from 'lucide-react';

export default function TestPasswordResetPage() {
  const { data: session, status } = useSession();
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testForgotPassword = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await response.json();
      
      setResults({
        type: 'forgot-password',
        success: response.ok,
        data,
        timestamp: new Date().toISOString()
      });

      if (response.ok) {
        toast.success('Password reset email sent successfully!');
      } else {
        toast.error(data.error || 'Failed to send password reset email');
      }
    } catch (error) {
      toast.error('Network error occurred');
      setResults({
        type: 'forgot-password',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testCreateUser = async () => {
    const testUserData = {
      name: 'Test User',
      email: testEmail,
      password: 'TestPassword123!',
      phone: '+1234567890'
    };

    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUserData),
      });

      const data = await response.json();
      
      setResults({
        type: 'create-user',
        success: response.ok,
        data,
        timestamp: new Date().toISOString()
      });

      if (response.ok) {
        toast.success('Test user created successfully!');
      } else {
        toast.error(data.error || 'Failed to create test user');
      }
    } catch (error) {
      toast.error('Network error occurred');
      setResults({
        type: 'create-user',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <TestTube className="w-16 h-16 text-egyptian-gold mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Password Reset System Test</h1>
          <p className="text-gray-600">Test the forgot password and reset password functionality</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-egyptian-gold" />
                Create Test User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <Button 
                onClick={testCreateUser} 
                disabled={loading || !testEmail}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating Test User...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Create Test User
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-egyptian-gold" />
                Test Forgot Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="forgotEmail">Email Address</Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  placeholder="Enter email to test"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <Button 
                onClick={testForgotPassword} 
                disabled={loading || !testEmail}
                className="w-full bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Sending Reset Email...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                Test Results - {results.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
              
              {results.success && results.type === 'forgot-password' && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Password reset email sent successfully! Check your email for the reset link.
                    The link will expire in 1 hour.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🧪 Testing Instructions</h3>
          <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
            <li><strong>Create Test User:</strong> First create a test user with a valid email address</li>
            <li><strong>Test Forgot Password:</strong> Use the same email to test the forgot password flow</li>
            <li><strong>Check Email:</strong> Look for the password reset email in your inbox</li>
            <li><strong>Test Reset Link:</strong> Click the link in the email to test the reset password form</li>
            <li><strong>Complete Reset:</strong> Set a new password and verify you can sign in</li>
          </ol>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <Button
            onClick={() => window.open('/auth/forgot-password', '_blank')}
            variant="outline"
          >
            <Lock className="w-4 h-4 mr-2" />
            Test Forgot Password Page
          </Button>
          <Button
            onClick={() => window.open('/auth/signin', '_blank')}
            variant="outline"
          >
            <User className="w-4 h-4 mr-2" />
            Test Sign In Page
          </Button>
        </div>
      </div>
    </div>
  );
}
