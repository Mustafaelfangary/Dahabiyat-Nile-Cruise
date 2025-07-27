"use client";

import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert, Pagination } from '@mui/material';
import DahabiyaCard from './DahabiyaCard';
import { usePageContent } from '@/hooks/usePageContent';

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
  features: string[];
  amenities: string[];
  activities: string[];
  diningOptions: string[];
  routes: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  category: 'LUXURY' | 'DELUXE' | 'PREMIUM' | 'BOUTIQUE';
}

interface DahabiyaListResponse {
  dahabiyas: Dahabiya[];
  total: number;
  pages: number;
  currentPage: number;
}

interface DahabiyaListProps {
  activeOnly?: boolean;
  limit?: number;
}

export default function DahabiyaList({ activeOnly = true, limit = 12 }: DahabiyaListProps) {
  const [data, setData] = useState<DahabiyaListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { getContentValue } = usePageContent('dahabiyas');

  const fetchDahabiyas = async (page: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(activeOnly && { active: 'true' }),
      });

      const response = await fetch(`/api/dahabiyas?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch dahabiyas');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDahabiyas(currentPage);
  }, [currentPage, activeOnly, limit]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="relative">
          <CircularProgress size={60} className="text-egyptian-gold" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Typography className="text-egyptian-gold text-2xl animate-pulse">𓊪</Typography>
          </div>
        </div>
        <Typography variant="h6" className="mt-4 text-hieroglyph-brown">
          {getContentValue('dahabiyas_loading_text', 'Loading Vessels...')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        className="mb-6 bg-red-50 border-2 border-red-200"
        style={{ borderRadius: '12px' }}
      >
        <Typography className="font-medium">{error}</Typography>
      </Alert>
    );
  }

  if (!data || data.dahabiyas.length === 0) {
    return (
      <Box textAlign="center" py={12} className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-lg border-2 border-egyptian-gold/20">
        <Typography className="text-egyptian-gold text-6xl mb-4">𓊪</Typography>
        <Typography variant="h4" className="text-hieroglyph-brown font-bold mb-4" style={{ fontFamily: 'serif' }}>
          {getContentValue('dahabiyas_empty_title', 'No Vessels Found')}
        </Typography>
        <Typography variant="body1" className="text-amber-700 max-w-md mx-auto">
          {activeOnly
            ? getContentValue('dahabiyas_empty_description_active', 'The fleet is currently preparing for their next journey. Please check back soon for available vessels.')
            : getContentValue('dahabiyas_empty_description_all', 'No dahabiyas have been blessed and added to our collection yet.')
          }
        </Typography>
        <div className="flex justify-center items-center gap-4 mt-6">
          <div className="w-12 h-0.5 bg-egyptian-gold"></div>
          <Typography className="text-egyptian-gold text-2xl">𓇳</Typography>
          <div className="w-12 h-0.5 bg-egyptian-gold"></div>
        </div>
      </Box>
    );
  }

  return (
    <Box>
      {/* Enhanced Results Summary */}
      <Box mb={6} textAlign="center">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border-2 border-egyptian-gold/20">
          <Typography variant="h5" className="text-hieroglyph-brown font-bold mb-2" style={{ fontFamily: 'serif' }}>
            {getContentValue('dahabiyas_fleet_title', 'Fleet Collection')}
          </Typography>
          <Typography variant="h6" className="text-amber-700">
            {getContentValue('dahabiyas_fleet_description', 'Showing')} {data.dahabiyas.length} of {data.total} divine vessels
          </Typography>
          <div className="flex justify-center items-center gap-2 mt-2">
            <div className="w-8 h-0.5 bg-egyptian-gold"></div>
            <Typography className="text-egyptian-gold text-lg">𓊪</Typography>
            <div className="w-8 h-0.5 bg-egyptian-gold"></div>
          </div>
        </div>
      </Box>

      {/* Enhanced Dahabiya Grid */}
      <Grid container spacing={4}>
        {data.dahabiyas.map((dahabiya) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={dahabiya.id}>
            <DahabiyaCard dahabiya={dahabiya} />
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Pagination */}
      {data.pages > 1 && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
          {/* Decorative Divider */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-0.5 bg-egyptian-gold"></div>
            <Typography className="text-egyptian-gold text-3xl">𓇳</Typography>
            <div className="w-16 h-0.5 bg-egyptian-gold"></div>
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border-2 border-egyptian-gold/20">
            <Pagination
              count={data.pages}
              page={currentPage}
              onChange={handlePageChange}
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#8B4513',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#D4AF37',
                    color: '#8B4513',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#D4AF37',
                    color: '#8B4513',
                    '&:hover': {
                      backgroundColor: '#B8860B',
                    },
                  },
                },
              }}
            />
          </div>
        </Box>
      )}
    </Box>
  );
}
