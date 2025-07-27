"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TailorMadeManager from '@/components/admin/TailorMadeManager';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import { RoyalCrown } from '@/components/ui/pharaonic-elements';

export default function AdminTailorMadePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-white to-ocean-blue/5">
      <Container maxWidth="xl" className="py-8">
        <AnimatedSection>
          <Box className="text-center mb-8">
            <RoyalCrown className="mx-auto mb-4" />
            <Typography 
              variant="h3" 
              component="h1" 
              className="font-heading text-ocean-blue mb-2"
            >
              Tailor-Made Requests Management
            </Typography>
            <Typography 
              variant="h6" 
              className="text-text-secondary max-w-2xl mx-auto"
            >
              Manage custom journey requests and create personalized experiences for your guests
            </Typography>
          </Box>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <TailorMadeManager />
        </AnimatedSection>
      </Container>
    </div>
  );
}
