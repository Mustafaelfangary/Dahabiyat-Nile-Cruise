"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

export default function GalleryManagement() {
  const { data: session, status } = useSession();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchMediaItems();
    }
  }, [session]);

  const fetchMediaItems = async () => {
    try {
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setMediaItems(data.media || []);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          alert(`Upload failed for ${file.name}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Upload failed for ${file.name}`);
      }
    }

    await fetchMediaItems(); // Refresh the list
    setUploading(false);
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) return;
    
    if (!confirm(`Delete ${selectedItems.length} selected items?`)) return;

    try {
      for (const itemId of selectedItems) {
        await fetch(`/api/media/${itemId}`, {
          method: 'DELETE',
        });
      }
      
      setSelectedItems([]);
      await fetchMediaItems();
      alert('Items deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting items');
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{color: "hsl(220, 15%, 20%)"}}>Loading Gallery...</h1>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <a href="/admin" style={{color: "hsl(220, 15%, 20%)"}}>Back to Admin</a>
      </div>
    );
  }

  return (
    <div style={{background: "white"}}>
      <div style={{background: "white"}}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{color: "hsl(220, 15%, 20%)"}}>
            🖼️ Media Gallery
          </h1>
          <a 
            href="/admin"
            style={{background: "white"}}
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Upload Section */}
        <div style={{background: "white"}}>
          <h3 style={{color: "hsl(220, 15%, 20%)"}}>
            📤 Upload Media
          </h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #d4af37',
                borderRadius: '6px',
                backgroundColor: 'white'
              }}
            />
            {uploading && (
              <span style={{color: "hsl(220, 15%, 20%)"}}>
                📤 Uploading...
              </span>
            )}
          </div>
        </div>

        {/* Actions Bar */}
        <div style={{background: "white"}}>
          <div style={{color: "hsl(220, 15%, 20%)"}}>
            {selectedItems.length > 0 ? `${selectedItems.length} items selected` : `${mediaItems.length} total items`}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setSelectedItems([])}
              disabled={selectedItems.length === 0}
              style={{background: "white"}}
            >
              Clear Selection
            </button>
            <button
              onClick={deleteSelectedItems}
              disabled={selectedItems.length === 0}
              style={{background: "white"}}
            >
              🗑️ Delete Selected
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {mediaItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📷</div>
            <h3 style={{color: "hsl(220, 15%, 20%)"}}>
              No Media Files
            </h3>
            <p style={{ color: '#666' }}>
              Upload some images or videos to get started with your gallery.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {mediaItems.map((item) => (
              <div
                key={item.id}
                style={{background: "white"}}
                onClick={() => toggleItemSelection(item.id)}
              >
                {item.type.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '12px'
                    }}
                  />
                ) : (
                  <div style={{background: "white"}}>
                    <span style={{ fontSize: '48px' }}>🎥</span>
                  </div>
                )}
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#333',
                  margin: '0 0 8px 0',
                  wordBreak: 'break-word'
                }}>
                  {item.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                  <span>{formatFileSize(item.size)}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
