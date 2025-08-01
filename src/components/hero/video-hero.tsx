"use client";

import { Box, Container, Typography, Button } from '@mui/material';
import { useState, useEffect, memo } from 'react';
import NextLink from 'next/link';
import UniversalVideo from '@/components/UniversalVideo';
import { useContent } from '@/hooks/useContent';

interface VideoHeroProps {
  videoSrc: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export const VideoHero = memo(function VideoHero({
  videoSrc,
  title,
  subtitle,
  ctaText,
  ctaLink,
}: VideoHeroProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getContent } = useContent({ page: 'global_media' });

  useEffect(() => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('VideoHero mounted with videoSrc:', videoSrc);
    }
  }, [videoSrc]);

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Video error:', error);
    }
    // Fallback to image hero if video fails
    return (
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Container>
            <Box
              sx={{
                opacity: 0,
                animation: 'fadeIn 0.8s ease-out forwards',
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  mb: 2,
                  fontFamily: 'var(--font-playfair)',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                  textShadow: '0 4px 24px rgba(0,0,0,0.7), 0 1px 0 #fff2',
                  letterSpacing: '0.04em',
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  mb: { xs: 4, md: 6 },
                  maxWidth: '800px',
                  mx: 'auto',
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  fontWeight: 400,
                  fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
                  px: { xs: 2, md: 0 },
                }}
              >
                {subtitle}
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                {ctaLink && (
                  <Button
                    variant="contained"
                    size="large"
                    href={ctaLink}
                    sx={{
                      background: 'linear-gradient(90deg, #FFD700 0%, #FFB300 100%)',
                      color: 'black',
                      boxShadow: '0 0 24px 6px rgba(255, 215, 0, 0.25), 0 4px 20px rgba(0,0,0,0.2)',
                      borderRadius: '40px',
                      px: { xs: 4, md: 7 },
                      py: { xs: 2, md: 2.5 },
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      minWidth: { xs: '180px', md: '220px' },
                      '&:hover': {
                        background: 'linear-gradient(90deg, #FFB300 0%, #FFD700 100%)',
                        transform: 'scale(1.06)',
                        boxShadow: '0 0 32px 10px rgba(255, 215, 0, 0.35), 0 8px 32px rgba(0,0,0,0.25)',
                      },
                    }}
                  >
                    {ctaText || 'Book Now'}
                  </Button>
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <UniversalVideo
        src={videoSrc}
        poster={getContent('hero_fallback_image', '/images/hero-bg.jpg')}
        className="absolute inset-0 w-full h-full"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onLoad={() => setIsLoading(false)}
        onError={(error) => setError(error)}
        autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
      />
      
      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container>
          <Box
            sx={{
              opacity: 0,
              animation: 'fadeIn 0.8s ease-out forwards',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                textAlign: 'center',
                mb: 2,
                fontFamily: 'var(--font-playfair)',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                textShadow: '0 4px 24px rgba(0,0,0,0.7), 0 1px 0 #fff2',
                letterSpacing: '0.04em',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                textAlign: 'center',
                mb: { xs: 4, md: 6 },
                maxWidth: '800px',
                mx: 'auto',
                textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                fontWeight: 400,
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
                px: { xs: 2, md: 0 },
              }}
            >
              {subtitle}
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              {/* Enhanced Brilliant Book Now Button */}
              {ctaLink ? (
                ctaLink.startsWith('/') ? (
                  <NextLink href={ctaLink}>
                    <Button
                      variant="contained"
                      size="large"
                      aria-label={ctaText || 'Book Now'}
                      sx={{
                        background: 'linear-gradient(90deg, #FFD700 0%, #FFB300 100%)',
                        color: 'black',
                        boxShadow: '0 0 24px 6px rgba(255, 215, 0, 0.25), 0 4px 20px rgba(0,0,0,0.2)',
                        borderRadius: '40px',
                        px: { xs: 4, md: 7 },
                        py: { xs: 2, md: 2.5 },
                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        minWidth: { xs: '180px', md: '220px' },
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.18s cubic-bezier(.4,0,.2,1)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #FFB300 0%, #FFD700 100%)',
                          color: 'black',
                          transform: 'scale(1.06)',
                          boxShadow: '0 0 32px 10px rgba(255, 215, 0, 0.35), 0 8px 32px rgba(0,0,0,0.25)',
                        },
                        '&:active::after': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%',
                          background: 'radial-gradient(circle, rgba(255,255,255,0.25) 10%, transparent 10.01%)',
                          animation: 'ripple 0.4s linear',
                          pointerEvents: 'none',
                        },
                        '@keyframes ripple': {
                          '0%': { opacity: 1, transform: 'scale(0.8)' },
                          '100%': { opacity: 0, transform: 'scale(2.5)' },
                        },
                      }}
                    >
                      <span>{ctaText || 'Book Now'}</span>
                    </Button>
                  </NextLink>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    href={ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ctaText || 'Book Now'}
                    sx={{
                      background: 'linear-gradient(90deg, #FFD700 0%, #FFB300 100%)',
                      color: 'black',
                      boxShadow: '0 0 24px 6px rgba(255, 215, 0, 0.25), 0 4px 20px rgba(0,0,0,0.2)',
                      borderRadius: '40px',
                      px: { xs: 4, md: 7 },
                      py: { xs: 2, md: 2.5 },
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      minWidth: { xs: '180px', md: '220px' },
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.18s cubic-bezier(.4,0,.2,1)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #FFB300 0%, #FFD700 100%)',
                        color: 'black',
                        transform: 'scale(1.06)',
                        boxShadow: '0 0 32px 10px rgba(255, 215, 0, 0.35), 0 8px 32px rgba(0,0,0,0.25)',
                      },
                      '&:active::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.25) 10%, transparent 10.01%)',
                        animation: 'ripple 0.4s linear',
                        pointerEvents: 'none',
                      },
                      '@keyframes ripple': {
                        '0%': { opacity: 1, transform: 'scale(0.8)' },
                        '100%': { opacity: 0, transform: 'scale(2.5)' },
                      },
                    }}
                  >
                    <span>{ctaText || 'Book Now'}</span>
                  </Button>
                )
              ) : null}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
});