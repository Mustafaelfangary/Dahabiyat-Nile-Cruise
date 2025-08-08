"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Tab,
  Tabs,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Users, DollarSign, Calendar, MapPin, Star, Anchor, Play,
  Wifi, Car, Utensils, Sparkles, Camera, Music, Book, Award,
  Route, Clock, Shield, Heart, Compass, Sun, Ruler, Ship,
  Crown, Gem, Waves, Mountain, Eye, Film, Image as ImageIcon,
  ArrowLeft, Share, ChevronDown, X, Activity, Navigation,
  TreePine, Sunset, Palette, ChevronRight, Download
} from 'lucide-react';
import DahabiyaItineraries from './DahabiyaItineraries';
import UnifiedBookingForm from '@/components/UnifiedBookingForm';

interface Dahabiya {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  cabins?: number;
  crew?: number;
  length?: number;
  width?: number;
  yearBuilt?: number;
  mainImage?: string;
  gallery: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  features: string[];
  amenities?: string[];
  activities?: string[];
  diningOptions?: string[];
  services?: string[];
  routes?: string[];
  highlights?: string[];
  category?: 'LUXURY' | 'DELUXE' | 'PREMIUM' | 'BOUTIQUE';
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
}

interface DahabiyaDetailProps {
  slug: string;
}

// Helper function to convert YouTube URL to embed format
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';

  // Handle different YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // If no pattern matches, return the original URL
  return url;
};

