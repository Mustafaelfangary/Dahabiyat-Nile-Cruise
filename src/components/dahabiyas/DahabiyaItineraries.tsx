'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  ChevronRight, 
  Sunrise, 
  Sun, 
  Sunset,
  Moon,
  Utensils,
  Camera,
  Ship,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Coordinates {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  location?: string;
  activities: string[];
  meals: string[];
  coordinates?: Coordinates;
}

interface Itinerary {
  id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  durationDays: number;
  mainImageUrl?: string;
  price?: number;
  maxGuests?: number;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  days: ItineraryDay[];
}

interface DahabiyaItinerariesProps {
  dahabiyaId: string;
  dahabiyaName: string;
}

export default function DahabiyaItineraries({ dahabiyaId, dahabiyaName }: DahabiyaItinerariesProps) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    fetchItineraries();
  }, [dahabiyaId]);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dahabiyas/${dahabiyaId}/itineraries`);
      if (response.ok) {
        const data = await response.json();
        setItineraries(data.itineraries || []);
        if (data.itineraries?.length > 0) {
          setSelectedItinerary(data.itineraries[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group itineraries by nights
  const groupedItineraries = itineraries.reduce((acc, itinerary) => {
    const nights = itinerary.durationDays - 1;
    const key = `${nights} Night${nights !== 1 ? 's' : ''}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(itinerary);
    return acc;
  }, {} as Record<string, Itinerary[]>);

  const getMealIcon = (meal: string) => {
    const mealLower = meal.toLowerCase();
    if (mealLower.includes('breakfast')) return <Sunrise className="w-4 h-4 text-ocean-blue" />;
    if (mealLower.includes('lunch')) return <Sun className="w-4 h-4 text-blue-500" />;
    if (mealLower.includes('dinner')) return <Sunset className="w-4 h-4 text-ocean-blue-dark" />;
    return <Utensils className="w-4 h-4 text-gray-500" />;
  };

  const getTimeIcon = (dayNumber: number) => {
    if (dayNumber === 1) return <Sunrise className="w-5 h-5 text-ocean-blue" />;
    if (dayNumber <= 3) return <Sun className="w-5 h-5 text-blue-500" />;
    if (dayNumber <= 5) return <Sunset className="w-5 h-5 text-ocean-blue-dark" />;
    return <Moon className="w-5 h-5 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <div className="text-center py-16">
        <Ship className="w-16 h-16 text-amber-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-amber-800 mb-2">No Itineraries Available</h3>
        <p className="text-amber-600">Itineraries for this dahabiya are being prepared.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-800 mb-4 flex items-center justify-center gap-2">
          <Crown className="w-8 h-8 text-amber-600" />
          Available Journeys for {dahabiyaName}
        </h2>
        <p className="text-amber-700 max-w-2xl mx-auto">
          Choose from our carefully crafted itineraries, each offering a unique perspective on the timeless wonders of the Nile.
        </p>
      </div>

      {/* Itinerary Categories by Nights */}
      <Tabs defaultValue={Object.keys(groupedItineraries)[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-auto bg-amber-100 p-1 rounded-xl">
          {Object.keys(groupedItineraries).map((nightCategory) => (
            <TabsTrigger 
              key={nightCategory} 
              value={nightCategory}
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white font-semibold"
            >
              {nightCategory}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedItineraries).map(([nightCategory, categoryItineraries]) => (
          <TabsContent key={nightCategory} value={nightCategory} className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Itinerary Selection */}
              <div className="lg:col-span-1">
                <h3 className="text-xl font-bold text-amber-800 mb-4">{nightCategory} Journeys</h3>
                <div className="space-y-4">
                  {categoryItineraries.map((itinerary) => (
                    <Card 
                      key={itinerary.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedItinerary?.id === itinerary.id 
                          ? 'ring-2 ring-amber-500 bg-amber-50' 
                          : 'hover:bg-blue-50'
                      }`}
                      onClick={() => {
                        setSelectedItinerary(itinerary);
                        setSelectedDay(1);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-amber-800 line-clamp-2">{itinerary.name}</h4>
                          <Badge variant="secondary" className="bg-amber-200 text-amber-800">
                            {itinerary.durationDays}D
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {itinerary.shortDescription || itinerary.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {itinerary.durationDays} days
                          </div>
                          {itinerary.maxGuests && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Max {itinerary.maxGuests}
                            </div>
                          )}
                          {itinerary.price && (
                            <div className="font-semibold text-amber-600">
                              ${itinerary.price}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Selected Itinerary Details */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {selectedItinerary && (
                    <motion.div
                      key={selectedItinerary.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-2 border-amber-200">
                        <CardContent className="p-6">
                          <div className="mb-6">
                            <h3 className="text-2xl font-bold text-amber-800 mb-2">
                              {selectedItinerary.name}
                            </h3>
                            <p className="text-gray-700 mb-4">
                              {selectedItinerary.description}
                            </p>
                            
                            {/* Highlights */}
                            {selectedItinerary.highlights.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-amber-700 mb-2">Journey Highlights:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedItinerary.highlights.slice(0, 4).map((highlight, index) => (
                                    <Badge key={index} variant="outline" className="border-amber-300 text-amber-700">
                                      <Star className="w-3 h-3 mr-1" />
                                      {highlight}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Day-by-Day Itinerary */}
                          <div>
                            <h4 className="text-xl font-bold text-amber-800 mb-4">Day-by-Day Journey</h4>
                            
                            {/* Day Navigation */}
                            <div className="flex flex-wrap gap-2 mb-6">
                              {selectedItinerary.days.map((day) => (
                                <Button
                                  key={day.id}
                                  variant={selectedDay === day.dayNumber ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setSelectedDay(day.dayNumber)}
                                  className={`${
                                    selectedDay === day.dayNumber 
                                      ? 'bg-amber-600 hover:bg-blue-700' 
                                      : 'border-amber-300 text-amber-700 hover:bg-blue-50'
                                  }`}
                                >
                                  {getTimeIcon(day.dayNumber)}
                                  <span className="ml-1">Day {day.dayNumber}</span>
                                </Button>
                              ))}
                            </div>

                            {/* Selected Day Details */}
                            <AnimatePresence mode="wait">
                              {selectedItinerary.days
                                .filter(day => day.dayNumber === selectedDay)
                                .map((day) => (
                                  <motion.div
                                    key={day.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Card className="bg-gradient-to-br from-ocean-blue-50 to-navy-blue-50 border-2 border-amber-300 shadow-xl">
                                      <CardContent className="p-8">
                                        <div className="flex items-start gap-6 mb-6">
                                          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                            {day.dayNumber}
                                          </div>
                                          <div className="flex-1">
                                            <h5 className="text-2xl font-bold text-amber-800 mb-2 leading-tight">
                                              {day.title}
                                            </h5>
                                            {day.location && (
                                              <div className="flex items-center gap-2 text-amber-600 mb-3">
                                                <MapPin className="w-5 h-5" />
                                                <span className="text-base font-semibold">{day.location}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <p className="text-gray-800 mb-6 leading-relaxed text-base font-medium">
                                          {day.description}
                                        </p>

                                        {/* Activities - BIGGER & CLEARER */}
                                        {day.activities.length > 0 && (
                                          <div className="mb-6">
                                            <h6 className="font-bold text-amber-700 mb-4 flex items-center gap-2 text-lg">
                                              <Camera className="w-5 h-5" />
                                              Activities
                                            </h6>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                              {day.activities.map((activity, index) => (
                                                <div key={index} className="flex items-center gap-3 text-base text-gray-700 font-medium">
                                                  <ChevronRight className="w-4 h-4 text-amber-500" />
                                                  {activity}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Meals - BIGGER & CLEARER */}
                                        {day.meals.length > 0 && (
                                          <div>
                                            <h6 className="font-bold text-amber-700 mb-4 flex items-center gap-2 text-lg">
                                              <Utensils className="w-5 h-5" />
                                              Meals Included
                                            </h6>
                                            <div className="flex flex-wrap gap-3">
                                              {day.meals.map((meal, index) => (
                                                <Badge key={index} variant="secondary" className="bg-white border-2 border-amber-300 px-4 py-2 text-base font-semibold">
                                                  {getMealIcon(meal)}
                                                  <span className="ml-2">{meal}</span>
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                ))}
                            </AnimatePresence>
                          </div>

                          {/* Book This Itinerary Button - BIGGER */}
                          <div className="mt-8 text-center">
                            <Button
                              size="lg"
                              className="bg-ocean-blue hover:bg-blue-600 text-white px-12 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
                              onClick={() => {
                                window.location.href = `/booking?itemId=${dahabiyaId}&type=dahabiya&itineraryId=${selectedItinerary.id}`;
                              }}
                            >
                              <Crown className="w-6 h-6 mr-3" />
                              Book This Royal Journey
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
