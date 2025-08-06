/**
 * Package List Screen - Ocean Blue Theme
 * Displays dynamic list of packages from API
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
import { apiService, Package } from '../services/ApiService';

interface PackageItemProps {
  package: Package;
  onPress: () => void;
}

const PackageItem: React.FC<PackageItemProps> = ({ package: pkg, onPress }) => (
  <TouchableOpacity style={styles.packageItem} onPress={onPress}>
    <Image 
      source={{ uri: apiService.getImageUrl(pkg.mainImageUrl) }}
      style={styles.packageImage}
      defaultSource={{ uri: apiService.getImageUrl('/images/default-placeholder.svg') }}
    />
    <View style={styles.packageContent}>
      <View style={styles.packageHeader}>
        <Text style={styles.packageName}>{pkg.name}</Text>
        {pkg.isFeaturedOnHomepage && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.packageDescription} numberOfLines={3}>
        {pkg.shortDescription || pkg.description}
      </Text>
      
      <View style={styles.packageDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color="#0080ff" />
          <Text style={styles.detailText}>{pkg.durationDays} days</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color="#0080ff" />
          <Text style={styles.detailText}>Nile River</Text>
        </View>
      </View>
      
      <View style={styles.packageFooter}>
        <Text style={styles.packagePrice}>${pkg.price}</Text>
        <TouchableOpacity style={styles.viewButton} onPress={onPress}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const PackageListScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const result = await apiService.getPackages();
      setPackages(result.packages);
    } catch (error) {
      console.error('Error loading packages:', error);
      Alert.alert(
        'Connection Error',
        'Unable to load packages. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPackages();
    setRefreshing(false);
  };

  const renderPackage = ({ item }: { item: Package }) => (
    <PackageItem
      package={item}
      onPress={() => navigation.navigate('PackageDetail', { id: item.id } as never)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Packages...</Text>
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
        <Text style={styles.headerTitle}>Travel Packages</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={packages}
        renderItem={renderPackage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="map" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No packages available</Text>
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
  packageItem: {
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
  packageImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  packageContent: {
    padding: 15,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageName: {
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
  packageDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  packageDetails: {
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
  packageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0080ff',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0080ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
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

export default PackageListScreen;
