"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Avatar,
  Rating,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Edit,
  Delete,
  Person,
  CalendarToday,
  LocationOn,
  Star,
  StarBorder,
  Image as ImageIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

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
  approvedBy?: string;
  isHomepageFeatured: boolean;
  homepageOrder?: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
  dahabiya: {
    id: string;
    name: string;
    hieroglyph?: string;
  };
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isHomepageFeatured, setIsHomepageFeatured] = useState(false);
  const [homepageOrder, setHomepageOrder] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews?includeAll=true');
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

  const handleReview = (review: UserReview) => {
    setSelectedReview(review);
    setAdminNotes(review.adminNotes || '');
    setIsHomepageFeatured(review.isHomepageFeatured);
    setHomepageOrder(review.homepageOrder || null);
    setReviewDialogOpen(true);
  };

  const handleApprove = async (reviewId: string, notes?: string, featured = false, order?: number) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reviewId,
          status: 'APPROVED',
          adminNotes: notes,
          isHomepageFeatured: featured,
          homepageOrder: order,
        }),
      });

      if (response.ok) {
        toast.success('Review approved successfully!');
        setReviewDialogOpen(false);
        fetchReviews();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to approve review');
      }
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (reviewId: string, notes: string) => {
    if (!notes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reviewId,
          status: 'REJECTED',
          adminNotes: notes,
          isHomepageFeatured: false,
          homepageOrder: null,
        }),
      });

      if (response.ok) {
        toast.success('Review rejected');
        setReviewDialogOpen(false);
        fetchReviews();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to reject review');
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.error('Failed to reject review');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'warning';
    }
  };

  const filterReviewsByStatus = (status?: string) => {
    if (!status) return reviews;
    return reviews.filter(review => review.status === status);
  };

  const pendingReviews = filterReviewsByStatus('PENDING');
  const approvedReviews = filterReviewsByStatus('APPROVED');
  const rejectedReviews = filterReviewsByStatus('REJECTED');
  const featuredReviews = reviews.filter(review => review.isHomepageFeatured);

  const getTabReviews = () => {
    switch (activeTab) {
      case 0:
        return pendingReviews;
      case 1:
        return approvedReviews;
      case 2:
        return rejectedReviews;
      case 3:
        return featuredReviews;
      default:
        return reviews;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading reviews...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Reviews Management
        </Typography>
        <Box display="flex" gap={2}>
          <Chip
            label={`${pendingReviews.length} Pending`}
            color="warning"
            variant="outlined"
          />
          <Chip
            label={`${approvedReviews.length} Approved`}
            color="success"
            variant="outlined"
          />
          <Chip
            label={`${featuredReviews.length} Featured`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={`Pending Review (${pendingReviews.length})`} />
        <Tab label={`Approved (${approvedReviews.length})`} />
        <Tab label={`Rejected (${rejectedReviews.length})`} />
        <Tab label={`Featured (${featuredReviews.length})`} />
        <Tab label={`All (${reviews.length})`} />
      </Tabs>

      {getTabReviews().length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Star sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No reviews found
            </Typography>
            <Typography color="text.secondary">
              {activeTab === 0 && 'No reviews pending approval'}
              {activeTab === 1 && 'No approved reviews'}
              {activeTab === 2 && 'No rejected reviews'}
              {activeTab === 3 && 'No featured reviews'}
              {activeTab === 4 && 'No reviews submitted yet'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {getTabReviews().map((review) => (
            <Grid item xs={12} md={6} lg={4} key={review.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="between" alignItems="start" mb={2}>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <span style={{ fontSize: '1.2rem' }}>{review.dahabiya.hieroglyph || '𓇳'}</span>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {review.dahabiya.name}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" />
                      {review.title && (
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {review.title}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1} alignItems="end">
                      <Chip
                        label={review.status}
                        color={getStatusColor(review.status) as any}
                        size="small"
                      />
                      {review.isHomepageFeatured && (
                        <Chip
                          icon={<Star />}
                          label="Featured"
                          color="primary"
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {review.comment.length > 150 
                      ? `${review.comment.substring(0, 150)}...` 
                      : review.comment
                    }
                  </Typography>

                  {review.photos.length > 0 && (
                    <Box display="flex" gap={1} mb={2}>
                      {review.photos.slice(0, 3).map((photo, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      ))}
                      {review.photos.length > 3 && (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            width: 50,
                            height: 50,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                          }}
                        >
                          +{review.photos.length - 3}
                        </Box>
                      )}
                    </Box>
                  )}

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Avatar
                      src={review.user.image || undefined}
                      sx={{ width: 24, height: 24 }}
                    >
                      <Person />
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {review.user.name || review.user.email}
                    </Typography>
                  </Box>

                  {review.location && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {review.location}
                      </Typography>
                    </Box>
                  )}

                  {review.tripDate && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.tripDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Submitted: {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>

                  {review.adminNotes && (
                    <Box mt={2} p={1} bgcolor="grey.100" borderRadius={1}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Admin Notes:</strong> {review.adminNotes}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    {review.status === 'PENDING' ? (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(review.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleReview(review)}
                        >
                          Review
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleReview(review)}
                        >
                          View
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(review.id)}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            backgroundImage: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }
        }}
      >
        <DialogTitle style={{
          backgroundColor: '#0080ff',
          color: 'white',
          borderBottom: '1px solid #e0e0e0'
        }}>
          Review: {selectedReview?.dahabiya.name}
        </DialogTitle>
        <DialogContent style={{
          backgroundColor: '#ffffff',
          padding: '24px'
        }}>
          {selectedReview && (
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar src={selectedReview.user.image || undefined}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {selectedReview.user.name || 'Anonymous User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedReview.user.email}
                  </Typography>
                </Box>
                <Box ml="auto">
                  <Rating value={selectedReview.rating} readOnly />
                </Box>
              </Box>

              {selectedReview.title && (
                <Typography variant="h6" gutterBottom>
                  {selectedReview.title}
                </Typography>
              )}

              <Typography variant="body1" gutterBottom>
                {selectedReview.comment}
              </Typography>

              {selectedReview.photos.length > 0 && (
                <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                  {selectedReview.photos.map((photo, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </Box>
              )}

              <Box display="flex" gap={2} mb={2}>
                {selectedReview.location && (
                  <Chip
                    icon={<LocationOn />}
                    label={selectedReview.location}
                    variant="outlined"
                    size="small"
                  />
                )}
                {selectedReview.tripDate && (
                  <Chip
                    icon={<CalendarToday />}
                    label={new Date(selectedReview.tripDate).toLocaleDateString()}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>

              <TextField
                label="Admin Notes"
                multiline
                rows={3}
                fullWidth
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this review (required for rejection)..."
                sx={{ mt: 2, mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={isHomepageFeatured}
                    onChange={(e) => setIsHomepageFeatured(e.target.checked)}
                  />
                }
                label="Feature on Homepage"
                sx={{ mb: 2 }}
              />

              {isHomepageFeatured && (
                <TextField
                  label="Homepage Order"
                  type="number"
                  value={homepageOrder || ''}
                  onChange={(e) => setHomepageOrder(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Order for homepage display (lower numbers appear first)"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>
            Cancel
          </Button>
          {selectedReview?.status === 'PENDING' && (
            <>
              <Button
                color="error"
                onClick={() => selectedReview && handleReject(selectedReview.id, adminNotes)}
                disabled={!adminNotes.trim()}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => selectedReview && handleApprove(selectedReview.id, adminNotes, isHomepageFeatured, homepageOrder || undefined)}
              >
                Approve
              </Button>
            </>
          )}
          {selectedReview?.status === 'APPROVED' && (
            <Button
              variant="contained"
              onClick={() => selectedReview && handleApprove(selectedReview.id, adminNotes, isHomepageFeatured, homepageOrder || undefined)}
            >
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
