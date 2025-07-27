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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <div className="text-amber-800 text-2xl font-bold">𓇳 Loading Royal Chronicles 𓇳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-amber-800 font-bold text-xl">Failed to Load Chronicles 𓏏</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 relative overflow-hidden">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/blog-hero-bg.jpg"
            alt="Egyptian Chronicles Background"
            fill
            className="object-cover opacity-30"
          />
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white">
              {/* Hieroglyphic Egypt at top */}
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-amber-300 mb-4 drop-shadow-lg">
                  𓇳 𓈖 𓊪 𓏏 𓇳
                </div>
                <HieroglyphicDivider />
              </div>

              {/* Royal Crown */}
              <div className="flex justify-center mb-6">
                <RoyalCrown size="large" />
              </div>

              {/* Main Title */}
              <HieroglyphicText 
                text="Royal Chronicles"
                className="text-5xl md:text-7xl font-bold mb-6 text-amber-100 drop-shadow-2xl"
              />

              {/* Subtitle */}
              <Typography 
                variant="h4" 
                className="text-2xl md:text-3xl mb-8 text-amber-200 font-light drop-shadow-lg"
              >
                𓊪 Tales from the Land of Pharaohs 𓊪
              </Typography>

              {/* Description */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-black/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8 shadow-2xl">
                  <p className="text-xl md:text-2xl leading-relaxed text-amber-50 font-light">
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
        <section className="py-20 bg-gradient-to-b from-slate-50 to-amber-50/30 relative">
          <Container maxWidth="lg">
            <AnimatedSection animation="slide-up">
              <div className="text-center mb-16">
                <HieroglyphicText 
                  text="Featured Chronicles"
                  className="text-4xl md:text-5xl font-bold text-amber-800 mb-4"
                />
                <HieroglyphicDivider />
                <p className="text-xl text-amber-700 max-w-3xl mx-auto">
                  Our most treasured stories from the land of the pharaohs
                </p>
              </div>

              <Grid container spacing={4}>
                {featuredPosts.slice(0, 3).map((post, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={post.id}>
                    <StaggeredAnimation delay={index * 0.2}>
                      <Link href={`/blog/${post.slug}`}>
                        <PharaohCard className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                          <div className="relative overflow-hidden">
                            <Image
                              src={post.mainImageUrl || '/images/default-blog.jpg'}
                              alt={post.title}
                              width={400}
                              height={250}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-4 left-4">
                              <Chip
                                label="Featured"
                                className="bg-amber-500 text-white font-bold"
                              />
                            </div>
                          </div>
                          
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 text-sm text-amber-600 mb-3">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                              </div>
                              {post.readTime && (
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {post.readTime} min read
                                </div>
                              )}
                            </div>
                            
                            <Typography variant="h5" className="font-bold text-amber-800 mb-3 group-hover:text-amber-600 transition-colors">
                              {post.title}
                            </Typography>
                            
                            <Typography variant="body2" className="text-amber-700 mb-4 line-clamp-3">
                              {post.excerpt || post.content.substring(0, 150) + '...'}
                            </Typography>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-amber-600">
                                <User className="w-4 h-4 mr-1" />
                                {post.author}
                              </div>
                              
                              {post.category && (
                                <Chip
                                  label={post.category}
                                  size="small"
                                  className="bg-amber-100 text-amber-800"
                                />
                              )}
                            </div>
                          </CardContent>
                        </PharaohCard>
                      </Link>
                    </StaggeredAnimation>
                  </Grid>
                ))}
              </Grid>
            </AnimatedSection>
          </Container>
        </section>
      )}

      {/* All Posts Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50/30 to-slate-50 relative">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-16">
              <HieroglyphicText 
                text="All Chronicles"
                className="text-4xl md:text-5xl font-bold text-amber-800 mb-4"
              />
              <HieroglyphicDivider />
              <p className="text-xl text-amber-700 max-w-3xl mx-auto">
                Explore all our stories and insights about Egypt
              </p>
            </div>

            <Grid container spacing={4}>
              {posts.map((post, index) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={post.id}>
                  <StaggeredAnimation delay={index * 0.1}>
                    <Link href={`/blog/${post.slug}`}>
                      <PharaohCard className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                        <div className="relative overflow-hidden">
                          <Image
                            src={post.mainImageUrl || '/images/default-blog.jpg'}
                            alt={post.title}
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {post.featured && (
                            <div className="absolute top-4 left-4">
                              <Chip
                                label="Featured"
                                className="bg-amber-500 text-white font-bold"
                              />
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 text-sm text-amber-600 mb-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </div>
                            {post.readTime && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {post.readTime} min read
                              </div>
                            )}
                          </div>
                          
                          <Typography variant="h6" className="font-bold text-amber-800 mb-3 group-hover:text-amber-600 transition-colors">
                            {post.title}
                          </Typography>
                          
                          <Typography variant="body2" className="text-amber-700 mb-4 line-clamp-2">
                            {post.excerpt || post.content.substring(0, 100) + '...'}
                          </Typography>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-amber-600">
                              <User className="w-4 h-4 mr-1" />
                              {post.author}
                            </div>
                            
                            {post.category && (
                              <Chip
                                label={post.category}
                                size="small"
                                className="bg-amber-100 text-amber-800"
                              />
                            )}
                          </div>
                          
                          {post.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                <Chip
                                  key={tagIndex}
                                  label={tag}
                                  size="small"
                                  className="bg-amber-50 text-amber-700 text-xs"
                                />
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </PharaohCard>
                    </Link>
                  </StaggeredAnimation>
                </Grid>
              ))}
            </Grid>

            {posts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>
                <Typography variant="h5" className="text-amber-800 font-bold mb-4">
                  No Chronicles Yet
                </Typography>
                <Typography variant="body1" className="text-amber-700">
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
