'use client';

import { useState, useEffect } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Tag, Clock, ChevronRight, Search, BookOpen, Star, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { useContent } from '@/hooks/useContent';
import OptimizedHeroVideo from '@/components/OptimizedHeroVideo';

interface Blog {
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

type PharaohButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { className?: string; children: ReactNode };

const PharaohButton = ({ children, className = '', ...props }: PharaohButtonProps) => (
  <Button
    className={`relative overflow-hidden bg-gradient-to-r from-ocean-blue to-deep-blue hover:from-ocean-blue-dark hover:to-navy-blue text-white font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
    {...props}
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
  </Button>
);

type AnimatedSectionProps = { children: ReactNode; animation?: 'fade-up' | 'fade-left' | 'fade-right'; delay?: number };

const AnimatedSection = ({ children, animation = 'fade-up', delay = 0 }: AnimatedSectionProps) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      y: animation === 'fade-up' ? 50 : 0,
      x: animation === 'fade-left' ? -50 : animation === 'fade-right' ? 50 : 0 
    }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    transition={{ duration: 0.8, delay: delay / 1000 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

export default function BlogsPage() {
  const { getContent } = useContent({ page: 'blogs' });
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });
      if (response.ok) {
        const data = await response.json();
        const publishedBlogs = data.filter((blog: Blog) => blog.isPublished);
        setBlogs(publishedBlogs);
        setFeaturedBlogs(publishedBlogs.filter((blog: Blog) => blog.featured));

        // Extract unique categories
        const uniqueCategories = [...new Set(publishedBlogs
          .map((blog: Blog) => blog.category)
          .filter(Boolean)
        )] as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ocean-blue mx-auto mb-4"></div>
          <p className="text-ocean-blue-dark text-lg">Loading Ancient Wisdom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden min-h-[60vh]">
        {/* Hero Video/Image Background */}
        <OptimizedHeroVideo
          src={getContent('blogs_hero_video', '/videos/blogs-hero.mp4')}
          poster={getContent('blogs_hero_image', '/images/blogs-hero-bg.jpg')}
          className="absolute inset-0 w-full h-full"
          onError={() => {
            console.log('Blogs hero video failed, using fallback image');
          }}
        />
        
        {/* Enhanced Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-blue-800/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/15 via-transparent to-cyan-900/15"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-shadow-lg text-white">
                <span className="text-sky-blue">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</span> {getContent('blogs_hero_title', 'Ancient Blogs')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white leading-relaxed">
                {getContent('blogs_hero_description', 'Discover the secrets of the pharaohs, explore hidden treasures, and immerse yourself in the timeless stories of ancient Egypt through our curated collection of articles.')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <PharaohButton className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Featured Stories
                </PharaohButton>
                <PharaohButton className="bg-white text-ocean-blue hover:bg-blue-50">
                  <Star className="w-5 h-5 mr-2" />
                  Subscribe to Updates
                </PharaohButton>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white/80 backdrop-blur-sm border-b border-blue-200">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-blue w-5 h-5" />
                <Input
                  id="blog-search"
                  name="search"
                  type="text"
                  placeholder="Search ancient wisdom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border-2 border-blue-200 focus:border-ocean-blue rounded-lg bg-white/90"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  key="all"
                  variant={selectedCategory === 'all' ? 'secondary' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className={`${
                    selectedCategory === 'all'
                      ? 'bg-ocean-blue text-white'
                      : 'bg-white text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white'
                  } transition-all duration-300`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'secondary' : 'outline'}
                    onClick={() => setSelectedCategory(category || '')}
                    className={`${
                      selectedCategory === category 
                        ? 'bg-gradient-to-r from-ocean-blue to-deep-blue text-white border-ocean-blue' 
                        : 'border-blue-300 text-ocean-blue-dark hover:bg-blue-50'
                    } font-semibold py-2 px-6 rounded-full transition-all duration-300 capitalize`}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    {category === 'all' ? '𓈖 All Stories' : category}
                  </Button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-blue-100 to-blue-100">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up">
              <h2 className="text-4xl font-bold text-center text-ocean-blue-dark mb-12">
                ⭐ Featured Blogs ⭐
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBlogs.slice(0, 3).map((blog: Blog, index: number) => (
                  <AnimatedSection key={blog.id} animation="fade-up" delay={index * 100}>
                    <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-2 border-blue-300 hover:border-ocean-blue overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={blog.mainImageUrl || '/images/default-blog.jpg'}
                          alt={blog.title}
                          fill
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-ocean-blue to-deep-blue text-black px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ Featured
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-ocean-blue-dark mb-3 group-hover:text-ocean-blue-dark transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {blog.author}
                          </div>
                          {blog.readTime && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {blog.readTime} min read
                            </div>
                          )}
                        </div>
                        <PharaohButton 
                          className="w-full text-sm"
                          onClick={() => window.location.href = `/blogs/${blog.slug || blog.id}`}
                        >
                          Read Blog
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </PharaohButton>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* All Blogs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold text-center text-ocean-blue-dark mb-12">
              📜 All Blogs 📜
            </h2>
          </AnimatedSection>

          {filteredBlogs.length === 0 ? (
            <AnimatedSection animation="fade-up">
              <div className="text-center py-16">
                <div className="text-6xl mb-4">𓂀</div>
                <h3 className="text-2xl font-bold text-ocean-blue-dark mb-4">No Blogs Found</h3>
                <p className="text-ocean-blue-dark">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Ancient stories are being written. Please check back soon.'}
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <AnimatedSection key={blog.id} animation="fade-up" delay={index * 100}>
                  <Link href={`/blogs/${blog.slug || blog.id}`}>
                    <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-ocean-blue overflow-hidden h-full cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={blog.mainImageUrl || '/images/default-blog.jpg'}
                          alt={blog.title}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      {blog.category && (
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {blog.category}
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6 flex flex-col h-full">
                      <h3 className="text-lg font-bold text-ocean-blue-dark mb-3 group-hover:text-ocean-blue-dark transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      {blog.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="bg-blue-100 text-ocean-blue-dark text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 3 && (
                              <span className="text-ocean-blue-dark text-xs">+{blog.tags.length - 3}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {blog.author}
                        </div>
                        <div className="flex items-center gap-3">
                          {blog.readTime && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {blog.readTime} min
                            </div>
                          )}
                          {blog.publishedAt && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(blog.publishedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto">
                        <PharaohButton className="w-full text-sm">
                          Read Full Chronicle
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </PharaohButton>
                      </div>
                    </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-ocean-blue-dark via-deep-blue to-navy-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold mb-6">
              Stay Connected to Ancient Wisdom
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Subscribe to receive the latest blogs, travel insights, and exclusive stories 
              from the land of the pharaohs delivered to your inbox.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PharaohButton className="bg-white text-ocean-blue-dark hover:bg-blue-50">
                <BookOpen className="w-5 h-5 mr-2" />
                Subscribe to Newsletter
              </PharaohButton>
              <PharaohButton className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                <Star className="w-5 h-5 mr-2" />
                Follow Our Journey
              </PharaohButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
