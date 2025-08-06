/**
 * Booking History Screen
 * User's booking history and status
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookingCardProps {
  booking: {
    id: string;
    dahabiya: string;
    itinerary: string;
    dates: string;
    status: 'Completed' | 'Upcoming' | 'Cancelled';
    price: string;
    image: string;
    guests: number;
  };
  onPress: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#4CAF50';
      case 'Upcoming': return '#0080ff';
      case 'Cancelled': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return 'checkmark-circle';
      case 'Upcoming': return 'time';
      case 'Cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  return (
    <TouchableOpacity style={styles.bookingCard} onPress={onPress}>
      <Image source={{ uri: booking.image }} style={styles.bookingImage} />
      
      <View style={styles.bookingContent}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingTitle}>{booking.dahabiya}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
            <Ionicons name={getStatusIcon(booking.status) as any} size={14} color="#ffffff" />
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>
        </View>
        
        <Text style={styles.itineraryText}>{booking.itinerary}</Text>
        
        <View style={styles.bookingDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{booking.dates}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{booking.guests} Guests</Text>
          </View>
        </View>
        
        <View style={styles.bookingFooter}>
          <Text style={styles.priceText}>{booking.price}</Text>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#0080ff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BookingHistoryScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  const filters = ['All', 'Upcoming', 'Completed', 'Cancelled'];
  
  const bookings = [
    {
      id: '1',
      dahabiya: 'Nile Princess',
      itinerary: 'Luxor to Aswan - Classic Journey',
      dates: 'Dec 15-22, 2024',
      status: 'Upcoming' as const,
      price: '$2,400',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
      guests: 2,
    },
    {
      id: '2',
      dahabiya: 'Golden Pharaoh',
      itinerary: 'Cairo to Aswan - Luxury Experience',
      dates: 'Aug 10-20, 2024',
      status: 'Completed' as const,
      price: '$3,200',
      image: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400',
      guests: 4,
    },
    {
      id: '3',
      dahabiya: 'Nile Explorer',
      itinerary: 'Aswan to Luxor - Cultural Tour',
      dates: 'Mar 5-12, 2024',
      status: 'Completed' as const,
      price: '$1,800',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
      guests: 2,
    },
    {
      id: '4',
      dahabiya: 'Desert Rose',
      itinerary: 'Luxor to Kom Ombo - Adventure',
      dates: 'Jan 20-27, 2024',
      status: 'Cancelled' as const,
      price: '$2,100',
      image: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400',
      guests: 3,
    },
  ];

  const filteredBookings = selectedFilter === 'All' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedFilter);

  const handleBookingPress = (booking: any) => {
    console.log('Navigate to booking details:', booking.id);
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const completed = bookings.filter(b => b.status === 'Completed').length;
    const upcoming = bookings.filter(b => b.status === 'Upcoming').length;
    const cancelled = bookings.filter(b => b.status === 'Cancelled').length;
    
    return { total, completed, upcoming, cancelled };
  };

  const stats = getBookingStats();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Track your Nile adventures</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.upcoming}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.cancelled}</Text>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.activeFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bookings List */}
      <ScrollView style={styles.bookingsContainer}>
        {filteredBookings.length > 0 ? (
          <View style={styles.bookingsList}>
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onPress={() => handleBookingPress(booking)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="boat-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'All' 
                ? 'You haven\'t made any bookings yet'
                : `No ${selectedFilter.toLowerCase()} bookings found`
              }
            </Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore Dahabiyat</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#0080ff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e6f3ff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    marginTop: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0080ff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    marginTop: 1,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#0080ff',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  bookingsContainer: {
    flex: 1,
  },
  bookingsList: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  bookingImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  bookingContent: {
    padding: 20,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 4,
  },
  itineraryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0080ff',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0080ff',
    marginRight: 5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#0080ff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default BookingHistoryScreen;
