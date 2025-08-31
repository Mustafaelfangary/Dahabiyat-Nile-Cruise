"use client";
export const dynamic = "force-dynamic";

import React from 'react';
import { Container, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';
import OptimizedHeroVideo from '@/components/OptimizedHeroVideo';
import {
  RoyalCrown,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';
import {
  Users,
  Award,
  Target,
  Heart,
  Star,
  Crown,
  Shield,
  Compass,
  Globe,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function AboutPage() {
  const { getContent, loading, error } = useContent({ page: 'about' });

  if (loading) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <RoyalCrown className="w-16 h-16 text-ocean-blue mx-auto mb-6 animate-pulse" />
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-ocean-blue mx-auto mb-6"></div>
          <div className="text-ocean-blue text-3xl mb-4">𓇳 𓊪 𓈖 𓂀 𓏏 𓇯 𓊃</div>
          <p className="text-ocean-blue-dark font-bold text-xl">{getContent('about_loading_text') || 'Loading About Page...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <div className="text-ocean-blue text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-ocean-blue-dark font-bold text-xl">Content Loading Error: {error}</p>
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
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Video/Image with Egyptian Overlay */}
          <div className="absolute inset-0 z-0">
            <OptimizedHeroVideo
              src={getContent('about_hero_video', '/videos/about-hero.mp4')}
              poster={getContent('about_hero_image', '/images/about-hero.png')}
              className="absolute inset-0 w-full h-full"
              onError={() => {
                console.log('About hero video failed, using fallback image');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/60 via-navy-blue/40 to-ocean-blue/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
          </div>

          <Container maxWidth="lg" className="relative z-10">
            <AnimatedSection animation="fade-in">
              {/* Hieroglyphic Egypt at top */}
              <div className="text-center mb-8">
                <EgyptHieroglyphic className="mx-auto mb-4" size="3rem" />
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                </div>
                <p className="text-gray-600 text-sm">{getContent('about_egypt_label') || 'Egypt'}</p>
              </div>

              <div className="text-center text-white">
                <h1 className="text-5xl md:text-7xl font-heading font-bold text-white drop-shadow-2xl mb-8">
                  {getContent('about_hero_title') || 'About Our Egyptian Legacy'}
                </h1>
                <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-blue-100 drop-shadow-lg">
                  {getContent('about_hero_subtitle') || 'Discover the story behind Egypt\'s premier Dahabiya cruise experience, where ancient traditions meet modern luxury.'}
                </p>
              </div>
            </AnimatedSection>
          </Container>
        </div>

        {/* Our Story Section */}
        <div className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
          <Container maxWidth="lg">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-ocean-blue mb-6">
                  {getContent('about_story_title') || 'Our Story'}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-ocean-blue to-deep-blue mx-auto mb-8"></div>
                <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                  {getContent('about_story_content') || 'We are dedicated to providing authentic Egyptian experiences through our traditional Dahabiya cruises that connect you with the timeless beauty of the Nile River.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-ocean-blue mb-4 flex items-center gap-2">
                      <Target className="w-6 h-6 text-ocean-blue" />
                      {getContent('about_mission_title') || 'Our Mission'}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {getContent('about_mission_content') || 'To provide authentic, luxury Nile experiences that honor Egypt\'s ancient heritage while delivering modern comfort and exceptional service.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-ocean-blue mb-4 flex items-center gap-2">
                      <Compass className="w-6 h-6 text-ocean-blue" />
                      {getContent('about_vision_title') || 'Our Vision'}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {getContent('about_vision_content') || 'To be the premier provider of traditional Dahabiya cruises, preserving Egypt\'s maritime heritage for future generations.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-ocean-blue mb-4 flex items-center gap-2">
                      <Heart className="w-6 h-6 text-ocean-blue" />
                      {getContent('about_values_title') || 'Our Values'}
                    </h3>
                    <div className="space-y-2">
                      {(getContent('about_values') || 'Authenticity,Excellence,Heritage,Sustainability').split(',').map((value, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-ocean-blue" />
                          <span className="text-gray-700">{value.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Image
                    src={getContent('about_story_image') || '/images/about/our-story.jpg'}
                    alt="Our Story"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-ocean-blue rounded-full flex items-center justify-center shadow-xl">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </div>

        {/* Leadership Team Section */}
        <div className="py-20 bg-white">
          <Container maxWidth="lg">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-ocean-blue mb-6">
                  {getContent('about_team_title') || 'Our Leadership Team'}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-ocean-blue to-deep-blue mx-auto mb-8"></div>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  {getContent('about_team_description') || 'Meet the passionate leaders who bring decades of experience to create unforgettable Nile journeys.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
                {[1, 2, 3].map((index) => (
                  <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-100">
                    <CardContent className="p-8">
                      <div className="relative mb-6">
                        <Avatar
                          src={getContent(`about_team_member_${index}_image`) || `/images/about/team-${index}.jpg`}
                          alt={getContent(`about_team_member_${index}_name`) || `Team Member ${index}`}
                          sx={{
                            width: 120,
                            height: 120,
                            margin: '0 auto',
                            border: '4px solid #0080ff',
                            boxShadow: '0 8px 25px rgba(0, 128, 255, 0.3)'
                          }}
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-ocean-blue rounded-full flex items-center justify-center">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-ocean-blue mb-2">
                        {getContent(`about_team_member_${index}_name`) || `Team Member ${index}`}
                      </h3>

                      <p className="text-ocean-blue-dark font-semibold mb-4">
                        {getContent(`about_team_member_${index}_title`) || 'Position'}
                      </p>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        {getContent(`about_team_member_${index}_description`) || 'Dedicated professional with extensive experience in luxury travel and Egyptian heritage.'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AnimatedSection>
          </Container>
        </div>

        {/* Company Stats Section */}
        <div className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
          <Container maxWidth="lg">
            <AnimatedSection animation="fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    icon: Users,
                    number: getContent('about_stat_guests') || '10,000+',
                    label: getContent('about_stat_guests_label') || 'Happy Guests',
                    color: 'text-blue-600'
                  },
                  {
                    icon: Award,
                    number: getContent('about_stat_years') || '15+',
                    label: getContent('about_stat_years_label') || 'Years Experience',
                    color: 'text-ocean-blue'
                  },
                  {
                    icon: Shield,
                    number: getContent('about_stat_safety') || '100%',
                    label: getContent('about_stat_safety_label') || 'Safety Record',
                    color: 'text-green-600'
                  },
                  {
                    icon: Globe,
                    number: getContent('about_stat_countries') || '50+',
                    label: getContent('about_stat_countries_label') || 'Countries Served',
                    color: 'text-purple-600'
                  }
                ].map((stat, index) => (
                  <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 border border-blue-100">
                    <CardContent>
                      <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                      <Typography variant="h3" className="font-bold text-gray-800 mb-2">
                        {stat.number}
                      </Typography>
                      <Typography variant="body1" className="text-gray-600">
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AnimatedSection>
          </Container>
        </div>

        {/* Contact Information Section */}
        <div className="py-20 bg-white">
          <Container maxWidth="lg">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-ocean-blue mb-6">
                  {getContent('about_contact_title') || 'Get in Touch'}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-ocean-blue to-deep-blue mx-auto mb-8"></div>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  {getContent('about_contact_description') || 'Ready to embark on your Nile adventure? Contact our team to start planning your journey.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
                  <CardContent>
                    <Phone className="w-12 h-12 text-ocean-blue mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ocean-blue mb-2">Phone</h3>
                    <p className="text-gray-700">
                      {getContent('about_contact_phone') || '+201001538358'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
                  <CardContent>
                    <Mail className="w-12 h-12 text-ocean-blue mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ocean-blue mb-2">Email</h3>
                    <p className="text-gray-700">
                      {getContent('about_contact_email') || 'info@cleopatradahabiya.com'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
                  <CardContent>
                    <MapPin className="w-12 h-12 text-ocean-blue mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ocean-blue mb-2">Address</h3>
                    <p className="text-gray-700">
                      {getContent('about_contact_address') || 'Luxor, Egypt'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </Container>
        </div>
      </main>
    </div>
  );
}
