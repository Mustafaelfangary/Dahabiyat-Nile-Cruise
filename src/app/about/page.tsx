"use client";
export const dynamic = "force-dynamic";

import React from 'react';
import { Container } from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import { useContent } from '@/hooks/useContent';
import {
  RoyalCrown,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';

export default function AboutPage() {
  const { getContent, loading, error } = useContent({ page: 'about' });

  if (loading) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <RoyalCrown className="w-16 h-16 text-egyptian-gold mx-auto mb-6 animate-pulse" />
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-egyptian-gold mx-auto mb-6"></div>
          <div className="text-egyptian-gold text-3xl mb-4">𓇳 𓊪 𓈖 𓂀 𓏏 𓇯 𓊃</div>
          <p className="pharaonic-text-brown font-bold text-xl">{getContent('about_loading_text', '𓈖 Loading About Portal... 𓊪')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <div className="text-egyptian-gold text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-text-primary font-bold text-xl">{getContent('about_error_text', '𓂀 Content Loading Error:')} {error} 𓏏</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pharaonic-container relative overflow-hidden">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      <main className="relative z-10">
        {/* Hero Section */}
        <div className="relative py-32 overflow-hidden">
          <Container maxWidth="lg">
            <AnimatedSection animation="fade-in">
              {/* Hieroglyphic Egypt at top */}
              <div className="text-center mb-8">
                <EgyptHieroglyphic className="mx-auto mb-4" size="3rem" />
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  𓂋𓏤𓈖𓇋𓆎𓏏𓂻
                </div>
                <p className="text-gray-600 text-sm">{getContent('about_egypt_label', 'Egypt')}</p>
              </div>

              <div className="text-center text-text-primary">
                <h1 className="text-5xl md:text-7xl font-heading font-bold bg-gradient-to-r from-egyptian-gold via-hieroglyph-brown to-sunset-orange bg-clip-text text-transparent mb-8">
                  {getContent('about_hero_title', 'About Us')}
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-text-primary">
                  {getContent('about_hero_subtitle', 'Discover the story behind Egypt\'s premier Dahabiya cruise experience')}
                </p>
              </div>
            </AnimatedSection>
          </Container>
        </div>

        {/* Simple Content Section */}
        <div className="py-20">
          <Container maxWidth="lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">{getContent('about_our_story_section_title', 'Our Story')}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {getContent('about_story', 'We are dedicated to providing authentic Egyptian experiences through our traditional Dahabiya cruises.')}
              </p>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
