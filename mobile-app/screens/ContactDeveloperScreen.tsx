/**
 * Contact Developer Screen for Dahabiyat Mobile App
 * Enhanced developer contact modal with improved styling and WhatsApp integration
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Card, Heading1, Heading2, BodyText, AccentText } from '../components/ui';
import HieroglyphicText from '../components/HieroglyphicText';

const { width } = Dimensions.get('window');

interface DeveloperInfo {
  name: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
  brandingText: string;
}

const ContactDeveloperScreen: React.FC = () => {
  const { colors } = useTheme();

  // Developer information - synchronized with web admin panel
  const [developerInfo, setDeveloperInfo] = useState<DeveloperInfo>({
    name: 'Just X Development',
    company: 'Just X',
    phone: '+201200958713',
    email: 'developer@justx.com',
    website: 'https://justx.com',
    brandingText: 'Crafted with love in the land of the Pharaohs by Just X'
  });
  const [loading, setLoading] = useState(true);

  // Fetch developer settings from API or use constants (synchronized with web admin)
  useEffect(() => {
    const fetchDeveloperSettings = async () => {
      try {
        // Try to fetch from content sync API first
        const response = await fetch('https://your-domain.com/api/mobile-content-sync.json');
        if (response.ok) {
          const data = await response.json();
          const content = data.content || {};

          // Map API response to developer info
          const updatedInfo = {
            name: content['footer_developer_name']?.value || developerInfo.name,
            company: content['footer_developer_company']?.value || developerInfo.company,
            phone: content['footer_developer_phone']?.value || developerInfo.phone,
            email: content['footer_developer_email']?.value || developerInfo.email,
            website: content['footer_developer_website']?.value || developerInfo.website,
            brandingText: content['footer_developer_branding_text']?.value || developerInfo.brandingText
          };

          setDeveloperInfo(updatedInfo);
        } else {
          // Fallback to direct API call
          const fallbackResponse = await fetch('https://your-domain.com/api/website-content/global_media');
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            const fields = data.fields || [];

            const updatedInfo = { ...developerInfo };
            fields.forEach((field: any) => {
              switch (field.key) {
                case 'footer_developer_name':
                  updatedInfo.name = field.value || updatedInfo.name;
                  break;
                case 'footer_developer_company':
                  updatedInfo.company = field.value || updatedInfo.company;
                  break;
                case 'footer_developer_phone':
                  updatedInfo.phone = field.value || updatedInfo.phone;
                  break;
                case 'footer_developer_email':
                  updatedInfo.email = field.value || updatedInfo.email;
                  break;
                case 'footer_developer_website':
                  updatedInfo.website = field.value || updatedInfo.website;
                  break;
                case 'footer_developer_branding_text':
                  updatedInfo.brandingText = field.value || updatedInfo.brandingText;
                  break;
              }
            });

            setDeveloperInfo(updatedInfo);
          }
        }
      } catch (error) {
        console.log('Using fallback developer settings:', error);
        // Keep default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperSettings();
  }, []);

  const handleWhatsApp = () => {
    const phone = developerInfo.phone.replace(/\s+/g, '').replace('+', '');
    const message = encodeURIComponent('Hello! I would like to get in touch regarding your development services.');
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${message}`);
  };

  const handlePhoneCall = () => {
    Linking.openURL(`tel:${developerInfo.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${developerInfo.email}`);
  };

  const handleWebsite = () => {
    if (developerInfo.website) {
      Linking.openURL(developerInfo.website);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <LinearGradient
        colors={[
          'rgba(26, 35, 126, 0.95)',
          'rgba(74, 20, 140, 0.9)',
          'rgba(139, 69, 19, 0.85)',
          'rgba(212, 175, 55, 0.9)',
          'rgba(255, 215, 0, 0.95)'
        ]}
        style={styles.gradientBackground}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <HieroglyphicText
              text="𓇳 𓇳 𓇳"
              size="large"
              animated={true}
              animationType="pulse"
              style={styles.headerHieroglyphs}
            />
            <Heading1 style={[styles.title, { color: colors.text.inverse }]}>
              Contact Developer
            </Heading1>
          </View>

          {/* Developer Info Card */}
          <Card variant="elevated" style={[styles.developerCard, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
            {/* Developer Logo */}
            <View style={styles.logoContainer}>
              {developerInfo.logo ? (
                <Image source={{ uri: developerInfo.logo }} style={styles.logo} />
              ) : (
                <LinearGradient
                  colors={['#D4AF37', '#FFD700', '#FFA500']}
                  style={styles.logoPlaceholder}
                >
                  <AccentText style={styles.logoText}>
                    {developerInfo.name.charAt(0)}
                  </AccentText>
                </LinearGradient>
              )}
            </View>

            {/* Developer Info */}
            <View style={styles.developerInfo}>
              <Heading2 style={[styles.developerName, { color: colors.text.inverse }]}>
                {developerInfo.name}
              </Heading2>
              <BodyText style={[styles.brandingText, { color: colors.text.inverse }]}>
                {developerInfo.brandingText}
              </BodyText>
              <AccentText style={[styles.phoneText, { color: colors.accent.primary }]}>
                📞 {developerInfo.phone}
              </AccentText>
            </View>

            {/* Contact Buttons */}
            <View style={styles.contactButtons}>
              {/* Email Button */}
              <TouchableOpacity onPress={handleEmail} style={styles.contactButton}>
                <LinearGradient
                  colors={['#D4AF37', '#FFD700', '#FFA500']}
                  style={styles.buttonGradient}
                >
                  <AccentText style={styles.buttonText}>✉️ Send Email</AccentText>
                </LinearGradient>
              </TouchableOpacity>

              {/* WhatsApp Button */}
              <TouchableOpacity onPress={handleWhatsApp} style={styles.contactButton}>
                <LinearGradient
                  colors={['#25D366', '#128C7E', '#075E54']}
                  style={styles.buttonGradient}
                >
                  <AccentText style={styles.buttonText}>💬 WhatsApp</AccentText>
                </LinearGradient>
              </TouchableOpacity>

              {/* Call Button */}
              <TouchableOpacity onPress={handlePhoneCall} style={styles.contactButton}>
                <LinearGradient
                  colors={['#4285F4', '#34A853', '#1A73E8']}
                  style={styles.buttonGradient}
                >
                  <AccentText style={styles.buttonText}>📞 Call Now</AccentText>
                </LinearGradient>
              </TouchableOpacity>

              {/* Website Button */}
              {developerInfo.website && (
                <TouchableOpacity onPress={handleWebsite} style={styles.contactButton}>
                  <LinearGradient
                    colors={['#FF6B35', '#F7931E', '#FFD700']}
                    style={styles.buttonGradient}
                  >
                    <AccentText style={styles.buttonText}>🌐 Visit Website</AccentText>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            {/* Egyptian Decorative Elements */}
            <View style={styles.decorativeElements}>
              <HieroglyphicText text="𓎢" size="small" animated={true} animationType="pulse" />
              <HieroglyphicText text="𓃭" size="small" animated={true} animationType="bounce" />
              <HieroglyphicText text="𓅂" size="small" animated={true} animationType="pulse" />
              <HieroglyphicText text="𓅱" size="small" animated={true} animationType="bounce" />
              <HieroglyphicText text="𓄿" size="small" animated={true} animationType="pulse" />
            </View>
          </Card>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerHieroglyphs: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  developerCard: {
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    shadowColor: 'rgba(212, 175, 55, 0.3)',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 25,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  developerInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  developerName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  brandingText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contactButtons: {
    width: '100%',
    gap: 12,
  },
  contactButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  decorativeElements: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
  },
});

export default ContactDeveloperScreen;
