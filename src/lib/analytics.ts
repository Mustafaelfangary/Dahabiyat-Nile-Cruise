"use client";

// Analytics and monitoring utilities
export class Analytics {
  private static instance: Analytics;
  private isInitialized = false;
  private userId: string | null = null;
  private sessionId: string;

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  constructor() {
    this.sessionId = this.generateSessionId();
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Initialize Google Analytics
    if (process.env.NEXT_PUBLIC_GA_ID) {
      this.initGoogleAnalytics();
    }

    // Initialize custom analytics
    this.initCustomAnalytics();
    
    // Track page views
    this.trackPageView();
    
    // Track user engagement
    this.trackUserEngagement();
    
    this.isInitialized = true;
  }

  private initGoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };

    (window as any).gtag('js', new Date());
    (window as any).gtag('config', gaId, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        custom_parameter: 'user_type'
      }
    });
  }

  private initCustomAnalytics() {
    // Track session start
    this.trackEvent('session_start', {
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    // Track performance metrics
    this.trackPerformanceMetrics();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
    
    if ((window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        user_id: userId
      });
    }

    this.trackEvent('user_identified', { user_id: userId });
  }

  trackPageView(path?: string) {
    const page = path || window.location.pathname;
    
    if ((window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: page,
        page_title: document.title
      });
    }

    this.trackEvent('page_view', {
      page_path: page,
      page_title: document.title,
      referrer: document.referrer
    });
  }

  trackEvent(eventName: string, parameters: Record<string, any> = {}) {
    const eventData = {
      event_name: eventName,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      ...parameters
    };

    // Send to Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }

    // Send to custom analytics endpoint
    this.sendToCustomAnalytics(eventData);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventData);
    }
  }

  private async sendToCustomAnalytics(eventData: any) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  private trackUserEngagement() {
    let startTime = Date.now();
    let isActive = true;

    // Track time on page
    const trackTimeOnPage = () => {
      if (isActive) {
        const timeSpent = Date.now() - startTime;
        this.trackEvent('time_on_page', {
          time_spent_ms: timeSpent,
          time_spent_seconds: Math.round(timeSpent / 1000)
        });
      }
    };

    // Track when user becomes inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false;
        trackTimeOnPage();
      } else {
        isActive = true;
        startTime = Date.now();
      }
    };

    // Track before page unload
    const handleBeforeUnload = () => {
      trackTimeOnPage();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone scroll depths
        if (scrollDepth >= 25 && maxScrollDepth < 25) {
          this.trackEvent('scroll_depth', { depth: 25 });
        } else if (scrollDepth >= 50 && maxScrollDepth < 50) {
          this.trackEvent('scroll_depth', { depth: 50 });
        } else if (scrollDepth >= 75 && maxScrollDepth < 75) {
          this.trackEvent('scroll_depth', { depth: 75 });
        } else if (scrollDepth >= 90 && maxScrollDepth < 90) {
          this.trackEvent('scroll_depth', { depth: 90 });
        }
      }
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });
  }

  private trackPerformanceMetrics() {
    // Track Core Web Vitals
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => this.trackWebVital(metric));
        getFID((metric) => this.trackWebVital(metric));
        getFCP((metric) => this.trackWebVital(metric));
        getLCP((metric) => this.trackWebVital(metric));
        getTTFB((metric) => this.trackWebVital(metric));
      });
    }

    // Track custom performance metrics
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          this.trackEvent('performance_metrics', {
            dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp_connection: navigation.connectEnd - navigation.connectStart,
            server_response: navigation.responseEnd - navigation.requestStart,
            dom_processing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
            page_load: navigation.loadEventEnd - navigation.navigationStart
          });
        }, 0);
      });
    }
  }

  private trackWebVital(metric: any) {
    this.trackEvent('web_vital', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_id: metric.id,
      metric_delta: metric.delta
    });
  }

  // Business-specific tracking methods
  trackBookingStart(type: 'dahabiya' | 'package', itemId: string) {
    this.trackEvent('booking_start', {
      booking_type: type,
      item_id: itemId
    });
  }

  trackBookingComplete(bookingId: string, type: 'dahabiya' | 'package', amount: number) {
    this.trackEvent('booking_complete', {
      booking_id: bookingId,
      booking_type: type,
      amount: amount,
      currency: 'USD'
    });

    // Track as conversion in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: bookingId,
        value: amount,
        currency: 'USD',
        items: [{
          item_id: bookingId,
          item_name: `${type} booking`,
          category: type,
          quantity: 1,
          price: amount
        }]
      });
    }
  }

  trackSearch(query: string, results: number) {
    this.trackEvent('search', {
      search_term: query,
      results_count: results
    });
  }

  trackContentView(contentType: string, contentId: string) {
    this.trackEvent('content_view', {
      content_type: contentType,
      content_id: contentId
    });
  }

  trackUserAction(action: string, target: string, value?: any) {
    this.trackEvent('user_action', {
      action: action,
      target: target,
      value: value
    });
  }

  trackError(error: Error, context?: string) {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      context: context
    });
  }

  // A/B Testing support
  trackExperiment(experimentId: string, variant: string) {
    this.trackEvent('experiment_view', {
      experiment_id: experimentId,
      variant: variant
    });

    if ((window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        custom_map: {
          [`experiment_${experimentId}`]: variant
        }
      });
    }
  }

  // Heatmap and session recording integration
  initHeatmaps() {
    // Initialize heatmap tools like Hotjar, FullStory, etc.
    if (process.env.NEXT_PUBLIC_HOTJAR_ID) {
      this.initHotjar();
    }
  }

  private initHotjar() {
    const hjid = process.env.NEXT_PUBLIC_HOTJAR_ID;
    const hjsv = process.env.NEXT_PUBLIC_HOTJAR_VERSION || '6';

    (window as any).hj = (window as any).hj || function(...args: any[]) {
      ((window as any).hj.q = (window as any).hj.q || []).push(args);
    };
    (window as any)._hjSettings = { hjid, hjsv };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://static.hotjar.com/c/hotjar-${hjid}.js?sv=${hjsv}`;
    document.head.appendChild(script);
  }
}

// System monitoring utilities
export class SystemMonitor {
  private static instance: SystemMonitor;
  private metrics: Map<string, any[]> = new Map();

  static getInstance(): SystemMonitor {
    if (!SystemMonitor.instance) {
      SystemMonitor.instance = new SystemMonitor();
    }
    return SystemMonitor.instance;
  }

  recordMetric(name: string, value: number, tags: Record<string, string> = {}) {
    const metric = {
      name,
      value,
      tags,
      timestamp: Date.now()
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metrics = this.metrics.get(name)!;
    metrics.push(metric);

    // Keep only last 1000 metrics per type
    if (metrics.length > 1000) {
      metrics.shift();
    }

    // Send to monitoring endpoint
    this.sendMetric(metric);
  }

  private async sendMetric(metric: any) {
    try {
      await fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.error('Failed to send metric:', error);
    }
  }

  getMetrics(name: string): any[] {
    return this.metrics.get(name) || [];
  }

  getAllMetrics(): Record<string, any[]> {
    const result: Record<string, any[]> = {};
    for (const [name, metrics] of this.metrics) {
      result[name] = metrics;
    }
    return result;
  }
}

// Initialize analytics
export const analytics = typeof window !== 'undefined' ? Analytics.getInstance() : null;
export const systemMonitor = SystemMonitor.getInstance();
