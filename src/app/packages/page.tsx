"use client";
export const dynamic = "force-dynamic";

import Image from 'next/image';
import Link from 'next/link';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Switch, FormControlLabel } from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Star, Users, Calendar, MapPin, Anchor, Sparkles, Gift, Crown, Globe, Search, Filter, SortAsc, SortDesc, Eye, BookOpen, Package as PackageIcon, Edit, Delete, Add } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useEffect, useState } from 'react';
import {
  HieroglyphicDivider,
  PharaonicCard,
  PharaonicButton,
  PharaonicBorder,
  PharaonicObelisk,
  PharaonicPatternBackground,
  PharaonicCrown,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';

interface Package {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  durationDays: number;
  mainImageUrl?: string;
  category?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  maxGuests?: number;
  highlights?: string[];
  includes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function PackagesPage() {
  const { getContent, getContentBlock, loading, error } = useContent({ page: 'packages' });
  const [packages, setPackages] = useState<Package[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Fetch packages data
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages?limit=100');
        if (response.ok) {
          const data = await response.json();
          setPackages(data.packages || data || []);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Filter and sort packages
  useEffect(() => {
    let filtered = [...packages];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === categoryFilter);
    }

    // Apply featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(pkg => pkg.isFeatured);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'duration':
          aValue = a.durationDays;
          bValue = b.durationDays;
          break;
        case 'created':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredPackages(filtered);
  }, [packages, searchQuery, categoryFilter, showFeaturedOnly, sortBy, sortOrder]);

  // Get unique categories
  const categories = Array.from(new Set(packages.map(pkg => pkg.category).filter(Boolean)));

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSettingValue = (key: string, defaultValue: string = '') => {
    // First try to get from content, then fall back to default value
    return getContent(key, defaultValue);
  };

  if (loading || packagesLoading) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <EgyptHieroglyphic className="mx-auto mb-6" size="4rem" />
          <p className="pharaonic-text-brown font-bold text-xl">{getContent('packages_loading_text', 'Loading Packages...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <div className="text-text-secondary text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-text-primary font-bold text-xl">{getContent('packages_error_text', '𓂀 Content Loading Error:')} {error} 𓏏</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <PackageIcon className="w-8 h-8 text-egyptian-gold" />
              {getContent('packages_title', 'Royal Packages')}
            </h1>
            <p className="text-gray-600">{getContent('packages_subtitle', 'Discover our curated collection of luxury Nile experiences')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('grid')}
              size="small"
              className="min-w-0"
            >
              <Gift className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
              size="small"
              className="min-w-0"
            >
              <BookOpen className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search className="w-4 h-4 mr-2 text-gray-400" />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="price">Price</MenuItem>
                    <MenuItem value="duration">Duration</MenuItem>
                    <MenuItem value="created">Date Created</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  onClick={handleSortToggle}
                  startIcon={sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  size="small"
                  fullWidth
                >
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showFeaturedOnly}
                      onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Featured Only"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <Typography variant="body2" color="text.secondary">
            Showing {filteredPackages.length} of {packages.length} packages
          </Typography>
          <div className="flex items-center gap-2">
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                onDelete={() => setSearchQuery('')}
                size="small"
                variant="outlined"
              />
            )}
            {categoryFilter !== 'all' && (
              <Chip
                label={`Category: ${categoryFilter}`}
                onDelete={() => setCategoryFilter('all')}
                size="small"
                variant="outlined"
              />
            )}
            {showFeaturedOnly && (
              <Chip
                label="Featured Only"
                onDelete={() => setShowFeaturedOnly(false)}
                size="small"
                variant="outlined"
              />
            )}
          </div>
        </div>

        {/* Content Section */}
        {viewMode === 'grid' ? (
          /* Grid View */
          <Grid container spacing={3}>
            {filteredPackages.length > 0 ? (
              filteredPackages.map((pkg, index) => (
                <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-egyptian-gold/20">
                    <CardMedia
                      component="div"
                      className="h-48 relative overflow-hidden"
                    >
                      <Image
                        src={pkg.mainImageUrl || '/images/placeholder-package.jpg'}
                        alt={pkg.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-egyptian-gold text-hieroglyph-brown px-2 py-1 rounded-full text-xs font-bold">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {pkg.durationDays} Days
                      </div>
                      {pkg.isFeatured && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          <Star className="w-3 h-3 inline mr-1" />
                          Featured
                        </div>
                      )}
                    </CardMedia>
                    <CardContent className="p-4">
                      <Typography variant="h6" className="font-bold text-gray-900 mb-2 line-clamp-1">
                        {pkg.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" className="mb-3 line-clamp-2">
                        {pkg.shortDescription || 'Discover the wonders of ancient Egypt with this luxury experience.'}
                      </Typography>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{pkg.maxGuests || 'N/A'}</span>
                          </div>
                          {pkg.category && (
                            <Chip label={pkg.category} size="small" variant="outlined" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Typography variant="h6" className="font-bold text-egyptian-gold">
                          ${pkg.price.toLocaleString()}
                        </Typography>
                        <div className="flex gap-1">
                          <IconButton size="small" component={Link} href={`/packages/${pkg.id}`}>
                            <Eye className="w-4 h-4" />
                          </IconButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Card className="p-8 text-center">
                  <PackageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <Typography variant="h6" color="text.secondary" className="mb-2">
                    No packages found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery || categoryFilter !== 'all' || showFeaturedOnly
                      ? 'Try adjusting your filters to see more results.'
                      : 'No packages are currently available.'}
                  </Typography>
                </Card>
              </Grid>
            )}
          </Grid>
        ) : (
          /* Table View */
          <TableContainer component={Paper} className="shadow-lg">
            <Table>
              <TableHead className="bg-gray-50">
                <TableRow>
                  <TableCell><strong>Package</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Duration</strong></TableCell>
                  <TableCell><strong>Max Guests</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id} hover>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded overflow-hidden">
                          <Image
                            src={pkg.mainImageUrl || '/images/placeholder-package.jpg'}
                            alt={pkg.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Typography variant="subtitle2" className="font-bold">
                            {pkg.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {pkg.shortDescription?.substring(0, 50)}...
                          </Typography>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {pkg.category ? (
                        <Chip label={pkg.category} size="small" variant="outlined" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {pkg.durationDays} days
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        {pkg.maxGuests || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" className="font-bold text-egyptian-gold">
                        ${pkg.price.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {pkg.isFeatured && (
                          <Chip
                            label="Featured"
                            size="small"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          />
                        )}
                        <Chip
                          label={pkg.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={pkg.isActive ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" component={Link} href={`/packages/${pkg.id}`}>
                        <Eye className="w-4 h-4" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}