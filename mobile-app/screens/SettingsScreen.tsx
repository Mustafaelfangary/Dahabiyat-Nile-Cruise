/**
 * Settings Screen
 * App settings and preferences
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingLeft}>
      <Ionicons name={icon as any} size={24} color="#0080ff" style={styles.settingIcon} />
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightComponent || <Ionicons name="chevron-forward" size={20} color="#ccc" />}
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const handleLanguagePress = () => {
    Alert.alert(
      'Language Settings',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => {} },
        { text: 'العربية', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCurrencyPress = () => {
    Alert.alert(
      'Currency Settings',
      'Choose your preferred currency',
      [
        { text: 'USD ($)', onPress: () => {} },
        { text: 'EUR (€)', onPress: () => {} },
        { text: 'EGP (£)', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your app experience</Text>
      </View>

      {/* General Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <SettingItem
          icon="notifications-outline"
          title="Push Notifications"
          subtitle="Receive booking updates and offers"
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ccc', true: '#0080ff' }}
              thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          subtitle="Switch to dark theme"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#ccc', true: '#0080ff' }}
              thumbColor={darkMode ? '#ffffff' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon="language-outline"
          title="Language"
          subtitle="English"
          onPress={handleLanguagePress}
        />

        <SettingItem
          icon="card-outline"
          title="Currency"
          subtitle="USD ($)"
          onPress={handleCurrencyPress}
        />
      </View>

      {/* Data & Sync */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Sync</Text>
        
        <SettingItem
          icon="sync-outline"
          title="Auto Sync"
          subtitle="Automatically sync data when connected"
          rightComponent={
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#ccc', true: '#0080ff' }}
              thumbColor={autoSync ? '#ffffff' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon="trash-outline"
          title="Clear Cache"
          subtitle="Free up storage space"
          onPress={handleClearCache}
        />
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        <SettingItem
          icon="finger-print-outline"
          title="Biometric Login"
          subtitle="Use fingerprint or face ID"
          rightComponent={
            <Switch
              value={biometric}
              onValueChange={setBiometric}
              trackColor={{ false: '#ccc', true: '#0080ff' }}
              thumbColor={biometric ? '#ffffff' : '#f4f3f4'}
            />
          }
        />
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <SettingItem
          icon="information-circle-outline"
          title="App Version"
          subtitle="2.0.0 (Ocean Blue)"
        />

        <SettingItem
          icon="help-circle-outline"
          title="Help & Support"
          subtitle="Get help and contact support"
        />

        <SettingItem
          icon="document-text-outline"
          title="Privacy Policy"
          subtitle="Read our privacy policy"
        />

        <SettingItem
          icon="shield-checkmark-outline"
          title="Terms of Service"
          subtitle="Read our terms of service"
        />
      </View>
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
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f0f8ff',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 15,
    width: 24,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default SettingsScreen;
