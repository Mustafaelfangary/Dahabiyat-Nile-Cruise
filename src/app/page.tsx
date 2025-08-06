"use client";

import { Container, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { ChevronRight, Star, Users, Calendar, MapPin, RefreshCw, User, Clock } from 'lucide-react';
import {
  EgyptHieroglyphic,
  HieroglyphicDivider,
  FloatingEgyptianElements,
  EgyptianBorder,
  EGYPTIAN_CROWN_SYMBOLS,
  PharaohButton,
  PharaonicCard
} from '@/components/ui/pharaonic-elements';
import ShareYourMemories from '@/components/homepage/ShareYourMemories';
import FeaturedReviews from '@/components/homepage/FeaturedReviews';
import OptimizedHeroVideo from '@/components/OptimizedHeroVideo';

export default function HomePage() {
  const { getContent, loading, error } = useContent({ page: 'homepage' });
  const [dahabiyat, setDahabiyat] = useState([]);
  const [packages, setPackages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [featuredDahabiyat, setFeaturedDahabiyat] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fallback timeout to ensure loading overlay doesn't stay forever
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoLoaded && !videoError) {
        console.log('Video loading timeout - showing video anyway');
        setVideoLoaded(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [videoLoaded, videoError]);

  const [expandedSections, setExpandedSections] = useState({
    whatIs: false,
    whyDifferent: false,
    shareMemories: false,
    ourStory: false
  });

  // Helper function for content
  const get = (key: string, fallback = '') => {
    const result = getContent(key, fallback);
    if (key.includes('hero_video')) {
      console.log(`🎥 Homepage getting ${key}:`, result);
    }
    return result;
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

      // Fetch featured blogs
      const blogsResponse = await fetch(`/api/blogs${timestamp}`, cacheControl);
      if (blogsResponse.ok) {
        const blogsData = await blogsResponse.json();
        const publishedBlogs = blogsData.filter((blog: any) => blog.isPublished);
        const featuredBlogsData = publishedBlogs.filter((blog: any) => blog.featured);
        console.log('✅ Featured blogs:', featuredBlogsData.length);
        console.log('✅ Total blogs:', publishedBlogs.length);
        setBlogs(publishedBlogs);
        setFeaturedBlogs(featuredBlogsData);
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="pharaonic-text-brown text-lg">{get('loading_text', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pharaonic-container">

      {/* 1. Editable Video Hero Section - Full area touching navbar */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          marginTop: '-80px', // Negative margin to overlap with navbar
          height: '70vh', // Reduced height to not take up the full first page
          minHeight: '500px', // Reduced minimum height
          maxHeight: '800px' // Reduced maximum height
        }}
      >
        {/* Fallback background - only shows if video fails */}
        {videoError && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900"></div>
        )}

        {/* Fallback image when video fails */}
        {videoError && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-5"
            style={{
              backgroundImage: `url(${get('hero_video_poster', '/images/hero-bg.jpg')})`
            }}
          />
        )}

        {/* Optimized Hero Video */}
        <OptimizedHeroVideo
          src={get('hero_video_url', '/videos/home_hero_video.mp4')}
          poster={get('hero_video_poster', '/images/hero-video-poster.jpg')}
          className="absolute inset-0 w-full h-full z-10"
          onLoad={() => {
            setVideoError(false);
            setVideoLoaded(true);
          }}
          onError={() => {
            setVideoError(true);
            setVideoLoaded(false);
          }}
        />

        {/* Video Loading Overlay */}
        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 z-20 bg-cover bg-center bg-no-repeat flex items-center justify-center"
               style={{
                 backgroundImage: `url(${get('hero_video_poster', '/images/hero-video-poster.jpg')})`
               }}>
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative z-10 text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading Experience...</p>
            </div>
          </div>
        )}

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
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 text-sm sm:text-base md:text-lg hover:from-blue-700 hover:to-blue-800 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl">
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
      <section className="py-20 bg-gradient-to-b from-blue-50 to-blue-100 relative">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            {/* Hieroglyphic Section Divider */}
            <div className="mb-8">
              <HieroglyphicDivider />
            </div>

            <div className="flex items-center justify-center mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                <span className="text-blue-600 mr-3">{EGYPTIAN_CROWN_SYMBOLS.pschent}</span>
                {get('dahabiyat_section_title', 'Our Luxury Dahabiyat Nile Cruise Fleet')}
                <span className="text-blue-600 ml-3">{EGYPTIAN_CROWN_SYMBOLS.pschent}</span>
              </h2>
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="ml-4 p-2 text-blue-600 hover:text-blue-600/80 transition-colors"
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
                <span className="text-blue-600 text-sm">🔄 Refreshing dahabiyat data...</span>
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
                <span className="text-blue-600">✨ Showing {featuredDahabiyat.length} featured dahabiyat</span>
              ) : (
                <span>📋 Showing {Math.min(dahabiyat.length, 4)} dahabiyat</span>
              )}
              <span className="ml-2 text-xs">
                (Last updated: {new Date().toLocaleTimeString()})
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {(featuredDahabiyat.length > 0 ? featuredDahabiyat : dahabiyat.slice(0, 4)).map((dahabiya: any, index: number) => (
              <div key={dahabiya.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-200/20">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={dahabiya.mainImage || '/images/dahabiya-placeholder.jpg'}
                    alt={dahabiya.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Enhanced overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Capacity badge with enhanced design */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg backdrop-blur-sm">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                    {dahabiya.capacity || 12} {get('guests_label', 'Guests')}
                  </div>

                  {/* Featured badge */}
                  {featuredDahabiyat.length > 0 && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      <Star className="w-3 h-3 inline mr-1 fill-current" />
                      Featured
                    </div>
                  )}

                  {/* Hover overlay with Egyptian symbols */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-blue-600 text-4xl sm:text-5xl animate-pulse">𓇳</div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600 text-lg">𓊪</span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                      {dahabiya.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base leading-relaxed">
                    {dahabiya.shortDescription || 'Experience luxury and comfort aboard this magnificent dahabiya as you sail through the timeless waters of the Nile.'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600 font-medium">4.9</span>
                      <span className="ml-1 text-xs text-gray-400">(127)</span>
                    </div>
                    <Link href={`/dahabiyas/${dahabiya.slug || dahabiya.id}`}>
                      <Button className="bg-gradient-to-r from-blue-600/80 to-blue-700/80 text-white px-2 sm:px-3 py-1 text-xs hover:from-blue-600 hover:to-blue-700 rounded-md font-bold shadow-md hover:shadow-lg transition-all duration-300 group/btn border border-blue-600/30 backdrop-blur-sm">
                        <span className="group-hover/btn:mr-1 transition-all duration-300 text-xs">{get('view_details_text', 'View Details')}</span>
                        <span className="text-xs text-blue-200 ml-1">𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover/btn:opacity-100 transition-all duration-300" />
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
      <section className="py-20 bg-gradient-to-b from-blue-50 to-blue-100 relative">
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
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center mt-4"
                >
                  {expandedSections.whatIs ? get('read_less_text', 'Read Less') : get('read_more_text', 'Read More')}
                  <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${expandedSections.whatIs ? 'rotate-90' : ''}`} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={get('what_is_dahabiya_image_1', '/images/dahabiya-sailing.jpg')}
                    alt="Dahabiya sailing on the Nile"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={get('what_is_dahabiya_image_2', '/images/dahabiya-deck.jpg')}
                    alt="Dahabiya deck view"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={get('what_is_dahabiya_image_3', '/images/dahabiya-sunset.jpg')}
                  alt="Dahabiya at sunset"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Packages Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-blue-100 relative">
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
              <span className="text-blue-600 mr-2">𓇳</span>
              {get('packages_section_subtitle', 'Choose from our carefully crafted packages, each designed to showcase the best of Egypt\'s ancient wonders and natural beauty')}
              <span className="text-blue-600 ml-2">𓇳</span>
            </p>

            {/* Egyptian Border */}
            <div className="mt-8">
              <EgyptianBorder />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {(featuredPackages.length > 0 ? featuredPackages : packages.slice(0, 4)).map((pkg: any, index: number) => (
              <div key={pkg.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-200/20">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={pkg.mainImageUrl || '/images/package-placeholder.jpg'}
                    alt={pkg.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Enhanced overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Duration badge with enhanced design */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg backdrop-blur-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                    {pkg.durationDays} {get('days_label', 'Days')}
                  </div>

                  {/* Price badge with enhanced design */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg backdrop-blur-sm">
                    ${pkg.price?.toLocaleString()}
                  </div>

                  {/* Featured badge */}
                  {featuredPackages.length > 0 && (
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      <Star className="w-3 h-3 inline mr-1 fill-current" />
                      Featured
                    </div>
                  )}

                  {/* Hover overlay with Egyptian symbols */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-blue-600 text-4xl sm:text-5xl animate-pulse">𓊪</div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600 text-lg">𓇳</span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                      {pkg.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base leading-relaxed">
                    {pkg.shortDescription || 'Embark on an unforgettable journey through ancient Egypt with this carefully crafted package experience.'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600 font-medium">4.8</span>
                      <span className="ml-1 text-xs text-gray-400">(89)</span>
                    </div>
                    <Link href={`/packages/${pkg.id}`}>
                      <Button className="bg-gradient-to-r from-blue-600/80 to-blue-700/80 text-white px-2 sm:px-3 py-1 text-xs hover:from-blue-600 hover:to-blue-700 rounded-md font-bold shadow-md hover:shadow-lg transition-all duration-300 group/btn border border-blue-600/30 backdrop-blur-sm">
                        <span className="group-hover/btn:mr-1 transition-all duration-300 text-xs">{get('view_details_text', 'View Details')}</span>
                        <span className="text-xs text-blue-200 ml-1">𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/packages">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-lg hover:from-blue-700 hover:to-blue-800 rounded-full">
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
      <section className="py-20 bg-gradient-to-b from-blue-50 to-blue-100 relative">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={get('why_different_image_1', '/images/cruise-comparison-1.jpg')}
                    alt="Intimate Dahabiya experience"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={get('why_different_image_2', '/images/cruise-comparison-2.jpg')}
                    alt="Personalized service"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={get('why_different_image_3', '/images/cruise-comparison-3.jpg')}
                  alt="Exclusive access to sites"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
            <div>
              {/* Hieroglyphic Header */}
              <div className="mb-8">
                <div className="text-2xl text-blue-600 mb-4">
                  𓇯 𓊪 𓈖 𓂀 𓏏 𓇳
                </div>
                <HieroglyphicDivider />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                <span className="text-blue-600 mr-3">𓇳</span>
                {get('why_different_title', 'Why is Dahabiya different from regular Nile Cruises?')}
                <span className="text-blue-600 ml-3">𓇳</span>
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
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center mt-4"
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
      <section className="py-20 bg-gradient-to-b from-blue-50 to-blue-100">
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
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center mt-4"
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
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 hover:bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg">
                    Read Reviews
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={get('share_memories_image_1', '/images/guest-memories-1.jpg')}
                    alt="Guest enjoying sunset"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={get('share_memories_image_2', '/images/guest-memories-2.jpg')}
                    alt="Family on deck"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
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
      <section className="py-12 lg:py-20 bg-gradient-to-b from-blue-50 to-blue-100 relative">
        <Container maxWidth="lg">
          <div className="our-story-section">
            {/* Content First */}
            <div className="text-center lg:text-left mb-8 lg:mb-12">
              {/* Hieroglyphic Header */}
              <div className="mb-6 lg:mb-8">
                <div className="text-lg lg:text-2xl mb-4">
                  <span className="text-blue-600">𓇯</span> <span className="text-emerald-600">𓊪</span> <span className="text-blue-600">𓈖</span> <span className="text-yellow-600">𓂀</span> <span className="text-emerald-600">𓏏</span> <span className="text-blue-600">𓇳</span>
                </div>
                <HieroglyphicDivider />
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 lg:mb-6 mobile-section-title">
                <span className="text-blue-600 mr-2 lg:mr-3">{EGYPTIAN_CROWN_SYMBOLS.nemes}</span>
                {get('our_story_title', 'Our Story')}
                <span className="text-blue-600 ml-2 lg:ml-3">{EGYPTIAN_CROWN_SYMBOLS.nemes}</span>
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
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center lg:justify-start mt-4 mobile-button-text"
                >
                  {expandedSections.ourStory ? get('read_less_text', 'Read Less') : get('read_more_text', 'Read More')}
                  <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${expandedSections.ourStory ? 'rotate-90' : ''}`} />
                </button>
              </div>

              <div className="mt-6 lg:mt-8 text-center lg:text-left">
                <Link href="/about">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base hover:bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg mobile-button-text">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Enhanced Founder Image Section */}
            <div className="founder-image-section mt-16 lg:mt-20 relative z-10">
              <div className="max-w-sm mx-auto">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 rounded-2xl transform rotate-3 opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-50 rounded-2xl transform -rotate-2 opacity-40"></div>

                {/* Main Content Card */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-blue-200/50">
                  {/* Egyptian Decorative Elements */}
                  <div className="absolute top-3 left-3 text-blue-400 text-lg opacity-60">𓇳</div>
                  <div className="absolute top-3 right-3 text-blue-400 text-lg opacity-60">𓊪</div>
                  <div className="absolute bottom-3 left-3 text-blue-400 text-lg opacity-60">𓈖</div>
                  <div className="absolute bottom-3 right-3 text-blue-400 text-lg opacity-60">𓂀</div>

                  <div className="flex flex-col items-center space-y-4">
                    {/* Enhanced Founder Image */}
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 relative">
                        {/* Decorative Ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-1">
                          <div className="w-full h-full rounded-full bg-white p-1">
                            <Image
                              src={get('founder_image', '/images/ashraf-elmasry.jpg')}
                              alt={get('founder_name', 'Ashraf El-Masry')}
                              width={112}
                              height={112}
                              className="w-full h-full rounded-full object-cover object-center shadow-lg"
                              priority={false}
                              quality={95}
                              onError={(e) => {
                                e.currentTarget.src = '/images/our-story-founder.jpg';
                              }}
                            />
                          </div>
                        </div>

                        {/* Crown Icon */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <span className="text-white text-sm">👑</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Text Content */}
                    <div className="text-center space-y-2">
                      <h3 className="font-bold text-gray-800 text-lg lg:text-xl leading-tight">
                        {get('founder_name', 'Ashraf El-Masry')}
                      </h3>
                      <p className="text-blue-600 font-semibold text-sm lg:text-base">
                        {get('founder_title', 'Founder & CEO')}
                      </p>

                      {/* Decorative Divider */}
                      <div className="flex items-center justify-center space-x-2 pt-2">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-blue-400"></div>
                      </div>

                      {/* Quote or Tagline */}
                      <p className="text-gray-600 text-xs lg:text-sm italic leading-relaxed pt-2 max-w-xs">
                        {get('founder_quote', '"Preserving the ancient art of Nile navigation for future generations"')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Featured Blog Posts Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-6xl text-blue-600 animate-pulse">𓇳</div>
            <div className="absolute top-20 right-20 text-4xl text-blue-700 animate-pulse">𓊪</div>
            <div className="absolute bottom-20 left-20 text-5xl text-blue-600 animate-pulse">𓈖</div>
            <div className="absolute bottom-10 right-10 text-6xl text-blue-700 animate-pulse">𓂀</div>
          </div>

          <Container maxWidth="lg">
            <div className="text-center mb-16">
              {/* Hieroglyphic Section Divider */}
              <div className="mb-8">
                <HieroglyphicDivider />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                <span className="text-blue-600 mr-3">{EGYPTIAN_CROWN_SYMBOLS.atef}</span>
                {get('blog_section_title', 'Stories from the Nile')}
                <span className="text-blue-600 ml-3">{EGYPTIAN_CROWN_SYMBOLS.atef}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                <span className="text-emerald-600 mr-2">𓊪</span>
                {get('blog_section_subtitle', 'Discover the magic of Egypt through the eyes of our travelers and guides')}
                <span className="text-emerald-600 ml-2">𓊪</span>
              </p>
            </div>

            {/* Featured Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredBlogs.slice(0, 3).map((blog: any, index: number) => (
                <div key={blog.id} className="group">
                  <PharaonicCard className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <Link href={`/blog/${blog.slug}`}>
                      <div className="relative overflow-hidden">
                        <Image
                          src={blog.mainImageUrl || '/images/default-blog.jpg'}
                          alt={blog.title}
                          width={400}
                          height={250}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                            <span className="mr-1">⭐</span>
                            Featured
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {blog.author}
                          </div>
                          {blog.readTime && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {blog.readTime} min read
                            </div>
                          )}
                        </div>

                        <Button className="w-full bg-gradient-to-r from-blue-600/80 to-blue-700/80 text-white hover:from-blue-600 hover:to-blue-700 rounded-md font-bold shadow-md hover:shadow-lg transition-all duration-300 group/btn border border-blue-600/30 backdrop-blur-sm">
                          <span className="group-hover/btn:mr-1 transition-all duration-300">Read Story</span>
                          <span className="text-blue-200 ml-1">𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-all duration-300" />
                        </Button>
                      </div>
                    </Link>
                  </PharaonicCard>
                </div>
              ))}
            </div>

            {/* View All Blogs Button */}
            <div className="text-center">
              <Link href="/blog">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-lg hover:from-blue-700 hover:to-blue-800 rounded-full">
                  <span className="mr-2">𓇳</span>
                  {get('blog_view_all_text', 'Read All Stories')}
                  <span className="mx-2">𓇳</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* 9. Additional Business Sections */}

      {/* Safety & Certifications */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-blue-100 relative">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            {/* Hieroglyphic Section Divider */}
            <div className="mb-8">
              <HieroglyphicDivider />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              <span className="text-blue-600 mr-3">{EGYPTIAN_CROWN_SYMBOLS.hedjet}</span>
              {get('safety_title', 'Your Safety is Our Priority')}
              <span className="text-blue-600 ml-3">{EGYPTIAN_CROWN_SYMBOLS.hedjet}</span>
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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🛡️</span>
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
      <section className="py-20 bg-gradient-to-b from-blue-50 to-blue-100">
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
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-lg hover:bg-gradient-to-r from-blue-700 to-blue-800 rounded-full">
                  {get('cta_book_text', 'Book Your Journey')}
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-transparent border-2 border-blue-600 text-blue-600 px-8 py-4 text-lg hover:bg-gradient-to-r from-blue-600 to-blue-700 hover:text-white rounded-full">
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
