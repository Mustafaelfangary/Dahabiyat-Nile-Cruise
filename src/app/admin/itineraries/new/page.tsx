'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import MediaPicker from '@/components/admin/MediaPicker';

export default function NewItineraryPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
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
        }),
      });

      if (response.ok) {
        const newItinerary = await response.json();
        toast.success('Itinerary created successfully!');
        window.location.href = `/admin/itineraries/${newItinerary.id}`;
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

  const addArrayItem = (field: 'highlights' | 'included' | 'notIncluded') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'highlights' | 'included' | 'notIncluded', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: 'highlights' | 'included' | 'notIncluded', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <div>Access denied. Please sign in.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-4 mb-8">
          <a
            href="/admin/itineraries"
            className="inline-flex items-center gap-2 bg-ocean-blue hover:bg-amber-600 text-black font-bold py-2 px-4 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Itineraries
          </a>
          <h1 className="text-3xl font-bold text-amber-800">Create New Royal Journey</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Journey Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Dahabiya Cruise 5 Days Esna - Aswan"
                    required
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="dahabiya-cruise-5-days-esna-aswan"
                    className="border-amber-200 focus:border-amber-400"
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave empty to auto-generate from name</p>
                </div>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description for cards and previews"
                  className="border-amber-200 focus:border-amber-400"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the journey"
                  required
                  className="border-amber-200 focus:border-amber-400"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="durationDays">Duration (Days) *</Label>
                  <Input
                    id="durationDays"
                    type="number"
                    min="1"
                    value={formData.durationDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, durationDays: parseInt(e.target.value) }))}
                    required
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Starting Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="982.00"
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
                <div>
                  <Label htmlFor="maxGuests">Max Guests</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    min="1"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: e.target.value }))}
                    placeholder="35"
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800">Media & Images</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <MediaPicker
                  label="Main Image"
                  value={formData.mainImageUrl}
                  onChange={(value) => setFormData(prev => ({ ...prev, mainImageUrl: value }))}
                  placeholder="/images/itineraries/journey-main.jpg"
                  helperText="Select the main image that will be displayed in itinerary cards and previews"
                  accept="image/*"
                />
              </div>
              <div>
                <MediaPicker
                  label="Hero Background Image"
                  value={formData.heroImageUrl}
                  onChange={(value) => setFormData(prev => ({ ...prev, heroImageUrl: value }))}
                  placeholder="/images/itineraries/journey-hero.jpg"
                  helperText="Select the hero background image for the itinerary header"
                  accept="image/*"
                />
              </div>
              <div>
                <MediaPicker
                  label="Video URL (Optional)"
                  value={formData.videoUrl}
                  onChange={(value) => setFormData(prev => ({ ...prev, videoUrl: value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  helperText="Add a promotional video for this itinerary"
                  accept="video/*"
                />
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800">Journey Highlights</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateArrayItem('highlights', index, e.target.value)}
                      placeholder="e.g., Edfu Temple - largest temple in Egypt"
                      className="border-amber-200 focus:border-amber-400"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('highlights', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('highlights')}
                  className="border-amber-300 text-amber-800 hover:bg-amber-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Highlight
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Included/Not Included */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Included */}
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                <CardTitle className="text-green-800">What's Included</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {formData.included.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateArrayItem('included', index, e.target.value)}
                        placeholder="e.g., 04 nights Dahabiya Nile Cruise full board"
                        className="border-green-200 focus:border-green-400"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('included', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('included')}
                    className="border-green-300 text-green-800 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Included Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Not Included */}
            <Card className="border-2 border-red-200">
              <CardHeader className="bg-gradient-to-r from-red-100 to-pink-100">
                <CardTitle className="text-red-800">What's Not Included</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {formData.notIncluded.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateArrayItem('notIncluded', index, e.target.value)}
                        placeholder="e.g., International flights"
                        className="border-red-200 focus:border-red-400"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('notIncluded', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('notIncluded')}
                    className="border-red-300 text-red-800 hover:bg-red-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Not Included Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Policies */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800">Policies & Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="childrenPolicy">Children Policy</Label>
                <Textarea
                  id="childrenPolicy"
                  value={formData.childrenPolicy}
                  onChange={(e) => setFormData(prev => ({ ...prev, childrenPolicy: e.target.value }))}
                  placeholder="e.g., From 0 to 01 years: Free tour. From 2 to 5 years: Pay 25%..."
                  className="border-amber-200 focus:border-amber-400"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                <Textarea
                  id="cancellationPolicy"
                  value={formData.cancellationPolicy}
                  onChange={(e) => setFormData(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                  placeholder="e.g., No cancellation fees up to 15 days before arrival..."
                  className="border-amber-200 focus:border-amber-400"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="observations">Observations & Notes</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="e.g., Prices are for low season departure. 20% supplement during high season..."
                  className="border-amber-200 focus:border-amber-400"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                />
                <Label htmlFor="isActive">Active (visible to public)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                />
                <Label htmlFor="featured">Featured journey</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-black flex-1"
            >
              {loading ? (
                <>Creating...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Royal Journey
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.href = '/admin/itineraries'}
              className="border-amber-300 text-amber-800 hover:bg-amber-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
