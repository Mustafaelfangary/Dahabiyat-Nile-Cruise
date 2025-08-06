"use client";

import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Heart, Star, Globe, X, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  RoyalCrown,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  HieroglyphicDivider,
  PharaohCard,
  PharaohButton,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';

import MediaPicker from '@/components/admin/MediaPicker';

interface FooterProps {
  settings?: Record<string, any>;
  footerSettings?: Record<string, any>;
}

// Contact Developer Modal Component
function ContactDeveloperModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { getContent } = useContent({ page: 'global_media' });

  const get = (key: string, fallback = '') => {
    const contentValue = getContent(key, '');
    return contentValue || fallback;
  };



  // WhatsApp handler
  const handleWhatsApp = () => {
    const phone = get('footer_developer_phone', '+201234567890').replace(/\s+/g, '').replace('+', '');
    const message = encodeURIComponent('Hello! I would like to get in touch regarding your development services.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown text-xs rounded-full hover:from-egyptian-amber hover:to-orange-600 transition-colors duration-300"
      >
        <Mail className="w-3 h-3 mr-1" />
        {get('footer_developer_contact_text', 'Contact Developer')}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.95) 0%, rgba(74, 20, 140, 0.9) 25%, rgba(139, 69, 19, 0.85) 50%, rgba(212, 175, 55, 0.9) 75%, rgba(255, 215, 0, 0.95) 100%)',
              backdropFilter: 'blur(25px)',
              border: '3px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px rgba(212, 175, 55, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3), 0 0 60px rgba(212, 175, 55, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                {get('footer_developer_contact_modal_title', 'Contact Developer')}
              </h3>

              <div className="space-y-3">
                <a
                  href={get('footer_developer_contact_url', 'mailto:developer@justx.com')}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #FFA500 100%)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Mail className="w-5 h-5 mr-3" />
                  Send Email
                </a>

                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <span className="w-5 h-5 mr-3 text-lg">💬</span>
                  WhatsApp
                </button>

                <a
                  href={get('footer_developer_phone_url', 'tel:+201234567890')}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #1A73E8 100%)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 8px 25px rgba(66, 133, 244, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Footer({ settings = {}, footerSettings = {} }: FooterProps) {
  const { getContent, loading: contentLoading } = useContent({ page: 'footer' });
  const { getContent: getGlobalContent } = useContent({ page: 'global_media' });
  const { data: session } = useSession();

  // Get dynamic footer logo
  const getFooterLogo = () => {
    return getGlobalContent('footer_logo', '/images/logo.png');
  };

  // Helper to get a setting value with priority: footerSettings > content > settings > fallback
  const get = (key: string, fallback = '') => {
    // For developer-related keys, check global_media content first
    if (key.includes('developer')) {
      const globalContentValue = getGlobalContent(key, '');
      if (globalContentValue) return globalContentValue;
    }

    // Use content system for ALL other keys
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
    <footer className="relative overflow-hidden bg-gradient-to-b from-deep-blue to-navy-blue">
      {/* Dark blue background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-navy-blue to-ocean-blue-dark"></div>

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
                src={getFooterLogo()}
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

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              <span className="text-blue-300 mr-3">𓇳</span>
              {get('footer-title', 'Cleopatra Dahabiyat')}
              <span className="text-blue-300 ml-3">𓇳</span>
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
              <span className="text-blue-300 mr-2">𓊪</span>
              {get('footer-description', 'Experience the magic of the Nile with our luxury dahabiya cruises. Authentic Egyptian hospitality meets modern comfort.')}
              <span className="text-blue-300 ml-2">𓊪</span>
            </p>
          </div>

          {/* Modern Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            {/* Navigation */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                <span className="text-blue-300 mr-2">𓊪</span>
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
              <h3 className="text-white font-bold text-lg mb-4">
                <span className="text-blue-300 mr-2">𓇳</span>
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
                      <span className="text-blue-100 font-medium">
                        {contact.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                <span className="text-blue-300 mr-2">𓈖</span>
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
              <h3 className="text-white font-bold text-lg mb-4">
                <span className="text-blue-300 mr-2">𓂀</span>
                {get('footer_newsletter_title', 'Newsletter')}
                <span className="text-blue-300 ml-2">𓂀</span>
              </h3>
              <p className="text-blue-100 mb-4">
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

          {/* Admin Access - Only visible to admin users */}
          {session?.user?.role === 'ADMIN' && (
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border border-purple-200">
              <div className="text-center">
                <h4 className="text-purple-800 font-bold text-sm mb-2">
                  <span className="text-purple-600 mr-2">👑</span>
                  Admin Access
                  <span className="text-purple-600 ml-2">👑</span>
                </h4>
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            </div>
          )}

          {/* Hieroglyphic Divider */}
          <div className="my-8">
            <HieroglyphicDivider />
          </div>

          {/* Developer Contact Section */}
          <div className="flex justify-center items-center gap-3 mb-8">
            {/* Developer Logo */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white shadow-sm flex-shrink-0">
              <Image
                src={get('footer_developer_logo', '/images/logo-white.png')}
                alt="Developer Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contact Developer Button */}
            <ContactDeveloperModal />
          </div>

          {/* Modern Bottom Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-blue-100">
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
