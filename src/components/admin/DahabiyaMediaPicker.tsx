"use client";

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Plus as Add,
  Trash2 as Delete,
  Edit,
  Image as ImageIcon,
  Images as Collections,
  Video as VideoLibrary,
  Upload as CloudUpload,
  Eye as Preview,
  X as Close
} from 'lucide-react';
import MediaLibrarySelector from './MediaLibrarySelector';

interface DahabiyaMediaPickerProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  type: 'single' | 'multiple';
  accept?: string;
  placeholder?: string;
  helperText?: string;
  maxItems?: number;
}

export default function DahabiyaMediaPicker({
  label,
  value,
  onChange,
  type,
  accept = 'image/*',
  placeholder,
  helperText,
  maxItems = 10
}: DahabiyaMediaPickerProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // Convert value to array for consistent handling
  const valueArray = Array.isArray(value) ? value : (value ? [value] : []);

  const handleMediaSelect = (url: string) => {
    if (type === 'single') {
      onChange(url);
    } else {
      const newArray = [...valueArray, url];
      onChange(newArray);
    }
    setShowMediaPicker(false);
  };

  const handleRemoveItem = (index: number) => {
    if (type === 'single') {
      onChange('');
    } else {
      const newArray = valueArray.filter((_, i) => i !== index);
      onChange(newArray);
    }
  };

  const handleReplaceItem = (index: number, newUrl: string) => {
    if (type === 'single') {
      onChange(newUrl);
    } else {
      const newArray = [...valueArray];
      newArray[index] = newUrl;
      onChange(newArray);
    }
  };

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|mov|avi)$/i.test(url);
  };

  const getFileIcon = (url: string) => {
    if (isImage(url)) return <ImageIcon />;
    if (isVideo(url)) return <VideoLibrary />;
    return <ImageIcon />;
  };

  const canAddMore = type === 'multiple' && valueArray.length < maxItems;

  return (
    <Box>
      {/* Label and Add Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight="medium">
          {label}
        </Typography>
        {(type === 'single' && !valueArray.length) || canAddMore ? (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setShowMediaPicker(true)}
            size="small"
            className="bg-egyptian-gold/10 border-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/20"
          >
            {type === 'single' ? 'Select Image' : 'Add Image'}
          </Button>
        ) : null}
      </Box>

      {/* Helper Text */}
      {helperText && (
        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
          {helperText}
        </Typography>
      )}

      {/* Selected Items Display */}
      {valueArray.length > 0 ? (
        <Grid container spacing={2}>
          {valueArray.map((url, index) => (
            <Grid size={{ xs: 12, sm: type === 'single' ? 12 : 6, md: type === 'single' ? 8 : 4, lg: type === 'single' ? 6 : 3 }} key={index}>
              <Card variant="outlined" className="relative group">
                <CardContent className="p-3">
                  {/* Preview */}
                  <Box
                    className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2 cursor-pointer"
                    onClick={() => handlePreview(url)}
                  >
                    {isImage(url) ? (
                      <img
                        src={url}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <Box className="flex items-center justify-center h-full">
                        {getFileIcon(url)}
                      </Box>
                    )}
                    
                    {/* Overlay with actions */}
                    <Box className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Tooltip title="Preview">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(url);
                          }}
                          className="bg-white/20 text-white hover:bg-white/30"
                        >
                          <Preview size={16} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Replace">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMediaPicker(true);
                          }}
                          className="bg-white/20 text-white hover:bg-white/30"
                        >
                          <Edit size={16} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Remove">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(index);
                          }}
                          className="bg-red-500/80 text-white hover:bg-red-600/80"
                        >
                          <Delete size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* URL Display */}
                  <Typography variant="caption" className="text-gray-600 break-all">
                    {url.split('/').pop() || url}
                  </Typography>
                  
                  {/* Type Badge */}
                  <Box mt={1}>
                    <Chip
                      size="small"
                      label={isImage(url) ? 'Image' : isVideo(url) ? 'Video' : 'File'}
                      color={isImage(url) ? 'primary' : 'secondary'}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Empty State */
        <Card variant="outlined" className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-8">
            <Collections className="text-gray-400 mb-2" size={48} />
            <Typography variant="body2" color="text.secondary" mb={2}>
              {type === 'single' ? 'No image selected' : 'No images added yet'}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={() => setShowMediaPicker(true)}
              className="border-egyptian-gold text-hieroglyph-brown hover:bg-egyptian-gold/10"
            >
              {type === 'single' ? 'Select Image' : 'Add Images'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Multiple type: Show count and add more button */}
      {type === 'multiple' && valueArray.length > 0 && (
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {valueArray.length} of {maxItems} images selected
          </Typography>
          {canAddMore && (
            <Button
              variant="text"
              startIcon={<Add />}
              onClick={() => setShowMediaPicker(true)}
              size="small"
              className="text-egyptian-gold hover:bg-egyptian-gold/10"
            >
              Add More
            </Button>
          )}
        </Box>
      )}

      {/* Media Library Selector */}
      {showMediaPicker && (
        <MediaLibrarySelector
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaPicker(false)}
          currentValue={type === 'single' ? (value as string) : ''}
          accept={accept}
        />
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
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
        <DialogTitle className="flex justify-between items-center" style={{
          backgroundColor: '#0080ff',
          color: 'white',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <span className="text-lg font-semibold">Media Preview</span>
          <IconButton onClick={() => setPreviewOpen(false)} style={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{
          backgroundColor: '#ffffff',
          padding: '24px'
        }}>
          {previewUrl && (
            <Box className="text-center">
              {isImage(previewUrl) ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-96 object-contain"
                />
              ) : isVideo(previewUrl) ? (
                <video
                  src={previewUrl}
                  controls
                  className="max-w-full max-h-96"
                />
              ) : (
                <Typography>Preview not available for this file type</Typography>
              )}
              <Typography variant="caption" display="block" mt={2} className="text-gray-600">
                {previewUrl}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
