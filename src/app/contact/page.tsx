'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Typography, Grid, Box, TextField, Paper } from '@mui/material';
import { ContactForm } from '@/components/contact/contact-form';
import { useContent } from '@/hooks/useContent';
import { Container } from '@/components/ui/container';
import { AnimatedSection } from '@/components/ui/animated-section';
import OptimizedHeroVideo from '@/components/OptimizedHeroVideo';
import { useSession } from 'next-auth/react';
import '@/styles/admin.css';
import { Phone, Mail, MapPin, Clock, Heart, MessageCircle, Send, Play, Star, Edit3, Save, Facebook, Instagram, Twitter, Hash, Users, Bookmark, Globe } from 'lucide-react';
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
import Image from 'next/image';

export default function ContactPage() {
  const { data: session } = useSession();
  const { getContent, loading, error } = useContent({ page: 'contact' });
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [isEditing, setIsEditing] = useState(false);
  const initialSocialLinks = {
    facebook: getContent('contact_facebook', 'CleopatraDahabiyat'),
    instagram: getContent('contact_instagram', '@cleopatra_dahabiyat'),
    tiktok: getContent('contact_tiktok', '@cleopatra_nile'),
    x: getContent('contact_x', '@CleopatraNile'),
    youtube: getContent('contact_youtube', 'Cleopatra Dahabiyat'),
    pinterest: getContent('contact_pinterest', 'CleopatraCruises'),
    tripadvisor: getContent('contact_tripadvisor', 'Cleopatra-Dahabiyat-Luxor'),
    whatsapp: getContent('contact_whatsapp', '+20 123 456 7890'),
    telegram: getContent('contact_telegram', '@cleopatra_dahabiyat'),
    wechat: getContent('contact_wechat', 'CleopatraNile'),
    vk: getContent('contact_vk', 'CleopatraDahabiyat')
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

  const stripAt = (v: string) => (v || '').trim().replace(/^@+/, '');
  const digitsOnly = (v: string) => (v || '').replace(/\D+/g, '');
  const toUrl = (platform: string, v: string) => {
    const val = (v || '').trim();
    if (!val) return '#';
    if (/^https?:\/\//i.test(val)) return val;

    switch (platform) {
      case 'facebook':
        return `https://facebook.com/${stripAt(val)}`;
      case 'instagram':
        return `https://instagram.com/${stripAt(val)}`;
      case 'tiktok':
        return `https://www.tiktok.com/@${stripAt(val)}`;
      case 'x':
        return `https://x.com/${stripAt(val)}`;
      case 'youtube':
        return `https://www.youtube.com/@${stripAt(val)}`;
      case 'pinterest':
        return `https://www.pinterest.com/${stripAt(val)}`;
      case 'tripadvisor':
        return `https://www.tripadvisor.com/${val}`;
      case 'whatsapp':
        return `https://wa.me/${digitsOnly(val)}`;
      case 'telegram':
        return `https://t.me/${stripAt(val)}`;
      case 'wechat':
        return '#';
      case 'vk':
        return `https://vk.com/${stripAt(val)}`;
      default:
        return '#';
    }
  };

  if (loading) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <RoyalCrown className="w-16 h-16 text-ocean-blue mx-auto mb-6 animate-pulse" />
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-ocean-blue mx-auto mb-6"></div>
          <div className="text-ocean-blue text-3xl mb-4">𓇳 𓊪 𓈖 𓂀 𓏏 𓇯 𓊃</div>
          <p className="text-ocean-blue-dark font-bold text-xl">{getContent('contact_loading_text') || 'Loading Contact Page...'}</p>
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image with Egyptian Overlay */}
        <div className="absolute inset-0 z-0">
          <OptimizedHeroVideo
            src={getContent('contact_hero_video', '/videos/contact-hero.mp4')}
            poster={getContent('contact_hero_image', '/images/hero-bg.jpg')}
            className="absolute inset-0 w-full h-full"
            onError={() => {
              console.log('Contact hero video failed, using fallback image');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/60 via-navy-blue/40 to-ocean-blue/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            {/* Hieroglyphic Egypt at top */}
            <div className="text-center mb-8">
              <EgyptHieroglyphic className="text-4xl mb-4" />
            </div>

            <div className="text-center text-white">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-heading font-bold text-white drop-shadow-2xl mb-6">
                  {getContent('contact_hero_title') || 'Contact Our Egypt Experts'}
                </h1>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-amber-400 text-3xl drop-shadow-lg">𓈖</span>
                  <span className="text-blue-300 text-3xl drop-shadow-lg">𓂀</span>
                  <span className="text-amber-400 text-3xl drop-shadow-lg">𓏏</span>
                  <span className="text-blue-300 text-3xl drop-shadow-lg">𓇯</span>
                  <span className="text-amber-400 text-3xl drop-shadow-lg">𓊃</span>
                </div>
              </div>

              <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-blue-100 drop-shadow-lg">
                {getContent('contact_hero_subtitle') || 'Ready to embark on your Egyptian adventure? Our expert team is here to help you plan the perfect Nile cruise experience.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <PharaohButton className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 text-lg font-bold shadow-2xl">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Start Planning Now
                </PharaohButton>
                <PharaohButton className="bg-gradient-to-r from-ocean-blue to-deep-blue hover:from-ocean-blue-dark hover:to-navy-blue text-white px-8 py-4 text-lg font-bold shadow-2xl">
                  <Phone className="w-6 h-6 mr-3" />
                  Call Us Today
                </PharaohButton>
              </div>
            </div>
          </AnimatedSection>
        </Container>

        {/* Floating Egyptian Elements */}
        <div className="absolute top-20 left-10 text-6xl text-amber-400/30 animate-float">𓇳</div>
        <div className="absolute top-40 right-20 text-5xl text-blue-300/30 animate-float-delayed">𓈖</div>
        <div className="absolute bottom-32 left-20 text-7xl text-amber-500/20 animate-bounce-slow">𓊪</div>
        <div className="absolute bottom-20 right-10 text-6xl text-blue-400/30 animate-pulse">𓏏</div>
      </section>

      {/* Get in touch with our Egypt travel experts */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <Container maxWidth="xl">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-16">
              <div className="text-6xl md:text-8xl font-bold text-amber-600 mb-6 drop-shadow-lg">
                𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-ocean-blue via-deep-blue to-navy-blue bg-clip-text text-transparent mb-6">
                Get in touch with our Egypt travel experts
              </h2>
              <HieroglyphicDivider className="mx-auto mb-8" />
            </div>
          </AnimatedSection>

          {/* Enhanced Social Media Tabs */}
          <AnimatedSection animation="slide-up" delay={200}>
            <div className="max-w-6xl mx-auto px-4">
              <div className="bg-gradient-to-br from-amber-50/90 via-white/95 to-amber-100/80 backdrop-blur-sm rounded-3xl border-2 border-amber-300/40 shadow-2xl overflow-hidden">
                <div className="p-8 md:p-12">
                  {/* Edit Button - Only show for admin users */}
                  {session?.user?.role === 'ADMIN' && (
                    <div className="flex justify-end mb-6">
                      {!isEditing ? (
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="bg-ocean-blue hover:bg-ocean-blue-dark text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
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

                  {/* Enhanced 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Papyrus Social Media Container - Full Width Layout */}
                  <div className="pharaonic-papyrus-container-full-width mb-8 w-full">
                    <div className="text-center mb-12">
                      <div className="text-4xl md:text-6xl lg:text-7xl font-bold pharaonic-hieroglyphic-large mb-6 leading-none transform hover:scale-105 transition-transform duration-300">
                        𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                      </div>
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="text-3xl font-bold text-amber-600">𓈖</div>
                        <h3 className="text-2xl md:text-3xl font-bold text-amber-800">
                          Connect with Us Across All Platforms
                        </h3>
                        <div className="text-3xl font-bold text-amber-600">𓈖</div>
                      </div>
                      <p className="text-amber-700 opacity-90 text-lg max-w-2xl mx-auto leading-relaxed">
                        Choose your preferred platform to reach us and stay connected with our Dahabiya adventures
                      </p>
                    </div>

                    {/* Two Rows Layout - Properly justified grid */}
                    <div className="space-y-8">
                      {/* First Row: Facebook, Instagram, TikTok, X, YouTube, VK */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center pharaonic-social-grid">
                        {/* Facebook Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-facebook ${activeTab === 'facebook' ? 'ring-4 ring-blue-400' : ''}`}
                          onClick={() => setActiveTab('facebook')}
                        >
                          <div className="pharaonic-hieroglyphics">𓊪𓏏𓇯</div>
                          <div className="pharaonic-social-icon">
                            <Facebook className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">Facebook</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Follow Us</p>
                          </div>
                        </div>

                        {/* Instagram Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-instagram ${activeTab === 'instagram' ? 'ring-4 ring-pink-400' : ''}`}
                          onClick={() => setActiveTab('instagram')}
                        >
                          <div className="pharaonic-hieroglyphics">𓈙𓃀𓏏</div>
                          <div className="pharaonic-social-icon">
                            <Instagram className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">Instagram</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Photos</p>
                          </div>
                        </div>

                        {/* TikTok Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-tiktok ${activeTab === 'tiktok' ? 'ring-4 ring-black' : ''}`}
                          onClick={() => setActiveTab('tiktok')}
                        >
                          <div className="pharaonic-hieroglyphics">𓌃𓂋𓏏</div>
                          <div className="pharaonic-social-icon">
                            <Hash className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">TikTok</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Short Videos</p>
                          </div>
                        </div>

                        {/* X (Twitter) Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-x ${activeTab === 'x' ? 'ring-4 ring-gray-400' : ''}`}
                          onClick={() => setActiveTab('x')}
                        >
                          <div className="pharaonic-hieroglyphics">𓊪𓏏𓇯</div>
                          <div className="pharaonic-social-icon">
                            <Twitter className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">X</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Updates</p>
                          </div>
                        </div>

                        {/* YouTube Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-youtube ${activeTab === 'youtube' ? 'ring-4 ring-red-400' : ''}`}
                          onClick={() => setActiveTab('youtube')}
                        >
                          <div className="pharaonic-hieroglyphics">𓈙𓃀𓏏</div>
                          <div className="pharaonic-social-icon">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">YouTube</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Watch Videos</p>
                          </div>
                        </div>

                        {/* VK Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-vk ${activeTab === 'vk' ? 'ring-4 ring-blue-400' : ''}`}
                          onClick={() => setActiveTab('vk')}
                        >
                          <div className="pharaonic-hieroglyphics">𓊪𓏏𓇯</div>
                          <div className="pharaonic-social-icon">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">VK</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Social</p>
                          </div>
                        </div>
                      </div>

                      {/* Second Row: Pinterest, TripAdvisor, WhatsApp, Telegram, WeChat */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center pharaonic-social-grid">
                        {/* Pinterest Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-pinterest ${activeTab === 'pinterest' ? 'ring-4 ring-red-400' : ''}`}
                          onClick={() => setActiveTab('pinterest')}
                        >
                          <div className="pharaonic-hieroglyphics">𓋹𓍑𓋴</div>
                          <div className="pharaonic-social-icon">
                            <Bookmark className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">Pinterest</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Inspiration</p>
                          </div>
                        </div>

                        {/* TripAdvisor Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-tripadvisor ${activeTab === 'tripadvisor' ? 'ring-4 ring-emerald-400' : ''}`}
                          onClick={() => setActiveTab('tripadvisor')}
                        >
                          <div className="pharaonic-hieroglyphics">𓋹𓍑𓋴</div>
                          <div className="pharaonic-social-icon">
                            <Star className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">TripAdvisor</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Reviews</p>
                          </div>
                        </div>

                        {/* WhatsApp Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-whatsapp ${activeTab === 'whatsapp' ? 'ring-4 ring-green-400' : ''}`}
                          onClick={() => setActiveTab('whatsapp')}
                        >
                          <div className="pharaonic-hieroglyphics">𓊪𓏏𓇯</div>
                          <div className="pharaonic-social-icon">
                            <MessageCircle className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">WhatsApp</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Chat</p>
                          </div>
                        </div>

                        {/* Telegram Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-telegram ${activeTab === 'telegram' ? 'ring-4 ring-blue-400' : ''}`}
                          onClick={() => setActiveTab('telegram')}
                        >
                          <div className="pharaonic-hieroglyphics">𓌃𓂋𓏏</div>
                          <div className="pharaonic-social-icon">
                            <Send className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">Telegram</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Channel</p>
                          </div>
                        </div>

                        {/* WeChat Papyrus Button */}
                        <div
                          className={`pharaonic-social-button pharaonic-wechat ${activeTab === 'wechat' ? 'ring-4 ring-green-400' : ''}`}
                          onClick={() => setActiveTab('wechat')}
                        >
                          <div className="pharaonic-hieroglyphics">𓌃𓂋𓏏</div>
                          <div className="pharaonic-social-icon">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h4 className="pharaonic-social-text font-bold text-sm mb-1">WeChat</h4>
                            <p className="pharaonic-social-text text-xs opacity-75">Connect</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

                    {/* Facebook Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="facebook" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-facebook">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-6">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓊪𓏏𓇯𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓌃𓂋𓏏𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 mt-4 bg-gradient-to-br from-blue-600 to-blue-700">
                            <Facebook className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓊪𓏏𓇯 Follow us on Facebook 𓊪𓏏𓇯
                          </h3>

                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Stay connected with our Facebook community for daily updates, stunning photos, and exclusive offers on our luxury Nile dahabiya cruises.
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.facebook}
                              onChange={(e) => handleLinkChange('facebook', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-blue-300 focus:border-blue-500 bg-white/80"
                              placeholder="Facebook page name"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.facebook}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('facebook', socialLinks.facebook), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-800">
                            <Facebook className="w-6 h-6 mr-3" />
                            𓊪𓏏𓇯 Follow Us 𓊪𓏏𓇯
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓊪𓏏𓇯𓈖
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Instagram Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="instagram" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-instagram">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-6">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓈙𓃀𓏏𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓊪𓏏𓇯𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 mt-4 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500">
                            <Instagram className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓈙𓃀𓏏 Follow us on Instagram 𓈙𓃀𓏏
                          </h3>

                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Discover breathtaking photos and stories from our luxury dahabiya cruises. Experience the beauty of the Nile through our guests' eyes.
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.instagram}
                              onChange={(e) => handleLinkChange('instagram', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-pink-300 focus:border-pink-500 bg-white/80"
                              placeholder="Instagram handle"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.instagram}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('instagram', socialLinks.instagram), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-700">
                            <Instagram className="w-6 h-6 mr-3" />
                            𓈙𓃀𓏏 Follow Us 𓈙𓃀𓏏
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓈙𓃀𓏏𓈖
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* WhatsApp Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="whatsapp" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-whatsapp">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-6">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓊪𓏏𓇯𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓌃𓂋𓏏𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 mt-4 bg-gradient-to-br from-green-500 to-green-600">
                            <MessageCircle className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓊪𓏏𓇯 Connect via WhatsApp 𓊪𓏏𓇯
                          </h3>

                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Get instant responses to your questions about our dahabiya cruises, packages, and availability. Our team is ready to assist you in planning your perfect Nile adventure.
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.whatsapp}
                              onChange={(e) => handleLinkChange('whatsapp', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-green-300 focus:border-green-500 bg-white/80"
                              placeholder="WhatsApp number"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.whatsapp}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('whatsapp', socialLinks.whatsapp), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-700">
                            <MessageCircle className="w-6 h-6 mr-3" />
                            𓊪𓏏𓇯 Chat Now 𓊪𓏏𓇯
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓊪𓏏𓇯𓈖
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Telegram Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="telegram" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-telegram">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-6">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓌃𓂋𓏏𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓊪𓏏𓇯𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 mt-4 bg-gradient-to-br from-blue-500 to-blue-600">
                            <Send className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓌃𓂋𓏏 Join our Telegram 𓌃𓂋𓏏
                          </h3>

                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Join our exclusive Telegram channel for real-time updates, special offers, and behind-the-scenes content from our luxury Nile cruises and Egyptian adventures.
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.telegram}
                              onChange={(e) => handleLinkChange('telegram', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-blue-300 focus:border-blue-500 bg-white/80"
                              placeholder="Telegram username"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.telegram}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('telegram', socialLinks.telegram), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-700">
                            <Send className="w-6 h-6 mr-3" />
                            𓌃𓂋𓏏 Join Channel 𓌃𓂋𓏏
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓌃𓂋𓏏𓈖
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* YouTube Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="youtube" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-youtube">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-4">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓈙𓃀𓏏𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓊪𓏏𓇯𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600">
                            <Play className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓈙𓃀𓏏 Watch our Videos 𓈙𓃀𓏏
                          </h3>

                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Explore our YouTube channel featuring stunning footage of our dahabiyas, guest testimonials, and virtual tours of ancient Egyptian temples and monuments.
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.youtube}
                              onChange={(e) => handleLinkChange('youtube', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-red-300 focus:border-red-500 bg-white/80"
                              placeholder="YouTube channel name"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.youtube}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('youtube', socialLinks.youtube), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-red-700">
                            <Play className="w-6 h-6 mr-3" />
                            𓈙𓃀𓏏 Subscribe 𓈙𓃀𓏏
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓈙𓃀𓏏𓈖
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* TripAdvisor Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="tripadvisor" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-tripadvisor">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-4">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓋹𓍑𓋴𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓊪𓏏𓇯𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-emerald-600">
                            <Star className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓋹𓍑𓋴 Read our Reviews 𓋹𓍑𓋴
                          </h3>
                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Discover what our guests say about their unforgettable experiences aboard our luxury dahabiyas. Read authentic reviews and testimonials from travelers who have sailed the Nile with us.
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.tripadvisor}
                              onChange={(e) => handleLinkChange('tripadvisor', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-emerald-300 focus:border-emerald-500 bg-white/80"
                              placeholder="TripAdvisor profile"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.tripadvisor}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('tripadvisor', socialLinks.tripadvisor), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-700">
                            <Star className="w-6 h-6 mr-3" />
                            𓋹𓍑𓋴 View Reviews 𓋹𓍑𓋴
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓋹𓍑𓋴𓈖
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* TikTok Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="tiktok" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-tiktok">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-4">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓌃𓂋𓏏𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓊪𓏏𓇯𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-black via-red-500 to-black">
                            <Hash className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓌃𓂋𓏏 Follow us on TikTok 𓌃𓂋𓏏
                          </h3>

                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Watch exciting short videos of our dahabiya adventures, behind-the-scenes content, and quick glimpses of ancient Egyptian wonders.
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.tiktok}
                              onChange={(e) => handleLinkChange('tiktok', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-gray-300 focus:border-gray-500 bg-white/80"
                              placeholder="TikTok handle"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.tiktok}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('tiktok', socialLinks.tiktok), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-black via-red-500 to-black hover:from-gray-800 hover:via-red-600 hover:to-gray-800 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-700">
                            <Hash className="w-6 h-6 mr-3" />
                            𓌃𓂋𓏏 Follow Us 𓌃𓂋𓏏
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓌃𓂋𓏏𓈖
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* X (Twitter) Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="x" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-x">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-4">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓊪𓏏𓇯𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓌃𓂋𓏏𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-black via-blue-500 to-black">
                            <Twitter className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓊪𓏏𓇯 Follow us on X 𓊪𓏏𓇯
                          </h3>

                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Get real-time updates, travel tips, and engage with our community of Nile cruise enthusiasts on X (formerly Twitter).
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.x}
                              onChange={(e) => handleLinkChange('x', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-gray-300 focus:border-gray-500 bg-white/80"
                              placeholder="X handle"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.x}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('x', socialLinks.x), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-black via-blue-500 to-black hover:from-gray-800 hover:via-blue-600 hover:to-gray-800 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-700">
                            <Twitter className="w-6 h-6 mr-3" />
                            𓊪𓏏𓇯 Follow Us 𓊪𓏏𓇯
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓊪𓏏𓇯𓈖
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Pinterest Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="pinterest" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-pinterest">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-4">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓋹𓍑𓋴𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓊪𓏏𓇯𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-600 to-red-700">
                            <Bookmark className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓋹𓍑𓋴 Follow us on Pinterest 𓋹𓍑𓋴
                          </h3>

                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Get inspired by our curated boards featuring Egyptian travel inspiration, dahabiya designs, and ancient wonders of the Nile.
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.pinterest}
                              onChange={(e) => handleLinkChange('pinterest', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-red-300 focus:border-red-500 bg-white/80"
                              placeholder="Pinterest profile"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.pinterest}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('pinterest', socialLinks.pinterest), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-red-800">
                            <Bookmark className="w-6 h-6 mr-3" />
                            𓋹𓍑𓋴 Follow Us 𓋹𓍑𓋴
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓋹𓍑𓋴𓈖
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* WeChat Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="wechat" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-wechat">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-4">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓌃𓂋𓏏𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓊪𓏏𓇯𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600">
                            <Users className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓌃𓂋𓏏 Connect on WeChat 𓌃𓂋𓏏
                          </h3>

                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Connect with us on WeChat for personalized service and exclusive updates about our luxury Nile dahabiya cruises.
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.wechat}
                              onChange={(e) => handleLinkChange('wechat', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-green-300 focus:border-green-500 bg-white/80"
                              placeholder="WeChat ID"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.wechat}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('wechat', socialLinks.wechat), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-700">
                            <Users className="w-6 h-6 mr-3" />
                            𓌃𓂋𓏏 Connect 𓌃𓂋𓏏
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓌃𓂋𓏏𓈖
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* VK Tab - 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 Style */}
                    <TabsContent value="vk" className="mt-8">
                      <div className="pharaonic-papyrus-container-wide pharaonic-vk">
                        <div className="text-center">
                          <div className="text-3xl font-bold pharaonic-social-text mb-6">
                            𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                          </div>
                          <div className="pharaonic-hieroglyphics absolute top-4 left-4 text-2xl">𓊪𓏏𓇯𓈖</div>
                          <div className="pharaonic-hieroglyphics absolute top-4 right-4 text-2xl">𓌃𓂋𓏏𓈖</div>

                          <div className="pharaonic-social-icon w-24 h-24 mx-auto mb-6 mt-4 bg-gradient-to-br from-blue-600 to-blue-800">
                            <Users className="w-12 h-12 text-white" />
                          </div>

                          <h3 className="text-3xl font-heading font-bold pharaonic-social-text mb-4">
                            𓊪𓏏𓇯 Connect on VK 𓊪𓏏𓇯
                          </h3>

                          <p className="pharaonic-social-text mb-6 admin-text-justify max-w-md mx-auto text-lg leading-relaxed">
                            Join our VK community for exclusive content, travel updates, and connect with fellow Nile cruise enthusiasts from around the world.
                          </p>

                          {isEditing && session?.user?.role === 'ADMIN' ? (
                            <Input
                              value={tempLinks.vk}
                              onChange={(e) => handleLinkChange('vk', e.target.value)}
                              className="max-w-md mx-auto mb-4 text-center border-2 border-blue-300 focus:border-blue-500 bg-white/80"
                              placeholder="VK profile"
                            />
                          ) : (
                            <p className="text-2xl pharaonic-social-text mb-6 font-bold bg-white/30 rounded-lg py-2 px-4 inline-block">
                              {socialLinks.vk}
                            </p>
                          )}

                          <Button onClick={() => window.open(toUrl('vk', socialLinks.vk), '_blank')} className="pharaonic-social-button bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-800">
                            <Users className="w-6 h-6 mr-3" />
                            𓊪𓏏𓇯 Connect 𓊪𓏏𓇯
                          </Button>

                          <div className="pharaonic-hieroglyphics absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                            𓈖𓏏𓊪𓏏𓇯𓈖
                          </div>
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
              <PharaohCard className="text-center h-full bg-gradient-to-br from-ocean-blue/10 via-white/95 to-blue-300/10 backdrop-blur-sm border-2 border-ocean-blue/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Phone className="w-12 h-12 text-ocean-blue mx-auto mb-4" />
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
              <PharaohCard className="text-center h-full bg-gradient-to-br from-ocean-blue/10 via-white/95 to-blue-300/10 backdrop-blur-sm border-2 border-ocean-blue/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Mail className="w-12 h-12 text-ocean-blue mx-auto mb-4" />
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
              <PharaohCard className="text-center h-full bg-gradient-to-br from-ocean-blue/10 via-white/95 to-blue-300/10 backdrop-blur-sm border-2 border-ocean-blue/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <MapPin className="w-12 h-12 text-ocean-blue mx-auto mb-4" />
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