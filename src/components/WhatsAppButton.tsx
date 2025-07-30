"use client";

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useWhatsAppSettings } from '@/hooks/useWhatsAppSettings';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export default function WhatsAppButton({
  phoneNumber,
  message,
  position
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { settings, loading } = useWhatsAppSettings();

  // Use dashboard settings or fallback to props
  const finalPhoneNumber = phoneNumber || settings.phone;
  const finalMessage = message || settings.message;
  const finalPosition = position || settings.position;
  const finalDelay = settings.delay * 1000; // Convert to milliseconds

  useEffect(() => {
    if (loading || !settings.enabled) return;

    // Show button after configured delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, finalDelay);

    return () => clearTimeout(timer);
  }, [loading, settings.enabled, finalDelay]);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${finalPhoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Don't show if disabled in settings or still loading
  if (loading || !settings.enabled || !isVisible) return null;

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`fixed z-50 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
        finalPosition === 'bottom-right' ? 'bottom-24 right-6' : 'bottom-24 left-6'
      }`}
      style={{
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
        boxShadow: '0 8px 25px rgba(37, 211, 102, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(37, 211, 102, 0.3)',
        border: '3px solid rgba(255, 255, 255, 0.4)',
        animation: 'pulse-whatsapp 2s infinite'
      }}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle
        size={32}
        color="white"
        className="transition-transform duration-300 group-hover:scale-110"
        style={{
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        }}
      />
      
      {/* Tooltip */}
      <div
        className={`absolute ${
          finalPosition === 'bottom-right' ? 'right-20 bottom-3' : 'left-20 bottom-3'
        } text-white text-sm px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold`}
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        💬 Chat with us on WhatsApp
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rotate-45 ${
            finalPosition === 'bottom-right' ? '-right-1.5' : '-left-1.5'
          }`}
          style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes pulse-whatsapp {
          0% {
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4), 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          70% {
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4), 0 0 0 10px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4), 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
      `}</style>
    </button>
  );
}
