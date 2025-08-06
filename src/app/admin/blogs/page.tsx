'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Edit, Trash2, Eye, Calendar, User, Tag, Clock, Star, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  mainImageUrl?: string;
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

export default function BlogsManagementPage() {
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBlogs();
    }
  }, [status]);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, statusFilter, featuredFilter]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        toast.error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog =>
        statusFilter === 'published' ? blog.isPublished : !blog.isPublished
      );
    }

    // Featured filter
    if (featuredFilter !== 'all') {
      filtered = filtered.filter(blog =>
        featuredFilter === 'featured' ? blog.featured : !blog.featured
      );
    }

    setFilteredBlogs(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } else {
        toast.error('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Error deleting blog');
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isPublished: !isPublished,
          publishedAt: !isPublished ? new Date().toISOString() : null
        }),
      });

      if (response.ok) {
        toast.success(`Blog ${!isPublished ? 'published' : 'unpublished'} successfully`);
        fetchBlogs();
      } else {
        toast.error('Failed to update blog status');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Error updating blog');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Loading Blogs...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <div>Access denied. Please sign in.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="inline-flex items-center gap-2 bg-ocean-blue hover:bg-amber-600 text-black font-bold py-2 px-4 rounded transition-colors"
            >
              ← Back to Dashboard
            </a>
            <h1 className="text-3xl font-bold text-amber-800">📜 Blogs Management</h1>
          </div>
          <Button
            onClick={() => window.location.href = '/admin/blogs/new'}
            className="bg-amber-600 hover:bg-amber-700 text-black shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Blog
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search blogs by title, author, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredBlogs.length} of {blogs.length} blogs
              </span>
              <div className="flex gap-4">
                <span>Published: {blogs.filter(b => b.isPublished).length}</span>
                <span>Featured: {blogs.filter(b => b.featured).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-lg transition-shadow border-2 border-amber-200 hover:border-amber-400">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={blog.mainImageUrl || '/images/default-blog.jpg'}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Status Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {blog.featured && (
                    <Badge className="bg-ocean-blue text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant={blog.isPublished ? 'default' : 'secondary'}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>

                {/* Category */}
                {blog.category && (
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {blog.category}
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                  {blog.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {blog.author}
                  </div>
                  {blog.readTime && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {blog.readTime} min
                    </div>
                  )}
                </div>

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

                {/* Published Date */}
                {blog.publishedAt && (
                  <div className="text-xs text-gray-500 mb-4 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Published: {new Date(blog.publishedAt).toLocaleDateString()}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/blogs/${blog.slug || blog.id}`, '_blank')}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/admin/blogs/${blog.id}`}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublished(blog.id, blog.isPublished)}
                    className={blog.isPublished ? 'text-ocean-blue hover:text-ocean-blue-dark' : 'text-green-600 hover:text-green-700'}
                  >
                    {blog.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty States */}
        {blogs.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-800 mb-4">No Blog Posts Found</h3>
            <p className="text-amber-600 mb-6">Start creating your first blog.</p>
            <Button
              onClick={() => window.location.href = '/admin/blogs/new'}
              className="bg-amber-600 hover:bg-amber-700 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Blog
            </Button>
          </div>
        )}

        {blogs.length > 0 && filteredBlogs.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-800 mb-4">No blogs match your filters</h3>
            <p className="text-amber-600 mb-6">Try adjusting your search terms or filters.</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setFeaturedFilter('all');
              }}
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
