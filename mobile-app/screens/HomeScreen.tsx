/**
 * Home Screen for Dahabiyat Mobile App
 * Displays homepage content synchronized with web admin panel
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  RefreshControl,
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

interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  featuredPackagesTitle: string;
  featuredPackagesSubtitle: string;
  whatIsTitle: string;
  whatIsDescription: string;
  companyName: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [content, setContent] = useState<HomeContent>({
    heroTitle: 'Discover Ancient Egypt on Luxury Dahabiyas',
    heroSubtitle: 'Experience the timeless beauty of the Nile River',
    heroDescription: 'Sail through history aboard our traditional vessels',
    featuredPackagesTitle: 'Featured Journeys',
    featuredPackagesSubtitle: 'Carefully crafted journeys through ancient Egypt',
    whatIsTitle: 'What is a Dahabiya?',
    whatIsDescription: 'A traditional Egyptian sailing boat experience',
    companyName: 'Cleopatra Dahabiyat'
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [featuredDahabiyas, setFeaturedDahabiyas] = useState([]);

  useEffect(() => {
    fetchHomeContent();
    fetchFeaturedData();
  }, []);

  const fetchHomeContent = async () => {
    try {
      // Try to fetch from content sync API
      const response = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/mobile-content-sync.json`);
      if (response.ok) {
        const data = await response.json();
        const contentData = data.content || {};
        
        setContent({
          heroTitle: contentData['hero_title']?.value || content.heroTitle,
          heroSubtitle: contentData['hero_subtitle']?.value || content.heroSubtitle,
          heroDescription: contentData['hero_description']?.value || content.heroDescription,
          featuredPackagesTitle: contentData['featured_packages_title']?.value || content.featuredPackagesTitle,
          featuredPackagesSubtitle: contentData['featured_packages_subtitle']?.value || content.featuredPackagesSubtitle,
          whatIsTitle: contentData['what_is_title']?.value || content.whatIsTitle,
          whatIsDescription: contentData['what_is_description']?.value || content.whatIsDescription,
          companyName: contentData['footer-company-name']?.value || content.companyName
        });
      } else {
        // Fallback to direct API call
        const fallbackResponse = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/website-content/homepage`);
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          const fields = data.fields || [];
          
          const updatedContent = { ...content };
          fields.forEach((field: any) => {
            switch (field.key) {
              case 'hero_title':
                updatedContent.heroTitle = field.value || updatedContent.heroTitle;
                break;
              case 'hero_subtitle':
                updatedContent.heroSubtitle = field.value || updatedContent.heroSubtitle;
                break;
              case 'featured_packages_title':
                updatedContent.featuredPackagesTitle = field.value || updatedContent.featuredPackagesTitle;
                break;
              case 'what_is_title':
                updatedContent.whatIsTitle = field.value || updatedContent.whatIsTitle;
                break;
              case 'what_is_description':
                updatedContent.whatIsDescription = field.value || updatedContent.whatIsDescription;
                break;
            }
          });
          
          setContent(updatedContent);
        }
      }
    } catch (error) {
      console.log('Using fallback home content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedData = async () => {
    try {
      // Fetch featured packages
      const packagesResponse = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/packages?featured=true&limit=3`);
      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json();
        setFeaturedPackages(packagesData.packages || []);
      }

      // Fetch featured dahabiyas
      const dahabiyasResponse = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/dahabiyas?featured=true&limit=3`);
      if (dahabiyasResponse.ok) {
        const dahabiyasData = await dahabiyasResponse.json();
        setFeaturedDahabiyas(dahabiyasData.dahabiyas || []);
      }
    } catch (error) {
      console.log('Error fetching featured data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHomeContent();
    await fetchFeaturedData();
    setRefreshing(false);
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
            text="𓇳 𓊪 𓇳"
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
          
          <View style={styles.heroButtons}>
            <Button
              title="Explore Dahabiyas"
              onPress={() => navigation.navigate('Dahabiyat')}
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            />
            <Button
              title="View Packages"
              onPress={() => navigation.navigate('Packages')}
              style={[styles.secondaryButton, { borderColor: colors.primary }]}
              variant="outline"
            />
          </View>
        </View>

        {/* Featured Packages Section */}
        <View style={styles.section}>
          <Heading2 style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {content.featuredPackagesTitle}
          </Heading2>
          <BodyText style={styles.sectionSubtitle}>
            {content.featuredPackagesSubtitle}
          </BodyText>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {featuredPackages.map((pkg: any, index: number) => (
              <Card key={pkg.id || index} style={styles.featuredCard}>
                <Image
                  source={{ uri: pkg.mainImageUrl || '/images/default-package.jpg' }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <AccentText style={styles.cardTitle}>{pkg.name}</AccentText>
                  <BodyText style={styles.cardDescription} numberOfLines={2}>
                    {pkg.shortDescription || pkg.description}
                  </BodyText>
                  <BodyText style={styles.cardPrice}>
                    From ${pkg.price || 'Contact us'}
                  </BodyText>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* What is a Dahabiya Section */}
        <Card style={styles.infoCard}>
          <Heading2 style={[styles.infoTitle, { color: colors.text.primary }]}>
            {content.whatIsTitle}
          </Heading2>
          <BodyText style={styles.infoDescription}>
            {content.whatIsDescription}
          </BodyText>
          <Button
            title="Learn More"
            onPress={() => navigation.navigate('Dahabiyat')}
            style={[styles.infoButton, { backgroundColor: colors.accent }]}
          />
        </Card>

        {/* Featured Dahabiyas Section */}
        <View style={styles.section}>
          <Heading2 style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Our Fleet
          </Heading2>
          <BodyText style={styles.sectionSubtitle}>
            Traditional vessels for your Nile journey
          </BodyText>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {featuredDahabiyas.map((dahabiya: any, index: number) => (
              <Card key={dahabiya.id || index} style={styles.featuredCard}>
                <Image
                  source={{ uri: dahabiya.mainImageUrl || '/images/default-dahabiya.jpg' }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <AccentText style={styles.cardTitle}>{dahabiya.name}</AccentText>
                  <BodyText style={styles.cardDescription} numberOfLines={2}>
                    {dahabiya.shortDescription || dahabiya.description}
                  </BodyText>
                  <BodyText style={styles.cardCapacity}>
                    Capacity: {dahabiya.maxGuests || 'Contact us'} guests
                  </BodyText>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Blessing */}
        <View style={styles.blessing}>
          <HieroglyphicText
            text="𓊃 𓂀 𓇳 𓂀 𓊃"
            size="small"
            animated={true}
            animationType="glow"
            style={styles.blessingText}
          />
          <BodyText style={styles.blessingSubtext}>
            Welcome to {content.companyName}
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
    minHeight: 300,
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
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  primaryButton: {
    paddingHorizontal: 20,
  },
  secondaryButton: {
    paddingHorizontal: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: 250,
    marginRight: 15,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    marginBottom: 5,
  },
  cardDescription: {
    marginBottom: 8,
    opacity: 0.8,
  },
  cardPrice: {
    fontWeight: 'bold',
  },
  cardCapacity: {
    fontWeight: 'bold',
    opacity: 0.7,
  },
  infoCard: {
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  infoDescription: {
    textAlign: 'center',
    marginBottom: 20,
  },
  infoButton: {
    paddingHorizontal: 30,
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

export default HomeScreen;
