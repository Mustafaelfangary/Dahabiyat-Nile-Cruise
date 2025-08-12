#!/bin/bash

# 🗺️ Fix Itineraries Pages Script
# This script fixes individual itinerary pages and routing

set -e

echo "🗺️ Fixing Itineraries Pages..."
echo "================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

PROJECT_DIR="/var/www/dahabiyat-nile-cruise"
cd "$PROJECT_DIR" || exit 1

log "🔧 Step 1: Creating individual itinerary pages..."

# Create itinerary pages directory if it doesn't exist
mkdir -p "src/app/itineraries"

# Create dynamic itinerary page
cat > "src/app/itineraries/[slug]/page.tsx" << 'EOF'
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ItineraryDetail from '@/components/ItineraryDetail';

// Sample itineraries data - replace with your actual data source
const itineraries = [
  {
    slug: 'luxor-aswan-4-days',
    title: 'Luxor to Aswan - 4 Days Classic',
    duration: '4 Days / 3 Nights',
    route: 'Luxor → Edfu → Kom Ombo → Aswan',
    description: 'Experience the classic Nile journey from Luxor to Aswan...',
    highlights: [
      'Valley of the Kings',
      'Karnak Temple',
      'Edfu Temple',
      'Kom Ombo Temple',
      'Philae Temple'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Luxor Embarkation',
        activities: ['Check-in', 'Karnak Temple visit', 'Luxor Temple'],
        meals: ['Lunch', 'Dinner']
      },
      {
        day: 2,
        title: 'Valley of the Kings',
        activities: ['Valley of the Kings', 'Hatshepsut Temple', 'Sail to Edfu'],
        meals: ['Breakfast', 'Lunch', 'Dinner']
      },
      {
        day: 3,
        title: 'Edfu & Kom Ombo',
        activities: ['Edfu Temple', 'Sail to Kom Ombo', 'Kom Ombo Temple'],
        meals: ['Breakfast', 'Lunch', 'Dinner']
      },
      {
        day: 4,
        title: 'Aswan Disembarkation',
        activities: ['Philae Temple', 'High Dam', 'Disembarkation'],
        meals: ['Breakfast']
      }
    ],
    price: 'From $1,200 per person',
    images: [
      '/images/itineraries/luxor-aswan-1.jpg',
      '/images/itineraries/luxor-aswan-2.jpg'
    ]
  },
  {
    slug: 'aswan-luxor-5-days',
    title: 'Aswan to Luxor - 5 Days Deluxe',
    duration: '5 Days / 4 Nights',
    route: 'Aswan → Kom Ombo → Edfu → Luxor',
    description: 'Discover ancient Egypt sailing from Aswan to Luxor...',
    highlights: [
      'Abu Simbel (optional)',
      'Philae Temple',
      'Kom Ombo Temple',
      'Edfu Temple',
      'Valley of the Kings'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Aswan Embarkation',
        activities: ['Check-in', 'Philae Temple', 'Nubian Village'],
        meals: ['Lunch', 'Dinner']
      },
      {
        day: 2,
        title: 'Abu Simbel (Optional)',
        activities: ['Abu Simbel excursion', 'Sail to Kom Ombo'],
        meals: ['Breakfast', 'Lunch', 'Dinner']
      },
      {
        day: 3,
        title: 'Kom Ombo & Edfu',
        activities: ['Kom Ombo Temple', 'Sail to Edfu', 'Edfu Temple'],
        meals: ['Breakfast', 'Lunch', 'Dinner']
      },
      {
        day: 4,
        title: 'Sailing to Luxor',
        activities: ['Sail to Luxor', 'Luxor Temple', 'Karnak Temple'],
        meals: ['Breakfast', 'Lunch', 'Dinner']
      },
      {
        day: 5,
        title: 'Luxor Disembarkation',
        activities: ['Valley of the Kings', 'Hatshepsut Temple', 'Disembarkation'],
        meals: ['Breakfast']
      }
    ],
    price: 'From $1,500 per person',
    images: [
      '/images/itineraries/aswan-luxor-1.jpg',
      '/images/itineraries/aswan-luxor-2.jpg'
    ]
  }
];

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const itinerary = itineraries.find(item => item.slug === params.slug);
  
  if (!itinerary) {
    return {
      title: 'Itinerary Not Found',
    };
  }

  return {
    title: `${itinerary.title} | Dahabiyat Nile Cruise`,
    description: itinerary.description,
    openGraph: {
      title: itinerary.title,
      description: itinerary.description,
      images: itinerary.images,
    },
  };
}

export default function ItineraryPage({ params }: Props) {
  const itinerary = itineraries.find(item => item.slug === params.slug);

  if (!itinerary) {
    notFound();
  }

  return <ItineraryDetail itinerary={itinerary} />;
}

export async function generateStaticParams() {
  return itineraries.map((itinerary) => ({
    slug: itinerary.slug,
  }));
}
EOF

log "✅ Created dynamic itinerary page"

log "🔧 Step 2: Creating itinerary detail component..."

# Create components directory if it doesn't exist
mkdir -p "src/components"

