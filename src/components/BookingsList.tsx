"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Star, Eye, Package } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  startDate: string;
  endDate: string;
  totalPrice: number;
  guestCount: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  package?: {
    id: string;
    name: string;
    mainImageUrl?: string;
    duration: number;
  };
  dahabiya?: {
    id: string;
    name: string;
    mainImageUrl?: string;
  };
}

interface BookingsListProps {
  userId?: string;
  showUserInfo?: boolean;
  limit?: number;
}

const BookingsList: React.FC<BookingsListProps> = ({ 
  userId, 
  showUserInfo = false, 
  limit 
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the existing bookings API endpoint
      const url = `/api/bookings${limit ? `?limit=${limit}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) {
        // If unauthorized, show empty state instead of error
        if (response.status === 401) {
          setBookings([]);
          return;
        }
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data.bookings || data || []);
    } catch (err) {
      console.error('Bookings fetch error:', err);
      // Set empty array instead of error for better UX
      setBookings([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '✓';
      case 'PENDING':
        return '⏳';
      case 'CANCELLED':
        return '✗';
      case 'COMPLETED':
        return '★';
      default:
        return '?';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-3 lg:p-6">
              <div className="flex space-x-3">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 lg:h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Remove error display - just show empty state for better UX

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Journeys Yet</h3>
        <p className="text-gray-600 mb-6">Start your Egyptian adventure by booking your first Dahabiya cruise</p>
        <Link href="/packages">
          <Button className="bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 hover:from-ocean-blue-500 hover:to-navy-blue-500 text-white">
            <Package className="w-4 h-4 mr-2" />
            Browse Packages
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-3 lg:p-6">
            <div className="flex flex-col md:flex-row gap-3 lg:gap-4">
              {/* Image */}
              <div className="w-full md:w-24 lg:w-32 h-24 lg:h-32 relative rounded-lg overflow-hidden">
                <Image
                  src={booking.package?.mainImageUrl || booking.dahabiya?.mainImageUrl || '/images/placeholder-booking.jpg'}
                  alt={booking.package?.name || booking.dahabiya?.name || 'Booking'}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                      {booking.package?.name || booking.dahabiya?.name || 'Custom Booking'}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusIcon(booking.status)} {booking.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-egyptian-gold">
                      ${booking.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{booking.guestCount} guests</span>
                  </div>
                  {booking.package?.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{booking.package.duration} days</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Booked {format(new Date(booking.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Special Requests:</strong> {booking.specialRequests}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link href={`/bookings/${booking.id}`}>
                    <Button variant="outline" size="sm" className="border-egyptian-gold/40 text-hieroglyph-brown hover:bg-egyptian-gold/10 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      <span className="text-xs">View Details</span>
                      <span className="text-xs text-egyptian-gold ml-1">𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿</span>
                    </Button>
                  </Link>
                  {booking.status === 'COMPLETED' && (
                    <Link href={`/bookings/${booking.id}/review`}>
                      <Button size="sm">
                        <Star className="w-4 h-4 mr-2" />
                        Leave Review
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingsList;
export { BookingsList };
