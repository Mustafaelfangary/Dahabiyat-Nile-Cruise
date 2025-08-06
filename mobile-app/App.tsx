/**
 * Dahabiyat Nile Cruise Mobile App
 * Ocean Blue Theme - Version 2.0
 * 
 * New Navigation Structure:
 * - 3 Bottom Tabs: Settings | Profile | Main Menu
 * - Right Slide Menu with all navigation options
 * - Same content as website with loyalty program
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Navigation
import AppStackNavigator from './navigation/AppStackNavigator';

// Contexts (if they exist)
// import { AuthProvider } from './contexts/AuthContext';
// import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Theme Provider */}
        {/* <ThemeProvider> */}
          {/* Auth Provider */}
          {/* <AuthProvider> */}
            <NavigationContainer>
              <AppStackNavigator />
              <StatusBar style="light" backgroundColor="#0080ff" />
            </NavigationContainer>
          {/* </AuthProvider> */}
        {/* </ThemeProvider> */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
