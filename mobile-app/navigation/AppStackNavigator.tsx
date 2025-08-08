/**
 * App Stack Navigator for Dahabiyat Mobile App
 * Main navigation structure with authentication flow
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Main Screens
import TabNavigator from './TabNavigator';

// Authentication Screens
import SigninScreen from '../screens/auth/SigninScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Individual Screens
import {
  HomeScreen,
  DahabiyatScreen,
  PackagesScreen,
  BookingScreen,
  BookingHistoryScreen,
  GalleryScreen,
  ReviewsScreen,
  MapScreen,
  ContactScreen,
  AdminScreen,
  BlogsScreen,
  BlogDetailScreen,
} from '../screens';

// Additional Screens
import ContactDeveloperScreen from '../screens/ContactDeveloperScreen';
import LoyaltyProgramScreen from '../screens/LoyaltyProgramScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ItinerariesScreen from '../screens/ItinerariesScreen';
import AboutScreen from '../screens/AboutScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Admin Screens
import AdminPackagesScreen from '../screens/admin/AdminPackagesScreen';
import AdminContentScreen from '../screens/admin/AdminContentScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import AdminBookingsScreen from '../screens/admin/AdminBookingsScreen';

// UI Components
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Stack = createStackNavigator();

const AppStackNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, isGuest, user } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const screenOptions = {
    headerStyle: {
      backgroundColor: '#f0f8ff', // Pale blue background
      borderBottomColor: '#e0e0e0',
      borderBottomWidth: 1,
    },
    headerTintColor: '#000000', // Dark black text
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#000000', // Ensure title is dark
    },
    headerBackTitleVisible: false,
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!isAuthenticated && !isGuest ? (
        // Authentication Stack
        <>
          <Stack.Screen 
            name="Signin" 
            component={SigninScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen}
            options={{ 
              title: 'Reset Password',
              headerShown: true,
            }}
          />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />

          {/* Individual Screens accessible from Menu */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Home' }}
          />

          <Stack.Screen
            name="Dahabiyat"
            component={DahabiyatScreen}
            options={{ title: 'Dahabiyat Fleet' }}
          />

          <Stack.Screen
            name="DahabiyaList"
            component={DahabiyaListScreen}
            options={{ title: 'Our Dahabiyas', headerShown: false }}
          />

          <Stack.Screen
            name="Packages"
            component={PackagesScreen}
            options={{ title: 'Journey Packages' }}
          />

          <Stack.Screen
            name="PackageList"
            component={PackageListScreen}
            options={{ title: 'Travel Packages', headerShown: false }}
          />

          <Stack.Screen
            name="Booking"
            component={BookingScreen}
            options={{ title: 'Book Your Journey', headerShown: false }}
          />

          <Stack.Screen
            name="BookingHistory"
            component={BookingHistoryScreen}
            options={{ title: 'My Bookings' }}
          />

          <Stack.Screen
            name="Gallery"
            component={GalleryScreen}
            options={{ title: 'Sacred Gallery' }}
          />

          <Stack.Screen
            name="Reviews"
            component={ReviewsScreen}
            options={{ title: 'Customer Reviews' }}
          />

          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ title: 'Map & Locations' }}
          />

          <Stack.Screen
            name="Contact"
            component={ContactScreen}
            options={{ title: 'Contact Us' }}
          />

          <Stack.Screen
            name="ContactDeveloper"
            component={ContactDeveloperScreen}
            options={{ title: 'Contact Developer' }}
          />

          <Stack.Screen
            name="LoyaltyProgram"
            component={LoyaltyProgramScreen}
            options={{ title: 'Loyalty Program' }}
          />

          <Stack.Screen
            name="Wishlist"
            component={WishlistScreen}
            options={{ title: 'My Wishlist' }}
          />

          <Stack.Screen
            name="Itineraries"
            component={ItinerariesScreen}
            options={{ title: 'Itineraries' }}
          />

          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ title: 'About Us' }}
          />

          <Stack.Screen
            name="Blogs"
            component={BlogsScreen}
            options={{ title: 'Ancient Blogs' }}
          />

          <Stack.Screen
            name="BlogDetail"
            component={BlogDetailScreen}
            options={{ title: 'Blog Post', headerShown: false }}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />

          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{ title: 'Admin Panel' }}
          />

          {/* Admin Management Screens */}
          <Stack.Screen
            name="AdminPackages"
            component={AdminPackagesScreen}
            options={{ title: 'Package Management' }}
          />

          <Stack.Screen
            name="AdminContent"
            component={AdminContentScreen}
            options={{ title: 'Content Management' }}
          />

          <Stack.Screen
            name="AdminUsers"
            component={AdminUsersScreen}
            options={{ title: 'User Management' }}
          />

          <Stack.Screen
            name="AdminBookings"
            component={AdminBookingsScreen}
            options={{ title: 'Booking Management' }}
          />

          <Stack.Screen
            name="AdminAnalytics"
            component={AdminAnalyticsScreen}
            options={{ title: 'Analytics Dashboard' }}
          />

          <Stack.Screen
            name="AdminSettings"
            component={AdminSettingsScreen}
            options={{ title: 'System Settings' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppStackNavigator;
