"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, Users, Ship, Package, Clock, DollarSign, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface CleanBookingFormProps {
  type: 'DAHABIYA' | 'PACKAGE';
  itemId: string;
  itemName: string;
  basePrice: number;
  maxGuests?: number;
  durationDays?: number;
  onBookingSuccess?: (booking: any) => void;
}

interface GuestDetail {
  name?: string; // For backward compatibility
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  age?: number;
  nationality?: string;
  dateOfBirth?: string;
  passport?: string;
  dietaryRequirements?: string[];
}

export default function CleanBookingForm({
  type,
  itemId,
  itemName,
  basePrice,
  maxGuests = 12,
  durationDays = 1,
  onBookingSuccess
}: CleanBookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [guestDetails, setGuestDetails] = useState<GuestDetail[]>([
    { name: "", email: "" }
  ]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Auto-calculate end date for packages
  useEffect(() => {
    if (startDate && type === 'PACKAGE' && durationDays) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + durationDays);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, type, durationDays]);

  // Update guest details array when guests count changes
  useEffect(() => {
    const currentCount = guestDetails.length;
    if (guests > currentCount) {
      // Add more guest detail forms
      const newDetails = [...guestDetails];
      for (let i = currentCount; i < guests; i++) {
        newDetails.push({ name: "", email: "" });
      }
      setGuestDetails(newDetails);
    } else if (guests < currentCount) {
      // Remove excess guest detail forms
      setGuestDetails(guestDetails.slice(0, guests));
    }
  }, [guests, guestDetails.length]);

  // Check availability when form data changes
  useEffect(() => {
    if (startDate && endDate && guests > 0) {
      checkAvailability();
    }
  }, [startDate, endDate, guests]);

  const checkAvailability = async () => {
    if (!startDate || !endDate || guests <= 0) return;

    setCheckingAvailability(true);
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          itemId,
          startDate,
          endDate,
          guests
        })
      });

      const result = await response.json();
      setAvailabilityResult(result);
      
      if (result.isAvailable) {
        setTotalPrice(result.totalPrice);
        toast.success("✅ Available!");
      } else {
        setTotalPrice(0);
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Availability check error:', error);
      toast.error("Failed to check availability");
    } finally {
      setCheckingAvailability(false);
    }
  };

  const updateGuestDetail = (index: number, field: keyof GuestDetail, value: string | number) => {
    const updated = [...guestDetails];
    updated[index] = { ...updated[index], [field]: value };
    setGuestDetails(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please sign in to make a booking");
      router.push('/auth/signin');
      return;
    }

    if (!availabilityResult?.isAvailable) {
      toast.error("Please check availability first");
      return;
    }

    // Validate guest details
    const validGuestDetails = guestDetails.filter(guest => 
      guest.name.trim() && guest.email.trim()
    );

    if (validGuestDetails.length === 0) {
      toast.error("Please provide at least one guest's details");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        type,
        [type === 'DAHABIYA' ? 'dahabiyaId' : 'packageId']: itemId,
        startDate,
        endDate,
        guests,
        specialRequests,
        totalPrice,
        guestDetails: validGuestDetails
      };

      console.log("📝 Submitting booking:", bookingData);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`🎉 Booking created successfully! Reference: ${result.bookingReference}`);
        if (onBookingSuccess) {
          onBookingSuccess(result);
        } else {
          router.push('/dashboard/bookings');
        }
      } else {
        toast.error(result.error || "Failed to create booking");
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          {type === 'DAHABIYA' ? <Ship className="w-6 h-6" /> : <Package className="w-6 h-6" />}
          Book {itemName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                disabled={type === 'PACKAGE'}
                required
              />
              {type === 'PACKAGE' && (
                <p className="text-sm text-gray-500 mt-1">
                  Fixed {durationDays} day package
                </p>
              )}
            </div>
          </div>

          {/* Guests Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Number of Guests
            </label>
            <Input
              type="number"
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Math.min(maxGuests, parseInt(e.target.value) || 1)))}
              min={1}
              max={maxGuests}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum {maxGuests} guests
            </p>
          </div>

          {/* Availability Check */}
          {startDate && endDate && guests > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {checkingAvailability ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : availabilityResult?.isAvailable ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="font-medium">
                  {checkingAvailability ? "Checking availability..." : 
                   availabilityResult?.isAvailable ? "Available" : 
                   availabilityResult?.message || "Not available"}
                </span>
              </div>
              
              {availabilityResult?.isAvailable && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{calculateDuration()} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>${basePrice}/day</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Price:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guest Details */}
          {availabilityResult?.isAvailable && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Guest Details</h3>
              {guestDetails.map((guest, index) => (
                <Card key={index} className="p-4">
                  <h4 className="font-medium mb-3">Guest {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name *"
                      value={guest.name}
                      onChange={(e) => updateGuestDetail(index, 'name', e.target.value)}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email *"
                      value={guest.email}
                      onChange={(e) => updateGuestDetail(index, 'email', e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Phone (optional)"
                      value={guest.phone || ''}
                      onChange={(e) => updateGuestDetail(index, 'phone', e.target.value)}
                    />
                    <Input
                      placeholder="Nationality (optional)"
                      value={guest.nationality || ''}
                      onChange={(e) => updateGuestDetail(index, 'nationality', e.target.value)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Special Requests */}
          {availabilityResult?.isAvailable && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special dietary requirements, accessibility needs, or other requests..."
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !availabilityResult?.isAvailable || !session}
            className="w-full bg-ocean-blue hover:bg-ocean-blue-dark text-white py-3 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Booking...
              </>
            ) : !session ? (
              "Sign In to Book"
            ) : !availabilityResult?.isAvailable ? (
              "Check Availability First"
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Book Now - ${totalPrice}
              </>
            )}
          </Button>

          {!session && (
            <p className="text-center text-sm text-gray-600">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push('/auth/signin')}
                className="p-0 h-auto text-ocean-blue"
              >
                Sign in
              </Button>
              {" "}to make a booking
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
