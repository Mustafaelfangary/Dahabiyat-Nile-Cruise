/**
 * Contact Screen for Dahabiyat Mobile App
 * Contact form and information for customer inquiries
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Linking,
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

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactContent {
  heroTitle: string;
  heroSubtitle: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
}

const ContactScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [content, setContent] = useState<ContactContent>({
    heroTitle: 'Royal Advisors',
    heroSubtitle: 'Reach out to our sacred council for guidance',
    companyName: 'Cleopatra Dahabiyat',
    address: 'Luxor, Egypt',
    phone: '+20 123 456 789',
    email: 'info@cleopatradarabiyat.com',
    whatsappNumber: '+201234567890'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      // Try to fetch from content sync API
      const response = await fetch(`${APP_CONSTANTS.API_BASE_URL}/api/mobile-content-sync.json`);
      if (response.ok) {
        const data = await response.json();
        const contentData = data.content || {};

        setContent({
          heroTitle: contentData['contact_hero_title']?.value || content.heroTitle,
          heroSubtitle: contentData['contact_hero_subtitle']?.value || content.heroSubtitle,
          companyName: contentData['footer-company-name']?.value || content.companyName,
          address: contentData['footer-address']?.value || content.address,
          phone: contentData['footer-phone']?.value || content.phone,
          email: contentData['footer-email']?.value || content.email,
          whatsappNumber: contentData['whatsapp_phone']?.value || content.whatsappNumber
        });
      } else {
        // Fallback to direct API calls
        const [contactResponse, globalResponse] = await Promise.all([
          fetch(`${APP_CONSTANTS.API_BASE_URL}/api/website-content/contact`),
          fetch(`${APP_CONSTANTS.API_BASE_URL}/api/website-content/global_media`)
        ]);

        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          const fields = contactData.fields || [];

          const updatedContent = { ...content };
          fields.forEach((field: any) => {
            switch (field.key) {
              case 'contact_hero_title':
                updatedContent.heroTitle = field.value || updatedContent.heroTitle;
                break;
              case 'contact_hero_subtitle':
                updatedContent.heroSubtitle = field.value || updatedContent.heroSubtitle;
                break;
            }
          });

          setContent(updatedContent);
        }

        if (globalResponse.ok) {
          const globalData = await globalResponse.json();
          const fields = globalData.fields || [];

          const updatedContent = { ...content };
          fields.forEach((field: any) => {
            switch (field.key) {
              case 'footer-company-name':
                updatedContent.companyName = field.value || updatedContent.companyName;
                break;
              case 'footer-address':
                updatedContent.address = field.value || updatedContent.address;
                break;
              case 'footer-phone':
                updatedContent.phone = field.value || updatedContent.phone;
                break;
              case 'footer-email':
                updatedContent.email = field.value || updatedContent.email;
                break;
            }
          });

          setContent(updatedContent);
        }
      }
    } catch (error) {
      console.log('Using fallback contact content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContactContent();
    setRefreshing(false);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiService.submitContact(formData);
      if (result.success) {
        Alert.alert(
          'Message Sent',
          'Thank you for contacting us! We will respond within 24 hours.',
          [{ text: 'OK', onPress: () => {
            // Reset form
            setFormData({
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: '',
            });
          }}]
        );
      } else {
        Alert.alert('Error', 'Failed to send message. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneCall = () => {
    Linking.openURL(`tel:${content.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${content.email}`);
  };

  const handleWhatsApp = () => {
    const phone = content.whatsappNumber.replace(/\s+/g, '').replace('+', '');
    Linking.openURL(`whatsapp://send?phone=${phone}`);
  };

  if (contentLoading) {
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
        {/* Header */}
        <View style={styles.header}>
          <HieroglyphicText
            text="𓊃 𓂀 𓊃"
            size="large"
            animated={true}
            animationType="pulse"
            style={styles.headerHieroglyphs}
          />
          <Heading1 style={styles.title}>{content.heroTitle}</Heading1>
          <BodyText style={styles.subtitle}>
            {content.heroSubtitle}
          </BodyText>
        </View>

        {/* Quick Contact Options */}
        <Card variant="elevated" style={styles.quickContactCard}>
          <Heading2 style={styles.quickContactTitle}>Instant Communication</Heading2>
          
          <View style={styles.contactOptions}>
            <Button
              title="📞 Call Now"
              variant="primary"
              size="medium"
              onPress={handlePhoneCall}
              style={styles.contactButton}
            />
            
            <Button
              title="✉️ Email"
              variant="secondary"
              size="medium"
              onPress={handleEmail}
              style={styles.contactButton}
            />
            
            <Button
              title="💬 WhatsApp"
              variant="secondary"
              size="medium"
              onPress={handleWhatsApp}
              style={styles.contactButton}
            />
          </View>
        </Card>

        {/* Contact Developer Section */}
        <Card variant="secondary" style={styles.developerCard}>
          <Heading2 style={styles.developerTitle}>Need Technical Support?</Heading2>
          <BodyText style={styles.developerSubtitle}>
            Contact our development team for technical assistance or app-related inquiries
          </BodyText>

          <Button
            title="🛠️ Contact Developer"
            variant="accent"
            size="large"
            onPress={() => navigation.navigate('ContactDeveloper' as never)}
            style={styles.developerButton}
          />
        </Card>

        {/* Contact Information */}
        <Card variant="primary" style={styles.infoCard}>
          <Heading2 style={styles.infoTitle}>Contact Information</Heading2>
          
          <View style={styles.infoItem}>
            <HieroglyphicText text="𓉗" size="small" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <AccentText style={styles.infoLabel}>Office Address</AccentText>
              <BodyText style={styles.infoText}>
                Nile Corniche, Luxor, Egypt{'\n'}
                Near Winter Palace Hotel
              </BodyText>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <HieroglyphicText text="𓇳" size="small" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <AccentText style={styles.infoLabel}>Business Hours</AccentText>
              <BodyText style={styles.infoText}>
                Sunday - Thursday: 9:00 AM - 6:00 PM{'\n'}
                Friday - Saturday: 10:00 AM - 4:00 PM
              </BodyText>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <HieroglyphicText text="𓈖" size="small" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <AccentText style={styles.infoLabel}>Emergency Contact</AccentText>
              <BodyText style={styles.infoText}>
                24/7 Support: +20 123 456 7890{'\n'}
                Emergency WhatsApp: +20 123 456 7891
              </BodyText>
            </View>
          </View>
        </Card>

        {/* Contact Form */}
        <Card variant="elevated" style={styles.formCard}>
          <Heading2 style={styles.formTitle}>Send Sacred Message</Heading2>
          
          <View style={styles.inputGroup}>
            <AccentText style={styles.inputLabel}>Full Name *</AccentText>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background.tertiary, color: colors.text.primary }]}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter your full name"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <AccentText style={styles.inputLabel}>Email Address *</AccentText>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background.tertiary, color: colors.text.primary }]}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="Enter your email"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <AccentText style={styles.inputLabel}>Phone Number</AccentText>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background.tertiary, color: colors.text.primary }]}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <AccentText style={styles.inputLabel}>Subject</AccentText>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background.tertiary, color: colors.text.primary }]}
              value={formData.subject}
              onChangeText={(text) => handleInputChange('subject', text)}
              placeholder="What is your inquiry about?"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <AccentText style={styles.inputLabel}>Message *</AccentText>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.background.tertiary, color: colors.text.primary }]}
              value={formData.message}
              onChangeText={(text) => handleInputChange('message', text)}
              placeholder="Tell us how we can help you..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <Button
            title={isSubmitting ? "Sending..." : "Send Message"}
            variant="primary"
            size="large"
            fullWidth
            loading={isSubmitting}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </Card>

        {/* FAQ Section */}
        <Card variant="primary" style={styles.faqCard}>
          <Heading2 style={styles.faqTitle}>Frequently Asked Questions</Heading2>
          
          <View style={styles.faqItem}>
            <AccentText style={styles.faqQuestion}>How far in advance should I book?</AccentText>
            <BodyText style={styles.faqAnswer}>
              We recommend booking at least 30 days in advance, especially during peak season (December-March).
            </BodyText>
          </View>
          
          <View style={styles.faqItem}>
            <AccentText style={styles.faqQuestion}>What is included in the price?</AccentText>
            <BodyText style={styles.faqAnswer}>
              All meals, accommodation, guided tours, entrance fees, and transportation during the cruise are included.
            </BodyText>
          </View>
          
          <View style={styles.faqItem}>
            <AccentText style={styles.faqQuestion}>Can you accommodate dietary restrictions?</AccentText>
            <BodyText style={styles.faqAnswer}>
              Yes, we can accommodate most dietary requirements including vegetarian, vegan, and gluten-free options.
            </BodyText>
          </View>
        </Card>

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
            May the gods guide our communication
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  headerHieroglyphs: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  quickContactCard: {
    marginVertical: 20,
  },
  quickContactTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  infoCard: {
    marginVertical: 15,
  },
  infoTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  formCard: {
    marginVertical: 20,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
  },
  submitButton: {
    marginTop: 10,
  },
  faqCard: {
    marginVertical: 20,
  },
  faqTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  blessing: {
    alignItems: 'center',
    marginTop: 30,
  },
  blessingText: {
    marginBottom: 10,
    opacity: 0.8,
  },
  blessingSubtext: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  developerCard: {
    marginVertical: 15,
    padding: 20,
  },
  developerTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  developerSubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  developerButton: {
    marginTop: 10,
  },
});

export default ContactScreen;
