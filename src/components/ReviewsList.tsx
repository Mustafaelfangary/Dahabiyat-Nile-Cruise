"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Calendar, MapPin, User, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  title?: string;
  photos: string[];
  location?: string;
  tripDate?: string;
  approvedAt: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
  package?: {
    id: string;
    name: string;
    mainImageUrl?: string;
  };
  dahabiya?: {
    id: string;
    name: string;
    mainImageUrl?: string;
  };
}

interface ReviewsListProps {
  userId?: string;
  packageId?: string;
  dahabiyaId?: string;
  showUserInfo?: boolean;
  showActions?: boolean;
  limit?: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ 
  userId, 
  packageId,
  dahabiyaId,
  showUserInfo = true,
  showActions = false,
  limit 
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [userId, packageId, dahabiyaId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the reviews API endpoint
      let url = '/api/reviews?';
      const params = new URLSearchParams();

      if (userId) params.append('userId', userId);
      if (packageId) params.append('packageId', packageId);
      if (dahabiyaId) params.append('dahabiyaId', dahabiyaId);
      if (limit) params.append('limit', limit.toString());

      url += params.toString();

      const response = await fetch(url);
      if (!response.ok) {
        // If unauthorized, show empty state instead of error
        if (response.status === 401) {
          setReviews([]);
          return;
        }
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }

      const data = await response.json();
      setReviews(data.reviews || data || []);
    } catch (err) {
      console.error('Reviews fetch error:', err);
      // Set empty array instead of error for better UX
      setReviews([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Remove error display - just show empty state for better UX

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600 mb-6">Share your experiences after completing a journey</p>
        <Link href="/packages">
          <Button className="bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-white">
            <Star className="w-4 h-4 mr-2" />
            Book a Journey
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {showUserInfo && (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.user.image || ''} />
                      <AvatarFallback>
                        {review.user.name?.charAt(0) || <User className="w-6 h-6" />}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    {showUserInfo && (
                      <p className="font-semibold text-gray-900">
                        {review.user.name || 'Anonymous'}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    {(review.package || review.dahabiya) && (
                      <p className="text-sm text-gray-600">
                        {review.package?.name || review.dahabiya?.name}
                      </p>
                    )}
                  </div>
                </div>
                
                {showActions && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteReview(review.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Title */}
              {review.title && (
                <h4 className="font-semibold text-lg text-gray-900">
                  {review.title}
                </h4>
              )}

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed">
                {review.comment}
              </p>

              {/* Trip Details */}
              {(review.location || review.tripDate) && (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {review.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{review.location}</span>
                    </div>
                  )}
                  {review.tripDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Trip: {format(new Date(review.tripDate), 'MMM yyyy')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {review.photos.slice(0, 4).map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                      {index === 3 && review.photos.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            +{review.photos.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;
export { ReviewsList };
