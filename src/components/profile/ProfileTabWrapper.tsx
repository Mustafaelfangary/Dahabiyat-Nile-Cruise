"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Package, Calendar, Heart, Star } from 'lucide-react';
import Link from 'next/link';

interface ProfileTabWrapperProps {
  children: React.ReactNode;
  tabType: 'bookings' | 'wishlist' | 'reviews' | 'notifications';
  fallbackTitle: string;
  fallbackDescription: string;
}

const ProfileTabWrapper: React.FC<ProfileTabWrapperProps> = ({
  children,
  tabType,
  fallbackTitle,
  fallbackDescription
}) => {
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Reset error state when tab changes
    setHasError(false);
  }, [tabType]);

  const handleRetry = () => {
    setIsRetrying(true);
    setHasError(false);
    // Force a page refresh to retry API calls
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const getFallbackContent = () => {
    switch (tabType) {
      case 'bookings':
        return (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Journeys Yet</h3>
            <p className="text-gray-600 mb-6">Start your Egyptian adventure by booking your first Dahabiya cruise</p>
            <Link href="/packages">
              <Button className="bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 hover:from-ocean-blue-500 hover:to-navy-blue-500 text-white">
                <Package className="w-4 h-4 mr-2" />
                Browse Packages
              </Button>
            </Link>
          </div>
        );
      
      case 'wishlist':
        return (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-pink-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Wishlist is Empty</h3>
            <p className="text-gray-600 mb-6">Save your favorite Dahabiyas and packages for later</p>
            <Link href="/dahabiyas">
              <Button className="bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white">
                <Heart className="w-4 h-4 mr-2" />
                Explore Dahabiyas
              </Button>
            </Link>
          </div>
        );
      
      case 'reviews':
        return (
          <div className="text-center py-12">
            <Star className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-6">Share your experiences after completing a journey</p>
            <Link href="/packages">
              <Button className="bg-gradient-to-r from-ocean-blue-400 to-deep-blue-400 hover:from-ocean-blue-500 hover:to-deep-blue-500 text-white">
                <Star className="w-4 h-4 mr-2" />
                Book a Journey
              </Button>
            </Link>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">𓇳</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No new notifications at the moment</p>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">𓊪</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{fallbackTitle}</h3>
            <p className="text-gray-600">{fallbackDescription}</p>
          </div>
        );
    }
  };

  const getErrorContent = () => (
    <div className="text-center py-12">
      <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Content</h3>
      <p className="text-gray-600 mb-6">We're having trouble loading this section. Please try again.</p>
      <Button 
        onClick={handleRetry}
        disabled={isRetrying}
        className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white"
      >
        {isRetrying ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Retrying...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </>
        )}
      </Button>
    </div>
  );

  // Error boundary-like behavior
  const handleChildError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-red-200 shadow-xl">
        <CardContent className="p-6">
          {getErrorContent()}
        </CardContent>
      </Card>
    );
  }

  return (
    <div onError={handleChildError}>
      {children}
    </div>
  );
};

export default ProfileTabWrapper;
