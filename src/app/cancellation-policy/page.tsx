'use client';

import { PharaonicPageTemplate } from '@/components/ui/pharaonic-page-template';
import { useContent } from '@/hooks/useContent';

export default function CancellationPolicyPage() {
  const { getContent, loading, error } = useContent({ page: 'cancellation-policy' });

  if (loading) {
    return (
      <PharaonicPageTemplate
        name="Cancellation Policy"
        shortDescription="𓇳 Loading royal policies... 𓇳"
        description=""
        mainImageUrl="/images/policy-hero.jpg"
        type="INFORMATION"
        category="GENERAL"
        rating={5.0}
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
        name="Cancellation Policy"
        shortDescription="𓊪 Royal policies temporarily unavailable 𓊪"
        description="𓈖 The gods are blessing these terms. Please try again later 𓈖"
        mainImageUrl="/images/policy-hero.jpg"
        type="INFORMATION"
        category="GENERAL"
        rating={5.0}
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
      name={getContent('cancellation_policy_title', '𓇳 Royal Cancellation Policy 𓇳')}
      shortDescription={getContent('cancellation_policy_subtitle', '𓊪 Fair and transparent terms for your journey 𓊪')}
      description={getContent('cancellation_policy_description', '𓈖 We understand that sometimes the gods may change your travel plans. Our cancellation policy is designed to be fair and transparent while protecting both our guests and our vessels. We offer flexible cancellation terms that vary based on the timing of your cancellation and the specific circumstances. Our goal is to provide you with peace of mind while ensuring the sustainability of our royal fleet and the livelihoods of our dedicated crew 𓊪')}
      mainImageUrl={getContent('cancellation_policy_hero_image', '/images/policy-hero.jpg')}
      type="INFORMATION"
      category="GENERAL"
      rating={5.0}
      features={getContent('cancellation_policy_features', '𓇳 Flexible Cancellation Terms,𓊪 Transparent Refund Process,𓈖 Travel Insurance Options,𓂀 Emergency Cancellation,𓏏 Rebooking Opportunities,𓇯 Force Majeure Protection,𓊃 Clear Timeline Guidelines,𓌻 Customer Support').split(',')}
      advantages={getContent('cancellation_policy_advantages', '𓂀 Our cancellation policy balances flexibility with fairness, offering reasonable refund terms while protecting the interests of all parties involved in your royal journey 𓏏')}
      meaning={getContent('cancellation_policy_meaning', '𓇯 Like the ancient contracts blessed by the gods, our cancellation policy is built on principles of fairness, transparency, and mutual respect 𓊃')}
      pageType="package"
      primaryColor="ocean-blue"
      secondaryColor="ocean-blue"
    />
  );
}
