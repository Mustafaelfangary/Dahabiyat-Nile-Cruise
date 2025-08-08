"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  style?: React.CSSProperties;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
}

export default function ZoomableImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  sizes,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  style,
  objectFit = 'cover',
  objectPosition = 'center',
  ...props
}: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageClick = () => {
    setIsZoomed(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        handleCloseZoom();
      }
    };

    if (isZoomed) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isZoomed]);

  const imageProps = {
    src,
    alt,
    quality,
    priority,
    placeholder,
    ...(blurDataURL && { blurDataURL }),
    ...(sizes && { sizes }),
    ...(fill ? { fill: true } : { width, height }),
    style: {
      objectFit,
      objectPosition,
      ...style,
    },
    ...props,
  };

  return (
    <>
      {/* Main Image with Hover Effects */}
      <div
        className={`relative cursor-pointer group overflow-hidden ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleImageClick}
        style={fill ? { position: 'relative', width: '100%', height: '100%' } : {}}
      >
        <Image
          {...imageProps}
          className={`transition-all duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${fill ? 'object-cover' : ''}`}
        />
        
        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform transition-transform duration-300 hover:scale-110">
            <ZoomIn className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Ocean blue themed hover border */}
        <div
          className={`absolute inset-0 border-2 border-ocean-blue transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(45deg, transparent 49%, rgba(0, 128, 255, 0.2) 50%, transparent 51%)',
          }}
        />
      </div>

      {/* Full Screen Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={handleCloseZoom}
          style={{ zIndex: 9999 }}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseZoom}
            className="absolute top-4 right-4 z-[10000] bg-egyptian-gold/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-egyptian-gold/40 transition-all duration-200 group"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Egyptian-themed decorative corners */}
          <div className="absolute top-4 left-4 text-egyptian-gold text-2xl animate-pulse">𓇳</div>
          <div className="absolute top-4 right-20 text-egyptian-gold text-2xl animate-pulse">𓊪</div>
          <div className="absolute bottom-4 left-4 text-egyptian-gold text-2xl animate-pulse">𓈖</div>
          <div className="absolute bottom-4 right-4 text-egyptian-gold text-2xl animate-pulse">𓂀</div>

          {/* Zoomed Image Container */}
          <div
            className="relative max-w-[95vw] max-h-[95vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              quality={100}
              priority
              sizes="95vw"
            />
          </div>

          {/* Egyptian-themed bottom info */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-hieroglyph-brown/80 backdrop-blur-sm text-egyptian-gold px-6 py-2 rounded-full text-sm font-medium">
            <span className="mr-2">𓏏</span>
            Click anywhere to close
            <span className="ml-2">𓇯</span>
          </div>
        </div>
      )}
    </>
  );
}

// Export a wrapper component for easier migration
export function ZoomableImageWrapper({ children, ...props }: { children?: React.ReactNode } & ZoomableImageProps) {
  if (children) {
    // If children provided, wrap them with zoom functionality
    return (
      <div className="relative cursor-pointer group" onClick={() => {}}>
        {children}
      </div>
    );
  }
  
  return <ZoomableImage {...props} />;
}
