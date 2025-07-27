"use client";

import React from 'react';
import Link from 'next/link';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { DahabiyaList } from '@/components/dahabiyas';
import FloatingBookingButton from '@/components/booking/FloatingBookingButton';
import { usePageContent } from '@/hooks/usePageContent';

export default function DahabiyasPage() {
  const { getContentValue, loading: contentLoading } = usePageContent('dahabiyas');

  // Show loading state while content is being fetched
  if (contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} className="text-egyptian-gold mb-4" />
          <Typography variant="h6" className="text-hieroglyph-brown">
            Loading Content...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Enhanced Pharaonic Hero Section */}
      <div className="relative overflow-hidden min-h-screen">
        {/* Hero Background Image with Enhanced Effects */}
        {getContentValue('dahabiyas_hero_background_image') && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-slow-zoom"
            style={{
              backgroundImage: `url("${getContentValue('dahabiyas_hero_background_image', '/images/dahabiya-hero-bg.jpg')}")`,
              filter: 'brightness(1.2) contrast(1.3) saturate(1.4)',
            }}
          ></div>
        )}

        {/* Enhanced Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-transparent to-orange-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/15 via-transparent to-cyan-900/15"></div>

        {/* Animated Hieroglyphic Pattern Overlay */}
        <div className="absolute inset-0 opacity-8 animate-pulse" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.3'%3E%3Cpath d='M40 40c0-14.728-11.938-26.667-26.667-26.667S-13.333 25.272-13.333 40 -1.395 66.667 13.333 66.667 40 54.728 40 40zm0 0c0 14.728 11.938 26.667 26.667 26.667S93.333 54.728 93.333 40 81.395 13.333 66.667 13.333 40 25.272 40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        {/* Enhanced Floating Hieroglyphic Elements with Glow Effects */}
        <div className="absolute top-12 left-12 text-8xl opacity-70 animate-pulse drop-shadow-2xl" style={{
          color: '#FFD700',
          textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700',
          filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))'
        }}>𓊪</div>
        <div className="absolute top-24 right-16 text-6xl opacity-60 animate-bounce drop-shadow-2xl" style={{
          color: '#FF6347',
          textShadow: '0 0 15px #FF6347, 0 0 30px #FF6347, 0 0 45px #FF6347',
          filter: 'drop-shadow(0 0 12px rgba(255, 99, 71, 0.8))'
        }}>𓇳</div>
        <div className="absolute bottom-28 left-20 text-7xl opacity-65 animate-pulse drop-shadow-2xl" style={{
          color: '#00CED1',
          textShadow: '0 0 25px #00CED1, 0 0 50px #00CED1, 0 0 75px #00CED1',
          filter: 'drop-shadow(0 0 18px rgba(0, 206, 209, 0.9))'
        }}>𓈖</div>
        <div className="absolute bottom-12 right-12 text-5xl opacity-75 animate-bounce drop-shadow-2xl" style={{
          color: '#FF1493',
          textShadow: '0 0 15px #FF1493, 0 0 30px #FF1493, 0 0 45px #FF1493',
          filter: 'drop-shadow(0 0 10px rgba(255, 20, 147, 0.8))'
        }}>𓊽</div>

        {/* Additional Magical Elements */}
        <div className="absolute top-1/3 left-8 text-4xl opacity-50 animate-pulse drop-shadow-xl" style={{
          color: '#9370DB',
          textShadow: '0 0 12px #9370DB, 0 0 24px #9370DB',
          filter: 'drop-shadow(0 0 8px rgba(147, 112, 219, 0.7))'
        }}>𓏏</div>
        <div className="absolute top-1/4 right-8 text-6xl opacity-55 animate-pulse drop-shadow-2xl" style={{
          color: '#32CD32',
          textShadow: '0 0 18px #32CD32, 0 0 36px #32CD32',
          filter: 'drop-shadow(0 0 12px rgba(50, 205, 50, 0.8))'
        }}>𓇯</div>
        <div className="absolute bottom-1/3 left-1/4 text-3xl opacity-40 animate-spin-slow drop-shadow-lg" style={{
          color: '#FF8C00',
          textShadow: '0 0 10px #FF8C00',
          animationDuration: '25s'
        }}>𓊃</div>
        <div className="absolute top-2/3 right-1/4 text-4xl opacity-45 animate-bounce drop-shadow-lg" style={{
          color: '#DA70D6',
          textShadow: '0 0 12px #DA70D6',
          animationDelay: '3s'
        }}>𓆎</div>

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
                    background: 'linear-gradient(45deg, #FFD700, #FF8C00, #FF6347, #FFD700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {getContentValue('dahabiyas_hero_hieroglyphic_title', '𓂋𓏤𓈖𓇋𓆎𓏏𓂻')}
                </Typography>
                <div className="w-32 h-1 bg-egyptian-gold mx-auto mb-6 rounded-full"></div>
              </div>

              {/* Main Title */}
              <Typography
                variant="h1"
                component="h1"
                className="font-bold mb-6 text-shadow-lg"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontFamily: 'serif',
                  background: 'linear-gradient(45deg, #FFD700, #FF4500, #FF1493, #00CED1, #FFD700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.4)'
                }}
              >
                {getContentValue('dahabiyas_hero_main_title', 'Dahabiyas 𓂋𓏤𓈖𓇋𓆎𓏏𓂻')}
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h4"
                className="mb-8 max-w-4xl mx-auto leading-relaxed"
                style={{
                  fontFamily: 'serif',
                  color: '#FFE4B5',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontSize: '1.5rem'
                }}
              >
                {getContentValue('dahabiyas_hero_subtitle', 'Journey Through Time on the Eternal Waters of the Nile')}
              </Typography>

              {/* Description */}
              <Typography
                variant="h6"
                className="max-w-3xl mx-auto leading-relaxed"
                style={{
                  color: '#F0E68C',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                  fontSize: '1.2rem'
                }}
              >
                {getContentValue('dahabiyas_hero_description', 'Discover our magnificent fleet of traditional sailing vessels, each a floating palace crafted to honor the ancient pharaonic legacy while providing unparalleled luxury on the waters of the Nile River.')}
              </Typography>

              {/* Decorative Elements */}
              <div className="mt-12 flex justify-center items-center gap-8">
                <div className="w-16 h-0.5 bg-egyptian-gold"></div>
                <Typography className="text-egyptian-gold text-4xl">𓇳</Typography>
                <div className="w-16 h-0.5 bg-egyptian-gold"></div>
              </div>
            </Box>
          </Container>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-amber-50">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="relative">
        {/* Decorative Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-egyptian-gold via-amber-400 to-egyptian-gold"></div>

        <Container maxWidth="lg" className="py-16">
          {/* Section Header */}
          <Box textAlign="center" className="mb-16">
            <Typography
              variant="h3"
              className="text-hieroglyph-brown font-bold mb-4"
              style={{ fontFamily: 'serif' }}
            >
              Our Fleet
            </Typography>
            <Typography
              variant="h6"
              className="text-amber-700 max-w-2xl mx-auto mb-8"
            >
              Each vessel in our collection tells a story of ancient grandeur,
              modern luxury, and timeless elegance on the waters of eternity.
            </Typography>

            {/* Decorative Divider */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="w-12 h-0.5 bg-egyptian-gold"></div>
              <Typography className="text-egyptian-gold text-2xl">𓊪</Typography>
              <div className="w-12 h-0.5 bg-egyptian-gold"></div>
            </div>
          </Box>

          {/* Dahabiya List */}
          <DahabiyaList activeOnly={true} limit={12} />

          {/* Enhanced Booking Call-to-Action Section */}
          <Box className="mt-20">
            <div className="bg-gradient-to-br from-hieroglyph-brown via-amber-900 to-orange-900 rounded-2xl p-12 text-center relative overflow-hidden shadow-2xl">
              {/* Background Pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>

              {/* Floating Hieroglyphs */}
              <div className="absolute top-6 left-6 text-egyptian-gold opacity-30 text-4xl animate-pulse">𓊪</div>
              <div className="absolute top-6 right-6 text-egyptian-gold opacity-30 text-4xl animate-bounce">𓇳</div>
              <div className="absolute bottom-6 left-6 text-egyptian-gold opacity-30 text-4xl">𓈖</div>
              <div className="absolute bottom-6 right-6 text-egyptian-gold opacity-30 text-4xl">𓊽</div>

              <div className="relative z-10">
                {/* Header */}
                <Typography
                  variant="h3"
                  className="text-egyptian-gold font-bold mb-4"
                  style={{ fontFamily: 'serif' }}
                >
                  {getContentValue('dahabiyas_cta_title', 'Begin Your Journey')}
                </Typography>

                <Typography
                  variant="h6"
                  className="text-amber-200 mb-8 max-w-3xl mx-auto leading-relaxed"
                >
                  {getContentValue('dahabiyas_cta_description', 'Choose from our magnificent fleet of traditional dahabiyas and embark on an unforgettable voyage through the timeless waters of the Nile River, where ancient mysteries await.')}
                </Typography>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-6">
                  {/* Book Any Dahabiya */}
                  <Link href="/booking?type=dahabiya">
                    <button className="bg-gradient-to-r from-egyptian-gold to-amber-400 text-hieroglyph-brown px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-amber-500">
                      <div className="flex items-center gap-3">
                        <Typography className="text-2xl">𓊪</Typography>
                        <div>
                          <Typography variant="h6" className="font-bold">
                            {getContentValue('dahabiyas_cta_book_dahabiya_title', 'Book Any Dahabiya')}
                          </Typography>
                          <Typography variant="caption" className="opacity-80">
                            {getContentValue('dahabiyas_cta_book_dahabiya_subtitle', 'Choose your perfect vessel')}
                          </Typography>
                        </div>
                        <Typography className="text-2xl">𓊪</Typography>
                      </div>
                    </button>
                  </Link>

                  {/* Explore Packages */}
                  <Link href="/booking?type=package">
                    <button className="bg-gradient-to-r from-amber-700 to-orange-700 text-egyptian-gold px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-egyptian-gold">
                      <div className="flex items-center gap-3">
                        <Typography className="text-2xl">𓇳</Typography>
                        <div>
                          <Typography variant="h6" className="font-bold">
                            {getContentValue('dahabiyas_cta_packages_title', 'Packages')}
                          </Typography>
                          <Typography variant="caption" className="opacity-80">
                            {getContentValue('dahabiyas_cta_packages_subtitle', 'Complete journey experiences')}
                          </Typography>
                        </div>
                        <Typography className="text-2xl">𓇳</Typography>
                      </div>
                    </button>
                  </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="text-center">
                    <div className="bg-egyptian-gold/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Typography className="text-egyptian-gold text-2xl">𓊪</Typography>
                    </div>
                    <Typography variant="h6" className="text-egyptian-gold font-bold mb-2">
                      {getContentValue('dahabiyas_feature_instant_booking_title', 'Instant Booking')}
                    </Typography>
                    <Typography variant="body2" className="text-amber-200">
                      {getContentValue('dahabiyas_feature_instant_booking_description', 'Reserve your journey with immediate confirmation')}
                    </Typography>
                  </div>

                  <div className="text-center">
                    <div className="bg-egyptian-gold/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Typography className="text-egyptian-gold text-2xl">𓇳</Typography>
                    </div>
                    <Typography variant="h6" className="text-egyptian-gold font-bold mb-2">
                      {getContentValue('dahabiyas_feature_best_prices_title', 'Best Prices')}
                    </Typography>
                    <Typography variant="body2" className="text-amber-200">
                      {getContentValue('dahabiyas_feature_best_prices_description', 'Guaranteed lowest rates for authentic Nile experiences')}
                    </Typography>
                  </div>

                  <div className="text-center">
                    <div className="bg-egyptian-gold/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Typography className="text-egyptian-gold text-2xl">𓈖</Typography>
                    </div>
                    <Typography variant="h6" className="text-egyptian-gold font-bold mb-2">
                      {getContentValue('dahabiyas_feature_expert_support_title', 'Expert Support')}
                    </Typography>
                    <Typography variant="body2" className="text-amber-200">
                      {getContentValue('dahabiyas_feature_expert_support_description', '24/7 assistance from our pharaonic travel specialists')}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Container>
      </div>

      {/* Floating Booking Button */}
      <FloatingBookingButton />
    </div>
  );
}
