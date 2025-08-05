'use client';

import React from 'react';
import Image from 'next/image';
import { Container, Button } from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Star, Users, Calendar, Clock, Anchor, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  PharaonicCrown,
  PharaonicPatternBackground,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';
import BookingForm from '@/components/BookingForm';
import PackageBookingForm from '@/components/PackageBookingForm';
import UnifiedBookingForm from '@/components/UnifiedBookingForm';

interface PharaonicPageTemplateProps {
  // Basic Info
  name: string;
  shortDescription: string;
  description: string;
  mainImageUrl: string;
  videoUrl?: string;
  type: string;
  category: string;
  
  // Stats
  capacity?: number;
  maxGuests?: number;
  pricePerDay?: number;
  price?: number;
  durationDays?: number;
  rating: number;
  
  // Content
  features: string[];
  advantages: string;
  meaning: string;
  
  // Styling
  primaryColor?: string;
  secondaryColor?: string;
  pageType: 'dahabiya' | 'package';
  
  // Custom sections
  children?: ReactNode;
  
  // Loading state
  loading?: boolean;
}

const HIEROGLYPHIC_TEXTS = {
  dahabiya: {
    title: '',
    subtitle: '𓇯 Golden Vessel of the Eternal Nile 𓇯',
    loading: '𓈖 Loading Dahabiya... 𓊪',
    loadingSubtitle: '𓇯 vessel of the Nile awakening 𓇯'
  },
  package: {
    title: '',
    subtitle: '𓇯 Journey Through Ancient Egypt 𓇯',
    loading: '𓈖 Loading Package... 𓊪',
    loadingSubtitle: '𓇯 Ancient journey awakening 𓇯'
  }
};

const STAT_HIEROGLYPHS = {
  capacity: '𓂀 Max Guests 𓂀',
  maxGuests: '𓂀 Max Guests 𓂀',
  rating: '𓇳 Rating 𓇳',
  pricePerDay: '𓊪 Per Day 𓊪',
  price: '𓊪 Price 𓊪',
  durationDays: '𓇯 Days 𓇯'
};

