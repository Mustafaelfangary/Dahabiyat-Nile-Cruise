'use client';

import { PharaonicPageTemplate } from '@/components/ui/pharaonic-page-template';
import { useContent } from '@/hooks/useContent';

export default function FamilyHeritagePage() {
  const { getContent, loading, error } = useContent({ page: 'family-heritage' });

  if (loading) {
    return (
      <PharaonicPageTemplate
        name="Family Heritage Experience"
        shortDescription="𓏏 Loading family adventures... 𓏏"
        description=""
        mainImageUrl="/images/family-heritage-hero.jpg"
        type="FAMILY"
        category="EDUCATIONAL"
        rating={4.7}
        features={[]}
        advantages=""
        meaning=""
        pageType="package"
        loading={true}
        primaryColor="ocean-blue"
        secondaryColor="ocean-blue"
      />
    );
  }

  if (error) {
    return (
      <PharaonicPageTemplate
        name="Family Heritage Experience"
        shortDescription="𓊪 Family experience temporarily unavailable 𓊪"
        description="𓈖 The gods are blessing this family journey. Please try again later 𓈖"
        mainImageUrl="/images/family-heritage-hero.jpg"
        type="FAMILY"
        category="EDUCATIONAL"
        rating={4.7}
        features={[]}
        advantages=""
        meaning=""
        pageType="package"
        loading={false}
        primaryColor="ocean-blue"
        secondaryColor="ocean-blue"
      />
    );
  }

  return (
    <PharaonicPageTemplate
      name={getContent('family-heritage_title', '𓏏 Family Heritage Experience 𓏏')}
      shortDescription={getContent('family-heritage_subtitle', '𓌻 Perfect family adventure with educational and entertaining experiences for all ages 𓌻')}
      description={getContent('family-heritage_description', '𓊃 Designed specifically for families, this package offers educational and entertaining experiences that captivate both children and adults. Interactive museum visits, treasure hunts in temples, and family-friendly activities make ancient Egypt come alive for the whole family 𓌻')}
      mainImageUrl={getContent('family-heritage_hero_image', '/images/family-heritage-hero.jpg')}
      videoUrl={getContent('family-heritage_video_url', '/videos/family-heritage.mp4')}
      type={getContent('family-heritage_type', 'FAMILY')}
      category={getContent('family-heritage_category', 'EDUCATIONAL')}
      price={parseFloat(getContent('family-heritage_price', '2400'))}
      durationDays={parseInt(getContent('family-heritage_duration', '5'))}
      maxGuests={parseInt(getContent('family-heritage_max_guests', '20'))}
      rating={parseFloat(getContent('family-heritage_rating', '4.7'))}
      features={getContent('family-heritage_features', '𓏏 Family-Friendly Activities,𓊃 Interactive Museum Tours,𓌻 Temple Treasure Hunts,𓈖 Children\'s Archaeology Workshop,𓊪 Family Cooking Classes,𓇳 Educational Games,𓂀 Storytelling Sessions,𓇯 Arts & Crafts Workshops').split(',')}
      advantages={getContent('family-heritage_advantages', '𓂀 Create lasting family memories while educating children about ancient Egyptian civilization through hands-on experiences and interactive learning 𓏏')}
      meaning={getContent('family-heritage_meaning', '𓇯 This family journey honors the Egyptian tradition of passing wisdom from generation to generation, like the eternal flow of the Nile 𓊃')}
      pageType="package"
      primaryColor="ocean-blue"
      secondaryColor="ocean-blue"
    />
  );
}
