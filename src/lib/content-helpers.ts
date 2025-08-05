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

// Static content removed - all content is now managed dynamically through the database
