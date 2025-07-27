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
      className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center p-4 transition-opacity duration-200"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative transform transition-transform duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b-2 border-yellow-500 bg-gradient-to-r from-slate-800 to-slate-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📱</span>
            Media Library
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-400 text-xl font-bold px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200"
          >
            ✕ Close
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Upload Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-3">
              <span className="text-2xl">📤</span>
              Upload New Media
            </h3>
            <input
              type="file"
              accept={accept}
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full p-4 border-2 border-yellow-400 rounded-lg bg-white text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-white file:font-semibold hover:file:bg-yellow-600 transition-all duration-200"
            />
            {uploading && (
              <p className="mt-3 text-slate-600 flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Uploading...
              </p>
            )}
          </div>

          {/* Media Grid */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-2xl">🖼️</span>
              Select Media
            </h3>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p className="text-slate-600 text-lg">Loading media...</p>
              </div>
            ) : mediaItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-600 text-lg">No media files found.</p>
                <p className="text-gray-500">Upload some files to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-h-96 overflow-y-auto p-2">
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
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    {item.type.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                        <span className="text-4xl">📄</span>
                      </div>
                    )}
                    <div className="p-3 bg-white">
                      <div className="text-sm font-semibold text-slate-800 truncate mb-1">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500">
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
        <div className="flex justify-between items-center p-6 border-t-2 border-yellow-500 bg-gray-50">
          <div className="text-slate-600 text-sm">
            {selectedItem ? (
              <span className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Selected: <span className="font-medium text-slate-800 truncate max-w-xs">{selectedItem.split('/').pop()}</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-gray-400">○</span>
                No media selected
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedItem}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedItem
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Select Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
