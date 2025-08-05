"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Users, Calendar, MapPin, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WishlistItem {
  id: string;
  addedAt: string;
  package?: {
    id: string;
    name: string;
    shortDescription?: string;
    mainImageUrl?: string;
    price: number;
    duration: number;
    maxGuests: number;
    rating?: number;
    reviewCount?: number;
  };
  dahabiya?: {
    id: string;
    name: string;
    description?: string;
    mainImageUrl?: string;
    pricePerNight: number;
    maxGuests: number;
    rating?: number;
    reviewCount?: number;
  };
}

interface WishlistGridProps {
  userId?: string;
  limit?: number;
}

const WishlistGrid: React.FC<WishlistGridProps> = ({ userId, limit }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the wishlist API endpoint
      const url = `/api/wishlist${limit ? `?limit=${limit}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) {
        // If unauthorized, show empty state instead of error
        if (response.status === 401) {
          setWishlistItems([]);
          return;
        }
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
      }

      const data = await response.json();
      setWishlistItems(data.items || []);
    } catch (err) {
      console.error('Wishlist fetch error:', err);
      // Set empty array instead of error for better UX
      setWishlistItems([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      setWishlistItems(prev => prev.filter(w => w.id !== itemId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-[4/3] bg-gray-200"></div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Remove error display - just show empty state for better UX

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-white" />
        </div>
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
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistItems.map((item) => {
        const isPackage = !!item.package;
        const content = item.package || item.dahabiya;
        const price = isPackage ? item.package!.price : item.dahabiya!.pricePerNight;
        const linkHref = isPackage ? `/packages/${content!.id}` : `/dahabiyat/${content!.id}`;

        return (
          <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={content!.mainImageUrl || '/images/placeholder-wishlist.jpg'}
                alt={content!.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>

              {/* Type badge */}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-white/90">
                  {isPackage ? 'Package' : 'Dahabiya'}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                    {content!.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {isPackage ? item.package!.shortDescription : item.dahabiya!.description}
                  </p>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{content!.maxGuests} guests</span>
                  </div>
                  {isPackage && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{item.package!.duration} days</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                {content!.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{content!.rating}</span>
                    </div>
                    {content!.reviewCount && (
                      <span className="text-sm text-gray-500">
                        ({content!.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <span className="text-2xl font-bold text-egyptian-gold">
                      ${price.toLocaleString()}
                    </span>
                    {!isPackage && (
                      <span className="text-sm text-gray-500">/night</span>
                    )}
                  </div>
                  <Link href={linkHref}>
                    <Button size="sm" className="bg-gradient-to-r from-egyptian-gold/80 to-amber-500/80 text-hieroglyph-brown text-xs font-bold border border-egyptian-gold/30 hover:from-egyptian-gold hover:to-amber-500">
                      <span className="text-xs">View Details</span>
                      <span className="text-xs text-egyptian-gold ml-1">𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WishlistGrid;
export { WishlistGrid };
