"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload,
  Share2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Camera,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import MediaLibrarySelector from '@/components/admin/MediaLibrarySelector';

interface UserMemory {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  location?: string;
  tripDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MemorySharing() {
  const { data: session } = useSession();
  const [memories, setMemories] = useState<UserMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<UserMemory | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    location: '',
    tripDate: '',
  });

  useEffect(() => {
    if (session) {
      fetchMemories();
    }
  }, [session]);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/memories');
      if (response.ok) {
        const data = await response.json();
        setMemories(data.memories);
      } else {
        toast.error('Failed to load memories');
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
      toast.error('Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (memory?: UserMemory) => {
    if (memory) {
      setEditingMemory(memory);
      setFormData({
        title: memory.title,
        description: memory.description || '',
        imageUrl: memory.imageUrl,
        location: memory.location || '',
        tripDate: memory.tripDate ? memory.tripDate.split('T')[0] : '',
      });
    } else {
      setEditingMemory(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        location: '',
        tripDate: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageUrl) {
      toast.error('Title and image are required');
      return;
    }

    try {
      const url = '/api/user/memories';
      const method = editingMemory ? 'PUT' : 'POST';
      
      const dataToSend = editingMemory 
        ? { id: editingMemory.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success(editingMemory ? 'Memory updated successfully!' : 'Memory shared successfully! It will be reviewed by our team.');
        setDialogOpen(false);
        fetchMemories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save memory');
      }
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error('Failed to save memory');
    }
  };

  const handleDelete = async (memoryId: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    try {
      const response = await fetch('/api/user/memories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: memoryId }),
      });

      if (response.ok) {
        toast.success('Memory deleted successfully!');
        fetchMemories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete memory');
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast.error('Failed to delete memory');
    }
  };

  const handleMediaSelect = (mediaUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl: mediaUrl }));
    setMediaDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-4xl text-egyptian-gold animate-pulse mb-2">𓇳</div>
          <div className="text-gray-600">Loading your memories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hieroglyph-brown flex items-center gap-2">
            <span className="text-egyptian-gold">𓇳</span>
            Share Your Memories
          </h2>
          <p className="text-gray-600 mt-1">
            Share your beautiful travel memories with our community. Approved memories will be featured on our homepage.
          </p>
        </div>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Memory
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-egyptian-gold">𓊪</span>
                {editingMemory ? 'Edit Memory' : 'Share Your Memory'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your memory a title..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us about this special moment..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image *</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Image URL..."
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMediaDialogOpen(true)}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      width={200}
                      height={150}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Where was this taken?"
                />
              </div>

              <div>
                <Label htmlFor="tripDate">Trip Date</Label>
                <Input
                  id="tripDate"
                  type="date"
                  value={formData.tripDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, tripDate: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90">
                  {editingMemory ? 'Update Memory' : 'Share Memory'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Memories Grid */}
      {memories.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl text-egyptian-gold mb-4">𓈖</div>
            <h3 className="text-xl font-semibold text-hieroglyph-brown mb-2">No Memories Yet</h3>
            <p className="text-gray-600 mb-4">
              Start sharing your beautiful travel memories with our community!
            </p>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Your First Memory
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <Card key={memory.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video">
                <Image
                  src={memory.imageUrl}
                  alt={memory.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={`${getStatusColor(memory.status)} border`}>
                    <span className="mr-1">{getStatusIcon(memory.status)}</span>
                    {memory.status}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-hieroglyph-brown mb-2">{memory.title}</h3>
                
                {memory.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{memory.description}</p>
                )}
                
                <div className="space-y-2 text-sm text-gray-500">
                  {memory.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {memory.location}
                    </div>
                  )}
                  
                  {memory.tripDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(memory.tripDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Submitted {new Date(memory.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {memory.adminNotes && memory.status === 'REJECTED' && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Admin Note:</strong> {memory.adminNotes}
                  </div>
                )}

                {memory.status === 'APPROVED' && memory.approvedAt && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                    <strong>Approved:</strong> {new Date(memory.approvedAt).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(memory)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(memory.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Media Library Selector */}
      {mediaDialogOpen && (
        <MediaLibrarySelector
          onSelect={handleMediaSelect}
          onClose={() => setMediaDialogOpen(false)}
        />
      )}
    </div>
  );
}
