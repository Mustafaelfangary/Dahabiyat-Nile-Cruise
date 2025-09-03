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
  Gift,
  Smartphone,
  Ship,
  LucideIcon
} from 'lucide-react';

type IconType = LucideIcon;

// Icon mapping for string-based icons from API
const iconMap: Record<string, IconType> = {
  Package,
  Facebook,
  Instagram,
  Youtube,
  Camera,
  Crown,
  Gift,
  Smartphone,
  Ship
};

interface RewardButtonConfig {
  id: string;
  label: string;
  icon: IconType;
  points: number;
  enabled: boolean;
  url?: string;
  action: 'redirect' | 'internal' | 'modal';
  description: string;
  color: string;
}

interface ApiButtonConfig {
  id: string;
  label: string;
  icon: string | IconType;
  points: number;
  enabled: boolean;
  url?: string;
  action: 'redirect' | 'internal' | 'modal';
  description: string;
  color: string;
}

interface RewardButtonsProps {
  onPointsEarned?: (points: number, action: string) => void;
}

export default function RewardButtons({ onPointsEarned }: RewardButtonsProps) {
  const [buttons, setButtons] = useState<RewardButtonConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Enhanced pharaonic button configuration
  const defaultButtons: RewardButtonConfig[] = [
    {
      id: 'book-package',
      label: 'Book a Royal Journey',
      icon: Package,
      points: 500,
      enabled: true,
      url: '/packages',
      action: 'redirect',
      description: 'Browse and book our luxury pharaonic packages',
      color: 'bg-gradient-to-r from-ocean-blue to-blue-600'
    },
    {
      id: 'book-dahabiya',
      label: 'Book a Dahabiya',
      icon: Ship,
      points: 750,
      enabled: true,
      url: '/dahabiyat',
      action: 'redirect',
      description: 'Explore and book our luxury dahabiyas',
      color: 'bg-gradient-to-r from-teal-500 to-cyan-600'
    },
    {
      id: 'like-facebook',
      label: 'Join Our Kingdom',
      icon: Facebook,
      points: 50,
      enabled: true,
      url: 'https://facebook.com/cleopatradahabiya',
      action: 'redirect',
      description: 'Follow us on Facebook for royal updates',
      color: 'bg-gradient-to-r from-blue-600 to-blue-700'
    },
    {
      id: 'review-tripadvisor',
      label: 'Write a Review on TripAdvisor',
      icon: Crown,
      points: 50,
      enabled: true,
      url: 'https://tripadvisor.com/cleopatradahabiya',
      action: 'redirect',
      description: 'Share your experience on TripAdvisor',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600'
    },
    {
      id: 'book-day-tour',
      label: 'Book a One Day Tour',
      icon: Gift,
      points: 75,
      enabled: true,
      url: '/day-tours',
      action: 'redirect',
      description: 'Discover our exciting day tour packages',
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600'
    },
    {
      id: 'share-memories',
      label: 'Share Eternal Memories',
      icon: Camera,
      points: 100,
      enabled: true,
      action: 'internal',
      description: 'Share your eternal travel memories with us',
      color: 'bg-gradient-to-r from-ocean-blue to-blue-600'
    },
    {
      id: 'download-app',
      label: 'Download Our App',
      icon: Smartphone,
      points: 150,
      enabled: true,
      url: 'https://play.google.com/store/apps/details?id=com.cleopatradahabiya.app',
      action: 'redirect',
      description: 'Download our mobile app from Google Play',
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600'
    }
  ];

  useEffect(() => {
    fetchButtonConfig();
  }, []);

  const fetchButtonConfig = async () => {
    try {
      setError(null);
      const response = await fetch('/api/rewards/buttons', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Ensure fresh data
      });

      if (response.ok) {
        const config = await response.json();
        if (config.buttons && Array.isArray(config.buttons)) {
          // Map string icons to actual icon components
          const mappedButtons = config.buttons.map((button: ApiButtonConfig): RewardButtonConfig => ({
            ...button,
            icon: typeof button.icon === 'string' ? iconMap[button.icon] || Package : button.icon as IconType
          }));
          setButtons(mappedButtons);
        } else {
          console.warn('Invalid button configuration received, using defaults');
          setButtons(defaultButtons);
        }
      } else {
        console.warn(`API response not ok: ${response.status} ${response.statusText}`);
        setButtons(defaultButtons);
      }
    } catch (error) {
      console.error('Error fetching reward button config:', error);
      setError('Failed to load reward actions. Using default configuration.');
      setButtons(defaultButtons);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = async (button: RewardButtonConfig) => {
    if (processingAction === button.id) return;

    console.log('Reward button clicked:', button.id, button.label);
    setProcessingAction(button.id);

    try {
      // Check eligibility first
      const eligibilityResponse = await fetch(`/api/rewards/action?action=${button.id}`);
      if (eligibilityResponse.ok) {
        const eligibility = await eligibilityResponse.json();
        if (!eligibility.eligible) {
          toast.error(eligibility.reason || 'Action not available right now');
          setProcessingAction(null);
          return;
        }
      }

      // Track the action and award points
      const response = await fetch('/api/rewards/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: button.id,
          points: button.points,
          metadata: {
            buttonLabel: button.label,
            timestamp: new Date().toISOString()
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Handle different action types
        switch (button.action) {
          case 'redirect':
            if (button.url) {
              // Add small delay for mobile to show feedback
              setTimeout(() => {
                // Open external links in new tab, internal links in same tab
                if (button.url.startsWith('http')) {
                  window.open(button.url, '_blank', 'noopener,noreferrer');
                } else {
                  window.location.href = button.url;
                }
              }, 100);
            }
            break;
          case 'internal':
            if (button.id === 'share-memories') {
              // Trigger memory sharing modal or navigate to memories tab
              setTimeout(() => {
                const event = new CustomEvent('openMemorySharing');
                window.dispatchEvent(event);
              }, 100);
            }
            break;
        }

        // Show success message and update points
        toast.success(`+${button.points} points earned! ${result.message || ''}`);
        onPointsEarned?.(button.points, button.id);

      } else {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        console.error('Reward action error:', error);

        if (response.status === 401) {
          toast.error('Please sign in to earn reward points');
        } else if (response.status === 400 && error.error?.includes('already earned')) {
          toast.warning('You have already earned points for this action today');
        } else {
          toast.error(error.error || error.message || 'Failed to process action');
        }
      }
    } catch (error) {
      console.error('Error processing reward action:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!buttons || buttons.length === 0) {
    return (
      <div className="text-center py-8">
        <Crown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-800">No reward actions available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-amber-600" />
        <h4 className="font-semibold text-gray-800">Earn More Points</h4>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {buttons
          .filter(button => button.enabled)
          .map((button) => {
            const IconComponent = button.icon || Package; // Fallback to Package icon
            const isProcessing = processingAction === button.id;

            return (
              <Card key={button.id} className="overflow-hidden border border-egyptian-gold/30 hover:border-egyptian-gold/50 transition-all duration-300 shadow-lg hover:shadow-xl relative">
                {/* Pharaonic corner decorations */}
                <div className="absolute top-1 left-1 text-xs text-egyptian-gold/40">𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿</div>

                <CardContent className="p-0">
                  <Button
                    onClick={() => handleButtonClick(button)}
                    disabled={isProcessing}
                    className={`w-full min-h-[4rem] sm:h-16 ${button.color} hover:opacity-90 text-white border-0 rounded-lg flex items-center justify-between p-3 sm:p-4 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden touch-manipulation active:scale-95`}
                    variant="ghost"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    {/* Shimmer effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 relative z-10">
                      <div className="p-1.5 sm:p-2 bg-white/25 rounded-lg flex-shrink-0 border border-white/20">
                        {IconComponent ? (
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-bold text-xs sm:text-sm truncate drop-shadow-sm">{button.label}</div>
                        <div className="text-xs text-white/90 truncate font-medium">{button.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 relative z-10">
                      <div className="flex items-center gap-1 bg-white/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-white/20 backdrop-blur-sm">
                        <Crown className="w-3 h-3 text-egyptian-gold" />
                        <span className="text-xs font-bold">+{button.points}</span>
                        <span className="text-xs text-egyptian-gold">𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿</span>
                      </div>
                      {button.action === 'redirect' && (
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                      )}
                      {isProcessing && (
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
          Complete actions to earn reward points and unlock exclusive benefits
        </p>
      </div>
    </div>
  );
}
