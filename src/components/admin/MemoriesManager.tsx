"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
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
  Image as ImageIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

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
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
}

export default function MemoriesManager() {
  const [memories, setMemories] = useState<UserMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<UserMemory | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchMemories();
  }, []);

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

  const handleReview = (memory: UserMemory) => {
    setSelectedMemory(memory);
    setAdminNotes(memory.adminNotes || '');
    setReviewDialogOpen(true);
  };

  const handleApprove = async (memoryId: string, notes?: string) => {
    try {
      const response = await fetch('/api/user/memories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: memoryId,
          status: 'APPROVED',
          adminNotes: notes,
        }),
      });

      if (response.ok) {
        toast.success('Memory approved successfully!');
        setReviewDialogOpen(false);
        fetchMemories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to approve memory');
      }
    } catch (error) {
      console.error('Error approving memory:', error);
      toast.error('Failed to approve memory');
    }
  };

  const handleReject = async (memoryId: string, notes: string) => {
    if (!notes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await fetch('/api/user/memories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: memoryId,
          status: 'REJECTED',
          adminNotes: notes,
        }),
      });

      if (response.ok) {
        toast.success('Memory rejected');
        setReviewDialogOpen(false);
        fetchMemories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to reject memory');
      }
    } catch (error) {
      console.error('Error rejecting memory:', error);
      toast.error('Failed to reject memory');
    }
  };

  const handleDelete = async (memoryId: string) => {
    if (!confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
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

  const filterMemoriesByStatus = (status?: string) => {
    if (!status) return memories;
    return memories.filter(memory => memory.status === status);
  };

  const pendingMemories = filterMemoriesByStatus('PENDING');
  const approvedMemories = filterMemoriesByStatus('APPROVED');
  const rejectedMemories = filterMemoriesByStatus('REJECTED');

  const getTabMemories = () => {
    switch (activeTab) {
      case 0:
        return pendingMemories;
      case 1:
        return approvedMemories;
      case 2:
        return rejectedMemories;
      default:
        return memories;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading memories...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          User Memories Management
        </Typography>
        <Box display="flex" gap={2}>
          <Chip
            label={`${pendingMemories.length} Pending`}
            color="warning"
            variant="outlined"
          />
          <Chip
            label={`${approvedMemories.length} Approved`}
            color="success"
            variant="outlined"
          />
          <Chip
            label={`${rejectedMemories.length} Rejected`}
            color="error"
            variant="outlined"
          />
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={`Pending Review (${pendingMemories.length})`} />
        <Tab label={`Approved (${approvedMemories.length})`} />
        <Tab label={`Rejected (${rejectedMemories.length})`} />
        <Tab label={`All (${memories.length})`} />
      </Tabs>

      {getTabMemories().length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No memories found
            </Typography>
            <Typography color="text.secondary">
              {activeTab === 0 && 'No memories pending review'}
              {activeTab === 1 && 'No approved memories'}
              {activeTab === 2 && 'No rejected memories'}
              {activeTab === 3 && 'No memories submitted yet'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {getTabMemories().map((memory) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={memory.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={memory.imageUrl}
                  alt={memory.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="between" alignItems="start" mb={2}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {memory.title}
                    </Typography>
                    <Chip
                      label={memory.status}
                      color={getStatusColor(memory.status) as any}
                      size="small"
                    />
                  </Box>

                  {memory.description && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {memory.description}
                    </Typography>
                  )}

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Avatar
                      src={memory.user.image || undefined}
                      sx={{ width: 24, height: 24 }}
                    >
                      <Person />
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {memory.user.name || memory.user.email}
                    </Typography>
                  </Box>

                  {memory.location && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {memory.location}
                      </Typography>
                    </Box>
                  )}

                  {memory.tripDate && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(memory.tripDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Submitted: {new Date(memory.createdAt).toLocaleDateString()}
                  </Typography>

                  {memory.adminNotes && (
                    <Box mt={2} p={1} bgcolor="grey.100" borderRadius={1}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Admin Notes:</strong> {memory.adminNotes}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    {memory.status === 'PENDING' ? (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(memory.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleReview(memory)}
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
                          onClick={() => handleReview(memory)}
                        >
                          View
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(memory.id)}
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
      >
        <DialogTitle>
          Review Memory: {selectedMemory?.title}
        </DialogTitle>
        <DialogContent>
          {selectedMemory && (
            <Box>
              <Box display="flex" justifyContent="center" mb={3}>
                <img
                  src={selectedMemory.imageUrl}
                  alt={selectedMemory.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                {selectedMemory.title}
              </Typography>

              {selectedMemory.description && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedMemory.description}
                </Typography>
              )}

              <Box display="flex" gap={2} mb={2}>
                {selectedMemory.location && (
                  <Chip
                    icon={<LocationOn />}
                    label={selectedMemory.location}
                    variant="outlined"
                    size="small"
                  />
                )}
                {selectedMemory.tripDate && (
                  <Chip
                    icon={<CalendarToday />}
                    label={new Date(selectedMemory.tripDate).toLocaleDateString()}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Avatar src={selectedMemory.user.image || undefined}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {selectedMemory.user.name || 'Anonymous User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedMemory.user.email}
                  </Typography>
                </Box>
              </Box>

              <TextField
                label="Admin Notes"
                multiline
                rows={3}
                fullWidth
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this memory (required for rejection)..."
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>
            Cancel
          </Button>
          {selectedMemory?.status === 'PENDING' && (
            <>
              <Button
                color="error"
                onClick={() => selectedMemory && handleReject(selectedMemory.id, adminNotes)}
                disabled={!adminNotes.trim()}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => selectedMemory && handleApprove(selectedMemory.id, adminNotes)}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
