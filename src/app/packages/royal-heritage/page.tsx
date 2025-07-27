"use client";
export const dynamic = "force-dynamic";

import { useContent } from '@/hooks/useContent';
import { useEffect, useState } from 'react';
import { PharaonicPageTemplate } from '@/components/ui/pharaonic-page-template';

export default function RoyalHeritagePage() {
  const { getContent, loading, error } = useContent({ page: 'royal-heritage' });
  const [packageData, setPackageData] = useState<any>(null);
  const [packageLoading, setPackageLoading] = useState(true);

  // Fetch package data from database and content management system
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        // First try to get content from the CMS
        const contentResponse = await fetch('/api/package-pages/royal-heritage');
        let cmsContent = {};
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          cmsContent = contentData.reduce((acc: any, item: any) => {
            acc[item.key] = item.content;
            return acc;
          }, {});
        }

        // Try to find the package by name or slug in database
        const response = await fetch('/api/packages?limit=100');
        if (response.ok) {
          const data = await response.json();
          const package_ = data.packages?.find((p: any) =>
            p.name?.toLowerCase().includes('royal') ||
            p.slug?.includes('royal-heritage')
          );
          if (package_) {
            setPackageData(package_);
          } else {
            // Use CMS content with fallback data
            setPackageData({
              name: cmsContent['royal-heritage_name'] || getContent('royal-heritage_name', 'Royal Heritage Package'),
              shortDescription: cmsContent['royal-heritage_short_description'] || getContent('royal-heritage_short_description', 'Experience the wonders of Egypt with this amazing package.'),
              description: cmsContent['royal-heritage_description'] || getContent('royal-heritage_description', 'Discover the beauty and history of Egypt with our comprehensive package.'),
              advantages: cmsContent['royal-heritage_advantages'] || getContent('royal-heritage_advantages', 'This package offers an incredible journey through ancient Egypt.'),
              meaning: cmsContent['royal-heritage_meaning'] || getContent('royal-heritage_meaning', 'This package represents the essence of Egyptian exploration.'),
              mainImageUrl: cmsContent['royal-heritage_main_image'] || getContent('royal-heritage_main_image', '/images/royal-heritage-main.jpg'),
              videoUrl: cmsContent['royal-heritage_video'] || getContent('royal-heritage_video', '/videos/royal-heritage-tour.mp4'),
              price: parseInt(cmsContent['royal-heritage_price']) || 2000,
              durationDays: parseInt(cmsContent['royal-heritage_duration']) || 7,
              maxGuests: parseInt(cmsContent['royal-heritage_max_guests']) || 20,
              rating: parseFloat(cmsContent['royal-heritage_rating']) || 4.8,
              features: cmsContent['royal-heritage_features'] ? JSON.parse(cmsContent['royal-heritage_features']) : ['Guided Tours', 'Comfortable Accommodation', 'Cultural Experiences'],
              inclusions: cmsContent['royal-heritage_inclusions'] ? JSON.parse(cmsContent['royal-heritage_inclusions']) : ['Accommodation', 'Meals', 'Transportation'],
              images: cmsContent['royal-heritage_images'] ? JSON.parse(cmsContent['royal-heritage_images']) : [],
              itineraryDays: cmsContent['royal-heritage_itinerary'] ? JSON.parse(cmsContent['royal-heritage_itinerary']) : []
            });
          }
        }
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setPackageLoading(false);
      }
    };

    fetchPackage();
  }, [getContent]);

  if (loading || packageLoading || !packageData) {
    return (
      <PharaonicPageTemplate
        name="Royal Heritage Package"
        shortDescription="Loading journey..."
        description=""
        mainImageUrl="/images/royal-heritage-main.jpg"
        rating={4.8}
        features={[]}
        advantages=""
        meaning=""
        pageType="package"
        loading={true}
      />
    );
  }

  if (error) {
    return (
      <PharaonicPageTemplate
        name="Royal Heritage Package"
        shortDescription="Journey not found"
        description=""
        mainImageUrl="/images/royal-heritage-main.jpg"
        rating={4.8}
        features={[]}
        advantages=""
        meaning=""
        pageType="package"
        loading={true}
      />
    );
  }

  return (
    <PharaonicPageTemplate
      name={packageData.name}
      shortDescription={packageData.shortDescription}
      description={packageData.description}
      mainImageUrl={packageData.mainImageUrl}
      videoUrl={packageData.videoUrl}
      type={packageData.type || 'STANDARD'}
      category={packageData.category || 'CLASSIC'}
      price={packageData.price}
      durationDays={packageData.durationDays}
      maxGuests={packageData.maxGuests}
      rating={packageData.rating}
      features={packageData.features}
      advantages={packageData.advantages}
      meaning={packageData.meaning}
      pageType="package"
      primaryColor="white"
      secondaryColor="ocean-blue"
    />
  );
}