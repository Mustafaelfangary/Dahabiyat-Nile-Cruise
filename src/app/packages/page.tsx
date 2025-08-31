"use client";

import React from 'react';
import Link from 'next/link';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { PackageList } from '@/components/packages';
import { useContent } from '@/hooks/useContent';
import OptimizedHeroVideo from '@/components/OptimizedHeroVideo';

export default function PackagesPage() {
  const { getContent, loading: contentLoading } = useContent({ page: 'packages' });

  // Show loading state while content is being fetched
  if (contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} className="text-blue-600 mb-4" />
          <Typography variant="h6" className="text-gray-800">
            Loading Content...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-sky-50">
      {/* Enhanced Pharaonic Hero Section */}
      <div className="relative overflow-hidden min-h-screen">
        {/* Hero Video/Image Background */}
        <OptimizedHeroVideo
          src={getContent('packages_hero_video', '/videos/packages-hero.mp4')}
          poster={getContent('packages_hero_image', '/images/packages-hero-bg.jpg')}
          className="absolute inset-0 w-full h-full"
          onError={() => {
            console.log('Packages hero video failed, using fallback image');
          }}
        />

        {/* Enhanced Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-blue-800/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/15 via-transparent to-cyan-900/15"></div>

        <div className="relative z-10 py-24">
          <Container maxWidth="lg">
            <Box textAlign="center">
              {/* Hieroglyphic Title */}
              <div className="mb-8">
                <Typography
                  variant="h3"
                  className="font-bold mb-4 tracking-wider"
                  style={{
                    fontFamily: 'serif',
                    background: 'linear-gradient(45deg, #0080ff, #0066cc, #3399ff, #0080ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {getContent('packages_hero_title') || 'Royal Journey Packages'}
                </Typography>
                <div className="w-32 h-1 bg-ocean-blue mx-auto mb-6 rounded-full"></div>
              </div>

              {/* Main Title */}
              <Typography
                variant="h1"
                component="h1"
                className="font-bold mb-6 text-shadow-lg"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontFamily: 'serif',
                  background: 'linear-gradient(45deg, #0080ff, #0066cc, #3399ff, #0080ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.4)'
                }}
              >
                {getContent('packages_hero_subtitle') || 'Curated Experiences Along the Eternal Nile'}
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h4"
                className="mb-8 max-w-4xl mx-auto leading-relaxed"
                style={{
                  fontFamily: 'serif',
                  color: '#FFE4B5',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontSize: 'clamp(1.2rem, 3vw, 1.8rem)'
                }}
              >
                {getContent('packages_hero_description') || 'From luxury cruises to cultural immersions, discover the perfect journey through ancient Egypt'}
              </Typography>

              {/* Decorative Elements */}
              <div className="flex justify-center items-center gap-8 mb-12">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
                <Typography className="text-6xl text-blue-300 animate-pulse">𓇳</Typography>
                <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-blue-400"></div>
              </div>
            </Box>
          </Container>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="relative z-10 bg-white">
        <Container maxWidth="xl" className="py-16">
          {/* Package List */}
          <PackageList activeOnly={true} limit={12} />

          {/* Enhanced CTA Section */}
          <div className="mt-24 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 shadow-2xl border border-blue-200/50">
              {/* Decorative Header */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
                <Typography className="text-4xl text-blue-600">𓇳</Typography>
                <Typography className="text-2xl font-bold text-blue-800">Ready for Your Journey?</Typography>
                <Typography className="text-4xl text-blue-600">𓇳</Typography>
                <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-blue-400"></div>
              </div>

              <Typography
                variant="h4"
                className="mb-6 text-gray-800 font-serif"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
              >
                {getContent('packages_cta_title') || 'Begin Your Egyptian Adventure'}
              </Typography>

              <Typography
                variant="h6"
                className="mb-8 text-gray-600 max-w-3xl mx-auto leading-relaxed"
              >
                {getContent('packages_cta_description') || 'Choose from our carefully curated packages or explore individual dahabiyas for a personalized experience'}
              </Typography>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-6">
                {/* Book Any Package */}
                <Link href="/booking?type=package">
                  <button className="bg-gradient-to-r from-ocean-blue to-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-500">
                    <div className="flex items-center gap-3">
                      <Typography className="text-2xl">𓇳</Typography>
                      <div>
                        <Typography variant="h6" className="font-bold">
                          {getContent('packages_cta_book_title') || 'Book Any Package'}
                        </Typography>
                        <Typography variant="caption" className="opacity-80">
                          {getContent('packages_cta_book_subtitle') || 'Complete journey experiences'}
                        </Typography>
                      </div>
                      <Typography className="text-2xl">𓇳</Typography>
                    </div>
                  </button>
                </Link>

                {/* Explore Dahabiyas */}
                <Link href="/dahabiyas">
                  <button className="bg-gradient-to-r from-blue-600 to-ocean-blue text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-600">
                    <div className="flex items-center gap-3">
                      <Typography className="text-2xl">𓊪</Typography>
                      <div>
                        <Typography variant="h6" className="font-bold">
                          {getContent('packages_cta_dahabiyas_title') || 'Explore Dahabiyas'}
                        </Typography>
                        <Typography variant="caption" className="opacity-80">
                          {getContent('packages_cta_dahabiyas_subtitle') || 'Individual luxury vessels'}
                        </Typography>
                      </div>
                      <Typography className="text-2xl">𓊪</Typography>
                    </div>
                  </button>
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Typography className="text-blue-600">𓈖</Typography>
                  <span>Expert Local Guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <Typography className="text-blue-600">𓂀</Typography>
                  <span>Luxury Accommodations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Typography className="text-blue-600">𓇳</Typography>
                  <span>Authentic Experiences</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}