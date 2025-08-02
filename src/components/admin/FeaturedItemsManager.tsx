"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  RefreshCw, 
  Save,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Home
} from 'lucide-react';
import { toast } from 'sonner';

interface FeaturedItem {
  id: string;
  name: string;
  shortDescription?: string;
  mainImageUrl?: string;
  capacity?: number;
  price?: number;
  durationDays?: number;
  isFeaturedOnHomepage: boolean;
  homepageOrder?: number;
}

interface FeaturedItemsManagerProps {
  className?: string;
}

export function FeaturedItemsManager({ className }: FeaturedItemsManagerProps) {
  const [activeTab, setActiveTab] = useState('dahabiyat');
  const [dahabiyat, setDahabiyat] = useState<FeaturedItem[]>([]);
  const [packages, setPackages] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      // Load all dahabiyat
      const dahabiyatResponse = await fetch('/api/dahabiyas?limit=100');
      if (dahabiyatResponse.ok) {
        const dahabiyatData = await dahabiyatResponse.json();
        setDahabiyat(dahabiyatData.dahabiyas || []);
      }

      // Load all packages
      const packagesResponse = await fetch('/api/packages?limit=100');
      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json();
        setPackages(packagesData.packages || []);
      }
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (type: 'dahabiya' | 'package', id: string, currentStatus: boolean) => {
    setSaving(id);
    try {
      console.log(`🎯 Toggling featured status:`, { type, id, currentStatus });

      const endpoint = type === 'dahabiya' ? `/api/dahabiyat/${id}/featured` : `/api/packages/${id}/featured`;
      const payload = {
        isFeaturedOnHomepage: !currentStatus,
        homepageOrder: !currentStatus ? getNextOrder(type) : null
      };

      console.log(`📡 Making request to ${endpoint}:`, payload);

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log(`📥 Response status: ${response.status}`);

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Success result:`, result);
        toast.success(`${type === 'dahabiya' ? 'Dahabiya' : 'Package'} ${!currentStatus ? 'added to' : 'removed from'} homepage`);
        loadItems(); // Reload to get updated data
      } else {
        const errorData = await response.json();
        console.error(`❌ Error response:`, errorData);
        throw new Error(`Failed to update featured status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error updating featured status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update featured status';
      toast.error(errorMessage);
    } finally {
      setSaving(null);
    }
  };

  const updateOrder = async (type: 'dahabiya' | 'package', id: string, newOrder: number) => {
    setSaving(id);
    try {
      const endpoint = type === 'dahabiya' ? `/api/dahabiyat/${id}/featured` : `/api/packages/${id}/featured`;
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homepageOrder: newOrder
        }),
      });

      if (response.ok) {
        toast.success('Order updated successfully');
        loadItems();
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setSaving(null);
    }
  };

  const getNextOrder = (type: 'dahabiya' | 'package') => {
    const items = type === 'dahabiya' ? dahabiyat : packages;
    const featuredItems = items.filter(item => item.isFeaturedOnHomepage);
    const maxOrder = Math.max(...featuredItems.map(item => item.homepageOrder || 0), 0);
    return maxOrder + 1;
  };

  const renderItemCard = (item: FeaturedItem, type: 'dahabiya' | 'package') => {
    const isSaving = saving === item.id;
    const isFeatured = item.isFeaturedOnHomepage;

    return (
      <Card key={item.id} className={`mb-4 ${isFeatured ? 'border-blue-500 bg-blue-50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {item.mainImageUrl && (
                <img 
                  src={item.mainImageUrl} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600 line-clamp-1">{item.shortDescription}</p>
                <div className="flex items-center gap-2 mt-1">
                  {type === 'dahabiya' && item.capacity && (
                    <Badge variant="secondary">{item.capacity} guests</Badge>
                  )}
                  {type === 'package' && item.durationDays && (
                    <Badge variant="secondary">{item.durationDays} days</Badge>
                  )}
                  {item.price && (
                    <Badge variant="outline">${item.price}</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isFeatured && (
                <>
                  <Input
                    type="number"
                    value={item.homepageOrder || 1}
                    onChange={(e) => updateOrder(type, item.id, parseInt(e.target.value))}
                    className="w-16 h-8"
                    min="1"
                    disabled={isSaving}
                  />
                  <Badge className="bg-blue-600 text-white">
                    <Home className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </>
              )}
              
              <Button
                size="sm"
                variant={isFeatured ? "destructive" : "default"}
                onClick={() => toggleFeatured(type, item.id, isFeatured)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : isFeatured ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {isFeatured ? 'Remove' : 'Feature'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading items...</span>
      </div>
    );
  }

  const featuredDahabiyat = dahabiyat.filter(d => d.isFeaturedOnHomepage).sort((a, b) => (a.homepageOrder || 0) - (b.homepageOrder || 0));
  const featuredPackages = packages.filter(p => p.isFeaturedOnHomepage).sort((a, b) => (a.homepageOrder || 0) - (b.homepageOrder || 0));

  return (
    <div className={className}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Featured Items Manager</h1>
        <p className="text-gray-600">
          Manage which dahabiyat and packages appear on the homepage. Featured items are displayed in the order you specify.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dahabiyat">
            Dahabiyat ({featuredDahabiyat.length} featured)
          </TabsTrigger>
          <TabsTrigger value="packages">
            Packages ({featuredPackages.length} featured)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dahabiyat" className="mt-6">
          <div className="space-y-4">
            {dahabiyat.map((item) => renderItemCard(item, 'dahabiya'))}
          </div>
        </TabsContent>

        <TabsContent value="packages" className="mt-6">
          <div className="space-y-4">
            {packages.map((item) => renderItemCard(item, 'package'))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
