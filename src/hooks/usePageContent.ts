import { useState, useEffect } from 'react';

interface PageContent {
  id: string;
  key: string;
  title: string;
  content: string;
  contentType: string;
  page: string;
  section: string;
  order: number;
  isActive: boolean;
  metadata?: any;
}

interface UsePageContentResult {
  contents: PageContent[];
  grouped: Record<string, PageContent[]>;
  loading: boolean;
  error: string | null;
  getContent: (key: string) => PageContent | undefined;
  getContentValue: (key: string, fallback?: string) => string;
}

export function usePageContent(page: string, section?: string): UsePageContentResult {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [grouped, setGrouped] = useState<Record<string, PageContent[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ page });
        if (section) params.append('section', section);

        const response = await fetch(`/api/page-content?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch page content');
        }

        const data = await response.json();
        setContents(data.contents || []);
        setGrouped(data.grouped || {});
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
        setContents([]);
        setGrouped({});
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [page, section]);

  const getContent = (key: string): PageContent | undefined => {
    return contents.find(content => content.key === key);
  };

  const getContentValue = (key: string, fallback: string = ''): string => {
    const content = getContent(key);
    return content?.content || fallback;
  };

  return {
    contents,
    grouped,
    loading,
    error,
    getContent,
    getContentValue,
  };
}

// Hook for getting a single piece of content by key
export function useContentByKey(key: string) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/page-content?key=${key}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setContent(null);
            setError(null);
          } else {
            throw new Error('Failed to fetch content');
          }
        } else {
          const data = await response.json();
          setContent(data);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      fetchContent();
    }
  }, [key]);

  return {
    content,
    loading,
    error,
    value: content?.content || '',
  };
}
