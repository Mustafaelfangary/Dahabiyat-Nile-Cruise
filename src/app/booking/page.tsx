'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Ship, Star, Users, Crown, DollarSign } from 'lucide-react';
import { Typography } from '@mui/material';
import Link from 'next/link';
import BookingForm from '@/components/BookingForm';
import PackageBookingForm from '@/components/PackageBookingForm';

interface Dahabiya {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerDay: number;
  mainImageUrl?: string;
  rating?: number;
}

export default function BookingPage() {
  const params = useSearchParams();
  const itemId = params?.get('itemId') ?? null;
  const dahabiyaId = params?.get('dahabiyaId') ?? itemId;
  const packageId = params?.get('packageId') ?? itemId;
  const bookingType = params?.get('type') ?? 'dahabiya';

  const [selectedDahabiya, setSelectedDahabiya] = useState<Dahabiya | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [dahabiyat, setDahabiyat] = useState<Dahabiya[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data for selection
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (bookingType === 'package' || packageId) {
          // Fetch packages
          const response = await fetch('/api/packages?limit=20');
          if (response.ok) {
            const data = await response.json();
            setPackages(data.packages || []);

            // If packageId is provided, find and select it
            if (packageId && data.packages) {
              const selected = data.packages.find((p: any) => p.id === packageId);
              if (selected) {
                setSelectedPackage(selected);
              }
            }
          }
        } else {
          // Fetch dahabiyas
          const response = await fetch('/api/dahabiyas?active=true&limit=20');
          if (response.ok) {
            const data = await response.json();
            setDahabiyat(data.dahabiyas || []);

            // If dahabiyaId is provided, find and select it
            if (dahabiyaId && data.dahabiyas) {
              const selected = data.dahabiyas.find((d: Dahabiya) => d.id === dahabiyaId);
              if (selected) {
                setSelectedDahabiya(selected);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dahabiyaId, packageId, bookingType]);



  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-egyptian-gold to-sunset-orange rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <p className="text-egyptian-gold text-xl">Loading vessels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12 px-4">
      {/* Enhanced Pharaonic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Hieroglyphic Background Elements */}
        <div className="absolute top-10 left-10 text-egyptian-gold/10 text-4xl animate-pulse" style={{ animationDelay: '0s' }}>𓇳</div>
        <div className="absolute top-20 right-16 text-egyptian-gold/8 text-3xl animate-pulse" style={{ animationDelay: '2s' }}>𓊪</div>
        <div className="absolute top-32 left-1/4 text-egyptian-gold/12 text-3xl animate-pulse" style={{ animationDelay: '4s' }}>𓈖</div>
        <div className="absolute top-40 right-1/3 text-egyptian-gold/10 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>𓂀</div>
        <div className="absolute bottom-32 left-12 text-egyptian-gold/8 text-3xl animate-pulse" style={{ animationDelay: '1.5s' }}>𓊃</div>
        <div className="absolute bottom-40 right-12 text-egyptian-gold/10 text-3xl animate-pulse" style={{ animationDelay: '3.5s' }}>𓈖</div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Enhanced Pharaonic Header */}
        <div className="text-center mb-12">
          {/* Hieroglyphic Egypt at top */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-2">
              <span className="text-blue-600">𓂋</span><span className="text-emerald-600">𓏤</span><span className="text-blue-600">𓈖</span><span className="text-emerald-600">𓇋</span><span className="text-blue-600">𓆎</span><span className="text-emerald-600">𓏏</span><span className="text-blue-600">𓂻</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-egyptian-gold mb-4 font-heading bg-gradient-to-r from-egyptian-gold via-sunset-orange to-egyptian-gold bg-clip-text text-transparent">
            𓊪𓈖𓇳 Booking Portal 𓇳𓈖𓊪
          </h1>

          {/* Show selected dahabiya info if pre-selected */}
          {selectedDahabiya ? (
            <div className="bg-gradient-to-r from-egyptian-gold/20 to-amber-400/20 rounded-xl p-6 mb-6 border-2 border-egyptian-gold/30">
              <Typography variant="h5" className="text-hieroglyph-brown font-bold mb-2">
                Booking: {selectedDahabiya.name}
              </Typography>
              <Typography variant="body1" className="text-amber-700">
                You've selected this vessel for your Nile journey
              </Typography>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-egyptian-gold" />
                  <span className="text-sm text-hieroglyph-brown">{selectedDahabiya.capacity} guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-egyptian-gold" />
                  <span className="text-sm text-hieroglyph-brown">${selectedDahabiya.pricePerDay}/day</span>
                </div>
                {selectedDahabiya.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-hieroglyph-brown">{selectedDahabiya.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-2xl text-text-secondary font-medium">
              Reserve Your {bookingType === 'package' ? 'Royal Egyptian Adventure' : 'Sacred Nile Journey'}
            </p>
          )}
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-amber-50 to-orange-50 p-6 border border-egyptian-gold/30 shadow-2xl rounded-xl">
              <h3 className="text-2xl font-bold text-egyptian-gold mb-6 flex items-center gap-2">
                <Ship className="w-6 h-6" />
                Select {bookingType === 'package' ? 'Package' : 'Vessel'}
              </h3>

              {/* Package Selection */}
              {bookingType === 'package' && (
                <>
                  {selectedPackage ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-egyptian-gold/20 to-sunset-orange/20 rounded-xl p-4 border border-egyptian-gold/50">
                        <h4 className="text-xl font-bold text-text-primary mb-2">{selectedPackage.name}</h4>
                        <div className="space-y-2 text-text-secondary">
                          <p className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Duration: {selectedPackage.durationDays} days
                          </p>
                          <p className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Price: ${Number(selectedPackage.price)}/person
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedPackage(null)}
                          className="mt-3 text-sm text-egyptian-gold hover:text-text-primary transition-colors"
                        >
                          Change package
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className="w-full text-left p-4 bg-white/50 hover:bg-egyptian-gold/20 rounded-xl transition-all duration-300 border border-egyptian-gold/30 hover:border-egyptian-gold/50"
                        >
                          <h4 className="text-text-primary font-bold mb-1">{pkg.name}</h4>
                          <p className="text-text-secondary text-sm">{pkg.durationDays} days • ${Number(pkg.price)}/person</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Dahabiya Selection */}
              {bookingType !== 'package' && (
                <>
                  {selectedDahabiya ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-egyptian-gold/20 to-sunset-orange/20 rounded-xl p-4 border border-egyptian-gold/50">
                        <h4 className="text-xl font-bold text-text-primary mb-2">{selectedDahabiya.name}</h4>
                        <div className="space-y-2 text-text-secondary">
                          <p className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Capacity: {selectedDahabiya.capacity} guests
                          </p>
                          <p className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Type: {selectedDahabiya.type}
                          </p>
                          <p className="flex items-center gap-2 font-bold">
                            <Crown className="w-4 h-4" />
                            From ${selectedDahabiya.pricePerDay}/day
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedDahabiya(null)}
                          className="mt-3 text-sm text-egyptian-gold hover:text-text-primary transition-colors"
                        >
                          Change vessel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {dahabiyat.map((dahabiya) => (
                        <button
                          key={dahabiya.id}
                          onClick={() => setSelectedDahabiya(dahabiya)}
                          className="w-full text-left p-4 bg-white/50 hover:bg-egyptian-gold/20 rounded-xl transition-all duration-300 border border-egyptian-gold/30 hover:border-egyptian-gold/50"
                        >
                          <h4 className="text-text-primary font-bold mb-1">{dahabiya.name}</h4>
                          <p className="text-text-secondary text-sm">{dahabiya.type} • {dahabiya.capacity} guests</p>
                          <p className="text-egyptian-gold text-sm font-bold">${dahabiya.pricePerDay}/day</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-b from-amber-50 to-orange-50 p-8 border border-egyptian-gold/30 shadow-2xl rounded-xl">
              {/* Package Booking */}
              {bookingType === 'package' && selectedPackage ? (
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-egyptian-gold mb-2">
                      Reserve Your Adventure
                    </h3>
                    <p className="text-text-secondary">
                      Complete your booking for {selectedPackage.name}
                    </p>
                  </div>
                  <PackageBookingForm
                    packageId={selectedPackage.id}
                    price={Number(selectedPackage.price)}
                    durationDays={selectedPackage.durationDays}
                    maxGuests={20}
                  />
                </div>
              ) : bookingType !== 'package' && selectedDahabiya ? (
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-egyptian-gold mb-2">
                      Reserve Your Journey
                    </h3>
                    <p className="text-text-secondary">
                      Complete your booking for {selectedDahabiya.name}
                    </p>
                  </div>
                  <BookingForm
                    dahabiyaId={selectedDahabiya.id}
                    price={selectedDahabiya.pricePerDay}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <Ship className="w-16 h-16 text-egyptian-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    Select a {bookingType === 'package' ? 'Package' : 'Vessel'}
                  </h3>
                  <p className="text-text-secondary">
                    Please choose a {bookingType === 'package' ? 'package' : 'dahabiya'} from the left to begin your booking
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <p className="text-text-secondary mb-4">
            Need assistance? Our royal advisors are here to help you plan your perfect journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white hover:bg-white text-text-primary px-6 py-3 rounded-xl transition-colors">
              Contact Our Advisors
            </Link>
            <Link href="/dahabiyat" className="bg-egyptian-gold/20 hover:bg-egyptian-gold/30 text-egyptian-gold px-6 py-3 rounded-xl transition-colors border border-egyptian-gold/50">
              Explore All Vessels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
