"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, MapPin, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useContent } from '@/hooks/useContent';

interface MobileHeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText?: string;
  ctaLink?: string;
  showBookingForm?: boolean;
}

export default function MobileHeroSection({
  title,
  subtitle,
  backgroundImage,
  ctaText = "Book Your Journey",
  ctaLink = "/book",
  showBookingForm = true
}: MobileHeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { getContent } = useContent({ page: 'global_media' });
  
  const heroSlides = [
    {
      image: backgroundImage,
      title: title,
      subtitle: subtitle
    },
    {
      image: getContent('mobile_hero_image_2', "/images/hero-2.jpg"),
      title: "𓇳 Luxury Dahabiya Experience 𓇳",
      subtitle: "Sail the Nile in Traditional Egyptian Style"
    },
    {
      image: getContent('mobile_hero_image_3', "/images/hero-3.jpg"),
      title: "𓇳 Ancient Wonders Await 𓇳",
      subtitle: "Discover Temples, Tombs & Treasures"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: index === currentSlide ? 1 : 0,
            scale: index === currentSlide ? 1 : 1.1
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4">
        <div className="text-center text-text-primary space-y-6">
          {/* Title */}
          <motion.h1
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold leading-tight"
          >
            {heroSlides[currentSlide].title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg sm:text-xl text-text-primary/90 max-w-md mx-auto"
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex justify-center space-x-8 text-sm"
          >
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-ocean-blue" />
              <span>4.9/5</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-ocean-blue" />
              <span>2000+ Guests</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-ocean-blue" />
              <span>Luxor-Aswan</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href={ctaLink}
              className="w-full sm:w-auto bg-gradient-to-r from-ocean-blue to-deep-ocean-blue text-text-primary px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>{ctaText}</span>
            </a>
            
            <button className="w-full sm:w-auto border-2 border-white/30 text-text-primary px-8 py-4 rounded-full font-semibold backdrop-blur-sm bg-white/95 hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Watch Video</span>
            </button>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-ocean-blue w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Booking Form (Mobile Optimized) */}
      {showBookingForm && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-4 border-t border-white/20"
        >
          <div className="max-w-md mx-auto">
            <h3 className="text-center text-deep-ocean-blue font-semibold mb-3">
              Quick Booking
            </h3>
            <div className="grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-primary mb-1">Check-in</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-text-primary mb-1">Check-out</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-primary mb-1">Guests</label>
                <select className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ocean-blue focus:border-transparent">
                  <option>2 Guests</option>
                  <option>4 Guests</option>
                  <option>6 Guests</option>
                  <option>8+ Guests</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-ocean-blue text-text-primary p-2 rounded-lg font-semibold hover:bg-ocean-blue/90 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
