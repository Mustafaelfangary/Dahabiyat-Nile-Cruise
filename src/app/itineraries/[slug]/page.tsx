'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, Star, Clock, ChevronRight, Play, Download, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  meals: string[];
  activities: string[];
  optionalTours: string[];
}

interface ItineraryPricing {
  id: string;
  category: string;
  paxRange: string;
  price: number;
  singleSupplement?: number;
}

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
  childrenPolicy?: string;
  cancellationPolicy?: string;
  observations?: string;
  isActive: boolean;
  featured: boolean;
  days: ItineraryDay[];
  pricingTiers: ItineraryPricing[];
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

export default function ItineraryDetailPage() {
  const params = useParams();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPricingCategory, setSelectedPricingCategory] = useState('SILVER');

  useEffect(() => {
    if (params.slug) {
      fetchItinerary();
    }
  }, [params.slug]);

  const fetchItinerary = async () => {
    try {
      const response = await fetch(`/api/itineraries/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setItinerary(data);
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Loading Sacred Journey...</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">𓂀</div>
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Journey Not Found</h1>
          <p className="text-amber-600 mb-6">This sacred journey could not be found.</p>
          <PharaohButton onClick={() => window.location.href = '/itineraries'}>
            ← Back to All Journeys
          </PharaohButton>
        </div>
      </div>
    );
  }

  const pricingCategories = Array.from(new Set(itinerary.pricingTiers.map(tier => tier.category)));
  const selectedPricing = itinerary.pricingTiers.filter(tier => tier.category === selectedPricingCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {itinerary.heroImageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${itinerary.heroImageUrl})` }}
          ></div>
        )}
        <div className="absolute inset-0 bg-[url('/images/hieroglyphic-pattern.png')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-amber-200 text-2xl">𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿</span>
                <h1 className="text-4xl md:text-6xl font-bold">{itinerary.name}</h1>
                <span className="text-amber-200 text-2xl">𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿</span>
              </div>
              
              <p className="text-xl md:text-2xl mb-8 text-amber-100 leading-relaxed">
                {itinerary.shortDescription || itinerary.description}
              </p>

              {/* Quick Info */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  {itinerary.durationDays} Days
                </div>
                {itinerary.maxGuests && (
                  <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                    <Users className="w-5 h-5 mr-2" />
                    Up to {itinerary.maxGuests} Guests
                  </div>
                )}
                {itinerary.price && (
                  <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                    <Star className="w-5 h-5 mr-2" />
                    From ${itinerary.price}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <PharaohButton className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Journey Preview
                </PharaohButton>
                <PharaohButton className="bg-amber-500 hover:bg-amber-600 text-black">
                  <Download className="w-5 h-5 mr-2" />
                  Download Itinerary
                </PharaohButton>
                <PharaohButton className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book This Journey
                </PharaohButton>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold text-center text-amber-800 mb-12">
              ✨ Journey Highlights ✨
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {itinerary.highlights.map((highlight, index) => (
                <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                  <div className="flex items-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border-2 border-amber-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-black font-bold mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-amber-800 font-semibold">{highlight}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Daily Itinerary */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold text-center text-amber-800 mb-12">
              📅 Daily Royal Journey 📅
            </h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-8">
            {itinerary.days.map((day, index) => (
              <AnimatedSection key={day.id} animation="fade-up" delay={index * 100}>
                <Card className="overflow-hidden border-2 border-amber-200 hover:border-amber-400 transition-colors bg-white/90 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-black p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-amber-800 font-bold text-xl">
                        {day.dayNumber}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{day.title}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          {day.meals.map((meal, idx) => (
                            <span key={idx} className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                              {meal.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-6 leading-relaxed">{day.description}</p>
                    
                    {/* Activities */}
                    {day.activities.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-amber-800 mb-3">🏛️ Activities</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {day.activities.map((activity, idx) => (
                            <div key={idx} className="flex items-center">
                              <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                              <span className="text-gray-700">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Optional Tours */}
                    {day.optionalTours.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-amber-800 mb-3">⭐ Optional Tours</h4>
                        <div className="space-y-2">
                          {day.optionalTours.map((tour, idx) => (
                            <div key={idx} className="flex items-center bg-amber-50 rounded-lg p-3">
                              <Star className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                              <span className="text-gray-700">{tour}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {itinerary.pricingTiers.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-amber-100 to-orange-100">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up">
              <h2 className="text-4xl font-bold text-center text-amber-800 mb-12">
                💰 Pricing & Packages 💰
              </h2>

              {/* Category Selector */}
              <div className="flex justify-center mb-8">
                <div className="flex gap-2 bg-white rounded-lg p-2 border-2 border-amber-200">
                  {pricingCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedPricingCategory === category ? 'primary' : 'outline'}
                      onClick={() => setSelectedPricingCategory(category)}
                      className={selectedPricingCategory === category 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black' 
                        : 'border-amber-300 text-amber-800 hover:bg-amber-50'
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Pricing Table */}
              <div className="max-w-4xl mx-auto">
                <Card className="overflow-hidden border-2 border-amber-300">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-black p-4">
                    <h3 className="text-xl font-bold text-center">{selectedPricingCategory} Category Pricing</h3>
                  </div>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-amber-50">
                          <tr>
                            <th className="text-left p-4 font-bold text-amber-800">Group Size</th>
                            <th className="text-right p-4 font-bold text-amber-800">Price per Person</th>
                            <th className="text-right p-4 font-bold text-amber-800">Single Supplement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPricing.map((pricing, index) => (
                            <tr key={pricing.id} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-25'}>
                              <td className="p-4 font-semibold text-gray-800">{pricing.paxRange}</td>
                              <td className="p-4 text-right font-bold text-amber-600">${pricing.price}</td>
                              <td className="p-4 text-right text-gray-600">
                                {pricing.singleSupplement ? `$${pricing.singleSupplement}` : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Included/Not Included */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Included */}
            <AnimatedSection animation="fade-right">
              <Card className="h-full border-2 border-green-200 bg-green-50/50">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
                  <h3 className="text-2xl font-bold flex items-center">
                    <Check className="w-6 h-6 mr-2" />
                    What's Included
                  </h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {itinerary.included.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Not Included */}
            <AnimatedSection animation="fade-left">
              <Card className="h-full border-2 border-red-200 bg-red-50/50">
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6">
                  <h3 className="text-2xl font-bold flex items-center">
                    <X className="w-6 h-6 mr-2" />
                    What's Not Included
                  </h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {itinerary.notIncluded.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <X className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Begin This Royal Journey?
            </h2>
            <p className="text-xl mb-8 text-amber-100 max-w-2xl mx-auto">
              Let our expert guides lead you through this carefully crafted itinerary. 
              Create memories that will last a lifetime.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PharaohButton className="bg-white text-amber-800 hover:bg-amber-50">
                <Calendar className="w-5 h-5 mr-2" />
                Book This Journey
              </PharaohButton>
              <PharaohButton className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                <Users className="w-5 h-5 mr-2" />
                Contact Our Experts
              </PharaohButton>
              <PharaohButton 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => window.location.href = '/itineraries'}
              >
                <MapPin className="w-5 h-5 mr-2" />
                View All Journeys
              </PharaohButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