export default function DahabiyaDetail({ slug }: DahabiyaDetailProps) {
  const [dahabiya, setDahabiya] = useState<Dahabiya | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loadingItineraries, setLoadingItineraries] = useState(false);

  useEffect(() => {
    const fetchDahabiya = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dahabiyas/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Dahabiya not found');
          }
          throw new Error('Failed to fetch dahabiya');
        }

        const data = await response.json();
        setDahabiya(data);
        setSelectedImage(data.mainImage || data.gallery[0] || '');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setDahabiya(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchItineraries = async () => {
      try {
        setLoadingItineraries(true);
        const response = await fetch('/api/itineraries');
        if (response.ok) {
          const data = await response.json();
          setItineraries(data);
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      } finally {
        setLoadingItineraries(false);
      }
    };

    fetchDahabiya();
    fetchItineraries();
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryStyle = (category?: string) => {
    switch (category) {
      case 'LUXURY': return { bg: '#e3f2fd', color: '#1976d2', label: 'Luxury' };
      case 'PREMIUM': return { bg: '#e0e7ff', color: '#6366f1', label: 'Premium' };
      case 'BOUTIQUE': return { bg: '#e1f5fe', color: '#0277bd', label: 'Boutique' };
      default: return { bg: '#f3e5f5', color: '#7b1fa2', label: 'Deluxe' };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'LUXURY': return { bg: '#e3f2fd', color: '#1976d2', label: 'Luxury' };
      case 'DELUXE': return { bg: '#f3e5f5', color: '#7b1fa2', label: 'Deluxe' };
      case 'PREMIUM': return { bg: '#e8f5e8', color: '#388e3c', label: 'Premium' };
      case 'BOUTIQUE': return { bg: '#fff3e0', color: '#f57c00', label: 'Boutique' };
      default: return { bg: '#f3e5f5', color: '#7b1fa2', label: 'Deluxe' };
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const downloadFactSheet = async () => {
    if (!dahabiya) return;

    try {
      const response = await fetch(`/api/dahabiyas/${dahabiya.id}/fact-sheet`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dahabiya.name || 'dahabiya'}-fact-sheet.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download fact sheet');
      }
    } catch (error) {
      console.error('Error downloading fact sheet:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="min-h-screen flex items-center justify-center">
        <Box textAlign="center">
          <CircularProgress size={60} className="text-ocean-blue" />
          <Typography variant="h6" className="mt-4 text-hieroglyph-brown">
            Loading vessel details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !dahabiya) {
    return (
      <Container maxWidth="lg" className="min-h-screen flex items-center justify-center">
        <Box textAlign="center">
          <Typography variant="h4" className="text-hieroglyph-brown font-bold mb-4">
            Sacred Vessel Not Found
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-8">
            {error || 'The requested dahabiya could not be found.'}
          </Typography>
          <Link href="/dahabiyas">
            <Button variant="contained" className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-amber">
              Return to Fleet
            </Button>
          </Link>
        </Box>
      </Container>
    );
  }

  // Combine main image and gallery for display
  const allImages = [
    ...(dahabiya.mainImage ? [dahabiya.mainImage] : []),
    ...(dahabiya.gallery || [])
  ].filter((img, index, arr) => img && arr.indexOf(img) === index);

  const categoryInfo = getCategoryColor(dahabiya.category || 'DELUXE');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      {/* Enhanced Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={selectedImage || dahabiya.mainImage || '/images/placeholder-dahabiya.jpg'}
            alt={dahabiya.name}
            fill
            className="object-cover transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="flex justify-between items-center">
            <Link href="/dahabiyas">
              <IconButton className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50">
                <ArrowLeft />
              </IconButton>
            </Link>
            <div className="flex gap-2">
              <IconButton className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50">
                <Share />
              </IconButton>
              <IconButton className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50">
                <Heart />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Container maxWidth="lg">
            <div className="text-center text-white">
              {/* Hieroglyphic Symbol */}
              <Typography variant="h3" className="text-ocean-blue mb-4 animate-pulse drop-shadow-lg">
                𓊪
              </Typography>

              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-ocean-blue to-blue-400 text-white px-8 py-3 rounded-full font-bold mb-6 shadow-lg border-2 border-white/20 backdrop-blur-sm">
                <Crown size={18} className="drop-shadow-sm" />
                <span className="text-lg tracking-wide">{categoryInfo.label.toUpperCase()} CATEGORY</span>
                {dahabiya.isFeatured && <Star size={18} className="text-white drop-shadow-sm" />}
              </div>

              {/* Title */}
              <Typography variant="h2" className="font-bold mb-6 text-white leading-tight" style={{
                textShadow: '3px 3px 8px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.3)',
                color: '#FFFFFF'
              }}>
                {dahabiya.name}
              </Typography>

              {/* Subtitle */}
              <Typography variant="h5" className="mb-8 text-white font-semibold" style={{
                textShadow: '2px 2px 6px rgba(0,0,0,0.8), 0 0 15px rgba(255,255,255,0.2)',
                color: '#FFFFFF'
              }}>
                {dahabiya.name} DAHABIYA SAIL LIKE A PHARAOHS
              </Typography>
              
              {/* Key Stats */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Chip
                  icon={<Users size={18} className="text-white" />}
                  label={`${dahabiya.capacity} Guests`}
                  className="font-semibold px-6 py-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  variant="outlined"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.9) 0%, rgba(0, 102, 204, 0.8) 50%, rgba(0, 68, 153, 0.9) 100%)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    boxShadow: '0 8px 25px rgba(0, 128, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  }}
                />
                {dahabiya.cabins && (
                  <Chip
                    icon={<Ship size={18} className="text-white" />}
                    label={`${dahabiya.cabins} Cabins`}
                    className="font-semibold px-6 py-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    variant="outlined"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.9) 0%, rgba(0, 102, 204, 0.8) 50%, rgba(0, 68, 153, 0.9) 100%)',
                      backdropFilter: 'blur(15px)',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      color: '#FFFFFF',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      boxShadow: '0 8px 25px rgba(0, 128, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    }}
                  />
                )}
                {dahabiya.length && (
                  <Chip
                    icon={<Ruler size={18} className="text-white" />}
                    label={`${dahabiya.length}m Length`}
                    className="font-semibold px-6 py-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    variant="outlined"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.9) 0%, rgba(0, 102, 204, 0.8) 50%, rgba(0, 68, 153, 0.9) 100%)',
                      backdropFilter: 'blur(15px)',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      color: '#FFFFFF',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      boxShadow: '0 8px 25px rgba(0, 128, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    }}
                  />
                )}
                <Chip
                  icon={<DollarSign size={18} className="text-white" />}
                  label={`From ${formatPrice(dahabiya.pricePerDay)}/day`}
                  className="font-bold px-8 py-4 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #0080ff 0%, #0066cc 30%, #3399ff 70%, #0080ff 100%)',
                    color: '#FFFFFF',
                    border: '3px solid rgba(255, 255, 255, 0.9)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    boxShadow: '0 12px 35px rgba(0, 128, 255, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4), 0 0 30px rgba(0, 128, 255, 0.3)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                />
              </div>
              
              {/* Rating */}
              {dahabiya.rating && dahabiya.rating > 0 && (
                <div className="flex justify-center items-center gap-4 mb-8 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 shadow-lg">
                  <Rating
                    value={dahabiya.rating}
                    readOnly
                    precision={0.1}
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#0080ff',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      },
                      '& .MuiRating-iconEmpty': {
                        color: 'rgba(255,255,255,0.3)'
                      }
                    }}
                  />
                  <Typography variant="h6" className="text-white font-bold text-shadow-lg">
                    {dahabiya.rating.toFixed(1)}
                  </Typography>
                  <Typography variant="body1" className="text-white/90 font-medium">
                    ({dahabiya.reviewCount} reviews)
                  </Typography>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-6">
                <Button
                  variant="contained"
                  size="large"
                  className="font-bold px-12 py-5 rounded-2xl transform hover:scale-110 transition-all duration-300 text-lg"
                  startIcon={<Crown size={22} className="text-white" />}
                  onClick={() => {
                    const bookingSection = document.getElementById('booking-section');
                    if (bookingSection) {
                      bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #0080ff 0%, #0066cc 25%, #004499 50%, #003366 75%, #002244 100%)',
                    color: '#FFFFFF',
                    border: '3px solid rgba(255, 255, 255, 0.9)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    boxShadow: '0 15px 40px rgba(0, 128, 255, 0.7), inset 0 3px 0 rgba(255, 255, 255, 0.4), 0 0 40px rgba(0, 128, 255, 0.4)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0099ff 0%, #0080ff 25%, #0066cc 50%, #004499 75%, #003366 100%)',
                      boxShadow: '0 20px 50px rgba(0, 128, 255, 0.8), inset 0 3px 0 rgba(255, 255, 255, 0.5), 0 0 50px rgba(0, 128, 255, 0.6)',
                      transform: 'scale(1.1) translateY(-2px)'
                    }
                  }}
                >
                  Book Dahabiya
                </Button>

                {dahabiya.videoUrl && (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setShowVideo(true)}
                    className="font-semibold px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-300"
                    startIcon={<Play size={20} className="text-white" />}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.3) 0%, rgba(0, 102, 204, 0.2) 50%, rgba(0, 68, 153, 0.3) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      color: '#FFFFFF',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      boxShadow: '0 8px 25px rgba(0, 128, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.5) 0%, rgba(0, 102, 204, 0.4) 50%, rgba(0, 68, 153, 0.5) 100%)',
                        border: '2px solid rgba(0, 153, 255, 0.9)',
                        boxShadow: '0 12px 35px rgba(0, 128, 255, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4)'
                      }
                    }}
                  >
                    Watch Video
                  </Button>
                )}

                {dahabiya.virtualTourUrl && (
                  <Button
                    variant="outlined"
                    size="large"
                    component="a"
                    href={dahabiya.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-300"
                    startIcon={<Eye size={20} className="text-white" />}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.3) 0%, rgba(0, 102, 204, 0.2) 50%, rgba(0, 68, 153, 0.3) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      color: '#FFFFFF',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      boxShadow: '0 8px 25px rgba(0, 128, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.5) 0%, rgba(0, 102, 204, 0.4) 50%, rgba(0, 68, 153, 0.5) 100%)',
                        border: '2px solid rgba(0, 153, 255, 0.9)',
                        boxShadow: '0 12px 35px rgba(0, 128, 255, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4)'
                      }
                    }}
                  >
                    Virtual Tour
                  </Button>
                )}

                {/* Download Fact Sheet Button */}
                <Button
                  variant="outlined"
                  size="large"
                  onClick={downloadFactSheet}
                  className="font-semibold px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-300"
                  startIcon={<Download size={20} className="text-white" />}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(16, 185, 129, 0.2) 50%, rgba(5, 150, 105, 0.3) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.5) 0%, rgba(16, 185, 129, 0.4) 50%, rgba(5, 150, 105, 0.5) 100%)',
                      border: '2px solid rgba(16, 185, 129, 0.9)',
                      boxShadow: '0 12px 35px rgba(34, 197, 94, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4)'
                    }
                  }}
                >
                  Download Fact Sheet
                </Button>
              </div>
            </div>
          </Container>
        </div>

        {/* Gallery Navigation */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex gap-2 bg-black/50 backdrop-blur-md rounded-full p-2 shadow-lg border border-white/20">
              {allImages.slice(0, 8).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                    selectedImage === image
                      ? 'bg-gradient-to-r from-ocean-blue to-blue-400 border-white scale-125 shadow-lg shadow-ocean-blue/60'
                      : 'bg-white/80 border-white/70 hover:bg-gradient-to-r hover:from-ocean-blue/70 hover:to-blue-400/70 hover:border-ocean-blue hover:scale-110 hover:shadow-md hover:shadow-ocean-blue/40'
                  }`}
                  style={{
                    boxShadow: selectedImage === image
                      ? '0 4px 15px rgba(0, 128, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                      : '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                />
              ))}
              {allImages.length > 8 && (
                <Button
                  size="small"
                  onClick={() => setShowGallery(true)}
                  className="text-xs ml-2 rounded-full px-3 py-1 font-bold transition-all duration-300 hover:scale-110"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.8) 0%, rgba(0, 102, 204, 0.7) 100%)',
                    color: '#FFFFFF',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                    boxShadow: '0 4px 15px rgba(0, 128, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0080ff 0%, #0066cc 100%)',
                      boxShadow: '0 6px 20px rgba(0, 128, 255, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                    }
                  }}
                >
                  +{allImages.length - 8}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Sections */}
      <Container maxWidth="lg" className="py-16">
        {/* Tabs Navigation */}
        <Paper elevation={0} className="mb-8 rounded-2xl overflow-hidden" sx={{
          background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.1) 0%, rgba(0, 102, 204, 0.05) 50%, rgba(0, 68, 153, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 128, 255, 0.2)'
        }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className="px-4 py-2"
            sx={{
              '& .MuiTab-root': {
                color: '#8B4513',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                minHeight: '60px',
                padding: '12px 24px',
                margin: '0 8px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(0, 128, 255, 0.2) 0%, rgba(0, 102, 204, 0.15) 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 15px rgba(0, 128, 255, 0.3)'
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #0080ff 0%, #0066cc 50%, #004499 100%)',
                  color: '#FFFFFF',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  boxShadow: '0 6px 20px rgba(0, 128, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab label="Overview" />
            <Tab label="Features & Amenities" />
            <Tab label="Specifications" />
            <Tab label="Activities" />
            <Tab label="Routes & Highlights" />
            <Tab label="Gallery" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={4}>
            {/* Description */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card elevation={2} className="h-full">
                <CardContent className="p-6">
                  <Typography variant="h4" className="text-hieroglyph-brown font-bold mb-4 flex items-center gap-2">
                    <Crown className="text-ocean-blue" />
                    About {dahabiya.name}
                  </Typography>
                  <Typography variant="body1" className="text-gray-700 leading-relaxed mb-6">
                    {dahabiya.description}
                  </Typography>

                  {/* Key Features */}
                  {dahabiya.features && dahabiya.features.length > 0 && (
                    <div className="mb-6">
                      <Typography variant="h6" className="text-hieroglyph-brown font-semibold mb-3">
                        Key Features
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {dahabiya.features.map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            className="bg-ocean-blue/10 text-hieroglyph-brown border border-ocean-blue/30"
                            variant="outlined"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Info */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2} className="h-full">
                <CardContent className="p-6">
                  <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-4">
                    Quick Information
                  </Typography>

                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Users className="text-ocean-blue" size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Capacity"
                        secondary={`${dahabiya.capacity} guests`}
                      />
                    </ListItem>

                    {dahabiya.cabins && (
                      <ListItem>
                        <ListItemIcon>
                          <Ship className="text-ocean-blue" size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Cabins"
                          secondary={`${dahabiya.cabins} cabins`}
                        />
                      </ListItem>
                    )}

                    {dahabiya.crew && (
                      <ListItem>
                        <ListItemIcon>
                          <Users className="text-ocean-blue" size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Crew"
                          secondary={`${dahabiya.crew} members`}
                        />
                      </ListItem>
                    )}

                    {dahabiya.length && (
                      <ListItem>
                        <ListItemIcon>
                          <Ruler className="text-ocean-blue" size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Length"
                          secondary={`${dahabiya.length} meters`}
                        />
                      </ListItem>
                    )}

                    {dahabiya.yearBuilt && (
                      <ListItem>
                        <ListItemIcon>
                          <Calendar className="text-ocean-blue" size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Year Built"
                          secondary={dahabiya.yearBuilt}
                        />
                      </ListItem>
                    )}

                    <ListItem>
                      <ListItemIcon>
                        <DollarSign className="text-ocean-blue" size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Price"
                        secondary={
                          <Typography variant="body2" className="font-bold">
                            {`${formatPrice(dahabiya.pricePerDay)} per day`}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>

                  <Divider className="my-4" />

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    className="bg-ocean-blue text-white hover:bg-blue-600 font-semibold"
                    startIcon={<Crown />}
                    onClick={() => {
                      const bookingSection = document.getElementById('booking-section');
                      if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Features & Amenities Tab */}
        {activeTab === 1 && (
          <Grid container spacing={4}>
            {dahabiya.amenities && dahabiya.amenities.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={2}>
                  <CardContent className="p-6">
                    <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="text-ocean-blue" />
                      Amenities
                    </Typography>
                    <List>
                      {dahabiya.amenities.map((amenity, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Gem className="text-ocean-blue" size={16} />
                          </ListItemIcon>
                          <ListItemText primary={amenity} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {dahabiya.diningOptions && dahabiya.diningOptions.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={2}>
                  <CardContent className="p-6">
                    <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-4 flex items-center gap-2">
                      <Utensils className="text-ocean-blue" />
                      Dining Options
                    </Typography>
                    <List>
                      {dahabiya.diningOptions.map((option, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Utensils className="text-ocean-blue" size={16} />
                          </ListItemIcon>
                          <ListItemText primary={option} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {dahabiya.services && dahabiya.services.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Card elevation={2}>
                  <CardContent className="p-6">
                    <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-4 flex items-center gap-2">
                      <Shield className="text-ocean-blue" />
                      Services
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dahabiya.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Award className="text-ocean-blue" size={16} />
                          <Typography variant="body2">{service}</Typography>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}

        {/* Specifications Tab */}
        {activeTab === 2 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={2}>
                <CardContent className="p-6">
                  <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-4 flex items-center gap-2">
                    <Ruler className="text-ocean-blue" />
                    Vessel Specifications
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Users className="text-ocean-blue" size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Maximum Capacity"
                        secondary={`${dahabiya.capacity} guests`}
                      />
                    </ListItem>

                    {dahabiya.cabins && (
                      <ListItem>
                        <ListItemIcon>
                          <Ship className="text-ocean-blue" size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Cabins"
                          secondary={`${dahabiya.cabins} luxury cabins`}
                        />
                      </ListItem>
                    )}

                    {dahabiya.crew && (
                      <ListItem>
                        <ListItemIcon>
                          <Users className="text-ocean-blue" size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Crew Members"
                          secondary={`${dahabiya.crew} professional crew`}
                        />
                      </ListItem>
                    )}

                    {dahabiya.length && (
                      <ListItem>
                        <ListItemIcon>
                          <Ruler className="text-ocean-blue" size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Length"
                          secondary={`${dahabiya.length} meters`}
                        />
                      </ListItem>
                    )}

                    {dahabiya.width && (
                      <ListItem>
                        <ListItemIcon>
                          <Ruler className="text-ocean-blue" size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Width"
                          secondary={`${dahabiya.width} meters`}
                        />
                      </ListItem>
                    )}

                    {dahabiya.yearBuilt && (
                      <ListItem>
                        <ListItemIcon>
                          <Calendar className="text-ocean-blue" size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Year Built"
                          secondary={dahabiya.yearBuilt}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={2}>
                <CardContent className="p-6">
                  <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-4 flex items-center gap-2">
                    <Crown className="text-ocean-blue" />
                    Category & Rating
                  </Typography>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Typography variant="body1">Category</Typography>
                      <Chip
                        label={getCategoryStyle(dahabiya.category || 'DELUXE').label}
                        style={{
                          backgroundColor: getCategoryStyle(dahabiya.category || 'DELUXE').bg,
                          color: getCategoryStyle(dahabiya.category || 'DELUXE').color,
                        }}
                      />
                    </div>

                    {(dahabiya.rating || 0) > 0 && (
                      <div className="flex items-center justify-between">
                        <Typography variant="body1">Rating</Typography>
                        <div className="flex items-center gap-2">
                          <Star className="text-ocean-blue" size={20} />
                          <Typography variant="body1">{(dahabiya.rating || 0).toFixed(1)}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            ({dahabiya.reviewCount || 0} reviews)
                          </Typography>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Typography variant="body1">Price per Day</Typography>
                      <Typography variant="h6" className="text-ocean-blue font-bold">
                        {formatPrice(dahabiya.pricePerDay)}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Activities Tab */}
        {activeTab === 3 && (
          <Grid container spacing={4}>
            {dahabiya.activities && dahabiya.activities.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Card elevation={2}>
                  <CardContent className="p-6">
                    <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-6 flex items-center gap-2">
                      <Activity className="text-ocean-blue" />
                      Onboard Activities & Experiences
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dahabiya.activities.map((activity, index) => (
                        <div key={index} className="bg-gradient-to-br from-ocean-blue/10 to-blue-50 rounded-lg p-4 border border-ocean-blue/20 hover:border-ocean-blue/40 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="bg-ocean-blue/20 rounded-full p-2 flex-shrink-0">
                              <TreePine className="text-ocean-blue" size={16} />
                            </div>
                            <div>
                              <Typography variant="body1" className="font-semibold text-hieroglyph-brown">
                                {activity}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Related Itineraries */}
            <Grid size={{ xs: 12 }}>
              <Card elevation={2}>
                <CardContent className="p-6">
                  <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-6 flex items-center gap-2">
                    <Navigation className="text-ocean-blue" />
                    Available Itineraries
                  </Typography>
                  {loadingItineraries ? (
                    <div className="flex justify-center py-8">
                      <CircularProgress size={40} className="text-ocean-blue" />
                    </div>
                  ) : itineraries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {itineraries.slice(0, 6).map((itinerary) => (
                        <div key={itinerary.id} className="bg-white rounded-lg border border-ocean-blue/20 hover:border-ocean-blue/40 transition-all duration-300 hover:shadow-lg overflow-hidden">
                          {itinerary.mainImageUrl && (
                            <div className="aspect-video relative overflow-hidden">
                              <Image
                                src={itinerary.mainImageUrl}
                                alt={itinerary.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-2 line-clamp-1">
                              {itinerary.name}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600 mb-3 line-clamp-2">
                              {itinerary.shortDescription || itinerary.description}
                            </Typography>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="text-ocean-blue" size={16} />
                                <Typography variant="body2">{itinerary.durationDays} days</Typography>
                              </div>
                              {itinerary.maxGuests && (
                                <div className="flex items-center gap-2">
                                  <Users className="text-ocean-blue" size={16} />
                                  <Typography variant="body2">Max {itinerary.maxGuests}</Typography>
                                </div>
                              )}
                            </div>
                            {itinerary.price && (
                              <div className="flex items-center justify-between mb-3">
                                <Typography variant="body2" color="textSecondary">Starting from</Typography>
                                <Typography variant="h6" className="text-ocean-blue font-bold">
                                  ${itinerary.price.toLocaleString()}
                                </Typography>
                              </div>
                            )}
                            <Link href={`/itineraries/${itinerary.slug}`}>
                              <Button
                                variant="outlined"
                                fullWidth
                                className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white"
                                endIcon={<ChevronRight size={16} />}
                              >
                                View Itinerary
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Compass className="text-ocean-blue mx-auto mb-4" size={48} />
                      <Typography variant="body1" color="textSecondary">
                        No itineraries available at the moment
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Routes & Highlights Tab */}
        {activeTab === 4 && (
          <Grid container spacing={4}>
            {dahabiya.routes && dahabiya.routes.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={2}>
                  <CardContent className="p-6">
                    <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-4 flex items-center gap-2">
                      <Route className="text-ocean-blue" />
                      Available Routes
                    </Typography>
                    <div className="space-y-4">
                      {dahabiya.routes.map((route, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 rounded-full p-2">
                              <Navigation className="text-blue-600" size={16} />
                            </div>
                            <Typography variant="body1" className="font-semibold text-blue-900">
                              {route}
                            </Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {dahabiya.highlights && dahabiya.highlights.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={2}>
                  <CardContent className="p-6">
                    <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-4 flex items-center gap-2">
                      <Star className="text-ocean-blue" />
                      Key Highlights
                    </Typography>
                    <div className="space-y-4">
                      {dahabiya.highlights.map((highlight, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 rounded-full p-2">
                              <Sunset className="text-blue-600" size={16} />
                            </div>
                            <Typography variant="body1" className="font-semibold text-blue-900">
                              {highlight}
                            </Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Scenic Views & Attractions */}
            <Grid size={{ xs: 12 }}>
              <Card elevation={2}>
                <CardContent className="p-6">
                  <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-6 flex items-center gap-2">
                    <Mountain className="text-ocean-blue" />
                    Scenic Views & Cultural Attractions
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gradient-to-b from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                      <div className="bg-purple-500/20 rounded-full p-3 w-fit mx-auto mb-3">
                        <Mountain className="text-purple-600" size={24} />
                      </div>
                      <Typography variant="h6" className="text-purple-900 font-bold mb-2">
                        Ancient Temples
                      </Typography>
                      <Typography variant="body2" className="text-purple-700">
                        Visit magnificent temples along the Nile
                      </Typography>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-b from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="bg-green-500/20 rounded-full p-3 w-fit mx-auto mb-3">
                        <TreePine className="text-green-600" size={24} />
                      </div>
                      <Typography variant="h6" className="text-green-900 font-bold mb-2">
                        Lush Landscapes
                      </Typography>
                      <Typography variant="body2" className="text-green-700">
                        Enjoy verdant riverbanks and oases
                      </Typography>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-ocean-blue-lightest rounded-lg border border-blue-200">
                      <div className="bg-ocean-blue/20 rounded-full p-3 w-fit mx-auto mb-3">
                        <Sunset className="text-ocean-blue" size={24} />
                      </div>
                      <Typography variant="h6" className="text-ocean-blue font-bold mb-2">
                        Sunset Views
                      </Typography>
                      <Typography variant="body2" className="text-blue-700">
                        Witness breathtaking Nile sunsets
                      </Typography>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-b from-pink-50 to-rose-50 rounded-lg border border-pink-200">
                      <div className="bg-pink-500/20 rounded-full p-3 w-fit mx-auto mb-3">
                        <Palette className="text-pink-600" size={24} />
                      </div>
                      <Typography variant="h6" className="text-pink-900 font-bold mb-2">
                        Cultural Sites
                      </Typography>
                      <Typography variant="body2" className="text-pink-700">
                        Explore authentic Egyptian culture
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Gallery Tab */}
        {activeTab === 5 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <Card elevation={2}>
                <CardContent className="p-6">
                  <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-6 flex items-center gap-2">
                    <Camera className="text-ocean-blue" />
                    Photo Gallery
                  </Typography>
                  {dahabiya.gallery && dahabiya.gallery.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {dahabiya.gallery.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-square relative overflow-hidden rounded-lg cursor-pointer group border border-ocean-blue/20 hover:border-ocean-blue/40 transition-all duration-300"
                          onClick={() => {
                            setGalleryIndex(index);
                            setShowGallery(true);
                          }}
                        >
                          <Image
                            src={image}
                            alt={`${dahabiya.name} gallery ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ImageIcon className="text-ocean-blue mx-auto mb-4" size={48} />
                      <Typography variant="body1" color="textSecondary">
                        No gallery images available
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Video Section */}
            {dahabiya.videoUrl && (
              <Grid size={{ xs: 12 }}>
                <Card elevation={2}>
                  <CardContent className="p-6">
                    <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-6 flex items-center gap-2">
                      <Film className="text-ocean-blue" />
                      Video Tour
                    </Typography>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={getYouTubeEmbedUrl(dahabiya.videoUrl)}
                        className="w-full h-full"
                        allowFullScreen
                        title={`${dahabiya.name} Video Tour`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Virtual Tour */}
            {dahabiya.virtualTourUrl && (
              <Grid size={{ xs: 12 }}>
                <Card elevation={2}>
                  <CardContent className="p-6">
                    <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-6 flex items-center gap-2">
                      <Compass className="text-ocean-blue" />
                      Virtual Tour
                    </Typography>
                    <div className="text-center">
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => window.open(dahabiya.virtualTourUrl, '_blank')}
                        className="bg-ocean-blue text-white hover:bg-blue-600"
                        startIcon={<Eye />}
                      >
                        Take Virtual Tour
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      {/* Itineraries Section */}
      <div className="bg-gradient-to-b from-blue-50/30 to-slate-50 py-16">
        <Container maxWidth="lg">
          <DahabiyaItineraries
            dahabiyaId={dahabiya.id}
            dahabiyaName={dahabiya.name}
          />
        </Container>
      </div>

      {/* Booking Section */}
      <div id="booking-section" className="bg-gradient-to-b from-slate-50 to-blue-50/30 py-16">
        <Container maxWidth="lg">
          <div className="text-center mb-12">
            <Typography variant="h3" className="text-hieroglyph-brown font-bold mb-4">
              Book Your Dahabiya
            </Typography>
            <Typography variant="h6" className="text-blue-700 mb-2">
              Reserve {dahabiya.name} for an unforgettable Nile experience
            </Typography>
            <div className="w-24 h-1 bg-gradient-to-r from-ocean-blue to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <UnifiedBookingForm
              type="dahabiya"
              itemId={dahabiya.id}
              itemName={dahabiya.name}
              basePrice={dahabiya.pricePerDay || 0}
              maxGuests={dahabiya.capacity || 20}
              durationDays={7}
              style="pharaonic"
              showAvailabilityCheck={true}
            />
          </div>
        </Container>
      </div>

      {/* Video Dialog */}
      <Dialog open={showVideo} onClose={() => setShowVideo(false)} maxWidth="lg" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          {dahabiya.name} - Video Tour
          <IconButton onClick={() => setShowVideo(false)}>
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {dahabiya.videoUrl && (
            <div className="aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(dahabiya.videoUrl)}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={showGallery} onClose={() => setShowGallery(false)} maxWidth="lg" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          {dahabiya.name} - Gallery ({galleryIndex + 1} of {dahabiya.gallery?.length || 0})
          <IconButton onClick={() => setShowGallery(false)}>
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {dahabiya.gallery && dahabiya.gallery[galleryIndex] && (
            <div className="relative">
              <div className="aspect-video relative">
                <Image
                  src={dahabiya.gallery[galleryIndex]}
                  alt={`${dahabiya.name} gallery ${galleryIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => setGalleryIndex(Math.max(0, galleryIndex - 1))}
                  disabled={galleryIndex === 0}
                  variant="outlined"
                  startIcon={<ArrowLeft />}
                >
                  Previous
                </Button>

                <Typography variant="body2" color="textSecondary">
                  {galleryIndex + 1} of {dahabiya.gallery.length}
                </Typography>

                <Button
                  onClick={() => setGalleryIndex(Math.min(dahabiya.gallery.length - 1, galleryIndex + 1))}
                  disabled={galleryIndex === dahabiya.gallery.length - 1}
                  variant="outlined"
                  endIcon={<ChevronRight />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
