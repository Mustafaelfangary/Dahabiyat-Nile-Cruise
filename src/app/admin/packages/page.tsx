"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import MediaPicker from '@/components/admin/MediaPicker';

// Custom styles for form inputs to force white backgrounds
const forceWhiteInputStyle = {
  backgroundColor: '#ffffff',
  border: '2px solid #d4af37',
  color: '#000000',
  borderRadius: '6px',
} as React.CSSProperties;

interface Package {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  durationDays: number;
  mainImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface PackageFormData {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  durationDays: number;
  mainImageUrl: string;
}

const STATIC_PACKAGES = [
  {
    name: 'Luxury Nile Experience',
    description: 'Indulge in the ultimate luxury Nile cruise experience aboard our finest dahabiya. This premium package includes opulent accommodations, gourmet dining, private guided tours, and exclusive access to Egypt\'s most magnificent temples and monuments.',
    shortDescription: 'Ultimate luxury Nile cruise with opulent accommodations and exclusive experiences',
    price: 3200,
    durationDays: 8,
    mainImageUrl: '/images/packages/luxury-nile-experience.jpg'
  },
  {
    name: 'Classic Egypt Explorer',
    description: 'Discover the timeless wonders of Egypt on this comprehensive Nile journey. Visit iconic temples, explore ancient tombs, and experience traditional Egyptian culture while sailing on an authentic dahabiya.',
    shortDescription: 'Comprehensive Nile journey exploring iconic temples and ancient Egyptian culture',
    price: 2400,
    durationDays: 7,
    mainImageUrl: '/images/packages/classic-egypt-explorer.jpg'
  },
  {
    name: 'Cultural Discovery',
    description: 'Immerse yourself in authentic Egyptian culture on this enriching Nile adventure. Experience local traditions, meet Nubian communities, participate in cultural workshops, and discover hidden gems along the Nile.',
    shortDescription: 'Authentic cultural immersion with local traditions and Nubian community experiences',
    price: 1800,
    durationDays: 6,
    mainImageUrl: '/images/packages/cultural-discovery.jpg'
  },
  {
    name: 'Adventure Explorer',
    description: 'Perfect for adventurous spirits, this active Nile journey combines traditional sailing with exciting activities. Explore hidden temples, hike desert landscapes, enjoy water sports, and experience the thrill of authentic Egyptian adventure.',
    shortDescription: 'Active Nile adventure combining traditional sailing with exciting outdoor activities',
    price: 1400,
    durationDays: 5,
    mainImageUrl: '/images/packages/adventure-explorer.jpg'
  }
];

export default function PackagesManagement() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const queryClient = useQueryClient();

  // Fetch packages
  const { data: packagesResponse, isLoading, error } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: async () => {
      console.log('Fetching packages from /api/packages');
      const response = await fetch('/api/packages');
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }

      const data = await response.json();
      console.log('Packages data:', data);
      return data;
    },
    enabled: !!session,
  });

  const packages = packagesResponse?.packages || [];

  // Create package mutation
  const createMutation = useMutation({
    mutationFn: (data: PackageFormData) =>
      fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      toast.success('Package created successfully');
      setIsOpen(false);
      // Reset form by closing and reopening dialog
      setTimeout(() => {
        document.querySelector('form')?.reset();
      }, 100);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create package');
    },
  });

  // Delete package mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch('/api/packages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      toast.success('Package deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete package');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: PackageFormData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      shortDescription: formData.get('shortDescription') as string,
      price: parseFloat(formData.get('price') as string),
      durationDays: parseInt(formData.get('durationDays') as string),
      mainImageUrl: formData.get('mainImageUrl') as string,
    };

    createMutation.mutate(data);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleMigration = async () => {
    if (!window.confirm('This will create 4 package records from your static pages. Continue?')) {
      return;
    }

    setIsMigrating(true);
    let successCount = 0;
    let errorCount = 0;

    for (const pkg of STATIC_PACKAGES) {
      try {
        const response = await fetch('/api/packages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pkg),
        });

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error migrating ${pkg.name}:`, error);
        errorCount++;
      }
    }

    setIsMigrating(false);

    if (errorCount === 0) {
      toast.success(`Successfully migrated all ${successCount} packages!`);
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
    } else {
      toast.error(`Migration completed with ${errorCount} errors. ${successCount} packages migrated successfully.`);
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>;
  }

  if (status === 'unauthenticated') {
    return <div>Access denied. Please sign in.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 bg-ocean-blue hover:bg-amber-600 text-black font-bold py-2 px-4 rounded transition-colors"
          >
            ← Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-ocean-blue">📦 Packages Management</h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleMigration}
            disabled={isMigrating}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            {isMigrating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Migrating...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Migrate Static Pages
              </>
            )}
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setEditingPackage(null)}
                className="bg-ocean-blue hover:bg-amber-600 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Package
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-ocean-blue">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingPackage?.name}
                  required
                  placeholder="e.g., Luxury Nile Experience"
                  style={forceWhiteInputStyle}
                />
              </div>
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={editingPackage?.shortDescription}
                  placeholder="Brief description for cards and previews"
                  style={forceWhiteInputStyle}
                />
              </div>
              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingPackage?.description}
                  required
                  rows={4}
                  placeholder="Detailed package description"
                  style={forceWhiteInputStyle}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingPackage?.price}
                    required
                    placeholder="1500.00"
                    style={forceWhiteInputStyle}
                  />
                </div>
                <div>
                  <Label htmlFor="durationDays">Duration (Days)</Label>
                  <Input
                    id="durationDays"
                    name="durationDays"
                    type="number"
                    defaultValue={editingPackage?.durationDays}
                    required
                    placeholder="7"
                    style={forceWhiteInputStyle}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="mainImageUrl">Main Image URL</Label>
                <Input
                  id="mainImageUrl"
                  name="mainImageUrl"
                  defaultValue={editingPackage?.mainImageUrl}
                  placeholder="/images/packages/luxury-package.jpg"
                  style={forceWhiteInputStyle}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="bg-ocean-blue hover:bg-amber-600 text-black"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    editingPackage ? 'Update Package' : 'Create Package'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-text-primary">Error loading packages: {error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg: Package) => (
            <Card key={pkg.id} className="border-ocean-blue/30">
              <CardHeader>
                <CardTitle className="text-ocean-blue">{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-primary mb-4 line-clamp-3">
                  {pkg.shortDescription || pkg.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Price:</strong> ${pkg.price}</div>
                  <div><strong>Duration:</strong> {pkg.durationDays} days</div>
                  <div><strong>Created:</strong> {new Date(pkg.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/packages/${pkg.id}`, '_blank')}
                    className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-black"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingPackage(pkg);
                      setIsOpen(true);
                    }}
                    className="bg-ocean-blue hover:bg-amber-600 text-black"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(pkg.id, pkg.name)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {packages.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-text-primary mb-2">No packages found</h3>
          <p className="text-text-primary mb-4">Create your first package to get started.</p>
          <Button 
            onClick={() => setIsOpen(true)}
            className="bg-ocean-blue hover:bg-amber-600 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Package
          </Button>
        </div>
      )}
    </div>
  );
}
