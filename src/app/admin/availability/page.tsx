"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Check, X, Plus, Edit3, Save, ArrowLeft } from 'lucide-react';
import {
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Box,
  Chip,
  IconButton,
  CircularProgress
} from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import { RoyalCrown } from '@/components/ui/icons';
import { toast } from 'sonner';

interface Dahabiya {
  id: string;
  name: string;
  pricePerDay: number;
}

interface AvailabilityDate {
  id: string;
  date: string;
  available: boolean;
  price: number;
  dahabiyaId: string;
}

// Remove inline styles - using Material-UI and Tailwind instead

export default function AvailabilityManagement() {
  const { data: session, status } = useSession();
  const [dahabiyat, setDahabiyat] = useState<Dahabiya[]>([]);
  const [selectedDahabiya, setSelectedDahabiya] = useState<string>('');
  const [availabilityDates, setAvailabilityDates] = useState<AvailabilityDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'dahabiya' | 'package'>('dahabiya');
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packageAvailability, setPackageAvailability] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchDahabiyat();
      fetchPackages();
    }
  }, [session]);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    if (selectedDahabiya && viewMode === 'dahabiya') {
      fetchAvailability();
    } else if (viewMode === 'package') {
      fetchPackageAvailability();
    }
  }, [selectedDahabiya, currentMonth, currentYear, viewMode]);

  const fetchDahabiyat = async () => {
    try {
      const response = await fetch('/api/dahabiyas?active=true');
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        const dahabiyatArray = Array.isArray(data.dahabiyas) ? data.dahabiyas : [];
        setDahabiyat(dahabiyatArray);
        if (dahabiyatArray.length > 0) {
          setSelectedDahabiya(dahabiyatArray[0].id);
        }
      } else {
        console.error('Failed to fetch dahabiyas:', response.status);
        setDahabiyat([]);
      }
    } catch (error) {
      console.error('Error fetching dahabiyas:', error);
      setDahabiyat([]); // Ensure dahabiyat is always an array
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!selectedDahabiya) return;

    console.log('🔄 Fetching availability for:', { selectedDahabiya, currentMonth, currentYear });

    try {
      const startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

      const response = await fetch(
        `/api/dashboard/dahabiyat/availability?dahabiyaId=${selectedDahabiya}&startDate=${startDate}&endDate=${endDate}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log('📅 Fetched availability data:', { count: data.length, sampleData: data.slice(0, 3) });
        setAvailabilityDates(data);
      } else {
        console.error('❌ Failed to fetch availability:', response.status);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const fetchPackageAvailability = async () => {
    try {
      const response = await fetch(
        `/api/package-availability?packageId=all-packages&month=${currentMonth}&year=${currentYear}`
      );

      if (response.ok) {
        const data = await response.json();
        setPackageAvailability(data.dahabiyatCalendars || []);
      }
    } catch (error) {
      console.error('Error fetching package availability:', error);
    }
  };

  const toggleAvailability = async (dateId: string, currentAvailable: boolean) => {
    setSaving(true);
    try {
      const response = await fetch('/api/dashboard/dahabiyat/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dateId, available: !currentAvailable })
      });

      if (response.ok) {
        setAvailabilityDates(prev => 
          prev.map(date => 
            date.id === dateId ? { ...date, available: !currentAvailable } : date
          )
        );
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setSaving(false);
    }
  };

  const addAvailabilityDates = async () => {
    if (!selectedDahabiya) {
      toast.error('Please select a dahabiya first');
      return;
    }

    setSaving(true);
    try {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const dates = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
        const existingDate = availabilityDates.find(d => d.date === date);

        if (!existingDate) {
          dates.push({
            date,
            price: Array.isArray(dahabiyat) ? (dahabiyat.find(d => d.id === selectedDahabiya)?.pricePerDay || 0) : 0,
            available: true // Explicitly set as available
          });
        }
      }

      if (dates.length > 0) {
        console.log('🗓️ Creating availability dates:', { dahabiyaId: selectedDahabiya, dates: dates.length, sampleDates: dates.slice(0, 3) });

        const response = await fetch('/api/dashboard/dahabiyat/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dahabiyaId: selectedDahabiya, dates })
        });

        const result = await response.json();
        console.log('📅 API Response:', { status: response.status, result });

        if (response.ok) {
          toast.success(`✅ Created ${result.createdDates?.length || dates.length} availability dates for ${new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
          fetchAvailability();
        } else {
          console.error('❌ API Error:', result);
          toast.error(`❌ Failed to create dates: ${result.error || 'Unknown error'}`);
        }
      } else {
        toast.info(`ℹ️ All dates for ${new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} already exist`);
      }
    } catch (error) {
      console.error('Error adding availability dates:', error);
      toast.error('❌ Failed to add availability dates. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getDaysInMonth = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    console.log('📅 getDaysInMonth called:', {
      availabilityDatesCount: availabilityDates.length,
      sampleAvailabilityDates: availabilityDates.slice(0, 2).map(d => ({
        originalDate: d.date,
        convertedDate: new Date(d.date).toISOString().split('T')[0],
        available: d.available
      }))
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
      const availabilityDate = availabilityDates.find(d => {
        // Convert database date to simple date string for comparison
        const dbDate = new Date(d.date).toISOString().split('T')[0];
        return dbDate === date;
      });

      if (day <= 3) { // Log first 3 days for debugging
        console.log(`📅 Day ${day}:`, {
          lookingFor: date,
          availabilityDate: !!availabilityDate,
          firstDbDate: availabilityDates[0]?.date,
          firstDbDateConverted: availabilityDates[0] ? new Date(availabilityDates[0].date).toISOString().split('T')[0] : 'none'
        });
      }

      days.push({ day, date, availability: availabilityDate });
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Container maxWidth="xl" className="py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <RoyalCrown className="w-16 h-16 text-ocean-blue mb-4" />
            <Typography variant="h4" className="text-text-primary font-heading font-bold mb-4">
              Loading Availability Management...
            </Typography>
            <CircularProgress size={60} className="text-ocean-blue" />
          </div>
        </Container>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Container maxWidth="xl" className="py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Typography variant="h4" className="text-text-primary font-heading font-bold mb-4">
              Access Denied
            </Typography>
            <Button
              href="/admin"
              variant="contained"
              startIcon={<ArrowLeft />}
              className="bg-ocean-blue hover:bg-amber-600 text-white"
            >
              Back to Admin
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Container maxWidth="xl" className="py-8">
        <AnimatedSection animation="fade-in">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Calendar className="w-12 h-12 text-ocean-blue" />
                <div>
                  <Typography variant="h3" className="text-text-primary font-heading font-bold">
                    Availability Management
                  </Typography>
                  <Typography variant="h6" className="text-text-primary opacity-75">
                    Manage dahabiya and package availability
                  </Typography>
                </div>
              </div>
              <Button
                href="/admin"
                variant="outlined"
                startIcon={<ArrowLeft />}
                className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white"
              >
                Back to Admin
              </Button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <Card className="mb-6">
            <CardContent>
              <Typography variant="h6" className="text-text-primary font-semibold mb-4">
                Select View Mode
              </Typography>
              <div className="flex gap-4">
                <Button
                  variant={viewMode === 'dahabiya' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('dahabiya')}
                  startIcon={<Calendar />}
                  className={viewMode === 'dahabiya'
                    ? 'bg-ocean-blue hover:bg-amber-600 text-white'
                    : 'border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white'
                  }
                >
                  Dahabiya Availability
                </Button>
                <Button
                  variant={viewMode === 'package' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('package')}
                  startIcon={<Plus />}
                  className={viewMode === 'package'
                    ? 'bg-ocean-blue hover:bg-amber-600 text-white'
                    : 'border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white'
                  }
                >
                  Package Availability
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dahabiya Selection - Only show in dahabiya mode */}
          {viewMode === 'dahabiya' && (
            <Card className="mb-6">
              <CardContent>
                <Typography variant="h6" className="text-text-primary font-semibold mb-4">
                  Select Dahabiya
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="dahabiya-select-label">Choose a Dahabiya</InputLabel>
                  <Select
                    labelId="dahabiya-select-label"
                    value={selectedDahabiya}
                    label="Choose a Dahabiya"
                    onChange={(e) => {
                      setSelectedDahabiya(e.target.value);
                      // fetchAvailability will be called by useEffect when selectedDahabiya changes
                    }}
                    className="bg-white"
                  >
                    <MenuItem value="">
                      <em>Choose a Dahabiya...</em>
                    </MenuItem>
                    {Array.isArray(dahabiyat) && dahabiyat.map(dahabiya => (
                      <MenuItem key={dahabiya.id} value={dahabiya.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{dahabiya.name}</span>
                          <Chip
                            label={`$${dahabiya.pricePerDay}/day`}
                            size="small"
                            className="bg-ocean-blue text-white"
                          />
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          )}

          {/* Package Info - Only show in package mode */}
          {viewMode === 'package' && (
            <Card className="mb-6">
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <Plus className="w-6 h-6 text-ocean-blue" />
                  <Typography variant="h6" className="text-text-primary font-semibold">
                    Package Availability Overview
                  </Typography>
                </div>
                <Alert severity="info" className="bg-blue-50 border-blue-200">
                  View availability across all dahabiyat for package bookings. Packages require at least one available vessel for the selected dates.
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Month Navigation */}
          <Card className="mb-6">
            <CardContent>
              <div className="flex justify-between items-center">
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                  className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white"
                >
                  ← Previous
                </Button>

                <Typography variant="h5" className="text-text-primary font-heading font-bold">
                  {monthNames[currentMonth]} {currentYear}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                  className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white"
                >
                  Next →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add Month Button */}
          <div className="mb-6 text-center">
            <div className="flex gap-3 justify-center">
              <Button
                variant="contained"
                onClick={addAvailabilityDates}
                disabled={!selectedDahabiya || saving}
                startIcon={saving ? <CircularProgress size={16} /> : <Plus />}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {saving ? 'Adding...' : 'Add Missing Dates for This Month'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  if (selectedDahabiya) {
                    fetchAvailability();
                  }
                }}
                disabled={!selectedDahabiya}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Refresh Calendar
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-6">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center font-semibold text-text-primary bg-slate-100 rounded">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {getDaysInMonth().map((dayData, index) => (
                  <div key={index} className="min-h-[100px] p-2 border rounded bg-white">
                    {dayData && (
                      <>
                        <div className="font-bold text-text-primary mb-2">
                          {dayData.day}
                        </div>
                        {dayData.availability ? (
                          <Button
                            size="small"
                            variant={dayData.availability.available ? "contained" : "outlined"}
                            onClick={() => dayData.availability && toggleAvailability(dayData.availability.id, dayData.availability.available)}
                            disabled={saving}
                            className="text-xs"
                            sx={dayData.availability.available ? {
                              backgroundColor: '#10b981',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#059669'
                              }
                            } : {
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              '&:hover': {
                                backgroundColor: '#fef2f2',
                                borderColor: '#dc2626'
                              }
                            }}
                            startIcon={dayData.availability.available ? <Check size={12} /> : <X size={12} />}
                          >
                            {dayData.availability.available ? 'Available' : 'Blocked'}
                          </Button>
                        ) : (
                          <Chip
                            label="Not Set"
                            size="small"
                            className="bg-gray-200 text-gray-600"
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-6">
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Edit3 className="w-6 h-6 text-ocean-blue" />
                <Typography variant="h6" className="text-text-primary font-semibold">
                  Instructions
                </Typography>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Chip label="Available" size="small" className="bg-green-500 text-white" />
                    <Typography variant="body2" className="text-text-primary">
                      Available for booking
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Chip label="Blocked" size="small" className="bg-red-500 text-white" />
                    <Typography variant="body2" className="text-text-primary">
                      Blocked/Unavailable
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip label="Not Set" size="small" className="bg-gray-200 text-gray-600" />
                    <Typography variant="body2" className="text-text-primary">
                      Not set (add dates first)
                    </Typography>
                  </div>
                </div>
                <div>
                  <Typography variant="body2" className="text-text-primary mb-2">
                    • Click on any date to toggle availability
                  </Typography>
                  <Typography variant="body2" className="text-text-primary">
                    • Use "Add Missing Dates" to create availability for the entire month
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Container>
    </div>
  );
}