export function PharaonicPageTemplate({
  name,
  shortDescription,
  description,
  mainImageUrl,
  videoUrl,
  type,
  category,
  capacity,
  maxGuests,
  pricePerDay,
  price,
  durationDays,
  rating,
  features,
  advantages,
  meaning,
  primaryColor = 'ocean-blue',
  secondaryColor = 'ocean-blue',
  pageType,
  children,
  loading = false
}: PharaonicPageTemplateProps) {
  
  const hieroglyphs = HIEROGLYPHIC_TEXTS[pageType];
  const displayCapacity = capacity || maxGuests;
  const displayPrice = pricePerDay || price;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <EgyptHieroglyphic className="mx-auto mb-6" size="4rem" />
          <p className="text-gray-800 font-bold text-xl">Loading...</p>
          <div className="text-gray-600 text-lg mt-2">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-ocean-blue/15 via-transparent to-ocean-blue/25"></div>



      {/* Hero Section with Video/Image */}
      <section className="relative py-32 bg-slate-50 overflow-hidden">
        <PharaonicPatternBackground className="opacity-25" />
        
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          {videoUrl ? (
            <video
              autoPlay
              muted
              loop
              className="w-full h-full object-cover opacity-30"
              {...(mainImageUrl && mainImageUrl.trim() !== '' && { poster: mainImageUrl })}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : mainImageUrl && mainImageUrl.trim() !== '' ? (
            <Image
              src={mainImageUrl}
              alt={name}
              fill
              className="object-cover opacity-30"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 opacity-30 flex items-center justify-center">
              <div className="text-slate-400 text-6xl">🖼️</div>
            </div>
          )}
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            {/* Hieroglyphic Egypt at top */}
            <div className="text-center mb-8">
              <div className="text-4xl font-bold mb-2">
                <span className="text-blue-600">𓎢</span><span className="text-emerald-600">𓃭</span><span className="text-blue-600">𓅂</span><span className="text-emerald-600">𓅱</span><span className="text-blue-600">𓊪</span><span className="text-emerald-600">𓄿</span><span className="text-blue-600">𓏏</span><span className="text-emerald-600">𓂋</span><span className="text-blue-600">𓄿</span>
              </div>
            </div>

            <div className="text-center text-text-primary mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-heading font-bold mb-6 bg-gradient-to-r from-blue-600 via-gray-800 to-emerald-600 bg-clip-text text-transparent">
                {name}
              </h1>

              <p className="text-gray-600 text-xl mb-6 max-w-2xl mx-auto">
                {description}
              </p>

              {/* Type and Category Badges */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span className="px-6 py-3 bg-ocean-blue/90 text-ocean-blue rounded-full font-bold text-lg shadow-lg">
                  {type}
                </span>
                <span className="px-6 py-3 bg-ocean-blue/90 text-ocean-blue rounded-full font-bold text-lg shadow-lg">
                  {category}
                </span>
              </div>

              <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-light mb-6 md:mb-8 bg-gradient-to-r from-ocean-blue via-white to-ocean-blue bg-clip-text text-transparent max-w-4xl mx-auto animate-fade-in hover:animate-pulse hover:scale-105 transition-all duration-700 mobile-hero-subtitle mobile-text-wrap px-4">
                <span className="hover:bg-gradient-to-r hover:from-ocean-blue hover:via-coral-bright hover:to-white hover:bg-clip-text hover:text-transparent transition-all duration-500">
                  {shortDescription}
                </span>
              </p>

              {/* Key Stats */}
              <div className="grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {displayCapacity && (
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-ocean-blue/30">
                    <Users className="w-8 h-8 text-ocean-blue mx-auto mb-2" />
                    <div className="text-2xl font-bold text-text-primary">{displayCapacity}</div>
                    <div className="text-ocean-blue/90 text-sm">{STAT_HIEROGLYPHS.capacity}</div>
                  </div>
                )}
                
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-ocean-blue/30">
                  <Star className="w-8 h-8 text-ocean-blue fill-current mx-auto mb-2" />
                  <div className="text-2xl font-bold text-text-primary">{rating}</div>
                  <div className="text-ocean-blue/90 text-sm">{STAT_HIEROGLYPHS.rating}</div>
                </div>
                
                {displayPrice && (
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-ocean-blue/30">
                    <Calendar className="w-8 h-8 text-ocean-blue mx-auto mb-2" />
                    <div className="text-2xl font-bold text-text-primary">${displayPrice}</div>
                    <div className="text-ocean-blue/90 text-sm">{pricePerDay ? STAT_HIEROGLYPHS.pricePerDay : STAT_HIEROGLYPHS.price}</div>
                  </div>
                )}
                
                {durationDays && (
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-ocean-blue/30">
                    <Clock className="w-8 h-8 text-ocean-blue mx-auto mb-2" />
                    <div className="text-2xl font-bold text-text-primary">{durationDays}</div>
                    <div className="text-ocean-blue/90 text-sm">{STAT_HIEROGLYPHS.durationDays}</div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Description Section */}
      <section className="py-20">
        <Container maxWidth="lg">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-heading font-bold bg-gradient-to-r from-blue-600 via-gray-800 to-emerald-600 bg-clip-text text-transparent mb-6">
                <span className="hover:bg-gradient-to-r hover:from-ocean-blue hover:via-white hover:to-ocean-blue hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  About This {pageType === 'dahabiya' ? 'Vessel' : 'Journey'}
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-gray-800 to-emerald-600 mx-auto rounded-full mb-8"></div>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                <span>{description}</span>
              </p>
            </div>
          </AnimatedSection>

          {/* Custom Content */}
          {children}

          {/* Booking Section */}
          <AnimatedSection animation="slide-up">
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 via-gray-800 to-emerald-600 bg-clip-text text-transparent mb-6">
                  Reserve Your {pageType === 'dahabiya' ? 'Vessel' : 'Journey'}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-gray-800 to-emerald-600 mx-auto rounded-full mb-6"></div>
              </div>

              {pageType === 'package' && price && durationDays ? (
                <div className="max-w-4xl mx-auto">
                  <UnifiedBookingForm
                    type="package"
                    itemId={name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                    itemName={name}
                    basePrice={price}
                    maxGuests={maxGuests || 20}
                    durationDays={durationDays}
                    style="pharaonic"
                    showAvailabilityCheck={true}
                  />
                </div>
              ) : pageType === 'dahabiya' && price ? (
                <div className="max-w-4xl mx-auto">
                  <UnifiedBookingForm
                    type="dahabiya"
                    itemId={name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                    itemName={name}
                    basePrice={price}
                    maxGuests={maxGuests || 20}
                    durationDays={durationDays || 7}
                    style="pharaonic"
                    showAvailabilityCheck={true}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <Link href="/booking">
                    <Button
                      className="btn-egyptian"
                      size="large"
                      sx={{
                        background: 'linear-gradient(135deg, hsl(43, 85%, 58%) 0%, hsl(43, 85%, 48%) 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, hsl(43, 85%, 48%) 0%, hsl(43, 85%, 58%) 100%)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Book This {pageType === 'dahabiya' ? 'Dahabiya' : 'Package'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection animation="fade-in">
            <div className="text-center bg-blue-50 rounded-3xl p-12 text-gray-800">
              <h2 className="text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-blue-600 via-gray-800 to-emerald-600 bg-clip-text text-transparent">
                <span>
                  Ready for Your {pageType === 'dahabiya' ? 'Nile Experience' : 'Egyptian Journey'}?
                </span>
              </h2>
              <p className="text-xl mb-8 text-gray-600">
                <span>
                  Book your {pageType === 'dahabiya' ? 'luxury dahabiya cruise' : 'Egyptian adventure package'} today
                </span>
              </p>
              <div className="flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking">
                  <Button
                    className="btn-egyptian"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, hsl(43, 85%, 58%) 0%, hsl(43, 85%, 48%) 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, hsl(43, 85%, 48%) 0%, hsl(43, 85%, 58%) 100%)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </Link>
                <Link href={pageType === 'dahabiya' ? '/dahabiyat' : '/packages'}>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'hsl(43, 85%, 58%)',
                      color: 'hsl(43, 85%, 58%)',
                      '&:hover': {
                        borderColor: 'hsl(43, 85%, 48%)',
                        backgroundColor: 'hsl(43, 85%, 58%)',
                        color: 'hsl(210, 85%, 25%)'
                      }
                    }}
                  >
                    View All {pageType === 'dahabiya' ? 'Dahabiyat' : 'Packages'}
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>
      </div>
    </React.Fragment>
  );
}
