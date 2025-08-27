"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { Star, User, MapPin, Calendar } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name?: string;
    image?: string;
  };
  dahabiya: {
    name: string;
    hieroglyph?: string;
  };
  tripDate?: string;
  location?: string;
}

interface ReviewCardProps {
  review: Review;
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < rating ? 'text-egyptian-gold fill-current' : 'text-gray-300'
      }`}
    />
  ));
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card
      className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
        border: '2px solid #0080ff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 128, 255, 0.2)',
      }}
    >
      {/* Ocean Blue Border Pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean-blue via-blue-400 to-ocean-blue"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean-blue via-blue-400 to-ocean-blue"></div>

      {/* Floating Hieroglyphic Elements */}
      <div className="absolute top-2 right-2 text-egyptian-gold opacity-20 text-lg z-10">
        {review.dahabiya.hieroglyph || '𓇳'}
      </div>

      <CardContent className="p-6 bg-gradient-to-b from-blue-50 to-sky-50">
        {/* Decorative Divider */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="w-8 h-0.5 bg-ocean-blue"></div>
          <Typography className="text-ocean-blue text-lg">𓇳</Typography>
          <div className="w-8 h-0.5 bg-ocean-blue"></div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          {review.user.image ? (
            <Image
              src={review.user.image}
              alt={review.user.name || 'User'}
              width={50}
              height={50}
              className="rounded-full border-2 border-ocean-blue"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-ocean-blue to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="flex-1">
            <Typography
              variant="h6"
              className="font-bold text-black mb-1"
              style={{ fontFamily: 'serif' }}
            >
              {review.user.name || 'Anonymous Traveler'}
            </Typography>
            <div className="flex items-center gap-1 mb-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
            </div>
          </div>
        </div>

        {/* Dahabiya Name */}
        <div className="text-center mb-4">
          <Typography
            variant="h6"
            className="font-bold text-ocean-blue"
            style={{ fontFamily: 'serif' }}
          >
            {review.dahabiya.name}
          </Typography>
        </div>

        {/* Review Content */}
        <Typography 
          variant="body2" 
          className="text-gray-700 mb-4 text-center italic"
          style={{ minHeight: '4.5rem' }}
        >
          "{review.comment}"
        </Typography>

        {/* Review Details */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <div className="flex items-center gap-2 text-white bg-blue-500 rounded-lg p-2">
            <Calendar className="w-4 h-4 text-white" />
            <span className="font-medium text-xs">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          {review.tripDate && (
            <div className="flex items-center gap-2 text-hieroglyph-brown bg-amber-100 rounded-lg p-2">
              <Calendar className="w-4 h-4 text-egyptian-gold" />
              <span className="font-medium text-xs">Trip: {new Date(review.tripDate).toLocaleDateString()}</span>
            </div>
          )}
          {review.location && (
            <div className="flex items-center gap-2 text-white bg-blue-500 rounded-lg p-2">
              <MapPin className="w-4 h-4 text-white" />
              <span className="font-medium text-xs">{review.location}</span>
            </div>
          )}
        </div>

        {/* Rating Badge */}
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-ocean-blue to-blue-600 text-white px-6 py-3 rounded-full inline-block shadow-lg">
            <span 
              className="text-lg font-bold"
              style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                color: 'white',
                WebkitTextFillColor: 'white'
              }}
            >
              {review.rating}/5 Stars
            </span>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <div className="w-6 h-0.5 bg-ocean-blue"></div>
          <Typography className="text-ocean-blue text-sm">𓇳</Typography>
          <div className="w-6 h-0.5 bg-ocean-blue"></div>
        </div>
      </CardContent>
    </Card>
  );
}
