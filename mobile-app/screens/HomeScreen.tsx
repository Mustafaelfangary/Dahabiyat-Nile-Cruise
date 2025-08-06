/**
 * Home Screen for Dahabiyat Mobile App
 * Displays dynamic content from production API - Ocean Blue Theme
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import services and configuration
import { apiService, Dahabiya, Package, WebsiteContent } from '../services/ApiService';
import { DEBUG_MODE, WEBSITE_URL } from '../config/environment';

const { width: screenWidth } = Dimensions.get('window');

interface FeaturedItemProps {
  item: Dahabiya | Package;
  type: 'dahabiya' | 'package';
  onPress: () => void;
}

const FeaturedItem: React.FC<FeaturedItemProps> = ({ item, type, onPress }) => (
  <TouchableOpacity style={styles.featuredItem} onPress={onPress}>
    <Image 
      source={{ uri: apiService.getImageUrl(type === 'dahabiya' ? (item as Dahabiya).mainImage : (item as Package).mainImageUrl) }} 
      style={styles.featuredImage}
      defaultSource={{ uri: apiService.getImageUrl('/images/default-placeholder.svg') }}
    />
    <View style={styles.featuredContent}>
      <Text style={styles.featuredTitle}>{item.name}</Text>
      <Text style={styles.featuredDescription} numberOfLines={2}>
        {item.shortDescription || item.description}
      </Text>
      <View style={styles.featuredFooter}>
        <Text style={styles.featuredPrice}>
          {type === 'dahabiya' 
            ? `$${(item as Dahabiya).pricePerDay}/day` 
            : `$${(item as Package).price}`
          }
        </Text>
        <View style={styles.featuredRating}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>
            {type === 'dahabiya' ? (item as Dahabiya).rating : '4.8'}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>({});
  const [featuredDahabiyas, setFeaturedDahabiyas] = useState<Dahabiya[]>([]);
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);

  // Data fetching
  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      if (DEBUG_MODE) {
        console.log(`🏠 Loading home data from: ${WEBSITE_URL}`);
      }
      
      // Fetch all data in parallel
      const [contentResult, dahabiyasResult, packagesResult] = await Promise.allSettled([
        apiService.getWebsiteContent(),
        apiService.getFeaturedDahabiyas(),
        apiService.getFeaturedPackages(),
      ]);

      // Handle website content
      if (contentResult.status === 'fulfilled') {
        setWebsiteContent(contentResult.value);
        if (DEBUG_MODE) {
          console.log('✅ Website content loaded successfully');
        }
      } else {
        console.warn('⚠️ Failed to fetch website content:', contentResult.reason);
      }

      // Handle featured dahabiyas
      if (dahabiyasResult.status === 'fulfilled') {
        setFeaturedDahabiyas(dahabiyasResult.value);
        if (DEBUG_MODE) {
          console.log(`✅ Loaded ${dahabiyasResult.value.length} featured dahabiyas`);
        }
      } else {
        console.warn('⚠️ Failed to fetch featured dahabiyas:', dahabiyasResult.reason);
      }

      // Handle featured packages
      if (packagesResult.status === 'fulfilled') {
        setFeaturedPackages(packagesResult.value);
        if (DEBUG_MODE) {
          console.log(`✅ Loaded ${packagesResult.value.length} featured packages`);
        }
      } else {
        console.warn('⚠️ Failed to fetch featured packages:', packagesResult.reason);
      }

    } catch (error) {
      console.error('❌ Error loading home data:', error);
      Alert.alert(
        'Connection Error',
        'Unable to load content from dahabiyatnilecruise.com. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={{ uri: apiService.getLogo() }}
          style={styles.loadingLogo}
        />
        <Text style={styles.loadingText}>Loading from dahabiyatnilecruise.com...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: apiService.getLogo() }}
            style={styles.heroLogo}
            defaultSource={{ uri: apiService.getImageUrl('/images/logo.png') }}
          />
          <Text style={styles.heroTitle}>
            {websiteContent.hero_title || 'Discover Ancient Egypt'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {websiteContent.hero_subtitle || 'Experience the timeless beauty of the Nile River'}
          </Text>
          <Text style={styles.heroDescription}>
            {websiteContent.hero_description || 'Sail through history aboard our traditional vessels'}
          </Text>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('DahabiyaList' as never)}
            >
              <Text style={styles.primaryButtonText}>Explore Dahabiyas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('PackageList' as never)}
            >
              <Text style={styles.secondaryButtonText}>View Packages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Dahabiyas Section */}
        {featuredDahabiyas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Dahabiyas</Text>
            <Text style={styles.sectionSubtitle}>Luxury vessels for your Nile journey</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {featuredDahabiyas.map((dahabiya) => (
                <FeaturedItem
                  key={dahabiya.id}
                  item={dahabiya}
                  type="dahabiya"
                  onPress={() => navigation.navigate('DahabiyaDetail', { id: dahabiya.id } as never)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Featured Packages Section */}
        {featuredPackages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Packages</Text>
            <Text style={styles.sectionSubtitle}>Carefully crafted journeys through ancient Egypt</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {featuredPackages.map((pkg) => (
                <FeaturedItem
                  key={pkg.id}
                  item={pkg}
                  type="package"
                  onPress={() => navigation.navigate('PackageDetail', { id: pkg.id } as never)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* What is a Dahabiya Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is a Dahabiya?</Text>
          <Text style={styles.sectionDescription}>
            A dahabiya is a traditional Egyptian sailing boat that offers an intimate and authentic way to explore the Nile River. 
            These elegant vessels combine traditional design with modern luxury amenities.
          </Text>
          
          <TouchableOpacity
            style={styles.learnMoreButton}
            onPress={() => navigation.navigate('About' as never)}
          >
            <Text style={styles.learnMoreButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>

        {/* Company Info */}
        <View style={styles.companySection}>
          <Text style={styles.companyName}>
            {websiteContent.company_name || 'Dahabiyat Nile Cruise'}
          </Text>
          <Text style={styles.companyDescription}>
            {websiteContent.company_description || 'Experience the magic of ancient Egypt with our luxury dahabiya cruises'}
          </Text>
          <Text style={styles.websiteLink}>
            Visit us at: dahabiyatnilecruise.com
          </Text>
        </View>
      </ScrollView>
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
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#0080ff',
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroSection: {
    backgroundColor: '#0080ff',
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  heroLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#e6f3ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroDescription: {
    fontSize: 16,
    color: '#e6f3ff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  primaryButtonText: {
    color: '#0080ff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    paddingVertical: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 20,
    lineHeight: 24,
    marginBottom: 20,
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  featuredItem: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  featuredContent: {
    padding: 15,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0080ff',
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  learnMoreButton: {
    backgroundColor: '#0080ff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  learnMoreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  companySection: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0080ff',
    marginBottom: 10,
    textAlign: 'center',
  },
  companyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  websiteLink: {
    fontSize: 14,
    color: '#0080ff',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default HomeScreen;
