"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Package, 
  Facebook, 
  Instagram, 
  Youtube, 
  Camera, 
  ExternalLink,
  Crown,
  Gift
} from 'lucide-react';

interface LoyaltyButtonConfig {
  id: string;
  label: string;
  icon: any;
  points: number;
  enabled: boolean;
  url?: string;
  action: 'redirect' | 'internal' | 'modal';
  description: string;
  color: string;
}

interface LoyaltyButtonsProps {
  onPointsEarned?: (points: number, action: string) => void;
}

export default function LoyaltyButtons({ onPointsEarned }: LoyaltyButtonsProps) {
  const [buttons, setButtons] = useState<LoyaltyButtonConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  // Default button configuration
  const defaultButtons: LoyaltyButtonConfig[] = [
    {
      id: 'book-package',
      label: 'Book a Package',
      icon: Package,
      points: 500,
      enabled: true,
      url: '/packages',
      action: 'redirect',
      description: 'Browse and book our luxury packages',
      color: 'bg-gradient-to-r from-amber-500 to-orange-500'
    },
    {
      id: 'like-facebook',
      label: 'Like Us',
      icon: Facebook,
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
      icon: Instagram,
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
      icon: Youtube,
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
      icon: Camera,
      points: 100,
      enabled: true,
      action: 'internal',
      description: 'Share your travel memories with us',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600'
    }
  ];

  useEffect(() => {
    fetchButtonConfig();
  }, []);

  const fetchButtonConfig = async () => {
    try {
      const response = await fetch('/api/loyalty/buttons');
      if (response.ok) {
        const config = await response.json();
        setButtons(config.buttons || defaultButtons);
      } else {
        // Use default configuration if API fails
        setButtons(defaultButtons);
      }
    } catch (error) {
      console.error('Error fetching loyalty button config:', error);
      setButtons(defaultButtons);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = async (button: LoyaltyButtonConfig) => {
    if (processingAction === button.id) return;
    
    setProcessingAction(button.id);

    try {
      // Track the action and award points
      const response = await fetch('/api/loyalty/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: button.id,
          points: button.points,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Handle different action types
        switch (button.action) {
          case 'redirect':
            if (button.url) {
              // Open external links in new tab, internal links in same tab
              if (button.url.startsWith('http')) {
                window.open(button.url, '_blank', 'noopener,noreferrer');
              } else {
                window.location.href = button.url;
              }
            }
            break;
          case 'internal':
            if (button.id === 'share-memories') {
              // Trigger memory sharing modal or navigate to memories tab
              const event = new CustomEvent('openMemorySharing');
              window.dispatchEvent(event);
            }
            break;
        }

        // Show success message and update points
        toast.success(`+${button.points} points earned! ${result.message || ''}`);
        onPointsEarned?.(button.points, button.id);
        
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to process action');
      }
    } catch (error) {
      console.error('Error processing loyalty action:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-amber-600" />
        <h4 className="font-semibold text-gray-800">Earn More Points</h4>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {buttons
          .filter(button => button.enabled)
          .map((button) => {
            const IconComponent = button.icon;
            const isProcessing = processingAction === button.id;
            
            return (
              <Card key={button.id} className="overflow-hidden border border-amber-200 hover:border-amber-300 transition-colors">
                <CardContent className="p-0">
                  <Button
                    onClick={() => handleButtonClick(button)}
                    disabled={isProcessing}
                    className={`w-full h-16 ${button.color} hover:opacity-90 text-white border-0 rounded-lg flex items-center justify-between p-4 transition-all duration-200 hover:scale-[1.02]`}
                    variant="ghost"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm">{button.label}</div>
                        <div className="text-xs text-white/80">{button.description}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                        <Gift className="w-3 h-3" />
                        <span className="text-xs font-medium">+{button.points}</span>
                      </div>
                      {button.action === 'redirect' && (
                        <ExternalLink className="w-4 h-4 text-white/60" />
                      )}
                    </div>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          Complete actions to earn loyalty points and unlock exclusive benefits
        </p>
      </div>
    </div>
  );
}
