/**
 * Custom Right Drawer Content
 * Contains all main navigation options with Ocean Blue theme
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface DrawerItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

const DrawerItem: React.FC<DrawerItemProps> = ({ icon, label, onPress, isActive = false }) => (
  <TouchableOpacity
    style={[styles.drawerItem, isActive && styles.activeDrawerItem]}
    onPress={onPress}
  >
    <Ionicons 
      name={icon as any} 
      size={24} 
      color={isActive ? '#ffffff' : '#0080ff'} 
      style={styles.drawerIcon}
    />
    <Text style={[styles.drawerLabel, isActive && styles.activeDrawerLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const RightDrawerContent: React.FC<any> = (props) => {
  const navigation = useNavigation();

  const menuItems = [
    {
      icon: 'home-outline',
      label: 'Home',
      screen: 'Home',
    },
    {
      icon: 'boat-outline',
      label: 'Dahabiyat Fleet',
      screen: 'Dahabiyat',
    },
    {
      icon: 'gift-outline',
      label: 'Journey Packages',
      screen: 'Packages',
    },
    {
      icon: 'map-outline',
      label: 'Itineraries',
      screen: 'Itineraries',
    },
    {
      icon: 'images-outline',
      label: 'Gallery',
      screen: 'Gallery',
    },
    {
      icon: 'book-outline',
      label: 'Ancient Blogs',
      screen: 'Blogs',
    },
    {
      icon: 'star-outline',
      label: 'Reviews',
      screen: 'Reviews',
    },
    {
      icon: 'location-outline',
      label: 'Map & Locations',
      screen: 'Map',
    },
    {
      icon: 'information-circle-outline',
      label: 'About Us',
      screen: 'About',
    },
    {
      icon: 'mail-outline',
      label: 'Contact Us',
      screen: 'Contact',
    },
    {
      icon: 'calendar-outline',
      label: 'Book Journey',
      screen: 'Booking',
    },
    {
      icon: 'time-outline',
      label: 'My Bookings',
      screen: 'BookingHistory',
    },
  ];

  const handleItemPress = (screen: string) => {
    navigation.navigate(screen as never);
    props.navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🏺</Text>
          <Text style={styles.appName}>Dahabiyat</Text>
          <Text style={styles.appSubtitle}>Nile Cruise</Text>
        </View>
      </View>

      {/* Menu Items */}
      <DrawerContentScrollView {...props} style={styles.scrollView}>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <DrawerItem
              key={index}
              icon={item.icon}
              label={item.label}
              onPress={() => handleItemPress(item.screen)}
              isActive={false} // You can implement active state logic here
            />
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ocean Blue Theme</Text>
        <Text style={styles.versionText}>Version 2.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  header: {
    backgroundColor: '#0080ff',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0066cc',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#e6f3ff',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  menuContainer: {
    paddingVertical: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  activeDrawerItem: {
    backgroundColor: '#0080ff',
  },
  drawerIcon: {
    marginRight: 15,
    width: 24,
  },
  drawerLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activeDrawerLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    color: '#999',
  },
});

export default RightDrawerContent;
