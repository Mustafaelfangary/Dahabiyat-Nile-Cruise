'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Container, Typography, Grid, Box, TextField, Paper } from '@mui/material';
import { ContactForm } from '@/components/contact/contact-form';
import { useTranslation } from '@/lib/i18n';
import { useContent } from '@/hooks/useContent';
import { AnimatedSection } from '@/components/ui/animated-section';
import { useSession } from 'next-auth/react';
import '@/styles/admin.css';
import { Phone, Mail, MapPin, Clock, Heart, MessageCircle, Send, Play, Star, Edit3, Save } from 'lucide-react';
import {
  RoyalCrown,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  HieroglyphicDivider,
  PharaohCard,
  PharaohButton,
  EgyptianBorder,
  ObeliskContainer,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';

export default function ContactPage() {
  const { data: session } = useSession();
  const { getContent, loading, error } = useContent({ page: 'contact' });
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [isEditing, setIsEditing] = useState(false);
  const initialSocialLinks = {
    whatsapp: '+20 123 456 7890',
    telegram: '@cleopatra_dahabiyat',
    youtube: 'Cleopatra Dahabiyat',
    tripadvisor: 'Cleopatra-Dahabiyat-Luxor'
  };

  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);
  const [tempLinks, setTempLinks] = useState(initialSocialLinks);

  const handleSave = () => {
    setSocialLinks(tempLinks);
    setIsEditing(false);
    toast.success('Social media links updated successfully!');
  };

  const handleCancel = () => {
    setTempLinks(socialLinks);
    setIsEditing(false);
  };

  const handleLinkChange = (platform: string, value: string) => {
    setTempLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  if (loading) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <RoyalCrown className="w-16 h-16 text-egyptian-gold mx-auto mb-6 animate-pulse" />
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-egyptian-gold mx-auto mb-6"></div>
          <div className="text-egyptian-gold text-3xl mb-4">𓇳 𓊪 𓈖 𓂀 𓏏 𓇯 𓊃</div>
          <p className="pharaonic-text-brown font-bold text-xl">{getContent('contact_loading_text') || 'Loading Contact Page...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <div className="text-text-secondary text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-text-primary font-bold text-xl">Contact Loading Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pharaonic-container">
      <EgyptianPatternBackground className="opacity-10" />
      <FloatingEgyptianElements />

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            {/* Hieroglyphic Egypt at top */}
            <div className="text-center mb-8">
              <EgyptHieroglyphic className="text-4xl mb-4" />
            </div>

            <div className="text-center text-text-primary">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-heading font-bold bg-gradient-to-r from-egyptian-gold via-hieroglyph-brown to-sunset-orange bg-clip-text text-transparent mb-6">
                  {getContent('contact_hero_title') || 'Contact Us'}
                </h1>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-egyptian-gold text-2xl">𓈖</span>
                  <span className="text-sunset-orange text-2xl">𓂀</span>
                  <span className="text-egyptian-gold text-2xl">𓏏</span>
                  <span className="text-sunset-orange text-2xl">𓇯</span>
                  <span className="text-egyptian-gold text-2xl">𓊃</span>
                </div>
              </div>

              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-text-primary admin-text-justify">
                {getContent('contact_hero_subtitle') || 'Connect with our team to plan your perfect Nile journey. Our expert travel consultants are here to help you create unforgettable memories along the eternal Nile River.'}
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Get in touch with our Egypt travel experts */}
      <section className="py-20">
        <Container maxWidth="xl">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-egyptian-gold via-hieroglyph-brown to-sunset-orange bg-clip-text text-transparent mb-6">
                Get in touch with our Egypt travel experts
              </h2>
              <HieroglyphicDivider className="mx-auto mb-8" />
            </div>
          </AnimatedSection>

          {/* Enhanced Social Media Tabs */}
          <AnimatedSection animation="slide-up" delay={200}>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-egyptian-gold/10 via-white/95 to-sunset-orange/10 backdrop-blur-sm rounded-3xl border-2 border-egyptian-gold/30 shadow-2xl overflow-hidden">
                <div className="p-8">
                  {/* Edit Button - Only show for admin users */}
                  {session?.user?.role === 'ADMIN' && (
                    <div className="flex justify-end mb-6">
                      {!isEditing ? (
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="bg-egyptian-gold hover:bg-egyptian-gold/80 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Links
                        </Button>
                      ) : (
                        <div className="flex gap-3">
                          <Button
                            onClick={handleSave}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="border-2 border-gray-400 hover:bg-gray-100 px-6 py-2 rounded-full transition-all duration-300"
                        >
                          Cancel
                        </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-egyptian-gold/20 to-sunset-orange/20 rounded-2xl p-1 mb-8 gap-0.5">
                      <TabsTrigger
                        value="whatsapp"
                        className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg transition-all duration-300 font-medium flex items-center justify-center text-center px-0.5 py-2 min-h-[2.5rem] text-xs"
                      >
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <MessageCircle className="w-3 h-3 flex-shrink-0" />
                          <span className="text-[10px] leading-tight">WhatsApp</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="telegram"
                        className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300 font-medium flex items-center justify-center text-center px-0.5 py-2 min-h-[2.5rem] text-xs"
                      >
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <Send className="w-3 h-3 flex-shrink-0" />
                          <span className="text-[10px] leading-tight">Telegram</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="youtube"
                        className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-lg transition-all duration-300 font-medium flex items-center justify-center text-center px-0.5 py-2 min-h-[2.5rem] text-xs"
                      >
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <Play className="w-3 h-3 flex-shrink-0" />
                          <span className="text-[10px] leading-tight">YouTube</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="tripadvisor"
                        className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg transition-all duration-300 font-medium flex items-center justify-center text-center px-0.5 py-2 min-h-[2.5rem] text-xs"
                      >
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <Star className="w-3 h-3 flex-shrink-0" />
                          <span className="text-[10px] leading-tight">TripAdvisor</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>

                    {/* WhatsApp Tab */}
                    <TabsContent value="whatsapp" className="mt-8">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border-2 border-green-200">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <MessageCircle className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-heading font-bold text-green-800 mb-4">
                            Connect via WhatsApp
                          </h3>
                          <p className="text-green-700 mb-6 admin-text-justify max-w-md mx-auto">
                            Get instant responses to your questions about our dahabiya cruises, packages, and availability. Our team is ready to assist you in planning your perfect Nile adventure.
                          </p>
                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.whatsapp}
                              onChange={(e) => handleLinkChange('whatsapp', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-green-300 focus:border-green-500"
                              placeholder="WhatsApp number"
                            />
                          ) : (
                            <p className="text-xl text-green-700 mb-6 font-semibold">
                              {socialLinks.whatsapp}
                            </p>
                          )}
                          <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Chat Now
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Telegram Tab */}
                    <TabsContent value="telegram" className="mt-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-200">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Send className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-heading font-bold text-blue-800 mb-4">
                            Join our Telegram
                          </h3>
                          <p className="text-blue-700 mb-6 admin-text-justify max-w-md mx-auto">
                            Join our exclusive Telegram channel for real-time updates, special offers, and behind-the-scenes content from our luxury Nile cruises and Egyptian adventures.
                          </p>
                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.telegram}
                              onChange={(e) => handleLinkChange('telegram', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-blue-300 focus:border-blue-500"
                              placeholder="Telegram username"
                            />
                          ) : (
                            <p className="text-xl text-blue-700 mb-6 font-semibold">
                              {socialLinks.telegram}
                            </p>
                          )}
                          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                            <Send className="w-5 h-5 mr-2" />
                            Join Channel
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* YouTube Tab */}
                    <TabsContent value="youtube" className="mt-8">
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border-2 border-red-200">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Play className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-heading font-bold text-red-800 mb-4">
                            Watch our Videos
                          </h3>
                          <p className="text-red-700 mb-6 admin-text-justify max-w-md mx-auto">
                            Explore our YouTube channel featuring stunning footage of our dahabiyas, guest testimonials, and virtual tours of ancient Egyptian temples and monuments.
                          </p>
                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.youtube}
                              onChange={(e) => handleLinkChange('youtube', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-red-300 focus:border-red-500"
                              placeholder="YouTube channel name"
                            />
                          ) : (
                            <p className="text-xl text-red-700 mb-6 font-semibold">
                              {socialLinks.youtube}
                            </p>
                          )}
                          <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                            <Play className="w-5 h-5 mr-2" />
                            Subscribe
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* TripAdvisor Tab */}
                    <TabsContent value="tripadvisor" className="mt-8">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 border-2 border-emerald-200">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Star className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-heading font-bold text-emerald-800 mb-4">
                            Read our Reviews
                          </h3>
                          <p className="text-emerald-700 mb-6 admin-text-justify max-w-md mx-auto">
                            Discover what our guests say about their unforgettable experiences aboard our luxury dahabiyas. Read authentic reviews and testimonials from travelers who have sailed the Nile with us.
                          </p>
                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.tripadvisor}
                              onChange={(e) => handleLinkChange('tripadvisor', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-emerald-300 focus:border-emerald-500"
                              placeholder="TripAdvisor profile"
                            />
                          ) : (
                            <p className="text-xl text-emerald-700 mb-6 font-semibold">
                              {socialLinks.tripadvisor}
                            </p>
                          )}
                          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                            <Star className="w-5 h-5 mr-2" />
                            View Reviews
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Traditional Contact Information */}
      <section className="py-20">
        <Container maxWidth="xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Phone */}
            <AnimatedSection animation="slide-up">
              <PharaohCard className="text-center h-full bg-gradient-to-br from-egyptian-gold/10 via-white/95 to-sunset-orange/10 backdrop-blur-sm border-2 border-egyptian-gold/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Phone className="w-12 h-12 text-egyptian-gold mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-text-primary mb-4">
                  {getContent('contact_phone_title') || 'Call Us'}
                </h3>
                <p className="text-text-primary text-lg font-semibold">
                  {getContent('contact_phone') || '+20 123 456 7890'}
                </p>
              </PharaohCard>
            </AnimatedSection>

            {/* Email */}
            <AnimatedSection animation="slide-up" delay={200}>
              <PharaohCard className="text-center h-full bg-gradient-to-br from-egyptian-gold/10 via-white/95 to-sunset-orange/10 backdrop-blur-sm border-2 border-egyptian-gold/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Mail className="w-12 h-12 text-egyptian-gold mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-text-primary mb-4">
                  {getContent('contact_email_title') || 'Email Us'}
                </h3>
                <p className="text-text-primary text-lg font-semibold">
                  {getContent('contact_email') || 'info@cleopatra-dahabiyat.com'}
                </p>
              </PharaohCard>
            </AnimatedSection>

            {/* Location */}
            <AnimatedSection animation="slide-up" delay={400}>
              <PharaohCard className="text-center h-full bg-gradient-to-br from-egyptian-gold/10 via-white/95 to-sunset-orange/10 backdrop-blur-sm border-2 border-egyptian-gold/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <MapPin className="w-12 h-12 text-egyptian-gold mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-text-primary mb-4">
                  {getContent('contact_location_title') || 'Visit Us'}
                </h3>
                <p className="text-text-primary text-lg font-semibold">
                  {getContent('contact_address') || 'Luxor, Egypt'}
                </p>
              </PharaohCard>
            </AnimatedSection>
          </div>
        </Container>
      </section>
    </div>
  );
}