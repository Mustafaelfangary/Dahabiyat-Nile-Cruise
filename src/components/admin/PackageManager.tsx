'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  Card,
  CardContent
} from '@mui/material';
import { Edit, Delete, Add, Inventory, Star, Download } from '@mui/icons-material';
import MediaPicker from './MediaPicker';
import { toast } from 'sonner';

// Add CSS for spacing utilities
const styles = `
  .admin-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f1e8 0%, #faf8f3 100%);
    padding: 24px;
  }
  .admin-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0, 128, 255, 0.2);
    border: 1px solid rgba(0, 128, 255, 0.3);
  }
  .admin-header {
    background: linear-gradient(135deg, #0080ff 0%, #3399ff 100%);
    color: white;
    padding: 20px;
    border-radius: 15px 15px 0 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  .admin-btn-primary {
    background: linear-gradient(135deg, #0080ff 0%, #3399ff 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(0, 128, 255, 0.4);
  }
  .admin-btn-primary:hover {
    background: linear-gradient(135deg, #B8941F 0%, #E6C200 100%);
    box-shadow: 0 6px 20px rgba(0, 128, 255, 0.6);
  }
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

interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  durationDays: number;
  mainImageUrl?: string;
  heroImageUrl?: string;
  videoUrl?: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  childrenPolicy?: string;
  cancellationPolicy?: string;
  observations?: string;
  isActive: boolean;
  featured: boolean;
  category?: 'LUXURY' | 'DELUXE' | 'PREMIUM' | 'BOUTIQUE';
  maxGuests?: number;
  createdAt: string;
  updatedAt: string;
}

const PackageManager: React.FC = () => {
  const { data: session } = useSession();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formTab, setFormTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: 0,
    durationDays: 1,
    mainImageUrl: '',
    heroImageUrl: '',
    videoUrl: '',
    highlights: '',
    included: '',
    notIncluded: '',
    childrenPolicy: '',
    cancellationPolicy: '',
    observations: '',
    isActive: true,
    featured: false,
    category: 'DELUXE' as const,
    maxGuests: 0
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/packages?limit=100'); // Get more packages for admin view
      if (response.ok) {
        const data = await response.json();
        console.log('Packages API response:', data); // Debug log
        setPackages(data.packages || data || []);
      } else if (response.status === 401) {
        setError('Unauthorized access. Please check your admin permissions.');
      } else if (response.status === 403) {
        setError('Access forbidden. Admin role required.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Packages API error:', errorData); // Debug log
        throw new Error(errorData.error || `Failed to fetch packages (${response.status})`);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching packages');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pkg?: Package) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name || '',
        slug: pkg.slug || '',
        description: pkg.description || '',
        shortDescription: pkg.shortDescription || '',
        price: pkg.price || 0,
        durationDays: pkg.durationDays || 1,
        mainImageUrl: pkg.mainImageUrl || '',
        heroImageUrl: pkg.heroImageUrl || '',
        videoUrl: pkg.videoUrl || '',
        highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : '',
        included: Array.isArray(pkg.included) ? pkg.included.join('\n') : '',
        notIncluded: Array.isArray(pkg.notIncluded) ? pkg.notIncluded.join('\n') : '',
        childrenPolicy: pkg.childrenPolicy || '',
        cancellationPolicy: pkg.cancellationPolicy || '',
        observations: pkg.observations || '',
        isActive: pkg.isActive ?? true,
        featured: pkg.featured ?? false,
        category: pkg.category || 'DELUXE',
        maxGuests: pkg.maxGuests || 0
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        shortDescription: '',
        price: 0,
        durationDays: 1,
        mainImageUrl: '',
        heroImageUrl: '',
        videoUrl: '',
        highlights: '',
        included: '',
        notIncluded: '',
        childrenPolicy: '',
        cancellationPolicy: '',
        observations: '',
        isActive: true,
        featured: false,
        category: 'DELUXE',
        maxGuests: 0
      });
    }
    setDialogOpen(true);
    setFormTab(0);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPackage(null);
    setFormTab(0);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const submitData = {
        ...formData,
        highlights: formData.highlights.split('\n').filter(h => h.trim()),
        included: formData.included.split('\n').filter(i => i.trim()),
        notIncluded: formData.notIncluded.split('\n').filter(n => n.trim()),
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      const url = editingPackage ? `/api/packages/${editingPackage.id}` : '/api/packages';
      const method = editingPackage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        toast.success(`Package ${editingPackage ? 'updated' : 'created'} successfully!`);
        handleCloseDialog();
        fetchPackages();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save package');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Package deleted successfully!');
        fetchPackages();
      } else {
        throw new Error('Failed to delete package');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const downloadPackage = async (pkg: Package) => {
    try {
      const response = await fetch(`/api/packages/${pkg.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pkg.name || 'package'}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Package downloaded successfully!');
      } else {
        toast.error('Failed to download package');
      }
    } catch (error) {
      console.error('Error downloading package:', error);
      toast.error('Error downloading package');
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} style={{ color: '#0080ff' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Card className="admin-card">
        <div className="admin-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              <Inventory style={{ marginRight: '8px' }} />
              Royal Packages Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              className="admin-btn-primary"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              Add New Package
            </Button>
          </div>
        </div>

        <CardContent style={{ padding: '24px' }}>
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
                  <TableCell><strong>Duration</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Featured</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id} hover>
                    <TableCell>
                      <div>
                        <strong>{pkg.name}</strong>
                        {pkg.shortDescription && (
                          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                            {pkg.shortDescription.substring(0, 60)}...
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pkg.category || 'DELUXE'}
                        size="small"
                        style={{
                          backgroundColor: pkg.category === 'LUXURY' ? '#3399ff' :
                                         pkg.category === 'DELUXE' ? '#C0C0C0' :
                                         pkg.category === 'PREMIUM' ? '#CD7F32' : '#90EE90',
                          color: 'black'
                        }}
                      />
                    </TableCell>
                    <TableCell>{pkg.durationDays} days</TableCell>
                    <TableCell>${pkg.price?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={pkg.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={pkg.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      {pkg.featured && <Star style={{ color: '#3399ff' }} />}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => downloadPackage(pkg)}
                        size="small"
                        style={{ color: '#2196F3' }}
                        title="Download Package"
                      >
                        <Download />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenDialog(pkg)}
                        size="small"
                        style={{ color: '#0080ff' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(pkg.id)}
                        size="small"
                        style={{ color: '#f44336' }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {packages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <Inventory style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
              <Typography variant="h6">No packages found</Typography>
              <Typography variant="body2">Create your first package to get started</Typography>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle style={{ backgroundColor: '#0080ff', color: 'white' }}>
          <Inventory style={{ marginRight: '8px' }} />
          {editingPackage ? 'Edit Package' : 'Create New Package'}
        </DialogTitle>
        <DialogContent style={{ padding: '24px' }}>
          <Tabs
            value={formTab}
            onChange={(_, newValue) => setFormTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            style={{ marginBottom: '24px' }}
          >
            <Tab label="Basic Info" />
            <Tab label="Content" />
            <Tab label="Media" />
            <Tab label="Features" />
            <Tab label="Settings" />
          </Tabs>

          <div style={{ minHeight: '400px' }}>
            {/* Tab 0: Basic Information */}
            {formTab === 0 && (
              <div className="space-y-6">
                <TextField
                  label="Package Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  required
                  placeholder="e.g., Luxury Nile Experience"
                />

                <TextField
                  label="Slug (URL-friendly name)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  fullWidth
                  placeholder="luxury-nile-experience"
                  helperText="Leave empty to auto-generate from name"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Duration (Days)"
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                    fullWidth
                    required
                    inputProps={{ min: 1 }}
                  />

                  <TextField
                    label="Price (USD)"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <TextField
                    label="Max Guests"
                    type="number"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) || 0 })}
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </div>
              </div>
            )}

            {/* Tab 1: Content */}
            {formTab === 1 && (
              <div className="space-y-6">
                <TextField
                  label="Short Description"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
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
                  placeholder="Detailed package description"
                />

                <TextField
                  label="Children Policy"
                  value={formData.childrenPolicy}
                  onChange={(e) => setFormData({ ...formData, childrenPolicy: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Policy regarding children"
                />

                <TextField
                  label="Cancellation Policy"
                  value={formData.cancellationPolicy}
                  onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Cancellation terms and conditions"
                />

                <TextField
                  label="Observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Additional notes and observations"
                />
              </div>
            )}

            {/* Tab 2: Media */}
            {formTab === 2 && (
              <div className="space-y-6">
                <div>
                  <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                    Main Image
                  </Typography>
                  <MediaPicker
                    value={formData.mainImageUrl}
                    onChange={(url) => setFormData({ ...formData, mainImageUrl: url })}
                    type="image"
                  />
                </div>

                <div>
                  <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                    Hero Image
                  </Typography>
                  <MediaPicker
                    value={formData.heroImageUrl}
                    onChange={(url) => setFormData({ ...formData, heroImageUrl: url })}
                    type="image"
                  />
                </div>

                <TextField
                  label="Video URL"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  fullWidth
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            )}

            {/* Tab 3: Features */}
            {formTab === 3 && (
              <div className="space-y-6">
                <TextField
                  label="Highlights (one per line)"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter each highlight on a new line"
                />

                <TextField
                  label="What's Included (one per line)"
                  value={formData.included}
                  onChange={(e) => setFormData({ ...formData, included: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter each included item on a new line"
                />

                <TextField
                  label="What's Not Included (one per line)"
                  value={formData.notIncluded}
                  onChange={(e) => setFormData({ ...formData, notIncluded: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter each not included item on a new line"
                />
              </div>
            )}

            {/* Tab 4: Settings */}
            {formTab === 4 && (
              <div className="space-y-6">
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Active (visible to users)"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Featured (highlighted on homepage)"
                />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            style={{ backgroundColor: '#0080ff', color: 'white' }}
          >
            {submitting ? <CircularProgress size={20} /> : (editingPackage ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PackageManager;
