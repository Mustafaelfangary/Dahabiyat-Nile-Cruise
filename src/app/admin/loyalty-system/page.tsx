"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Crown, 
  Package, 
  Facebook, 
  Instagram, 
  Youtube, 
  Camera, 
  Save, 
  RefreshCw,
  Plus,
  Trash2,
  Settings,
  Award,
  ExternalLink
} from 'lucide-react';

interface LoyaltyButton {
  id: string;
  label: string;
  points: number;
  enabled: boolean;
  url?: string;
  action: 'redirect' | 'internal' | 'modal';
  description: string;
  color: string;
}

interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
}

export default function LoyaltySystemPage() {
  const { data: session, status } = useSession();
  const [buttons, setButtons] = useState<LoyaltyButton[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: 'https://facebook.com/cleopatradahabiya',
    instagram: 'https://instagram.com/cleopatradahabiya',
    youtube: 'https://youtube.com/@cleopatradahabiya'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const defaultButtons: LoyaltyButton[] = [
    {
      id: 'book-package',
      label: 'Book a Package',
      points: 500,
      enabled: true,
      url: '/packages',
      action: 'redirect',
      description: 'Browse and book our luxury packages',
      color: 'bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500'
    },
    {
      id: 'like-facebook',
      label: 'Like Us',
      points: 50,
      enabled: true,
      url: 'https://facebook.com/cleopatradahabiya',
      action: 'redirect',
      description: 'Follow us on Facebook',
      color: 'bg-gradient-to-r from-blue-600 to-blue-700'
    },
    {
      id: 'follow-instagram',
      label: 'Follow Us',
      points: 50,
      enabled: true,
      url: 'https://instagram.com/cleopatradahabiya',
      action: 'redirect',
      description: 'Follow us on Instagram',
      color: 'bg-gradient-to-r from-pink-500 to-purple-600'
    },
    {
      id: 'subscribe-youtube',
      label: 'Subscribe',
      points: 75,
      enabled: true,
      url: 'https://youtube.com/@cleopatradahabiya',
      action: 'redirect',
      description: 'Subscribe to our YouTube channel',
      color: 'bg-gradient-to-r from-red-500 to-red-600'
    },
    {
      id: 'share-memories',
      label: 'Share Memories',
      points: 100,
      enabled: true,
      action: 'internal',
      description: 'Share your travel memories with us',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600'
    }
  ];

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchLoyaltyConfig();
    }
  }, [session]);

  const fetchLoyaltyConfig = async () => {
    try {
      const response = await fetch('/api/loyalty/buttons');
      if (response.ok) {
        const data = await response.json();
        setButtons(data.buttons || defaultButtons);
      } else {
        setButtons(defaultButtons);
      }
    } catch (error) {
      console.error('Error fetching loyalty config:', error);
      setButtons(defaultButtons);
    } finally {
      setLoading(false);
    }
  };

  const handleRuleChange = (index: number, field: string, value: string | number | boolean) => {
    const updatedButtons = [...buttons];
    updatedButtons[index] = { ...updatedButtons[index], [field]: value } as LoyaltyButton;
    setButtons(updatedButtons);
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      // Update social media URLs in buttons
      const updatedButtons = buttons.map(button => {
        if (button.id === 'like-facebook') {
          return { ...button, url: socialLinks.facebook };
        }
        if (button.id === 'follow-instagram') {
          return { ...button, url: socialLinks.instagram };
        }
        if (button.id === 'subscribe-youtube') {
          return { ...button, url: socialLinks.youtube };
        }
        return button;
      });

      const response = await fetch('/api/loyalty/buttons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buttons: updatedButtons,
          socialLinks
        }),
      });

      if (response.ok) {
        toast.success('Loyalty system configuration saved successfully!');
        setButtons(updatedButtons);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving loyalty config:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getButtonIcon = (buttonId: string) => {
    switch (buttonId) {
      case 'book-package': return Package;
      case 'like-facebook': return Facebook;
      case 'follow-instagram': return Instagram;
      case 'subscribe-youtube': return Youtube;
      case 'share-memories': return Camera;
      default: return Award;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Loading loyalty system configuration...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 mx-auto mb-4 text-amber-600" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-blue-50 via-navy-blue-50 to-deep-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 rounded-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Loyalty System Management</h1>
              <p className="text-gray-600">Configure loyalty buttons, points, and social media links</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-600" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  value={socialLinks.youtube}
                  onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Buttons Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Loyalty Buttons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {buttons.map((button, index) => {
                  const IconComponent = getButtonIcon(button.id);
                  return (
                    <div key={button.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">{button.label}</span>
                        </div>
                        <Switch
                          checked={button.enabled}
                          onCheckedChange={(checked) => handleRuleChange(index, 'enabled', checked)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Points</Label>
                          <Input
                            type="number"
                            value={button.points}
                            onChange={(e) => handleRuleChange(index, 'points', parseInt(e.target.value) || 0)}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Action</Label>
                          <select
                            value={button.action}
                            onChange={(e) => handleRuleChange(index, 'action', e.target.value)}
                            className="w-full h-8 px-2 border border-gray-300 rounded text-sm"
                          >
                            <option value="redirect">Redirect</option>
                            <option value="internal">Internal</option>
                            <option value="modal">Modal</option>
                          </select>
                        </div>
                      </div>
                      
                      {button.action === 'redirect' && (
                        <div>
                          <Label className="text-xs">URL</Label>
                          <Input
                            value={button.url || ''}
                            onChange={(e) => handleRuleChange(index, 'url', e.target.value)}
                            placeholder="https://example.com"
                            className="h-8"
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={button.description}
                          onChange={(e) => handleRuleChange(index, 'description', e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSaveConfig}
            disabled={saving}
            className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 hover:from-ocean-blue-600 hover:to-navy-blue-600 text-white px-8 py-3"
          >
            {saving ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </div>
  );
}
