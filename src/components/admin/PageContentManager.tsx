"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Web,
  ExpandMore,
  Save,
  Cancel,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import MediaPicker from './MediaPicker';

interface PageContent {
  id: string;
  key: string;
  title: string;
  content: string;
  contentType: string;
  page: string;
  section: string;
  order: number;
  isActive: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export default function PageContentManager() {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<PageContent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPage, setSelectedPage] = useState('dahabiyas');
  const [selectedSection, setSelectedSection] = useState('all');

  const [formData, setFormData] = useState({
    key: '',
    title: '',
    content: '',
    contentType: 'TEXT',
    page: 'dahabiyas',
    section: 'hero',
    order: 0,
    isActive: true,
    metadata: {},
  });

  const contentTypes = [
    { value: 'TEXT', label: 'Text' },
    { value: 'TEXTAREA', label: 'Long Text' },
    { value: 'IMAGE', label: 'Image' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'HTML', label: 'HTML' },
    { value: 'JSON', label: 'JSON Data' },
  ];

  const pages = [
    { value: 'dahabiyas', label: 'Dahabiyas Page' },
    { value: 'home', label: 'Home Page' },
    { value: 'about', label: 'About Page' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'booking', label: 'Booking Page' },
  ];

  const sections = [
    { value: 'all', label: 'All Sections' },
    { value: 'hero', label: 'Hero Section' },
    { value: 'content', label: 'Main Content' },
    { value: 'cta', label: 'Call to Action' },
    { value: 'features', label: 'Features' },
    { value: 'testimonials', label: 'Testimonials' },
    { value: 'footer', label: 'Footer' },
  ];

  useEffect(() => {
    fetchContents();
  }, [selectedPage, selectedSection]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedPage !== 'all') params.append('page', selectedPage);
      if (selectedSection !== 'all') params.append('section', selectedSection);

      const response = await fetch(`/api/admin/page-content?${params}`);
      if (!response.ok) throw new Error('Failed to fetch page contents');

      const data = await response.json();
      setContents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch page contents');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (content?: PageContent) => {
    if (content) {
      setEditingContent(content);
      setFormData({
        key: content.key,
        title: content.title,
        content: content.content,
        contentType: content.contentType,
        page: content.page,
        section: content.section,
        order: content.order,
        isActive: content.isActive,
        metadata: content.metadata || {},
      });
    } else {
      setEditingContent(null);
      setFormData({
        key: '',
        title: '',
        content: '',
        contentType: 'TEXT',
        page: selectedPage,
        section: 'hero',
        order: 0,
        isActive: true,
        metadata: {},
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingContent(null);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const url = editingContent 
        ? `/api/admin/page-content/${editingContent.id}`
        : '/api/admin/page-content';
      
      const method = editingContent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save content');
      }

      await fetchContents();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`/api/admin/page-content/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete content');

      await fetchContents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete content');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/page-content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) throw new Error('Failed to update content');

      await fetchContents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'TEXT': return 'primary';
      case 'TEXTAREA': return 'secondary';
      case 'IMAGE': return 'success';
      case 'VIDEO': return 'warning';
      case 'HTML': return 'error';
      case 'JSON': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} className="text-egyptian-gold" />
      </Box>
    );
  }

  return (
    <Box className="p-6">
      {/* Header */}
      <Box display="flex" justifyContent="between" alignItems="center" mb={4}>
        <div>
          <Typography variant="h4" className="text-hieroglyph-brown font-bold mb-2 flex items-center gap-2">
            <Web className="text-egyptian-gold" />
            Page Content Manager
          </Typography>
          <Typography variant="subtitle1" className="text-amber-700">
            Manage all website content and media
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-amber"
        >
          Add Content
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={2} className="p-4 mb-6">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Page</InputLabel>
              <Select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                label="Page"
              >
                {pages.map((page) => (
                  <MenuItem key={page.value} value={page.value}>
                    {page.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Section</InputLabel>
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                label="Section"
              >
                {sections.map((section) => (
                  <MenuItem key={section.value} value={section.value}>
                    {section.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              onClick={fetchContents}
              fullWidth
              className="border-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/10"
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Content Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow className="bg-gradient-to-r from-amber-50 to-orange-50">
              <TableCell className="font-bold">Key</TableCell>
              <TableCell className="font-bold">Title</TableCell>
              <TableCell className="font-bold">Type</TableCell>
              <TableCell className="font-bold">Page</TableCell>
              <TableCell className="font-bold">Section</TableCell>
              <TableCell className="font-bold">Order</TableCell>
              <TableCell className="font-bold">Status</TableCell>
              <TableCell align="right" className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.map((content) => (
              <TableRow key={content.id} hover>
                <TableCell>
                  <Typography variant="body2" className="font-mono text-sm">
                    {content.key}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" className="font-medium">
                    {content.title}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600 block">
                    {content.content.substring(0, 50)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={content.contentType}
                    size="small"
                    color={getContentTypeColor(content.contentType) as any}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip label={content.page} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip label={content.section} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{content.order}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => toggleActive(content.id, content.isActive)}
                    className={content.isActive ? 'text-green-600' : 'text-gray-400'}
                  >
                    {content.isActive ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(content)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(content.id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {contents.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No content found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add some content to get started.
          </Typography>
        </Box>
      )}

      {/* Content Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle className="flex items-center gap-2">
          <Web className="text-egyptian-gold" />
          {editingContent ? 'Edit Content' : 'Add New Content'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <Grid container spacing={3} className="mt-2">
            <Grid item xs={12} md={6}>
              <TextField
                label="Key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                fullWidth
                required
                helperText="Unique identifier for this content"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  label="Content Type"
                >
                  {contentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Page</InputLabel>
                <Select
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  label="Page"
                >
                  {pages.map((page) => (
                    <MenuItem key={page.value} value={page.value}>
                      {page.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Section"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                fullWidth
                helperText="Display order (lower numbers appear first)"
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

            <Grid item xs={12}>
              {formData.contentType === 'IMAGE' ? (
                <MediaPicker
                  label="Image URL"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  accept="image/*"
                  helperText="Select an image for this content"
                />
              ) : formData.contentType === 'VIDEO' ? (
                <MediaPicker
                  label="Video URL"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  accept="video/*"
                  helperText="Select a video for this content"
                />
              ) : formData.contentType === 'TEXTAREA' || formData.contentType === 'HTML' ? (
                <TextField
                  label="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  fullWidth
                  multiline
                  rows={6}
                  required
                />
              ) : (
                <TextField
                  label="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  fullWidth
                  required
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            className="bg-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-amber"
          >
            {submitting ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
