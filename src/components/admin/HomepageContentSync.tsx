"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentField {
  key: string;
  title: string;
  currentValue?: string;
  expectedValue?: string;
  status: 'synced' | 'missing' | 'outdated';
  section: string;
}

export default function HomepageContentSync() {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [contentFields, setContentFields] = useState<ContentField[]>([]);

  // Expected homepage content structure that matches the actual homepage
  const expectedContent: ContentField[] = [
    // Hero Section
    { key: 'hero_title', title: 'Hero Title', expectedValue: 'Discover Ancient Egypt on Luxury Dahabiyas', status: 'missing', section: 'hero' },
    { key: 'hero_subtitle', title: 'Hero Subtitle', expectedValue: 'Experience the timeless beauty of the Nile River', status: 'missing', section: 'hero' },
    { key: 'hero_video_url', title: 'Hero Video URL', expectedValue: '/videos/home_hero_video.mp4', status: 'missing', section: 'hero' },
    { key: 'hero_video_poster', title: 'Hero Video Poster', expectedValue: '/images/hero-video-poster.jpg', status: 'missing', section: 'hero' },
    
    // Featured Sections (these are what actually appear on homepage)
    { key: 'featured_dahabiyas_title', title: 'Featured Dahabiyas Title', expectedValue: 'Our Luxury Dahabiyas', status: 'missing', section: 'featured_dahabiyas' },
    { key: 'featured_dahabiyas_subtitle', title: 'Featured Dahabiyas Subtitle', expectedValue: 'Discover our fleet of traditional sailing vessels', status: 'missing', section: 'featured_dahabiyas' },
    { key: 'featured_packages_title', title: 'Featured Packages Title', expectedValue: 'Popular Nile Cruise Packages', status: 'missing', section: 'featured_packages' },
    { key: 'featured_packages_subtitle', title: 'Featured Packages Subtitle', expectedValue: 'Carefully crafted journeys through ancient Egypt', status: 'missing', section: 'featured_packages' },
    
    // About Section
    { key: 'what_is_title', title: 'What is a Dahabiya Title', expectedValue: 'What is a Dahabiya?', status: 'missing', section: 'about' },
    { key: 'what_is_description', title: 'What is a Dahabiya Description', expectedValue: 'A traditional Egyptian sailing boat experience', status: 'missing', section: 'about' },
  ];

  const checkContentStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/website-content?page=homepage');
      const data = await response.json();
      
      const existingContent = data.content || [];
      
      const updatedFields = expectedContent.map(expected => {
        const existing = existingContent.find((c: any) => c.key === expected.key);
        
        if (!existing) {
          return { ...expected, status: 'missing' as const };
        } else if (existing.content !== expected.expectedValue) {
          return { 
            ...expected, 
            currentValue: existing.content,
            status: 'outdated' as const 
          };
        } else {
          return { 
            ...expected, 
            currentValue: existing.content,
            status: 'synced' as const 
          };
        }
      });
      
      setContentFields(updatedFields);
      
      const missing = updatedFields.filter(f => f.status === 'missing').length;
      const outdated = updatedFields.filter(f => f.status === 'outdated').length;
      
      if (missing > 0 || outdated > 0) {
        toast.warning(`Found ${missing} missing and ${outdated} outdated content fields`);
      } else {
        toast.success('All homepage content is synced!');
      }
      
    } catch (error) {
      console.error('Error checking content status:', error);
      toast.error('Failed to check content status');
    } finally {
      setLoading(false);
    }
  };

  const syncContent = async () => {
    setSyncing(true);
    try {
      const fieldsToSync = contentFields.filter(f => f.status !== 'synced');
      
      for (const field of fieldsToSync) {
        const response = await fetch('/api/website-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: field.key,
            title: field.title,
            content: field.expectedValue,
            contentType: 'TEXT',
            page: 'homepage',
            section: field.section,
            order: 0
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to sync ${field.title}`);
        }
      }
      
      toast.success(`✅ Synced ${fieldsToSync.length} content fields`);
      await checkContentStatus(); // Refresh status
      
    } catch (error) {
      console.error('Error syncing content:', error);
      toast.error('Failed to sync content');
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'missing':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'outdated':
        return <RefreshCw className="w-4 h-4 text-yellow-600" />;
      default:
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      synced: 'bg-green-100 text-green-800',
      missing: 'bg-red-100 text-red-800',
      outdated: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const groupedFields = contentFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, ContentField[]>);

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100">
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Homepage Content Sync
        </CardTitle>
        <p className="text-blue-600 text-sm">
          Sync admin panel fields with actual homepage content
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={checkContentStatus} 
            disabled={loading}
            variant="outline"
          >
            <Eye className="w-4 h-4 mr-2" />
            {loading ? 'Checking...' : 'Check Status'}
          </Button>
          
          <Button 
            onClick={syncContent} 
            disabled={syncing || contentFields.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {syncing ? 'Syncing...' : 'Sync Content'}
          </Button>
        </div>

        {contentFields.length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedFields).map(([section, fields]) => (
              <div key={section} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 capitalize">
                  {section.replace('_', ' ')} Section
                </h3>
                <div className="space-y-2">
                  {fields.map((field) => (
                    <div key={field.key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(field.status)}
                        <div>
                          <div className="font-medium">{field.title}</div>
                          <div className="text-sm text-gray-600">{field.key}</div>
                        </div>
                      </div>
                      {getStatusBadge(field.status)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {contentFields.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            Click "Check Status" to analyze homepage content
          </div>
        )}
      </CardContent>
    </Card>
  );
}
