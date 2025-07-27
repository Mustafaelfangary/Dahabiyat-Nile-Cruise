"use client";
export const dynamic = "force-dynamic";

import { useContent } from '@/hooks/useContent';
import UnifiedPackagePage from '@/components/package/UnifiedPackagePage';

export default function AdventureExplorerPage() {
  const { getContent, loading, error } = useContent({ page: 'adventure-explorer' });

  if (error) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <div className="text-ocean-blue text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-text-primary font-bold text-xl">𓂀 Content Loading Error: {error} 𓏏</p>
        </div>
      </div>
    );
  }

  return (
    <UnifiedPackagePage
      packageSlug="adventure-explorer"
      packageName="Adventure Explorer"
      style="pharaonic"
      showBookingForm={true}
      showItinerary={true}
      showReviews={true}
      showGallery={true}
    />
  );
}
