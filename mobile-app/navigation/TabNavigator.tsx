/**
 * New Tab Navigator with only 3 bottom tabs
 * Settings | Profile | Main Menu (Right Drawer)
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import screens
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import DahabiyatScreen from '../screens/DahabiyatScreen';
import PackagesScreen from '../screens/PackagesScreen';
import ItinerariesScreen from '../screens/ItinerariesScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ContactScreen from '../screens/ContactScreen';
import AboutScreen from '../screens/AboutScreen';

// Custom Right Drawer Component
import RightDrawerContent from '../components/RightDrawerContent';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Right Drawer Navigator for Main Menu
function MainMenuDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <RightDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: '#f0f8ff',
          width: 300,
        },
        headerStyle: {
          backgroundColor: '#0080ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#0080ff',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Dahabiyat" 
        component={DahabiyatScreen}
        options={{
          title: 'Dahabiyat Fleet',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="boat-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Packages" 
        component={PackagesScreen}
        options={{
          title: 'Journey Packages',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Itineraries" 
        component={ItinerariesScreen}
        options={{
          title: 'Itineraries',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Gallery" 
        component={GalleryScreen}
        options={{
          title: 'Gallery',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="images-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          title: 'About Us',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Contact" 
        component={ContactScreen}
        options={{
          title: 'Contact Us',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="mail-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Custom Tab Bar Button for Main Menu
function MainMenuButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
      }}
    >
      <Ionicons name="menu-outline" size={24} color="#0080ff" />
    </TouchableOpacity>
  );
}

// Main Tab Navigator with only 3 tabs
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#0080ff',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0080ff',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#0080ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="MainMenu"
        component={MainMenuDrawer}
        options={{
          title: 'Menu',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
