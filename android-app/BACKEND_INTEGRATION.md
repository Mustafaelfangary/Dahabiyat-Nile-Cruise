# 🔗 Backend Integration Guide - Using Your Existing Infrastructure

## 🎯 Overview

This Android app is designed to use your **existing backend infrastructure** instead of Firebase. It connects directly to your PostgreSQL database through your current API endpoints, uses the same authentication system, and can be managed through your existing admin panel.

## 🏗️ Architecture Benefits

### ✅ **Why Use Your Existing Backend:**
- **Single Source of Truth** - One database for website and app
- **Unified Admin Panel** - Manage both web and mobile content
- **Same Authentication** - Users can sign in on both platforms
- **Cost Effective** - No additional Firebase costs
- **Data Consistency** - Real-time sync between web and mobile
- **Existing Infrastructure** - Leverage your current setup

### ❌ **Firebase Removed:**
- No Firebase Authentication (using your JWT system)
- No Firestore (using your PostgreSQL)
- No Firebase Analytics (using your backend analytics)
- No Firebase Hosting (using your existing hosting)
- Only keeping FCM for push notifications (optional)

## 🔧 Backend Requirements

### **Current API Endpoints (Already Working):**
```
✅ POST /api/auth/signin           - User login
✅ POST /api/auth/signup           - User registration  
✅ POST /api/auth/verify-email     - Email verification
✅ POST /api/auth/forgot-password  - Password reset
✅ GET  /api/dahabiyas            - Get dahabiyas list
✅ GET  /api/packages             - Get packages list
✅ GET  /api/itineraries          - Get itineraries
✅ GET  /api/gallery              - Get gallery images
✅ GET  /api/blogs                - Get blog posts
✅ GET  /api/user/profile         - User profile
✅ GET  /api/user/stats           - User statistics
✅ POST /api/bookings             - Create booking
✅ GET  /api/bookings             - Get user bookings
✅ POST /api/contact              - Contact form
✅ GET  /api/website-content      - CMS content
```

### **Additional Endpoints Needed for Mobile:**

#### **1. Mobile-Specific User Endpoints:**
```javascript
// Get user preferences for mobile app
GET /api/user/preferences
Response: {
  language: "en",
  currency: "USD", 
  notifications: {
    bookingUpdates: true,
    promotions: true,
    pushNotifications: true
  },
  theme: "system"
}

// Update user preferences
PUT /api/user/preferences
Body: { language, currency, notifications, theme }

// Upload user avatar
POST /api/user/avatar
Body: FormData with image file

// Register device for push notifications
POST /api/user/register-device
Body: {
  deviceToken: "fcm_token",
  platform: "android",
  appVersion: "1.0.0"
}
```

#### **2. Mobile App Configuration:**
```javascript
// Get mobile app settings
GET /api/mobile/config
Response: {
  appVersion: "1.0.0",
  minAppVersion: "1.0.0",
  maintenanceMode: false,
  forceUpdate: false,
  features: {
    biometricAuth: true,
    offlineMode: true,
    pushNotifications: true
  }
}

// Get app content for offline caching
GET /api/mobile/content
Response: {
  dahabiyas: [...],
  packages: [...],
  gallery: [...],
  lastUpdated: "2024-01-01T00:00:00Z"
}
```

#### **3. Enhanced Booking Endpoints:**
```javascript
// Check package availability for dates
POST /api/bookings/check-availability
Body: {
  packageId: "pkg_123",
  checkIn: "2024-06-01",
  checkOut: "2024-06-08",
  guests: 2
}

// Calculate booking price
POST /api/bookings/calculate-price
Body: {
  packageId: "pkg_123",
  guests: 2,
  duration: 7,
  addOns: ["guide", "meals"]
}

// Cancel booking
PUT /api/bookings/{id}/cancel
Body: { reason: "Change of plans" }
```

## 📱 Admin Panel Extensions

### **New Mobile Management Section:**

#### **1. Mobile Users Dashboard:**
```sql
-- Add mobile-specific columns to users table
ALTER TABLE users ADD COLUMN device_tokens JSONB DEFAULT '[]';
ALTER TABLE users ADD COLUMN app_version VARCHAR(20);
ALTER TABLE users ADD COLUMN last_app_login TIMESTAMP;
ALTER TABLE users ADD COLUMN push_notifications_enabled BOOLEAN DEFAULT true;
```

#### **2. Mobile Content Management:**
Add to your existing admin panel:
- **App Configuration** - Version control, maintenance mode
- **Push Notifications** - Send notifications to mobile users
- **Mobile Analytics** - App usage statistics
- **Device Management** - View registered devices
- **Offline Content** - Manage cached content

