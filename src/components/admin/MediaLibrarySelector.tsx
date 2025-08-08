"use client";

import React, { useState, useEffect } from 'react';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

interface MediaLibrarySelectorProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  currentValue?: string;
  accept?: string;
}

export default function MediaLibrarySelector({
  onSelect,
  onClose,
  currentValue = '',
  accept = 'image/*'
}: MediaLibrarySelectorProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>(currentValue);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth rendering
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/media?t=' + Date.now()); // Cache busting

      if (response.ok) {
        const data = await response.json();
        const mediaArray = Array.isArray(data) ? data : (data.media || []);
        setMediaItems(mediaArray);
        console.log(`✅ Loaded ${mediaArray.length} media items`);
      } else {
        console.error('❌ Media API error:', response.status, response.statusText);
        setMediaItems([]);
        if (response.status === 401) {
          console.warn('Authentication required for media library');
        }
      }
    } catch (error) {
      console.error('❌ Error fetching media:', error);
      setMediaItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        await fetchMediaItems(); // Refresh the list
        setSelectedItem(data.url);
        alert('File uploaded successfully!');
      } else {
        const errorData = await response.text();
        console.error('Upload failed:', response.status, errorData);
        if (response.status === 401) {
          alert('Authentication required. Please log in as an admin.');
        } else {
          alert(`Upload failed: ${response.status} - ${errorData}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = () => {
    console.log('📤 MediaLibrarySelector: Select button clicked');
    console.log('📤 MediaLibrarySelector: Selected item:', selectedItem);

    if (selectedItem) {
      console.log('📤 MediaLibrarySelector: Calling onSelect with:', selectedItem);
      onSelect(selectedItem);
      console.log('📤 MediaLibrarySelector: Closing picker');
      onClose();
    } else {
      console.log('❌ MediaLibrarySelector: No item selected');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-start justify-center pt-4 pb-4 px-2 sm:px-4 transition-opacity duration-200 overflow-y-auto"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl flex flex-col overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: 'calc(100vh - 2rem)',
          minHeight: '400px'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-yellow-500 bg-slate-800 flex-shrink-0">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-xl">📱</span>
            <span>Media Library</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-ocean-blue-400 text-lg font-bold px-3 py-2 rounded hover:bg-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 p-3 sm:p-4 overflow-y-auto" style={{ minHeight: 0, maxHeight: 'calc(100vh - 200px)' }}>
          {/* Upload Section */}
          <div className="mb-4 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Media
            </label>
            <input
              type="file"
              accept={accept}
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full p-2 sm:p-3 text-sm border border-yellow-400 rounded-lg bg-white file:mr-2 file:py-1 file:px-2 sm:file:py-2 sm:file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-white file:text-sm file:font-medium hover:file:bg-yellow-600 transition-colors"
            />
            {uploading && (
              <p className="mt-2 text-sm flex items-center gap-2 text-yellow-700">
                <span className="animate-spin">⏳</span>
                Uploading...
              </p>
            )}
          </div>

          {/* Media Grid */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Media</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin text-2xl mb-3">⏳</div>
                <p className="text-sm text-gray-600">Loading media library...</p>
              </div>
            ) : mediaItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-4xl mb-3">📁</div>
                <p className="text-sm text-gray-600">No media files found</p>
                <p className="text-xs text-gray-500 mt-1">Upload your first file above</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      console.log('📤 MediaLibrarySelector: Item clicked:', item.url);
                      setSelectedItem(item.url);
                    }}
                    className={`group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-lg ${
                      selectedItem === item.url
                        ? 'border-yellow-500 ring-2 ring-yellow-200 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {item.type.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-16 sm:h-20 md:h-24 object-cover"
                      />
                    ) : (
                      <div className="w-full h-16 sm:h-20 md:h-24 bg-gray-100 flex items-center justify-center">
                        <span className="text-lg sm:text-xl md:text-2xl">📄</span>
                      </div>
                    )}
                    <div className="p-1 sm:p-2 bg-white">
                      <div className="text-xs font-medium text-slate-800 truncate" title={item.name}>
                        {item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {formatFileSize(item.size)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-t border-yellow-500 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedItem}
              className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-colors ${
                selectedItem
                  ? 'bg-yellow-500 text-white hover:bg-blue-600 shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedItem ? 'Select Media' : 'Choose a file'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
