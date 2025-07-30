// Helper functions for managing website content

export interface ContentItem {
  key: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  contentType: string;
  title: string;
  section: string;
  page: string;
  order: number;
}

export interface ContentMap {
  [key: string]: {
    content: string | null;
    mediaUrl: string | null;
    mediaType: string | null;
    contentType: string;
    title: string;
  };
}

/**
 * Convert content array to a key-value map for easier access
 */
export function contentArrayToMap(content: ContentItem[]): ContentMap {
  const contentMap: ContentMap = {};
  
  content.forEach(item => {
    contentMap[item.key] = {
      content: item.content,
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
      contentType: item.contentType,
      title: item.title
    };
  });
  
  return contentMap;
}

/**
 * Get content value by key with fallback
 */
export function getContentValue(
  contentMap: ContentMap, 
  key: string, 
  fallback: string = ''
): string {
  const item = contentMap[key];
  if (!item) return fallback;
  
  // Return media URL for media types, content for text types
  if (item.contentType === 'IMAGE' || item.contentType === 'VIDEO') {
    return item.mediaUrl || fallback;
  }
  
  return item.content || fallback;
}

/**
 * Get media URL by key
 */
export function getMediaUrl(
  contentMap: ContentMap, 
  key: string, 
  fallback: string = ''
): string {
  const item = contentMap[key];
  return item?.mediaUrl || fallback;
}

/**
 * Get text content by key
 */
export function getTextContent(
  contentMap: ContentMap, 
  key: string, 
  fallback: string = ''
): string {
  const item = contentMap[key];
  return item?.content || fallback;
}

/**
 * Check if content exists
 */
export function hasContent(contentMap: ContentMap, key: string): boolean {
  const item = contentMap[key];
  if (!item) return false;
  
  if (item.contentType === 'IMAGE' || item.contentType === 'VIDEO') {
    return !!item.mediaUrl;
  }
  
  return !!item.content;
}

/**
 * Group content by section
 */
export function groupContentBySection(content: ContentItem[]): Record<string, ContentItem[]> {
  const grouped: Record<string, ContentItem[]> = {};
  
  content.forEach(item => {
    if (!grouped[item.section]) {
      grouped[item.section] = [];
    }
    grouped[item.section].push(item);
  });
  
  // Sort each section by order
  Object.keys(grouped).forEach(section => {
    grouped[section].sort((a, b) => a.order - b.order);
  });
  
  return grouped;
}

/**
 * Default content values for fallback
 */
export const DEFAULT_CONTENT = {
  // Hero Section
  hero_video_title: 'Sail the Eternal Nile in Pharaonic Splendor',
  hero_video_subtitle: 'Journey through 5000 years of history aboard our luxury dahabiyas, where every moment is touched by the magic of ancient Egypt.',
  hero_video_cta_text: 'Begin Your Royal Journey',
  hero_video_cta_link: '/dahabiyas',
  hero_scroll_text: 'Scroll to explore',
  
  // Dahabiyat Section
  dahabiyat_section_title: 'Our Luxury Dahabiyat Nile Cruise Fleet',
  dahabiyat_section_subtitle: 'Discover our collection of traditional sailing vessels, each offering a unique journey through Egypt\'s timeless landscapes',
  dahabiyat_view_all_text: 'View All Dahabiyat',
  
  // What is Dahabiya Section
  what_is_dahabiya_title: 'What is Dahabiya?',
  what_is_dahabiya_content: 'A Dahabiya is a traditional Egyptian sailing boat that has been navigating the Nile River for centuries. These elegant vessels, with their distinctive lateen sails and shallow draft, were once the preferred mode of transport for Egyptian nobility and wealthy travelers exploring the ancient wonders along the Nile.',
  
  // Packages Section
  packages_section_title: 'Our Journey Packages',
  packages_section_subtitle: 'Choose from our carefully crafted packages, each designed to showcase the best of Egypt\'s ancient wonders and natural beauty',
  packages_view_all_text: 'View All Packages',
  
  // Why Different Section
  why_different_title: 'Why is Dahabiya different from regular Nile Cruises?',
  why_different_content: 'While traditional Nile cruise ships can accommodate 200-400 passengers, Dahabiyas offer an intimate experience with only 8-12 guests. This fundamental difference creates a completely different travel experience that feels more like a private yacht charter than a commercial cruise.',
  
  // Share Memories Section
  share_memories_title: 'Share your memories with us',
  share_memories_content: 'Your journey with us doesn\'t end when you disembark. We believe that the memories created during your Dahabiya experience are meant to be shared and cherished forever. Join our community of travelers who have fallen in love with the magic of the Nile.',
  
  // Our Story Section
  our_story_title: 'Our Story',
  our_story_content: 'Our journey began over 30 years ago when Captain Ahmed Hassan, a third-generation Nile navigator, had a vision to revive the authentic way of exploring Egypt\'s ancient wonders. Growing up along the banks of the Nile, he witnessed the transformation of river travel and felt called to preserve the traditional Dahabiya experience.',
  founder_name: 'Ashraf Elmasry',
  founder_title: 'Founder & CEO',
  founder_image: '/images/ashraf-elmasry.jpg',
  
  // Safety Section
  safety_title: 'Your Safety is Our Priority',
  safety_subtitle: 'All our Dahabiyas are certified and regularly inspected to ensure the highest safety standards',
  
  // Call to Action Section
  cta_title: 'Ready to Begin Your Journey?',
  cta_description: 'Contact us today to start planning your unforgettable Dahabiya adventure on the Nile',
  cta_book_text: 'Book Your Journey',
  cta_contact_text: 'Contact Us',
  
  // Common Labels
  guests_label: 'Guests',
  days_label: 'Days',
  view_details_text: 'View Details',
  read_more_text: 'Read More',
  read_less_text: 'Read Less',
  loading_text: 'Loading...'
};

/**
 * Get content with fallback to default values
 */
export function getContentWithFallback(
  contentMap: ContentMap, 
  key: string
): string {
  const fallback = DEFAULT_CONTENT[key as keyof typeof DEFAULT_CONTENT] || '';
  return getContentValue(contentMap, key, fallback);
}
