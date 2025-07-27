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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Image as ImageIcon,
  Category,
  Visibility,
  VisibilityOff,
  Star,
  StarBorder,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import MediaLibrarySelector from './MediaLibrarySelector';
import MediaPicker from './MediaPicker';

interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  hieroglyph?: string;
  color?: string;
  order: number;
  isActive: boolean;
  images: GalleryImage[];
  _count: {
    images: number;
  };
}

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  title?: string;
  description?: string;
  categoryId: string;
  category: GalleryCategory;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function GalleryManager() {
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Category form state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    hieroglyph: '',
    color: '#DAA520',
    order: 0,
    isActive: true,
  });

  // Image form state
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [imageForm, setImageForm] = useState({
    url: '',
    alt: '',
    title: '',
    description: '',
    categoryId: '',
    order: 0,
    isActive: true,
    isFeatured: false,
    tags: [] as string[],
  });

  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const categoriesResponse = await fetch('/api/gallery/categories?includeInactive=true');
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);
      }

      // Load images
      const imagesResponse = await fetch('/api/gallery/images?includeInactive=true');
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        setImages(imagesData.images);
      }
    } catch (error) {
      console.error('Error loading gallery data:', error);
      toast.error('Failed to load gallery data');
    } finally {
      setLoading(false);
    }
  };

  // Category management
  const handleOpenCategoryDialog = (category?: GalleryCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        hieroglyph: category.hieroglyph || '',
        color: category.color || '#DAA520',
        order: category.order,
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        hieroglyph: '',
        color: '#DAA520',
        order: 0,
        isActive: true,
      });
    }
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      const url = editingCategory 
        ? '/api/gallery/categories'
        : '/api/gallery/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const dataToSend = editingCategory 
        ? { id: editingCategory.id, ...categoryForm }
        : categoryForm;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        setCategoryDialogOpen(false);
        loadData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all images in this category.')) {
      return;
    }

    try {
      const response = await fetch('/api/gallery/categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: categoryId }),
      });

      if (response.ok) {
        toast.success('Category deleted successfully!');
        loadData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Image management
  const handleOpenImageDialog = (image?: GalleryImage) => {
    if (image) {
      setEditingImage(image);
      setImageForm({
        url: image.url,
        alt: image.alt || '',
        title: image.title || '',
        description: image.description || '',
        categoryId: image.categoryId,
        order: image.order,
        isActive: image.isActive,
        isFeatured: image.isFeatured,
        tags: image.tags,
      });
    } else {
      setEditingImage(null);
      setImageForm({
        url: '',
        alt: '',
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        order: 0,
        isActive: true,
        isFeatured: false,
        tags: [],
      });
    }
    setImageDialogOpen(true);
  };

  const handleSaveImage = async () => {
    try {
      const url = '/api/gallery/images';
      const method = editingImage ? 'PUT' : 'POST';
      
      const dataToSend = editingImage 
        ? { id: editingImage.id, ...imageForm }
        : imageForm;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success(editingImage ? 'Image updated successfully!' : 'Image added successfully!');
        setImageDialogOpen(false);
        loadData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch('/api/gallery/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: imageId }),
      });

      if (response.ok) {
        toast.success('Image deleted successfully!');
        loadData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleMediaSelect = (mediaUrl: string) => {
    setImageForm(prev => ({ ...prev, url: mediaUrl }));
    setMediaDialogOpen(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !imageForm.tags.includes(tagInput.trim())) {
      setImageForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setImageForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading gallery data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gallery Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<Category />}
            onClick={() => handleOpenCategoryDialog()}
            sx={{ bgcolor: '#DAA520', '&:hover': { bgcolor: '#B8941F' } }}
          >
            Add Category
          </Button>
          <Button
            variant="contained"
            startIcon={<ImageIcon />}
            onClick={() => handleOpenImageDialog()}
            sx={{ bgcolor: '#CD853F', '&:hover': { bgcolor: '#A0522D' } }}
          >
            Add Image
          </Button>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={`Categories (${categories.length})`} />
        <Tab label={`Images (${images.length})`} />
      </Tabs>

      {/* Categories Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={category.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="between" alignItems="start" mb={2}>
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom>
                        {category.hieroglyph && <span style={{ marginRight: 8 }}>{category.hieroglyph}</span>}
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {category.description || 'No description'}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {category._count.images} images • Order: {category.order}
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Tooltip title={category.isActive ? 'Active' : 'Inactive'}>
                        <IconButton size="small" color={category.isActive ? 'success' : 'default'}>
                          {category.isActive ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenCategoryDialog(category)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCategory(category.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  {category.color && (
                    <Box
                      width="100%"
                      height={4}
                      bgcolor={category.color}
                      borderRadius={1}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Images Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {images.map((image) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={image.url}
                  alt={image.alt || image.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Box display="flex" justifyContent="between" alignItems="start" mb={1}>
                    <Typography variant="subtitle2" noWrap flex={1}>
                      {image.title || 'Untitled'}
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      <Tooltip title={image.isFeatured ? 'Featured' : 'Not Featured'}>
                        <IconButton size="small" color={image.isFeatured ? 'warning' : 'default'}>
                          {image.isFeatured ? <Star /> : <StarBorder />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={image.isActive ? 'Active' : 'Inactive'}>
                        <IconButton size="small" color={image.isActive ? 'success' : 'default'}>
                          {image.isActive ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    {image.category.name} • Order: {image.order}
                  </Typography>
                  
                  <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                    {image.tags.slice(0, 3).map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                    {image.tags.length > 3 && (
                      <Chip label={`+${image.tags.length - 3}`} size="small" variant="outlined" />
                    )}
                  </Box>

                  <Box display="flex" justifyContent="space-between">
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleOpenImageDialog(image)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Category Name"
              value={categoryForm.name}
              onChange={(e) => {
                const name = e.target.value;
                setCategoryForm(prev => ({
                  ...prev,
                  name,
                  slug: generateSlug(name)
                }));
              }}
              fullWidth
              required
            />
            
            <TextField
              label="Slug"
              value={categoryForm.slug}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
              fullWidth
              required
              helperText="URL-friendly version of the name"
            />
            
            <TextField
              label="Description"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />
            
            <TextField
              label="Hieroglyph"
              value={categoryForm.hieroglyph}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, hieroglyph: e.target.value }))}
              fullWidth
              helperText="Egyptian hieroglyph symbol for this category"
            />
            
            <TextField
              label="Color"
              type="color"
              value={categoryForm.color}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
              fullWidth
            />
            
            <TextField
              label="Order"
              type="number"
              value={categoryForm.order}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              fullWidth
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, isActive: e.target.checked }))}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingImage ? 'Edit Image' : 'Add New Image'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <MediaPicker
              label="Image URL"
              value={imageForm.url}
              onChange={(value) => setImageForm(prev => ({ ...prev, url: value }))}
              placeholder="Select an image from the media library"
              helperText="Choose an image for the gallery"
              accept="image/*"
              required
            />
            
            {imageForm.url && (
              <Box display="flex" justifyContent="center" mb={2}>
                <img
                  src={imageForm.url}
                  alt="Preview"
                  style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: 8 }}
                />
              </Box>
            )}
            
            <TextField
              label="Title"
              value={imageForm.title}
              onChange={(e) => setImageForm(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
            />
            
            <TextField
              label="Alt Text"
              value={imageForm.alt}
              onChange={(e) => setImageForm(prev => ({ ...prev, alt: e.target.value }))}
              fullWidth
            />
            
            <TextField
              label="Description"
              value={imageForm.description}
              onChange={(e) => setImageForm(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={imageForm.categoryId}
                onChange={(e) => setImageForm(prev => ({ ...prev, categoryId: e.target.value }))}
                label="Category"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.hieroglyph && <span style={{ marginRight: 8 }}>{category.hieroglyph}</span>}
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box display="flex" gap={2}>
              <TextField
                label="Order"
                type="number"
                value={imageForm.order}
                onChange={(e) => setImageForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                fullWidth
              />
              <Box display="flex" flexDirection="column" gap={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={imageForm.isActive}
                      onChange={(e) => setImageForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={imageForm.isFeatured}
                      onChange={(e) => setImageForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    />
                  }
                  label="Featured"
                />
              </Box>
            </Box>
            
            {/* Tags */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>Tags</Typography>
              <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                {imageForm.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
              <Box display="flex" gap={1}>
                <TextField
                  label="Add Tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  size="small"
                  fullWidth
                />
                <Button onClick={handleAddTag} variant="outlined" size="small">
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveImage} variant="contained">
            {editingImage ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Library Selector */}
      {mediaDialogOpen && (
        <MediaLibrarySelector
          onSelect={handleMediaSelect}
          onClose={() => setMediaDialogOpen(false)}
        />
      )}
    </Box>
  );
}
