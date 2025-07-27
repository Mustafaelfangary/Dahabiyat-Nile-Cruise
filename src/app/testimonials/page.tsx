"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Container from '@/components/ui/container';
import { PharaonicCard } from '@/components/ui/pharaonic-elements';
import { 
  Star, 
  User,
  MapPin, 
  Calendar, 
  MessageSquare,
  Search,
  Filter,
  Quote
} from 'lucide-react';

interface Review {
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

interface Dahabiya {
  id: string;
  name: string;
  hieroglyph?: string;
}

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDahabiya, setSelectedDahabiya] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  useEffect(() => {
    fetchReviews();
    fetchDahabiyas();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews?status=APPROVED');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDahabiyas = async () => {
    try {
      const response = await fetch('/api/dahabiyat');
      if (response.ok) {
        const data = await response.json();
        setDahabiyas(data.dahabiyat || []);
      }
    } catch (error) {
      console.error('Error fetching dahabiyas:', error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchTerm || 
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.dahabiya.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDahabiya = !selectedDahabiya || review.dahabiya.id === selectedDahabiya;
    const matchesRating = !selectedRating || review.rating >= parseInt(selectedRating);
    
    return matchesSearch && matchesDahabiya && matchesRating;
  });

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

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-egyptian-gold animate-pulse mb-4">⭐</div>
          <div className="text-xl text-hieroglyph-brown">Loading testimonials...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pharaonic-container">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl text-egyptian-gold animate-pulse">⭐</div>
          <div className="absolute top-20 right-20 text-4xl text-sunset-orange animate-pulse">𓊪</div>
          <div className="absolute bottom-20 left-20 text-5xl text-egyptian-gold animate-pulse">𓈖</div>
          <div className="absolute bottom-10 right-10 text-6xl text-sunset-orange animate-pulse">𓂀</div>
        </div>

        <Container maxWidth="lg">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-egyptian-gold text-5xl animate-pulse">⭐</span>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary">
                Guest Testimonials
              </h1>
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
              Discover authentic experiences from our guests who have sailed the Nile aboard our luxury dahabiyas. 
              Each testimonial tells a story of wonder, comfort, and unforgettable memories.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-hieroglyph-brown">{reviews.length}</div>
                <div className="text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-hieroglyph-brown">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex">{renderStars(Math.round(averageRating))}</div>
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>

            <Link href="/profile">
              <Button className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90 text-lg px-8 py-3">
                <MessageSquare className="w-5 h-5 mr-2" />
                Share Your Review
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-y border-egyptian-gold/20">
        <Container maxWidth="lg">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDahabiya || 'ALL'} onValueChange={(value) => setSelectedDahabiya(value === 'ALL' ? '' : value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Dahabiyas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Dahabiyas</SelectItem>
                {dahabiyas.map((dahabiya) => (
                  <SelectItem key={dahabiya.id} value={dahabiya.id}>
                    <span className="mr-2">𓇳</span>
                    {dahabiya.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRating || 'ALL'} onValueChange={(value) => setSelectedRating(value === 'ALL' ? '' : value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars Only</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Container>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <Container maxWidth="lg">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl text-egyptian-gold mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-hieroglyph-brown mb-2">No Reviews Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedDahabiya || selectedRating 
                  ? 'Try adjusting your filters to see more reviews.'
                  : 'Be the first to share your experience with us!'
                }
              </p>
              <Link href="/profile">
                <Button className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Write the First Review
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReviews.map((review, index) => (
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
                        <p className="text-gray-600 leading-relaxed pl-4">
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
          )}
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <Container maxWidth="lg">
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm border border-egyptian-gold/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-4xl text-egyptian-gold mb-4">𓊪</div>
              <h3 className="text-2xl font-bold text-hieroglyph-brown mb-3">
                Share Your Nile Experience
              </h3>
              <p className="text-gray-600 mb-6">
                Have you sailed with us? Your review helps future travelers discover 
                the magic of a luxury Nile dahabiya journey.
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
                    Explore Our Fleet
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
