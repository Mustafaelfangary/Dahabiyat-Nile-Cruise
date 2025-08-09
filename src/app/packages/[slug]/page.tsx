"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Container, Typography, Box, Card, CardContent, Grid, Chip } from '@mui/material';
import { AnimatedSection, StaggeredAnimation } from '@/components/ui/animated-section';
import { Star, Users, Calendar, MapPin, Anchor, Crown, Sparkles, Ship, Award, Heart, Shield, Clock, Package as PackageIcon } from 'lucide-react';
import Link from 'next/link';
import {
  HieroglyphicText,
  EgyptianBorder,
  ObeliskContainer,
  PharaohCard,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  RoyalCrown,
  PharaohButton,
  HieroglyphicDivider,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';
import { PackageBookingForm } from '@/components/PackageBookingForm';

interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  mainImageUrl?: string;
  price: number;
  durationDays: number;
  maxGuests?: number;
  highlights: string[];
  included: string[];
  excluded: string[];
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    caption?: string;
  }>;
  itineraryDays: Array<{
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    author: string;
    date: string;
  }>;
}

export default function IndividualPackagePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/packages/${slug}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Package not found');
        }

        const data = await response.json();
        setPackageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load package');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPackage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ocean-blue mx-auto mb-4"></div>
          <div className="text-ocean-blue text-2xl font-bold">𓇳 Loading Royal Journey 𓇳</div>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-ocean-blue text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-ocean-blue font-bold text-xl">Royal Journey Not Found 𓏏</p>
          <Link href="/packages">
            <PharaohButton variant="primary" className="mt-4">
              Return to Packages
            </PharaohButton>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = packageData.reviews?.length 
    ? packageData.reviews.reduce((sum, review) => sum + review.rating, 0) / packageData.reviews.length 
    : 0;

  return (
    <div className="pharaonic-container relative overflow-hidden">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Egyptian Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={packageData.mainImageUrl || '/images/default-package.jpg'}
            alt={`${packageData.name} - Pharaonic Journey`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/40 via-navy-blue/30 to-deep-blue/40"></div>

          {/* Animated blue particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-ocean-blue/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white">
              {/* Hieroglyphic Egypt at top */}
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-blue-300 mb-4 drop-shadow-lg">
                  𓎢 𓃭 𓅂 𓅱 𓄿
                </div>
                <HieroglyphicDivider />
              </div>

              {/* Royal Crown */}
              <div className="flex justify-center mb-6">
                <RoyalCrown />
              </div>

              {/* Main Title */}
              <HieroglyphicText
                text={packageData.name}
                className="text-5xl md:text-7xl font-bold mb-6 text-blue-100 drop-shadow-2xl"
              />

              {/* Subtitle */}
              <Typography
                variant="h4"
                className="text-2xl md:text-3xl mb-8 text-blue-200 font-light drop-shadow-lg"
              >
                𓎢 Royal Egyptian Adventure 𓎢
              </Typography>

              {/* Key Stats */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-400/30">
                  <Clock className="w-5 h-5 text-blue-300 mr-2" />
                  <span className="text-blue-100 font-medium">{packageData.durationDays} Days</span>
                </div>
                <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-400/30">
                  <Users className="w-5 h-5 text-blue-300 mr-2" />
                  <span className="text-blue-100 font-medium">Up to {packageData.maxGuests || 'N/A'} Guests</span>
                </div>
                <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-400/30">
                  <Star className="w-5 h-5 text-blue-300 mr-2" />
                  <span className="text-blue-100 font-medium">{averageRating.toFixed(1)} Rating</span>
                </div>
              </div>

              {/* Description in Enhanced Container */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-black/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-8 shadow-2xl">
                  <p className="text-xl md:text-2xl leading-relaxed text-blue-50 font-light">
                    {packageData.description}
                  </p>
                </div>
              </div>

              {/* Price Display */}
              <div className="mb-8">
                <div className="bg-black/30 backdrop-blur-sm border border-blue-400/50 rounded-2xl p-6 inline-block">
                  <div className="text-blue-200 text-lg mb-2">Starting from</div>
                  <div className="text-blue-100 text-4xl font-bold">${packageData.price}</div>
                  <div className="text-blue-300 text-sm">per person</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <PharaohButton
                  variant="primary"
                  onClick={() => {
                    const bookingSection = document.getElementById('booking-section');
                    if (bookingSection) {
                      bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <PackageIcon className="w-6 h-6" />
                  Book Royal Journey
                </PharaohButton>
                <PharaohButton
                  variant="secondary"
                  onClick={() => {
                    const itinerarySection = document.getElementById('itinerary-section');
                    if (itinerarySection) {
                      itinerarySection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <Crown className="w-6 h-6" />
                  View Itinerary
                </PharaohButton>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Package Details Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50/30 relative">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-16">
              <HieroglyphicText
                text="Royal Journey Details"
                className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4"
              />
              <HieroglyphicDivider />
              <p className="text-xl text-ocean-blue-dark max-w-3xl mx-auto">
                Discover the magnificent details of this pharaonic adventure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Highlights */}
              <div>
                <PharaohCard className="h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Crown className="w-8 h-8 text-ocean-blue mr-3" />
                      <Typography variant="h5" className="font-bold text-ocean-blue">
                        Journey Highlights
                      </Typography>
                    </div>

                    <div className="space-y-3">
                      {packageData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start">
                          <Star className="w-5 h-5 text-ocean-blue mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-ocean-blue-dark">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </PharaohCard>
              </div>

              {/* Included & Excluded */}
              <div>
                <PharaohCard className="h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Shield className="w-8 h-8 text-ocean-blue mr-3" />
                      <Typography variant="h5" className="font-bold text-ocean-blue">
                        What's Included
                      </Typography>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-ocean-blue-dark font-semibold mb-2">Included:</h4>
                        <div className="space-y-2">
                          {packageData.included.map((item, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                              <span className="text-ocean-blue-dark text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {packageData.excluded.length > 0 && (
                        <div>
                          <h4 className="text-ocean-blue-dark font-semibold mb-2">Not Included:</h4>
                          <div className="space-y-2">
                            {packageData.excluded.map((item, index) => (
                              <div key={index} className="flex items-start">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                <span className="text-ocean-blue-dark text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </PharaohCard>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="py-20 bg-gradient-to-b from-blue-50/30 to-slate-50 relative">
        <Container maxWidth="lg">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-16">
              <HieroglyphicText
                text="Book Your Royal Adventure"
                className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4"
              />
              <HieroglyphicDivider />
              <p className="text-xl text-ocean-blue-dark max-w-3xl mx-auto">
                Reserve your place on this magnificent pharaonic journey
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <PackageBookingForm 
                packageId={packageData.id}
                packageName={packageData.name}
                basePrice={packageData.price}
                durationDays={packageData.durationDays}
                maxGuests={packageData.maxGuests || 10}
              />
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}
