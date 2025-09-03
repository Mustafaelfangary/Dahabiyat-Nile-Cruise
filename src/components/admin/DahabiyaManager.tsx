'use client';

import React, { useState, useEffect } from 'react';

// Add CSS for spacing utilities
const styles = `
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }
  .grid {
    display: grid;
  }
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .gap-4 {
    gap: 1rem;
  }
  .gap-6 {
    gap: 1.5rem;
  }
  @media (min-width: 768px) {
    .md\\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Box,
  Checkbox,
  ListItemText,
  Card,
  CardContent
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
  specificationsImage?: string;
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
  isActive: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  documents?: PDFDocument[];
  createdAt: string;
  updatedAt: string;
}

interface PDFDocument {
  id?: string;
  name: string;
  type: 'FACTSHEET' | 'BROCHURE' | 'SPECIFICATION';
  url: string;
  size: number;
}

interface Itinerary {
  id: string;
  name: string;
  description: string;
  duration: number;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

const DahabiyaManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    specificationsImage: '',
    videoUrl: '',
    virtualTourUrl: '',
    features: '',
    amenities: '',
    activities: '',
    diningOptions: '',
    services: '',
    routes: '',
    highlights: '',
    category: 'DELUXE' as const,
    isActive: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    tags: '',
    documents: [] as PDFDocument[],
    selectedItineraries: [] as string[],
  });

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    fetchDahabiyas();
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await fetch('/api/itineraries');
      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
      }
    } catch (err) {
      console.error('Error fetching itineraries:', err);
    }
  };

  const fetchDahabiyas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/dahabiyas?limit=100'); // Get more dahabiyas for admin view
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Dahabiyas API error:', errorData); // Debug log
        throw new Error(errorData.error || `Failed to fetch dahabiyas (${response.status})`);
      }
      const data = await response.json();
      console.log('Dahabiyas API response:', data); // Debug log
      // The API returns { dahabiyas: [...], total, pages, currentPage }
      setDahabiyas(data.dahabiyas || data);
    } catch (err) {
      console.error('Error fetching dahabiyas:', err);
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
        specificationsImage: dahabiya.specificationsImage || '',
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
        selectedItineraries: [],
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
        specificationsImage: '',
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
        selectedItineraries: [],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDahabiya(null);
    setError(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'FACTSHEET' | 'BROCHURE' | 'SPECIFICATION') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/admin/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      const newDocument: PDFDocument = {
        name: file.name,
        type: type,
        url: result.url,
        size: file.size,
      };

      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument]
      }));

    } catch (error) {
      console.error('File upload error:', error);
      setError('Failed to upload file. Please try again.');
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        amenities: formData.amenities.split(',').map(f => f.trim()).filter(Boolean),
        activities: formData.activities.split(',').map(f => f.trim()).filter(Boolean),
        diningOptions: formData.diningOptions.split(',').map(f => f.trim()).filter(Boolean),
        services: formData.services.split(',').map(f => f.trim()).filter(Boolean),
        routes: formData.routes.split(',').map(f => f.trim()).filter(Boolean),
        highlights: formData.highlights.split(',').map(f => f.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(f => f.trim()).filter(Boolean),
      };

      const url = editingDahabiya ? `/api/dahabiyas/${editingDahabiya.id}` : '/api/dahabiyas';
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
          <DirectionsBoat style={{ marginRight: '8px', color: '#0080ff' }} />
          Sacred Fleet Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          style={{ backgroundColor: '#0080ff', color: 'white' }}
        >
          Add New Dahabiya
        </Button>
      </div>

      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Table>
          <TableHead style={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Capacity</strong></TableCell>
              <TableCell><strong>Price/Day</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Featured</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dahabiyas.map((dahabiya) => (
              <TableRow key={dahabiya.id} hover>
                <TableCell>
                  <div>
                    <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                      {dahabiya.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {dahabiya.shortDescription}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    label={dahabiya.category}
                    size="small"
                    style={{
                      backgroundColor: dahabiya.category === 'LUXURY' ? '#e3f2fd' :
                                     dahabiya.category === 'DELUXE' ? '#f3e5f5' :
                                     dahabiya.category === 'PREMIUM' ? '#e0e7ff' : '#e1f5fe',
                      color: dahabiya.category === 'LUXURY' ? '#1976d2' :
                             dahabiya.category === 'DELUXE' ? '#7b1fa2' :
                             dahabiya.category === 'PREMIUM' ? '#6366f1' : '#0277bd'
                    }}
                  />
                </TableCell>
                <TableCell>{dahabiya.capacity} guests</TableCell>
                <TableCell>{formatPrice(dahabiya.pricePerDay)}</TableCell>
                <TableCell>
                  <Chip
                    label={dahabiya.isActive ? 'Active' : 'Inactive'}
                    color={dahabiya.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {dahabiya.isFeatured && <Star style={{ color: '#3399ff' }} />}
                </TableCell>
                <TableCell>
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          className: 'admin-dialog-paper',
          style: {
            backgroundColor: '#ffffff !important',
            backgroundImage: 'none !important',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12) !important',
            zIndex: 1300,
            opacity: '1 !important',
            position: 'relative',
          }
        }}
        BackdropProps={{
          className: 'admin-dialog-backdrop',
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.9) !important',
            backdropFilter: 'blur(8px) !important',
            zIndex: 1299,
          }
        }}
      >
        <DialogTitle
          className="admin-dialog-title"
          style={{
            backgroundColor: '#0080ff !important',
            color: 'white !important',
            borderBottom: '1px solid #e0e0e0 !important',
            opacity: 1,
            zIndex: 1301,
          }}
        >
          <DirectionsBoat style={{ marginRight: '8px' }} />
          {editingDahabiya ? 'Edit Dahabiya' : 'Add New Dahabiya'}
        </DialogTitle>
        <DialogContent
          className="admin-dialog-content"
          style={{
            backgroundColor: '#ffffff !important',
            padding: '0 !important',
            opacity: '1 !important',
            zIndex: 1301,
            position: 'relative',
          }}
        >
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            minHeight: '100%',
            position: 'relative',
            zIndex: 1,
          }}>
            {error && (
              <Alert severity="error" style={{ marginBottom: '16px' }}>
                {error}
              </Alert>
            )}

          <Tabs
            value={formTab}
            onChange={(_, newValue) => setFormTab(newValue)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            style={{ marginBottom: '16px' }}
          >
            <Tab label={isMobile ? "Basic" : "Basic Information"} />
            <Tab label={isMobile ? "Specs" : "Specifications"} />
            <Tab label={isMobile ? "Media" : "Media & Content"} />
            <Tab label={isMobile ? "Files" : "Documents & Files"} />
            <Tab label={isMobile ? "Features" : "Features & Amenities"} />
            <Tab label={isMobile ? "Routes" : "Itineraries"} />
            <Tab label={isMobile ? "SEO" : "SEO & Marketing"} />
          </Tabs>

          <div style={{ marginTop: '16px' }}>
            {/* Tab 0: Basic Info */}
            {formTab === 0 && (
              <div className="space-y-6">
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  required
                />

                <TextField
                  label="Short Description"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  fullWidth
                  placeholder="Brief description for cards and previews"
                />

                <TextField
                  label="Full Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Price per Day (USD)"
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                    fullWidth
                    required
                  />

                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as 'LUXURY' | 'DELUXE' | 'PREMIUM' | 'BOUTIQUE' })}
                      label="Category"
                    >
                      <MenuItem value="LUXURY">Luxury</MenuItem>
                      <MenuItem value="DELUXE">Deluxe</MenuItem>
                      <MenuItem value="PREMIUM">Premium</MenuItem>
                      <MenuItem value="BOUTIQUE">Boutique</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                    }
                    label="Active"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      />
                    }
                    label="Featured"
                  />
                </div>
              </div>
            )}

            {/* Tab 1: Specifications */}
            {formTab === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Capacity (guests)"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  fullWidth
                  required
                />

                <TextField
                  label="Number of Cabins"
                  type="number"
                  value={formData.cabins}
                  onChange={(e) => setFormData({ ...formData, cabins: Number(e.target.value) })}
                  fullWidth
                />

                <TextField
                  label="Crew Members"
                  type="number"
                  value={formData.crew}
                  onChange={(e) => setFormData({ ...formData, crew: Number(e.target.value) })}
                  fullWidth
                />

                <TextField
                  label="Year Built"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({ ...formData, yearBuilt: Number(e.target.value) })}
                  fullWidth
                />

                <TextField
                  label="Length (meters)"
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                  fullWidth
                />

                <TextField
                  label="Width (meters)"
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                  fullWidth
                />
              </div>
            )}

            {/* Tab 2: Media & Content */}
            {formTab === 2 && (
              <div className="space-y-6">
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#0080ff' }}>
                    Main Image
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select the primary image that will be displayed as the main photo for this dahabiya
                  </Typography>
                </Box>
                <DahabiyaMediaPicker
                  label="Main Image"
                  value={formData.mainImage}
                  onChange={(value) => {
                    console.log('🖼️ Main image changed:', value);
                    setFormData({ ...formData, mainImage: value });
                  }}
                  type="single"
                  accept="image/*"
                  helperText="Click to select or change the main image"
                />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#0080ff' }}>
                    Gallery Images
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add multiple images to showcase different aspects of the dahabiya
                  </Typography>
                </Box>
                <DahabiyaMediaPicker
                  label="Gallery Images"
                  value={formData.gallery}
                  onChange={(value) => {
                    console.log('🖼️ Gallery changed:', value);
                    setFormData({ ...formData, gallery: Array.isArray(value) ? value : [value] });
                  }}
                  type="multiple"
                  accept="image/*"
                  helperText="Click to add more images to the gallery"
                  maxItems={15}
                />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#0080ff' }}>
                    Specifications & Dimensions Chart
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload a detailed specifications chart or floor plan image with pharaonic styling 𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿
                  </Typography>
                </Box>
                <DahabiyaMediaPicker
                  label="Specifications Chart Image"
                  value={formData.specificationsImage}
                  onChange={(value) => {
                    console.log('📊 Specifications image changed:', value);
                    setFormData({ ...formData, specificationsImage: value });
                  }}
                  type="single"
                  accept="image/*"
                  helperText="Upload vessel specifications, floor plan, or dimensions chart"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Video URL"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    fullWidth
                    placeholder="https://youtube.com/watch?v=..."
                    helperText="YouTube or Vimeo video URL"
                  />

                  <TextField
                    label="Virtual Tour URL"
                    value={formData.virtualTourUrl}
                    onChange={(e) => setFormData({ ...formData, virtualTourUrl: e.target.value })}
                    fullWidth
                    placeholder="https://virtualtour.example.com"
                    helperText="360° virtual tour link"
                  />
                </div>

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
              </div>
            )}

            {/* Tab 3: Documents & Files */}
            {formTab === 3 && (
              <div className="space-y-6">
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#0080ff' }}>
                    Factsheet & Brochures
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload PDF documents like factsheets, brochures, and specifications for this dahabiya
                  </Typography>
                </Box>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#0080ff' }}>
                      Factsheet PDF
                    </Typography>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'FACTSHEET')}
                      style={{ marginBottom: '8px' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Upload the main factsheet PDF for this dahabiya
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#0080ff' }}>
                      Brochure PDF
                    </Typography>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'BROCHURE')}
                      style={{ marginBottom: '8px' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Upload marketing brochure or detailed information PDF
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#0080ff' }}>
                      Specifications PDF
                    </Typography>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'SPECIFICATION')}
                      style={{ marginBottom: '8px' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Upload technical specifications and deck plans
                    </Typography>
                  </div>
                </div>

                {/* Display uploaded documents */}
                {formData.documents && formData.documents.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#0080ff' }}>
                      Uploaded Documents
                    </Typography>
                    <div className="space-y-2">
                      {formData.documents.map((doc, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          backgroundColor: '#f9f9f9'
                        }}>
                          <div>
                            <Typography variant="body2" fontWeight="medium">
                              {doc.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {doc.type} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                            </Typography>
                          </div>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeDocument(index)}
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  </Box>
                )}
              </div>
            )}

            {/* Tab 4: Features & Amenities */}
            {formTab === 4 && (
              <div className="space-y-6">
                <TextField
                  label="Features (comma-separated)"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Luxury Suites, Sun Deck, Traditional Sailing"
                />

                <TextField
                  label="Amenities (comma-separated)"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value.split(',').map((item: string) => item.trim()) })}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Air Conditioning, Private Bathrooms, WiFi"
                />

                <TextField
                  label="Activities (comma-separated)"
                  value={formData.activities}
                  onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Cultural Tours, Cooking Classes, Stargazing"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Dining Options (comma-separated)"
                    value={formData.diningOptions}
                    onChange={(e) => setFormData({ ...formData, diningOptions: e.target.value })}
                    fullWidth
                    placeholder="Fine Dining Restaurant, Sunset Bar"
                  />

                  <TextField
                    label="Services (comma-separated)"
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    fullWidth
                    placeholder="24/7 Concierge, Laundry Service"
                  />
                </div>
              </div>
            )}

            {/* Tab 5: Itineraries */}
            {formTab === 5 && (
              <div className="space-y-6">
                <Typography variant="h6" gutterBottom>
                  Select Itineraries for this Dahabiya
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Choose which itineraries are available for this dahabiya. Guests will be able to select from these options.
                </Typography>

                <FormControl fullWidth>
                  <InputLabel>Available Itineraries</InputLabel>
                  <Select
                    multiple
                    value={formData.selectedItineraries}
                    onChange={(e) => setFormData({ ...formData, selectedItineraries: e.target.value as string[] })}
                    label="Available Itineraries"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const itinerary = itineraries.find(i => i.id === value);
                          return (
                            <Chip key={value} label={itinerary?.name || value} size="small" />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {itineraries.map((itinerary) => (
                      <MenuItem key={itinerary.id} value={itinerary.id}>
                        <Checkbox checked={formData.selectedItineraries.indexOf(itinerary.id) > -1} />
                        <ListItemText
                          primary={itinerary.name}
                          secondary={`${itinerary.duration} days - ${itinerary.description}`}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {formData.selectedItineraries.length > 0 && (
                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      Selected Itineraries Preview:
                    </Typography>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.selectedItineraries.map((itineraryId) => {
                        const itinerary = itineraries.find(i => i.id === itineraryId);
                        return itinerary ? (
                          <Card key={itinerary.id} variant="outlined">
                            <CardContent style={{ padding: '12px' }}>
                              <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                                {itinerary.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Duration: {itinerary.duration} days
                              </Typography>
                              <Typography variant="body2">
                                {itinerary.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 6: SEO & Marketing */}
            {formTab === 6 && (
              <div className="space-y-6">
                <TextField
                  label="Meta Title"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  fullWidth
                  placeholder="SEO title for search engines"
                />

                <TextField
                  label="Meta Description"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="SEO description for search engines"
                />

                <TextField
                  label="Tags (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  fullWidth
                  placeholder="luxury, nile cruise, egypt, traditional"
                />
              </div>
            )}
          </div>
          </div>
        </DialogContent>
        <DialogActions style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
          padding: '16px 24px'
        }}>
          <Button
            onClick={handleCloseDialog}
            style={{
              color: '#666666',
              backgroundColor: 'transparent'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            style={{
              backgroundColor: '#0080ff',
              color: 'white',
              boxShadow: '0 2px 8px rgba(0, 128, 255, 0.3)'
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : (editingDahabiya ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DahabiyaManager;
