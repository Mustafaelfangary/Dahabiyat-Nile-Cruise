import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

// Performance metric interfaces
interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta?: number;
}

interface PerformanceMetrics {
  avg: number;
  min: number;
  max: number;
  count: number;
}

// Window extension for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Cache configuration
export const cacheConfig = {
  // Static assets (images, fonts, etc.)
  static: {
    maxAge: 31536000, // 1 year
    staleWhileRevalidate: 86400, // 1 day
  },
  
  // API responses
  api: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 600, // 10 minutes
  },
  
  // Dynamic pages
  pages: {
    maxAge: 60, // 1 minute
    staleWhileRevalidate: 300, // 5 minutes
  },
  
  // Database queries
  database: {
    maxAge: 900, // 15 minutes
    staleWhileRevalidate: 1800, // 30 minutes
  }
};

// Cache headers utility
export function setCacheHeaders(response: NextResponse, type: keyof typeof cacheConfig) {
  const config = cacheConfig[type];
  
  response.headers.set(
    'Cache-Control',
    `public, max-age=${config.maxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`
  );
  
  return response;
}

// Image optimization utility
export function getOptimizedImageUrl(
  src: string,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  if (!src) return '';
  
  // If it's already an external URL, return as is
  if (src.startsWith('http')) return src;
  
  // Build Next.js Image Optimization URL
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  
  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
}

// Responsive image sizes for different breakpoints
export const imageSizes = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 800 },
  hero: { width: 1920, height: 1080 },
  
  // Responsive sizes string for Next.js Image component
  responsive: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  heroResponsive: '100vw',
  galleryResponsive: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
};

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): () => number {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
      return duration;
    };
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    const values = this.metrics.get(label)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetrics(label: string): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(label);
    if (!values || values.length === 0) return null;

    return {
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  }

  getAllMetrics(): Record<string, PerformanceMetrics> {
    const result: Record<string, PerformanceMetrics> = {};
    
    for (const [label] of this.metrics) {
      const metrics = this.getMetrics(label);
      if (metrics) {
        result[label] = metrics;
      }
    }
    
    return result;
  }
}

// Database query optimization
export function optimizeQuery<T>(
  queryFn: () => Promise<T>,
  cacheKey: string,
  ttl: number = cacheConfig.database.maxAge
): Promise<T> {
  // In a real implementation, you'd use Redis or another cache
  // For now, we'll use a simple in-memory cache
  return queryFn();
}

// Lazy loading utility for components
export function createLazyComponent<T extends React.ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFn);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return React.createElement(
      React.Suspense,
      {
        fallback: fallback
          ? React.createElement(fallback)
          : React.createElement('div', null, 'Loading...')
      },
      React.createElement(LazyComponent, props)
    );
  };
}

// Bundle analysis utilities
export const bundleOptimization = {
  // Critical CSS extraction
  extractCriticalCSS: (html: string): string => {
    // This would extract critical CSS for above-the-fold content
    // Implementation would depend on your CSS framework
    return '';
  },
  
  // Resource hints
  generateResourceHints: (resources: string[]): string => {
    return resources
      .map(resource => {
        if (resource.endsWith('.css')) {
          return `<link rel="preload" href="${resource}" as="style">`;
        } else if (resource.endsWith('.js')) {
          return `<link rel="preload" href="${resource}" as="script">`;
        } else if (resource.match(/\.(jpg|jpeg|png|webp)$/)) {
          return `<link rel="preload" href="${resource}" as="image">`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }
};

// Web Vitals tracking
export function trackWebVitals(metric: WebVitalMetric) {
  // Send to analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      custom_map: { metric_id: 'custom_metric' },
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

// Compression utilities
export function shouldCompress(request: NextRequest): boolean {
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  return acceptEncoding.includes('gzip') || acceptEncoding.includes('br');
}

export function addCompressionHeaders(response: NextResponse): NextResponse {
  response.headers.set('Vary', 'Accept-Encoding');
  return response;
}

// Service Worker utilities
export const serviceWorkerConfig = {
  // Cache strategies
  strategies: {
    cacheFirst: 'CacheFirst',
    networkFirst: 'NetworkFirst',
    staleWhileRevalidate: 'StaleWhileRevalidate',
    networkOnly: 'NetworkOnly',
    cacheOnly: 'CacheOnly'
  },
  
  // Cache names
  caches: {
    static: 'static-cache-v1',
    dynamic: 'dynamic-cache-v1',
    images: 'images-cache-v1',
    api: 'api-cache-v1'
  },
  
  // Generate service worker configuration
  generateConfig: () => ({
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      {
        urlPattern: /\/api\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 5, // 5 minutes
          },
        },
      },
    ],
  })
};

// Performance budget checker
export const performanceBudget = {
  // Size limits (in KB)
  limits: {
    totalJS: 500,
    totalCSS: 100,
    totalImages: 2000,
    totalFonts: 100,
    firstContentfulPaint: 1500, // ms
    largestContentfulPaint: 2500, // ms
    cumulativeLayoutShift: 0.1,
    firstInputDelay: 100 // ms
  },
  
  // Check if metrics are within budget
  checkBudget: (metrics: Record<string, number>): { passed: boolean; violations: string[] } => {
    const violations: string[] = [];
    
    Object.entries(performanceBudget.limits).forEach(([key, limit]) => {
      if (metrics[key] && metrics[key] > limit) {
        violations.push(`${key}: ${metrics[key]} exceeds limit of ${limit}`);
      }
    });
    
    return {
      passed: violations.length === 0,
      violations
    };
  }
};
