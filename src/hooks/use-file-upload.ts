import { useState } from 'react';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (filename: string): Promise<void> => {
    try {
      setUploading(true);
      setError(null);
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const replaceFile = async (filename: string, file: File): Promise<string> => {
    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to replace file');
      }
      const data = await response.json();
      return data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    deleteFile,
    replaceFile,
    uploading,
    error,
  };
} 