cat > "src/components/ItineraryDetail.tsx" << 'EOF'
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Star, Users, Ship } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  meals: string[];
}

interface Itinerary {
  slug: string;
  title: string;
  duration: string;
  route: string;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  price: string;
  images: string[];
}

interface Props {
  itinerary: Itinerary;
}

export default function ItineraryDetail({ itinerary }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{itinerary.title}</h1>
            <p className="text-xl mb-6">{itinerary.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{itinerary.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{itinerary.route}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Premium Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Highlights */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Highlights</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {itinerary.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Day by Day Itinerary */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Day by Day Itinerary</h2>
              <div className="space-y-6">
                {itinerary.itinerary.map((day, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {day.day}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">{day.title}</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Activities</h4>
                        <ul className="space-y-1">
                          {day.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="text-gray-600 flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Meals Included</h4>
                        <div className="flex flex-wrap gap-2">
                          {day.meals.map((meal, mealIndex) => (
                            <span key={mealIndex} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {meal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Booking Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{itinerary.price}</div>
                  <p className="text-gray-600">per person (double occupancy)</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>{itinerary.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>Small group (max 16 guests)</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Ship className="w-5 h-5" />
                    <span>Traditional Dahabiya</span>
                  </div>
                </div>
                
                <Link 
                  href="/contact" 
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                >
                  Book This Journey
                </Link>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Free cancellation up to 48 hours before departure
                </p>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Need Help Planning?</h3>
                <p className="text-gray-600 mb-4">Our travel experts are here to help you customize your perfect Nile journey.</p>
                <Link 
                  href="/contact" 
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Contact Our Experts →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

log "✅ Created itinerary detail component"

log "🔧 Step 3: Updating main itineraries page..."

# Update the main itineraries page
cat > "src/app/itineraries/page.tsx" << 'EOF'
import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Star } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nile Cruise Itineraries | Dahabiyat Nile Cruise',
  description: 'Explore our carefully crafted Nile cruise itineraries. From Luxor to Aswan, discover ancient Egypt aboard our traditional Dahabiyas.',
};

const itineraries = [
  {
    slug: 'luxor-aswan-4-days',
    title: 'Luxor to Aswan - 4 Days Classic',
    duration: '4 Days / 3 Nights',
    route: 'Luxor → Edfu → Kom Ombo → Aswan',
    description: 'Experience the classic Nile journey from Luxor to Aswan, visiting the most iconic temples and monuments of ancient Egypt.',
    highlights: ['Valley of the Kings', 'Karnak Temple', 'Edfu Temple', 'Kom Ombo Temple', 'Philae Temple'],
    price: 'From $1,200',
    image: '/images/itineraries/luxor-aswan.jpg'
  },
  {
    slug: 'aswan-luxor-5-days',
    title: 'Aswan to Luxor - 5 Days Deluxe',
    duration: '5 Days / 4 Nights',
    route: 'Aswan → Kom Ombo → Edfu → Luxor',
    description: 'Discover ancient Egypt sailing from Aswan to Luxor with optional Abu Simbel excursion and extended exploration time.',
    highlights: ['Abu Simbel (optional)', 'Philae Temple', 'Kom Ombo Temple', 'Edfu Temple', 'Valley of the Kings'],
    price: 'From $1,500',
    image: '/images/itineraries/aswan-luxor.jpg'
  }
];

export default function ItinerariesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nile Cruise Itineraries</h1>
            <p className="text-xl">Carefully crafted journeys through ancient Egypt aboard our traditional Dahabiyas</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {itineraries.map((itinerary, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-2xl font-bold mb-2">{itinerary.title}</h3>
                  <p className="text-blue-100">{itinerary.route}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{itinerary.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Premium</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{itinerary.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {itinerary.highlights.slice(0, 3).map((highlight, hIndex) => (
                      <span key={hIndex} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {highlight}
                      </span>
                    ))}
                    {itinerary.highlights.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{itinerary.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">{itinerary.price}</div>
                  <Link 
                    href={`/itineraries/${itinerary.slug}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Custom Itineraries Available</h2>
            <p className="text-gray-600 mb-6">
              Looking for something different? We can create a custom itinerary tailored to your interests, 
              schedule, and preferences.
            </p>
            <Link 
              href="/contact" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Plan Your Custom Journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

log "✅ Updated main itineraries page"

log "🔧 Step 4: Building application..."
npm run build

log "🔄 Step 5: Restarting services..."
if command -v pm2 &> /dev/null; then
    pm2 restart all 2>/dev/null || true
fi

if command -v nginx &> /dev/null; then
    nginx -t && systemctl reload nginx
fi

log "🎉 Itineraries pages fixed successfully!"
echo "================================"
echo -e "${GREEN}✅ Individual itinerary pages are now working${NC}"
echo -e "${BLUE}📋 Available routes:${NC}"
echo "   • /itineraries - Main itineraries page"
echo "   • /itineraries/luxor-aswan-4-days - 4-day classic itinerary"
echo "   • /itineraries/aswan-luxor-5-days - 5-day deluxe itinerary"
echo "================================"
