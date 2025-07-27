"use client";

import React from 'react';
import { Container } from '@mui/material';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Heart, Star, Globe } from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';
import {
  RoyalCrown,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  HieroglyphicDivider,
  PharaohCard,
  PharaohButton,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';

interface FooterProps {
  settings?: Record<string, any>;
  footerSettings?: Record<string, any>;
}

export default function Footer({ settings = {}, footerSettings = {} }: FooterProps) {
  const { getContent, loading: contentLoading } = useContent({ page: 'global_media' });

  // Helper to get a setting value with priority: footerSettings > content > settings > fallback
  const get = (key: string, fallback = '') => {
    // Use content system for ALL keys including main logo
    const contentValue = getContent(key, '');
    return footerSettings[key] || (contentValue || settings[key]) || fallback;
  };

  if (contentLoading) {
    return (
      <footer className="bg-gradient-to-b from-amber-50 to-orange-50 min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <EgyptHieroglyphic className="mx-auto mb-4" size="3rem" />
          <div className="text-egyptian-gold text-2xl mb-2">𓈖 𓂀 𓇳</div>
          <p className="text-hieroglyph-brown font-semibold">{get('footer_loading_text', 'Loading Royal Footer...')}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Egyptian papyrus background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l15 15v-30l-15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Modern decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle floating elements */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 right-10 w-1 h-1 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Container maxWidth="xl" className="relative z-10">
        <div className="py-16">
          {/* Modern Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/images/logo.png"
                alt="Site Logo"
                width={120}
                height={120}
                className="h-32 w-auto object-contain"
              />
            </div>

            {/* Hieroglyphic Egypt Header */}
            <div className="mb-6">
              <EgyptHieroglyphic className="mx-auto mb-4" size="2.5rem" />
              <HieroglyphicDivider />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              <span className="text-egyptian-gold mr-3">𓇳</span>
              {get('footer-title', 'Cleopatra Dahabiyat')}
              <span className="text-egyptian-gold ml-3">𓇳</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              <span className="text-sunset-orange mr-2">𓊪</span>
              {get('footer-description', 'Experience the magic of the Nile with our luxury dahabiya cruises. Authentic Egyptian hospitality meets modern comfort.')}
              <span className="text-sunset-orange ml-2">𓊪</span>
            </p>
          </div>

          {/* Modern Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            {/* Navigation */}
            <div>
              <h3 className="text-gray-800 font-bold text-lg mb-4">
                <span className="text-egyptian-gold mr-2">𓊪</span>
                {get('footer_quick_links_title', 'Quick Links')}
                <span className="text-egyptian-gold ml-2">𓊪</span>
              </h3>
              <ul className="space-y-2">
                {[
                  { name: get('footer-link-home', 'Home'), href: '/' },
                  { name: get('footer-link-dahabiyat', 'Dahabiyas'), href: '/dahabiyas' },
                  { name: get('footer-link-packages', 'Packages'), href: '/packages' },
                  { name: get('footer-link-about', 'About'), href: '/about' },
                  { name: get('footer-link-contact', 'Contact'), href: '/contact' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-egyptian-gold hover:text-sunset-orange transition-colors duration-300 font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-gray-800 font-bold text-lg mb-4">
                <span className="text-egyptian-gold mr-2">𓇳</span>
                Contact Info
                <span className="text-egyptian-gold ml-2">𓇳</span>
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: MapPin,
                    text: get('footer-address', 'Luxor, Egypt')
                  },
                  {
                    icon: Phone,
                    text: get('footer-phone', '+20 123 456 789')
                  },
                  {
                    icon: Mail,
                    text: get('footer-email', 'info@cleopatradadhabiyat.com')
                  }
                ].map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-egyptian-gold" />
                      <span className="text-gray-600 font-medium">
                        {contact.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-gray-800 font-bold text-lg mb-4">
                <span className="text-egyptian-gold mr-2">𓈖</span>
                {get('footer_follow_us_title', 'Follow Us')}
                <span className="text-egyptian-gold ml-2">𓈖</span>
              </h3>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: get('footer-facebook', '#') },
                  { icon: Twitter, href: get('footer-twitter', '#') },
                  { icon: Instagram, href: get('footer-instagram', '#') }
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors duration-300"
                  >
                    <social.icon className="w-5 h-5 text-egyptian-gold" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-gray-800 font-bold text-lg mb-4">
                <span className="text-egyptian-gold mr-2">𓂀</span>
                {get('footer_newsletter_title', 'Newsletter')}
                <span className="text-egyptian-gold ml-2">𓂀</span>
              </h3>
              <p className="text-gray-600 mb-4">
                {get('footer-newsletter-text', 'Subscribe to get updates on our latest offers and journeys.')}
              </p>

              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-egyptian-gold focus:ring-2 focus:ring-amber-200 text-gray-800 placeholder-gray-500"
                />

                <button className="w-full bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown font-semibold py-3 px-6 rounded-lg hover:from-egyptian-amber hover:to-orange-600 transition-colors duration-300 flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span className="mr-1">𓇳</span>
                  <span>{get('footer_subscribe_button_text', 'Subscribe')}</span>
                  <span className="ml-1">𓇳</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hieroglyphic Divider */}
          <div className="my-8">
            <HieroglyphicDivider />
          </div>

          {/* Developer Branding Box */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 shadow-lg border border-gray-100 max-w-md">
              <div className="flex items-center justify-center space-x-4">
                {/* Developer Logo */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md flex-shrink-0">
                  <Image
                    src={get('footer_developer_logo', '/images/logo-white.png')}
                    alt="Developer Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Developer Text and Buttons */}
                <div className="text-center">
                  <p className="text-gray-700 text-sm font-medium mb-3">
                    {get('footer_developer_branding_text', 'crafted with love in the land of the Pharaohs by Just X')}
                  </p>

                  {/* Contact Developer Buttons */}
                  <div className="flex space-x-2 justify-center">
                    <a
                      href={get('footer_developer_contact_url', 'mailto:developer@justx.com')}
                      className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown text-xs rounded-full hover:from-egyptian-amber hover:to-orange-600 transition-colors duration-300"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      {get('footer_developer_contact_text', 'Contact Developer')}
                    </a>
                    {get('footer_developer_website_url') && (
                      <a
                        href={get('footer_developer_website_url', 'https://justx.com')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-sunset-orange to-egyptian-gold text-white text-xs rounded-full hover:from-orange-600 hover:to-egyptian-amber transition-colors duration-300"
                      >
                        <Globe className="w-3 h-3 mr-1" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Bottom Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-gray-600">
                © {new Date().getFullYear()} {get('footer-company-name', 'Cleopatra Dahabiyat')}. All Rights Reserved.
              </p>

              <div className="flex items-center space-x-6">
                <Link href="/privacy" className="text-egyptian-gold hover:text-sunset-orange transition-colors duration-300 font-medium">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-egyptian-gold hover:text-sunset-orange transition-colors duration-300 font-medium">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
