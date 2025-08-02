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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star,
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Camera,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import MediaLibrarySelector from '@/components/admin/MediaLibrarySelector';

interface Dahabiya {
  id: string;
  name: string;
  hieroglyph?: string;
}

interface UserReview {
  id: string;
  rating: number;
  comment: string;
  title?: string;
  photos: string[];
  location?: string;
  tripDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  approvedAt?: string;
  isHomepageFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  dahabiya: Dahabiya;
}

export default function ReviewSharing() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);

  const [formData, setFormData] = useState({
    dahabiyaId: '',
    rating: 5,
    title: '',
    comment: '',
    location: '',
    tripDate: '',
    photos: [] as string[],
  });

  useEffect(() => {
    if (session) {
      fetchReviews();
      fetchDahabiyas();
    }
  }, [session]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?userId=${session?.user?.id}&includeAll=true`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      } else {
        toast.error('Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchDahabiyas = async () => {
    try {
      const response = await fetch('/api/dahabiyas');
      if (response.ok) {
        const data = await response.json();
        setDahabiyas(data.dahabiyas || []);
      }
    } catch (error) {
      console.error('Error fetching dahabiyas:', error);
    }
  };

  const handleOpenDialog = (review?: UserReview) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        dahabiyaId: review.dahabiya.id,
        rating: review.rating,
        title: review.title || '',
        comment: review.comment,
        location: review.location || '',
        tripDate: review.tripDate ? review.tripDate.split('T')[0] : '',
        photos: review.photos,
      });
    } else {
      setEditingReview(null);
      setFormData({
        dahabiyaId: '',
        rating: 5,
        title: '',
        comment: '',
        location: '',
        tripDate: '',
        photos: [],
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dahabiyaId || !formData.comment) {
      toast.error('Dahabiya and comment are required');
      return;
    }

    try {
      const url = '/api/reviews';
      const method = editingReview ? 'PUT' : 'POST';
      
      const dataToSend = editingReview 
        ? { id: editingReview.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success(editingReview ? 'Review updated successfully!' : 'Review submitted successfully! It will be reviewed by our team.');
        setDialogOpen(false);
        fetchReviews();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Failed to save review');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: reviewId }),
      });

      if (response.ok) {
        toast.success('Review deleted successfully!');
        fetchReviews();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleMediaSelect = (mediaUrl: string) => {
    setFormData(prev => ({ 
      ...prev, 
      photos: [...prev.photos, mediaUrl] 
    }));
    setMediaDialogOpen(false);
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-egyptian-gold fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-4xl text-egyptian-gold animate-pulse mb-2">𓇳</div>
          <div className="text-gray-600">Loading your reviews...</div>
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
            Share Your Reviews
          </h2>
          <p className="text-gray-600 mt-1">
            Share your experience with our dahabiyas. Approved reviews will be featured on our website.
          </p>
        </div>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Write Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-egyptian-gold">𓊪</span>
                {editingReview ? 'Edit Review' : 'Write Your Review'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="dahabiyaId">Dahabiya *</Label>
                <Select
                  value={formData.dahabiyaId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, dahabiyaId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dahabiya..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dahabiyas.map((dahabiya) => (
                      <SelectItem key={dahabiya.id} value={dahabiya.id}>
                        {dahabiya.hieroglyph && <span className="mr-2">{dahabiya.hieroglyph}</span>}
                        {dahabiya.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rating">Rating *</Label>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          i < formData.rating ? 'text-egyptian-gold fill-current' : 'text-gray-300'
                        } hover:text-egyptian-gold transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your review a title..."
                />
              </div>

              <div>
                <Label htmlFor="comment">Review *</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Where did you travel?"
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
              </div>

              <div>
                <Label>Photos</Label>
                <div className="space-y-2">
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMediaDialogOpen(true)}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photos
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90">
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl text-egyptian-gold mb-4">𓈖</div>
            <h3 className="text-xl font-semibold text-hieroglyph-brown mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-4">
              Share your experience with our dahabiyas and help other travelers!
            </p>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/90"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Write Your First Review
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-egyptian-gold">{review.dahabiya.hieroglyph || '𓇳'}</span>
                      <h3 className="font-semibold text-hieroglyph-brown">{review.dahabiya.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                    {review.title && (
                      <h4 className="font-medium text-gray-800">{review.title}</h4>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getStatusColor(review.status)} border`}>
                      <span className="mr-1">{getStatusIcon(review.status)}</span>
                      {review.status}
                    </Badge>
                    {review.isHomepageFeatured && (
                      <Badge className="bg-egyptian-gold text-hieroglyph-brown">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 line-clamp-3">{review.comment}</p>
                
                {review.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {review.photos.slice(0, 3).map((photo, index) => (
                      <Image
                        key={index}
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  {review.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {review.location}
                    </div>
                  )}
                  
                  {review.tripDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(review.tripDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Submitted {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {review.adminNotes && review.status === 'REJECTED' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Admin Note:</strong> {review.adminNotes}
                  </div>
                )}

                {review.status === 'APPROVED' && review.approvedAt && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                    <strong>Approved:</strong> {new Date(review.approvedAt).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(review)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(review.id)}
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
