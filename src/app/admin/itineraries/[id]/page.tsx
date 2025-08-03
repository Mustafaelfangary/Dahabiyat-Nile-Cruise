'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Star,
  Clock,
  Utensils,
  Camera,
  Crown,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  location: string;
  activities: string[];
  meals: string[];
}

interface PricingTier {
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
  shortDescription: string;
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
  pricingTiers: PricingTier[];
  createdAt: string;
  updatedAt: string;
}

export default function ItineraryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchItinerary();
    }
  }, [params.id]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/itineraries/${params.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setItinerary(data);
      } else {
        toast.error('Failed to fetch itinerary');
        router.push('/admin/itineraries');
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      toast.error('Error fetching itinerary');
      router.push('/admin/itineraries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/itineraries/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Itinerary deleted successfully');
        router.push('/admin/itineraries');
      } else {
        toast.error('Failed to delete itinerary');
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast.error('Error deleting itinerary');
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async () => {
    if (!itinerary) return;

    try {
      const response = await fetch(`/api/admin/itineraries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...itinerary,
          isActive: !itinerary.isActive
        }),
      });

      if (response.ok) {
        const updatedItinerary = await response.json();
        setItinerary(updatedItinerary);
        toast.success(`Itinerary ${updatedItinerary.isActive ? 'activated' : 'deactivated'} successfully`);
      } else {
        toast.error('Failed to update itinerary status');
      }
    } catch (error) {
      console.error('Error updating itinerary:', error);
      toast.error('Error updating itinerary');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800">Loading Sacred Journey...</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Itinerary Not Found</h1>
          <Button onClick={() => router.push('/admin/itineraries')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Itineraries
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-lg shadow-lg">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/admin/itineraries')}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Itineraries
            </Button>
            <div className="flex items-center gap-4">
              <Crown className="w-10 h-10 text-amber-200" />
              <div>
                <h1 className="text-3xl font-bold text-white">{itinerary.name}</h1>
                <p className="text-amber-200">Sacred Journey Details</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={itinerary.isActive ? "default" : "secondary"}>
              {itinerary.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {itinerary.featured && (
              <Badge variant="outline" className="bg-yellow-500 text-white border-yellow-600">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => router.push(`/admin/itineraries/${itinerary.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Itinerary
          </Button>
          
          <Button
            onClick={toggleActive}
            variant={itinerary.isActive ? "outline" : "default"}
            className={itinerary.isActive ? "border-orange-500 text-orange-600 hover:bg-orange-50" : "bg-green-600 hover:bg-green-700 text-white"}
          >
            {itinerary.isActive ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Activate
              </>
            )}
          </Button>

          <Button
            onClick={() => window.open(`/itineraries/${itinerary.slug}`, '_blank')}
            variant="outline"
            className="border-amber-500 text-amber-600 hover:bg-amber-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Public Page
          </Button>

          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="destructive"
            className="ml-auto"
          >
            {deleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>

        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <MapPin className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {itinerary.durationDays} days
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Max Guests</p>
              <p className="font-semibold flex items-center gap-1">
                <Users className="w-4 h-4" />
                {itinerary.maxGuests || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Starting Price</p>
              <p className="font-semibold flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                ${itinerary.price || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Slug</p>
              <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {itinerary.slug}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-amber-800">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Short Description</h4>
                <p className="text-gray-600">{itinerary.shortDescription}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Full Description</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{itinerary.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Days Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Clock className="w-5 h-5" />
              Daily Itinerary ({itinerary.days.length} days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itinerary.days.map((day) => (
                <div key={day.id} className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-semibold text-amber-800">
                    Day {day.dayNumber}: {day.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">{day.description}</p>
                  {day.location && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {day.location}
                    </p>
                  )}
                  {day.meals.length > 0 && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Utensils className="w-3 h-3" />
                      Meals: {day.meals.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Tiers */}
        {itinerary.pricingTiers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <DollarSign className="w-5 h-5" />
                Pricing Tiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {itinerary.pricingTiers.map((tier) => (
                  <div key={tier.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800">{tier.category}</h4>
                    <p className="text-sm text-gray-600">{tier.paxRange}</p>
                    <p className="text-lg font-bold">${tier.price}</p>
                    {tier.singleSupplement && (
                      <p className="text-sm text-gray-500">
                        Single supplement: ${tier.singleSupplement}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
