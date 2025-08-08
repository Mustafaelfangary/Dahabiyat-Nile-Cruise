"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { 
  Calendar, 
  Users, 
  Star, 
  Crown, 
  MapPin, 
  Clock,
  Eye,
  BookOpen
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  durationDays: number;
  mainImageUrl?: string;
  isFeaturedOnHomepage?: boolean;
  homepageOrder?: number;
}

interface PackageCardProps {
  package: Package;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  const packageUrl = `/packages/${pkg.id}`;

  return (
    <Card className="h-full group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border border-blue-200/30 overflow-hidden">
      {/* Enhanced Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={pkg.mainImageUrl || '/images/package-placeholder.jpg'}
          alt={pkg.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Duration Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
          <Calendar className="w-3 h-3 inline mr-1" />
          {pkg.durationDays} Days
        </div>
        
        {/* Featured Badge */}
        {pkg.isFeaturedOnHomepage && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
            <Star className="w-3 h-3 inline mr-1" />
            Featured
          </div>
        )}
        
        {/* Hover overlay with quick actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={packageUrl}>
            <Button
              variant="contained"
              className="bg-white/90 text-blue-600 hover:bg-white font-bold shadow-xl backdrop-blur-sm"
              startIcon={<Eye className="w-4 h-4" />}
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Title */}
        <Typography 
          variant="h6" 
          className="font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2"
          style={{ minHeight: '3rem' }}
        >
          {pkg.name}
        </Typography>
        
        {/* Description */}
        <Typography 
          variant="body2" 
          className="text-gray-600 mb-4 line-clamp-3 flex-1"
          style={{ minHeight: '4.5rem' }}
        >
          {pkg.shortDescription || pkg.description}
        </Typography>
        

        
        {/* Package Info */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {pkg.durationDays} days
          </div>
          {pkg.isFeaturedOnHomepage && (
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-amber-500" />
              Featured
            </div>
          )}
        </div>
        
        {/* Price and Action */}
        <div className="flex justify-between items-center mt-auto">
          <div>
            <Typography variant="body2" className="text-gray-500 text-xs">
              Starting from
            </Typography>
            <Typography variant="h6" className="font-bold text-blue-600">
              ${pkg.price?.toLocaleString()}
            </Typography>
          </div>
          
          <Link href={packageUrl}>
            <Button 
              variant="outlined" 
              size="small"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold"
              startIcon={<BookOpen className="w-4 h-4" />}
            >
              Explore
            </Button>
          </Link>
        </div>
        
        {/* Decorative Egyptian element */}
        <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
          <Typography className="text-blue-400 text-lg opacity-60">
            𓇳 𓊪 𓈖
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
