'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit, Delete, Add, DirectionsBoat, Star } from '@mui/icons-material';
import DahabiyaMediaPicker from './DahabiyaMediaPicker';

interface Dahabiya {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  cabins?: number;
  crew?: number;
  length?: number;
  width?: number;
  yearBuilt?: number;
  mainImage?: string;
  gallery?: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  features: string[];
  amenities?: string[];
  activities?: string[];
  diningOptions?: string[];
  services?: string[];
  routes?: string[];
  highlights?: string[];
  category?: 'LUXURY' | 'DELUXE' | 'PREMIUM' | 'BOUTIQUE';
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

const DahabiyaManager = () => {
  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDahabiya, setEditingDahabiya] = useState<Dahabiya | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formTab, setFormTab] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    pricePerDay: 0,
    capacity: 0,
    cabins: 0,
    crew: 0,
    length: 0,
    width: 0,
    yearBuilt: 0,
    mainImage: '',
    gallery: [] as string[],
    videoUrl: '',
    virtualTourUrl: '',
    features: '',
    amenities: '',
    activities: '',
    diningOptions: '',
    services: '',
    routes: '',
    highlights: '',
    category: 'DELUXE' as 'LUXURY' | 'DELUXE' | 'PREMIUM' | 'BOUTIQUE',
    isActive: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    tags: '',
  });

  useEffect(() => {
    fetchDahabiyas();
  }, []);

  const fetchDahabiyas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dahabiyas?active=false&limit=100');
      if (!response.ok) throw new Error('Failed to fetch dahabiyas');
      const data = await response.json();
      setDahabiyas(data.dahabiyas || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dahabiyas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (dahabiya?: Dahabiya) => {
    if (dahabiya) {
      setEditingDahabiya(dahabiya);
      setFormData({
        name: dahabiya.name,
        description: dahabiya.description,
        shortDescription: dahabiya.shortDescription || '',
        pricePerDay: dahabiya.pricePerDay,
        capacity: dahabiya.capacity,
        cabins: dahabiya.cabins || 0,
        crew: dahabiya.crew || 0,
        length: dahabiya.length || 0,
        width: dahabiya.width || 0,
        yearBuilt: dahabiya.yearBuilt || 0,
        mainImage: dahabiya.mainImage || '',
        gallery: dahabiya.gallery || [],
        videoUrl: dahabiya.videoUrl || '',
        virtualTourUrl: dahabiya.virtualTourUrl || '',
        features: dahabiya.features.join(', '),
        amenities: dahabiya.amenities?.join(', ') || '',
        activities: dahabiya.activities?.join(', ') || '',
        diningOptions: dahabiya.diningOptions?.join(', ') || '',
        services: dahabiya.services?.join(', ') || '',
        routes: dahabiya.routes?.join(', ') || '',
        highlights: dahabiya.highlights?.join(', ') || '',
        category: dahabiya.category || 'DELUXE',
        isActive: dahabiya.isActive,
        isFeatured: dahabiya.isFeatured || false,
        metaTitle: dahabiya.metaTitle || '',
        metaDescription: dahabiya.metaDescription || '',
        tags: dahabiya.tags?.join(', ') || '',
      });
    } else {
      setEditingDahabiya(null);
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        pricePerDay: 0,
        capacity: 0,
        cabins: 0,
        crew: 0,
        length: 0,
        width: 0,
        yearBuilt: 0,
        mainImage: '',
        gallery: [],
        videoUrl: '',
        virtualTourUrl: '',
        features: '',
        amenities: '',
        activities: '',
        diningOptions: '',
        services: '',
        routes: '',
        highlights: '',
        category: 'DELUXE',
        isActive: true,
        isFeatured: false,
        metaTitle: '',
        metaDescription: '',
        tags: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDahabiya(null);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        ...formData,
        gallery: Array.isArray(formData.gallery) ? formData.gallery : [],
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        amenities: formData.amenities.split(',').map(f => f.trim()).filter(Boolean),
        activities: formData.activities.split(',').map(f => f.trim()).filter(Boolean),
        diningOptions: formData.diningOptions.split(',').map(f => f.trim()).filter(Boolean),
        services: formData.services.split(',').map(f => f.trim()).filter(Boolean),
        routes: formData.routes.split(',').map(f => f.trim()).filter(Boolean),
        highlights: formData.highlights.split(',').map(f => f.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(f => f.trim()).filter(Boolean),
      };

      const url = editingDahabiya
        ? `/api/dahabiyas/${editingDahabiya.id}`
        : '/api/dahabiyas';

      const method = editingDahabiya ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save dahabiya');
      }

      await fetchDahabiyas();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save dahabiya');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dahabiya?')) return;

    try {
      const response = await fetch(`/api/dahabiyas/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete dahabiya');
      await fetchDahabiyas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete dahabiya');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h4" component="h1">
          <DirectionsBoat style={{ marginRight: '8px', color: '#D4AF37' }} />
          Sacred Fleet Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          style={{ backgroundColor: '#1976d2' }}
        >
          Add New Dahabiya
        </Button>
      </div>

      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price/Day</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dahabiyas.map((dahabiya) => (
              <TableRow key={dahabiya.id}>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Typography variant="subtitle2">
                      {dahabiya.name}
                    </Typography>
                    {dahabiya.isFeatured && (
                      <Star style={{ color: '#FFD700', fontSize: '16px' }} />
                    )}
                  </div>
                  <Typography variant="caption" color="text.secondary">
                    /{dahabiya.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={dahabiya.category || 'DELUXE'}
                    size="small"
                    style={{
                      backgroundColor:
                        (dahabiya.category || 'DELUXE') === 'LUXURY' ? '#e3f2fd' :
                        (dahabiya.category || 'DELUXE') === 'DELUXE' ? '#f3e5f5' :
                        (dahabiya.category || 'DELUXE') === 'PREMIUM' ? '#e8f5e8' :
                        '#fff3e0',
                      color:
                        (dahabiya.category || 'DELUXE') === 'LUXURY' ? '#1976d2' :
                        (dahabiya.category || 'DELUXE') === 'DELUXE' ? '#7b1fa2' :
                        (dahabiya.category || 'DELUXE') === 'PREMIUM' ? '#388e3c' :
                        '#f57c00'
                    }}
                  />
                </TableCell>
                <TableCell>{formatPrice(dahabiya.pricePerDay)}</TableCell>
                <TableCell>
                  {dahabiya.capacity} guests
                  {dahabiya.cabins && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {dahabiya.cabins} cabins
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {(dahabiya.rating || 0) > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star style={{ color: '#FFD700', fontSize: '16px' }} />
                      <Typography variant="body2">
                        {(dahabiya.rating || 0).toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({dahabiya.reviewCount || 0})
                      </Typography>
                    </div>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No reviews
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={dahabiya.isActive ? 'Active' : 'Inactive'}
                    color={dahabiya.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(dahabiya)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(dahabiya.id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DirectionsBoat style={{ color: '#D4AF37' }} />
          {editingDahabiya ? 'Edit Sacred Vessel' : 'Add New Sacred Vessel'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          )}

          <Tabs value={formTab} onChange={(e, newValue) => setFormTab(newValue)} style={{ marginBottom: '24px' }}>
            <Tab label="Basic Info" />
            <Tab label="Specifications" />
            <Tab label="Media & Content" />
            <Tab label="Features & Amenities" />
            <Tab label="SEO & Marketing" />
          </Tabs>

          <div style={{ marginTop: '16px' }}>
            {/* Tab 0: Basic Info */}
            {formTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Short Description"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    fullWidth
                    placeholder="Brief description for cards and previews"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Full Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={4}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Price per Day (USD)"
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      label="Category"
                    >
                      <MenuItem value="LUXURY">Luxury</MenuItem>
                      <MenuItem value="DELUXE">Deluxe</MenuItem>
                      <MenuItem value="PREMIUM">Premium</MenuItem>
                      <MenuItem value="BOUTIQUE">Boutique</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                    }
                    label="Active"
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      />
                    }
                    label="Featured"
                  />
                </Grid>
              </Grid>
            )}

            {/* Tab 1: Specifications */}
            {formTab === 1 && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Capacity (guests)"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Number of Cabins"
                    type="number"
                    value={formData.cabins}
                    onChange={(e) => setFormData({ ...formData, cabins: Number(e.target.value) })}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Crew Members"
                    type="number"
                    value={formData.crew}
                    onChange={(e) => setFormData({ ...formData, crew: Number(e.target.value) })}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Year Built"
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => setFormData({ ...formData, yearBuilt: Number(e.target.value) })}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Length (meters)"
                    type="number"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Width (meters)"
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {/* Tab 2: Media & Content */}
            {formTab === 2 && (
              <Grid container spacing={4}>
                {/* Main Image */}
                <Grid item xs={12}>
                  <DahabiyaMediaPicker
                    label="Main Image"
                    value={formData.mainImage}
                    onChange={(value) => setFormData({ ...formData, mainImage: value as string })}
                    type="single"
                    accept="image/*"
                    helperText="Select the primary image that will be displayed as the main photo for this dahabiya"
                  />
                </Grid>

                {/* Gallery Images */}
                <Grid item xs={12}>
                  <DahabiyaMediaPicker
                    label="Gallery Images"
                    value={formData.gallery}
                    onChange={(value) => setFormData({ ...formData, gallery: value as string[] })}
                    type="multiple"
                    accept="image/*"
                    helperText="Add multiple images to showcase different views and features of the dahabiya"
                    maxItems={15}
                  />
                </Grid>

                {/* Video and Virtual Tour URLs */}
                <Grid item xs={6}>
                  <TextField
                    label="Video URL"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    fullWidth
                    placeholder="https://youtube.com/watch?v=..."
                    helperText="YouTube or Vimeo video URL"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Virtual Tour URL"
                    value={formData.virtualTourUrl}
                    onChange={(e) => setFormData({ ...formData, virtualTourUrl: e.target.value })}
                    fullWidth
                    placeholder="https://virtualtour.example.com"
                    helperText="360° virtual tour link"
                  />
                </Grid>

                {/* Routes and Highlights */}
                <Grid item xs={12}>
                  <TextField
                    label="Routes (comma-separated)"
                    value={formData.routes}
                    onChange={(e) => setFormData({ ...formData, routes: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Luxor to Aswan Classic, Extended Nile Journey, Cultural Heritage Route"
                    helperText="Available cruise routes and itineraries"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Highlights (comma-separated)"
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Valley of the Kings, Karnak Temple, Philae Temple, Abu Simbel"
                    helperText="Key attractions and destinations visited"
                  />
                </Grid>
              </Grid>
            )}

            {/* Tab 3: Features & Amenities */}
            {formTab === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Features (comma-separated)"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Luxury Suites, Sun Deck, Traditional Sailing"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Amenities (comma-separated)"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Air Conditioning, Private Bathrooms, WiFi"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Activities (comma-separated)"
                    value={formData.activities}
                    onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Cultural Tours, Cooking Classes, Stargazing"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Dining Options (comma-separated)"
                    value={formData.diningOptions}
                    onChange={(e) => setFormData({ ...formData, diningOptions: e.target.value })}
                    fullWidth
                    placeholder="Fine Dining Restaurant, Sunset Bar"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Services (comma-separated)"
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    fullWidth
                    placeholder="24/7 Concierge, Laundry Service"
                  />
                </Grid>
              </Grid>
            )}

            {/* Tab 4: SEO & Marketing */}
            {formTab === 4 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Meta Title"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    fullWidth
                    placeholder="SEO title for search engines"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Meta Description"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="SEO description for search engines"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Tags (comma-separated)"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    fullWidth
                    placeholder="luxury, nile cruise, egypt, traditional"
                  />
                </Grid>
              </Grid>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : (editingDahabiya ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DahabiyaManager;
