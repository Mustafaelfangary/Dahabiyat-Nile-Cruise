'use client';

import React, { useState } from 'react';
import { Container, Button, TextField, MenuItem } from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import Link from 'next/link';
import Image from 'next/image';
import { useContent } from '@/hooks/useContent';
import {
  Star,
  Users,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Play,
  Heart,
  Shield,
  Utensils,
  Car,
  Bed,
  CheckCircle,
  Send,
  Phone,
  Mail
} from 'lucide-react';

export default function TailorMadePage() {
  const { getContent, getContentBlock, loading: contentLoading, error } = useContent({ page: 'tailor-made' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    duration: '',
    budget: '',
    interests: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const scrollToForm = () => {
    const formSection = document.getElementById('planning-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setSubmitMessage('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/tailor-made', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Your request has been submitted successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          duration: '',
          budget: '',
          interests: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Failed to submit your request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading Tailor-Made Experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 text-xl font-bold">Content Loading Error</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Hieroglyphic Header */}
      <section className="py-8 bg-gradient-to-r from-amber-50 to-orange-50">
        <Container maxWidth="lg">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              <span className="text-egyptian-gold">𓂋</span><span className="text-sunset-orange">𓏤</span><span className="text-egyptian-gold">𓈖</span><span className="text-sunset-orange">𓇋</span><span className="text-egyptian-gold">𓆎</span><span className="text-sunset-orange">𓏏</span><span className="text-egyptian-gold">𓂻</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-r from-egyptian-gold to-sunset-orange overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getContent('tailor_made_hero_image', '/images/tailor-made-hero.jpg')}
            alt="Tailor-made journey"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-hieroglyph-brown/40"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <Container maxWidth="lg">
            <div className="text-white text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                {getContent('tailor_made_hero_title', 'Tailor-Made Journeys')}
              </h1>

              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                {getContent('tailor_made_hero_subtitle', 'Create your perfect Egyptian adventure. Every detail crafted to your desires, every moment designed for your dreams.')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 px-8 py-4 text-lg hover:bg-gray-100 rounded-full">
                  <Play className="w-5 h-5 mr-2" />
                  Watch How It Works
                </Button>
                <Button
                  onClick={scrollToForm}
                  className="bg-blue-600 text-white px-8 py-4 text-lg hover:bg-blue-700 rounded-full"
                >
                  Start Planning
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {getContent('tailor_made_process_title', 'How It Works')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getContent('tailor_made_process_subtitle', 'Creating your perfect Egyptian journey is simple with our expert guidance')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Consultation</h3>
              <p className="text-gray-600">Share your dreams and preferences with our travel experts</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-sunset-orange to-egyptian-amber text-hieroglyph-brown rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Design</h3>
              <p className="text-gray-600">We craft a detailed itinerary tailored to your interests</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-egyptian-amber to-egyptian-gold text-hieroglyph-brown rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Refinement</h3>
              <p className="text-gray-600">Fine-tune every detail until it's perfect for you</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Experience</h3>
              <p className="text-gray-600">Enjoy your perfectly crafted Egyptian adventure</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Why Choose Tailor-Made?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience Egypt your way with completely customizable journey packages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-egyptian-gold/20">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-egyptian-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Personalized Journey</h3>
              <p className="text-gray-600 text-center">Design your perfect expedition with our expert consultants. Choose your destinations, activities, and pace.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-egyptian-gold/20">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-sunset-orange" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Expert Guidance</h3>
              <p className="text-gray-600 text-center">Our specialists possess deep knowledge and expertise to guide you to hidden treasures and authentic experiences.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-egyptian-gold/20">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-egyptian-amber" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Flexible Itinerary</h3>
              <p className="text-gray-600 text-center">Adapt your journey as you discover new wonders. Change destinations, extend stays, or add experiences along the way.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section id="planning-form" className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                {getContent('tailor_made_form_title', 'Start Planning Your Journey')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {getContent('tailor_made_form_subtitle', 'Tell us about your dream Egyptian adventure and we\'ll create the perfect itinerary just for you.')}
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Call Us</div>
                    <div className="text-gray-600">+20 123 456 789</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Email Us</div>
                    <div className="text-gray-600">info@cleopatradadhabiyat.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Response Time</div>
                    <div className="text-gray-600">Within 24 hours</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </div>

                <TextField
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="duration"
                    label="Preferred Duration"
                    select
                    value={formData.duration}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    <MenuItem value="3-5 days">3-5 days</MenuItem>
                    <MenuItem value="6-8 days">6-8 days</MenuItem>
                    <MenuItem value="9-12 days">9-12 days</MenuItem>
                    <MenuItem value="13+ days">13+ days</MenuItem>
                  </TextField>

                  <TextField
                    name="budget"
                    label="Budget Range"
                    select
                    value={formData.budget}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    <MenuItem value="$2000-5000">$2,000 - $5,000</MenuItem>
                    <MenuItem value="$5000-10000">$5,000 - $10,000</MenuItem>
                    <MenuItem value="$10000-20000">$10,000 - $20,000</MenuItem>
                    <MenuItem value="$20000+">$20,000+</MenuItem>
                  </TextField>
                </div>

                <TextField
                  name="interests"
                  label="Special Interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., Ancient temples, Photography, Luxury dining..."
                  fullWidth
                />

                <TextField
                  name="message"
                  label="Tell us about your dream journey"
                  value={formData.message}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  fullWidth
                />

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <p className="text-green-800 font-medium">{submitMessage}</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-red-600 mr-2">⚠️</div>
                      <p className="text-red-800 font-medium">{submitMessage}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-lg rounded-lg ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send My Request
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-egyptian-gold to-sunset-orange">
        <Container maxWidth="lg">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create Your Perfect Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let our experts craft an unforgettable Egyptian adventure tailored specifically to your dreams and desires.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-egyptian-gold px-8 py-4 text-lg hover:bg-amber-50 rounded-full">
                <Heart className="w-5 h-5 mr-2" />
                Save for Later
              </Button>
              <Button
                onClick={scrollToForm}
                className="bg-sunset-orange text-white px-8 py-4 text-lg hover:bg-orange-600 rounded-full"
              >
                Start Planning Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Link href="/contact">
                <Button className="bg-transparent border-2 border-white text-white px-8 py-4 text-lg hover:bg-white hover:text-egyptian-gold rounded-full">
                  Contact Expert
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
