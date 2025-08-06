import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'Dahabiyat Nile Cruise - Luxury Egyptian River Cruises',
  description: 'Experience the magic of ancient Egypt aboard our luxury dahabiyat. Traditional sailing vessels offering intimate Nile River cruises with modern comfort.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4AF37" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-ocean-blue-lightest/30 to-slate-50">
          {children}
        </div>
      </body>
    </html>
  );
}
