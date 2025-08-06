"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/ui/container';
import { PharaonicCard } from '@/components/ui/pharaonic-elements';
import { 
  Star, 
  User,
  MapPin, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  Quote
} from 'lucide-react';

interface FeaturedReview {
  id: string;
  rating: number;
  comment: string;
  title?: string;
  photos: string[];
  location?: string;
  tripDate?: string;
  approvedAt: string;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
  dahabiya: {
    id: string;
    name: string;
    hieroglyph?: string;
    slug: string;
  };
}

export default function FeaturedReviews() {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedReviews();
  }, []);

  const fetchFeaturedReviews = async () => {
    try {
      const response = await fetch('/api/reviews?featured=true&limit=6');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-egyptian-gold fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-amber-50 to-orange-50">
        <Container maxWidth="lg">
          <div className="text-center">
            <div className="text-6xl text-egyptian-gold animate-pulse mb-4">⭐</div>
            <div className="text-xl text-hieroglyph-brown">Loading reviews...</div>
          </div>
        </Container>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show section if no featured reviews
  }

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-ocean-blue-lightest relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl text-egyptian-gold animate-pulse">⭐</div>
        <div className="absolute top-20 right-20 text-4xl text-ocean-blue animate-pulse">𓊪</div>
        <div className="absolute bottom-20 left-20 text-5xl text-egyptian-gold animate-pulse">𓈖</div>
        <div className="absolute bottom-10 right-10 text-6xl text-ocean-blue animate-pulse">𓂀</div>
      </div>

      <Container maxWidth="lg">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-egyptian-gold text-5xl animate-pulse">⭐</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
              Guest Reviews
            </h2>
            <span className="text-egyptian-gold text-5xl animate-pulse">⭐</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-egyptian-gold text-xl">𓈖</span>
            <span className="text-egyptian-gold text-xl">𓂀</span>
            <span className="text-egyptian-gold text-xl">𓏏</span>
            <span className="text-egyptian-gold text-xl">𓇯</span>
            <span className="text-egyptian-gold text-xl">𓊃</span>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover what our guests say about their unforgettable journeys along the Nile. 
            Each review tells a story of wonder, luxury, and the timeless magic of Egypt.
          </p>

          <Link href="/profile">
            <Button className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90 text-lg px-8 py-3">
              <MessageSquare className="w-5 h-5 mr-2" />
              Share Your Review
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PharaonicCard className="group overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border border-egyptian-gold/30 h-full">
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {review.user.image ? (
                        <Image
                          src={review.user.image}
                          alt={review.user.name || 'User'}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-egyptian-gold/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-hieroglyph-brown" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-hieroglyph-brown">
                          {review.user.name || 'Anonymous Traveler'}
                        </h4>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-egyptian-gold text-2xl">
                      {review.dahabiya.hieroglyph || '𓇳'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-egyptian-gold/10 text-hieroglyph-brown border-egyptian-gold/30">
                      {review.dahabiya.name}
                    </Badge>
                  </div>

                  {review.title && (
                    <h3 className="font-bold text-hieroglyph-brown text-lg mb-3">
                      {review.title}
                    </h3>
                  )}
                </div>

                {/* Review Content */}
                <div className="px-6 pb-4">
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-egyptian-gold/30" />
                    <p className="text-gray-600 leading-relaxed pl-4 line-clamp-4">
                      {review.comment}
                    </p>
                  </div>
                </div>

                {/* Photos */}
                {review.photos.length > 0 && (
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-3 gap-2">
                      {review.photos.slice(0, 3).map((photo, photoIndex) => (
                        <div key={photoIndex} className="relative aspect-square overflow-hidden rounded-lg">
                          <Image
                            src={photo}
                            alt={`Review photo ${photoIndex + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 11vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-gray-500">
                    {review.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-egyptian-gold" />
                        <span>{review.location}</span>
                      </div>
                    )}
                    
                    {review.tripDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-egyptian-gold" />
                        <span>{new Date(review.tripDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Egyptian Decorative Border */}
                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-egyptian-gold/20">
                    <span className="text-egyptian-gold text-sm">𓏏</span>
                    <span className="text-egyptian-gold text-sm">𓇯</span>
                    <span className="text-egyptian-gold text-sm">𓊃</span>
                  </div>
                </CardContent>
              </PharaonicCard>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm border border-egyptian-gold/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="text-4xl text-egyptian-gold mb-4">𓊪</div>
            <h3 className="text-2xl font-bold text-hieroglyph-brown mb-3">
              Share Your Experience
            </h3>
            <p className="text-gray-600 mb-6">
              Have you sailed with us? Share your review and help future travelers discover 
              the magic of a Nile dahabiya journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profile">
                <Button className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Write a Review
                </Button>
              </Link>
              <Link href="/dahabiyat">
                <Button variant="outline" className="border-egyptian-gold/30 text-hieroglyph-brown hover:bg-egyptian-gold/10">
                  <span className="mr-2">𓇳</span>
                  View Our Fleet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
