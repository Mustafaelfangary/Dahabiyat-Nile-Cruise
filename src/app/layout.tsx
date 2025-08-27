import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import '../styles/mobile-enhancements.css';
import { Providers } from './providers';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import { generateSEO, generateOrganizationSchema } from '@/lib/seo';
import { trackWebVitals } from '@/lib/performance';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = generateSEO();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Enable safe area support
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0080ff' },
    { media: '(prefers-color-scheme: dark)', color: '#003d7a' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* PWA meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dahabiyat" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema())
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${inter.className} antialiased`}>
        <Providers>
          <MobileOptimizedLayout>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </MobileOptimizedLayout>
        </Providers>

        {/* Analytics and performance monitoring */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>

            {/* Web Vitals tracking */}
            <Script id="web-vitals" strategy="afterInteractive">
              {`
                (function() {
                  try {
                    // Simple performance tracking without web-vitals dependency
                    const trackWebVitals = ${trackWebVitals.toString()};

                    // Track basic performance metrics
                    if ('performance' in window) {
                      window.addEventListener('load', function() {
                        setTimeout(function() {
                          const navigation = performance.getEntriesByType('navigation')[0];
                          if (navigation) {
                            trackWebVitals({
                              name: 'page_load',
                              value: navigation.loadEventEnd - navigation.navigationStart,
                              id: 'page-load-' + Date.now()
                            });
                          }
                        }, 0);
                      });
                    }

                    // Track CLS (Cumulative Layout Shift) manually
                    let clsValue = 0;
                    let clsEntries = [];
                    let sessionValue = 0;
                    let sessionEntries = [];

                    if ('PerformanceObserver' in window) {
                      try {
                        const observer = new PerformanceObserver(function(list) {
                          for (const entry of list.getEntries()) {
                            if (!entry.hadRecentInput) {
                              const firstSessionEntry = sessionEntries[0];
                              const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                              if (sessionValue && entry.startTime - lastSessionEntry.startTime < 1000 && entry.startTime - firstSessionEntry.startTime < 5000) {
                                sessionValue += entry.value;
                                sessionEntries.push(entry);
                              } else {
                                sessionValue = entry.value;
                                sessionEntries = [entry];
                              }

                              if (sessionValue > clsValue) {
                                clsValue = sessionValue;
                                clsEntries = [...sessionEntries];
                                trackWebVitals({
                                  name: 'CLS',
                                  value: clsValue,
                                  id: 'cls-' + Date.now()
                                });
                              }
                            }
                          }
                        });
                        observer.observe({ type: 'layout-shift', buffered: true });
                      } catch (e) {
                        // PerformanceObserver not supported
                      }
                    }
                  } catch (error) {
                    console.warn('Performance tracking not available:', error);
                  }
                })();
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
