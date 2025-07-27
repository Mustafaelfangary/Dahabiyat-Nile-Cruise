"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Clock,
  Star,
  Download,
  Edit,
  X,
  Ship,
  Crown,
  Anchor,
  Compass,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Container } from '@/components/ui/container';
import { AnimatedSection } from '@/components/ui/animated-section';
import { toast } from 'sonner';

interface BookingDetails {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  totalPrice: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  dahabiya: {
    id: string;
    name: string;
    description: string;
    images: Array<{ url: string; alt: string }>;
    capacity: number;
    cabins: number;
  };
  package?: {
    id: string;
    name: string;
    duration: number;
    description: string;
  };
  guestDetails: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    nationality?: string;
  }>;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = params.id as string;

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchBookingDetails();
  }, [session, status, bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}/details`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Booking not found');
        } else if (response.status === 403) {
          setError('You do not have permission to view this booking');
        } else {
          setError('Failed to load booking details');
        }
        return;
      }

      const data = await response.json();
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-egyptian-gold mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/profile">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50">
      {/* Pharaonic Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <Container maxWidth="full" className="relative z-10 py-8">
        <AnimatedSection animation="fade-in">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
              <p className="text-gray-600">Booking ID: {booking.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Status */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Ship className="w-6 h-6 text-egyptian-gold" />
                      Booking Status
                    </CardTitle>
                    <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p className="font-semibold">{format(new Date(booking.startDate), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p className="font-semibold">{format(new Date(booking.endDate), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-semibold">{booking.guestCount} guests</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Total Price</p>
                        <p className="font-semibold text-egyptian-gold">${booking.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dahabiya Details */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Anchor className="w-6 h-6 text-egyptian-gold" />
                    Your Dahabiya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {booking.dahabiya.images?.[0] && (
                      <img
                        src={booking.dahabiya.images[0].url}
                        alt={booking.dahabiya.images[0].alt}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{booking.dahabiya.name}</h3>
                      <p className="text-gray-600 mb-3">{booking.dahabiya.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Capacity: {booking.dahabiya.capacity} guests</span>
                        <span>Cabins: {booking.dahabiya.cabins}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  {booking.status === 'CONFIRMED' && (
                    <Button className="w-full" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Modify Booking
                    </Button>
                  )}
                  <Button className="w-full bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown hover:from-egyptian-amber hover:to-orange-600">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>

              {/* Booking Timeline */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Booking Created</p>
                        <p className="text-xs text-gray-500">{format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                      </div>
                    </div>
                    {booking.updatedAt !== booking.createdAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Last Updated</p>
                          <p className="text-xs text-gray-500">{format(new Date(booking.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </div>
  );
}
