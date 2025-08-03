"use client";

import React, { useState, useEffect, useRef } from 'react';

interface OptimizedHeroVideoProps {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedHeroVideo({
  src,
  poster,
  className = '',
  style = {},
  onLoad,
  onError
}: OptimizedHeroVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log('✅ Video loaded successfully');
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    };

    const handleError = (e: Event) => {
      console.error('❌ Video loading error:', e);
      setHasError(true);
      setIsLoaded(false);
      onError?.();
    };

    const handleCanPlay = () => {
      console.log('✅ Video can play');
      setIsLoaded(true);
      // Try to play the video
      video.play().catch(err => {
        console.warn('Video autoplay failed:', err);
      });
    };

    const handlePlay = () => {
      console.log('▶️ Video started playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Video paused');
      setIsPlaying(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [onLoad, onError]);

  // Preload the video
  useEffect(() => {
    if (src && videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  const videoStyle: React.CSSProperties = {
    objectFit: 'cover',
    objectPosition: 'center 30%', // Position video to show more of the top/middle area
    width: '100%',
    height: '100%',
    transform: 'scale(1.02)', // Slight scale to ensure full coverage and prevent cropping
    transition: 'opacity 0.5s ease-in-out',
    opacity: isLoaded && !hasError ? 1 : 0,
    ...style
  };

  if (hasError) {
    return (
      <div 
        className={`bg-cover bg-center bg-no-repeat ${className}`}
        style={{
          backgroundImage: `url(${poster || '/images/hero-bg.jpg'})`,
          width: '100%',
          height: '100%',
          ...style
        }}
      />
    );
  }

  return (
    <>
      {/* Poster image as background while video loads */}
      {!isLoaded && poster && (
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${className}`}
          style={{
            backgroundImage: `url(${poster})`,
            zIndex: 5
          }}
        />
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        className={`hero-video ${className}`}
        style={videoStyle}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        src={src}
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading Experience...</p>
          </div>
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded text-xs z-20">
          <div>Video: {src}</div>
          <div>Loaded: {isLoaded ? '✅' : '❌'}</div>
          <div>Playing: {isPlaying ? '▶️' : '⏸️'}</div>
          <div>Error: {hasError ? '❌' : '✅'}</div>
        </div>
      )}
    </>
  );
}
