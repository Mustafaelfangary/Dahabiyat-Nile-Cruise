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
    // Loading Section
    { key: 'loading_text', title: 'Loading Text', expectedValue: 'Loading...', status: 'missing', section: 'loading' },

    // Hero Video Section
    { key: 'hero_video_url', title: 'Hero Video URL', expectedValue: '/videos/home_hero_video.mp4', status: 'missing', section: 'hero' },
    { key: 'hero_video_poster', title: 'Hero Video Poster', expectedValue: '/images/hero-video-poster.jpg', status: 'missing', section: 'hero' },
    { key: 'hero_video_title', title: 'Hero Video Title', expectedValue: 'Experience the Magic of the Nile', status: 'missing', section: 'hero' },
    { key: 'hero_video_subtitle', title: 'Hero Video Subtitle', expectedValue: 'Luxury Dahabiya Cruises Through Ancient Egypt', status: 'missing', section: 'hero' },
    { key: 'hero_video_cta_text', title: 'Hero CTA Text', expectedValue: 'Explore Fleet', status: 'missing', section: 'hero' },
    { key: 'hero_scroll_text', title: 'Hero Scroll Text', expectedValue: 'Scroll to explore', status: 'missing', section: 'hero' },

    // Dahabiyat Section
    { key: 'dahabiyat_section_title', title: 'Dahabiyat Section Title', expectedValue: 'Our Luxury Dahabiyat Nile Cruise Fleet', status: 'missing', section: 'dahabiyat' },
    { key: 'dahabiyat_section_subtitle', title: 'Dahabiyat Section Subtitle', expectedValue: 'Discover our collection of traditional sailing vessels, each offering a unique journey through Egypt\'s timeless landscapes', status: 'missing', section: 'dahabiyat' },
    { key: 'dahabiyat_view_all_text', title: 'Dahabiyat View All Text', expectedValue: 'View All Dahabiyat', status: 'missing', section: 'dahabiyat' },

    // What is Dahabiya Section
    { key: 'what_is_dahabiya_title', title: 'What is Dahabiya Title', expectedValue: 'What is Dahabiya?', status: 'missing', section: 'what_is' },
    { key: 'what_is_dahabiya_content', title: 'What is Dahabiya Content', expectedValue: 'A Dahabiya is a traditional Egyptian sailing boat that has been navigating the Nile River for centuries. These elegant vessels, with their distinctive lateen sails and shallow draft, were once the preferred mode of transport for Egyptian nobility and wealthy travelers exploring the ancient wonders along the Nile.', status: 'missing', section: 'what_is' },
    { key: 'what_is_dahabiya_image_1', title: 'What is Dahabiya Image 1', expectedValue: '/images/dahabiya-sailing.jpg', status: 'missing', section: 'what_is' },
    { key: 'what_is_dahabiya_image_2', title: 'What is Dahabiya Image 2', expectedValue: '/images/dahabiya-deck.jpg', status: 'missing', section: 'what_is' },
    { key: 'what_is_dahabiya_image_3', title: 'What is Dahabiya Image 3', expectedValue: '/images/dahabiya-sunset.jpg', status: 'missing', section: 'what_is' },

    // Packages Section
    { key: 'packages_section_title', title: 'Packages Section Title', expectedValue: 'Our Journey Packages', status: 'missing', section: 'packages' },
    { key: 'packages_section_subtitle', title: 'Packages Section Subtitle', expectedValue: 'Choose from our carefully crafted packages, each designed to showcase the best of Egypt\'s ancient wonders and natural beauty', status: 'missing', section: 'packages' },
    { key: 'packages_view_all_text', title: 'Packages View All Text', expectedValue: 'View All Packages', status: 'missing', section: 'packages' },
    { key: 'days_label', title: 'Days Label', expectedValue: 'Days', status: 'missing', section: 'packages' },
    { key: 'view_details_text', title: 'View Details Text', expectedValue: 'View Details', status: 'missing', section: 'packages' },

    // Why Different Section
    { key: 'why_different_title', title: 'Why Different Title', expectedValue: 'Why is Dahabiya different from regular Nile Cruises?', status: 'missing', section: 'why_different' },
    { key: 'why_different_content', title: 'Why Different Content', expectedValue: 'While traditional Nile cruise ships can accommodate 200-400 passengers, Dahabiyas offer an intimate experience with only 8-12 guests. This fundamental difference creates a completely different travel experience that feels more like a private yacht charter than a commercial cruise.', status: 'missing', section: 'why_different' },
    { key: 'why_different_image_1', title: 'Why Different Image 1', expectedValue: '/images/cruise-comparison-1.jpg', status: 'missing', section: 'why_different' },
    { key: 'why_different_image_2', title: 'Why Different Image 2', expectedValue: '/images/cruise-comparison-2.jpg', status: 'missing', section: 'why_different' },
    { key: 'why_different_image_3', title: 'Why Different Image 3', expectedValue: '/images/cruise-comparison-3.jpg', status: 'missing', section: 'why_different' },

    // Share Memories Section
    { key: 'share_memories_title', title: 'Share Memories Title', expectedValue: 'Share your memories with us', status: 'missing', section: 'share_memories' },
    { key: 'share_memories_content', title: 'Share Memories Content', expectedValue: 'Your journey with us doesn\'t end when you disembark. We believe that the memories created during your Dahabiya experience are meant to be shared and cherished forever. Join our community of travelers who have fallen in love with the magic of the Nile.', status: 'missing', section: 'share_memories' },
    { key: 'share_memories_image_1', title: 'Share Memories Image 1', expectedValue: '/images/guest-memories-1.jpg', status: 'missing', section: 'share_memories' },
    { key: 'share_memories_image_2', title: 'Share Memories Image 2', expectedValue: '/images/guest-memories-2.jpg', status: 'missing', section: 'share_memories' },
    { key: 'share_memories_image_3', title: 'Share Memories Image 3', expectedValue: '/images/guest-memories-3.jpg', status: 'missing', section: 'share_memories' },

    // Our Story Section
    { key: 'our_story_title', title: 'Our Story Title', expectedValue: 'Our Story', status: 'missing', section: 'our_story' },
    { key: 'our_story_content', title: 'Our Story Content', expectedValue: 'Our journey began over 30 years ago when Captain Ahmed Hassan, a third-generation Nile navigator, had a vision to revive the authentic way of exploring Egypt\'s ancient wonders. Growing up along the banks of the Nile, he witnessed the transformation of river travel and felt called to preserve the traditional Dahabiya experience.', status: 'missing', section: 'our_story' },
    { key: 'our_story_paragraph_2', title: 'Our Story Paragraph 2', expectedValue: '', status: 'missing', section: 'our_story' },
    { key: 'our_story_paragraph_3', title: 'Our Story Paragraph 3', expectedValue: '', status: 'missing', section: 'our_story' },
    { key: 'our_story_paragraph_4', title: 'Our Story Paragraph 4', expectedValue: '', status: 'missing', section: 'our_story' },

    // Founder Section
    { key: 'founder_image', title: 'Founder Image', expectedValue: '/images/ashraf-elmasry.jpg', status: 'missing', section: 'founder' },
    { key: 'founder_name', title: 'Founder Name', expectedValue: 'Ashraf El-Masry', status: 'missing', section: 'founder' },
    { key: 'founder_title', title: 'Founder Title', expectedValue: 'Founder & CEO', status: 'missing', section: 'founder' },
    { key: 'founder_quote', title: 'Founder Quote', expectedValue: '"Preserving the ancient art of Nile navigation for future generations"', status: 'missing', section: 'founder' },

    // Blog Section
    { key: 'blog_section_title', title: 'Blog Section Title', expectedValue: 'Stories from the Nile', status: 'missing', section: 'blog' },
    { key: 'blog_section_subtitle', title: 'Blog Section Subtitle', expectedValue: 'Discover the magic of Egypt through the eyes of our travelers and guides', status: 'missing', section: 'blog' },
    { key: 'blog_view_all_text', title: 'Blog View All Text', expectedValue: 'Read All Stories', status: 'missing', section: 'blog' },

    // Safety Section
    { key: 'safety_title', title: 'Safety Title', expectedValue: 'Your Safety is Our Priority', status: 'missing', section: 'safety' },
    { key: 'safety_subtitle', title: 'Safety Subtitle', expectedValue: 'All our Dahabiyas are certified and regularly inspected to ensure the highest safety standards', status: 'missing', section: 'safety' },

    // CTA Section
    { key: 'cta_title', title: 'CTA Title', expectedValue: 'Ready to Begin Your Journey?', status: 'missing', section: 'cta' },
    { key: 'cta_description', title: 'CTA Description', expectedValue: 'Contact us today to start planning your unforgettable Dahabiya adventure on the Nile', status: 'missing', section: 'cta' },
    { key: 'cta_book_text', title: 'CTA Book Text', expectedValue: 'Book Your Journey', status: 'missing', section: 'cta' },
    { key: 'cta_contact_text', title: 'CTA Contact Text', expectedValue: 'Contact Us', status: 'missing', section: 'cta' },

    // Common Elements
    { key: 'read_more_text', title: 'Read More Text', expectedValue: 'Read More', status: 'missing', section: 'common' },
    { key: 'read_less_text', title: 'Read Less Text', expectedValue: 'Read Less', status: 'missing', section: 'common' },
  ];

  const checkContentStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/website-content?page=homepage');
      const data = await response.json();
      
      const existingContent = data.content || [];
      
      const updatedFields = expectedContent.map(expected => {
        const existing = existingContent.find((c: { key: string; content?: string }) => c.key === expected.key);
        
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
            Click &ldquo;Check Status&rdquo; to analyze homepage content
          </div>
        )}
      </CardContent>
    </Card>
  );
}
