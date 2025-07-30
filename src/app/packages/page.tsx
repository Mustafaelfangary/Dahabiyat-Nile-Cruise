"use client";
export const dynamic = "force-dynamic";

import Image from 'next/image';
import Link from 'next/link';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button } from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Star, Users, Calendar, MapPin, Anchor, Sparkles, Gift, Crown, Globe } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useEffect, useState } from 'react';
import {
  HieroglyphicDivider,
  PharaonicCard,
  PharaonicButton,
  PharaonicBorder,
  PharaonicObelisk,
  PharaonicPatternBackground,
  PharaonicCrown,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';

interface Package {
  id: string;
  name: string;
  shortDescription?: string;
  price: number;
  durationDays: number;
  mainImageUrl?: string;
}

export default function PackagesPage() {
  const { getContent, getContentBlock, loading, error } = useContent({ page: 'packages' });
  const [packages, setPackages] = useState<Package[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  // Fetch packages data
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages?limit=100');
        if (response.ok) {
          const data = await response.json();
          setPackages(data.packages || data || []);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const getSettingValue = (key: string, defaultValue: string = '') => {
    // First try to get from content, then fall back to default value
    return getContent(key, defaultValue);
  };

  if (loading || packagesLoading) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <EgyptHieroglyphic className="mx-auto mb-6" size="4rem" />
          <p className="pharaonic-text-brown font-bold text-xl">{getContent('packages_loading_text', 'Loading Packages...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <div className="text-text-secondary text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-text-primary font-bold text-xl">{getContent('packages_error_text', '𓂀 Content Loading Error:')} {error} 𓏏</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pharaonic-container">
      {/* Hero Section */}
      <section className="relative py-32 bg-slate-50 overflow-hidden min-h-screen">
        {/* Hero Background Image with Enhanced Effects */}
        {getSettingValue('packages_hero_background_image') && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-slow-zoom"
            style={{
              backgroundImage: `url("${getSettingValue('packages_hero_background_image', '/images/packages-hero-bg.jpg')}")`,
              filter: 'brightness(1.3) contrast(1.4) saturate(1.5)',
            }}
          ></div>
        )}

        {/* Enhanced Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/25 via-transparent to-amber-900/35"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-orange-900/20"></div>

        <PharaonicPatternBackground className="opacity-8 animate-pulse" />



        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            {/* Hieroglyphic Egypt at top */}
            <div className="text-center mb-8">
              <div className="text-4xl font-bold mb-2">
                <span style={{ color: '#FFD700' }}>𓂋</span><span style={{ color: '#FF6347' }}>𓏤</span><span style={{ color: '#FF1493' }}>𓈖</span><span style={{ color: '#00CED1' }}>𓇋</span><span style={{ color: '#9370DB' }}>𓆎</span><span style={{ color: '#FFD700' }}>𓏏</span><span style={{ color: '#FF4500' }}>𓂻</span>
              </div>
            </div>

            <div className="text-center text-text-primary">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6" style={{
                  background: 'linear-gradient(45deg, #FFD700, #FF6347, #FF1493, #00CED1, #9370DB, #FFD700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.4)'
                }}>
                  {getSettingValue('packages_hero_title', 'Journey Packages')}
                </h1>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl" style={{ color: '#FFD700' }}>𓈖</span>
                  <span className="text-2xl" style={{ color: '#FF6347' }}>𓂀</span>
                  <span className="text-2xl" style={{ color: '#FF1493' }}>𓏏</span>
                  <span className="text-2xl" style={{ color: '#00CED1' }}>𓇯</span>
                  <span className="text-2xl" style={{ color: '#9370DB' }}>𓊃</span>
                </div>
              </div>

              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed" style={{
                color: '#FFE4B5',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {getSettingValue('packages_hero_subtitle', 'Curated experiences for every traveler, from intimate cultural journeys to grand adventures')}
              </p>

              <p className="text-lg mb-12 max-w-3xl mx-auto leading-relaxed" style={{
                color: '#F0E68C',
                textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
              }}>
                {getSettingValue('packages_hero_description', 'Choose from our carefully crafted packages, each designed to showcase the best of Egypt\'s ancient wonders and natural beauty')}
              </p>

              <Link href="/booking?type=package">
                <PharaonicButton variant="primary" className="text-xl px-16 py-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">𓊪</span>
                    <Gift className="w-6 h-6" />
                    <span>{getSettingValue('packages_hero_cta_text', 'Book Your Journey')}</span>
                    <span className="text-2xl">𓊪</span>
                  </div>
                </PharaonicButton>
              </Link>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-gradient-to-b from-amber-50 to-orange-50 relative">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-egyptian-gold text-4xl animate-bounce">𓇳</span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-gold-text-dark">
                  {getSettingValue('packages_intro_title', '𓊪 Mysteries Await Your Soul 𓊪')}
                </h2>
                <span className="text-egyptian-gold text-4xl animate-bounce">𓇳</span>
              </div>
              <PharaonicBorder className="mb-8" />
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-egyptian-gold text-xl">𓈖</span>
                <span className="text-egyptian-gold text-xl">𓂀</span>
                <span className="text-egyptian-gold text-xl">𓏏</span>
                <span className="text-egyptian-gold text-xl">𓇯</span>
                <span className="text-egyptian-gold text-xl">𓊃</span>
              </div>
              <p className="text-xl text-gold-text-dark leading-relaxed max-w-4xl mx-auto">
                {getSettingValue('packages_intro_description', 'Our expeditions unite the mysteries of ancient Egypt with royal luxury, offering blessed journeys through the realm of eternal pharaohs and temples.')}
              </p>
            </div>

            <div className="grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '𓇳',
                  title: getSettingValue('packages_intro_feature_1_title', '𓊪 Egyptologists 𓊪'),
                  description: getSettingValue('packages_intro_feature_1_desc', 'Learn secrets from blessed scholars who commune with ancient pharaonic spirits')
                },
                {
                  icon: '𓊪',
                  title: getSettingValue('packages_intro_feature_2_title', '𓇳 Royal Sanctuaries 𓇳'),
                  description: getSettingValue('packages_intro_feature_2_desc', 'Rest in palaces and blessed dahabiyas touched by pharaonic divinity')
                },
                {
                  icon: '𓂀',
                  title: getSettingValue('packages_intro_feature_3_title', '𓈖 Access 𓈖'),
                  description: getSettingValue('packages_intro_feature_3_desc', 'Enter forbidden chambers where pharaohs commune with eternal gods')
                }
              ].map((feature, index) => (
                <AnimatedSection key={index} animation="scale-in" delay={index * 150}>
                  <PharaonicCard className="text-center p-8 h-full">
                    <div className="text-egyptian-gold text-7xl mb-6 animate-pulse">{feature.icon}</div>
                    <h3 className="text-xl font-heading font-bold text-gold-text-dark mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gold-text-dark/80 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <span className="text-egyptian-gold text-sm">𓏏</span>
                      <span className="text-egyptian-gold text-sm">𓇯</span>
                      <span className="text-egyptian-gold text-sm">𓊃</span>
                    </div>
                  </PharaonicCard>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-gradient-to-b from-orange-50 to-amber-50">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-egyptian-gold text-4xl animate-pulse">𓇳</span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
                  {getSettingValue('packages_gallery_title', '𓊪 Treasures of Pharaonic Expeditions 𓊪')}
                </h2>
                <span className="text-egyptian-gold text-4xl animate-pulse">𓇳</span>
              </div>
              <PharaonicBorder className="mb-8" />
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-egyptian-gold text-lg">𓈖</span>
                <span className="text-egyptian-gold text-lg">𓂀</span>
                <span className="text-egyptian-gold text-lg">𓏏</span>
                <span className="text-egyptian-gold text-lg">𓇯</span>
                <span className="text-egyptian-gold text-lg">𓊃</span>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                <PharaonicCard className="overflow-hidden group cursor-pointer bg-white/95 backdrop-blur-sm border border-egyptian-gold/30">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={getSettingValue(`packages_gallery_image_${index}`, `/images/packages-gallery-${index}.jpg`)}
                      alt={`Gallery ${index}`}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-egyptian-gold/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-text-primary text-3xl animate-pulse">𓇳</div>
                      <div className="absolute top-4 right-4 text-text-primary text-3xl animate-bounce">𓊪</div>
                      <div className="absolute bottom-4 right-4 text-text-primary text-2xl animate-pulse">𓈖</div>
                      <div className="absolute top-4 left-4 text-text-primary text-2xl animate-bounce">𓂀</div>
                    </div>
                  </div>
                </PharaonicCard>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Packages Section */}
      <section className="py-24 relative">
        <PharaonicPatternBackground className="opacity-10" />

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-egyptian-gold text-5xl animate-pulse">𓇳</span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
                  𓊪 Pharaonic Expeditions 𓊪
                </h2>
                <span className="text-egyptian-gold text-5xl animate-pulse">𓇳</span>
              </div>
              <PharaonicBorder className="mb-8" />
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-egyptian-gold text-2xl">𓈖</span>
                <span className="text-egyptian-gold text-2xl">𓂀</span>
                <span className="text-egyptian-gold text-2xl">𓏏</span>
                <span className="text-egyptian-gold text-2xl">𓇯</span>
                <span className="text-egyptian-gold text-2xl">𓊃</span>
              </div>
              <p className="text-xl text-text-primary leading-relaxed max-w-4xl mx-auto">
                Choose from our royally blessed packages, each crafted by ancient wisdom to immerse your soul in the eternal grandeur of pharaonic Egypt
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(packages) && packages.length > 0 ? (
              packages.map((pkg, index) => (
                <AnimatedSection key={pkg.id} animation="slide-up" delay={index * 150}>
                  <Link href={`/packages/${pkg.id}`} className="block group">
                    <PharaonicCard className="h-full overflow-hidden hover:scale-105 transition-all duration-500 bg-white/95 backdrop-blur-sm border border-egyptian-gold/30">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={pkg.mainImageUrl || '/images/placeholder-package.jpg'}
                          alt={pkg.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown text-sm font-bold px-4 py-2 rounded-full shadow-2xl shadow-egyptian-gold/40">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          {pkg.durationDays} Days
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-egyptian-gold/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 text-text-primary text-3xl animate-pulse">𓇳</div>
                          <div className="absolute top-4 right-4 text-text-primary text-3xl animate-bounce">𓊪</div>
                          <div className="absolute bottom-4 right-4 text-text-primary text-2xl animate-pulse">𓈖</div>
                          <div className="absolute top-4 left-4 text-text-primary text-2xl animate-bounce">𓂀</div>
                          <div className="absolute center-4 text-text-primary text-xl animate-pulse">𓏏</div>
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-egyptian-gold text-3xl animate-pulse">𓇳</span>
                          <h3 className="text-2xl font-heading font-bold text-text-primary group-hover:text-egyptian-gold transition-colors">
                            {pkg.name}
                          </h3>
                          <span className="text-egyptian-gold text-3xl animate-pulse">𓇳</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-4">
                          <span className="text-egyptian-gold text-sm">𓈖</span>
                          <span className="text-egyptian-gold text-sm">𓂀</span>
                          <span className="text-egyptian-gold text-sm">𓏏</span>
                          <span className="text-egyptian-gold text-sm">𓇯</span>
                          <span className="text-egyptian-gold text-sm">𓊃</span>
                        </div>

                        <p className="text-text-primary/90 mb-6 leading-relaxed line-clamp-3">
                          {pkg.shortDescription || 'Discover the wonders of ancient Egypt with this blessed expedition through pharaonic mysteries.'}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-egyptian-gold">
                            ${pkg.price.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 text-egyptian-gold group-hover:text-text-primary transition-colors">
                            <span className="font-medium">𓊪 Enter Realm</span>
                            <span className="text-2xl animate-pulse">𓇳</span>
                          </div>
                        </div>
                      </div>
                    </PharaonicCard>
                  </Link>
                </AnimatedSection>
              ))
            ) : (
              <div className="col-span-full">
                <PharaonicObelisk className="max-w-md mx-auto">
                  <div className="text-center text-text-primary">
                    <div className="text-7xl mb-6 animate-pulse">𓇳</div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-egyptian-gold text-2xl">𓈖</span>
                      <span className="text-egyptian-gold text-2xl">𓂀</span>
                      <span className="text-egyptian-gold text-2xl">𓏏</span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-4">𓊪 Packages Manifesting 𓊪</h3>
                    <p className="text-lg leading-relaxed">
                      Our blessed pharaonic scholars are channeling ancient wisdom to craft extraordinary adventures.
                      Royal packages shall be revealed by the gods soon.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <span className="text-egyptian-gold text-lg">𓇯</span>
                      <span className="text-egyptian-gold text-lg">𓊃</span>
                    </div>
                  </div>
                </PharaonicObelisk>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-orange-50 to-amber-50">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-egyptian-gold text-4xl animate-pulse">𓇳</span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
                  {getSettingValue('packages_features_title', '𓊪 What Makes Our Expeditions Extraordinary 𓊪')}
                </h2>
                <span className="text-egyptian-gold text-4xl animate-pulse">𓇳</span>
              </div>
              <PharaonicBorder className="mb-8" />
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-egyptian-gold text-xl">𓈖</span>
                <span className="text-egyptian-gold text-xl">𓂀</span>
                <span className="text-egyptian-gold text-xl">𓏏</span>
                <span className="text-egyptian-gold text-xl">𓇯</span>
                <span className="text-egyptian-gold text-xl">𓊃</span>
              </div>
              <p className="text-xl text-text-primary leading-relaxed max-w-4xl mx-auto">
                {getSettingValue('packages_features_description', 'Every royal expedition is blessed by ancient pharaonic wisdom, designed to immerse your soul in royal grandeur while providing royal comfort blessed by the gods.')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Crown className="w-12 h-12" />,
                title: getSettingValue('packages_feature_1_title', '𓇳 Royal All-Inclusive Luxury 𓇳'),
                description: getSettingValue('packages_feature_1_desc', 'Everything blessed and included: accommodations, royal meals, guided temple tours, and luxury transportation.'),
                hieroglyph: '𓇳'
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: getSettingValue('packages_feature_2_title', '𓊪 Circle Experience 𓊪'),
                description: getSettingValue('packages_feature_2_desc', 'Intimate royal circles of maximum 16 blessed souls for personalized attention and authentic pharaonic experiences.'),
                hieroglyph: '𓊪'
              },
              {
                icon: <Globe className="w-12 h-12" />,
                title: getSettingValue('packages_feature_3_title', '𓂀 Flexible Journeys 𓂀'),
                description: getSettingValue('packages_feature_3_desc', 'schedules blessed by pharaonic wisdom, customizable to match your spiritual interests and travel preferences.'),
                hieroglyph: '𓂀'
              }
            ].map((feature, index) => (
              <AnimatedSection key={index} animation="scale-in" delay={index * 150}>
                <PharaonicCard className="text-center p-8 h-full group hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border border-egyptian-gold/30">
                  <div className="mb-6">
                    <div className="text-egyptian-gold text-5xl mb-4 group-hover:animate-bounce animate-pulse">
                      {feature.hieroglyph}
                    </div>
                    <div className="text-egyptian-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-text-secondary mb-4 group-hover:text-text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary/90 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-egyptian-gold text-sm">𓏏</span>
                    <span className="text-egyptian-gold text-sm">𓇯</span>
                    <span className="text-egyptian-gold text-sm">𓊃</span>
                  </div>
                </PharaonicCard>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Hieroglyphic Divider */}
      <HieroglyphicDivider />

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-amber-50 to-orange-50">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-egyptian-gold text-4xl animate-pulse">𓇳</span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
                  {getSettingValue('packages_testimonials_title', '𓊪 Voices of Blessed Travelers 𓊪')}
                </h2>
                <span className="text-egyptian-gold text-4xl animate-pulse">𓇳</span>
              </div>
              <PharaonicBorder className="mb-8" />
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-egyptian-gold text-xl">𓈖</span>
                <span className="text-egyptian-gold text-xl">𓂀</span>
                <span className="text-egyptian-gold text-xl">𓏏</span>
                <span className="text-egyptian-gold text-xl">𓇯</span>
                <span className="text-egyptian-gold text-xl">𓊃</span>
              </div>
              <p className="text-xl text-text-primary leading-relaxed max-w-4xl mx-auto">
                {getSettingValue('packages_testimonials_description', 'Hear the testimonies from blessed travelers who have experienced the magic of our pharaonic expeditions.')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: getSettingValue('packages_testimonial_1_text', 'A journey through ancient Egypt. The blessed attention to detail and expert pharaonic guidance made this expedition eternally unforgettable.'),
                author: getSettingValue('packages_testimonial_1_author', 'Sarah Johnson'),
                location: getSettingValue('packages_testimonial_1_location', 'Adventure Seeker'),
                hieroglyph: '𓇳'
              },
              {
                text: getSettingValue('packages_testimonial_2_text', 'The perfect blend of ancient history, royal luxury, and adventure. Every blessed moment was carefully planned by pharaonic wisdom.'),
                author: getSettingValue('packages_testimonial_2_author', 'Michael Chen'),
                location: getSettingValue('packages_testimonial_2_location', 'Cultural Explorer'),
                hieroglyph: '𓊪'
              },
              {
                text: getSettingValue('packages_testimonial_3_text', 'Beyond our expectations! The exclusive access to pharaonic sites and blessed expert commentary made this truly special.'),
                author: getSettingValue('packages_testimonial_3_author', 'Emma Rodriguez'),
                location: getSettingValue('packages_testimonial_3_location', 'History Devotee'),
                hieroglyph: '𓂀'
              }
            ].map((testimonial, index) => (
              <AnimatedSection key={index} animation="scale-in" delay={index * 150}>
                <PharaonicCard className="p-8 h-full relative group hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border border-egyptian-gold/30">
                  <div className="absolute top-4 left-4 text-egyptian-gold text-4xl group-hover:animate-pulse">
                    {testimonial.hieroglyph}
                  </div>
                  <div className="absolute top-4 right-4 text-egyptian-gold text-2xl">
                    <Star className="w-6 h-6 fill-current" />
                  </div>

                  <div className="mt-8">
                    <div className="text-egyptian-gold text-5xl mb-4">"</div>
                    <p className="text-text-primary/90 leading-relaxed mb-6 italic">
                      {testimonial.text}
                    </p>

                    <div className="border-t border-egyptian-gold/30 pt-4">
                      <div className="font-heading font-bold text-text-primary mb-1">
                        {testimonial.author}
                      </div>
                      <div className="text-egyptian-gold text-sm">
                        {testimonial.location}
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-egyptian-gold text-xs">𓏏</span>
                        <span className="text-egyptian-gold text-xs">𓇯</span>
                        <span className="text-egyptian-gold text-xs">𓊃</span>
                      </div>
                    </div>
                  </div>
                </PharaonicCard>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <PharaonicPatternBackground className="opacity-15" />

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-text-primary">
              <div className="mb-8">
                <h2 className="text-4xl md:text-6xl font-heading font-bold bg-gradient-to-r from-egyptian-gold via-hieroglyph-brown to-sunset-orange bg-clip-text text-transparent mb-6">
                  {getSettingValue('packages_cta_title', 'Begin Your Journey')}
                </h2>
              </div>

              <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-text-primary">
                {getSettingValue('packages_cta_description', 'Choose from our blessed packages and embark on a journey through the eternal wonders of pharaonic Egypt, where gods whisper ancient secrets.')}
              </p>

              <div className="flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/booking?type=package">
                  <PharaonicButton variant="primary" className="text-xl px-12 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">𓊪</span>
                      <Gift className="w-6 h-6" />
                      <span>{getSettingValue('packages_cta_primary_text', 'Book Your Journey')}</span>
                      <span className="text-2xl">𓊪</span>
                    </div>
                  </PharaonicButton>
                </Link>

                <Link href="/tailor-made">
                  <PharaonicButton variant="secondary" className="text-xl px-12 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">𓇳</span>
                      <Crown className="w-6 h-6" />
                      <span>{getSettingValue('packages_cta_secondary_text', 'Custom Journey')}</span>
                      <span className="text-2xl">𓇳</span>
                    </div>
                  </PharaonicButton>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}