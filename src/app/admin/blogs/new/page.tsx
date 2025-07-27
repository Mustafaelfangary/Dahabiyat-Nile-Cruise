'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Save, ArrowLeft, Plus, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import MediaPicker from '@/components/admin/MediaPicker';

export default function NewBlogPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    mainImageUrl: '',
    heroImageUrl: '',
    author: 'Cleopatra Dahabiyat',
    tags: [''],
    category: '',
    isPublished: false,
    featured: false,
    seoTitle: '',
    seoDescription: '',
  });

  const categories = [
    'Travel Tips',
    'Destinations',
    'Culture & History',
    'Dahabiya Life',
    'Ancient Egypt',
    'Nile River',
    'Temples & Monuments',
    'Local Experiences',
    'Photography',
    'Food & Cuisine'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.filter(t => t.trim()),
        }),
      });

      if (response.ok) {
        const newBlog = await response.json();
        toast.success('Blog created successfully!');
        window.location.href = `/admin/blogs/${newBlog.id}`;
      } else {
        toast.error('Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('Error creating blog');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Loading...</p>
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
        <div className="flex items-center gap-4 mb-8">
          <a
            href="/admin/blogs"
            className="inline-flex items-center gap-2 bg-ocean-blue hover:bg-amber-600 text-black font-bold py-2 px-4 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </a>
          <h1 className="text-3xl font-bold text-amber-800">Create New Ancient Chronicle</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Blog Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Discovering the Secrets of Ancient Temples"
                    required
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="discovering-secrets-ancient-temples"
                    className="border-amber-200 focus:border-amber-400"
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave empty to auto-generate from title</p>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief summary for cards and previews"
                  className="border-amber-200 focus:border-amber-400"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="border-amber-200 focus:border-amber-400">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800">Content</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div>
                <Label htmlFor="content">Blog Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your ancient chronicle here... You can use HTML for formatting."
                  required
                  className="border-amber-200 focus:border-amber-400 min-h-[400px]"
                  rows={20}
                />
                <p className="text-sm text-gray-500 mt-2">
                  You can use HTML tags for formatting: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;blockquote&gt;, etc.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800">Media & Images</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <MediaPicker
                  label="Main Image"
                  value={formData.mainImageUrl}
                  onChange={(value) => setFormData(prev => ({ ...prev, mainImageUrl: value }))}
                  placeholder="/images/blogs/blog-main.jpg"
                  helperText="Select the main image that will be displayed in blog cards and previews"
                  accept="image/*"
                />
              </div>
              <div>
                <MediaPicker
                  label="Hero Background Image"
                  value={formData.heroImageUrl}
                  onChange={(value) => setFormData(prev => ({ ...prev, heroImageUrl: value }))}
                  placeholder="/images/blogs/blog-hero.jpg"
                  helperText="Select the hero background image for the blog post header"
                  accept="image/*"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800">Tags</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      placeholder="e.g., ancient-egypt, temples, history"
                      className="border-amber-200 focus:border-amber-400"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTag(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="border-amber-300 text-amber-800 hover:bg-amber-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tag
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="Leave empty to use blog title"
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="Meta description for search engines"
                  className="border-amber-200 focus:border-amber-400"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-amber-800">Publication Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: !!checked }))}
                />
                <Label htmlFor="isPublished">Publish immediately (visible to public)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                />
                <Label htmlFor="featured">Featured chronicle</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-black flex-1"
            >
              {loading ? (
                <>Creating...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Ancient Chronicle
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (formData.title && formData.content) {
                  // Preview functionality could be added here
                  toast.info('Preview functionality coming soon!');
                } else {
                  toast.error('Please add title and content first');
                }
              }}
              className="border-amber-300 text-amber-800 hover:bg-amber-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.href = '/admin/blogs'}
              className="border-amber-300 text-amber-800 hover:bg-amber-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
