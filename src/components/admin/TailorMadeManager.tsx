"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface TailorMadeRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  duration?: string;
  budget?: string;
  interests?: string;
  message: string;
  status: string;
  adminNotes?: string;
  quotedPrice?: number;
  responseMessage?: string;
  respondedAt?: string;
  respondedBy?: string;
  createdAt: string;
  updatedAt: string;
}

const TailorMadeManager: React.FC = () => {
  const [requests, setRequests] = useState<TailorMadeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<TailorMadeRequest | null>(null);
  const [editingRequest, setEditingRequest] = useState<TailorMadeRequest | null>(null);

  const [formData, setFormData] = useState({
    status: '',
    adminNotes: '',
    quotedPrice: '',
    responseMessage: ''
  });

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'warning' },
    { value: 'REVIEWED', label: 'Reviewed', color: 'info' },
    { value: 'QUOTED', label: 'Quoted', color: 'primary' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'success' },
    { value: 'COMPLETED', label: 'Completed', color: 'success' }
  ];

  useEffect(() => {
    loadRequests();
  }, [selectedTab]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const status = selectedTab === 'ALL' ? '' : selectedTab;
      const response = await fetch(`/api/tailor-made?status=${status}`);
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      } else {
        toast.error('Failed to load requests');
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request: TailorMadeRequest) => {
    setViewingRequest(request);
    setEditingRequest(null);
    setDialogOpen(true);
  };

  const handleEditRequest = (request: TailorMadeRequest) => {
    setEditingRequest(request);
    setViewingRequest(null);
    setFormData({
      status: request.status,
      adminNotes: request.adminNotes || '',
      quotedPrice: request.quotedPrice?.toString() || '',
      responseMessage: request.responseMessage || ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setViewingRequest(null);
    setEditingRequest(null);
    setFormData({
      status: '',
      adminNotes: '',
      quotedPrice: '',
      responseMessage: ''
    });
  };

  const handleSaveRequest = async () => {
    if (!editingRequest) return;

    try {
      const response = await fetch(`/api/tailor-made/${editingRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formData.status,
          adminNotes: formData.adminNotes,
          quotedPrice: formData.quotedPrice ? parseFloat(formData.quotedPrice) : null,
          responseMessage: formData.responseMessage
        }),
      });

      if (response.ok) {
        toast.success('Request updated successfully!');
        handleCloseDialog();
        loadRequests();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update request');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tailor-made/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Request deleted successfully!');
        loadRequests();
      } else {
        toast.error('Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption?.color || 'default';
  };

  const getRequestCounts = () => {
    const counts = {
      ALL: requests.length,
      PENDING: requests.filter(r => r.status === 'PENDING').length,
      REVIEWED: requests.filter(r => r.status === 'REVIEWED').length,
      QUOTED: requests.filter(r => r.status === 'QUOTED').length,
      CONFIRMED: requests.filter(r => r.status === 'CONFIRMED').length,
      COMPLETED: requests.filter(r => r.status === 'COMPLETED').length
    };
    return counts;
  };

  const filteredRequests = selectedTab === 'ALL' 
    ? requests 
    : requests.filter(request => request.status === selectedTab);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const counts = getRequestCounts();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" className="font-heading">
          Tailor-Made Requests
        </Typography>
        <Button
          variant="outlined"
          onClick={loadRequests}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Status Tabs */}
      <Box mb={3}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label={
              <Badge badgeContent={counts.ALL} color="primary">
                All Requests
              </Badge>
            } 
            value="ALL" 
          />
          <Tab 
            label={
              <Badge badgeContent={counts.PENDING} color="warning">
                Pending
              </Badge>
            } 
            value="PENDING" 
          />
          <Tab 
            label={
              <Badge badgeContent={counts.REVIEWED} color="info">
                Reviewed
              </Badge>
            } 
            value="REVIEWED" 
          />
          <Tab 
            label={
              <Badge badgeContent={counts.QUOTED} color="primary">
                Quoted
              </Badge>
            } 
            value="QUOTED" 
          />
          <Tab 
            label={
              <Badge badgeContent={counts.CONFIRMED} color="success">
                Confirmed
              </Badge>
            } 
            value="CONFIRMED" 
          />
          <Tab 
            label={
              <Badge badgeContent={counts.COMPLETED} color="success">
                Completed
              </Badge>
            } 
            value="COMPLETED" 
          />
        </Tabs>
      </Box>

      {/* Requests Grid */}
      <Grid container spacing={3}>
        {filteredRequests.map((request) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={request.id}>
            <Card className="h-full">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h2" className="font-semibold">
                    {request.name}
                  </Typography>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status) as any}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <EmailIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <Typography variant="body2" className="text-sm">
                      {request.email}
                    </Typography>
                  </Box>
                  
                  {request.phone && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                      <Typography variant="body2" className="text-sm">
                        {request.phone}
                      </Typography>
                    </Box>
                  )}

                  {request.duration && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <TimeIcon className="w-4 h-4 mr-2 text-gray-500" />
                      <Typography variant="body2" className="text-sm">
                        {request.duration}
                      </Typography>
                    </Box>
                  )}

                  {request.budget && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <MoneyIcon className="w-4 h-4 mr-2 text-gray-500" />
                      <Typography variant="body2" className="text-sm">
                        {request.budget}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2} className="line-clamp-3">
                  {request.message}
                </Typography>

                <Typography variant="caption" color="text.secondary" mb={2}>
                  Submitted: {new Date(request.createdAt).toLocaleDateString()}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <IconButton
                      onClick={() => handleViewRequest(request)}
                      color="primary"
                      size="small"
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditRequest(request)}
                      color="primary"
                      size="small"
                      title="Edit Request"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteRequest(request.id)}
                      color="error"
                      size="small"
                      title="Delete Request"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  {request.quotedPrice && (
                    <Chip
                      label={`$${request.quotedPrice}`}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredRequests.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No {selectedTab.toLowerCase()} requests found
          </Typography>
        </Box>
      )}

      {/* View/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewingRequest ? 'Request Details' : 'Edit Request'}
        </DialogTitle>
        <DialogContent>
          {viewingRequest && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{viewingRequest.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{viewingRequest.email}</Typography>
                </Grid>
                {viewingRequest.phone && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1">{viewingRequest.phone}</Typography>
                  </Grid>
                )}
                {viewingRequest.duration && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                    <Typography variant="body1">{viewingRequest.duration}</Typography>
                  </Grid>
                )}
                {viewingRequest.budget && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Budget</Typography>
                    <Typography variant="body1">{viewingRequest.budget}</Typography>
                  </Grid>
                )}
                {viewingRequest.interests && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Interests</Typography>
                    <Typography variant="body1">{viewingRequest.interests}</Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                  <Typography variant="body1">{viewingRequest.message}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip label={viewingRequest.status} color={getStatusColor(viewingRequest.status) as any} />
                </Grid>
                {viewingRequest.adminNotes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Admin Notes</Typography>
                    <Typography variant="body1">{viewingRequest.adminNotes}</Typography>
                  </Grid>
                )}
                {viewingRequest.responseMessage && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Response Message</Typography>
                    <Typography variant="body1">{viewingRequest.responseMessage}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {editingRequest && (
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      label="Status"
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Admin Notes"
                    value={formData.adminNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, adminNotes: e.target.value }))}
                    multiline
                    rows={3}
                    helperText="Internal notes (not visible to customer)"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quoted Price ($)"
                    type="number"
                    value={formData.quotedPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, quotedPrice: e.target.value }))}
                    helperText="Optional quoted price"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Response Message"
                    value={formData.responseMessage}
                    onChange={(e) => setFormData(prev => ({ ...prev, responseMessage: e.target.value }))}
                    multiline
                    rows={4}
                    helperText="Message to send to customer (will trigger notification)"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            {viewingRequest ? 'Close' : 'Cancel'}
          </Button>
          {editingRequest && (
            <Button onClick={handleSaveRequest} variant="contained" startIcon={<SaveIcon />}>
              Save Changes
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TailorMadeManager;
