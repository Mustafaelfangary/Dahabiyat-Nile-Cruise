/**
 * Dahabiya List Screen - Ocean Blue Theme
 * Displays dynamic list of dahabiyas from API
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import services
import { apiService, Dahabiya } from '../services/ApiService';

interface DahabiyaItemProps {
  dahabiya: Dahabiya;
  onPress: () => void;
}

const DahabiyaItem: React.FC<DahabiyaItemProps> = ({ dahabiya, onPress }) => (
  <TouchableOpacity style={styles.dahabiyaItem} onPress={onPress}>
    <Image 
      source={{ uri: apiService.getImageUrl(dahabiya.mainImage) }}
      style={styles.dahabiyaImage}
      defaultSource={{ uri: apiService.getImageUrl('/images/default-placeholder.svg') }}
    />
    <View style={styles.dahabiyaContent}>
      <View style={styles.dahabiyaHeader}>
        <Text style={styles.dahabiyaName}>{dahabiya.name}</Text>
        {dahabiya.isFeatured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.dahabiyaDescription} numberOfLines={2}>
        {dahabiya.shortDescription || dahabiya.description}
      </Text>
      
      <View style={styles.dahabiyaDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="people" size={16} color="#0080ff" />
          <Text style={styles.detailText}>Up to {dahabiya.capacity} guests</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="bed" size={16} color="#0080ff" />
          <Text style={styles.detailText}>{dahabiya.cabins} cabins</Text>
        </View>
      </View>
      
      <View style={styles.dahabiyaFooter}>
        <Text style={styles.dahabiyaPrice}>${dahabiya.pricePerDay}/day</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{dahabiya.rating}</Text>
          <Text style={styles.reviewText}>({dahabiya.reviewCount} reviews)</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const DahabiyaListScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>([]);

  useEffect(() => {
    loadDahabiyas();
  }, []);

  const loadDahabiyas = async () => {
    try {
      setLoading(true);
      const result = await apiService.getDahabiyas();
      setDahabiyas(result.filter(d => d.isActive));
    } catch (error) {
      console.error('Error loading dahabiyas:', error);
      Alert.alert(
        'Connection Error',
        'Unable to load dahabiyas. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDahabiyas();
    setRefreshing(false);
  };

  const renderDahabiya = ({ item }: { item: Dahabiya }) => (
    <DahabiyaItem
      dahabiya={item}
      onPress={() => navigation.navigate('DahabiyaDetail', { id: item.id } as never)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Dahabiyas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0080ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Dahabiyas</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={dahabiyas}
        renderItem={renderDahabiya}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="boat" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No dahabiyas available</Text>
            <Text style={styles.emptySubtext}>Please check back later</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#0080ff',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  listContent: {
    padding: 20,
  },
  dahabiyaItem: {
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
  dahabiyaImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  dahabiyaContent: {
    padding: 15,
  },
  dahabiyaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dahabiyaName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 4,
    fontWeight: '500',
  },
  dahabiyaDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  dahabiyaDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  dahabiyaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dahabiyaPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0080ff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
  reviewText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default DahabiyaListScreen;
