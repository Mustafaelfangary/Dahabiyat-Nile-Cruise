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
  ArrowLeft,
  Star,
  Crown,
  Users,
  Ship,
  Calendar,
  MapPin,
  Wifi,
  Car,
  Utensils,
  Shield,
  Award,
  Activity,
  TreePine,
  Navigation,
  ChevronRight,
  Ruler,
  Route,
  Sunset,
  Mountain,
  Palette,
  Camera,
  Eye as EyeIcon,
  Eye,
  Film,
  Compass,
  ImageIcon,
  Phone,
  Volume2,
  DollarSign,
  Sparkles,
  Gem,
  X,
  Download,
  FileText
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
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; type: string; url: string; size: number }>>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

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

  // Load dahabiya documents
  useEffect(() => {
    const loadDocs = async () => {
      if (!dahabiya?.id) return;
      try {
        setLoadingDocuments(true);
        const res = await fetch(`/api/dahabiyas/${dahabiya.id}/documents`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setDocuments(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error('Error loading dahabiya documents:', e);
      } finally {
        setLoadingDocuments(false);
      }
    };
    loadDocs();
  }, [dahabiya?.id]);

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

    // Prefer uploaded PDF factsheet if available
    const pdf = documents.find(d => d.type === 'FACTSHEET' || d.type === 'FACT_SHEET');
    if (pdf && pdf.url) {
      window.open(pdf.url, '_blank');
      return;
    }

    // Fallback to generated HTML factsheet
    try {
      const response = await fetch(`/api/dahabiyas/${dahabiya.id}/fact-sheet`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dahabiya.name || 'dahabiya'}-fact-sheet.html`;
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

  const downloadBrochure = () => {
    const doc = documents.find(d => d.type === 'BROCHURE');
    if (doc && doc.url) window.open(doc.url, '_blank');
  };

  const downloadSpecification = () => {
    const doc = documents.find(d => d.type === 'SPECIFICATION');
    if (doc && doc.url) window.open(doc.url, '_blank');
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
      {/* Clean Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navigation Bar - Only Back Button */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="flex justify-start items-center">
            <Link href="/dahabiyas">
              <IconButton className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50">
                <ArrowLeft />
              </IconButton>
            </Link>
          </div>
        </div>

        {/* Main Hero Image */}
        <div className="relative h-96 overflow-hidden">
          <Image
            src={selectedImage || dahabiya.mainImage || '/images/placeholder-dahabiya.jpg'}
            alt={dahabiya.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Dahabiya Title Section */}
        <div className="bg-white p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 uppercase tracking-wider mb-4">
            {dahabiya.name}
          </h1>
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-600 text-white">
            <Crown size={20} />
            <span className="font-semibold">{categoryInfo.label.toUpperCase()} CATEGORY</span>
            {dahabiya.isFeatured && (
              <Star size={16} className="fill-current" />
            )}
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="bg-gradient-to-b from-blue-50 via-white to-cyan-50 p-12 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="text-9xl text-ocean-blue absolute top-8 left-8">𓊪</div>
            <div className="text-7xl text-ocean-blue absolute top-20 right-12">𓈎</div>
            <div className="text-8xl text-ocean-blue absolute bottom-16 left-16">𓃭</div>
            <div className="text-6xl text-ocean-blue absolute bottom-8 right-8">𓇋</div>
          </div>

          {/* Features Header */}
          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-ocean-blue to-blue-600 text-white px-8 py-4 rounded-full shadow-lg mb-6">
              <span className="text-2xl animate-pulse">𓊪</span>
              <h2 className="text-2xl font-bold">VESSEL FEATURES</h2>
              <span className="text-2xl animate-pulse">𓊪</span>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-ocean-blue to-transparent rounded-full mx-auto"></div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 relative z-10">
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-ocean-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Ship className="text-white" size={28} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-ocean-blue text-xl">𓈎</span>
                  <span className="text-2xl font-bold text-gray-800">{dahabiya.cabins || 8}</span>
                  <span className="text-ocean-blue text-xl">𓈎</span>
                </div>
                <span className="text-lg font-semibold text-gray-600">Luxury Cabins</span>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
              <div className="text-center">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-white" size={28} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-emerald-600 text-xl">𓃭</span>
                  <span className="text-2xl font-bold text-gray-800">{dahabiya.crew || 10}</span>
                  <span className="text-emerald-600 text-xl">𓃭</span>
                </div>
                <span className="text-lg font-semibold text-gray-600">Expert Crew</span>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Crown className="text-white" size={28} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-purple-600 text-xl">𓇋</span>
                  <span className="text-2xl font-bold text-gray-800">{dahabiya.capacity}</span>
                  <span className="text-purple-600 text-xl">𓇋</span>
                </div>
                <span className="text-lg font-semibold text-gray-600">Max Guests</span>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TreePine className="text-white" size={28} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-green-600 text-xl">𓍯</span>
                  <span className="text-lg font-bold text-gray-800">Eco</span>
                  <span className="text-green-600 text-xl">𓍯</span>
                </div>
                <span className="text-lg font-semibold text-gray-600">Eco-Friendly</span>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
              <div className="text-center">
                <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Compass className="text-white" size={28} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-amber-600 text-xl">𓊪</span>
                  <span className="text-lg font-bold text-gray-800">Traditional</span>
                  <span className="text-amber-600 text-xl">𓊪</span>
                </div>
                <span className="text-lg font-semibold text-gray-600">Sailing Style</span>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
              <div className="text-center">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Volume2 className="text-white" size={28} style={{textDecoration: 'line-through'}} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-teal-600 text-xl">𓄿</span>
                  <span className="text-lg font-bold text-gray-800">Silent</span>
                  <span className="text-teal-600 text-xl">𓄿</span>
                </div>
                <span className="text-lg font-semibold text-gray-600">No Engine Noise</span>
              </div>
            </div>
          </div>

          {/* Enhanced Interior Images Grid */}
          <div className="mb-12 relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-full shadow-lg">
                <Camera className="animate-pulse" size={20} />
                <span className="text-lg">𓂧𓂋</span>
                <span className="font-bold">INTERIOR GALLERY</span>
                <span className="text-lg">𓂧𓂋</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {allImages.slice(1, 5).map((image, index) => (
                <div 
                  key={index} 
                  className="group aspect-square rounded-2xl overflow-hidden bg-gray-200 cursor-pointer transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl border-4 border-transparent hover:border-purple-300"
                  onClick={() => setSelectedImage(image)}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <Image
                    src={image || '/images/placeholder-dahabiya.jpg'}
                    alt={`Interior ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Contact Info and CTA */}
          <div className="text-center space-y-6 relative z-10">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Phone className="text-ocean-blue animate-pulse" size={24} />
                <span className="text-ocean-blue text-xl">𓈎𓃭</span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">+201001538358</div>
              <div className="text-lg text-gray-600 mb-6">www.dahabiyatilecruise.com</div>
              
              <Button
                variant="contained"
                size="large"
                className="w-full bg-gradient-to-r from-ocean-blue to-blue-600 text-white px-8 py-4 text-xl font-bold rounded-xl hover:from-blue-600 hover:to-ocean-blue transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                onClick={() => {
                  const bookingSection = document.getElementById('booking-section');
                  if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span className="mr-3">𓇋𓍯𓊪</span>
                BOOK NOW!
                <span className="ml-3">𓄿𓂧𓂋</span>
              </Button>
            </div>
          </div>
        </div>
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

                  <Divider className="my-4" />

                  {/* Pharaonic Download Buttons */
                  }
                  <div className="space-y-3">
                    <Button
                      onClick={downloadFactSheet}
                      fullWidth
                      className="w-full text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 border-2 border-white/40"
                      startIcon={<FileText className="text-white" />}
                    >
                      <span className="mr-2">𓇳</span>
                      Download Factsheet
                      <span className="ml-2">𓇳</span>
                    </Button>

                    <Button
                      onClick={downloadBrochure}
                      disabled={!documents.find(d => d.type === 'BROCHURE')}
                      fullWidth
                      className="w-full text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-ocean-blue hover:from-blue-700 hover:to-ocean-blue-dark border-2 border-white/40 disabled:opacity-60"
                      startIcon={<Download className="text-white" />}
                    >
                      <span className="mr-2">𓊪</span>
                      Download Brochure
                      <span className="ml-2">𓊪</span>
                    </Button>

                    <Button
                      onClick={downloadSpecification}
                      disabled={!documents.find(d => d.type === 'SPECIFICATION')}
                      fullWidth
                      className="w-full text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-2 border-white/40 disabled:opacity-60"
                      startIcon={<Download className="text-white" />}
                    >
                      <span className="mr-2">𓈖</span>
                      Download Specifications
                      <span className="ml-2">𓈖</span>
                    </Button>
                  </div>
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
                  <div className="mb-8">
                    <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-2 flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-ocean-blue to-blue-600 text-white px-4 py-2 rounded-full">
                        <Navigation className="animate-pulse" size={20} />
                        <span className="text-lg">𓈎𓃭𓇋</span>
                      </div>
                      Available Itineraries
                      <span className="text-lg text-ocean-blue">𓍯𓊪𓄿</span>
                    </Typography>
                    <div className="w-24 h-1 bg-gradient-to-r from-ocean-blue to-transparent rounded-full mb-4"></div>
                  </div>
                  
                  {loadingItineraries ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="relative">
                        <CircularProgress size={50} className="text-ocean-blue animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-ocean-blue text-xl animate-pulse">𓊪</span>
                        </div>
                      </div>
                      <Typography variant="body2" className="text-gray-500 mt-4 animate-pulse">
                        Loading magical journeys...
                      </Typography>
                    </div>
                  ) : itineraries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {itineraries.slice(0, 6).map((itinerary, index) => (
                        <div 
                          key={itinerary.id} 
                          className="group bg-white rounded-2xl border border-ocean-blue/20 hover:border-ocean-blue/60 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden transform-gpu"
                          style={{
                            animationDelay: `${index * 150}ms`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                          }}
                        >
                          {itinerary.mainImageUrl && (
                            <div className="aspect-video relative overflow-hidden">
                              <Image
                                src={itinerary.mainImageUrl || '/images/placeholder-dahabiya.jpg'}
                                alt={itinerary.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <div className="absolute top-4 right-4 bg-ocean-blue/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                <span className="mr-1">𓈎</span>
                                {itinerary.durationDays} Days
                              </div>
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <Typography variant="h6" className="text-hieroglyph-brown font-bold line-clamp-2 group-hover:text-ocean-blue transition-colors duration-300">
                                {itinerary.name}
                              </Typography>
                              <div className="text-ocean-blue text-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                                𓃭
                              </div>
                            </div>
                            
                            <Typography variant="body2" className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                              {itinerary.shortDescription || itinerary.description}
                            </Typography>
                            
                            <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Calendar className="text-ocean-blue animate-pulse" size={18} />
                                <Typography variant="body2" className="font-semibold">{itinerary.durationDays} days</Typography>
                              </div>
                              {itinerary.maxGuests && (
                                <div className="flex items-center gap-2">
                                  <Users className="text-ocean-blue" size={18} />
                                  <Typography variant="body2" className="font-semibold">Max {itinerary.maxGuests}</Typography>
                                </div>
                              )}
                            </div>
                            
                            {itinerary.price && (
                              <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                                <Typography variant="body2" className="text-gray-600 font-medium">Starting from</Typography>
                                <div className="flex items-center gap-2">
                                  <span className="text-emerald-600 text-sm">𓊪</span>
                                  <Typography variant="h6" className="text-emerald-600 font-bold">
                                    ${itinerary.price.toLocaleString()}
                                  </Typography>
                                </div>
                              </div>
                            )}
                            
                            <Link href={`/itineraries/${itinerary.slug}`}>
                              <Button
                                variant="outlined"
                                fullWidth
                                className="border-2 border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white hover:border-ocean-blue group-hover:shadow-lg transition-all duration-300 py-3 rounded-xl font-semibold"
                                endIcon={<ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />}
                              >
                                <span className="mr-2">𓇋𓍯</span>
                                View Itinerary
                                <span className="ml-2">𓄿</span>
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
                            src={image || '/images/placeholder-dahabiya.jpg'}
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
                  src={dahabiya.gallery[galleryIndex] || '/images/placeholder-dahabiya.jpg'}
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
