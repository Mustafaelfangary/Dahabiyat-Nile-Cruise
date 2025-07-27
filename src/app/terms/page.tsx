"use client";
export const dynamic = "force-dynamic";

import { Container, Typography, Box, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import {
  HieroglyphicText,
  EgyptianBorder,
  PharaohCard,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  RoyalCrown,
  HieroglyphicDivider,
} from '@/components/ui/pharaonic-elements';

export default function TermsPage() {
  const [termsContent, setTermsContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTermsContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/settings/terms', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load terms content');
        }

        const data = await response.json();
        setTermsContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load terms content');
        // Fallback to default content
        setTermsContent({
          title: 'Terms and Conditions',
          content: 'Terms and conditions content is being updated. Please check back soon.',
          lastUpdated: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    loadTermsContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <div className="text-amber-800 text-2xl font-bold">𓇳 Loading Royal Terms 𓇳</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 overflow-hidden">
        <Container maxWidth="lg" className="relative z-10">
          <div className="text-center text-white">
            {/* Hieroglyphic Egypt at top */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-amber-300 mb-4 drop-shadow-lg">
                𓇳 𓈖 𓊪 𓏏 𓇳
              </div>
              <HieroglyphicDivider />
            </div>

            {/* Royal Crown */}
            <div className="flex justify-center mb-6">
              <RoyalCrown size="large" />
            </div>

            {/* Main Title */}
            <HieroglyphicText
              text={termsContent?.title || "Terms and Conditions"}
              className="text-5xl md:text-7xl font-bold mb-6 text-amber-100 drop-shadow-2xl"
            />

            {/* Subtitle */}
            <Typography
              variant="h4"
              className="text-2xl md:text-3xl mb-8 text-amber-200 font-light drop-shadow-lg"
            >
              𓊪 Royal Covenant of Service 𓊪
            </Typography>
          </div>
        </Container>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-amber-50/30 relative">
        <Container maxWidth="md">
          <PharaohCard className="overflow-hidden">
            <div className="p-8 md:p-12">
              {termsContent?.lastUpdated && (
                <div className="text-center mb-8 text-amber-600">
                  <Typography variant="body2">
                    Last Updated: {new Date(termsContent.lastUpdated).toLocaleDateString()}
                  </Typography>
                </div>
              )}

              <div className="prose prose-lg prose-amber max-w-none">
                <div
                  className="text-amber-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: termsContent?.content || 'Terms and conditions content is being updated. Please check back soon.'
                  }}
                />
              </div>
            </div>
          </PharaohCard>
        </Container>
      </section>
    </div>
  );
}
