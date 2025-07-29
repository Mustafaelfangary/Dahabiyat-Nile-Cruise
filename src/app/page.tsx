"use client";

import { Container, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { ChevronRight, Star, Users, Calendar, MapPin, RefreshCw } from 'lucide-react';
import {
  EgyptHieroglyphic,
  HieroglyphicDivider,
  FloatingEgyptianElements,
  EgyptianBorder,
  EGYPTIAN_CROWN_SYMBOLS,
  PharaohButton
} from '@/components/ui/pharaonic-elements';
import ShareYourMemories from '@/components/homepage/ShareYourMemories';
import FeaturedReviews from '@/components/homepage/FeaturedReviews';

export default function HomePage() {
  const { getContent, loading, error } = useContent({ page: 'homepage' });
  const [dahabiyat, setDahabiyat] = useState([]);
  const [packages, setPackages] = useState([]);
  const [featuredDahabiyat, setFeaturedDahabiyat] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    whatIs: false,
    whyDifferent: false,
    shareMemories: false,
    ourStory: false
  });

  // Helper function for content
  const get = (key: string, fallback = '') => {
    return getContent(key, fallback);
  };

  // Fetch dahabiyat and packages with cache busting
  const fetchData = async (bustCache = false, showLoading = false) => {
    try {
      if (showLoading) setRefreshing(true);

      const timestamp = bustCache ? `&_t=${Date.now()}` : '';
      const cacheControl = bustCache ? { cache: 'no-store' as RequestCache } : {};

      console.log('🔄 Fetching homepage data...', bustCache ? '(cache busted)' : '(cached)');

      // Fetch featured dahabiyas first
      const featuredDahabiyatResponse = await fetch(`/api/dahabiyas?active=true&limit=4${timestamp}`, cacheControl);
      if (featuredDahabiyatResponse.ok) {
        const featuredDahabiyatData = await featuredDahabiyatResponse.json();
        console.log('✅ Featured dahabiyas:', featuredDahabiyatData.dahabiyas?.length || 0);
        setFeaturedDahabiyat(featuredDahabiyatData.dahabiyas || []);
      }

      // Fetch featured packages
      const featuredPackagesResponse = await fetch(`/api/packages?featured=true&limit=4${timestamp}`, cacheControl);
      if (featuredPackagesResponse.ok) {
        const featuredPackagesData = await featuredPackagesResponse.json();
        console.log('✅ Featured packages:', featuredPackagesData.packages?.length || 0);
        setFeaturedPackages(featuredPackagesData.packages || []);
      }

      // Fetch regular content as fallback
      const dahabiyatResponse = await fetch(`/api/dahabiyas?active=true&limit=4${timestamp}`, cacheControl);
      if (dahabiyatResponse.ok) {
        const dahabiyatData = await dahabiyatResponse.json();
        console.log('✅ Regular dahabiyas:', dahabiyatData.dahabiyas?.length || 0);
        setDahabiyat(dahabiyatData.dahabiyas || []);
      }

      const packagesResponse = await fetch(`/api/packages?limit=4${timestamp}`, cacheControl);
      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json();
        console.log('✅ Regular packages:', packagesData.packages?.length || 0);
        setPackages(packagesData.packages || []);
      }
    } catch (error) {
      console.error('❌ Error fetching homepage data:', error);
    } finally {
      if (showLoading) setRefreshing(false);
    }
  };

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchData(true, true);
  };

  useEffect(() => {
    fetchData();

    // Set up periodic refresh every 30 seconds to catch updates
    const interval = setInterval(() => {
      fetchData(true); // Bust cache on periodic refresh
    }, 30000);

    // Listen for focus events to refresh when user returns to tab
    const handleFocus = () => {
      fetchData(true);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-egyptian-gold mx-auto mb-4"></div>
          <p className="pharaonic-text-brown text-lg">{get('loading_text', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pharaonic-container">
      {/* 1. Editable Video Hero Section - Full area touching navbar */}
      <section
        className="relative h-[50vh] md:h-[55vh] overflow-hidden w-full"
        style={{
          marginTop: '0', // No margin - touch navbar directly
          minHeight: '400px' // Reasonable height - not too tall
        }}
      >
        {/* Fallback background - only shows if video fails */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900"></div>

        {/* Fallback image when video fails */}
        {videoError && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-5"
            style={{
              backgroundImage: `url(${get('hero_video_poster', '/images/hero-bg.jpg')})`
            }}
          />
        )}

        {/* Background Video - Full coverage with minimal cropping */}
        <video
          className="absolute inset-0 w-full h-full z-10 brightness-110 contrast-105"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={get('hero_video_poster', '/images/hero-video-poster.jpg')}
          onError={() => {
            setVideoError(true);
          }}
          onCanPlay={() => {
            setVideoError(false);
            setVideoLoaded(true);
          }}
          onPlay={(e) => {
            const video = e.target as HTMLVideoElement;
            console.log('Video started playing:', {
              src: video.currentSrc || video.src,
              currentTime: video.currentTime
            });
          }}
          ref={(video) => {
            if (video) {
              console.log('Video element created:', {
                src: video.src,
                sources: Array.from(video.querySelectorAll('source')).map(s => s.src)
              });

              // Manually load the video
              video.load();

              // Try to play after a short delay, but handle autoplay failures gracefully
              setTimeout(() => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                  playPromise.catch(err => {
                    console.warn('Autoplay failed:', err);
                    // Video will just not autoplay, which is fine
                  });
                }
              }, 100);
            }
          }}
          src={get('hero_video_url', '/videos/home_hero_video.mp4')}
        >
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay - Reduced for brighter video */}
        <div className="absolute inset-0 bg-black/20 z-20"></div>

        {/* Loading indicator */}
        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
        )}





        {/* Floating Egyptian Elements */}
        <FloatingEgyptianElements />

        {/* Hero Content */}
        <div className="relative z-30 h-full flex items-center justify-center">
          <Container maxWidth="lg">
            <div className="text-center text-white px-4 py-2">
              {/* Larger Hero Content */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 drop-shadow-2xl leading-tight">
                <span className="inline-block mr-1 md:mr-2">𓇳</span>
                {get('hero_video_title', 'Experience the Magic of the Nile')}
                <span className="inline-block ml-1 md:ml-2">𓇳</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 max-w-2xl mx-auto drop-shadow-lg">
                <span className="inline-block mr-1">𓊪</span>
                {get('hero_video_subtitle', 'Luxury Dahabiya Cruises Through Ancient Egypt')}
                <span className="inline-block ml-1">𓊪</span>
              </p>
              <div className="flex justify-center">
                <Link href="/dahabiyas">
                  <Button className="bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown px-6 py-3 text-sm sm:text-base md:text-lg hover:from-egyptian-amber hover:to-orange-600 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <span className="mr-1">𓊪</span>
                    <span className="hidden sm:inline">{get('hero_video_cta_text', 'Explore Fleet')}</span>
                    <span className="sm:hidden">Explore</span>
                    <span className="mx-1">𓊪</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">{get('hero_scroll_text', 'Scroll to explore')}</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dahabiyat Cards Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50 relative">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            {/* Hieroglyphic Section Divider */}
            <div className="mb-8">
              <HieroglyphicDivider />
            </div>

            <div className="flex items-center justify-center mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                <span className="text-egyptian-gold mr-3">{EGYPTIAN_CROWN_SYMBOLS.pschent}</span>
                {get('dahabiyat_section_title', 'Our Luxury Dahabiyat Nile Cruise Fleet')}
                <span className="text-egyptian-gold ml-3">{EGYPTIAN_CROWN_SYMBOLS.pschent}</span>
              </h2>
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="ml-4 p-2 text-egyptian-gold hover:text-egyptian-gold/80 transition-colors"
                title="Refresh dahabiyat data"
              >
                <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <span className="text-emerald-600 mr-2">𓊪</span>
              {get('dahabiyat_section_subtitle', 'Discover our collection of traditional sailing vessels, each offering a unique journey through Egypt\'s timeless landscapes')}
              <span className="text-emerald-600 ml-2">𓊪</span>
            </p>
            {refreshing && (
              <div className="mt-4 text-center">
                <span className="text-egyptian-gold text-sm">🔄 Refreshing dahabiyat data...</span>
              </div>
            )}

            {/* Egyptian Border */}
            <div className="mt-8">
              <EgyptianBorder />
            </div>
          </div>

          {/* Data Source Indicator */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">
              {featuredDahabiyat.length > 0 ? (
                <span className="text-egyptian-gold">✨ Showing {featuredDahabiyat.length} featured dahabiyat</span>
              ) : (
                <span>📋 Showing {Math.min(dahabiyat.length, 4)} dahabiyat</span>
              )}
              <span className="ml-2 text-xs">
                (Last updated: {new Date().toLocaleTimeString()})
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(featuredDahabiyat.length > 0 ? featuredDahabiyat : dahabiyat.slice(0, 4)).map((dahabiya: any, index: number) => (
              <div key={dahabiya.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={dahabiya.mainImage || '/images/dahabiya-placeholder.jpg'}
                    alt={dahabiya.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown px-3 py-1 rounded-full text-sm font-semibold">
                    {dahabiya.capacity || 12} {get('guests_label', 'Guests')}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{dahabiya.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{dahabiya.shortDescription}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">4.9</span>
                    </div>
                    <Link href={`/dahabiyas/${dahabiya.slug || dahabiya.id}`}>
                      <Button className="bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown px-4 py-2 text-sm hover:from-egyptian-amber hover:to-orange-600 rounded-lg">
                        {get('view_details_text', 'View Details')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/dahabiyas">
              <Button className="bg-emerald-500 text-white px-8 py-4 text-lg hover:bg-emerald-600 rounded-full">
                <span className="mr-2">𓊪</span>
                {get('dahabiyat_view_all_text', 'View All Dahabiyat')}
                <span className="mx-2">𓊪</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. What is Dahabiya? Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50 relative">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Hieroglyphic Header */}
              <div className="mb-8">
                <div className="text-2xl text-emerald-600 mb-4">
                  𓇯 𓊪 𓈖 𓂀 𓏏 𓇳
                </div>
                <HieroglyphicDivider />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                <span className="text-emerald-600 mr-3">𓊪</span>
                {get('what_is_dahabiya_title', 'What is Dahabiya?')}
                <span className="text-emerald-600 ml-3">𓊪</span>
              </h2>
              <div className="text-gray-600 leading-relaxed">
                <p className={`mb-4 ${!expandedSections.whatIs ? 'line-clamp-3' : ''}`}>
                  {get('what_is_dahabiya_content', 'A Dahabiya is a traditional Egyptian sailing boat that has been navigating the Nile River for centuries. These elegant vessels, with their distinctive lateen sails and shallow draft, were once the preferred mode of transport for Egyptian nobility and wealthy travelers exploring the ancient wonders along the Nile.')}
                </p>
                {expandedSections.whatIs && (
                  <>
                    <p className="mb-4">
                      Unlike modern cruise ships, Dahabiyas offer an intimate and authentic experience, typically accommodating only 8-12 guests. This allows for personalized service and the flexibility to dock at smaller, less crowded sites that larger vessels cannot access.
                    </p>
                    <p className="mb-4">
                      The word "Dahabiya" comes from the Arabic word "dahab," meaning gold, reflecting the golden appearance of these boats as they glide across the Nile at sunset. Today's luxury Dahabiyas combine traditional design with modern amenities, offering air-conditioned cabins, gourmet dining, and expert guides.
                    </p>
                  </>
                )}
                <button
                  onClick={() => toggleSection('whatIs')}
                  className="text-egyptian-gold hover:text-sunset-orange font-semibold flex items-center mt-4"
                >
                  {expandedSections.whatIs ? get('read_less_text', 'Read Less') : get('read_more_text', 'Read More')}
                  <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${expandedSections.whatIs ? 'rotate-90' : ''}`} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={get('what_is_dahabiya_image_1', '/images/dahabiya-sailing.jpg')}
                    alt="Dahabiya sailing on the Nile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={get('what_is_dahabiya_image_2', '/images/dahabiya-deck.jpg')}
                    alt="Dahabiya deck view"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden">
                <Image
                  src={get('what_is_dahabiya_image_3', '/images/dahabiya-sunset.jpg')}
                  alt="Dahabiya at sunset"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Packages Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50 relative">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            {/* Hieroglyphic Section Divider */}
            <div className="mb-8">
              <HieroglyphicDivider />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              <span className="text-emerald-600 mr-3">{EGYPTIAN_CROWN_SYMBOLS.khepresh}</span>
              {get('packages_section_title', 'Our Journey Packages')}
              <span className="text-emerald-600 ml-3">{EGYPTIAN_CROWN_SYMBOLS.khepresh}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <span className="text-egyptian-gold mr-2">𓇳</span>
              {get('packages_section_subtitle', 'Choose from our carefully crafted packages, each designed to showcase the best of Egypt\'s ancient wonders and natural beauty')}
              <span className="text-egyptian-gold ml-2">𓇳</span>
            </p>

            {/* Egyptian Border */}
            <div className="mt-8">
              <EgyptianBorder />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(featuredPackages.length > 0 ? featuredPackages : packages.slice(0, 4)).map((pkg: any, index: number) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={pkg.mainImageUrl || '/images/package-placeholder.jpg'}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {pkg.durationDays} {get('days_label', 'Days')}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${pkg.price?.toLocaleString()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{pkg.shortDescription}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">4.8</span>
                    </div>
                    <Link href={`/packages/${pkg.id}`}>
                      <Button className="bg-emerald-500 text-white px-4 py-2 text-sm hover:bg-emerald-600 rounded-lg">
                        {get('view_details_text', 'View Package')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/packages">
              <Button className="bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown px-8 py-4 text-lg hover:from-egyptian-amber hover:to-orange-600 rounded-full">
                <span className="mr-2">𓇳</span>
                {get('packages_view_all_text', 'View All Packages')}
                <span className="mx-2">𓇳</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 5. Why is Dahabiya different? Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50 relative">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={get('why_different_image_1', '/images/cruise-comparison-1.jpg')}
                    alt="Intimate Dahabiya experience"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={get('why_different_image_2', '/images/cruise-comparison-2.jpg')}
                    alt="Personalized service"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden">
                <Image
                  src={get('why_different_image_3', '/images/cruise-comparison-3.jpg')}
                  alt="Exclusive access to sites"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              {/* Hieroglyphic Header */}
              <div className="mb-8">
                <div className="text-2xl text-egyptian-gold mb-4">
                  𓇯 𓊪 𓈖 𓂀 𓏏 𓇳
                </div>
                <HieroglyphicDivider />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                <span className="text-egyptian-gold mr-3">𓇳</span>
                {get('why_different_title', 'Why is Dahabiya different from regular Nile Cruises?')}
                <span className="text-egyptian-gold ml-3">𓇳</span>
              </h2>
              <div className="text-gray-600 leading-relaxed">
                <p className={`mb-4 ${!expandedSections.whyDifferent ? 'line-clamp-3' : ''}`}>
                  {get('why_different_content', 'While traditional Nile cruise ships can accommodate 200-400 passengers, Dahabiyas offer an intimate experience with only 8-12 guests. This fundamental difference creates a completely different travel experience that feels more like a private yacht charter than a commercial cruise.')}
                </p>
                {expandedSections.whyDifferent && (
                  <>
                    <p className="mb-4">
                      Dahabiyas can access smaller docking sites and hidden gems that large cruise ships cannot reach. You'll visit less crowded temples, enjoy private beach picnics, and have the flexibility to adjust your itinerary based on your interests and the weather conditions.
                    </p>
                    <p className="mb-4">
                      The pace is more relaxed and authentic. Instead of rushing through scheduled activities with hundreds of other tourists, you'll have time to truly absorb the ancient atmosphere, engage with local communities, and enjoy personalized attention from your dedicated crew and guide.
                    </p>
                  </>
                )}
                <button
                  onClick={() => toggleSection('whyDifferent')}
                  className="text-egyptian-gold hover:text-egyptian-gold font-semibold flex items-center mt-4"
                >
                  {expandedSections.whyDifferent ? get('read_less_text', 'Read Less') : get('read_more_text', 'Read More')}
                  <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${expandedSections.whyDifferent ? 'rotate-90' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Share your memories Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Hieroglyphic Header */}
              <div className="mb-8">
                <div className="text-2xl text-emerald-600 mb-4">
                  𓇯 𓊪 𓈖 𓂀 𓏏 𓇳
                </div>
                <HieroglyphicDivider />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                <span className="text-emerald-600 mr-3">{EGYPTIAN_CROWN_SYMBOLS.atef}</span>
                {get('share_memories_title', 'Share your memories with us')}
                <span className="text-emerald-600 ml-3">{EGYPTIAN_CROWN_SYMBOLS.atef}</span>
              </h2>
              <div className="text-gray-600 leading-relaxed">
                <p className={`mb-4 ${!expandedSections.shareMemories ? 'line-clamp-3' : ''}`}>
                  {get('share_memories_content', 'Your journey with us doesn\'t end when you disembark. We believe that the memories created during your Dahabiya experience are meant to be shared and cherished forever. Join our community of travelers who have fallen in love with the magic of the Nile.')}
                </p>
                {expandedSections.shareMemories && (
                  <>
                    <p className="mb-4">
                      Share your photos, stories, and experiences on social media using #DahabiyaMemories. We love seeing how our guests capture the beauty of ancient Egypt and the unique moments that make each journey special.
                    </p>
                    <p className="mb-4">
                      {/* Extended text - not in database yet, using fallback */}
                      Many of our guests become part of our extended family, returning year after year and bringing friends and family to experience the same magic. We encourage you to share your testimonials and help others discover the authentic way to explore the Nile.
                    </p>
                  </>
                )}
                <button
                  onClick={() => toggleSection('shareMemories')}
                  className="text-egyptian-gold hover:text-egyptian-gold font-semibold flex items-center mt-4"
                >
                  {expandedSections.shareMemories ? get('read_less_text', 'Read Less') : get('read_more_text', 'Read More')}
                  <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${expandedSections.shareMemories ? 'rotate-90' : ''}`} />
                </button>
              </div>
              <div className="mt-8">
                <Link href="/gallery">
                  <Button className="bg-emerald-500 text-white px-6 py-3 hover:bg-emerald-600 rounded-lg mr-4">
                    View Gallery
                  </Button>
                </Link>
                <Link href="/testimonials">
                  <Button className="bg-gradient-to-r from-egyptian-gold to-sunset-orange text-white px-6 py-3 hover:bg-gradient-to-r from-egyptian-gold to-sunset-orange rounded-lg">
                    Read Reviews
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={get('share_memories_image_1', '/images/guest-memories-1.jpg')}
                    alt="Guest enjoying sunset"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={get('share_memories_image_2', '/images/guest-memories-2.jpg')}
                    alt="Family on deck"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden">
                <Image
                  src={get('share_memories_image_3', '/images/guest-memories-3.jpg')}
                  alt="Couple at temple"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6.5. Dynamic Share Your Memories Section */}
      <ShareYourMemories />

      {/* 6.7. Featured Reviews Section */}
      <FeaturedReviews />

      {/* 7. Our Story Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-amber-50 to-orange-50 relative">
        <Container maxWidth="lg">
          <div className="our-story-section">
            {/* Content First */}
            <div className="text-center lg:text-left mb-8 lg:mb-12">
              {/* Hieroglyphic Header */}
              <div className="mb-6 lg:mb-8">
                <div className="text-lg lg:text-2xl mb-4">
                  <span className="text-egyptian-gold">𓇯</span> <span className="text-emerald-600">𓊪</span> <span className="text-egyptian-gold">𓈖</span> <span className="text-yellow-600">𓂀</span> <span className="text-emerald-600">𓏏</span> <span className="text-egyptian-gold">𓇳</span>
                </div>
                <HieroglyphicDivider />
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 lg:mb-6 mobile-section-title">
                <span className="text-egyptian-gold mr-2 lg:mr-3">{EGYPTIAN_CROWN_SYMBOLS.nemes}</span>
                {get('our_story_title', 'Our Story')}
                <span className="text-egyptian-gold ml-2 lg:ml-3">{EGYPTIAN_CROWN_SYMBOLS.nemes}</span>
              </h2>

              <div className="text-gray-600 leading-relaxed text-sm lg:text-base mobile-text-wrap">
                <p className={`mb-4 ${!expandedSections.ourStory ? 'line-clamp-3' : ''}`}>
                  {get('our_story_content', 'Our journey began over 30 years ago when Captain Ahmed Hassan, a third-generation Nile navigator, had a vision to revive the authentic way of exploring Egypt\'s ancient wonders. Growing up along the banks of the Nile, he witnessed the transformation of river travel and felt called to preserve the traditional Dahabiya experience.')}
                </p>
                {expandedSections.ourStory && (
                  <>
                    {get('our_story_paragraph_2') && (
                      <p className="mb-4">
                        {get('our_story_paragraph_2')}
                      </p>
                    )}
                    {get('our_story_paragraph_3') && (
                      <p className="mb-4">
                        {get('our_story_paragraph_3')}
                      </p>
                    )}
                    {get('our_story_paragraph_4') && (
                      <p className="mb-4">
                        {get('our_story_paragraph_4')}
                      </p>
                    )}
                  </>
                )}
                <button
                  onClick={() => toggleSection('ourStory')}
                  className="text-egyptian-gold hover:text-egyptian-gold font-semibold flex items-center justify-center lg:justify-start mt-4 mobile-button-text"
                >
                  {expandedSections.ourStory ? get('read_less_text', 'Read Less') : get('read_more_text', 'Read More')}
                  <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${expandedSections.ourStory ? 'rotate-90' : ''}`} />
                </button>
              </div>

              <div className="mt-6 lg:mt-8 text-center lg:text-left">
                <Link href="/about">
                  <Button className="bg-gradient-to-r from-egyptian-gold to-sunset-orange text-white px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base hover:bg-gradient-to-r from-egyptian-gold to-sunset-orange rounded-lg mobile-button-text">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Founder Image Below Content */}
            <div className="founder-image-section text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg">
              <div className="relative w-32 h-32 lg:w-48 lg:h-48 mx-auto mb-4 lg:mb-6 ring-4 ring-egyptian-gold/20">
                <Image
                  src={get('founder_image', '/images/our-story-founder.jpg')}
                  alt="Our founder"
                  fill
                  className="object-cover rounded-full shadow-lg"
                />
              </div>
              <h3 className="text-lg lg:text-2xl font-bold text-gray-800 mb-1 lg:mb-2 mobile-card-title">{get('founder_name', 'Captain Ahmed Hassan')}</h3>
              <p className="text-gray-600 text-sm lg:text-base mobile-subtitle">{get('founder_title', 'Founder & Master Navigator')}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Additional Business Sections */}

      {/* Safety & Certifications */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50 relative">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            {/* Hieroglyphic Section Divider */}
            <div className="mb-8">
              <HieroglyphicDivider />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              <span className="text-egyptian-gold mr-3">{EGYPTIAN_CROWN_SYMBOLS.hedjet}</span>
              {get('safety_title', 'Your Safety is Our Priority')}
              <span className="text-egyptian-gold ml-3">{EGYPTIAN_CROWN_SYMBOLS.hedjet}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <span className="text-emerald-600 mr-2">𓊪</span>
              {get('safety_subtitle', 'All our Dahabiyas are certified and regularly inspected to ensure the highest safety standards')}
              <span className="text-emerald-600 ml-2">𓊪</span>
            </p>

            {/* Egyptian Border */}
            <div className="mt-8">
              <EgyptianBorder />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-egyptian-gold to-sunset-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-egyptian-gold text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Certified Vessels</h3>
              <p className="text-gray-600">All our Dahabiyas are certified by Egyptian Maritime Authority and undergo regular safety inspections.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Medical Support</h3>
              <p className="text-gray-600">Trained crew members and medical facilities available, with quick access to hospitals when needed.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">📡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">24/7 Communication</h3>
              <p className="text-gray-600">Satellite communication systems ensure we're always connected for emergencies and support.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <Container maxWidth="lg">
          <div className="text-center text-gray-800">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {get('cta_title', 'Ready to Begin Your Journey?')}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
              {get('cta_description', 'Contact us today to start planning your unforgettable Dahabiya adventure on the Nile')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-egyptian-gold to-sunset-orange text-white px-8 py-4 text-lg hover:bg-gradient-to-r from-egyptian-gold to-sunset-orange rounded-full">
                  {get('cta_book_text', 'Book Your Journey')}
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-transparent border-2 border-egyptian-gold text-egyptian-gold px-8 py-4 text-lg hover:bg-gradient-to-r from-egyptian-gold to-sunset-orange hover:text-white rounded-full">
                  {get('cta_contact_text', 'Contact Us')}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
