"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart, Filter, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/ui/container';
import { PharaonicCard } from '@/components/ui/pharaonic-elements';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';

interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  hieroglyph?: string;
  color?: string;
  order: number;
  isActive: boolean;
  images: GalleryImage[];
  _count: {
    images: number;
  };
}

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  title?: string;
  description?: string;
  categoryId: string;
  category: GalleryCategory;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function EnhancedGalleryPage() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch categories and images
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      } else {
        toast.error('Failed to load gallery');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  // Get all images from all categories
  const allImages = categories.flatMap(cat => cat.images);

  // Filter images based on selected category and search term
  const filteredImages = allImages.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.categoryId === selectedCategory;
    const matchesSearch = !searchTerm || 
      image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setCurrentImageIndex(filteredImages.findIndex(img => img.id === image.id));
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentImageIndex - 1 + filteredImages.length) % filteredImages.length
      : (currentImageIndex + 1) % filteredImages.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-egyptian-gold animate-pulse mb-4">𓇳</div>
          <div className="text-xl text-hieroglyph-brown">Loading Gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-egyptian-gold to-sunset-orange overflow-hidden">
        <div className="absolute inset-0 bg-hieroglyph-brown/20"></div>
        <Container maxWidth="lg">
          <div className="relative z-10 text-center text-white">
            <div className="text-6xl font-bold mb-4">
              <span className="text-white">𓇳</span>
              <span className="mx-4">𓊪</span>
              <span className="text-white">𓈖</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
              Gallery
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover the timeless beauty of Egypt through our curated collection of memories and moments
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-white text-2xl">𓂀</span>
              <span className="text-white text-2xl">𓏏</span>
              <span className="text-white text-2xl">𓇯</span>
              <span className="text-white text-2xl">𓊃</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Controls Section */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-egyptian-gold/20">
        <Container maxWidth="lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hieroglyph-brown w-5 h-5" />
              <Input
                id="gallery-search"
                name="search"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-egyptian-gold/30 focus:border-egyptian-gold"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' 
                  ? 'bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90' 
                  : 'border-egyptian-gold/30 text-hieroglyph-brown hover:bg-egyptian-gold/10'
                }
              >
                <span className="mr-2">𓇳</span>
                All ({allImages.length})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id 
                    ? 'bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90' 
                    : 'border-egyptian-gold/30 text-hieroglyph-brown hover:bg-egyptian-gold/10'
                  }
                >
                  <span className="mr-2">{category.hieroglyph || '𓊪'}</span>
                  {category.name} ({category._count.images})
                </Button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' 
                  ? 'bg-egyptian-gold text-hieroglyph-brown' 
                  : 'border-egyptian-gold/30 text-hieroglyph-brown'
                }
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'masonry' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('masonry')}
                className={viewMode === 'masonry' 
                  ? 'bg-egyptian-gold text-hieroglyph-brown' 
                  : 'border-egyptian-gold/30 text-hieroglyph-brown'
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <Container maxWidth="lg">
          {filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl text-egyptian-gold mb-4">𓈖</div>
              <h3 className="text-2xl font-bold text-hieroglyph-brown mb-2">No Images Found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'columns-1 sm:columns-2 md:columns-3 lg:columns-4'
            }`}>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}
                >
                  <PharaonicCard className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border border-egyptian-gold/30">
                    <div className="relative aspect-square overflow-hidden" onClick={() => openLightbox(image)}>
                      <Image
                        src={image.url}
                        alt={image.alt || image.title || 'Gallery image'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-egyptian-gold/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                              <Heart className="w-5 h-5" />
                              <Download className="w-5 h-5" />
                            </div>
                            <div className="text-2xl">𓇳</div>
                          </div>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {image.isFeatured && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-egyptian-gold text-hieroglyph-brown">
                            <span className="mr-1">𓇳</span>
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Image Info */}
                    {(image.title || image.description) && (
                      <CardContent className="p-4">
                        {image.title && (
                          <h3 className="font-bold text-hieroglyph-brown mb-2">{image.title}</h3>
                        )}
                        {image.description && (
                          <p className="text-sm text-gray-600 mb-3">{image.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="border-egyptian-gold/30 text-hieroglyph-brown">
                            <span className="mr-1">{image.category.hieroglyph || '𓊪'}</span>
                            {image.category.name}
                          </Badge>
                          <div className="flex gap-1">
                            {image.tags.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </PharaonicCard>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-[10000] bg-egyptian-gold/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-egyptian-gold/40 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[10000] bg-egyptian-gold/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-egyptian-gold/40 transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[10000] bg-egyptian-gold/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-egyptian-gold/40 transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Egyptian decorative elements */}
            <div className="absolute top-4 left-4 text-egyptian-gold text-2xl animate-pulse">𓇳</div>
            <div className="absolute top-4 right-20 text-egyptian-gold text-2xl animate-pulse">𓊪</div>
            <div className="absolute bottom-4 left-4 text-egyptian-gold text-2xl animate-pulse">𓈖</div>
            <div className="absolute bottom-4 right-4 text-egyptian-gold text-2xl animate-pulse">𓂀</div>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt || selectedImage.title || 'Gallery image'}
                fill
                className="object-contain"
                quality={100}
                priority
                sizes="90vw"
              />
            </motion.div>

            {/* Image Info */}
            {(selectedImage.title || selectedImage.description) && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-hieroglyph-brown/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg max-w-md text-center">
                {selectedImage.title && (
                  <h3 className="font-bold mb-1">{selectedImage.title}</h3>
                )}
                {selectedImage.description && (
                  <p className="text-sm opacity-90">{selectedImage.description}</p>
                )}
                <div className="flex items-center justify-center gap-2 mt-2 text-egyptian-gold">
                  <span>{selectedImage.category.hieroglyph || '𓊪'}</span>
                  <span className="text-white">•</span>
                  <span className="text-sm">{selectedImage.category.name}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
