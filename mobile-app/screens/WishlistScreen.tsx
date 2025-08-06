/**
 * Wishlist Screen
 * User's saved dahabiyat and packages
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WishlistItemProps {
  item: {
    id: string;
    name: string;
    type: 'Dahabiya' | 'Package';
    price: string;
    image: string;
    rating: number;
    reviews: number;
    description: string;
  };
  onRemove: (id: string) => void;
  onBook: (id: string) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ item, onRemove, onBook }) => {
  const handleRemove = () => {
    Alert.alert(
      'Remove from Wishlist',
      `Remove ${item.name} from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => onRemove(item.id) },
      ]
    );
  };

  return (
    <View style={styles.wishlistItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.itemMeta}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.reviewsText}>({item.reviews})</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <Ionicons name="heart" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.itemFooter}>
          <Text style={styles.priceText}>From {item.price}</Text>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => onBook(item.id)}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const WishlistScreen: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: '1',
      name: 'Nile Princess',
      type: 'Dahabiya' as const,
      price: '$1,200/night',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
      rating: 4.8,
      reviews: 124,
      description: 'Luxury dahabiya with traditional Egyptian design and modern amenities. Perfect for romantic getaways.',
    },
    {
      id: '2',
      name: 'Classic Nile Journey',
      type: 'Package' as const,
      price: '$2,400/person',
      image: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400',
      rating: 4.9,
      reviews: 89,
      description: '7-day luxury cruise from Luxor to Aswan with guided tours to ancient temples and monuments.',
    },
    {
      id: '3',
      name: 'Golden Pharaoh',
      type: 'Dahabiya' as const,
      price: '$1,800/night',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
      rating: 4.7,
      reviews: 156,
      description: 'Premium dahabiya featuring spacious suites, gourmet dining, and personalized service.',
    },
    {
      id: '4',
      name: 'Cultural Heritage Tour',
      type: 'Package' as const,
      price: '$1,800/person',
      image: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400',
      rating: 4.6,
      reviews: 73,
      description: '8-day cultural immersion experience with local artisan workshops and traditional performances.',
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const filters = ['All', 'Dahabiya', 'Package'];

  const filteredItems = selectedFilter === 'All' 
    ? wishlistItems 
    : wishlistItems.filter(item => item.type === selectedFilter);

  const handleRemoveItem = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleBookItem = (id: string) => {
    const item = wishlistItems.find(item => item.id === id);
    Alert.alert(
      'Book Now',
      `Proceed to book ${item?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book', onPress: () => console.log('Navigate to booking:', id) },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Wishlist',
      'Remove all items from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => setWishlistItems([]) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>My Wishlist</Text>
            <Text style={styles.headerSubtitle}>{wishlistItems.length} saved items</Text>
          </View>
          
          {wishlistItems.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {wishlistItems.length > 0 ? (
        <>
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

          {/* Wishlist Items */}
          <ScrollView style={styles.wishlistContainer}>
            <View style={styles.wishlistList}>
              {filteredItems.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onBook={handleBookItem}
                />
              ))}
            </View>
            
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Save your favorite dahabiyat and packages to book them later
          </Text>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore Dahabiyat</Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    marginTop: 20,
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
  wishlistContainer: {
    flex: 1,
  },
  wishlistList: {
    padding: 20,
  },
  wishlistItem: {
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
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  itemContent: {
    padding: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0080ff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  removeButton: {
    padding: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0080ff',
  },
  bookButton: {
    backgroundColor: '#0080ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
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

export default WishlistScreen;
