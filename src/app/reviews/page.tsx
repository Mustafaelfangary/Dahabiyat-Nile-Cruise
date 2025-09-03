"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { AnimatedSection, StaggeredAnimation } from '@/components/ui/animated-section';
import { Star, User, Calendar, Ship, Package, ThumbsUp, Filter } from 'lucide-react';
import {
  HieroglyphicText,
  EgyptianBorder,
  PharaohCard,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  RoyalCrown,
  PharaohButton,
  HieroglyphicDivider,
} from '@/components/ui/pharaonic-elements';

interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  authorImage?: string;
  date: string;
  type: 'dahabiya' | 'package';
  itemName: string;
  itemSlug: string;
  verified: boolean;
  helpful: number;
  photos?: string[];
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'dahabiya' | 'package'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reviews/all', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load reviews');
        }

        const data = await response.json();
        setReviews(data.reviews || []);
        setFilteredReviews(data.reviews || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  useEffect(() => {
    let filtered = reviews;

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(review => review.type === filter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, filter, sortBy]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-amber-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <div className="text-amber-800 text-2xl font-bold">𓇳 Loading Royal Reviews 𓇳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-amber-800 font-bold text-xl">Failed to Load Reviews 𓏏</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pharaonic-container relative overflow-hidden">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-ocean-blue-900 via-navy-blue-800 to-deep-blue-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/reviews-hero-bg.jpg"
            alt="Reviews Background"
            fill
            className="object-cover opacity-30"
          />
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white">
              {/* Hieroglyphic Egypt at top */}
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-amber-300 mb-4 drop-shadow-lg">
                  𓇳 𓈖 𓊪 𓏏 𓇳
                </div>
                <HieroglyphicDivider />
              </div>

              {/* Royal Crown */}
              <div className="flex justify-center mb-6">
                <RoyalCrown />
              </div>

              {/* Main Title */}
              <HieroglyphicText 
                text="Royal Reviews"
                className="text-5xl md:text-7xl font-bold mb-6 text-amber-100 drop-shadow-2xl"
              />

              {/* Subtitle */}
              <Typography 
                variant="h4" 
                className="text-2xl md:text-3xl mb-8 text-amber-200 font-light drop-shadow-lg"
              >
                𓊪 Testimonials from Fellow Travelers 𓊪
              </Typography>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                  <Star className="w-5 h-5 text-amber-300 mr-2" />
                  <span className="text-amber-100 font-medium">{averageRating.toFixed(1)} Average Rating</span>
                </div>
                <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                  <User className="w-5 h-5 text-amber-300 mr-2" />
                  <span className="text-amber-100 font-medium">{reviews.length} Reviews</span>
                </div>
              </div>

              {/* Description */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-black/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8 shadow-2xl">
                  <p className="text-xl md:text-2xl leading-relaxed text-amber-50 font-light">
                    Read authentic reviews from travelers who have experienced the magic of our dahabiyat and packages
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-b border-amber-200">
        <Container maxWidth="lg">
          <div className="flex flex-wrap justify-between items-center gap-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'contained' : 'outlined'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-amber-600 text-white' : 'border-amber-600 text-amber-600'}
              >
                All Reviews ({reviews.length})
              </Button>
              <Button
                variant={filter === 'dahabiya' ? 'contained' : 'outlined'}
                onClick={() => setFilter('dahabiya')}
                className={filter === 'dahabiya' ? 'bg-amber-600 text-white' : 'border-amber-600 text-amber-600'}
                startIcon={<Ship className="w-4 h-4" />}
              >
                Dahabiyat ({reviews.filter(r => r.type === 'dahabiya').length})
              </Button>
              <Button
                variant={filter === 'package' ? 'contained' : 'outlined'}
                onClick={() => setFilter('package')}
                className={filter === 'package' ? 'bg-amber-600 text-white' : 'border-amber-600 text-amber-600'}
                startIcon={<Package className="w-4 h-4" />}
              >
                Packages ({reviews.filter(r => r.type === 'package').length})
              </Button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'rating')}
                className="border border-amber-300 rounded-md px-3 py-2 bg-white text-amber-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </Container>
      </section>

      {/* Reviews Grid */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-deep-blue-50/30 relative">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.length === 0 ? (
                <div className="col-span-full">
                  <div className="text-center py-20">
                    <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>
                    <Typography variant="h5" className="text-amber-800 font-bold mb-4">
                      No Reviews Found
                    </Typography>
                    <Typography variant="body1" className="text-amber-700">
                      No reviews match your current filter. Try adjusting your selection.
                    </Typography>
                  </div>
                </div>
              ) : (
                filteredReviews.map((review, index) => (
                  <div key={review.id}>
                    <StaggeredAnimation>
                      <PharaohCard className="h-full hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              {review.authorImage && (
                                <Image
                                  src={review.authorImage}
                                  alt={review.author}
                                  width={40}
                                  height={40}
                                  className="rounded-full mr-3"
                                />
                              )}
                              <div>
                                <h4 className="font-bold text-amber-800">{review.author}</h4>
                                <div className="flex items-center gap-2">
                                  {renderStars(review.rating)}
                                  {review.verified && (
                                    <Chip
                                      label="Verified"
                                      size="small"
                                      className="bg-green-100 text-green-800"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <Chip
                              label={review.type === 'dahabiya' ? 'Dahabiya' : 'Package'}
                              size="small"
                              className={review.type === 'dahabiya' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}
                            />
                          </div>

                          {/* Item Name */}
                          <div className="mb-3">
                            <Link 
                              href={`/${review.type === 'dahabiya' ? 'dahabiyat' : 'packages'}/${review.itemSlug}`}
                              className="text-amber-700 hover:text-ocean-blue-600 font-medium underline"
                            >
                              {review.itemName}
                            </Link>
                          </div>

                          {/* Review Content */}
                          <p className="text-amber-800 mb-4 line-clamp-4">
                            {review.comment}
                          </p>

                          {/* Photos */}
                          {review.photos && review.photos.length > 0 && (
                            <div className="flex gap-2 mb-4">
                              {review.photos.slice(0, 3).map((photo, photoIndex) => (
                                <Image
                                  key={photoIndex}
                                  src={photo}
                                  alt={`Review photo ${photoIndex + 1}`}
                                  width={60}
                                  height={60}
                                  className="rounded-lg object-cover"
                                />
                              ))}
                              {review.photos.length > 3 && (
                                <div className="w-15 h-15 bg-amber-100 rounded-lg flex items-center justify-center text-amber-800 text-sm font-bold">
                                  +{review.photos.length - 3}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between text-sm text-amber-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(review.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {review.helpful} helpful
                            </div>
                          </div>
                        </CardContent>
                      </PharaohCard>
                      <span></span>
                    </StaggeredAnimation>
                  </div>
                ))
              )}
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}
