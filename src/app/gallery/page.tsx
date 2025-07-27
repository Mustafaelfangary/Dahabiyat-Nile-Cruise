"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Container, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { AnimatedSection, StaggeredAnimation } from '@/components/ui/animated-section';
import { Camera, Eye, Heart, Download, Filter, Ship, Package, MapPin } from 'lucide-react';
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

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  category: 'dahabiya' | 'package' | 'destination' | 'experience';
  itemName?: string;
  itemSlug?: string;
  location?: string;
  photographer?: string;
  likes: number;
  views: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'dahabiya' | 'package' | 'destination' | 'experience'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load gallery');
        }

        const data = await response.json();
        setImages(data.images || []);
        setFilteredImages(data.images || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gallery');
        // Set mock data on error
        const mockImages: GalleryImage[] = [
          {
            id: '1',
            url: '/images/gallery/dahabiya-1.jpg',
            alt: 'Luxury Dahabiya',
            caption: 'Princess Cleopatra sailing on the Nile',
            category: 'dahabiya',
            location: 'Nile River, Egypt',
            likes: 45,
            views: 1250
          },
          {
            id: '2',
            url: '/images/gallery/temple-1.jpg',
            alt: 'Ancient Temple',
            caption: 'Karnak Temple Complex',
            category: 'destination',
            location: 'Luxor, Egypt',
            likes: 67,
            views: 2100
          }
        ];
        setImages(mockImages);
        setFilteredImages(mockImages);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(image => image.category === filter));
    }
  }, [images, filter]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dahabiya':
        return <Ship className="w-4 h-4" />;
      case 'package':
        return <Package className="w-4 h-4" />;
      case 'destination':
        return <MapPin className="w-4 h-4" />;
      case 'experience':
        return <Camera className="w-4 h-4" />;
      default:
        return <Camera className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dahabiya':
        return 'bg-amber-100 text-amber-800';
      case 'package':
        return 'bg-orange-100 text-orange-800';
      case 'destination':
        return 'bg-yellow-100 text-yellow-800';
      case 'experience':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-50 text-amber-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <div className="text-amber-800 text-2xl font-bold">𓇳 Loading Royal Gallery 𓇳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-amber-800 font-bold text-xl">Failed to Load Gallery 𓏏</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 relative overflow-hidden">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery-hero-bg.jpg"
            alt="Gallery Background"
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
                <RoyalCrown size="large" />
              </div>

              {/* Main Title */}
              <HieroglyphicText
                text="Royal Gallery"
                className="text-5xl md:text-7xl font-bold mb-6 text-amber-100 drop-shadow-2xl"
              />

              {/* Subtitle */}
              <Typography
                variant="h4"
                className="text-2xl md:text-3xl mb-8 text-amber-200 font-light drop-shadow-lg"
              >
                𓊪 Captured Moments of Egyptian Splendor 𓊪
              </Typography>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                  <Camera className="w-5 h-5 text-amber-300 mr-2" />
                  <span className="text-amber-100 font-medium">{images.length} Photos</span>
                </div>
                <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                  <Eye className="w-5 h-5 text-amber-300 mr-2" />
                  <span className="text-amber-100 font-medium">
                    {images.reduce((sum, img) => sum + img.views, 0).toLocaleString()} Views
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-black/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8 shadow-2xl">
                  <p className="text-xl md:text-2xl leading-relaxed text-amber-50 font-light">
                    Explore our collection of stunning photographs showcasing the beauty of our dahabiyat, the majesty of ancient Egypt, and unforgettable travel experiences
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
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={filter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-amber-600 text-white' : 'border-amber-600 text-amber-600'}
              startIcon={<Filter className="w-4 h-4" />}
            >
              All ({images.length})
            </Button>
            <Button
              variant={filter === 'dahabiya' ? 'contained' : 'outlined'}
              onClick={() => setFilter('dahabiya')}
              className={filter === 'dahabiya' ? 'bg-amber-600 text-white' : 'border-amber-600 text-amber-600'}
              startIcon={<Ship className="w-4 h-4" />}
            >
              Dahabiyat ({images.filter(img => img.category === 'dahabiya').length})
            </Button>
            <Button
              variant={filter === 'package' ? 'contained' : 'outlined'}
              onClick={() => setFilter('package')}
              className={filter === 'package' ? 'bg-amber-600 text-white' : 'border-amber-600 text-amber-600'}
              startIcon={<Package className="w-4 h-4" />}
            >
              Packages ({images.filter(img => img.category === 'package').length})
            </Button>
            <Button
              variant={filter === 'destination' ? 'contained' : 'outlined'}
              onClick={() => setFilter('destination')}
              className={filter === 'destination' ? 'bg-amber-600 text-white' : 'border-amber-600 text-amber-600'}
              startIcon={<MapPin className="w-4 h-4" />}
            >
              Destinations ({images.filter(img => img.category === 'destination').length})
            </Button>
            <Button
              variant={filter === 'experience' ? 'contained' : 'outlined'}
              onClick={() => setFilter('experience')}
              className={filter === 'experience' ? 'bg-amber-600 text-white' : 'border-amber-600 text-amber-600'}
              startIcon={<Camera className="w-4 h-4" />}
            >
              Experiences ({images.filter(img => img.category === 'experience').length})
            </Button>
          </div>
        </Container>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-amber-50/30 relative">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <Grid container spacing={3}>
              {filteredImages.length === 0 ? (
                <Grid size={12}>
                  <div className="text-center py-20">
                    <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>
                    <Typography variant="h5" className="text-amber-800 font-bold mb-4">
                      No Images Found
                    </Typography>
                    <Typography variant="body1" className="text-amber-700">
                      No images match your current filter. Try adjusting your selection.
                    </Typography>
                  </div>
                </Grid>
              ) : (
                filteredImages.map((image, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id}>
                    <StaggeredAnimation delay={index * 0.05}>
                      <div
                        className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                        onClick={() => setSelectedImage(image)}
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                              <Eye className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm font-medium">View Image</p>
                            </div>
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <Chip
                              label={image.category}
                              size="small"
                              className={getCategoryColor(image.category)}
                              icon={getCategoryIcon(image.category)}
                            />
                          </div>

                          {/* Stats */}
                          <div className="absolute bottom-3 right-3 flex gap-2">
                            <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center text-white text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              {image.views}
                            </div>
                            <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center text-white text-xs">
                              <Heart className="w-3 h-3 mr-1" />
                              {image.likes}
                            </div>
                          </div>
                        </div>

                        {/* Caption */}
                        {image.caption && (
                          <div className="p-3 bg-white">
                            <p className="text-sm text-amber-800 font-medium line-clamp-2">
                              {image.caption}
                            </p>
                            {image.location && (
                              <p className="text-xs text-amber-600 mt-1">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {image.location}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </StaggeredAnimation>
                  </Grid>
                ))
              )}
            </Grid>
          </AnimatedSection>
        </Container>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/80 transition-colors"
            >
              ✕
            </button>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm text-white rounded-lg p-4">
              <h3 className="font-bold mb-2">{selectedImage.caption || selectedImage.alt}</h3>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {selectedImage.views} views
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {selectedImage.likes} likes
                  </span>
                </div>
                {selectedImage.photographer && (
                  <span>Photo by {selectedImage.photographer}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}