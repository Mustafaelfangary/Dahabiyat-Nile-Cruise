'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ship, Calendar, MapPin, Crown, Star, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface ScheduleEntry {
  id?: string;
  dahabiyaName: string;
  destination: string;
  routes: string;
  itinerary: string;
  day: string;
  date: string;
  minPrice: string;
}

interface ScheduleDemoProps {
  dahabiyaName: string;
  className?: string;
}

export default function ScheduleDemo({ dahabiyaName, className = '' }: ScheduleDemoProps) {
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduleData();
  }, [dahabiyaName]);

  const fetchScheduleData = async () => {
    try {
      // Fetch schedule data from content API
      const response = await fetch('/api/website-content?page=schedule-and-rates');
      if (response.ok) {
        const data = await response.json();
        const scheduleContent = data.find((item: any) => item.key === 'schedule_table_data');
        if (scheduleContent?.content) {
          const parsed = JSON.parse(scheduleContent.content);
          // Filter for specific dahabiya or show sample data
          const filtered = parsed.filter((entry: ScheduleEntry) => 
            entry.dahabiyaName === dahabiyaName
          );
          setScheduleData(filtered.length > 0 ? filtered : getSampleData());
        } else {
          setScheduleData(getSampleData());
        }
      } else {
        setScheduleData(getSampleData());
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      setScheduleData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = (): ScheduleEntry[] => [
    {
      id: '1',
      dahabiyaName,
      destination: 'Luxor - Aswan',
      routes: 'Royal Nile Route',
      itinerary: '7 Days Pharaonic Journey',
      day: 'Saturday',
      date: '2024-12-15',
      minPrice: '2,500'
    },
    {
      id: '2',
      dahabiyaName,
      destination: 'Aswan - Luxor',
      routes: 'Ancient Temples Route',
      itinerary: '5 Days Heritage Tour',
      day: 'Wednesday',
      date: '2024-12-22',
      minPrice: '1,800'
    }
  ];

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-3xl p-6 h-64"></div>
      </div>
    );
  }

  if (scheduleData.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Compact Embarkation Table */}
      <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 px-6 py-4 border-b border-amber-200">
          <div className="flex items-center justify-center">
            <Ship className="w-5 h-5 mr-2 text-amber-700" />
            <span className="text-lg font-bold text-amber-900 flex items-center">
              <span className="mr-2 text-xl">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</span>
              Upcoming Departures
              <span className="ml-2 text-xl">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</span>
            </span>
            <Crown className="w-5 h-5 ml-2 text-amber-700" />
          </div>
        </div>

        {/* Table Content */}
        <div className="p-4">
          <div className="grid gap-3">
            {scheduleData.slice(0, 2).map((entry, index) => (
              <div
                key={entry.id || index}
                className="bg-white rounded-xl p-4 border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  {/* Destination */}
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">DESTINATION</div>
                      <div className="font-semibold text-gray-800 text-xs">
                        <span className="text-emerald-600 mr-1">𓈖</span>
                        {entry.destination}
                      </div>
                    </div>
                  </div>

                  {/* Departure */}
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">DEPARTURE</div>
                      <div className="font-semibold text-gray-800 text-xs">
                        <span className="text-purple-600 mr-1">𓊨</span>
                        {entry.day}
                      </div>
                      <div className="text-xs text-gray-600">{entry.date}</div>
                    </div>
                  </div>

                  {/* Journey */}
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">JOURNEY</div>
                      <div className="font-semibold text-gray-800 text-xs">
                        <span className="text-blue-600 mr-1">𓊃</span>
                        {entry.itinerary.split(' ')[0]} Days
                      </div>
                    </div>
                  </div>

                  {/* Price & Book */}
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-3 h-3 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium">FROM</div>
                        <div className="font-bold text-emerald-600 text-sm">
                          <span className="text-emerald-600 mr-1">𓋹</span>
                          ${entry.minPrice}
                        </div>
                      </div>
                    </div>
                    <Link href={`/booking?dahabiya=${encodeURIComponent(dahabiyaName)}&itinerary=${encodeURIComponent(entry.itinerary)}`}>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <span className="mr-1">𓇳</span>
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-4 flex items-center justify-center">
            <Link href="/schedule-and-rates">
              <Button 
                variant="outline" 
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-50 text-xs px-4 py-2 rounded-full font-medium transition-all duration-200"
              >
                <Calendar className="w-3 h-3 mr-1" />
                <span className="mr-1">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</span>
                View Full Schedule
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
