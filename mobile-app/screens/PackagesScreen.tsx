/**
 * Packages Screen for Dahabiyat Mobile App
 * Displays packages list synchronized with web admin panel
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Card, Heading1, Heading2, BodyText, AccentText } from '../components/ui';
import HieroglyphicText from '../components/HieroglyphicText';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import HieroglyphicTopBanner from '../components/HieroglyphicTopBanner';
import { APP_CONSTANTS } from '../constants/AppConstants';

const { width: screenWidth } = Dimensions.get('window');

interface PackageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
}

interface Package {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  mainImageUrl?: string;
  price?: number;
  duration?: number;
  maxGuests?: number;
  isActive: boolean;
  featured: boolean;
  slug: string;
  highlights?: string[];
}

const PackagesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [content, setContent] = useState<PackageContent>({
    heroTitle: 'Journey Packages',
    heroSubtitle: 'Carefully crafted experiences along the Nile',
    heroDescription: 'Choose from our selection of curated packages for your perfect Egyptian adventure',
    emptyStateTitle: 'No Packages Available',
    emptyStateDescription: 'Our travel experts are crafting new packages for you'
  });
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, featured, short, long

  useEffect(() => {
    fetchContent();
    fetchPackages();
  }, []);

  const fetchContent = async () => {
    try {
      // Try to fetch from content sync API
      const response = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/mobile-content-sync.json`);
      if (response.ok) {
        const data = await response.json();
        const contentData = data.content || {};
        
        setContent({
          heroTitle: contentData['packages_hero_title']?.value || content.heroTitle,
          heroSubtitle: contentData['packages_hero_subtitle']?.value || content.heroSubtitle,
          heroDescription: contentData['packages_hero_description']?.value || content.heroDescription,
          emptyStateTitle: contentData['packages_empty_title']?.value || content.emptyStateTitle,
          emptyStateDescription: contentData['packages_empty_description']?.value || content.emptyStateDescription
        });
      } else {
        // Fallback to direct API call
        const fallbackResponse = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/website-content/packages`);
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          const fields = data.fields || [];
          
          const updatedContent = { ...content };
          fields.forEach((field: any) => {
            switch (field.key) {
              case 'packages_hero_title':
                updatedContent.heroTitle = field.value || updatedContent.heroTitle;
                break;
              case 'packages_hero_subtitle':
                updatedContent.heroSubtitle = field.value || updatedContent.heroSubtitle;
                break;
              case 'packages_hero_description':
                updatedContent.heroDescription = field.value || updatedContent.heroDescription;
                break;
            }
          });
          
          setContent(updatedContent);
        }
      }
    } catch (error) {
      console.log('Using fallback packages content:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/packages`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.log('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContent();
    await fetchPackages();
    setRefreshing(false);
  };

  const filteredPackages = packages.filter(pkg => {
    if (filter === 'all') return pkg.isActive;
    if (filter === 'featured') return pkg.featured && pkg.isActive;
    if (filter === 'short') return pkg.duration && pkg.duration <= 5 && pkg.isActive;
    if (filter === 'long') return pkg.duration && pkg.duration > 7 && pkg.isActive;
    return pkg.isActive;
  });

  const handlePackagePress = (pkg: Package) => {
    // Navigate to package detail screen
    navigation.navigate('PackageDetail', { slug: pkg.slug, id: pkg.id });
  };

  const handleBookNow = (pkg: Package) => {
    navigation.navigate('Booking', { packageId: pkg.id, packageName: pkg.name });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Hieroglyphic Top Banner */}
      <HieroglyphicTopBanner variant="default" animated={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <HieroglyphicText
            text="𓇳 𓈖 𓇳"
            size="large"
            animated={true}
            animationType="pulse"
            style={styles.heroHieroglyphs}
          />
          <Heading1 style={[styles.heroTitle, { color: colors.text.primary }]}>
            {content.heroTitle}
          </Heading1>
          <AccentText style={styles.heroSubtitle}>
            {content.heroSubtitle}
          </AccentText>
          <BodyText style={styles.heroDescription}>
            {content.heroDescription}
          </BodyText>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'all' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setFilter('all')}
            >
              <BodyText style={[
                styles.filterText,
                filter === 'all' && { color: colors.text.inverse }
              ]}>
                All Packages
              </BodyText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'featured' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setFilter('featured')}
            >
              <BodyText style={[
                styles.filterText,
                filter === 'featured' && { color: colors.text.inverse }
              ]}>
                Featured
              </BodyText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'short' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setFilter('short')}
            >
              <BodyText style={[
                styles.filterText,
                filter === 'short' && { color: colors.text.inverse }
              ]}>
                Short (≤5 days)
              </BodyText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'long' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setFilter('long')}
            >
              <BodyText style={[
                styles.filterText,
                filter === 'long' && { color: colors.text.inverse }
              ]}>
                Long (7+ days)
              </BodyText>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Packages List */}
        {filteredPackages.length === 0 ? (
          <View style={styles.emptyState}>
            <HieroglyphicText
              text="𓈖"
              size="large"
              style={styles.emptyStateIcon}
            />
            <Heading2 style={[styles.emptyStateTitle, { color: colors.text.primary }]}>
              {content.emptyStateTitle}
            </Heading2>
            <BodyText style={styles.emptyStateDescription}>
              {content.emptyStateDescription}
            </BodyText>
          </View>
        ) : (
          <View style={styles.packagesList}>
            {filteredPackages.map((pkg, index) => (
              <TouchableOpacity
                key={pkg.id}
                onPress={() => handlePackagePress(pkg)}
                style={styles.packageCard}
              >
                <Card style={styles.card}>
                  <Image
                    source={{ uri: pkg.mainImageUrl || '/images/default-package.jpg' }}
                    style={styles.packageImage}
                    resizeMode="cover"
                  />
                  
                  {pkg.featured && (
                    <View style={[styles.featuredBadge, { backgroundColor: colors.accent }]}>
                      <BodyText style={styles.featuredText}>Featured</BodyText>
                    </View>
                  )}
                  
                  <View style={styles.cardContent}>
                    <AccentText style={[styles.packageName, { color: colors.text.primary }]}>
                      {pkg.name}
                    </AccentText>
                    
                    <BodyText style={styles.packageDescription} numberOfLines={3}>
                      {pkg.shortDescription || pkg.description}
                    </BodyText>
                    
                    <View style={styles.packageSpecs}>
                      {pkg.duration && (
                        <View style={styles.specItem}>
                          <BodyText style={styles.specLabel}>Duration:</BodyText>
                          <BodyText style={styles.specValue}>{pkg.duration} days</BodyText>
                        </View>
                      )}
                      
                      {pkg.maxGuests && (
                        <View style={styles.specItem}>
                          <BodyText style={styles.specLabel}>Max Guests:</BodyText>
                          <BodyText style={styles.specValue}>{pkg.maxGuests}</BodyText>
                        </View>
                      )}
                    </View>
                    
                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <View style={styles.highlightsSection}>
                        <BodyText style={styles.highlightsTitle}>Highlights:</BodyText>
                        {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                          <BodyText key={idx} style={styles.highlight}>
                            • {highlight}
                          </BodyText>
                        ))}
                      </View>
                    )}
                    
                    <View style={styles.priceSection}>
                      {pkg.price && (
                        <AccentText style={[styles.price, { color: colors.primary }]}>
                          From ${pkg.price}
                        </AccentText>
                      )}
                      
                      <View style={styles.buttonRow}>
                        <Button
                          title="View Details"
                          onPress={() => handlePackagePress(pkg)}
                          style={[styles.detailButton, { backgroundColor: colors.secondary }]}
                        />
                        <Button
                          title="Book Now"
                          onPress={() => handleBookNow(pkg)}
                          style={[styles.bookButton, { backgroundColor: colors.primary }]}
                        />
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bottom Blessing */}
        <View style={styles.blessing}>
          <HieroglyphicText
            text="𓇳 𓈖 𓇳 𓈖 𓇳"
            size="small"
            animated={true}
            animationType="glow"
            style={styles.blessingText}
          />
          <BodyText style={styles.blessingSubtext}>
            Choose your path to ancient wonders
          </BodyText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroSection: {
    padding: 20,
    alignItems: 'center',
  },
  heroHieroglyphs: {
    marginBottom: 15,
  },
  heroTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  heroDescription: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterText: {
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyStateTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  packagesList: {
    paddingHorizontal: 20,
  },
  packageCard: {
    marginBottom: 20,
  },
  card: {
    overflow: 'hidden',
  },
  packageImage: {
    width: '100%',
    height: 200,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  featuredText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 15,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  packageDescription: {
    marginBottom: 15,
    opacity: 0.8,
  },
  packageSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  specItem: {
    flexDirection: 'row',
    marginRight: 15,
    marginBottom: 5,
  },
  specLabel: {
    fontWeight: '500',
    marginRight: 5,
  },
  specValue: {
    opacity: 0.8,
  },
  highlightsSection: {
    marginBottom: 15,
  },
  highlightsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  highlight: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  bookButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  blessing: {
    alignItems: 'center',
    padding: 20,
  },
  blessingText: {
    marginBottom: 8,
  },
  blessingSubtext: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default PackagesScreen;
