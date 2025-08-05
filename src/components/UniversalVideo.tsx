"use client";

import React, { useState, useEffect } from 'react';

interface UniversalVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const UniversalVideo = React.memo(function UniversalVideo({
  src,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  playsInline = true,
  className = "",
  style = {},
  onLoad,
  onError,
}: UniversalVideoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setError('No video source provided');
      setIsLoading(false);
      return;
    }
  }, [src]);

  const handleLoadedData = () => {
    setIsLoading(false);
    setError(null);
    if (onLoad) onLoad();
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('UniversalVideo: Video loading error:', e);
    }
    const errorMessage = 'Failed to load video. Please check the URL and try again.';
    setError(errorMessage);
    setIsLoading(false);
    if (onError) onError(errorMessage);
  };

  if (error) {
    return (
      <div className={`bg-white flex items-center justify-center ${className}`} style={style}>
        <div className="text-center p-4">
          <p className="text-text-primary text-sm">{error}</p>
          <p className="text-text-primary text-xs mt-1">Video source: {src}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && poster && (
        <div className="absolute inset-0 flex items-center justify-center z-10"
             style={{
               backgroundImage: `url(${poster})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative z-10 text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {isLoading && !poster && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
          <div className="relative z-10 text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}
      
      <video
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline={playsInline}
        preload="metadata"
        onLoadedData={handleLoadedData}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          filter: 'brightness(1.08) saturate(1.15) contrast(1.08)',
          transition: 'filter 1s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease-in-out',
        }}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

export default UniversalVideo;