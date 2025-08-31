'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useContent } from '@/hooks/useContent';
import { Container } from '@/components/ui/container';
import { AnimatedSection } from '@/components/ui/animated-section';
import OptimizedHeroVideo from '@/components/OptimizedHeroVideo';
import {
  EgyptianPatternBackground,
  FloatingEgyptianElements,
  PharaohCard,
  PharaohButton,
  HieroglyphicDivider,
  EgyptHieroglyphic,
  RoyalCrown,
} from '@/components/ui/pharaonic-elements';
import { Calendar, Coins, BookOpen, Ship, Crown } from 'lucide-react';

// Helper to parse JSON content blocks safely
function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const data = JSON.parse(raw);
    return data as T;
  } catch (e) {
    console.warn('Invalid JSON in content block, using fallback.');
    return fallback;
  }
}

// Types for dynamic tables
interface ScheduleItem {
  id?: string;
  dahabiyaName?: string;
  destination?: string;
  routes?: string;
  itinerary?: string;
  day?: string;
  date?: string;
  minPrice?: string;
  // Legacy fields for backward compatibility
  nights?: number;
  departureDay?: string;
  route?: string; // e.g., Luxor → Aswan
  season?: string; // e.g., High/Low or specific period
  dates?: string; // freeform dates or range text
  notes?: string;
}

interface RateItem {
  itinerary?: string;
  nights?: number;
  cabinType?: string; // e.g., Standard Cabin / Suite
  season?: string;
  pricePerPerson?: string; // e.g., 1350 USD
  inclusions?: string[]; // bullet points
}

