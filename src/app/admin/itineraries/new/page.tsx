'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  ArrowLeft, 
  Plus, 
  Trash2,
  Calendar,
  Star,
  Camera,
  Video,
  Utensils,
  Ship,
  Crown,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import MediaLibrarySelector from '@/components/admin/MediaLibrarySelector';

interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  location: string;
  activities: string[];
  meals: string[];
  images: string[];
  videoUrl: string;
  highlights: string[];
  optionalTours: string[];
}

interface PricingTier {
  category: string;
  paxRange: string;
  price: number;
  singleSupplement: number;
}

export default function NewItineraryPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showMediaPicker, setShowMediaPicker] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    durationDays: 1,
    mainImageUrl: '',
    heroImageUrl: '',
    videoUrl: '',
    price: '',
    maxGuests: '',
    highlights: [''],
    included: [''],
    notIncluded: [''],
    childrenPolicy: '',
    cancellationPolicy: '',
    observations: '',
    isActive: true,
    featured: false,
  });

  const [days, setDays] = useState<ItineraryDay[]>([
    {
      dayNumber: 1,
      title: '',
      description: '',
      location: '',
      activities: [''],
      meals: [],
      images: [],
      videoUrl: '',
      highlights: [''],
      optionalTours: ['']
    }
  ]);

  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    {
      category: 'SILVER',
      paxRange: '2-3 PAX',
      price: 0,
      singleSupplement: 0
    }
  ]);

  // Helper functions for managing days
  const addDay = () => {
    const newDay: ItineraryDay = {
      dayNumber: days.length + 1,
      title: '',
      description: '',
      location: '',
      activities: [''],
      meals: [],
      images: [],
      videoUrl: '',
      highlights: [''],
      optionalTours: ['']
    };
    setDays([...days, newDay]);
    setFormData(prev => ({ ...prev, durationDays: days.length + 1 }));
  };

  const removeDay = (dayIndex: number) => {
    if (days.length > 1) {
      const updatedDays = days.filter((_, index) => index !== dayIndex)
        .map((day, index) => ({ ...day, dayNumber: index + 1 }));
      setDays(updatedDays);
      setFormData(prev => ({ ...prev, durationDays: updatedDays.length }));
    }
  };

  const updateDay = (dayIndex: number, field: keyof ItineraryDay, value: string | string[]) => {
    const updatedDays = [...days];
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value };
    setDays(updatedDays);
  };

  const addArrayItem = (dayIndex: number, field: 'activities' | 'highlights' | 'optionalTours', value: string = '') => {
    const updatedDays = [...days];
    updatedDays[dayIndex][field].push(value);
    setDays(updatedDays);
  };

  const removeArrayItem = (dayIndex: number, field: 'activities' | 'highlights' | 'optionalTours', itemIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex][field].splice(itemIndex, 1);
    setDays(updatedDays);
  };

  const updateArrayItem = (dayIndex: number, field: 'activities' | 'highlights' | 'optionalTours', itemIndex: number, value: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex][field][itemIndex] = value;
    setDays(updatedDays);
  };

  // Helper functions for pricing tiers
  const addPricingTier = () => {
    setPricingTiers([...pricingTiers, {
      category: 'GOLD',
      paxRange: '4-8 PAX',
      price: 0,
      singleSupplement: 0
    }]);
  };

  const removePricingTier = (index: number) => {
    if (pricingTiers.length > 1) {
      setPricingTiers(pricingTiers.filter((_, i) => i !== index));
    }
  };

  const updatePricingTier = (index: number, field: keyof PricingTier, value: string | number) => {
    const updated = [...pricingTiers];
    updated[index] = { ...updated[index], [field]: value };
    setPricingTiers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          highlights: formData.highlights.filter(h => h.trim()),
          included: formData.included.filter(i => i.trim()),
          notIncluded: formData.notIncluded.filter(n => n.trim()),
          price: formData.price ? parseFloat(formData.price) : null,
          maxGuests: formData.maxGuests ? parseInt(formData.maxGuests) : null,
          days: days.map(day => ({
            ...day,
            activities: day.activities.filter(a => a.trim()),
            highlights: day.highlights.filter(h => h.trim()),
            optionalTours: day.optionalTours.filter(t => t.trim())
          })),
          pricingTiers: pricingTiers.filter(tier => tier.price > 0)
        }),
      });

      if (response.ok) {
        toast.success('🏺 Sacred Journey Created Successfully!');
        // Redirect to the itineraries list page
        window.location.href = `/admin/itineraries`;
      } else {
        toast.error('Failed to create itinerary');
      }
    } catch (error) {
      console.error('Error creating itinerary:', error);
      toast.error('Error creating itinerary');
    } finally {
      setLoading(false);
    }
  };

  const updateArrayField = (field: 'highlights' | 'included' | 'notIncluded', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'highlights' | 'included' | 'notIncluded') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'highlights' | 'included' | 'notIncluded', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-800 text-lg">Loading Sacred Portal...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Access Denied</h1>
          <p className="text-amber-600">Only pharaonic administrators may enter this sacred realm.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 via-navy-blue-50 to-deep-blue-100">
      <div className="container mx-auto py-8">
        {/* Pharaonic Header */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-ocean-blue-600 via-navy-blue-600 to-deep-blue-700 rounded-lg shadow-lg">
          <Link
            href="/admin/itineraries"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Sacred Journeys
          </Link>
          <div className="flex items-center gap-4">
            <Crown className="w-10 h-10 text-amber-200" />
            <div>
              <h1 className="text-4xl font-bold text-white">Create Sacred Journey</h1>
              <p className="text-amber-200">Craft a divine itinerary worthy of the pharaohs</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm border-2 border-amber-200">
              <TabsTrigger value="basic" className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <MapPin className="w-4 h-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="days" className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Calendar className="w-4 h-4" />
                Daily Journey
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Star className="w-4 h-4" />
                Pricing Tiers
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Camera className="w-4 h-4" />
                Media & Gallery
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Ship className="w-6 h-6" />
                    Sacred Journey Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="name" className="text-amber-800 font-semibold">Journey Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Royal Dahabiya Cruise: 5 Days Esna - Aswan"
                        required
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug" className="text-amber-800 font-semibold">URL Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="royal-dahabiya-cruise-5-days"
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                      <p className="text-sm text-amber-600 mt-1">Leave empty to auto-generate from name</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="shortDescription" className="text-amber-800 font-semibold">Royal Summary</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                      placeholder="A brief, captivating description for cards and previews..."
                      className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-amber-800 font-semibold">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of this magnificent journey..."
                      className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="durationDays" className="text-amber-800 font-semibold">Duration (Days)</Label>
                      <Input
                        id="durationDays"
                        type="number"
                        min="1"
                        value={formData.durationDays}
                        onChange={(e) => setFormData(prev => ({ ...prev, durationDays: parseInt(e.target.value) || 1 }))}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxGuests" className="text-amber-800 font-semibold">Max Guests</Label>
                      <Input
                        id="maxGuests"
                        type="number"
                        min="1"
                        value={formData.maxGuests}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: e.target.value }))}
                        placeholder="e.g., 20"
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-amber-800 font-semibold">Base Price (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g., 1500"
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Journey Highlights */}
                  <div>
                    <Label className="text-amber-800 font-semibold">Journey Highlights</Label>
                    <div className="space-y-3 mt-2">
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={highlight}
                            onChange={(e) => updateArrayField('highlights', index, e.target.value)}
                            placeholder="e.g., Visit the magnificent Temple of Edfu"
                            className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayField('highlights', index)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addArrayField('highlights')}
                        className="border-amber-300 text-amber-600 hover:bg-blue-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Highlight
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Daily Journey Tab */}
            <TabsContent value="days" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-amber-800">Daily Journey Details</h2>
                </div>
                <Button
                  type="button"
                  onClick={addDay}
                  className="bg-amber-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </Button>
              </div>

              <div className="space-y-6">
                {days.map((day, dayIndex) => (
                  <Card key={dayIndex} className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 text-white">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-amber-800 font-bold">
                            {day.dayNumber}
                          </div>
                          Day {day.dayNumber}
                        </CardTitle>
                        {days.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDay(dayIndex)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-amber-800 font-semibold">Day Title *</Label>
                          <Input
                            value={day.title}
                            onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                            placeholder="e.g., Arrival in Luxor - Temple of Karnak"
                            className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-800 font-semibold">Location</Label>
                          <Input
                            value={day.location}
                            onChange={(e) => updateDay(dayIndex, 'location', e.target.value)}
                            placeholder="e.g., Luxor, Egypt"
                            className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-amber-800 font-semibold">Day Description</Label>
                        <Textarea
                          value={day.description}
                          onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                          placeholder="Detailed description of this day's journey..."
                          className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                          rows={4}
                        />
                      </div>

                      {/* Meals */}
                      <div>
                        <Label className="text-amber-800 font-semibold">Meals Included</Label>
                        <div className="flex gap-4 mt-2">
                          {[
                            { label: 'Breakfast', value: 'BREAKFAST' },
                            { label: 'Lunch', value: 'LUNCH' },
                            { label: 'Dinner', value: 'DINNER' },
                            { label: 'Snack', value: 'SNACK' },
                            { label: 'Afternoon Tea', value: 'AFTERNOON_TEA' }
                          ].map((meal) => (
                            <label key={meal.value} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={day.meals.includes(meal.value)}
                                onChange={(e) => {
                                  const meals = e.target.checked
                                    ? [...day.meals, meal.value]
                                    : day.meals.filter(m => m !== meal.value);
                                  updateDay(dayIndex, 'meals', meals);
                                }}
                                className="rounded border-amber-300"
                              />
                              <span className="text-amber-700 flex items-center gap-1">
                                <Utensils className="w-4 h-4" />
                                {meal.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Activities */}
                      <div>
                        <Label className="text-amber-800 font-semibold">Activities & Excursions</Label>
                        <div className="space-y-3 mt-2">
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="flex gap-2">
                              <Input
                                value={activity}
                                onChange={(e) => updateArrayItem(dayIndex, 'activities', actIndex, e.target.value)}
                                placeholder="e.g., Guided tour of Karnak Temple Complex"
                                className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem(dayIndex, 'activities', actIndex)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addArrayItem(dayIndex, 'activities')}
                            className="border-amber-300 text-amber-600 hover:bg-blue-50"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Activity
                          </Button>
                        </div>
                      </div>

                      {/* Day Highlights */}
                      <div>
                        <Label className="text-amber-800 font-semibold">Day Highlights</Label>
                        <div className="space-y-3 mt-2">
                          {day.highlights.map((highlight, hlIndex) => (
                            <div key={hlIndex} className="flex gap-2">
                              <Input
                                value={highlight}
                                onChange={(e) => updateArrayItem(dayIndex, 'highlights', hlIndex, e.target.value)}
                                placeholder="e.g., Witness the sunset from the temple's sacred halls"
                                className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem(dayIndex, 'highlights', hlIndex)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addArrayItem(dayIndex, 'highlights')}
                            className="border-amber-300 text-amber-600 hover:bg-blue-50"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Highlight
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Pricing Tiers Tab */}
            <TabsContent value="pricing" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-amber-800">Pricing Tiers</h2>
                </div>
                <Button
                  type="button"
                  onClick={addPricingTier}
                  className="bg-amber-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tier
                </Button>
              </div>

              <div className="grid gap-6">
                {pricingTiers.map((tier, index) => (
                  <Card key={index} className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 text-white">
                      <div className="flex items-center justify-between">
                        <CardTitle>Pricing Tier {index + 1}</CardTitle>
                        {pricingTiers.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePricingTier(index)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                          <Label className="text-amber-800 font-semibold">Category</Label>
                          <Select
                            value={tier.category}
                            onValueChange={(value) => updatePricingTier(index, 'category', value)}
                          >
                            <SelectTrigger className="border-2 border-amber-200 focus:border-blue-500 bg-white/80">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SILVER">Silver</SelectItem>
                              <SelectItem value="GOLD">Gold</SelectItem>
                              <SelectItem value="DIAMOND">Diamond</SelectItem>
                              <SelectItem value="PLATINUM">Platinum</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-amber-800 font-semibold">PAX Range</Label>
                          <Input
                            value={tier.paxRange}
                            onChange={(e) => updatePricingTier(index, 'paxRange', e.target.value)}
                            placeholder="e.g., 2-3 PAX"
                            className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-800 font-semibold">Price (USD)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={tier.price}
                            onChange={(e) => updatePricingTier(index, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="e.g., 1500"
                            className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-800 font-semibold">Single Supplement</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={tier.singleSupplement}
                            onChange={(e) => updatePricingTier(index, 'singleSupplement', parseFloat(e.target.value) || 0)}
                            placeholder="e.g., 300"
                            className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Media & Gallery Tab */}
            <TabsContent value="media" className="space-y-6">
              <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Camera className="w-6 h-6" />
                    Media & Visual Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label className="text-amber-800 font-semibold">Main Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.mainImageUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, mainImageUrl: e.target.value }))}
                          placeholder="Main display image URL"
                          className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowMediaPicker('mainImage')}
                          className="border-amber-300 text-amber-600 hover:bg-blue-50"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-amber-800 font-semibold">Hero Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.heroImageUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, heroImageUrl: e.target.value }))}
                          placeholder="Hero banner image URL"
                          className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowMediaPicker('heroImage')}
                          className="border-amber-300 text-amber-600 hover:bg-blue-50"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-amber-800 font-semibold">Video URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.videoUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="Journey video URL"
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowMediaPicker('video')}
                        className="border-amber-300 text-amber-600 hover:bg-blue-50"
                      >
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-center mt-12">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-ocean-blue-600 to-navy-blue-600 hover:from-ocean-blue-700 hover:to-navy-blue-700 text-white px-12 py-4 text-lg font-bold rounded-lg shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creating Sacred Journey...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-3" />
                  Create Sacred Journey
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Media Library Selector */}
        {showMediaPicker && (
          <MediaLibrarySelector
            onSelect={(url) => {
              if (showMediaPicker === 'mainImage') {
                setFormData(prev => ({ ...prev, mainImageUrl: url }));
              } else if (showMediaPicker === 'heroImage') {
                setFormData(prev => ({ ...prev, heroImageUrl: url }));
              } else if (showMediaPicker === 'video') {
                setFormData(prev => ({ ...prev, videoUrl: url }));
              }
              setShowMediaPicker(null);
            }}
            onClose={() => setShowMediaPicker(null)}
            currentValue=""
            accept={showMediaPicker === 'video' ? 'video/*' : 'image/*'}
          />
        )}
      </div>
    </div>
  );
}
