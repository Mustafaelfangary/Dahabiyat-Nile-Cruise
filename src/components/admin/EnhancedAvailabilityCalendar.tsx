"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  DollarSign,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface AvailabilityDate {
  id: string;
  date: string;
  available: boolean;
  price: number;
  bookedGuests?: number;
  maxGuests?: number;
}

interface EnhancedAvailabilityCalendarProps {
  dahabiyaId: string;
  dahabiyaName: string;
  onDateUpdate?: (date: string, available: boolean, price: number) => void;
}

export default function EnhancedAvailabilityCalendar({
  dahabiyaId,
  dahabiyaName,
  onDateUpdate
}: EnhancedAvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilityDates, setAvailabilityDates] = useState<AvailabilityDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    if (dahabiyaId) {
      fetchAvailability();
    }
  }, [dahabiyaId, currentMonth, currentYear]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/availability?dahabiyaId=${dahabiyaId}&month=${currentMonth}&year=${currentYear}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAvailabilityDates(data.dates || []);
      } else {
        toast.error('Failed to fetch availability data');
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Error loading availability calendar');
    } finally {
      setLoading(false);
    }
  };

  const toggleDateAvailability = async (date: string, currentAvailable: boolean) => {
    setUpdating(date);
    try {
      const response = await fetch('/api/dashboard/dahabiyat/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dahabiyaId,
          date,
          available: !currentAvailable
        })
      });

      if (response.ok) {
        await fetchAvailability();
        toast.success(`Date ${!currentAvailable ? 'enabled' : 'disabled'} successfully`);
        
        if (onDateUpdate) {
          const dateData = availabilityDates.find(d => d.date === date);
          onDateUpdate(date, !currentAvailable, dateData?.price || 0);
        }
      } else {
        toast.error('Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Error updating date availability');
    } finally {
      setUpdating(null);
    }
  };

  const generateMonthDates = async () => {
    setLoading(true);
    try {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const dates = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
        const existingDate = availabilityDates.find(d => d.date === date);
        
        if (!existingDate) {
          dates.push({
            date,
            price: 500, // Default price
            available: true
          });
        }
      }

      if (dates.length > 0) {
        const response = await fetch('/api/dashboard/dahabiyat/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dahabiyaId, dates })
        });

        if (response.ok) {
          await fetchAvailability();
          toast.success(`✅ Generated ${dates.length} availability dates`);
        } else {
          toast.error('Failed to generate dates');
        }
      } else {
        toast.info('All dates already exist for this month');
      }
    } catch (error) {
      console.error('Error generating dates:', error);
      toast.error('Error generating availability dates');
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentYear, currentMonth, 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
      const dateData = availabilityDates.find(d => d.date === date);
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
      const isPast = new Date(currentYear, currentMonth, day) < new Date();

      days.push(
        <div
          key={date}
          className={`
            p-2 border rounded-lg cursor-pointer transition-all duration-200
            ${isToday ? 'ring-2 ring-blue-500' : ''}
            ${isPast ? 'bg-gray-100 text-gray-400' : ''}
            ${dateData?.available ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-red-50 border-red-200 hover:bg-red-100'}
            ${updating === date ? 'opacity-50' : ''}
          `}
          onClick={() => {
            if (!isPast && dateData && updating !== date) {
              toggleDateAvailability(date, dateData.available);
            }
          }}
        >
          <div className="text-center">
            <div className="font-medium">{day}</div>
            {dateData && (
              <div className="mt-1 space-y-1">
                <Badge 
                  variant={dateData.available ? "default" : "destructive"}
                  className="text-xs"
                >
                  {dateData.available ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </Badge>
                {dateData.price > 0 && (
                  <div className="text-xs text-gray-600 flex items-center justify-center">
                    <DollarSign className="w-3 h-3" />
                    {dateData.price}
                  </div>
                )}
                {dateData.bookedGuests && (
                  <div className="text-xs text-blue-600 flex items-center justify-center">
                    <Users className="w-3 h-3" />
                    {dateData.bookedGuests}/{dateData.maxGuests || 12}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const availableCount = availabilityDates.filter(d => d.available).length;
  const totalCount = availabilityDates.length;

  return (
    <Card className="border-2 border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Availability Calendar - {dahabiyaName}
        </CardTitle>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              disabled={loading}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-green-700">
            {availableCount}/{totalCount} days available
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={generateMonthDates}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Month Dates
          </Button>
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading calendar...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-600">
                {day}
              </div>
            ))}
            {/* Calendar days */}
            {renderCalendarDays()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
