"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Grid,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import {
  X as Close,
  Calendar,
  Users,
  DollarSign,
  Star,
  Ship,
  Crown,
  CheckCircle
} from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Link from 'next/link';

interface Dahabiya {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  cabins?: number;
  mainImage?: string;
  category?: 'LUXURY' | 'DELUXE' | 'PREMIUM' | 'BOUTIQUE';
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  features: string[];
}

interface QuickBookingWidgetProps {
  dahabiya: Dahabiya;
  open: boolean;
  onClose: () => void;
}

export default function QuickBookingWidget({ dahabiya, open, onClose }: QuickBookingWidgetProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [duration, setDuration] = useState(3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
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

  const totalPrice = dahabiya.pricePerDay * duration;
  const categoryInfo = getCategoryColor(dahabiya.category || 'DELUXE');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          style: {
            background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
            border: '2px solid #D4AF37',
            borderRadius: '16px',
          }
        }}
      >
        {/* Enhanced Header */}
        <DialogTitle className="bg-gradient-to-r from-hieroglyph-brown to-amber-900 text-egyptian-gold relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">𓊪</span>
              <div>
                <div className="font-bold text-lg">
                  Quick Booking
                </div>
                <div className="opacity-80 text-sm">
                  Reserve Your Royal Journey
                </div>
              </div>
            </div>
            <IconButton onClick={onClose} className="text-egyptian-gold">
              <Close />
            </IconButton>
          </div>

          {/* Decorative Border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-egyptian-gold via-amber-400 to-egyptian-gold"></div>
        </DialogTitle>

        <DialogContent className="p-6">
          {/* Dahabiya Info */}
          <Box className="mb-6">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border border-egyptian-gold/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Typography variant="h5" className="text-hieroglyph-brown font-bold mb-1">
                    {dahabiya.name}
                  </Typography>
                  <div className="flex items-center gap-2 mb-2">
                    <Chip
                      label={categoryInfo.label}
                      size="small"
                      style={{
                        backgroundColor: categoryInfo.bg,
                        color: categoryInfo.color,
                        border: '1px solid #D4AF37',
                      }}
                    />
                    {dahabiya.isFeatured && (
                      <Chip
                        label="Featured"
                        size="small"
                        className="bg-egyptian-gold text-hieroglyph-brown"
                        icon={<Crown style={{ fontSize: 16 }} />}
                      />
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="h4" className="text-egyptian-gold font-bold">
                    {formatPrice(dahabiya.pricePerDay)}
                  </Typography>
                  <Typography variant="caption" className="text-amber-700">
                    per day
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/50 rounded-lg p-2">
                  <Users className="w-5 h-5 text-egyptian-gold mx-auto mb-1" />
                  <Typography variant="caption" className="text-hieroglyph-brown font-medium">
                    {dahabiya.capacity} Guests
                  </Typography>
                </div>
                {dahabiya.cabins && (
                  <div className="bg-white/50 rounded-lg p-2">
                    <Ship className="w-5 h-5 text-egyptian-gold mx-auto mb-1" />
                    <Typography variant="caption" className="text-hieroglyph-brown font-medium">
                      {dahabiya.cabins} Cabins
                    </Typography>
                  </div>
                )}
                {dahabiya.rating && (
                  <div className="bg-white/50 rounded-lg p-2">
                    <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                    <Typography variant="caption" className="text-hieroglyph-brown font-medium">
                      {dahabiya.rating} Rating
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </Box>

          {/* Quick Booking Form */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label="Check-in Date"
                value={checkIn}
                onChange={setCheckIn}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  }
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label="Check-out Date"
                value={checkOut}
                onChange={setCheckOut}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Number of Guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Math.min(dahabiya.capacity, parseInt(e.target.value) || 1)))}
                fullWidth
                inputProps={{ min: 1, max: dahabiya.capacity }}
                helperText={`Maximum ${dahabiya.capacity} guests`}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Duration (days)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                fullWidth
                inputProps={{ min: 1, max: 14 }}
                helperText="Minimum 1 day"
              />
            </Grid>
          </Grid>

          {/* Price Summary */}
          <Box className="mt-6">
            <div className="bg-gradient-to-r from-egyptian-gold/20 to-amber-400/20 rounded-lg p-4 border border-egyptian-gold/30">
              <Typography variant="h6" className="text-hieroglyph-brown font-bold mb-3">
                Price Summary
              </Typography>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="body2" className="text-amber-700 font-bold">
                    {formatPrice(dahabiya.pricePerDay)} × {duration} days
                  </Typography>
                  <Typography variant="body2" className="text-hieroglyph-brown font-bold">
                    {formatPrice(totalPrice)}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" className="text-amber-700">
                    {guests} guests
                  </Typography>
                  <Typography variant="body2" className="text-green-600">
                    <CheckCircle style={{ fontSize: 16 }} className="inline mr-1" />
                    Included
                  </Typography>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <Typography variant="h6" className="text-hieroglyph-brown font-bold">
                    Total
                  </Typography>
                  <Typography variant="h6" className="text-egyptian-gold font-bold">
                    {formatPrice(totalPrice)}
                  </Typography>
                </div>
              </div>
            </div>
          </Box>
        </DialogContent>

        <DialogActions className="p-6 pt-0">
          <div className="w-full flex flex-col gap-3">
            {/* Full Booking Button */}
            <Link 
              href={`/booking?dahabiyaId=${dahabiya.id}&type=dahabiya&guests=${guests}&duration=${duration}`}
              className="w-full"
            >
              <Button
                variant="contained"
                fullWidth
                size="large"
                className="bg-gradient-to-r from-ocean-blue to-blue-400 text-white hover:from-blue-400 hover:to-ocean-blue font-bold py-3 shadow-lg"
                startIcon={<Crown />}
              >
                Complete Royal Booking
              </Button>
            </Link>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outlined"
                onClick={onClose}
                className="flex-1 border-ocean-blue text-black hover:bg-ocean-blue/10"
              >
                Continue Browsing
              </Button>
              <Link href={`/dahabiyas/${dahabiya.slug}`} className="flex-1">
                <Button
                  variant="outlined"
                  fullWidth
                  className="border-blue-400 text-blue-700 hover:bg-blue-50"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
