'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Image as ImageIcon, Upload, Save, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface LogoData {
  id: string;
  key: string;
  title: string;
  content: string;
  contentType: string;
}

export default function LogoManager() {
  const [logos, setLogos] = useState<LogoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [logoUrls, setLogoUrls] = useState({
    site_logo: '',
    navbar_logo: '',
    footer_logo: '',
    site_favicon: ''
  });

  const logoTypes = [
    { key: 'site_logo', title: 'Main Site Logo', description: 'Primary logo used across the website' },
    { key: 'navbar_logo', title: 'Navigation Logo', description: 'Logo displayed in the navigation bar' },
    { key: 'footer_logo', title: 'Footer Logo', description: 'Logo displayed in the website footer' },
    { key: 'site_favicon', title: 'Favicon', description: 'Small icon displayed in browser tabs' }
  ];

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/logo', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (response.ok) {
        const logoData = await response.json();
        setLogos(logoData);
        
        // Update local state with current logo URLs
        const urls = { ...logoUrls };
        logoData.forEach((logo: LogoData) => {
          if (logo.key in urls) {
            urls[logo.key as keyof typeof urls] = logo.content || '';
          }
        });
        setLogoUrls(urls);
      }
    } catch (error) {
      console.error('Error loading logos:', error);
      toast.error('Failed to load logos');
    } finally {
      setLoading(false);
    }
  };

  const updateLogo = async (logoType: string, logoUrl: string) => {
    setSaving(logoType);
    try {
      const response = await fetch('/api/admin/logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logoType: logoType.replace('_logo', '').replace('site_', ''),
          logoUrl
        }),
      });

      if (response.ok) {
        toast.success(`${logoType.replace('_', ' ')} updated successfully!`);
        
        // Broadcast logo update to all tabs/windows
        const bc = new BroadcastChannel('content-updates');
        bc.postMessage({ 
          type: 'logo-updated', 
          logoType,
          logoUrl,
          timestamp: Date.now()
        });
        bc.close();
        
        // Trigger storage event for same-tab updates
        localStorage.setItem('logo-updated', Date.now().toString());
        localStorage.removeItem('logo-updated');
        
        await loadLogos();
      } else {
        throw new Error('Failed to update logo');
      }
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error('Failed to update logo');
    } finally {
      setSaving(null);
    }
  };

  const handleLogoUrlChange = (logoType: string, url: string) => {
    setLogoUrls(prev => ({
      ...prev,
      [logoType]: url
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading logos...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-600" />
              Logo Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your website logos and branding elements
            </p>
          </div>
          <Button onClick={loadLogos} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logoTypes.map((logoType) => {
            const currentUrl = logoUrls[logoType.key as keyof typeof logoUrls];
            const isSaving = saving === logoType.key;
            
            return (
              <Card key={logoType.key} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    {logoType.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{logoType.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Logo Preview */}
                  {currentUrl && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Current Logo
                      </Label>
                      <div className="relative inline-block">
                        <Image
                          src={currentUrl}
                          alt={logoType.title}
                          width={logoType.key === 'site_favicon' ? 32 : 120}
                          height={logoType.key === 'site_favicon' ? 32 : 40}
                          className={`${logoType.key === 'site_favicon' ? 'w-8 h-8' : 'h-10 w-auto'} object-contain border rounded`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-2 break-all font-mono bg-white p-2 rounded border">
                        {currentUrl}
                      </div>
                    </div>
                  )}

                  {/* Logo URL Input */}
                  <div className="space-y-2">
                    <Label htmlFor={`${logoType.key}_url`} className="text-sm font-medium">
                      Logo URL
                    </Label>
                    <Input
                      id={`${logoType.key}_url`}
                      type="url"
                      value={currentUrl}
                      onChange={(e) => handleLogoUrlChange(logoType.key, e.target.value)}
                      placeholder={`Enter ${logoType.title.toLowerCase()} URL...`}
                      className="w-full"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateLogo(logoType.key, currentUrl)}
                      disabled={isSaving || !currentUrl}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Logo
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Open media library or file picker
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            // Here you would typically upload the file and get a URL
                            // For now, we'll show a placeholder
                            toast.success('File upload functionality would be implemented here');
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const defaultLogo = '/images/logo.png';
                Object.keys(logoUrls).forEach(key => {
                  handleLogoUrlChange(key, defaultLogo);
                });
              }}
            >
              Reset to Default
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const mainLogo = logoUrls.site_logo;
                if (mainLogo) {
                  handleLogoUrlChange('navbar_logo', mainLogo);
                  handleLogoUrlChange('footer_logo', mainLogo);
                }
              }}
            >
              Use Main Logo Everywhere
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
