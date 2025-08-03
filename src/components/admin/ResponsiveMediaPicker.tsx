"use client";

import React, { useState } from 'react';
import {
  Upload as CloudUpload,
  Eye as Preview,
  X as Close,
  Image as ImageIcon,
  Video as VideoLibrary,
  Trash2 as Delete,
} from 'lucide-react';
import MediaLibrarySelector from './MediaLibrarySelector';

interface ResponsiveMediaPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export default function ResponsiveMediaPicker({
  label,
  value,
  onChange,
  accept = 'image/*',
  placeholder = 'Select media file...',
  helperText,
  required = false,
  className = ''
}: ResponsiveMediaPickerProps) {
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

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Input with Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-0"
        />
        
        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowMediaPicker(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1 whitespace-nowrap"
          >
            <CloudUpload size={16} />
            <span className="hidden sm:inline">Browse</span>
            <span className="sm:hidden">📁</span>
          </button>
          
          {value && (
            <>
              <button
                type="button"
                onClick={handlePreview}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Preview size={16} />
                <span className="hidden sm:inline">Preview</span>
                <span className="sm:hidden">👁️</span>
              </button>
              
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Delete size={16} />
                <span className="hidden sm:inline">Clear</span>
                <span className="sm:hidden">🗑️</span>
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Helper Text */}
      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      
      {/* Preview Thumbnail */}
      {value && (
        <div className="mt-2">
          {isImage(value) ? (
            <img 
              src={value} 
              alt={label}
              className="w-20 h-20 object-cover rounded-lg border shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : isVideo(value) ? (
            <div className="w-20 h-20 bg-gray-100 rounded-lg border shadow-sm flex items-center justify-center">
              <VideoLibrary className="w-8 h-8 text-gray-400" />
            </div>
          ) : null}
        </div>
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
      {previewOpen && value && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-[10000] flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              <Close size={20} />
            </button>
            
            {isImage(value) ? (
              <img
                src={value}
                alt={label}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : isVideo(value) ? (
              <video
                src={value}
                controls
                className="max-w-full max-h-full rounded-lg"
              />
            ) : (
              <div className="text-white text-center">
                <p>Cannot preview this file type</p>
                <p className="text-sm text-gray-300 mt-2">{value}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
