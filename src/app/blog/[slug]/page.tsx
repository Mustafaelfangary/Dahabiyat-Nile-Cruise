"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Typography, Chip, Divider } from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Calendar, User, Clock, ArrowLeft, Tag, Share2 } from 'lucide-react';
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
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function IndividualBlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${slug}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Blog post not found');
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlogPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <div className="text-amber-800 text-2xl font-bold">𓇳 Loading Chronicle 𓇳</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-amber-800 font-bold text-xl">Chronicle Not Found 𓏏</p>
          <Link href="/blog">
            <PharaohButton variant="primary" className="mt-4">
              Return to Chronicles
            </PharaohButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={post.heroImageUrl || post.mainImageUrl || '/images/blog-hero-bg.jpg'}
            alt={post.title}
            fill
            className="object-cover opacity-40"
          />
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white">
              {/* Back Button */}
              <div className="mb-8">
                <Link href="/blog">
                  <PharaohButton variant="secondary" className="inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Chronicles
                  </PharaohButton>
                </Link>
              </div>

              {/* Hieroglyphic Egypt at top */}
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-amber-300 mb-4 drop-shadow-lg">
                  𓇳 𓈖 𓊪 𓏏 𓇳
                </div>
                <HieroglyphicDivider />
              </div>

              {/* Category & Featured Badge */}
              <div className="flex justify-center gap-4 mb-6">
                {post.category && (
                  <Chip
                    label={post.category}
                    className="bg-amber-500 text-white font-bold"
                  />
                )}
                {post.featured && (
                  <Chip
                    label="Featured"
                    className="bg-orange-500 text-white font-bold"
                  />
                )}
              </div>

              {/* Main Title */}
              <HieroglyphicText 
                text={post.title}
                className="text-4xl md:text-6xl font-bold mb-6 text-amber-100 drop-shadow-2xl"
              />

              {/* Excerpt */}
              {post.excerpt && (
                <Typography 
                  variant="h5" 
                  className="text-xl md:text-2xl mb-8 text-amber-200 font-light drop-shadow-lg max-w-4xl mx-auto"
                >
                  {post.excerpt}
                </Typography>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                  <User className="w-5 h-5 text-amber-300 mr-2" />
                  <span className="text-amber-100 font-medium">{post.author}</span>
                </div>
                <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                  <Calendar className="w-5 h-5 text-amber-300 mr-2" />
                  <span className="text-amber-100 font-medium">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {post.readTime && (
                  <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                    <Clock className="w-5 h-5 text-amber-300 mr-2" />
                    <span className="text-amber-100 font-medium">{post.readTime} min read</span>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-amber-50/30 relative">
        <Container maxWidth="md">
          <AnimatedSection animation="slide-up">
            <PharaohCard className="overflow-hidden">
              {/* Featured Image */}
              {post.mainImageUrl && (
                <div className="relative h-96 mb-8">
                  <Image
                    src={post.mainImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-8 md:p-12">
                {/* Article Content */}
                <div className="prose prose-lg prose-amber max-w-none">
                  <div 
                    className="text-amber-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-amber-200">
                    <div className="flex items-center mb-4">
                      <Tag className="w-5 h-5 text-amber-600 mr-2" />
                      <Typography variant="h6" className="text-amber-800 font-bold">
                        Tags
                      </Typography>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          className="bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Share2 className="w-5 h-5 text-amber-600 mr-2" />
                      <Typography variant="h6" className="text-amber-800 font-bold">
                        Share this Chronicle
                      </Typography>
                    </div>
                    <div className="flex gap-2">
                      <PharaohButton
                        variant="secondary"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: post.title,
                              text: post.excerpt || post.title,
                              url: window.location.href,
                            });
                          }
                        }}
                      >
                        Share
                      </PharaohButton>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-12 pt-8 border-t border-amber-200 text-center">
                  <Link href="/blog">
                    <PharaohButton variant="primary">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to All Chronicles
                    </PharaohButton>
                  </Link>
                </div>
              </div>
            </PharaohCard>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}
