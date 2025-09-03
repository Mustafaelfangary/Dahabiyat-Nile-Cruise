"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Users, DollarSign, Star, MapPin, Calendar, Anchor, Award, Play, Ship } from 'lucide-react';
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
      case 'LUXURY': return 'bg-ocean-blue text-white border-ocean-blue';
      case 'DELUXE': return 'bg-blue-600 text-white border-blue-600';
      case 'PREMIUM': return 'bg-blue-700 text-white border-blue-700';
      case 'BOUTIQUE': return 'bg-sky-600 text-white border-sky-600';
      default: return 'bg-gray-600 text-white border-gray-600';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-ocean-blue fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="block group">
      <div
        className="dahabiya-card h-full overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative w-full bg-white rounded-2xl shadow-lg border border-gray-200"
        style={{
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }}
      >
        {/* Image Section */}
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden rounded-t-2xl">
          <Image
            src={dahabiya.mainImage || '/images/placeholder-dahabiya.jpg'}
            alt={dahabiya.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>





        </div>

        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
            {dahabiya.name}
          </h3>
        </div>

        {/* Quick Booking Widget */}
        <QuickBookingWidget
          dahabiya={dahabiya}
          open={showQuickBooking}
          onClose={() => setShowQuickBooking(false)}
        />
      </div>
    </div>
  );
}
