"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Users, Ship, Package, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AvailabilityIntegratedBookingProps {
  type: 'dahabiya' | 'package';
  itemId: string;
  itemName: string;
  basePrice: number;
  maxGuests?: number;
  durationDays?: number;
}

interface AvailabilityResult {
  isAvailable: boolean;
  totalPrice: number;
  message?: string;
  // availableCabins removed - cabin system removed
  recommendedDahabiyaId?: string;
}

export default function AvailabilityIntegratedBooking({
  type,
  itemId,
  itemName,
  basePrice,
  maxGuests = 20,
  durationDays = 7
}: AvailabilityIntegratedBookingProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResult | null>(null);
  
  // Form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(2);
  // const [selectedCabinId, setSelectedCabinId] = useState('');  // REMOVED: cabin system removed
  const [specialRequests, setSpecialRequests] = useState('');

  // Auto-calculate end date based on duration
  useEffect(() => {
    if (startDate && durationDays) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + durationDays);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, durationDays]);

  const checkAvailability = async () => {
    if (!startDate || !endDate || !guests) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCheckingAvailability(true);
    try {
      const endpoint = type === 'dahabiya' ? '/api/availability' : '/api/package-availability';
      const body = type === 'dahabiya' 
        ? { dahabiyaId: itemId, startDate, endDate, guests }
        : { packageId: itemId, startDate, endDate, guests };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setAvailabilityResult(data);

      if (data.isAvailable) {
        toast.success(data.message || 'Dates are available!');
      } else {
        toast.error(data.message || 'Selected dates are not available');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Error checking availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleBooking = async () => {
    if (!session) {
      toast.error('Please sign in to make a booking');
      return;
    }

    if (!availabilityResult?.isAvailable) {
      toast.error('Please check availability first');
      return;
    }

    setLoading(true);
    try {
      const endpoint = type === 'dahabiya' ? '/api/bookings' : '/api/package-bookings';
      const bookingData = type === 'dahabiya'
        ? {
            dahabiyaId: itemId,
            // cabinId: selectedCabinId || (availabilityResult.availableCabins?.[0]?.id),  // REMOVED: cabin system removed
            startDate,
            endDate,
            guests,
            specialRequests,
            totalPrice: availabilityResult.totalPrice
          }
        : {
            packageId: itemId,
            startDate,
            endDate,
            guests,
            specialRequests,
            totalPrice: availabilityResult.totalPrice,
            type: 'PACKAGE',
            recommendedDahabiyaId: availabilityResult.recommendedDahabiyaId
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      toast.success('Booking created successfully!');
      // Reset form
      setStartDate('');
      setEndDate('');
      setGuests(2);
      setSpecialRequests('');
      setAvailabilityResult(null);

    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <div style={{background: "white"}}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{color: "hsl(220, 15%, 20%)"}}>𓇳</span>
          {type === 'dahabiya' ? <Ship className="w-8 h-8 text-ocean-blue" /> : <Package className="w-8 h-8 text-ocean-blue" />}
          <span style={{color: "hsl(220, 15%, 20%)"}}>𓇳</span>
        </div>
        <h3 style={{color: "hsl(220, 15%, 20%)"}}>
          𓊪 Reserve Your {type === 'dahabiya' ? 'Vessel' : 'Journey'} 𓊪
        </h3>
        <p style={{ color: '#666', margin: 0 }}>
          {itemName} - Starting from ${basePrice.toLocaleString()}
        </p>
      </div>

      {/* Booking Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            <Calendar className="w-4 h-4 inline mr-2" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={minDate.toISOString().split('T')[0]}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d4af37',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            <Calendar className="w-4 h-4 inline mr-2" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || minDate.toISOString().split('T')[0]}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d4af37',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            <Users className="w-4 h-4 inline mr-2" />
            Number of Guests
          </label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            min="1"
            max={maxGuests}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d4af37',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            <Clock className="w-4 h-4 inline mr-2" />
            Duration
          </label>
          <input
            type="text"
            value={`${durationDays} days`}
            readOnly
            style={{background: "white"}}
          />
        </div>
      </div>

      {/* Special Requests */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
          Special Requests (Optional)
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special dietary requirements, celebrations, or preferences..."
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #d4af37',
            borderRadius: '8px',
            fontSize: '16px',
            minHeight: '80px',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Availability Check Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={checkAvailability}
          disabled={checkingAvailability || !startDate || !endDate || !guests}
          style={{background: "white"}}
        >
          {checkingAvailability ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #666',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Checking Availability...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              Check Availability
            </>
          )}
        </button>
      </div>

      {/* Availability Result */}
      {availabilityResult && (
        <div style={{
          backgroundColor: availabilityResult.isAvailable ? '#d4edda' : '#f8d7da',
          border: `2px solid ${availabilityResult.isAvailable ? '#28a745' : '#dc3545'}`,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {availabilityResult.isAvailable ? (
              <CheckCircle className="w-5 h-5 text-text-primary" />
            ) : (
              <XCircle className="w-5 h-5 text-text-primary" />
            )}
            <span style={{color: "hsl(220, 15%, 20%)"}}>
              {availabilityResult.isAvailable ? 'Available!' : 'Not Available'}
            </span>
          </div>
          <p style={{color: "hsl(220, 15%, 20%)"}}>
            {availabilityResult.message}
          </p>
          {availabilityResult.isAvailable && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign className="w-4 h-4" />
              <span style={{ fontWeight: 'bold' }}>
                Total Price: ${availabilityResult.totalPrice.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* REMOVED: Cabin Selection - cabin system removed */}

      {/* Book Now Button */}
      {availabilityResult?.isAvailable && (
        <button
          onClick={handleBooking}
          disabled={loading || !session}
          style={{background: "white"}}
        >
          {loading ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Creating Booking...
            </>
          ) : (
            <>
              <span style={{ fontSize: '24px' }}>𓊪</span>
              Book Now - ${availabilityResult.totalPrice.toLocaleString()}
              <span style={{ fontSize: '24px' }}>𓊪</span>
            </>
          )}
        </button>
      )}

      {!session && (
        <div style={{background: "white"}}>
          <p style={{color: "hsl(220, 15%, 20%)"}}>
            Please <a href="/auth/signin" style={{color: "hsl(220, 15%, 20%)"}}>sign in</a> to make a booking
          </p>
        </div>
      )}
    </div>
  );
}
