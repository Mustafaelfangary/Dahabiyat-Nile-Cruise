/**
 * Dahabiyat Screen for Dahabiyat Mobile App
 * Displays dahabiyas list synchronized with web admin panel
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

interface DahabiyaContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
}

interface Dahabiya {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  mainImage?: string;
  maxGuests?: number;
  cabins?: number;
  length?: number;
  isActive: boolean;
  featured: boolean;
  slug: string;
}

const DahabiyatScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [content, setContent] = useState<DahabiyaContent>({
    heroTitle: 'Our Traditional Dahabiyas',
    heroSubtitle: 'Sail the Nile in authentic traditional boats',
    heroDescription: 'Experience the timeless beauty of the Nile aboard our carefully selected fleet',
    emptyStateTitle: 'No Dahabiyas Available',
    emptyStateDescription: 'Our fleet is currently being prepared for your journey'
  });
  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, featured, available

  useEffect(() => {
    fetchContent();
    fetchDahabiyas();
  }, []);

  const fetchContent = async () => {
    try {
      // Try to fetch from content sync API
      const response = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/mobile-content-sync.json`);
      if (response.ok) {
        const data = await response.json();
        const contentData = data.content || {};
        
        setContent({
          heroTitle: contentData['dahabiyas_hero_title']?.value || content.heroTitle,
          heroSubtitle: contentData['dahabiyas_hero_subtitle']?.value || content.heroSubtitle,
          heroDescription: contentData['dahabiyas_hero_description']?.value || content.heroDescription,
          emptyStateTitle: contentData['dahabiyas_empty_title']?.value || content.emptyStateTitle,
          emptyStateDescription: contentData['dahabiyas_empty_description']?.value || content.emptyStateDescription
        });
      } else {
        // Fallback to direct API call
        const fallbackResponse = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/website-content/dahabiyas`);
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          const fields = data.fields || [];
          
          const updatedContent = { ...content };
          fields.forEach((field: any) => {
            switch (field.key) {
              case 'dahabiyas_hero_title':
                updatedContent.heroTitle = field.value || updatedContent.heroTitle;
                break;
              case 'dahabiyas_hero_subtitle':
                updatedContent.heroSubtitle = field.value || updatedContent.heroSubtitle;
                break;
              case 'dahabiyas_hero_description':
                updatedContent.heroDescription = field.value || updatedContent.heroDescription;
                break;
            }
          });
          
          setContent(updatedContent);
        }
      }
    } catch (error) {
      console.log('Using fallback dahabiyas content:', error);
    }
  };

  const fetchDahabiyas = async () => {
    try {
      const response = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/dahabiyas`);
      if (response.ok) {
        const data = await response.json();
        setDahabiyas(data.dahabiyas || []);
      }
    } catch (error) {
      console.log('Error fetching dahabiyas:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContent();
    await fetchDahabiyas();
    setRefreshing(false);
  };

  const filteredDahabiyas = dahabiyas.filter(dahabiya => {
    if (filter === 'all') return dahabiya.isActive;
    if (filter === 'featured') return dahabiya.featured && dahabiya.isActive;
    if (filter === 'available') return dahabiya.isActive;
    return dahabiya.isActive;
  });

  const handleDahabiyaPress = (dahabiya: Dahabiya) => {
    // Navigate to dahabiya detail screen
    navigation.navigate('DahabiyaDetail', { slug: dahabiya.slug, id: dahabiya.id });
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
            text="𓊪 𓇳 𓊪"
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
                All Dahabiyas
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
                filter === 'available' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setFilter('available')}
            >
              <BodyText style={[
                styles.filterText,
                filter === 'available' && { color: colors.text.inverse }
              ]}>
                Available
              </BodyText>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Dahabiyas List */}
        {filteredDahabiyas.length === 0 ? (
          <View style={styles.emptyState}>
            <HieroglyphicText
              text="𓊪"
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
          <View style={styles.dahabiyasList}>
            {filteredDahabiyas.map((dahabiya, index) => (
              <TouchableOpacity
                key={dahabiya.id}
                onPress={() => handleDahabiyaPress(dahabiya)}
                style={styles.dahabiyaCard}
              >
                <Card style={styles.card}>
                  <Image
                    source={{ uri: dahabiya.mainImage || '/images/default-dahabiya.jpg' }}
                    style={styles.dahabiyaImage}
                    resizeMode="cover"
                  />
                  
                  {dahabiya.featured && (
                    <View style={[styles.featuredBadge, { backgroundColor: colors.accent }]}>
                      <BodyText style={styles.featuredText}>Featured</BodyText>
                    </View>
                  )}
                  
                  <View style={styles.cardContent}>
                    <AccentText style={[styles.dahabiyaName, { color: colors.text.primary }]}>
                      {dahabiya.name}
                    </AccentText>
                    
                    <BodyText style={styles.dahabiyaDescription} numberOfLines={3}>
                      {dahabiya.shortDescription || dahabiya.description}
                    </BodyText>
                    
                    <View style={styles.dahabiyaSpecs}>
                      {dahabiya.maxGuests && (
                        <View style={styles.specItem}>
                          <BodyText style={styles.specLabel}>Guests:</BodyText>
                          <BodyText style={styles.specValue}>{dahabiya.maxGuests}</BodyText>
                        </View>
                      )}
                      
                      {dahabiya.cabins && (
                        <View style={styles.specItem}>
                          <BodyText style={styles.specLabel}>Cabins:</BodyText>
                          <BodyText style={styles.specValue}>{dahabiya.cabins}</BodyText>
                        </View>
                      )}
                      
                      {dahabiya.length && (
                        <View style={styles.specItem}>
                          <BodyText style={styles.specLabel}>Length:</BodyText>
                          <BodyText style={styles.specValue}>{dahabiya.length}m</BodyText>
                        </View>
                      )}
                    </View>
                    
                    <Button
                      title="View Details"
                      onPress={() => handleDahabiyaPress(dahabiya)}
                      style={[styles.viewButton, { backgroundColor: colors.primary }]}
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bottom Blessing */}
        <View style={styles.blessing}>
          <HieroglyphicText
            text="𓊪 𓇳 𓊪 𓇳 𓊪"
            size="small"
            animated={true}
            animationType="glow"
            style={styles.blessingText}
          />
          <BodyText style={styles.blessingSubtext}>
            May the winds guide your journey
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
  dahabiyasList: {
    paddingHorizontal: 20,
  },
  dahabiyaCard: {
    marginBottom: 20,
  },
  card: {
    overflow: 'hidden',
  },
  dahabiyaImage: {
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
  dahabiyaName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dahabiyaDescription: {
    marginBottom: 15,
    opacity: 0.8,
  },
  dahabiyaSpecs: {
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
  viewButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
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

export default DahabiyatScreen;
