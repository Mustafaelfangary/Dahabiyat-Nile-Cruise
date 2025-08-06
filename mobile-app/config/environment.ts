/**
 * Environment Configuration for Dahabiyat Mobile App
 * Handles different environments (development, staging, production)
 */

export interface Environment {
  name: string;
  apiUrl: string;
  websiteUrl: string;
  debug: boolean;
  timeout: number;
}

const environments: Record<string, Environment> = {
  development: {
    name: 'Development',
    apiUrl: 'http://localhost:3000',
    websiteUrl: 'http://localhost:3000',
    debug: true,
    timeout: 10000,
  },
  staging: {
    name: 'Staging',
    apiUrl: 'https://staging.dahabiyatnilecruise.com',
    websiteUrl: 'https://staging.dahabiyatnilecruise.com',
    debug: true,
    timeout: 15000,
  },
  production: {
    name: 'Production',
    apiUrl: 'https://dahabiyatnilecruise.com',
    websiteUrl: 'https://dahabiyatnilecruise.com',
    debug: false,
    timeout: 20000,
  },
};

// Determine current environment
const getCurrentEnvironment = (): Environment => {
  // In a real app, this could be determined by build configuration
  // For now, we'll use production as default
  const envName = __DEV__ ? 'development' : 'production';
  
  const env = environments[envName];
  if (!env) {
    console.warn(`Environment '${envName}' not found, falling back to production`);
    return environments.production;
  }
  
  console.log(`🌍 Current Environment: ${env.name}`);
  console.log(`🔗 API URL: ${env.apiUrl}`);
  
  return env;
};

export const currentEnvironment = getCurrentEnvironment();

// Export individual values for convenience
export const {
  apiUrl: API_URL,
  websiteUrl: WEBSITE_URL,
  debug: DEBUG_MODE,
  timeout: REQUEST_TIMEOUT,
} = currentEnvironment;

// API endpoints
export const API_ENDPOINTS = {
  // Dahabiyas
  DAHABIYAS: '/api/dashboard/dahabiyat',
  DAHABIYA_DETAIL: (id: string) => `/api/dahabiyas/${id}`,
  
  // Packages
  PACKAGES: '/api/packages',
  PACKAGE_DETAIL: (id: string) => `/api/packages/${id}`,
  
  // Bookings
  BOOKINGS: '/api/bookings',
  USER_BOOKINGS: '/api/user/bookings',
  AVAILABILITY: '/api/availability',
  
  // Content
  WEBSITE_CONTENT: '/api/website-content',
  GALLERY: '/api/gallery',
  
  // Static assets
  IMAGES: '/images',
  LOGO: '/images/logo.png',
};

// App configuration
export const APP_CONFIG = {
  NAME: 'Dahabiyat Nile Cruise',
  VERSION: '3.0.0',
  BUNDLE_ID: 'com.dahabiyat.nilecruise',
  SCHEME: 'dahabiyat',
  
  // Colors
  COLORS: {
    PRIMARY: '#0080ff',
    SECONDARY: '#f0f8ff',
    BACKGROUND: '#f8f9fa',
    TEXT: '#333333',
    ERROR: '#dc3545',
    SUCCESS: '#28a745',
    WARNING: '#ffc107',
  },
  
  // Timeouts
  TIMEOUTS: {
    API_REQUEST: REQUEST_TIMEOUT,
    IMAGE_LOAD: 10000,
    SPLASH_SCREEN: 2000,
  },
  
  // Features
  FEATURES: {
    OFFLINE_MODE: false,
    PUSH_NOTIFICATIONS: true,
    ANALYTICS: !DEBUG_MODE,
    CRASH_REPORTING: !DEBUG_MODE,
  },
};

export default currentEnvironment;
