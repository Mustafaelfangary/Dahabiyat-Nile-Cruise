"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { Calendar, Clock, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  mainImageUrl?: string;
  author: string;
  publishedAt?: string;
  createdAt: string;
  readTime?: number;
  featured: boolean;
  category?: string;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card
        className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
          border: '2px solid #0080ff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 128, 255, 0.2)',
        }}
      >
        {/* Ocean Blue Border Pattern */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean-blue via-blue-400 to-ocean-blue"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean-blue via-blue-400 to-ocean-blue"></div>

        {/* Floating Hieroglyphic Elements */}
        <div className="absolute top-2 right-2 text-egyptian-gold opacity-20 text-lg z-10">𓊪</div>
        
        {/* Enhanced Image Section */}
        <div className="relative h-64 overflow-hidden rounded-t-lg">
          <Image
            src={post.mainImageUrl || '/images/default-blog.jpg'}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Pharaonic Corner Decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-egyptian-gold opacity-60"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-egyptian-gold opacity-60"></div>
          
          {/* Enhanced Overlay badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {post.featured && (
              <Chip
                label="Featured"
                className="bg-gradient-to-r from-egyptian-gold to-amber-500 text-hieroglyph-brown font-bold shadow-xl"
                style={{
                  border: '2px solid #0080ff',
                  boxShadow: '0 4px 15px rgba(0, 128, 255, 0.4)',
                }}
              />
            )}
            {post.category && (
              <Chip
                label={post.category}
                className="bg-gradient-to-r from-ocean-blue to-blue-600 text-white font-semibold shadow-lg"
                style={{
                  border: '1px solid #0080ff',
                  boxShadow: '0 2px 8px rgba(0, 128, 255, 0.3)',
                }}
              />
            )}
          </div>
        </div>

        <CardContent className="p-6 bg-gradient-to-b from-blue-50 to-sky-50">
          {/* Decorative Divider */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-ocean-blue"></div>
            <Typography className="text-ocean-blue text-lg">𓇳</Typography>
            <div className="w-8 h-0.5 bg-ocean-blue"></div>
          </div>

          {/* Enhanced Title */}
          <Typography
            variant="h5"
            component="h3"
            className="font-bold text-black mb-3 group-hover:text-ocean-blue transition-colors text-center"
            style={{ fontFamily: 'serif' }}
          >
            {post.title}
          </Typography>

          {/* Description */}
          <Typography 
            variant="body2" 
            className="text-gray-700 mb-4 text-center line-clamp-3"
            style={{ minHeight: '4.5rem' }}
          >
            {post.excerpt || post.content.substring(0, 100) + '...'}
          </Typography>

          {/* Blog Details */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <div className="flex items-center gap-2 text-white bg-blue-500 rounded-lg p-2">
              <Calendar className="w-4 h-4 text-white" />
              <span className="font-medium text-xs">
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </span>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-2 text-hieroglyph-brown bg-amber-100 rounded-lg p-2">
                <Clock className="w-4 h-4 text-egyptian-gold" />
                <span className="font-medium text-xs">{post.readTime} min read</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-white bg-blue-500 rounded-lg p-2">
              <User className="w-4 h-4 text-white" />
              <span className="font-medium text-xs">{post.author}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1 justify-center">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                    className="text-xs bg-egyptian-gold/10 border-egyptian-gold text-hieroglyph-brown font-medium"
                  />
                ))}
                {post.tags.length > 3 && (
                  <Chip
                    label={`+${post.tags.length - 3} more`}
                    size="small"
                    variant="outlined"
                    className="text-xs text-amber-600 border-amber-400 bg-amber-50"
                  />
                )}
              </div>
            </div>
          )}

          {/* Bottom Decorative Element */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <div className="w-6 h-0.5 bg-ocean-blue"></div>
            <Typography className="text-ocean-blue text-sm">𓇳</Typography>
            <div className="w-6 h-0.5 bg-ocean-blue"></div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
