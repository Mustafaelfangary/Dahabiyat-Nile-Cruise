"use client";

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Upload as CloudUpload,
  Eye as Preview,
  X as Close,
  Image as ImageIcon,
  Video as VideoLibrary,
  Trash2 as Delete,
  Edit
} from 'lucide-react';
import MediaLibrarySelector from './MediaLibrarySelector';

interface MediaPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function MediaPicker({
  label,
  value,
  onChange,
  accept = 'image/*',
  placeholder = 'Select media file...',
  helperText,
  required = false,
  fullWidth = true,
  className = ''
}: MediaPickerProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleMediaSelect = (url: string) => {
    onChange(url);
    setShowMediaPicker(false);
  };

  const handleClear = () => {
    onChange('');
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|mov|avi)$/i.test(url);
  };

  const getFileIcon = () => {
    if (isImage(value)) return <ImageIcon />;
    if (isVideo(value)) return <VideoLibrary />;
    return <ImageIcon />;
  };

  return (
    <Box className={className}>
      {/* Text Field with Browse Button */}
      <TextField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        helperText={helperText}
        required={required}
        fullWidth={fullWidth}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Box display="flex" gap={1}>
                {value && (
                  <>
                    <Tooltip title="Preview">
                      <IconButton
                        size="small"
                        onClick={handlePreview}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Preview size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Clear">
                      <IconButton
                        size="small"
                        onClick={handleClear}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Delete size={16} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <Tooltip title="Browse Media Library">
                  <IconButton
                    size="small"
                    onClick={() => setShowMediaPicker(true)}
                    className="text-egyptian-gold hover:bg-egyptian-gold/10"
                  >
                    <CloudUpload size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
            </InputAdornment>
          ),
        }}
      />

      {/* Preview Thumbnail */}
      {value && isImage(value) && (
        <Box mt={2}>
          <Card variant="outlined" className="inline-block">
            <CardContent className="p-2">
              <Box
                className="relative w-32 h-20 bg-gray-100 rounded overflow-hidden cursor-pointer"
                onClick={handlePreview}
              >
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <Box className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Preview className="text-white" size={16} />
                </Box>
              </Box>
              <Typography variant="caption" className="text-gray-600 mt-1 block">
                {value.split('/').pop()}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Media Library Selector */}
      {showMediaPicker && (
        <MediaLibrarySelector
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaPicker(false)}
          currentValue={value}
          accept={accept}
        />
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6">Media Preview</Typography>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {value && (
            <Box className="text-center">
              {isImage(value) ? (
                <img
                  src={value}
                  alt="Preview"
                  className="max-w-full max-h-96 object-contain"
                />
              ) : isVideo(value) ? (
                <video
                  src={value}
                  controls
                  className="max-w-full max-h-96"
                />
              ) : (
                <Box className="py-8">
                  <Typography variant="h6" className="text-gray-600 mb-2">
                    {getFileIcon()}
                  </Typography>
                  <Typography>Preview not available for this file type</Typography>
                </Box>
              )}
              <Typography variant="caption" display="block" mt={2} className="text-gray-600 break-all">
                {value}
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
