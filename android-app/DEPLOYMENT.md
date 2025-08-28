# Deployment Guide - Dahabiyat Nile Cruise Android App

This guide covers the complete deployment process for the Dahabiyat Nile Cruise Android application.

## 🚀 Pre-Deployment Checklist

### Code Quality
- [ ] All unit tests pass
- [ ] UI tests pass
- [ ] Code review completed
- [ ] No lint warnings
- [ ] ProGuard rules configured
- [ ] Security audit completed

### Backend Integration
- [ ] API endpoints tested
- [ ] Database connections verified
- [ ] Authentication flow tested
- [ ] Payment integration tested
- [ ] Push notifications configured
- [ ] Analytics tracking implemented

### App Configuration
- [ ] App icons added (all densities)
- [ ] Splash screen configured
- [ ] App name and version updated
- [ ] Permissions properly declared
- [ ] Network security config set
- [ ] Backup rules configured

## 🔧 Build Configuration

### Release Build Setup

1. **Update Version Information**
   ```kotlin
   // In app/build.gradle.kts
   android {
       defaultConfig {
           versionCode = 1
           versionName = "1.0.0"
       }
   }
   ```

2. **Configure Signing**
   ```kotlin
   android {
       signingConfigs {
           create("release") {
               storeFile = file("path/to/keystore.jks")
               storePassword = "your_store_password"
               keyAlias = "your_key_alias"
               keyPassword = "your_key_password"
           }
       }
       buildTypes {
           release {
               signingConfig = signingConfigs.getByName("release")
               isMinifyEnabled = true
               proguardFiles(
                   getDefaultProguardFile("proguard-android-optimize.txt"),
                   "proguard-rules.pro"
               )
           }
       }
   }
   ```

3. **Production API Configuration**
   ```kotlin
   buildTypes {
       release {
           buildConfigField("String", "BASE_URL", "\"https://api.dahabiyat.com/\"")
           buildConfigField("boolean", "DEBUG_MODE", "false")
       }
   }
   ```

## 🏗️ Build Process

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
```bash
./gradlew assembleRelease
```

### Generate AAB (Recommended for Play Store)
```bash
./gradlew bundleRelease
```

### Build Outputs
- **APK**: `app/build/outputs/apk/release/app-release.apk`
- **AAB**: `app/build/outputs/bundle/release/app-release.aab`

## 📱 Testing Strategy

### Manual Testing
1. **Authentication Flow**
   - Sign up with new account
   - Email verification
   - Login with existing account
   - Password reset
   - Biometric authentication

2. **Core Features**
   - Browse dahabiyas and packages
   - View detailed information
   - Search and filter functionality
   - Gallery and blog browsing

3. **Booking Flow**
   - Select dates and guests
   - Enter guest details
   - Payment processing
   - Booking confirmation
   - View booking history

4. **User Profile**
   - Update profile information
   - Change password
   - Notification preferences
   - App settings

### Device Testing
- [ ] Various screen sizes (phone, tablet)
- [ ] Different Android versions (API 24-34)
- [ ] Different manufacturers (Samsung, Google, etc.)
- [ ] Network conditions (WiFi, mobile, offline)
- [ ] Performance on low-end devices

## 🏪 Google Play Store Deployment

### Store Listing Preparation

1. **App Information**
   - App title: "Dahabiyat Nile Cruise"
   - Short description (80 chars)
   - Full description (4000 chars)
   - Keywords for ASO

2. **Graphics Assets**
   - App icon (512x512 PNG)
   - Feature graphic (1024x500 PNG)
   - Screenshots (phone and tablet)
   - Promotional video (optional)

3. **Store Listing Content**
   ```
   Title: Dahabiyat Nile Cruise - Luxury Nile Cruises
   
   Short Description:
   Experience luxury Nile cruises aboard traditional dahabiyas. Book authentic Egyptian adventures.
   
   Full Description:
   Discover the magic of the Nile River with Dahabiyat Nile Cruise, Egypt's premier luxury cruise experience...
   ```

### Release Process

1. **Upload to Play Console**
   - Create new release
   - Upload AAB file
   - Add release notes
   - Set rollout percentage

2. **Review Process**
   - Google Play review (1-3 days)
   - Address any policy violations
   - Monitor crash reports

3. **Gradual Rollout**
   - Start with 5% rollout
   - Monitor metrics and crashes
   - Increase to 20%, 50%, 100%

## 🔒 Security Considerations

### Code Protection
- [ ] ProGuard/R8 obfuscation enabled
- [ ] API keys secured
- [ ] Certificate pinning implemented
- [ ] Root detection (optional)

### Data Protection
- [ ] HTTPS-only communication
- [ ] Sensitive data encrypted
- [ ] Secure token storage
- [ ] Privacy policy compliance

## 📊 Monitoring & Analytics

### Crash Reporting
- Firebase Crashlytics integration
- Custom crash reporting
- Performance monitoring

### Analytics
- User behavior tracking
- Conversion funnel analysis
- Feature usage metrics
- Performance metrics

### Key Metrics to Monitor
- App crashes and ANRs
- User retention rates
- Booking conversion rates
- API response times
- User engagement metrics

## 🔄 Post-Deployment

### Immediate Actions
- [ ] Monitor crash reports
- [ ] Check user reviews
- [ ] Verify analytics data
- [ ] Test critical user flows
- [ ] Monitor server performance

### Ongoing Maintenance
- [ ] Regular security updates
- [ ] Feature updates based on feedback
- [ ] Performance optimizations
- [ ] Bug fixes and improvements
- [ ] Seasonal content updates

## 🆘 Rollback Plan

### Emergency Rollback
1. **Play Console Rollback**
   - Halt current rollout
   - Rollback to previous version
   - Communicate with users

2. **Server-Side Fixes**
   - API versioning for compatibility
   - Feature flags for quick disabling
   - Database rollback procedures

### Communication Plan
- User notification via app
- Social media announcements
- Customer support preparation
- Stakeholder updates

## 📞 Support Contacts

- **Development Team**: dev@dahabiyat.com
- **QA Team**: qa@dahabiyat.com
- **DevOps**: devops@dahabiyat.com
- **Customer Support**: support@dahabiyat.com

---

**Note**: This deployment guide should be updated with each release to reflect any changes in the process or requirements.
