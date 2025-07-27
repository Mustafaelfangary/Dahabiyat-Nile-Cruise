"use client";
export const dynamic = "force-dynamic";

import { useContent } from '@/hooks/useContent';
import UnifiedPackagePage from '@/components/package/UnifiedPackagePage';

export default function LuxuryNileExperiencePage() {
  const { getContent, loading, error } = useContent({ page: 'luxury-nile-experience' });

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-ocean-blue text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-text-primary font-bold text-xl">𓂀 Content Loading Error: {error} 𓏏</p>
        </div>
      </div>
    );
  }

  return (
    <UnifiedPackagePage
      packageSlug="luxury-nile-experience"
      packageName="Luxury Nile Experience"
      style="pharaonic"
      showBookingForm={true}
      showItinerary={true}
      showReviews={true}
      showGallery={true}
    />
  );
}
