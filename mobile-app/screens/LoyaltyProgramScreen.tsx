/**
 * Loyalty Program Screen
 * Detailed loyalty program information and benefits
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface TierBenefitProps {
  icon: string;
  title: string;
  description: string;
}

const TierBenefit: React.FC<TierBenefitProps> = ({ icon, title, description }) => (
  <View style={styles.benefitItem}>
    <Ionicons name={icon as any} size={24} color="#0080ff" style={styles.benefitIcon} />
    <View style={styles.benefitText}>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDescription}>{description}</Text>
    </View>
  </View>
);

const LoyaltyProgramScreen: React.FC = () => {
  const [currentTier] = useState('Gold');
  const [currentPoints] = useState(2450);
  const [nextTierPoints] = useState(3000);
  const [pointsToNext] = useState(nextTierPoints - currentPoints);

  const tiers = [
    {
      name: 'Bronze',
      minPoints: 0,
      color: '#CD7F32',
      benefits: [
        'Welcome bonus: 100 points',
        '5% discount on bookings',
        'Priority customer support',
        'Birthday special offer',
      ],
    },
    {
      name: 'Silver',
      minPoints: 1000,
      color: '#C0C0C0',
      benefits: [
        'All Bronze benefits',
        '10% discount on bookings',
        'Free room upgrade (subject to availability)',
        'Complimentary welcome drink',
        'Late checkout until 2 PM',
      ],
    },
    {
      name: 'Gold',
      minPoints: 2000,
      color: '#FFD700',
      benefits: [
        'All Silver benefits',
        '15% discount on bookings',
        'Free airport transfer',
        'Complimentary spa treatment',
        'Priority boarding',
        'Exclusive Gold member events',
      ],
    },
    {
      name: 'Platinum',
      minPoints: 3000,
      color: '#E5E4E2',
      benefits: [
        'All Gold benefits',
        '20% discount on bookings',
        'Personal concierge service',
        'Free excursions',
        'Premium suite upgrade',
        'Exclusive Platinum experiences',
        'Annual free cruise',
      ],
    },
  ];

  const getCurrentTierIndex = () => {
    return tiers.findIndex(tier => tier.name === currentTier);
  };

  const getProgressPercentage = () => {
    const currentTierIndex = getCurrentTierIndex();
    if (currentTierIndex === -1) return 0;
    
    const currentTierMinPoints = tiers[currentTierIndex].minPoints;
    const nextTierMinPoints = currentTierIndex < tiers.length - 1 
      ? tiers[currentTierIndex + 1].minPoints 
      : currentTierMinPoints;
    
    const progress = (currentPoints - currentTierMinPoints) / (nextTierMinPoints - currentTierMinPoints);
    return Math.min(progress * 100, 100);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0080ff', '#0066cc']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Loyalty Program</Text>
        <Text style={styles.headerSubtitle}>Nile Explorer Rewards</Text>
      </LinearGradient>

      {/* Current Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.tierBadge}>
            <Ionicons name="star" size={20} color="#000" />
            <Text style={styles.tierName}>{currentTier} Member</Text>
          </View>
          <Text style={styles.currentPoints}>{currentPoints} Points</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${getProgressPercentage()}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {pointsToNext} points to {tiers[getCurrentTierIndex() + 1]?.name || 'Max Level'}
          </Text>
        </View>
      </View>

      {/* How to Earn Points */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Earn Points</Text>
        
        <View style={styles.earnPointsContainer}>
          <View style={styles.earnPointItem}>
            <Ionicons name="boat-outline" size={24} color="#0080ff" />
            <Text style={styles.earnPointText}>Book a cruise: 100 points per $100</Text>
          </View>
          
          <View style={styles.earnPointItem}>
            <Ionicons name="star-outline" size={24} color="#0080ff" />
            <Text style={styles.earnPointText}>Write a review: 50 points</Text>
          </View>
          
          <View style={styles.earnPointItem}>
            <Ionicons name="share-outline" size={24} color="#0080ff" />
            <Text style={styles.earnPointText}>Refer a friend: 200 points</Text>
          </View>
          
          <View style={styles.earnPointItem}>
            <Ionicons name="calendar-outline" size={24} color="#0080ff" />
            <Text style={styles.earnPointText}>Birthday bonus: 100 points</Text>
          </View>
        </View>
      </View>

      {/* Tier Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Membership Tiers</Text>
        
        {tiers.map((tier, index) => (
          <View 
            key={tier.name} 
            style={[
              styles.tierCard,
              tier.name === currentTier && styles.currentTierCard
            ]}
          >
            <View style={styles.tierHeader}>
              <View style={[styles.tierBadgeSmall, { backgroundColor: tier.color }]}>
                <Ionicons name="star" size={16} color="#000" />
                <Text style={styles.tierNameSmall}>{tier.name}</Text>
              </View>
              <Text style={styles.tierPoints}>{tier.minPoints}+ points</Text>
            </View>
            
            <View style={styles.tierBenefits}>
              {tier.benefits.map((benefit, benefitIndex) => (
                <View key={benefitIndex} style={styles.tierBenefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#0080ff" />
                  <Text style={styles.tierBenefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Redeem Points */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Redeem Points</Text>
        
        <TouchableOpacity style={styles.redeemButton}>
          <Ionicons name="gift-outline" size={24} color="#0080ff" />
          <View style={styles.redeemText}>
            <Text style={styles.redeemTitle}>View Rewards Catalog</Text>
            <Text style={styles.redeemSubtitle}>Redeem points for exclusive rewards</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
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
  statusCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5,
  },
  currentPoints: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0080ff',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0080ff',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f0f8ff',
  },
  earnPointsContainer: {
    padding: 20,
  },
  earnPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  earnPointText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  tierCard: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  currentTierCard: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: '#0080ff',
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  tierBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  tierNameSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 4,
  },
  tierPoints: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  tierBenefits: {
    marginTop: 10,
  },
  tierBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tierBenefitText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  redeemText: {
    flex: 1,
    marginLeft: 15,
  },
  redeemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  redeemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default LoyaltyProgramScreen;
