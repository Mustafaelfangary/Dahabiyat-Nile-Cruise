'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, Star, Clock, ChevronRight, Play, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '@/hooks/useContent';

interface Itinerary {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  durationDays: number;
  mainImageUrl?: string;
  heroImageUrl?: string;
  videoUrl?: string;
  price?: number;
  maxGuests?: number;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const PharaohButton = ({ children, className = '', ...props }: any) => (
  <Button
    className={`relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
    {...props}
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
  </Button>
);

const AnimatedSection = ({ children, animation = 'fade-up', delay = 0 }: any) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      y: animation === 'fade-up' ? 50 : 0,
      x: animation === 'fade-left' ? -50 : animation === 'fade-right' ? 50 : 0 
    }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    transition={{ duration: 0.8, delay: delay / 1000 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

export default function ItinerariesPage() {
  const { getContent, loading: contentLoading } = useContent({ page: 'itineraries' });
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const getSettingValue = (key: string, defaultValue: string = '') => {
    return getContent(key, defaultValue);
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await fetch('/api/itineraries');
      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItineraries = itineraries.filter(itinerary => {
    if (filter === 'all') return itinerary.isActive;
    if (filter === 'featured') return itinerary.featured && itinerary.isActive;
    if (filter === 'short') return itinerary.durationDays <= 5 && itinerary.isActive;
    if (filter === 'long') return itinerary.durationDays > 7 && itinerary.isActive;
    return itinerary.isActive;
  });

  if (loading || contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">{getSettingValue('itineraries_loading_text', 'Loading Journeys...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white overflow-hidden min-h-screen">
        {/* Hero Background Image with Enhanced Effects */}
        {getSettingValue('itineraries_hero_background_image') && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-slow-zoom"
            style={{
              backgroundImage: `url("${getSettingValue('itineraries_hero_background_image', '/images/itineraries-hero-bg.jpg')}")`,
              filter: 'brightness(1.4) contrast(1.5) saturate(1.6)',
            }}
          ></div>
        )}

        {/* Enhanced Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-transparent to-red-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/15 via-transparent to-cyan-900/15"></div>
        <div className="absolute inset-0 bg-[url('/images/hieroglyphic-pattern.png')] opacity-10 animate-pulse"></div>


        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-shadow-lg" style={{
                background: 'linear-gradient(45deg, #FFD700, #FF4500, #FF1493, #00CED1, #9370DB, #FFD700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '3px 3px 6px rgba(0,0,0,0.4)'
              }}>
                <span style={{ color: '#FFE4B5' }}>𓂋𓏤𓈖𓇋𓆎𓏏𓂻</span> {getSettingValue('itineraries_hero_title', 'Itineraries')}
              </h1>
              <p className="text-xl md:text-2xl mb-4 leading-relaxed" style={{
                color: '#FFE4B5',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {getSettingValue('itineraries_hero_subtitle', 'Discover Ancient Egypt Through Carefully Crafted Journeys')}
              </p>
              <p className="text-lg mb-8 leading-relaxed max-w-3xl mx-auto" style={{
                color: '#F0E68C',
                textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
              }}>
                {getSettingValue('itineraries_hero_description', 'Explore our collection of meticulously planned itineraries, each designed to immerse you in the wonders of pharaonic Egypt while ensuring comfort and authenticity.')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <PharaohButton className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                  <Play className="w-5 h-5 mr-2" />
                  {getSettingValue('itineraries_hero_cta_text', 'Explore Journeys')}
                </PharaohButton>
                <PharaohButton className="bg-amber-500 hover:bg-amber-600 text-black">
                  <Download className="w-5 h-5 mr-2" />
                  Download Brochure
                </PharaohButton>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white/80 backdrop-blur-sm border-b border-amber-200">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { key: 'all', label: getSettingValue('itineraries_filter_all_text', 'All Journeys'), icon: MapPin },
                { key: 'featured', label: getSettingValue('itineraries_filter_featured_text', 'Featured'), icon: Star },
                { key: 'short', label: getSettingValue('itineraries_filter_short_text', 'Short (≤5 days)'), icon: Clock },
                { key: 'long', label: getSettingValue('itineraries_filter_long_text', 'Extended (7+ days)'), icon: Calendar }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={filter === key ? 'default' : 'outline'}
                  onClick={() => setFilter(key)}
                  className={`${
                    filter === key 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black border-amber-400' 
                      : 'border-amber-300 text-amber-800 hover:bg-amber-50'
                  } font-semibold py-2 px-6 rounded-full transition-all duration-300`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Itineraries Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredItineraries.length === 0 ? (
            <AnimatedSection animation="fade-up">
              <div className="text-center py-16">
                <div className="text-6xl mb-4">𓂀</div>
                <h3 className="text-2xl font-bold text-amber-800 mb-4">{getSettingValue('itineraries_empty_title', 'No Journeys Found')}</h3>
                <p className="text-amber-600">{getSettingValue('itineraries_empty_description', 'Our pharaonic scholars are crafting new itineraries. Please check back soon for extraordinary journeys.')}</p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItineraries.map((itinerary, index) => (
                <AnimatedSection key={itinerary.id} animation="fade-up" delay={index * 100}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-2 border-amber-200 hover:border-amber-400 overflow-hidden">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={itinerary.mainImageUrl || '/images/default-itinerary.jpg'}
                        alt={itinerary.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Featured Badge */}
                      {itinerary.featured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ Featured
                        </div>
                      )}
                      
                      {/* Duration Badge */}
                      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {itinerary.durationDays} Days
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-amber-800 mb-3 group-hover:text-amber-600 transition-colors">
                        {itinerary.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {itinerary.shortDescription || itinerary.description}
                      </p>

                      {/* Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        {itinerary.maxGuests && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Up to {itinerary.maxGuests}
                          </div>
                        )}
                        {itinerary.price && (
                          <div className="font-semibold text-amber-600">
                            From ${itinerary.price}
                          </div>
                        )}
                      </div>

                      {/* Highlights */}
                      {itinerary.highlights.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {itinerary.highlights.slice(0, 3).map((highlight, idx) => (
                              <span key={idx} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                {highlight}
                              </span>
                            ))}
                            {itinerary.highlights.length > 3 && (
                              <span className="text-amber-600 text-xs">+{itinerary.highlights.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <PharaohButton 
                          className="flex-1 text-sm"
                          onClick={() => window.location.href = `/itineraries/${itinerary.slug || itinerary.id}`}
                        >
                          Explore Journey
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </PharaohButton>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              {getSettingValue('itineraries_cta_title', 'Start Your Journey')}
            </h2>
            <p className="text-xl mb-8 text-amber-100 max-w-2xl mx-auto" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              {getSettingValue('itineraries_cta_description', 'Choose from our blessed itineraries and embark on a transformative journey through the eternal wonders of ancient Egypt.')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PharaohButton className="bg-white text-amber-800 hover:bg-amber-50">
                <Calendar className="w-5 h-5 mr-2" />
                {getSettingValue('itineraries_cta_primary_text', 'Book Journey')}
              </PharaohButton>
              <PharaohButton className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                <Users className="w-5 h-5 mr-2" />
                {getSettingValue('itineraries_cta_secondary_text', 'Custom Itinerary')}
              </PharaohButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
