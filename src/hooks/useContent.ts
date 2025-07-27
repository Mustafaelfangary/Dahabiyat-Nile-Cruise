"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';

interface ContentBlock {
  id: string;
  key: string;
  title: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  contentType: 'TEXT' | 'TEXTAREA' | 'RICH_TEXT' | 'IMAGE' | 'VIDEO' | 'GALLERY' | 'TESTIMONIAL' | 'FEATURE' | 'CTA';
  page: string;
  section: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseContentOptions {
  page?: string;
  section?: string;
}

interface UseContentReturn {
  content: ContentBlock[];
  loading: boolean;
  error: string | null;
  getContent: (key: string, fallback?: string) => string;
  getContentBlock: (key: string) => ContentBlock | undefined;
  refetch: () => void;
}

export function useContent(options: UseContentOptions = {}): UseContentReturn {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the page and section to prevent unnecessary re-renders
  const page = useMemo(() => options.page, [options.page]);
  const section = useMemo(() => options.section, [options.section]);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // For dahabiya pages, use the public content API
      if (page && ['royal-cleopatra', 'queen-cleopatra', 'princess-cleopatra', 'azhar-dahabiya'].includes(page)) {
        const response = await fetch(`/api/public-content/${page}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }

        const data = await response.json();

        // The API returns { section, fields: [...] }
        const fields = data.fields || [];

        if (!Array.isArray(fields)) {
          console.error('Expected fields to be an array, got:', typeof fields, fields);
          console.error('Full response data:', data);
          setContent([]);
          return;
        }

        // Convert website content fields to ContentBlock format for compatibility
        const blocks = fields.map((field: any, index: number) => ({
          id: field.id,
          key: field.key,
          title: field.label,
          content: field.value || field.placeholder || '',
          mediaUrl: field.type === 'image' || field.type === 'video' ? (field.value || field.placeholder) : undefined,
          mediaType: field.type === 'image' ? 'IMAGE' : field.type === 'video' ? 'VIDEO' : undefined,
          contentType: field.type === 'image' ? 'IMAGE' : field.type === 'video' ? 'VIDEO' : field.type === 'textarea' ? 'TEXTAREA' : 'TEXT',
          page: page,
          section: 'main',
          order: index,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        setContent(blocks);
      } else {
        // Use website-content API for all other pages including homepage
        const sectionName = page || 'homepage';
        const response = await fetch(`/api/website-content?page=${sectionName}&t=${Date.now()}&v=${Math.random()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch content for ${sectionName}:`, response.status, response.statusText);
          // For non-critical content, set empty array instead of throwing
          setContent([]);
          return;
        }

        const data = await response.json();

        // The API returns the content directly as an array
        const contentArray = Array.isArray(data) ? data : [];

        if (!Array.isArray(contentArray)) {
          console.error('Expected content to be an array, got:', typeof contentArray, contentArray);
          setContent([]);
          return;
        }

        // Convert website content to ContentBlock format for compatibility
        const blocks = contentArray.map((item: any, index: number) => ({
          id: item.id,
          key: item.key,
          title: item.title,
          content: item.content || item.mediaUrl || '',
          mediaUrl: item.contentType === 'IMAGE' || item.contentType === 'VIDEO' ? (item.content || item.mediaUrl) : undefined,
          mediaType: item.contentType === 'IMAGE' ? 'IMAGE' : item.contentType === 'VIDEO' ? 'VIDEO' : undefined,
          contentType: item.contentType || 'TEXT',
          page: item.page || sectionName,
          section: item.section || 'main',
          order: item.order || index,
          isActive: item.isActive !== false,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        }));

        setContent(blocks);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  }, [page, section]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Listen for content updates from admin panel
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'content-updated') {
        fetchContent();
      }
    };

    const handleFocus = () => {
      // Refetch content when window regains focus (useful for admin panel updates)
      fetchContent();
    };

    const handleContentUpdate = () => {
      // Immediate content refresh when admin panel updates content
      fetchContent();
    };

    // Listen for broadcast messages from admin panel
    const bc = new BroadcastChannel('content-updates');
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data.type === 'homepage-updated') {
        console.log('Received homepage update broadcast, refreshing content...');
        fetchContent();
      }
    };
    bc.addEventListener('message', handleBroadcast);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('content-updated', handleContentUpdate);

    return () => {
      bc.removeEventListener('message', handleBroadcast);
      bc.close();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('content-updated', handleContentUpdate);
    };
  }, [fetchContent]);

  const getContent = useCallback((key: string, fallback = ''): string => {
    const block = content.find(c => c.key === key);



    if (!block) return fallback;
    return block.content || block.mediaUrl || fallback;
  }, [content]);

  const getContentBlock = useCallback((key: string): ContentBlock | undefined => {
    return content.find(c => c.key === key);
  }, [content]);

  const refetch = useCallback(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    getContent,
    getContentBlock,
    refetch,
  };
}

// Backward compatibility hook for settings
export function useSettings() {
  const { content, loading, error, getContent, refetch } = useContent();
  
  // Convert content blocks to settings object for backward compatibility
  const settings = content.reduce((acc, block) => {
    acc[block.key] = block.content || block.mediaUrl || '';
    return acc;
  }, {} as Record<string, string>);

  return {
    settings,
    loading,
    error,
    get: getContent,
    refetch,
  };
}
