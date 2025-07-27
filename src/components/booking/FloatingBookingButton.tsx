"use client";

import React, { useState, useEffect } from 'react';
import { Fab, Tooltip, Zoom, Badge } from '@mui/material';
import { Crown, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePageContent } from '@/hooks/usePageContent';

interface FloatingBookingButtonProps {
  className?: string;
}

export default function FloatingBookingButton({ className = '' }: FloatingBookingButtonProps) {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000); // Show after 2 seconds

    const pulseTimer = setInterval(() => {
      setPulse(prev => !prev);
    }, 3000); // Pulse every 3 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(pulseTimer);
    };
  }, []);

  return (
    <Zoom in={visible}>
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Tooltip title="Book Your Sacred Journey" placement="left">
          <Link href="/booking?type=dahabiya">
            <Badge
              badgeContent="Book Now"
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#D4AF37',
                  color: '#8B4513',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  padding: '0 8px',
                  height: '20px',
                  minWidth: '60px',
                  borderRadius: '10px',
                  top: -8,
                  right: -20,
                  animation: pulse ? 'pulse 2s infinite' : 'none',
                }
              }}
            >
              <Fab
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
                  color: '#8B4513',
                  width: 70,
                  height: 70,
                  boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4)',
                  border: '3px solid #8B4513',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D4AF37 100%)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 12px 40px rgba(212, 175, 55, 0.6)',
                  },
                  transition: 'all 0.3s ease-in-out',
                  animation: pulse ? 'bounce 2s infinite' : 'none',
                }}
              >
                <div className="flex flex-col items-center">
                  <Crown size={28} className="mb-0.5" />
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>𓊪</span>
                </div>
              </Fab>
            </Badge>
          </Link>
        </Tooltip>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}</style>
      </div>
    </Zoom>
  );
}
