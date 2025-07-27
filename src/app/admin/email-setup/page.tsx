'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Check, AlertCircle } from 'lucide-react';

export default function EmailSetupPage() {
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCurrentEmail();
  }, []);

  const fetchCurrentEmail = async () => {
    try {
      const response = await fetch('/api/website-content/email-notifications');
      if (response.ok) {
        const data = await response.json();
        const emailField = data.fields?.find((f: any) => f.key === 'admin_email');
        if (emailField) {
          setAdminEmail(emailField.value);
        }
      }
    } catch (error) {
      console.error('Error fetching current email:', error);
    }
  };

  const saveAdminEmail = async () => {
    if (!adminEmail) {
      toast.error('Please enter an email address');
      return;
    }

    if (!adminEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/website-content/email-notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId: 'admin-email',
          value: adminEmail
        })
      });

      if (response.ok) {
        toast.success('Admin email address saved successfully!');
      } else {
        toast.error('Failed to save email address');
      }
    } catch (error) {
      toast.error('Failed to save email address');
    } finally {
      setSaving(false);
    }
  };

  const testBookingNotifications = async (type: 'dahabiya' | 'package' | 'both') => {
    if (!adminEmail) {
      toast.error('Please enter and save an email address first');
      return;
    }

    try {
      setTesting(true);
      const response = await fetch('/api/admin/test-booking-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          adminEmail, 
          testType: type === 'both' ? undefined : type 
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Test ${type} booking notification(s) sent to ${adminEmail}!`);
      } else {
        toast.error(data.error || 'Failed to send test notification');
      }
    } catch (error) {
      toast.error('Failed to send test notification');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">📧 Booking Email Notifications</h1>
          <p className="text-text-primary">
            Set up your email address to receive automatic notifications when customers book cruises or packages.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          
          {/* Admin Email Setup */}
          <div>
            <Label htmlFor="admin-email" className="text-lg font-semibold">
              Your Email Address
            </Label>
            <p className="text-sm text-text-primary mb-3">
              Enter the email address where you want to receive booking notifications
            </p>
            <div className="flex gap-3">
              <Input
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="your-email@gmail.com"
                className="flex-1"
              />
              <Button 
                onClick={saveAdminEmail}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-text-primary"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Test Notifications */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Test Notifications</h3>
            <p className="text-sm text-text-primary mb-4">
              Send test booking notifications to verify your email setup is working correctly.
            </p>
            
            <div className="grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={() => testBookingNotifications('dahabiya')}
                disabled={testing || !adminEmail}
                variant="outline"
                className="border-blue-600 text-text-primary hover:bg-blue-600 hover:text-text-primary"
              >
                {testing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Test Cruise Booking
              </Button>
              
              <Button
                onClick={() => testBookingNotifications('package')}
                disabled={testing || !adminEmail}
                variant="outline"
                className="border-purple-600 text-text-primary hover:bg-purple-600 hover:text-text-primary"
              >
                {testing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Test Package Booking
              </Button>
              
              <Button
                onClick={() => testBookingNotifications('both')}
                disabled={testing || !adminEmail}
                variant="outline"
                className="border-green-600 text-text-primary hover:bg-green-600 hover:text-text-primary"
              >
                {testing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Test Both
              </Button>
            </div>
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-text-primary mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-text-primary mb-2">How It Works</h4>
                <ul className="text-sm text-text-primary space-y-1">
                  <li>• You'll receive an email immediately when any customer books a cruise or package</li>
                  <li>• Emails include complete booking details (customer info, dates, pricing)</li>
                  <li>• Notifications work for both dahabiya cruises and tour packages</li>
                  <li>• Make sure to check your spam folder if you don't see test emails</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => window.open('/admin/website', '_blank')}
              variant="outline"
            >
              Email Settings Dashboard
            </Button>
            <Button 
              onClick={() => window.open('/admin/bookings', '_blank')}
              variant="outline"
            >
              View Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
