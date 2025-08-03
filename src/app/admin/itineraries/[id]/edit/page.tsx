'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2,
  Calendar,
  Users,
  Star,
  Clock,
  Camera,
  Video,
  Upload,
  Eye,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Utensils,
  Ship,
  Crown,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import MediaLibrarySelector from '@/components/admin/MediaLibrarySelector';

interface ItineraryDay {
  id?: string;
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
  id?: string;
  category: string;
  paxRange: string;
  price: number;
  singleSupplement: number;
}

export default function EditItineraryPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const itineraryId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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

  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);

  // Load existing itinerary data
  useEffect(() => {
    if (itineraryId) {
      loadItinerary();
    }
  }, [itineraryId]);

  const loadItinerary = async () => {
    try {
      setLoadingData(true);
      const response = await fetch(`/api/admin/itineraries/${itineraryId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load itinerary');
      }

      const itinerary = await response.json();
      
      // Populate form data
      setFormData({
        name: itinerary.name || '',
        slug: itinerary.slug || '',
        description: itinerary.description || '',
        shortDescription: itinerary.shortDescription || '',
        durationDays: itinerary.durationDays || 1,
        mainImageUrl: itinerary.mainImageUrl || '',
        heroImageUrl: itinerary.heroImageUrl || '',
        videoUrl: itinerary.videoUrl || '',
        price: itinerary.price?.toString() || '',
        maxGuests: itinerary.maxGuests?.toString() || '',
        highlights: itinerary.highlights?.length ? itinerary.highlights : [''],
        included: itinerary.included?.length ? itinerary.included : [''],
        notIncluded: itinerary.notIncluded?.length ? itinerary.notIncluded : [''],
        childrenPolicy: itinerary.childrenPolicy || '',
        cancellationPolicy: itinerary.cancellationPolicy || '',
        observations: itinerary.observations || '',
        isActive: itinerary.isActive ?? true,
        featured: itinerary.featured ?? false,
      });

      // Populate days
      if (itinerary.days?.length) {
        setDays(itinerary.days.map((day: any) => ({
          id: day.id,
          dayNumber: day.dayNumber,
          title: day.title || '',
          description: day.description || '',
          location: day.location || '',
          activities: day.activities?.length ? day.activities : [''],
          meals: day.meals || [],
          images: day.images || [],
          videoUrl: day.videoUrl || '',
          highlights: day.highlights?.length ? day.highlights : [''],
          optionalTours: day.optionalTours?.length ? day.optionalTours : ['']
        })));
      } else {
        setDays([{
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
        }]);
      }

      // Populate pricing tiers
      if (itinerary.pricingTiers?.length) {
        setPricingTiers(itinerary.pricingTiers.map((tier: any) => ({
          id: tier.id,
          category: tier.category,
          paxRange: tier.paxRange,
          price: tier.price,
          singleSupplement: tier.singleSupplement || 0
        })));
      } else {
        setPricingTiers([{
          category: 'SILVER',
          paxRange: '2-3 PAX',
          price: 0,
          singleSupplement: 0
        }]);
      }

    } catch (error) {
      console.error('Error loading itinerary:', error);
      toast.error('Failed to load itinerary data');
    } finally {
      setLoadingData(false);
    }
  };

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

  const updateDay = (dayIndex: number, field: keyof ItineraryDay, value: any) => {
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

  // Helper functions for managing pricing tiers
  const addPricingTier = () => {
    const newTier: PricingTier = {
      category: 'SILVER',
      paxRange: '',
      price: 0,
      singleSupplement: 0
    };
    setPricingTiers([...pricingTiers, newTier]);
  };

  const removePricingTier = (tierIndex: number) => {
    if (pricingTiers.length > 1) {
      const updatedTiers = pricingTiers.filter((_, index) => index !== tierIndex);
      setPricingTiers(updatedTiers);
    }
  };

  const updatePricingTier = (tierIndex: number, field: keyof PricingTier, value: any) => {
    const updatedTiers = [...pricingTiers];
    updatedTiers[tierIndex] = { ...updatedTiers[tierIndex], [field]: value };
    setPricingTiers(updatedTiers);
  };

  const updateArrayItem = (dayIndex: number, field: 'activities' | 'highlights' | 'optionalTours', itemIndex: number, value: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex][field][itemIndex] = value;
    setDays(updatedDays);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/itineraries/${itineraryId}`, {
        method: 'PUT',
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
        toast.success('🏺 Sacred Journey Updated Successfully!');
        window.location.href = `/admin/itineraries`;
      } else {
        toast.error('Failed to update itinerary');
      }
    } catch (error) {
      console.error('Error updating itinerary:', error);
      toast.error('Error updating itinerary');
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

  if (status === 'loading' || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-800 text-lg">Loading Sacred Journey...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Access Denied</h1>
          <p className="text-amber-600">Only pharaonic administrators may enter this sacred realm.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto py-8">
        {/* Pharaonic Header */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-lg shadow-lg">
          <a
            href="/admin/itineraries"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Sacred Journeys
          </a>
          <div className="flex items-center gap-4">
            <Crown className="w-10 h-10 text-amber-200" />
            <div>
              <h1 className="text-4xl font-bold text-white">Edit Sacred Journey</h1>
              <p className="text-amber-200">Modify this divine itinerary worthy of the pharaohs</p>
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
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Ship className="w-6 h-6" />
                    Sacred Journey Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-amber-800 font-semibold">Journey Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Luxor to Aswan Royal Journey"
                        className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-amber-800 font-semibold">Duration (Days) *</Label>
                      <Input
                        type="number"
                        value={formData.durationDays}
                        onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                        placeholder="e.g., 5"
                        className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                        required
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-amber-800 font-semibold">Short Description *</Label>
                    <Textarea
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Brief description for listings and previews..."
                      className="border-2 border-amber-200 focus:border-amber-500 bg-white/80 min-h-[80px]"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-amber-800 font-semibold">Full Description *</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed description of the sacred journey..."
                      className="border-2 border-amber-200 focus:border-amber-500 bg-white/80 min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-amber-800 font-semibold">Starting Price (USD)</Label>
                      <Input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g., 2500"
                        className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label className="text-amber-800 font-semibold">Maximum Guests</Label>
                      <Input
                        type="number"
                        value={formData.maxGuests || ''}
                        onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                        placeholder="e.g., 12"
                        className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded border-amber-300"
                      />
                      <Label htmlFor="isActive" className="text-amber-800 font-semibold">
                        Active (visible to public)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded border-amber-300"
                      />
                      <Label htmlFor="featured" className="text-amber-800 font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Featured Journey
                      </Label>
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
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </Button>
              </div>

              <div className="space-y-6">
                {days.map((day, dayIndex) => (
                  <Card key={dayIndex} className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-400 text-white">
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
                            className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-800 font-semibold">Location</Label>
                          <Input
                            value={day.location}
                            onChange={(e) => updateDay(dayIndex, 'location', e.target.value)}
                            placeholder="e.g., Luxor, Egypt"
                            className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-amber-800 font-semibold">Day Description *</Label>
                        <Textarea
                          value={day.description}
                          onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                          placeholder="Describe the day's journey and experiences..."
                          className="border-2 border-amber-200 focus:border-amber-500 bg-white/80 min-h-[100px]"
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
                        <Label className="text-amber-800 font-semibold">Activities</Label>
                        <div className="space-y-2">
                          {day.activities.map((activity, activityIndex) => (
                            <div key={activityIndex} className="flex gap-2">
                              <Input
                                value={activity}
                                onChange={(e) => {
                                  const updatedActivities = [...day.activities];
                                  updatedActivities[activityIndex] = e.target.value;
                                  updateDay(dayIndex, 'activities', updatedActivities);
                                }}
                                placeholder="e.g., Visit Temple of Karnak"
                                className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem(dayIndex, 'activities', activityIndex)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayItem(dayIndex, 'activities')}
                            className="border-amber-300 text-amber-600 hover:bg-amber-50"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Activity
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
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tier
                </Button>
              </div>

              <div className="space-y-4">
                {pricingTiers.map((tier, tierIndex) => (
                  <Card key={tierIndex} className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                          <Crown className="w-5 h-5" />
                          {tier.category} Tier
                        </CardTitle>
                        {pricingTiers.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePricingTier(tierIndex)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-amber-800 font-semibold">Category *</Label>
                          <Select
                            value={tier.category}
                            onValueChange={(value) => updatePricingTier(tierIndex, 'category', value)}
                          >
                            <SelectTrigger className="border-2 border-amber-200 focus:border-amber-500 bg-white/80">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SILVER">Silver</SelectItem>
                              <SelectItem value="GOLD">Gold</SelectItem>
                              <SelectItem value="PLATINUM">Platinum</SelectItem>
                              <SelectItem value="DIAMOND">Diamond</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-amber-800 font-semibold">PAX Range *</Label>
                          <Input
                            value={tier.paxRange}
                            onChange={(e) => updatePricingTier(tierIndex, 'paxRange', e.target.value)}
                            placeholder="e.g., 2-3 PAX"
                            className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-800 font-semibold">Price (USD) *</Label>
                          <Input
                            type="number"
                            value={tier.price}
                            onChange={(e) => updatePricingTier(tierIndex, 'price', parseFloat(e.target.value))}
                            placeholder="e.g., 2500"
                            className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <Label className="text-amber-800 font-semibold">Single Supplement</Label>
                          <Input
                            type="number"
                            value={tier.singleSupplement || ''}
                            onChange={(e) => updatePricingTier(tierIndex, 'singleSupplement', e.target.value ? parseFloat(e.target.value) : 0)}
                            placeholder="e.g., 500"
                            className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                            step="0.01"
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
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-amber-800">Media & Gallery</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                    <CardTitle className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5" />
                      Main Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {formData.mainImageUrl && (
                        <div className="relative">
                          <img
                            src={formData.mainImageUrl}
                            alt="Main image preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <Button
                        type="button"
                        onClick={() => setShowMediaPicker('mainImage')}
                        variant="outline"
                        className="w-full border-amber-300 text-amber-600 hover:bg-amber-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {formData.mainImageUrl ? 'Change Main Image' : 'Select Main Image'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                    <CardTitle className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5" />
                      Hero Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {formData.heroImageUrl && (
                        <div className="relative">
                          <img
                            src={formData.heroImageUrl}
                            alt="Hero image preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <Button
                        type="button"
                        onClick={() => setShowMediaPicker('heroImage')}
                        variant="outline"
                        className="w-full border-amber-300 text-amber-600 hover:bg-amber-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {formData.heroImageUrl ? 'Change Hero Image' : 'Select Hero Image'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Video className="w-5 h-5" />
                    Video URL
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Input
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="Enter video URL or select from media library"
                      className="border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowMediaPicker('video')}
                      variant="outline"
                      className="border-amber-300 text-amber-600 hover:bg-amber-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Select from Media Library
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Submit Button */}
            <div className="flex justify-center mt-12">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-12 py-4 text-lg font-bold rounded-lg shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Updating Sacred Journey...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-3" />
                    Update Sacred Journey
                  </>
                )}
              </Button>
            </div>
          </Tabs>
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
