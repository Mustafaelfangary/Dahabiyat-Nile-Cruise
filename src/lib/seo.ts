import { Metadata } from 'next';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

// Function to get dynamic site name from database
async function getDynamicSiteName(): Promise<string> {
  try {
    const response = await fetch('/api/website-content?page=homepage&key=site_name');
    if (response.ok) {
      const data = await response.json();
      return data.content || 'Dahabiyat Nile Cruise';
    }
  } catch (error) {
    console.warn('Failed to fetch dynamic site name:', error);
  }
  return 'Dahabiyat Nile Cruise';
}

const defaultSEO = {
  siteName: 'Dahabiyat Nile Cruise', // This will be overridden by dynamic content when available
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com',
  defaultTitle: 'Dahabiyat Nile Cruise - Luxury Nile River Cruises in Egypt',
  defaultDescription: 'Experience the magic of ancient Egypt aboard our luxury dahabiyas. Sail the eternal Nile in pharaonic style with personalized service, gourmet cuisine, and unforgettable adventures.',
  defaultImage: '/images/hero/dahabiyat-nile-cruise-hero.jpg',
  defaultKeywords: [
    'Egypt Nile cruise',
    'luxury dahabiya',
    'Nile river cruise',
    'Egypt travel',
    'luxury Egypt tour',
    'pharaonic cruise',
    'Aswan Luxor cruise',
    'Egyptian adventure',
    'Nile sailing',
    'Egypt vacation packages'
  ],
  twitterHandle: '@CleopatraDahabiyat',
  facebookPage: 'CleopatraDahabiyat',
  instagramHandle: '@cleopatra_dahabiyat'
};

export function generateSEO(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = defaultSEO.defaultDescription,
    keywords = defaultSEO.defaultKeywords,
    image = defaultSEO.defaultImage,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = []
  } = config;

  const fullTitle = title 
    ? `${title} | ${defaultSEO.siteName}`
    : defaultSEO.defaultTitle;

  const fullUrl = url 
    ? `${defaultSEO.siteUrl}${url}`
    : defaultSEO.siteUrl;

  const fullImage = image.startsWith('http') 
    ? image 
    : `${defaultSEO.siteUrl}${image}`;

  const allKeywords = [...new Set([...keywords, ...tags])];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: defaultSEO.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || defaultSEO.defaultTitle,
        }
      ],
      locale: 'en_US',
      type: type as any,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags })
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: defaultSEO.twitterHandle,
      site: defaultSEO.twitterHandle,
    },

    // Additional meta tags
    other: {
      'fb:app_id': process.env.FACEBOOK_APP_ID || '',
      'article:author': author || defaultSEO.siteName,
      'article:publisher': defaultSEO.facebookPage,
      'og:image:alt': title || defaultSEO.defaultTitle,
      'twitter:image:alt': title || defaultSEO.defaultTitle,
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
      other: {
        'msvalidate.01': process.env.BING_VERIFICATION || '',
      },
    },

    // Canonical URL
    alternates: {
      canonical: fullUrl,
    },
  };
}

// Predefined SEO configurations for common pages
export const pageSEO = {
  home: (): Metadata => generateSEO({
    title: 'Luxury Nile River Cruises',
    description: 'Discover the magic of ancient Egypt aboard our luxury dahabiyas. Experience pharaonic elegance while sailing the eternal Nile with personalized service and unforgettable adventures.',
    keywords: ['Egypt Nile cruise', 'luxury dahabiya', 'Nile river cruise', 'Egypt travel', 'pharaonic cruise'],
    url: '/',
    type: 'website'
  }),

  about: (): Metadata => generateSEO({
    title: 'About Cleopatra Dahabiyat',
    description: 'Learn about our heritage of luxury Nile cruising. Discover why Cleopatra Dahabiyat is Egypt\'s premier choice for authentic pharaonic river experiences.',
    keywords: ['about Cleopatra Dahabiyat', 'Egypt cruise company', 'Nile cruise heritage', 'luxury travel Egypt'],
    url: '/about',
    type: 'website'
  }),

  dahabiyat: (): Metadata => generateSEO({
    title: 'Our Luxury Dahabiyas',
    description: 'Explore our fleet of luxury dahabiyas, each offering unique pharaonic elegance and modern comfort for your Nile river adventure.',
    keywords: ['luxury dahabiya fleet', 'Nile cruise boats', 'Egypt river cruise', 'pharaonic boats'],
    url: '/dahabiyat',
    type: 'website'
  }),

  packages: (): Metadata => generateSEO({
    title: 'Egypt Travel Packages',
    description: 'Discover our curated Egypt travel packages combining luxury Nile cruises with iconic destinations like Luxor, Aswan, and ancient temples.',
    keywords: ['Egypt travel packages', 'Nile cruise packages', 'Egypt tour packages', 'luxury Egypt travel'],
    url: '/packages',
    type: 'website'
  }),

  contact: (): Metadata => generateSEO({
    title: 'Contact Us',
    description: 'Get in touch with Cleopatra Dahabiyat for your luxury Nile cruise booking. Our expert team is ready to plan your perfect Egyptian adventure.',
    keywords: ['contact Cleopatra Dahabiyat', 'Nile cruise booking', 'Egypt travel contact'],
    url: '/contact',
    type: 'website'
  }),

  dahabiya: (name: string, slug: string): Metadata => generateSEO({
    title: `${name} - Luxury Dahabiya`,
    description: `Experience the luxury of ${name}, our premium dahabiya offering authentic Nile river cruising with pharaonic elegance and modern amenities.`,
    keywords: [`${name} dahabiya`, 'luxury Nile cruise', 'Egypt river cruise', 'pharaonic boat'],
    url: `/dahabiyat/${slug}`,
    type: 'product'
  }),

  package: (name: string, slug: string): Metadata => generateSEO({
    title: `${name} - Egypt Travel Package`,
    description: `Discover ${name}, our carefully crafted Egypt travel package combining luxury Nile cruising with iconic destinations and cultural experiences.`,
    keywords: [`${name} package`, 'Egypt travel package', 'Nile cruise package', 'Egypt tour'],
    url: `/packages/${slug}`,
    type: 'product'
  })
};

// JSON-LD structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: defaultSEO.siteName,
    description: defaultSEO.defaultDescription,
    url: defaultSEO.siteUrl,
    logo: `${defaultSEO.siteUrl}/images/logo.png`,
    image: `${defaultSEO.siteUrl}${defaultSEO.defaultImage}`,
    telephone: '+20-123-456-7890',
    email: 'info@cleopatra-dahabiyat.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nile Corniche',
      addressLocality: 'Aswan',
      addressCountry: 'Egypt'
    },
    sameAs: [
      `https://facebook.com/${defaultSEO.facebookPage}`,
      `https://twitter.com/${defaultSEO.twitterHandle}`,
      `https://instagram.com/${defaultSEO.instagramHandle}`
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Egypt'
    },
    serviceType: ['Nile River Cruises', 'Egypt Travel Packages', 'Luxury Tourism']
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: product.url,
      seller: {
        '@type': 'Organization',
        name: defaultSEO.siteName
      }
    },
    brand: {
      '@type': 'Brand',
      name: defaultSEO.siteName
    }
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${defaultSEO.siteUrl}${item.url}`
    }))
  };
}

export function generateReviewSchema(reviews: Array<{
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}>) {
  return reviews.map(review => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished
  }));
}
