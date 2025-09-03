"use client";

import { useState } from 'react';

export default function TestBookingPage() {
  const [result, setResult] = useState<{
    error?: string;
    [key: string]: unknown;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const testAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dahabiyaId: 'royal-cleopatra', // This should be a real dahabiya ID
          startDate: '2024-12-01',
          endDate: '2024-12-05',
          guests: 2
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to check availability' });
    } finally {
      setLoading(false);
    }
  };

  const testBooking = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dahabiyaId: 'royal-cleopatra',
          startDate: '2024-12-01',
          endDate: '2024-12-05',
          guests: 2,
          totalPrice: 7000,
          specialRequests: 'Test booking'
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to create booking' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Booking System Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testAvailability}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Availability'}
        </button>
        
        <button 
          onClick={testBooking}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Booking'}
        </button>
      </div>

      {result && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          padding: '15px',
          marginTop: '20px'
        }}>
          <h3>Result:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
