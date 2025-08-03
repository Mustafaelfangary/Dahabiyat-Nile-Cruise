'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, Eye, Calendar, Users, Star, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Itinerary {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  durationDays: number;
  mainImageUrl?: string;
  price?: number;
  maxGuests?: number;
  highlights: string[];
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  days: any[];
  pricingTiers: any[];
}

export default function ItinerariesManagementPage() {
  const { data: session, status } = useSession();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchItineraries();
    }
  }, [status]);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching itineraries...');
      const response = await fetch('/api/admin/itineraries');
      console.log('📡 Itineraries API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Itineraries API response data:', data);
        setItineraries(data || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Itineraries API error:', errorData);
        const errorMessage = `Failed to fetch itineraries: ${errorData.error || response.statusText}`;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('💥 Error fetching itineraries:', error);
      const errorMessage = 'Error loading itineraries';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;

    try {
      const response = await fetch(`/api/admin/itineraries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Itinerary deleted successfully');
        fetchItineraries();
      } else {
        toast.error('Failed to delete itinerary');
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast.error('Error deleting itinerary');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/itineraries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(`Itinerary ${!isActive ? 'activated' : 'deactivated'} successfully`);
        fetchItineraries();
      } else {
        toast.error('Failed to update itinerary status');
      }
    } catch (error) {
      console.error('Error updating itinerary:', error);
      toast.error('Error updating itinerary');
    }
  };

  const downloadItinerary = async (itinerary: Itinerary) => {
    try {
      const response = await fetch(`/api/itineraries/${itinerary.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${itinerary.name || 'itinerary'}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Itinerary downloaded successfully!');
      } else {
        toast.error('Failed to download itinerary');
      }
    } catch (error) {
      console.error('Error downloading itinerary:', error);
      toast.error('Error downloading itinerary');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Loading Royal Journeys...</p>
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="inline-flex items-center gap-2 bg-ocean-blue hover:bg-amber-600 text-black font-bold py-2 px-4 rounded transition-colors"
            >
              ← Back to Dashboard
            </a>
            <h1 className="text-3xl font-bold text-amber-800">𓋖 Itineraries Management</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => window.open('/api/admin/debug', '_blank')}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              🔍 Debug Info
            </Button>
            <Button
              onClick={() => fetchItineraries()}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/itineraries/new'}
              className="bg-amber-600 hover:bg-amber-700 text-black shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Itinerary
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error loading itineraries:</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
              <Button
                onClick={() => fetchItineraries()}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && itineraries.length === 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Itineraries Found</h3>
              <p className="text-yellow-700 mb-4">
                No itineraries are currently available. This could be because:
              </p>
              <ul className="text-left text-yellow-700 mb-4 space-y-1">
                <li>• No itineraries have been created yet</li>
                <li>• Database connection issues</li>
                <li>• Authentication problems</li>
              </ul>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => window.location.href = '/admin/itineraries/new'}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Create First Itinerary
                </Button>
                <Button
                  onClick={() => fetchItineraries()}
                  variant="outline"
                >
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="hover:shadow-lg transition-shadow border-2 border-amber-200 hover:border-amber-400">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={itinerary.mainImageUrl || '/images/default-itinerary.jpg'}
                  alt={itinerary.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Status Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {itinerary.featured && (
                    <Badge className="bg-amber-500 text-black">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant={itinerary.isActive ? 'default' : 'secondary'}>
                    {itinerary.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {/* Duration */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {itinerary.durationDays} Days
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-2 line-clamp-2">
                  {itinerary.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                  {itinerary.shortDescription || itinerary.description}
                </p>

                {/* Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  {itinerary.maxGuests && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {itinerary.maxGuests}
                    </div>
                  )}
                  {itinerary.price && (
                    <div className="font-semibold text-amber-600">
                      ${itinerary.price}
                    </div>
                  )}
                  <div className="text-xs">
                    {itinerary.days.length} Days • {itinerary.pricingTiers.length} Tiers
                  </div>
                </div>

                {/* Highlights */}
                {itinerary.highlights.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {itinerary.highlights.slice(0, 2).map((highlight, idx) => (
                        <span key={idx} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          {highlight}
                        </span>
                      ))}
                      {itinerary.highlights.length > 2 && (
                        <span className="text-amber-600 text-xs">+{itinerary.highlights.length - 2}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/itineraries/${itinerary.slug || itinerary.id}`, '_blank')}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/admin/itineraries/${itinerary.id}/edit`}
                    className="flex-1 text-amber-600 hover:text-amber-700 border-amber-300 hover:bg-amber-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadItinerary(itinerary)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(itinerary.id, itinerary.isActive)}
                    className={itinerary.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {itinerary.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(itinerary.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {itineraries.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-800 mb-4">No Itineraries Found</h3>
            <p className="text-amber-600 mb-6">Start creating your first royal journey itinerary.</p>
            <Button
              onClick={() => window.location.href = '/admin/itineraries/new'}
              className="bg-amber-600 hover:bg-amber-700 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Itinerary
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
