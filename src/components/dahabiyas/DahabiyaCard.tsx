"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Users, DollarSign, Star, MapPin, Calendar, Anchor, Award, Play } from 'lucide-react';
import QuickBookingWidget from '@/components/booking/QuickBookingWidget';
import { useContent } from '@/hooks/useContent';

interface Dahabiya {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  cabins?: number;
  crew?: number;
  length?: number;
  width?: number;
  yearBuilt?: number;
  mainImage?: string;
  gallery: string[];
  videoUrl?: string;
  features: string[];
  amenities: string[];
  activities: string[];
  diningOptions: string[];
  routes: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  category: 'LUXURY' | 'DELUXE' | 'PREMIUM' | 'BOUTIQUE';
}

interface DahabiyaCardProps {
  dahabiya: Dahabiya;
}

export default function DahabiyaCard({ dahabiya }: DahabiyaCardProps) {
  const [showQuickBooking, setShowQuickBooking] = useState(false);
  const { getContent } = useContent({ page: 'dahabiyas' });
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'LUXURY': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELUXE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PREMIUM': return 'bg-green-100 text-green-800 border-green-200';
      case 'BOUTIQUE': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Link href={`/dahabiyas/${dahabiya.slug}`} className="block group">
      <Card
        className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative"
        style={{
          background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
          border: '2px solid #D4AF37',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)',
        }}
      >
        {/* Pharaonic Border Pattern */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-egyptian-gold via-amber-400 to-egyptian-gold"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-egyptian-gold via-amber-400 to-egyptian-gold"></div>

        {/* Floating Hieroglyphic Elements */}
        <div className="absolute top-2 right-2 text-egyptian-gold opacity-20 text-lg z-10">𓊪</div>
        {/* Enhanced Image Section */}
        <div className="relative h-64 overflow-hidden rounded-t-lg">
          <Image
            src={dahabiya.mainImage || '/images/placeholder-dahabiya.jpg'}
            alt={dahabiya.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Pharaonic Corner Decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-egyptian-gold opacity-60"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-egyptian-gold opacity-60"></div>

          {/* Enhanced Overlay badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {dahabiya.isFeatured && (
              <div className="relative">
                <Chip
                  label={getContent('dahabiyas_card_featured_label') || 'Featured'}
                  size="small"
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-hieroglyph-brown font-bold shadow-lg"
                  icon={<Award className="w-3 h-3" />}
                  style={{
                    border: '1px solid #D4AF37',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-egyptian-gold rounded-full animate-ping"></div>
              </div>
            )}
            <Chip
              label={dahabiya.category}
              size="small"
              className={getCategoryColor(dahabiya.category)}
              style={{
                border: '1px solid #D4AF37',
                boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
              }}
            />
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            {!dahabiya.isActive && (
              <Chip
                label="Inactive"
                color="error"
                size="small"
                className="bg-red-500 text-white"
              />
            )}
            {dahabiya.videoUrl && (
              <div className="bg-gradient-to-r from-egyptian-gold to-amber-500 rounded-full p-3 shadow-lg hover:scale-110 transition-transform duration-300">
                <Play className="w-4 h-4 text-hieroglyph-brown" />
              </div>
            )}
          </div>

          {/* Enhanced Rating overlay */}
          {dahabiya.rating > 0 && (
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-hieroglyph-brown to-amber-900 text-egyptian-gold rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg border border-egyptian-gold/30">
              <div className="flex items-center">
                {renderStars(dahabiya.rating)}
              </div>
              <span className="text-sm font-bold">{dahabiya.rating.toFixed(1)}</span>
              {dahabiya.reviewCount > 0 && (
                <span className="text-xs text-amber-200">({dahabiya.reviewCount})</span>
              )}
            </div>
          )}

          {/* Enhanced Price Display */}
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-egyptian-gold to-amber-400 text-white px-4 py-2 rounded-full shadow-lg font-bold border border-amber-600">
            <Typography variant="body2" className="font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              {formatPrice(dahabiya.pricePerDay)}/day
            </Typography>
          </div>
        </div>

        <CardContent className="p-6 bg-gradient-to-b from-amber-50 to-orange-50">
          {/* Decorative Divider */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-egyptian-gold"></div>
            <Typography className="text-egyptian-gold text-lg">𓇳</Typography>
            <div className="w-8 h-0.5 bg-egyptian-gold"></div>
          </div>

          {/* Enhanced Title */}
          <Typography
            variant="h5"
            component="h3"
            className="font-bold text-hieroglyph-brown mb-3 group-hover:text-egyptian-gold transition-colors text-center"
            style={{ fontFamily: 'serif' }}
          >
            {dahabiya.name}
          </Typography>

          {/* Enhanced Description */}
          <Typography
            variant="body2"
            className="mb-4 line-clamp-2 text-amber-800 text-center leading-relaxed"
          >
            {truncateDescription(dahabiya.shortDescription || dahabiya.description, 100)}
          </Typography>

          {/* Enhanced Specifications */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-hieroglyph-brown bg-amber-100 rounded-lg p-2">
              <Users className="w-4 h-4 text-egyptian-gold" />
              <span className="font-medium">{dahabiya.capacity} guests</span>
            </div>
            {dahabiya.cabins && dahabiya.cabins > 0 && (
              <div className="flex items-center gap-2 text-hieroglyph-brown bg-amber-100 rounded-lg p-2">
                <Anchor className="w-4 h-4 text-egyptian-gold" />
                <span className="font-medium">{dahabiya.cabins} cabins</span>
              </div>
            )}
            {dahabiya.length && (
              <div className="flex items-center gap-2 text-hieroglyph-brown bg-amber-100 rounded-lg p-2">
                <MapPin className="w-4 h-4 text-egyptian-gold" />
                <span className="font-medium">{dahabiya.length}m long</span>
              </div>
            )}
            {dahabiya.yearBuilt && (
              <div className="flex items-center gap-2 text-hieroglyph-brown bg-amber-100 rounded-lg p-2">
                <Calendar className="w-4 h-4 text-egyptian-gold" />
                <span className="font-medium">Built {dahabiya.yearBuilt}</span>
              </div>
            )}
          </div>

          {/* Enhanced Features */}
          {dahabiya.features.length > 0 && (
            <Box className="mb-4">
              <Typography variant="subtitle2" className="text-hieroglyph-brown font-bold mb-2 text-center">
                {getContent('dahabiyas_card_features_title') || 'Premium Features'}
              </Typography>
              <div className="flex flex-wrap gap-1 justify-center">
                {dahabiya.features.slice(0, 3).map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    size="small"
                    variant="outlined"
                    className="text-xs bg-egyptian-gold/10 border-egyptian-gold text-hieroglyph-brown font-medium"
                  />
                ))}
                {dahabiya.features.length > 3 && (
                  <Chip
                    label={`+${dahabiya.features.length - 3} more`}
                    size="small"
                    variant="outlined"
                    className="text-xs text-amber-600 border-amber-400 bg-amber-50"
                  />
                )}
              </div>
            </Box>
          )}

          {/* Enhanced Call to Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* Quick Book Button */}
            <div
              className="bg-gradient-to-r from-egyptian-gold to-amber-400 text-hieroglyph-brown px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-amber-600 text-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickBooking(true);
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Typography variant="body2" className="font-bold">
                  {getContent('dahabiyas_card_quick_book_text') || 'Quick Book'}
                </Typography>
                <Typography className="text-lg">𓊪</Typography>
              </div>
              <Typography variant="caption" className="block mt-1 opacity-90 text-hieroglyph-brown font-bold">
                From {formatPrice(dahabiya.pricePerDay)}/day
              </Typography>
            </div>

            {/* Pharaonic View Details Button */}
            <div
              className="bg-gradient-to-r from-egyptian-gold/20 to-amber-400/20 text-hieroglyph-brown px-4 py-1.5 rounded-lg font-medium shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-egyptian-gold/40 hover:border-egyptian-gold/60 text-center cursor-pointer backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to the dahabiya detail page which has the unified booking form
                router.push(`/dahabiyas/${dahabiya.slug || dahabiya.id}`);
              }}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Typography variant="caption" className="font-bold text-xs">
                  {getContent('dahabiyas_card_full_booking_text') || 'View Details'}
                </Typography>
                <Typography className="text-xs text-egyptian-gold">𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿</Typography>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Element */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <div className="w-6 h-0.5 bg-egyptian-gold"></div>
            <Typography className="text-egyptian-gold text-sm">𓇳</Typography>
            <div className="w-6 h-0.5 bg-egyptian-gold"></div>
          </div>
        </CardContent>

        {/* Quick Booking Widget */}
        <QuickBookingWidget
          dahabiya={dahabiya}
          open={showQuickBooking}
          onClose={() => setShowQuickBooking(false)}
        />
      </Card>
    </Link>
  );
}
