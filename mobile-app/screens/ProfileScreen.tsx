/**
 * Profile Screen with Rewards Program
 * User profile and rewards program features
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface ProfileItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  rightComponent?: React.ReactNode;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
}) => (
  <TouchableOpacity style={styles.profileItem} onPress={onPress}>
    <View style={styles.profileLeft}>
      <Ionicons name={icon as any} size={24} color="#0080ff" style={styles.profileIcon} />
      <View style={styles.profileText}>
        <Text style={styles.profileTitle}>{title}</Text>
        {subtitle && <Text style={styles.profileSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightComponent || <Ionicons name="chevron-forward" size={20} color="#ccc" />}
  </TouchableOpacity>
);

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [user] = useState({
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+20 123 456 7890',
    memberSince: '2023',
    rewardPoints: 2450,
    rewardTier: 'Gold',
    totalBookings: 8,
    avatar: null,
  });

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleRewardsProgram = () => {
    navigation.navigate('RewardsProgram' as never);
  };

  const handleBookingHistory = () => {
    navigation.navigate('BookingHistory' as never);
  };

  const handleWishlist = () => {
    navigation.navigate('Wishlist' as never);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return '#FFD700';
      case 'Silver': return '#C0C0C0';
      case 'Bronze': return '#CD7F32';
      default: return '#0080ff';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color="#ffffff" />
            </View>
          )}
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        {/* Rewards Status */}
        <View style={styles.rewardContainer}>
          <View style={[styles.rewardBadge, { backgroundColor: getTierColor(user.rewardTier) }]}>
            <Ionicons name="star" size={16} color="#000" />
            <Text style={styles.rewardTier}>{user.rewardTier} Member</Text>
          </View>
          <Text style={styles.rewardPoints}>{user.rewardPoints} Points</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.totalBookings}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.rewardPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.memberSince}</Text>
          <Text style={styles.statLabel}>Member Since</Text>
        </View>
      </View>

      {/* Profile Actions */}
      <View style={styles.section}>
        <ProfileItem
          icon="person-outline"
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={handleEditProfile}
        />

        <ProfileItem
          icon="star-outline"
          title="Rewards Program"
          subtitle={`${user.rewardTier} - ${user.rewardPoints} points`}
          onPress={handleRewardsProgram}
        />

        <ProfileItem
          icon="time-outline"
          title="Booking History"
          subtitle={`${user.totalBookings} completed bookings`}
          onPress={handleBookingHistory}
        />

        <ProfileItem
          icon="heart-outline"
          title="My Wishlist"
          subtitle="Saved dahabiyat and packages"
          onPress={handleWishlist}
        />
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <ProfileItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Manage your notification preferences"
          onPress={() => {}}
        />

        <ProfileItem
          icon="shield-outline"
          title="Privacy & Security"
          subtitle="Manage your privacy settings"
          onPress={() => {}}
        />

        <ProfileItem
          icon="card-outline"
          title="Payment Methods"
          subtitle="Manage your payment options"
          onPress={() => {}}
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <ProfileItem
          icon="help-circle-outline"
          title="Help & Support"
          subtitle="Get help with your account"
          onPress={() => {}}
        />

        <ProfileItem
          icon="chatbubble-outline"
          title="Contact Us"
          subtitle="Reach out to our support team"
          onPress={() => {}}
        />
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
          <Text style={styles.logoutText}>Logout</Text>
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
    paddingVertical: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0066cc',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#e6f3ff',
    marginBottom: 15,
  },
  rewardContainer: {
    alignItems: 'center',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  rewardTier: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5,
  },
  rewardPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginTop: 20,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0080ff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f0f8ff',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileIcon: {
    marginRight: 15,
    width: 24,
  },
  profileText: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ff4444',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default ProfileScreen;