#### **3. Enhanced CMS for Mobile:**
```sql
-- Add mobile-specific content fields
ALTER TABLE website_content ADD COLUMN mobile_optimized BOOLEAN DEFAULT false;
ALTER TABLE website_content ADD COLUMN mobile_content TEXT;
ALTER TABLE website_content ADD COLUMN app_section VARCHAR(50);
```

## 🔐 Authentication Integration

### **JWT Token System (Already Working):**
```javascript
// Your existing auth flow works perfectly:
1. User signs up/in through app
2. Backend validates credentials
3. Returns JWT token + user data
4. App stores token securely
5. All API calls include Authorization header
6. Same token works for web and mobile
```

### **Enhanced Security for Mobile:**
```javascript
// Add device fingerprinting
POST /api/auth/signin
Body: {
  email: "user@example.com",
  password: "password",
  deviceInfo: {
    deviceId: "unique_device_id",
    platform: "android",
    appVersion: "1.0.0",
    osVersion: "14"
  }
}

// Biometric authentication setup
POST /api/auth/setup-biometric
Body: {
  publicKey: "biometric_public_key",
  deviceId: "unique_device_id"
}
```

## 📊 Database Schema Extensions

### **Mobile-Specific Tables:**
```sql
-- Device registrations for push notifications
CREATE TABLE user_devices (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  device_token VARCHAR(500) NOT NULL,
  platform VARCHAR(20) NOT NULL, -- 'android' or 'ios'
  app_version VARCHAR(20),
  device_info JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mobile app analytics
CREATE TABLE mobile_analytics (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  screen_name VARCHAR(100),
  session_id VARCHAR(255),
  app_version VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Push notification history
CREATE TABLE push_notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'sent'
);
```

## 🚀 Implementation Steps

### **Step 1: Backend API Extensions**
```bash
# Add these endpoints to your existing API:
1. Copy mobile endpoints from above
2. Add authentication middleware
3. Test with Postman/curl
4. Update API documentation
```

### **Step 2: Database Updates**
```sql
-- Run these SQL commands on your PostgreSQL:
-- (Copy the CREATE TABLE statements above)
```

### **Step 3: Admin Panel Updates**
```javascript
// Add these sections to your admin panel:
1. Mobile Users management
2. Push notification sender
3. App configuration settings
4. Mobile analytics dashboard
```

### **Step 4: Android App Configuration**
```kotlin
// Update Constants.kt with your API URL:
const val BASE_URL = "https://www.dahabiyatnilecruise.com/api/"

// Update local.properties:
API_BASE_URL=https://www.dahabiyatnilecruise.com/api/
WEBSITE_URL=https://www.dahabiyatnilecruise.com
```

## 📱 Push Notifications (Optional)

### **Using Your Backend Instead of Firebase:**
```javascript
// Send push notifications from your backend
POST /api/admin/send-notification
Body: {
  userIds: ["user1", "user2"], // or "all"
  title: "Booking Confirmed",
  message: "Your Nile cruise is confirmed!",
  data: {
    type: "booking",
    bookingId: "booking_123"
  }
}

// Your backend sends to FCM:
const admin = require('firebase-admin');
await admin.messaging().sendMulticast({
  tokens: deviceTokens,
  notification: { title, body: message },
  data: data
});
```

## 🔄 Data Synchronization

### **Real-time Sync Between Web and Mobile:**
```javascript
// When admin updates content on web:
1. Content saved to PostgreSQL
2. Cache invalidated
3. Push notification sent to mobile users
4. Mobile app refreshes content

// When user books on mobile:
1. Booking saved to PostgreSQL  
2. Email confirmation sent
3. Admin panel updated in real-time
4. Website booking list updated
```

## 📊 Analytics Integration

### **Using Your Backend Analytics:**
```javascript
// Track mobile events in your existing system
POST /api/analytics/track
Body: {
  event: "screen_view",
  screen: "dahabiyas_list", 
  userId: "user_123",
  properties: {
    platform: "android",
    appVersion: "1.0.0"
  }
}
```

## 🎯 Benefits Summary

✅ **Unified System** - One backend for web and mobile  
✅ **Cost Effective** - No Firebase costs  
✅ **Data Consistency** - Single source of truth  
✅ **Admin Control** - Manage everything from one panel  
✅ **Scalable** - Uses your existing infrastructure  
✅ **Secure** - Same authentication system  
✅ **Maintainable** - One codebase to maintain  

## 🚀 Next Steps

1. **Review current API endpoints** - Most already work!
2. **Add mobile-specific endpoints** - User preferences, device registration
3. **Extend admin panel** - Mobile management sections
4. **Update database schema** - Add mobile tables
5. **Configure Android app** - Point to your API
6. **Test integration** - Verify all features work
7. **Deploy and monitor** - Launch with confidence

Your existing infrastructure is perfect for mobile! 🎉
