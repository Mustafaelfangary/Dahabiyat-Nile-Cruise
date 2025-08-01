"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Chip, Grid } from '@mui/material';
import { AnimatedSection, StaggeredAnimation } from '@/components/ui/animated-section';
import { Star, Users, Calendar, MapPin, Clock, Package as PackageIcon, Crown, Sparkles, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  RoyalCrown,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  HieroglyphicDivider,
  PharaohCard,
  PharaohButton,
  EgyptianBorder,
  ObeliskContainer,
  HieroglyphicText
} from '@/components/ui/pharaonic-elements';
import { PackageBookingForm } from '@/components/PackageBookingForm';

interface PackageData {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  durationDays: number;
  maxGuests?: number;
  highlights: string[];
  included: string[];
  excluded: string[];
  mainImageUrl: string;
  images: Array<{ id: string; url: string; alt?: string; caption?: string }>;
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

interface UnifiedPackagePageProps {
  packageSlug: string;
  packageName: string;
  style?: 'pharaonic' | 'enhanced' | 'modern';
  showBookingForm?: boolean;
  showItinerary?: boolean;
  showReviews?: boolean;
  showGallery?: boolean;
}

export default function UnifiedPackagePage({
  packageSlug,
  packageName,
  style = 'pharaonic',
  showBookingForm = true,
  showItinerary = true,
  showReviews = true,
  showGallery = true
}: UnifiedPackagePageProps) {
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/packages/${packageSlug}`, {
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

    if (packageSlug) {
      loadPackage();
    }
  }, [packageSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <div className="text-amber-800 text-2xl font-bold">
            {style === 'pharaonic' ? '𓇳 Loading Royal Journey 𓇳' : 'Loading Package...'}
          </div>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          {style === 'pharaonic' && <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>}
          <p className="text-amber-800 font-bold text-xl">
            {style === 'pharaonic' ? 'Royal Journey Not Found 𓏏' : 'Package Not Found'}
          </p>
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

  // Render different styles based on the style prop
  const renderHeroSection = () => {
    if (style === 'pharaonic') {
      return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={packageData.mainImageUrl || '/images/default-package.jpg'}
              alt={`${packageData.name} - Pharaonic Journey`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-orange-800/30 to-amber-900/40"></div>
          </div>

          <Container maxWidth="lg" className="relative z-10">
            <AnimatedSection animation="fade-in">
              <div className="text-center text-white">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-amber-300 mb-4 drop-shadow-lg">
                    𓇳 𓈖 𓊪 𓏏 𓇳
                  </div>
                  <HieroglyphicDivider />
                </div>

                <div className="flex justify-center mb-6">
                  <RoyalCrown size="large" />
                </div>

                <HieroglyphicText 
                  text={packageData.name}
                  className="text-5xl md:text-7xl font-bold mb-6 text-amber-100 drop-shadow-2xl"
                />

                <Typography 
                  variant="h4" 
                  className="text-2xl md:text-3xl mb-8 text-amber-200 font-light drop-shadow-lg"
                >
                  𓊪 Royal Egyptian Adventure 𓊪
                </Typography>

                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                    <Clock className="w-5 h-5 text-amber-300 mr-2" />
                    <span className="text-amber-100 font-medium">{packageData.durationDays} Days</span>
                  </div>
                  <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                    <Users className="w-5 h-5 text-amber-300 mr-2" />
                    <span className="text-amber-100 font-medium">Up to {packageData.maxGuests || 'N/A'} Guests</span>
                  </div>
                  <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                    <Star className="w-5 h-5 text-amber-300 mr-2" />
                    <span className="text-amber-100 font-medium">{averageRating.toFixed(1)} Rating</span>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto mb-12">
                  <div className="bg-black/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8 shadow-2xl">
                    <p className="text-xl md:text-2xl leading-relaxed text-amber-50 font-light">
                      {packageData.description}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="bg-black/30 backdrop-blur-sm border border-amber-400/50 rounded-2xl p-6 inline-block">
                    <div className="text-amber-200 text-lg mb-2">Starting from</div>
                    <div className="text-amber-100 text-4xl font-bold">${packageData.price}</div>
                    <div className="text-amber-300 text-sm">per person</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <PharaohButton variant="primary">
                    <PackageIcon className="w-6 h-6" />
                    Book Royal Journey
                  </PharaohButton>
                  <PharaohButton variant="secondary">
                    <Crown className="w-6 h-6" />
                    View Itinerary
                  </PharaohButton>
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </section>
      );
    }

    // Enhanced/Modern style hero
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={packageData.mainImageUrl || '/images/default-package.jpg'}
            alt={packageData.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white">
              <Typography variant="h1" className="text-5xl md:text-7xl font-bold mb-6">
                {packageData.name}
              </Typography>
              
              <Typography variant="h4" className="text-2xl md:text-3xl mb-8 font-light">
                Egyptian Adventure Package
              </Typography>

              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{packageData.durationDays} Days</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Up to {packageData.maxGuests || 'N/A'} Guests</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <Star className="w-5 h-5 mr-2" />
                  <span>{averageRating.toFixed(1)} Rating</span>
                </div>
              </div>

              <div className="max-w-4xl mx-auto mb-12">
                <p className="text-xl md:text-2xl leading-relaxed">
                  {packageData.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                  <div className="text-lg mb-2">Starting from</div>
                  <div className="text-4xl font-bold">${packageData.price}</div>
                  <div className="text-sm">per person</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  variant="contained"
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    const bookingSection = document.getElementById('booking-section');
                    if (bookingSection) {
                      bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Book Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => {
                    const itinerarySection = document.getElementById('itinerary-section');
                    if (itinerarySection) {
                      itinerarySection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  View Itinerary
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    );
  };

  return (
    <div className={`pharaonic-container relative overflow-hidden`}>
      {style === 'pharaonic' && (
        <>
          <EgyptianPatternBackground className="opacity-5" />
          <FloatingEgyptianElements />
        </>
      )}

      {/* Hero Section */}
      {renderHeroSection()}

      {/* Package Details Section */}
      <section className={`py-20 ${style === 'pharaonic' ? 'bg-gradient-to-b from-slate-50 to-amber-50/30' : 'bg-white'} relative`}>
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-16">
              {style === 'pharaonic' ? (
                <>
                  <HieroglyphicText 
                    text="Royal Journey Details"
                    className="text-4xl md:text-5xl font-bold text-amber-800 mb-4"
                  />
                  <HieroglyphicDivider />
                </>
              ) : (
                <Typography variant="h2" className="text-4xl font-bold text-gray-800 mb-4">
                  Package Details
                </Typography>
              )}
              <p className={`text-xl ${style === 'pharaonic' ? 'text-amber-700' : 'text-gray-600'} max-w-3xl mx-auto`}>
                Discover the magnificent details of this adventure
              </p>
            </div>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                {style === 'pharaonic' ? (
                  <PharaohCard className="h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <Crown className="w-8 h-8 text-amber-600 mr-3" />
                        <Typography variant="h5" className="font-bold text-amber-800">
                          Journey Highlights
                        </Typography>
                      </div>
                      <div className="space-y-3">
                        {packageData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start">
                            <Star className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-amber-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </PharaohCard>
                ) : (
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <Typography variant="h5" className="font-bold mb-6">Highlights</Typography>
                      <div className="space-y-3">
                        {packageData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start">
                            <Star className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                {style === 'pharaonic' ? (
                  <PharaohCard className="h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <Shield className="w-8 h-8 text-amber-600 mr-3" />
                        <Typography variant="h5" className="font-bold text-amber-800">
                          What's Included
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-amber-700 font-semibold mb-2">Included:</h4>
                          <div className="space-y-2">
                            {packageData.included.map((item, index) => (
                              <div key={index} className="flex items-start">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                <span className="text-amber-700 text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {packageData.excluded.length > 0 && (
                          <div>
                            <h4 className="text-amber-700 font-semibold mb-2">Not Included:</h4>
                            <div className="space-y-2">
                              {packageData.excluded.map((item, index) => (
                                <div key={index} className="flex items-start">
                                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                  <span className="text-amber-700 text-sm">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </PharaohCard>
                ) : (
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <Typography variant="h5" className="font-bold mb-6">What's Included</Typography>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Included:</h4>
                          <div className="space-y-2">
                            {packageData.included.map((item, index) => (
                              <div key={index} className="flex items-start">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {packageData.excluded.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Not Included:</h4>
                            <div className="space-y-2">
                              {packageData.excluded.map((item, index) => (
                                <div key={index} className="flex items-start">
                                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                  <span className="text-sm">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>
          </AnimatedSection>
        </Container>
      </section>

      {/* Booking Section */}
      {showBookingForm && (
        <section className={`py-20 ${style === 'pharaonic' ? 'bg-gradient-to-b from-amber-50/30 to-slate-50' : 'bg-gray-50'} relative`}>
          <Container maxWidth="lg">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-16">
                {style === 'pharaonic' ? (
                  <>
                    <HieroglyphicText 
                      text="Book Your Royal Adventure"
                      className="text-4xl md:text-5xl font-bold text-amber-800 mb-4"
                    />
                    <HieroglyphicDivider />
                  </>
                ) : (
                  <Typography variant="h2" className="text-4xl font-bold text-gray-800 mb-4">
                    Book Your Adventure
                  </Typography>
                )}
                <p className={`text-xl ${style === 'pharaonic' ? 'text-amber-700' : 'text-gray-600'} max-w-3xl mx-auto`}>
                  Reserve your place on this magnificent journey
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <PackageBookingForm 
                  packageId={packageData.id}
                  packageName={packageData.name}
                  basePrice={packageData.price}
                  durationDays={packageData.durationDays}
                  maxGuests={packageData.maxGuests}
                />
              </div>
            </AnimatedSection>
          </Container>
        </section>
      )}
    </div>
  );
}
