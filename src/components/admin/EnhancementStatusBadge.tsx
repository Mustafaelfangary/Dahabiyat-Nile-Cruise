"use client";

import React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { generateSlug } from '@/lib/enhanced-creation-utils';

interface EnhancementStatusBadgeProps {
  itemName: string;
  itemType: 'dahabiya' | 'package';
  className?: string;
}

export default function EnhancementStatusBadge({ 
  itemName, 
  itemType, 
  className = '' 
}: EnhancementStatusBadgeProps) {
  const [isEnhanced, setIsEnhanced] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkEnhancementStatus();
  }, [itemName, itemType]);

  const checkEnhancementStatus = async () => {
    try {
      setLoading(true);
      const slug = generateSlug(itemName);
      
      // Check if enhanced page exists via API
      const response = await fetch(`/api/admin/check-enhancement?slug=${slug}&type=${itemType}`);
      const data = await response.json();
      
      setIsEnhanced(data.isEnhanced);
    } catch (error) {
      console.error('Error checking enhancement status:', error);
      setIsEnhanced(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse"></div>
        Checking...
      </div>
    );
  }

  if (isEnhanced) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ${className}`}>
        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
        Enhanced
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ${className}`}>
      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
      Basic
    </div>
  );
}

// Enhanced Status Card Component
interface EnhancementStatusCardProps {
  itemName: string;
  itemType: 'dahabiya' | 'package';
  onEnhance?: () => void;
  className?: string;
}

export function EnhancementStatusCard({ 
  itemName, 
  itemType, 
  onEnhance,
  className = '' 
}: EnhancementStatusCardProps) {
  const [status, setStatus] = React.useState<{
    isEnhanced: boolean;
    hasPage: boolean;
    hasContentKeys: boolean;
    hasBookingIntegration: boolean;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [enhancing, setEnhancing] = React.useState(false);

  React.useEffect(() => {
    checkDetailedStatus();
  }, [itemName, itemType]);

  const checkDetailedStatus = async () => {
    try {
      setLoading(true);
      const slug = generateSlug(itemName);
      
      const response = await fetch(`/api/admin/enhancement-status?slug=${slug}&type=${itemType}`);
      const data = await response.json();
      
      setStatus(data);
    } catch (error) {
      console.error('Error checking detailed status:', error);
      setStatus({
        isEnhanced: false,
        hasPage: false,
        hasContentKeys: false,
        hasBookingIntegration: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = async () => {
    try {
      setEnhancing(true);
      const slug = generateSlug(itemName);
      
      const response = await fetch('/api/admin/enhance-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          name: itemName,
          type: itemType
        }),
      });

      if (response.ok) {
        await checkDetailedStatus();
        onEnhance?.();
      } else {
        console.error('Enhancement failed');
      }
    } catch (error) {
      console.error('Error enhancing item:', error);
    } finally {
      setEnhancing(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className={`bg-red-50 rounded-lg border border-red-200 p-4 ${className}`}>
        <div className="text-red-800 text-sm font-medium">Error loading status</div>
      </div>
    );
  }

  const { isEnhanced, hasPage, hasContentKeys, hasBookingIntegration } = status;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900">Enhancement Status</h4>
        <EnhancementStatusBadge itemName={itemName} itemType={itemType} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs">
          <div className={`w-2 h-2 rounded-full mr-2 ${hasPage ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={hasPage ? 'text-green-700' : 'text-red-700'}>
            Individual Page {hasPage ? 'Created' : 'Missing'}
          </span>
        </div>
        
        <div className="flex items-center text-xs">
          <div className={`w-2 h-2 rounded-full mr-2 ${hasContentKeys ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={hasContentKeys ? 'text-green-700' : 'text-red-700'}>
            Content Keys {hasContentKeys ? 'Generated' : 'Missing'}
          </span>
        </div>
        
        <div className="flex items-center text-xs">
          <div className={`w-2 h-2 rounded-full mr-2 ${hasBookingIntegration ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={hasBookingIntegration ? 'text-green-700' : 'text-red-700'}>
            Booking Integration {hasBookingIntegration ? 'Active' : 'Missing'}
          </span>
        </div>
      </div>

      {!isEnhanced && (
        <button
          onClick={handleEnhance}
          disabled={enhancing}
          className="w-full bg-ocean-blue text-white text-xs font-medium py-2 px-3 rounded-md hover:bg-ocean-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enhancing ? 'Enhancing...' : 'Enhance Item'}
        </button>
      )}

      {isEnhanced && (
        <div className="text-center">
          <div className="text-green-600 text-xs font-medium">✅ Fully Enhanced</div>
          <a
            href={`/${itemType === 'dahabiya' ? 'dahabiyat' : 'packages'}/${generateSlug(itemName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ocean-blue text-xs hover:underline"
          >
            View Enhanced Page →
          </a>
        </div>
      )}
    </div>
  );
}

// Bulk Enhancement Component
interface BulkEnhancementProps {
  items: Array<{ name: string; type: 'dahabiya' | 'package' }>;
  onComplete?: () => void;
  className?: string;
}

export function BulkEnhancement({ items, onComplete, className = '' }: BulkEnhancementProps) {
  const [enhancing, setEnhancing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentItem, setCurrentItem] = React.useState<string>('');

  const handleBulkEnhance = async () => {
    try {
      setEnhancing(true);
      setProgress(0);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setCurrentItem(item.name);
        
        const slug = generateSlug(item.name);
        
        await fetch('/api/admin/enhance-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug,
            name: item.name,
            type: item.type
          }),
        });

        setProgress(((i + 1) / items.length) * 100);
      }

      onComplete?.();
    } catch (error) {
      console.error('Bulk enhancement error:', error);
    } finally {
      setEnhancing(false);
      setCurrentItem('');
      setProgress(0);
    }
  };

  const unenhancedItems = items.length; // This would need to be calculated based on actual status

  if (unenhancedItems === 0) {
    return (
      <div className={`bg-green-50 rounded-lg border border-green-200 p-4 ${className}`}>
        <div className="text-green-800 text-sm font-medium text-center">
          🎉 All items are enhanced!
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900">Bulk Enhancement</h4>
        <span className="text-xs text-gray-500">{unenhancedItems} items need enhancement</span>
      </div>

      {enhancing && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Enhancing: {currentItem}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-ocean-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <button
        onClick={handleBulkEnhance}
        disabled={enhancing}
        className="w-full bg-ocean-blue text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-ocean-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {enhancing ? 'Enhancing All Items...' : 'Enhance All Items'}
      </button>
    </div>
  );
}
