"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Trash2,
  Edit,
  Download,
  Eye,
  Copy,
  FolderOpen,
  Image as ImageIcon,
  Link as LinkIcon,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string;
  tags: string[];
  alt?: string;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

const MediaManager: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [externalUrlDialogOpen, setExternalUrlDialogOpen] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [uploadingExternal, setUploadingExternal] = useState(false);

  useEffect(() => {
    fetchFiles();
    fetchCategories();
  }, [selectedCategory, searchQuery]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/admin/media?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      toast.error('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/media/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      toast.success(`Uploaded ${data.files.length} file(s)`);
      fetchFiles();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleExternalUpload = async () => {
    if (!externalUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    setUploadingExternal(true);
    try {
      // First, fetch the file from the external URL
      const response = await fetch(externalUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const filename = externalUrl.split('/').pop() || 'external-file';

      // Create a File object from the blob
      const file = new File([blob], filename, { type: blob.type });

      // Create FormData and upload using the external upload endpoint
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/media/upload-external', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await uploadResponse.json();
      toast.success(`Successfully uploaded file from external URL`);
      fetchFiles();
      setExternalUrl('');
      setExternalUrlDialogOpen(false);
    } catch (error) {
      console.error('External upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload from external URL');
    } finally {
      setUploadingExternal(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');
      
      setFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success('File deleted');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Manager</h1>
          <p className="text-gray-600">Manage your media files and assets</p>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button disabled={uploading} className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </label>

          {/* External URL Upload Dialog */}
          <Dialog open={externalUrlDialogOpen} onOpenChange={setExternalUrlDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={uploadingExternal}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Upload from URL
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload from External URL</DialogTitle>
                <DialogDescription>
                  Enter a URL to upload media from external sources. Supports images, videos, and documents.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="external-url" className="text-sm font-medium">
                    Media URL
                  </label>
                  <Input
                    id="external-url"
                    placeholder="https://example.com/image.jpg"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    disabled={uploadingExternal}
                  />
                  <p className="text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF, WebP, SVG, MP4, WebM, MOV, AVI, PDF, TXT, MP3, WAV, OGG
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setExternalUrlDialogOpen(false)}
                  disabled={uploadingExternal}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExternalUpload}
                  disabled={uploadingExternal || !externalUrl.trim()}
                >
                  {uploadingExternal ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="media-search"
              name="search"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name} ({category.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Files Grid/List */}
      {files.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No files found</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          : "space-y-2"
        }>
          {files.map((file) => (
            <Card key={file.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              {viewMode === 'grid' ? (
                <>
                  {/* Grid View */}
                  <div className="relative aspect-square bg-gray-100">
                    {isImage(file.mimeType) ? (
                      <Image
                        src={file.url}
                        alt={file.alt || file.originalName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => copyUrl(file.url)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteFile(file.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate" title={file.originalName}>
                      {file.originalName}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {file.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </CardContent>
                </>
              ) : (
                /* List View */
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {isImage(file.mimeType) ? (
                        <Image
                          src={file.url}
                          alt={file.alt || file.originalName}
                          width={48}
                          height={48}
                          className="object-cover rounded"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.originalName}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <Badge variant="outline" className="text-xs">
                          {file.category}
                        </Badge>
                        <span>{formatFileSize(file.size)}</span>
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => copyUrl(file.url)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteFile(file.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
export { MediaManager };
