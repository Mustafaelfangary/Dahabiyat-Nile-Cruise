'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Tag, Clock, ChevronRight, Search, BookOpen, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

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

const PharaohButton = ({ children, className = '', ...props }: any) => (
  <Button
    className={`relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
    {...props}
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
  </Button>
);

const AnimatedSection = ({ children, animation = 'fade-up', delay = 0 }: any) => (
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
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.filter((blog: Blog) => blog.isPublished));
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(blogs.map(blog => blog.category).filter(Boolean)))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBlogs = blogs.filter(blog => blog.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Loading Ancient Wisdom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/images/hieroglyphic-pattern.png')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-shadow-lg">
                <span className="text-amber-200">𓆎𓅓𓏏𓊖</span> Ancient Chronicles
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-amber-100 leading-relaxed">
                Discover the secrets of the pharaohs, explore hidden treasures, and immerse yourself 
                in the timeless stories of ancient Egypt through our curated collection of articles.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <PharaohButton className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Featured Stories
                </PharaohButton>
                <PharaohButton className="bg-amber-500 hover:bg-amber-600 text-black">
                  <Star className="w-5 h-5 mr-2" />
                  Subscribe to Updates
                </PharaohButton>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white/80 backdrop-blur-sm border-b border-amber-200">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                <Input
                  id="blog-search"
                  name="search"
                  type="text"
                  placeholder="Search ancient wisdom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border-2 border-amber-200 focus:border-amber-400 rounded-lg bg-white/90"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'primary' : 'outline'}
                    onClick={() => setSelectedCategory(category || '')}
                    className={`${
                      selectedCategory === category 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black border-amber-400' 
                        : 'border-amber-300 text-amber-800 hover:bg-amber-50'
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
        <section className="py-16 bg-gradient-to-r from-amber-100 to-orange-100">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up">
              <h2 className="text-4xl font-bold text-center text-amber-800 mb-12">
                ⭐ Featured Chronicles ⭐
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBlogs.slice(0, 3).map((blog, index) => (
                  <AnimatedSection key={blog.id} animation="fade-up" delay={index * 100}>
                    <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-2 border-amber-300 hover:border-amber-500 overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={blog.mainImageUrl || '/images/default-blog.jpg'}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ Featured
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-amber-800 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
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
                          Read Chronicle
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
            <h2 className="text-4xl font-bold text-center text-amber-800 mb-12">
              📜 All Chronicles 📜
            </h2>
          </AnimatedSection>

          {filteredBlogs.length === 0 ? (
            <AnimatedSection animation="fade-up">
              <div className="text-center py-16">
                <div className="text-6xl mb-4">𓂀</div>
                <h3 className="text-2xl font-bold text-amber-800 mb-4">No Chronicles Found</h3>
                <p className="text-amber-600">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Ancient stories are being written. Please check back soon.'}
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <AnimatedSection key={blog.id} animation="fade-up" delay={index * 100}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-2 border-amber-200 hover:border-amber-400 overflow-hidden h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.mainImageUrl || '/images/default-blog.jpg'}
                        alt={blog.title}
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
                      <h3 className="text-lg font-bold text-amber-800 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
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
                              <span key={idx} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 3 && (
                              <span className="text-amber-600 text-xs">+{blog.tags.length - 3}</span>
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

                      <PharaohButton 
                        className="w-full text-sm mt-auto"
                        onClick={() => window.location.href = `/blogs/${blog.slug || blog.id}`}
                      >
                        Read Full Chronicle
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </PharaohButton>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold mb-6">
              Stay Connected to Ancient Wisdom
            </h2>
            <p className="text-xl mb-8 text-amber-100 max-w-2xl mx-auto">
              Subscribe to receive the latest chronicles, travel insights, and exclusive stories 
              from the land of the pharaohs delivered to your inbox.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PharaohButton className="bg-white text-amber-800 hover:bg-amber-50">
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
