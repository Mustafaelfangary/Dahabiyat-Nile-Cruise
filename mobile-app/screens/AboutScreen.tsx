/**
 * About Screen
 * Information about the company and services
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon as any} size={24} color="#0080ff" />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

interface TeamMemberProps {
  name: string;
  role: string;
  image?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image }) => (
  <View style={styles.teamMember}>
    <View style={styles.memberAvatar}>
      {image ? (
        <Image source={{ uri: image }} style={styles.memberImage} />
      ) : (
        <Ionicons name="person" size={30} color="#0080ff" />
      )}
    </View>
    <Text style={styles.memberName}>{name}</Text>
    <Text style={styles.memberRole}>{role}</Text>
  </View>
);

const AboutScreen: React.FC = () => {
  const handleContactPress = () => {
    Linking.openURL('mailto:info@dahabiyat-nile-cruise.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+201234567890');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://dahabiyat-nile-cruise.com');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🏺</Text>
          <Text style={styles.companyName}>Dahabiyat Nile Cruise</Text>
          <Text style={styles.tagline}>Authentic Egyptian River Journeys</Text>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.aboutText}>
          Welcome to Dahabiyat Nile Cruise, where ancient Egyptian elegance meets modern luxury. 
          For over two decades, we have been crafting unforgettable journeys along the legendary Nile River, 
          offering our guests an authentic and intimate experience of Egypt's timeless wonders.
        </Text>
        <Text style={styles.aboutText}>
          Our traditional dahabiyat (sailing boats) provide a unique way to explore the treasures of ancient Egypt, 
          from the magnificent temples of Luxor to the serene beauty of Aswan, all while enjoying personalized service 
          and the gentle rhythm of the Nile.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        
        <FeatureItem
          icon="boat-outline"
          title="Authentic Dahabiyat"
          description="Traditional sailing boats with modern amenities for an authentic Nile experience"
        />
        
        <FeatureItem
          icon="people-outline"
          title="Expert Guides"
          description="Professional Egyptologists and local guides with deep knowledge of Egyptian history"
        />
        
        <FeatureItem
          icon="restaurant-outline"
          title="Gourmet Cuisine"
          description="Authentic Egyptian and international cuisine prepared by skilled chefs"
        />
        
        <FeatureItem
          icon="shield-checkmark-outline"
          title="Safety First"
          description="Highest safety standards with modern navigation and safety equipment"
        />
        
        <FeatureItem
          icon="star-outline"
          title="Personalized Service"
          description="Small group sizes ensure personalized attention and exceptional service"
        />
        
        <FeatureItem
          icon="leaf-outline"
          title="Eco-Friendly"
          description="Sustainable tourism practices that respect local communities and environment"
        />
      </View>

      {/* Team */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Team</Text>
        
        <View style={styles.teamGrid}>
          <TeamMember
            name="Captain Ahmed"
            role="Master Navigator"
          />
          
          <TeamMember
            name="Dr. Fatima"
            role="Chief Egyptologist"
          />
          
          <TeamMember
            name="Chef Hassan"
            role="Executive Chef"
          />
          
          <TeamMember
            name="Sara Mohamed"
            role="Guest Relations"
          />
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Our Journey</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>20+</Text>
            <Text style={styles.statLabel}>Years Experience</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5000+</Text>
            <Text style={styles.statLabel}>Happy Guests</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Luxury Dahabiyat</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Destinations</Text>
          </View>
        </View>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        
        <TouchableOpacity style={styles.contactItem} onPress={handleContactPress}>
          <Ionicons name="mail-outline" size={24} color="#0080ff" />
          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>Email Us</Text>
            <Text style={styles.contactSubtitle}>info@dahabiyat-nile-cruise.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
          <Ionicons name="call-outline" size={24} color="#0080ff" />
          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.contactSubtitle}>+20 123 456 7890</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
          <Ionicons name="globe-outline" size={24} color="#0080ff" />
          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>Visit Website</Text>
            <Text style={styles.contactSubtitle}>www.dahabiyat-nile-cruise.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
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
    paddingVertical: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 60,
    marginBottom: 15,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#e6f3ff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 15,
    textAlign: 'justify',
  },
  featureItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  teamMember: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 20,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  statsSection: {
    backgroundColor: '#0080ff',
    marginTop: 20,
    paddingVertical: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#e6f3ff',
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactText: {
    flex: 1,
    marginLeft: 15,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default AboutScreen;