export default function ScheduleAndRatesPage() {
  const { data: session } = useSession();
  const { getContent, loading, error } = useContent({ page: 'schedule-and-rates' });

  // Fallback sample data (admin can replace via content JSON blocks)
  const scheduleFallback: ScheduleItem[] = [
    {
      itinerary: 'Luxor → Aswan',
      nights: 4,
      departureDay: 'Monday',
      route: 'Luxor → Esna → Edfu → Kom Ombo → Aswan',
      season: 'High Season',
      dates: 'Oct–Apr (weekly departures)',
    },
    {
      itinerary: 'Aswan → Luxor',
      nights: 3,
      departureDay: 'Friday',
      route: 'Aswan → Kom Ombo → Edfu → Esna → Luxor',
      season: 'High Season',
      dates: 'Oct–Apr (weekly departures)',
    },
  ];

  const ratesFallback: RateItem[] = [
    {
      itinerary: 'Luxor → Aswan',
      nights: 4,
      cabinType: 'Standard Cabin (per person twin share)',
      season: 'High',
      pricePerPerson: 'USD 1,350',
      inclusions: ['Full board meals', 'Sightseeing with guide', 'All taxes'],
    },
    {
      itinerary: 'Aswan → Luxor',
      nights: 3,
      cabinType: 'Standard Cabin (per person twin share)',
      season: 'High',
      pricePerPerson: 'USD 1,050',
      inclusions: ['Full board meals', 'Sightseeing with guide', 'All taxes'],
    },
  ];

  const scheduleData = useMemo(
    () => parseJson<ScheduleItem[]>(getContent('schedule_table_json'), scheduleFallback),
    [getContent]
  );

  const ratesData = useMemo(
    () => parseJson<RateItem[]>(getContent('rates_table_json'), ratesFallback),
    [getContent]
  );

  if (loading) {
    return (
      <div className="pharaonic-container min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RoyalCrown className="w-16 h-16 text-ocean-blue mx-auto mb-6 animate-pulse" />
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-ocean-blue mx-auto mb-6"></div>
          <EgyptHieroglyphic className="mx-auto mb-4" size="3rem" />
          <p className="text-ocean-blue-dark font-bold text-xl">Loading Schedule & Rates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pharaonic-container min-h-screen flex items-center justify-center">
        <div className="text-center">
          <EgyptHieroglyphic className="mx-auto mb-4" size="3rem" />
          <p className="text-red-600 font-bold text-xl">Failed to load content: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pharaonic-container">
      {/* Background Egyptian theme */}
      <EgyptianPatternBackground className="opacity-10" />
      <FloatingEgyptianElements />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <OptimizedHeroVideo
            src={getContent('schedule_hero_video', '/videos/schedule-hero.mp4')}
            poster={getContent('schedule_hero_image', '/images/hero-bg.jpg')}
            className="absolute inset-0 w-full h-full"
            onError={() => {
              // Fallback to image if video fails
              console.log('Video failed, using fallback image');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/60 via-navy-blue/40 to-ocean-blue/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white">
              <EgyptHieroglyphic className="mx-auto mb-4" size="3rem" />
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-white drop-shadow-2xl mb-4">
                {getContent('schedule_hero_title', 'Schedule & Rates')}
              </h1>
              <HieroglyphicDivider className="mx-auto mb-6" />
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-blue-100">
                {getContent(
                  'schedule_hero_subtitle',
                  'Plan your sacred Nile journey with our current sailing schedule and transparent rates.'
                )}
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <PharaohButton className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  {getContent('schedule_cta_primary', 'Check Availability')}
                </PharaohButton>
                <PharaohButton className="bg-ocean-blue hover:bg-ocean-blue-dark text-white">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {getContent('schedule_cta_secondary', 'Contact Our Experts')}
                </PharaohButton>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Intro */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-10">
              <div className="text-6xl font-bold text-amber-600 mb-4 drop-shadow-lg">𓈎𓃭𓇋𓍯𓊪𓄿</div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-ocean-blue via-deep-blue to-navy-blue bg-clip-text text-transparent mb-3">
                {getContent('schedule_intro_title', 'Sailing Schedule & Seasonal Journeys')}
              </h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                {getContent(
                  'schedule_intro_text',
                  'We offer weekly departures with thoughtfully curated itineraries between Luxor and Aswan. Explore the schedule and current rates below.'
                )}
              </p>
            </div>
          </AnimatedSection>

          {/* Schedule Table */}
          <AnimatedSection animation="slide-up" delay={150}>
            <PharaohCard className="overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 flex items-center">
                    <Ship className="w-6 h-6 mr-2 text-ocean-blue" />
                    {getContent('schedule_table_title', 'Current Sailing Schedule')}
                  </h3>
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-amber-200 border border-amber-300 rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-b-2 border-amber-300">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r border-amber-200">
                          <span className="flex items-center">
                            <span className="mr-2 text-amber-700">𓊪</span>
                            Itinerary
                          </span>
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r border-amber-200">
                          <span className="flex items-center">
                            <span className="mr-2 text-amber-700">𓇳</span>
                            Nights
                          </span>
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r border-amber-200">
                          <span className="flex items-center">
                            <span className="mr-2 text-amber-700">𓊃</span>
                            Departure Day
                          </span>
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r border-amber-200">
                          <span className="flex items-center">
                            <span className="mr-2 text-amber-700">𓈖</span>
                            Route
                          </span>
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r border-amber-200">
                          <span className="flex items-center">
                            <span className="mr-2 text-amber-700">𓊽</span>
                            Season
                          </span>
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-amber-900 uppercase tracking-wider">
                          <span className="flex items-center">
                            <span className="mr-2 text-amber-700">𓊨</span>
                            Dates
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gradient-to-b from-white to-amber-50/30 divide-y divide-amber-100">
                      {scheduleData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 transition-all duration-300 border-b border-amber-100">
                          <td className="px-4 py-4 text-gray-800 font-semibold border-r border-amber-100">
                            <span className="flex items-center">
                              <span className="mr-2 text-ocean-blue">𓊪</span>
                              {row.itinerary || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700 border-r border-amber-100">
                            <span className="flex items-center">
                              <span className="mr-2 text-emerald-600">𓇳</span>
                              {row.nights ?? '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700 border-r border-amber-100">
                            <span className="flex items-center">
                              <span className="mr-2 text-deep-blue">𓊃</span>
                              {row.departureDay || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700 border-r border-amber-100">
                            <span className="flex items-center">
                              <span className="mr-2 text-navy-blue">𓈖</span>
                              {row.route || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700 border-r border-amber-100">
                            <span className="flex items-center">
                              <span className="mr-2 text-amber-600">𓊽</span>
                              {row.season || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700">
                            <span className="flex items-center">
                              <span className="mr-2 text-red-600">𓊨</span>
                              {row.dates || '-'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </PharaohCard>
          </AnimatedSection>
        </Container>
      </section>

      {/* New Enhanced Schedule Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <Container maxWidth="xl">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-12">
              <div className="text-8xl font-bold text-amber-600 mb-6 drop-shadow-2xl animate-pulse">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-4">
                {getContent('schedule_section_title', 'Royal Dahabiya Schedule')}
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-yellow-600 mx-auto rounded-full mb-4"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the majestic journey schedules of our royal fleet along the eternal Nile
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="slide-up" delay={200}>
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-3xl p-8 shadow-2xl border-4 border-amber-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-amber-900 flex items-center">
                  <Ship className="w-8 h-8 mr-3 text-amber-700" />
                  <span className="mr-3">𓊪</span>
                  Royal Fleet Schedule
                  <span className="ml-3">𓊪</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <Crown className="w-6 h-6 text-amber-600 animate-bounce" />
                  <span className="text-2xl text-amber-700">𓇳</span>
                </div>
              </div>
              
              <div className="overflow-x-auto rounded-2xl shadow-xl">
                <table className="min-w-full bg-white rounded-2xl overflow-hidden border-4 border-amber-300">
                  <thead className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border-b-4 border-amber-400">
                    <tr>
                      <th className="px-6 py-5 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r-2 border-amber-300">
                        <div className="flex items-center justify-center">
                          <span className="mr-2 text-xl text-amber-700">𓊪</span>
                          <span>Dahabiya Name</span>
                          <span className="ml-2 text-xl text-amber-700">𓊪</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r-2 border-amber-300">
                        <div className="flex items-center justify-center">
                          <span className="mr-2 text-xl text-amber-700">𓈖</span>
                          <span>Destination</span>
                          <span className="ml-2 text-xl text-amber-700">𓈖</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r-2 border-amber-300">
                        <div className="flex items-center justify-center">
                          <span className="mr-2 text-xl text-amber-700">𓇳</span>
                          <span>Routes</span>
                          <span className="ml-2 text-xl text-amber-700">𓇳</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r-2 border-amber-300">
                        <div className="flex items-center justify-center">
                          <span className="mr-2 text-xl text-amber-700">𓊃</span>
                          <span>Itinerary</span>
                          <span className="ml-2 text-xl text-amber-700">𓊃</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r-2 border-amber-300">
                        <div className="flex items-center justify-center">
                          <span className="mr-2 text-xl text-amber-700">𓊨</span>
                          <span>Day</span>
                          <span className="ml-2 text-xl text-amber-700">𓊨</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-amber-900 uppercase tracking-wider border-r-2 border-amber-300">
                        <div className="flex items-center justify-center">
                          <span className="mr-2 text-xl text-amber-700">𓊽</span>
                          <span>Date</span>
                          <span className="ml-2 text-xl text-amber-700">𓊽</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-amber-900 uppercase tracking-wider">
                        <div className="flex items-center justify-center">
                          <span className="mr-2 text-xl text-amber-700">𓋹</span>
                          <span>Min Price</span>
                          <span className="ml-2 text-xl text-amber-700">𓋹</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gradient-to-b from-white via-amber-50/20 to-yellow-50/30 divide-y-2 divide-amber-200">
                    {scheduleData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gradient-to-r hover:from-amber-100 hover:to-yellow-100 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-lg">
                        <td className="px-6 py-5 text-gray-800 font-bold border-r-2 border-amber-200">
                          <div className="flex items-center">
                            <span className="mr-3 text-xl text-ocean-blue animate-pulse">𓊪</span>
                            <span className="bg-gradient-to-r from-ocean-blue to-deep-blue bg-clip-text text-transparent font-bold">
                              {row.dahabiyaName || 'Cleopatra Royal'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-700 font-semibold border-r-2 border-amber-200">
                          <div className="flex items-center">
                            <span className="mr-3 text-xl text-emerald-600">𓈖</span>
                            <span>{row.destination || 'Luxor - Aswan'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-700 font-semibold border-r-2 border-amber-200">
                          <div className="flex items-center">
                            <span className="mr-3 text-xl text-deep-blue">𓇳</span>
                            <span>{row.routes || 'Royal Nile Route'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-700 font-semibold border-r-2 border-amber-200">
                          <div className="flex items-center">
                            <span className="mr-3 text-xl text-navy-blue">𓊃</span>
                            <span>{row.itinerary || '7 Days Pharaonic Journey'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-700 font-semibold border-r-2 border-amber-200">
                          <div className="flex items-center">
                            <span className="mr-3 text-xl text-purple-600">𓊨</span>
                            <span>{row.day || 'Saturday'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-700 font-semibold border-r-2 border-amber-200">
                          <div className="flex items-center">
                            <span className="mr-3 text-xl text-red-600">𓊽</span>
                            <span>{row.date || '2024-12-15'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-900 font-bold">
                          <div className="flex items-center">
                            <span className="mr-3 text-xl text-emerald-600 animate-pulse">𓋹</span>
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent text-lg font-bold">
                              ${row.minPrice || '2,500'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-amber-200 to-yellow-200 px-6 py-3 rounded-full shadow-lg">
                  <span className="text-2xl text-amber-700">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</span>
                  <span className="text-amber-900 font-bold">Royal Nile Experience Awaits</span>
                  <span className="text-2xl text-amber-700">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Rates Section */}
      <section className="py-16">
        <Container maxWidth="lg">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-10">
              <div className="text-6xl font-bold text-amber-600 mb-4 drop-shadow-lg">𓇳𓂀𓏏</div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-ocean-blue via-deep-blue to-navy-blue bg-clip-text text-transparent mb-3">
                {getContent('rates_section_title', 'Rates & Inclusions')}
              </h2>
              <HieroglyphicDivider className="mx-auto" />
            </div>
          </AnimatedSection>

          <AnimatedSection animation="slide-up" delay={150}>
            <PharaohCard className="overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 flex items-center">
                    <Coins className="w-6 h-6 mr-2 text-emerald-600" />
                    {getContent('rates_table_title', 'Current Cruise Rates (Per Person)')}
                  </h3>
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-emerald-200 border border-emerald-300 rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100 border-b-2 border-emerald-300">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-bold text-emerald-900 uppercase tracking-wider border-r border-emerald-200">
                          <span className="flex items-center">
                            <span className="mr-2 text-emerald-700">𓊪</span>
                            Itinerary
                          </span>
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-emerald-900 uppercase tracking-wider border-r border-emerald-200">
                          <span className="flex items-center">
                            <span className="mr-2 text-emerald-700">𓇳</span>
                            Nights
                          </span>
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-emerald-900 uppercase tracking-wider border-r border-emerald-200">
                          <span className="flex items-center">
                            <span className="mr-2 text-emerald-700">𓊽</span>
                            Cabin/Suite
                          </span>
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-emerald-900 uppercase tracking-wider border-r border-emerald-200">
                          <span className="flex items-center">
                            <span className="mr-2 text-emerald-700">𓊨</span>
                            Season
                          </span>
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-emerald-900 uppercase tracking-wider border-r border-emerald-200">
                          <span className="flex items-center">
                            <span className="mr-2 text-emerald-700">𓋹</span>
                            Rate
                          </span>
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-emerald-900 uppercase tracking-wider">
                          <span className="flex items-center">
                            <span className="mr-2 text-emerald-700">𓊃</span>
                            Inclusions
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gradient-to-b from-white to-emerald-50/30 divide-y divide-emerald-100">
                      {ratesData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 border-b border-emerald-100">
                          <td className="px-4 py-4 text-gray-800 font-semibold border-r border-emerald-100">
                            <span className="flex items-center">
                              <span className="mr-2 text-ocean-blue">𓊪</span>
                              {row.itinerary || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700 border-r border-emerald-100">
                            <span className="flex items-center">
                              <span className="mr-2 text-amber-600">𓇳</span>
                              {row.nights ?? '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700 border-r border-emerald-100">
                            <span className="flex items-center">
                              <span className="mr-2 text-deep-blue">𓊽</span>
                              {row.cabinType || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700 border-r border-emerald-100">
                            <span className="flex items-center">
                              <span className="mr-2 text-navy-blue">𓊨</span>
                              {row.season || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-900 font-bold border-r border-emerald-100">
                            <span className="flex items-center">
                              <span className="mr-2 text-emerald-600">𓋹</span>
                              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                {row.pricePerPerson || '-'}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700">
                            {row.inclusions && row.inclusions.length > 0 ? (
                              <ul className="space-y-1">
                                {row.inclusions.map((inc, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="mr-2 text-emerald-500 text-sm">𓊃</span>
                                    <span className="text-sm">{inc}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="flex items-center">
                                <span className="mr-2 text-gray-400">𓊃</span>
                                -
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {getContent('rates_notes_text') && (
                  <div className="mt-6 text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-4">
                    {getContent('rates_notes_text')}
                  </div>
                )}
              </div>
            </PharaohCard>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection animation="fade-in" delay={250}>
            <div className="mt-12 text-center">
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                {getContent(
                  'schedule_rates_cta_text',
                  'Ready to embark on a royal journey? Check availability or ask our Egypt experts for tailored advice.'
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PharaohButton className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  {getContent('schedule_rates_cta_primary', 'Book Your Dates')}
                </PharaohButton>
                <PharaohButton className="bg-ocean-blue hover:bg-ocean-blue-dark text-white">
                  <Crown className="w-5 h-5 mr-2" />
                  {getContent('schedule_rates_cta_secondary', 'Request a Custom Quote')}
                </PharaohButton>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}
