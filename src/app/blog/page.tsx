"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material';
import { AnimatedSection, StaggeredAnimation } from '@/components/ui/animated-section';
import { Calendar, User, Clock, Eye, Tag } from 'lucide-react';
import {
  HieroglyphicText,
  EgyptianBorder,
  PharaohCard,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  RoyalCrown,
  PharaohButton,
  HieroglyphicDivider,
} from '@/components/ui/pharaonic-elements';
import { BlogCard } from '@/components/blog';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  mainImageUrl?: string;
  heroImageUrl?: string;
  author: string;
  tags: string[];
  category?: string;
  isPublished: boolean;
  featured: boolean;
  publishedAt?: string;
  readTime?: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blogs', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load blog posts');
        }

        const data = await response.json();
        const publishedPosts = data.filter((post: BlogPost) => post.isPublished);
        setPosts(publishedPosts);
        setFeaturedPosts(publishedPosts.filter((post: BlogPost) => post.featured));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ocean-blue mx-auto mb-4"></div>
          <div className="text-ocean-blue-dark text-2xl font-bold">𓇳 Loading Royal Blogs 𓇳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-ocean-blue-dark text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-ocean-blue-dark font-bold text-xl">Failed to Load Blogs 𓏏</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-50 relative overflow-hidden">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-ocean-blue-dark via-deep-blue to-navy-blue overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/blog-hero-bg.jpg"
            alt="Egyptian Blogs Background"
            fill
            className="object-cover opacity-30"
          />
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white">
              {/* Main Title */}
              <Typography
                variant="h1"
                className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
              >
                Blogs
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h4"
                className="text-2xl md:text-3xl mb-8 text-sky-blue font-light drop-shadow-lg"
              >
                Discover amazing stories and experiences
              </Typography>

              {/* Description */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-black/20 backdrop-blur-sm border border-sky-blue/30 rounded-2xl p-8 shadow-2xl">
                  <p className="text-xl md:text-2xl leading-relaxed text-white font-light">
                    Discover the secrets of ancient Egypt, travel tips for your Nile journey, and stories from the heart of pharaonic civilization
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50/30 relative">
          <Container maxWidth="lg">
            <AnimatedSection animation="slide-up">
              <div className="text-center mb-16">
                <Typography
                  variant="h2"
                  className="text-4xl md:text-5xl font-bold text-ocean-blue-dark mb-4"
                >
                  Featured Blogs
                </Typography>
                <p className="text-xl text-ocean-blue max-w-3xl mx-auto">
                  Our most treasured stories and experiences
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPosts.slice(0, 3).map((post, index) => (
                  <div key={post.id}>
                    <StaggeredAnimation>
                      <BlogCard post={post} />
                    </StaggeredAnimation>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </Container>
        </section>
      )}

      {/* All Posts Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50/30 to-slate-50 relative">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-16">
              <Typography
                variant="h2"
                className="text-4xl md:text-5xl font-bold text-ocean-blue-dark mb-4"
              >
                All Blogs
              </Typography>
              <p className="text-xl text-ocean-blue max-w-3xl mx-auto">
                Explore all our stories and insights about Egypt
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <div key={post.id}>
                  <StaggeredAnimation>
                    <BlogCard post={post} />
                  </StaggeredAnimation>
                </div>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-ocean-blue-dark text-4xl mb-4">𓇳 𓊪 𓈖</div>
                <Typography variant="h5" className="text-ocean-blue-dark font-bold mb-4">
                  No Blogs Yet
                </Typography>
                <Typography variant="body1" className="text-ocean-blue">
                  Our scribes are working on new stories. Check back soon!
                </Typography>
              </div>
            )}
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}
