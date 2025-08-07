# Android App Deployment Guide

## 🚀 **Production Deployment Status**

### ✅ **Configuration Complete**
- **Production Domain**: `https://dahabiyatnilecruise.com` ✅
- **API Endpoints**: All configured for production ✅
- **Ocean Blue Theme**: Applied throughout app ✅
- **Content Synchronization**: Active with web platform ✅
- **Booking System**: Integrated with unified backend ✅

---

## 📱 **Android App Configuration**

### **Environment Configuration**
**File**: `mobile-app/config/environment.ts`

```typescript
production: {
  name: 'Production',
  apiUrl: 'https://dahabiyatnilecruise.com',
  websiteUrl: 'https://dahabiyatnilecruise.com',
  debug: false,
  timeout: 20000,
}
```

### **App Constants**
**File**: `mobile-app/constants/AppConstants.ts`

```typescript
export const APP_CONSTANTS = {
  API_BASE_URL: 'https://dahabiyatnilecruise.com', // ✅ Production domain
  
  DEVELOPER: {
    NAME: 'Just X Development',
    COMPANY: 'Just X',
    PHONE: '+201200958713',
    EMAIL: 'developer@justx.com',
    WEBSITE: 'https://justx.com',
  },
  
  COMPANY: {
    NAME: 'Cleopatra Dahabiyat',
    ADDRESS: 'Luxor, Egypt',
    PHONE: '+20 123 456 789',
    EMAIL: 'info@cleopatradarabiyat.com'
  }
};
```

### **Expo Configuration**
**File**: `mobile-app/app.json`

```json
{
  "expo": {
    "name": "Dahabiyat Nile Cruise",
    "slug": "dahabiyat-nile-cruise",
    "version": "3.0.0",
    "android": {
      "package": "com.dahabiyat.nilecruise",
      "usesCleartextTraffic": false,
      "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"]
    },
    "extra": {
      "apiUrl": "https://dahabiyatnilecruise.com",
      "websiteUrl": "https://dahabiyatnilecruise.com"
    }
  }
}
```

---

## 🔧 **Build & Deployment Steps**

### **Prerequisites**
```bash
# Install dependencies
cd mobile-app
npm install

# Install Expo CLI globally
npm install -g @expo/cli
```

### **Development Build**
```bash
# Start development server
cd mobile-app
expo start

# Run on Android device/emulator
expo start --android
```

### **Production Build**

#### **Option 1: EAS Build (Recommended)**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android --profile production
```

#### **Option 2: Local Build**
```bash
# Build APK locally
expo build:android --type apk

# Build AAB for Play Store
expo build:android --type app-bundle
```

### **Build Configuration**
**File**: `mobile-app/eas.json` (create if needed)

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## 🌐 **API Integration Status**

### **Endpoints Configured**
- ✅ **Dahabiyas**: `/api/dashboard/dahabiyat`
- ✅ **Packages**: `/api/packages`
- ✅ **Bookings**: `/api/bookings`
- ✅ **Availability**: `/api/availability`
- ✅ **Content**: `/api/website-content`
- ✅ **Gallery**: `/api/gallery`

### **Authentication**
- ✅ Bearer token support for authenticated requests
- ✅ User session management
- ✅ Booking authorization

### **Data Synchronization**
- ✅ Real-time content updates from `https://dahabiyatnilecruise.com`
- ✅ Offline fallback to cached content
- ✅ Automatic retry mechanisms

---

## 🎨 **Ocean Blue Theme Applied**

### **Color Scheme**
```typescript
COLORS: {
  PRIMARY: '#0080ff',      // Ocean Blue
  SECONDARY: '#f0f8ff',    // Light Blue
  BACKGROUND: '#f8f9fa',   // Light Gray
  TEXT: '#333333',         // Dark Gray
  ERROR: '#dc3545',        // Red
  SUCCESS: '#28a745',      // Green
  WARNING: '#ffc107',      // Yellow
}
```

### **Theme Features**
- ✅ Ocean blue primary color throughout
- ✅ Consistent with web application
- ✅ Hieroglyphic elements preserved
- ✅ Professional appearance

---

## 📋 **Testing Checklist**

### **Before Deployment**
- [ ] Test API connectivity to `https://dahabiyatnilecruise.com`
- [ ] Verify booking system integration
- [ ] Test content synchronization
- [ ] Check image loading from production domain
- [ ] Validate user authentication flow
- [ ] Test offline functionality
- [ ] Verify push notification setup (if enabled)

### **Production Validation**
```bash
# Test API connectivity
curl https://dahabiyatnilecruise.com/api/dashboard/dahabiyat

# Test content endpoint
curl https://dahabiyatnilecruise.com/api/website-content

# Test booking endpoint (requires auth)
curl -X POST https://dahabiyatnilecruise.com/api/bookings
```

---

## 🚀 **Deployment Commands**

### **Quick Deployment**
```bash
# Navigate to mobile app
cd mobile-app

# Sync latest content
node ../scripts/sync-content-across-platforms.js

# Build for production
eas build --platform android --profile production

# Or build APK for testing
expo build:android --type apk
```

### **Update App Store**
```bash
# Build app bundle for Google Play
eas build --platform android --profile production

# Submit to Google Play (if configured)
eas submit --platform android
```

---

## 📱 **App Features**

### **Core Functionality**
- ✅ Browse Dahabiya fleet
- ✅ View journey packages
- ✅ Book trips with real-time availability
- ✅ User profile and loyalty program
- ✅ Gallery and blog integration
- ✅ Contact and support features

### **Technical Features**
- ✅ Real-time API integration
- ✅ Offline content caching
- ✅ Ocean blue theme consistency
- ✅ Responsive design
- ✅ Error handling and retry logic

---

## 🔗 **Important Links**

- **Production Website**: https://dahabiyatnilecruise.com
- **API Base URL**: https://dahabiyatnilecruise.com
- **GitHub Repository**: https://github.com/Mustafaelfangary/Dahabiyat-Nile-Cruise
- **Mobile App Directory**: `/mobile-app`

---

## ⚠️ **Important Notes**

1. **Domain Configuration**: All API calls now point to `https://dahabiyatnilecruise.com`
2. **SSL Required**: App only works with HTTPS (no cleartext traffic)
3. **Content Sync**: Run sync script after any content changes
4. **Version**: Current app version is 3.0.0 with ocean blue theme
5. **Build Type**: Use app-bundle for Play Store, APK for testing

---

**✅ The Android application is now fully configured and ready for production deployment with the real domain `https://dahabiyatnilecruise.com`**
