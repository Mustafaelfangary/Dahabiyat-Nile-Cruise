"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Calendar,
  Users,
  Ship,
  Package,
  Clock,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Bell,
  MessageSquare
} from 'lucide-react';

interface Booking {
  id: string;
  bookingReference: string;
  type: 'DAHABIYA' | 'PACKAGE';
  dahabiyaId?: string;
  packageId?: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  dahabiya?: {
    id: string;
    name: string;
    mainImageUrl?: string;
    pricePerDay: number;
  };
  package?: {
    id: string;
    name: string;
    mainImageUrl?: string;
    price: number;
  };
  guestDetails?: any[];
}

interface BookingFilters {
  status?: string;
  type?: string;
  dateRange?: string;
  search?: string;
}

export default function EnhancedBookingManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BookingFilters>({});
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/admin/bookings?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update booking status');
      
      toast.success('Booking status updated successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PARTIAL': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'REFUNDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleExportBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.bookingType) params.append('bookingType', filters.bookingType);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);

      const response = await fetch(`/api/admin/export/bookings?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookings-export-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to export bookings');
      }
    } catch (error) {
      console.error('Error exporting bookings:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Booking Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage all dahabiya and package bookings</p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-3"
            onClick={handleExportBookings}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="flex items-center gap-2 bg-ocean-blue hover:bg-blue-600 px-3">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="w-full">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="booking-search"
                name="search"
                placeholder="Search bookings..."
                className="pl-10 text-sm"
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            <Select value={filters.status || 'ALL'} onValueChange={(value) => setFilters({ ...filters, status: value === 'ALL' ? undefined : value })}>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 focus:border-blue-500 text-sm h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                <SelectItem value="ALL" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">All Statuses</SelectItem>
                <SelectItem value="PENDING" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">Pending</SelectItem>
                <SelectItem value="CONFIRMED" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">Confirmed</SelectItem>
                <SelectItem value="CANCELLED" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">Cancelled</SelectItem>
                <SelectItem value="COMPLETED" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type || 'ALL'} onValueChange={(value) => setFilters({ ...filters, type: value === 'ALL' ? undefined : value })}>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 focus:border-blue-500 text-sm h-10">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                <SelectItem value="ALL" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">All Types</SelectItem>
                <SelectItem value="DAHABIYA" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">Dahabiya</SelectItem>
                <SelectItem value="PACKAGE" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">Package</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.dateRange || 'ALL'} onValueChange={(value) => setFilters({ ...filters, dateRange: value === 'ALL' ? undefined : value })}>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 focus:border-blue-500 text-sm h-10">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                <SelectItem value="ALL" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">All Dates</SelectItem>
                <SelectItem value="today" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">Today</SelectItem>
                <SelectItem value="week" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">This Week</SelectItem>
                <SelectItem value="month" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">This Month</SelectItem>
                <SelectItem value="upcoming" className="hover:bg-gray-50 focus:bg-gray-50 text-sm">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="w-5 h-5" />
            Bookings ({bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-blue"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500 px-4">
              No bookings found matching your criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm">Customer</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm">Booking</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm">Dates</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm">Guests</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm">Status</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm">Total</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{booking.user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {booking.user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.bookingReference}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {booking.type === 'DAHABIYA' ? (
                            <Ship className="w-4 h-4 text-ocean-blue" />
                          ) : (
                            <Package className="w-4 h-4 text-ocean-blue" />
                          )}
                          <div>
                            <div className="font-medium">
                              {booking.dahabiya?.name || booking.package?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div>{formatDate(booking.startDate)}</div>
                          <div className="text-gray-500">to {formatDate(booking.endDate)}</div>
                          <div className="text-xs text-gray-400">
                            {calculateDuration(booking.startDate, booking.endDate)} days
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          {booking.guests}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          {booking.totalPrice.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select
                            value={booking.status}
                            onValueChange={(value) => updateBookingStatus(booking.id, value)}
                          >
                            <SelectTrigger className="w-32 bg-white border-gray-200 hover:border-gray-300 focus:border-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                              <SelectItem value="PENDING" className="hover:bg-gray-50 focus:bg-gray-50">Pending</SelectItem>
                              <SelectItem value="CONFIRMED" className="hover:bg-gray-50 focus:bg-gray-50">Confirmed</SelectItem>
                              <SelectItem value="CANCELLED" className="hover:bg-gray-50 focus:bg-gray-50">Cancelled</SelectItem>
                              <SelectItem value="COMPLETED" className="hover:bg-gray-50 focus:bg-gray-50">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
