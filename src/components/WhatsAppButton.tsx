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
      className={`fixed z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group shadow-lg hover:shadow-xl ${
        finalPosition === 'bottom-right' ? 'bottom-24 right-6' : 'bottom-24 left-6'
      }`}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle
        size={28}
        color="white"
        className="transition-transform duration-300 group-hover:scale-110"
      />
      
      {/* Tooltip */}
      <div className={`absolute ${
        finalPosition === 'bottom-right' ? 'right-16 bottom-2' : 'left-16 bottom-2'
      } bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-lg`}>
        Chat with us on WhatsApp
        <div className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45 ${
          finalPosition === 'bottom-right' ? '-right-1' : '-left-1'
        }`}></div>
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
