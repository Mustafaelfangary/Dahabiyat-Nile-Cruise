"use client";

import { useEffect, useState } from 'react';
import { pwaManager, offlineStorage } from '@/lib/pwa';
import { Download, Wifi, WifiOff, Share, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface PWAEnhancedProps {
  children: React.ReactNode;
}

export default function PWAEnhanced({ children }: PWAEnhancedProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !pwaManager) return;

    // Initialize PWA features
    const initPWA = async () => {
      setCanInstall(pwaManager.canInstall());
      setIsInstalled(pwaManager.isAppInstalled());
      setIsStandalone(pwaManager.isRunningStandalone());
      
      // Initialize offline storage
      try {
        await offlineStorage.init();
        console.log('Offline storage initialized');
      } catch (error) {
        console.error('Failed to initialize offline storage:', error);
      }
    };

    initPWA();

    // Network status monitoring
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online && !showOfflineBanner) {
        setShowOfflineBanner(true);
        toast.error('You are offline. Some features may be limited.');
      } else if (online && showOfflineBanner) {
        setShowOfflineBanner(false);
        toast.success('You are back online!');
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Listen for PWA events
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      toast.success('App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showOfflineBanner]);

  const handleInstallApp = async () => {
    if (!pwaManager) return;
    
    const installed = await pwaManager.installApp();
    if (installed) {
      setCanInstall(false);
      setIsInstalled(true);
    }
  };

  const handleShare = async () => {
    if (!pwaManager) return;

    const shareData = {
      title: 'Cleopatra Dahabiyat - Luxury Nile Cruises',
      text: 'Experience the magic of ancient Egypt aboard our luxury dahabiyas',
      url: window.location.href
    };

    const shared = await pwaManager.share(shareData);
    if (shared) {
      toast.success('Shared successfully!');
    } else {
      toast.error('Sharing failed');
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
        
        // Show a welcome notification
        new Notification('Welcome to Cleopatra Dahabiyat!', {
          body: 'You\'ll now receive updates about your bookings and special offers.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png'
        });
      } else {
        toast.error('Notifications permission denied');
      }
    }
  };

  return (
    <div className="pwa-enhanced-container">
      {/* Offline Banner */}
      {showOfflineBanner && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center text-sm z-50 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>You are offline. Some features may be limited.</span>
        </div>
      )}

      {/* PWA Features Bar (only show if not installed and not standalone) */}
      {!isInstalled && !isStandalone && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 z-40">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📱</div>
              <div>
                <div className="font-semibold text-sm">Get the App</div>
                <div className="text-xs opacity-90">Install for better experience</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {canInstall && (
                <Button
                  onClick={handleInstallApp}
                  size="sm"
                  variant="secondary"
                  className="bg-white text-amber-700 hover:bg-gray-100"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Install
                </Button>
              )}
              
              <Button
                onClick={handleShare}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-amber-800"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Network Status Indicator */}
      <div className="fixed top-4 right-4 z-30">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
          isOnline 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </>
          )}
        </div>
      </div>

      {/* PWA Features Panel (for installed app) */}
      {isStandalone && (
        <div className="fixed top-4 left-4 z-30">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-amber-800">
                <div className="text-lg">🏺</div>
                <div>
                  <div className="font-semibold text-xs">App Mode</div>
                  <div className="text-xs opacity-75">Enhanced experience</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Permission Request (for installed app) */}
      {isStandalone && 'Notification' in window && Notification.permission === 'default' && (
        <div className="fixed bottom-4 left-4 right-4 z-30">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-sm text-blue-800">Enable Notifications</div>
                    <div className="text-xs text-blue-600">Get updates about your bookings</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={requestNotificationPermission}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Enable
                  </Button>
                  <Button
                    onClick={() => {
                      const card = document.querySelector('.fixed.bottom-4.left-4.right-4.z-30');
                      if (card) card.remove();
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-blue-600"
                  >
                    Later
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className={`${showOfflineBanner ? 'pt-10' : ''} ${!isInstalled && !isStandalone ? 'pb-20' : ''}`}>
        {children}
      </div>

      {/* PWA Styles */}
      <style jsx>{`
        .pwa-enhanced-container {
          min-height: 100vh;
          position: relative;
        }
        
        /* Hide scrollbars in standalone mode for app-like experience */
        ${isStandalone ? `
          ::-webkit-scrollbar {
            display: none;
          }
          
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        ` : ''}
        
        /* Prevent pull-to-refresh in standalone mode */
        ${isStandalone ? `
          body {
            overscroll-behavior-y: contain;
          }
        ` : ''}
        
        /* Safe area insets for devices with notches */
        @supports (padding: max(0px)) {
          .pwa-enhanced-container {
            padding-left: max(0px, env(safe-area-inset-left));
            padding-right: max(0px, env(safe-area-inset-right));
          }
          
          .fixed.top-0 {
            padding-top: max(0px, env(safe-area-inset-top));
          }
          
          .fixed.bottom-0 {
            padding-bottom: max(0px, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
}
