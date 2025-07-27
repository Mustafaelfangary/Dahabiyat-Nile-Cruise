'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookingsList } from '@/components/BookingsList';
import { Calendar, Ship, User } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/bookings');
      return;
    }

    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/user/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-ocean-blue to-amber-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Crown className="w-8 h-8 text-text-primary" />
          </div>
          <p className="text-ocean-blue text-xl">Loading your royal bookings...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      {/* Pharaonic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-ocean-blue/20 text-6xl animate-pulse">𓇳</div>
        <div className="absolute top-20 right-16 text-ocean-blue/15 text-5xl animate-pulse">𓊪</div>
        <div className="absolute bottom-32 left-12 text-ocean-blue/15 text-4xl animate-pulse">𓊃</div>
        <div className="absolute bottom-40 right-12 text-ocean-blue/25 text-5xl animate-pulse">𓈖</div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-ocean-blue text-5xl animate-pulse">𓇳</span>
            <div className="w-20 h-20 bg-gradient-to-br from-ocean-blue to-amber-600 rounded-full flex items-center justify-center shadow-2xl">
              <Calendar className="w-10 h-10 text-text-primary" />
            </div>
            <span className="text-ocean-blue text-5xl animate-pulse">𓇳</span>
          </div>
          <h1 className="text-5xl font-bold text-ocean-blue mb-4 font-heading">
            𓊪𓈖𓇳 My Royal Bookings 𓇳𓈖𓊪
          </h1>
          <p className="text-xl text-text-secondary">
            Manage your journeys through the eternal waters
          </p>
        </div>

        {/* User Info */}
        {session?.user && (
          <div className="bg-white p-6 mb-8 border border-ocean-blue/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ocean-blue rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Welcome, {session.user.name}</h2>
                <p className="text-text-secondary">{session.user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List */}
        <div className="bg-white p-8 border border-ocean-blue/30">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Ship className="w-16 h-16 text-ocean-blue mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-text-primary mb-4">No Journeys Yet</h3>
              <p className="text-text-secondary mb-6">Begin your royal adventure by booking a dahabiya cruise</p>
              <Link 
                href="/booking"
                className="bg-gradient-to-r from-ocean-blue to-amber-600 text-black px-8 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-ocean-blue transition-all duration-300"
              >
                Book Your First Journey
              </Link>
            </div>
          ) : (
            <BookingsList bookings={bookings} />
          )}
        </div>
      </div>
    </div>
  );
}
