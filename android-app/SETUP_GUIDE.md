# 📱 Dahabiyat Nile Cruise Android App - Complete Setup Guide

## 🎯 Overview
This is a complete Android application that mirrors your website (https://www.dahabiyatnilecruise.com) with all the same pages, content, and functionality.

## 🛠 Prerequisites

### Required Software
1. **Android Studio Hedgehog (2023.1.1)** or later
2. **Java Development Kit (JDK) 17** or later
3. **Android SDK 24+** (Android 7.0)
4. **Git** for version control

### Required Accounts & API Keys
1. **Google Maps API Key** - For location features
2. **Firebase Project** - For analytics, crashlytics, and push notifications
3. **Your Website API Access** - Backend integration

## 📁 Project Structure

```
android-app/
├── app/
│   ├── src/main/
│   │   ├── java/com/dahabiyat/nilecruise/
│   │   │   ├── data/                    # Data layer
│   │   │   │   ├── api/                 # API interfaces
│   │   │   │   ├── database/            # Room database
│   │   │   │   ├── models/              # Data models
│   │   │   │   └── repository/          # Repository pattern
│   │   │   ├── di/                      # Dependency injection
│   │   │   ├── ui/                      # UI layer
│   │   │   │   ├── components/          # Reusable components
│   │   │   │   ├── navigation/          # Navigation setup
│   │   │   │   ├── screens/             # All app screens
│   │   │   │   ├── theme/               # App theming
│   │   │   │   └── viewmodels/          # ViewModels
│   │   │   ├── utils/                   # Utility classes
│   │   │   ├── services/                # Background services
│   │   │   ├── DahabiyatApplication.kt  # Application class
│   │   │   └── MainActivity.kt          # Main activity
│   │   ├── res/                         # Resources
│   │   │   ├── drawable/                # Images & icons
│   │   │   ├── font/                    # Custom fonts
│   │   │   ├── layout/                  # XML layouts (if any)
│   │   │   ├── mipmap/                  # App icons
│   │   │   ├── values/                  # Strings, colors, styles
│   │   │   └── xml/                     # XML configurations
│   │   └── AndroidManifest.xml          # App manifest
│   ├── build.gradle.kts                 # App-level Gradle
│   └── proguard-rules.pro               # ProGuard rules
├── build.gradle.kts                     # Project-level Gradle
├── gradle.properties                    # Gradle properties
├── local.properties                     # Local configuration
├── settings.gradle.kts                  # Gradle settings
└── README.md                            # Project documentation
```

## 🚀 Setup Instructions

### Step 1: Clone and Open Project
```bash
# Clone the project
git clone <your-repo-url>
cd android-app

# Open in Android Studio
# File -> Open -> Select android-app folder
```

### Step 2: Configure API Keys

#### 2.1 Create `local.properties` file in root directory:
```properties
# Google Maps API Key
MAPS_API_KEY=your_google_maps_api_key_here

# Website API Configuration
API_BASE_URL=https://www.dahabiyatnilecruise.com/api/
WEBSITE_URL=https://www.dahabiyatnilecruise.com

# Debug configuration
DEBUG_API_BASE_URL=http://10.0.2.2:3000/api/
```

#### 2.2 Update `app/build.gradle.kts`:
```kotlin
android {
    defaultConfig {
        // Add your API keys from local.properties
        buildConfigField("String", "MAPS_API_KEY", "\"${project.findProperty("MAPS_API_KEY")}\"")
    }
}
```

### Step 3: Backend Integration (Using Your Existing Infrastructure)

#### 3.1 Database Setup:
```sql
# Run the mobile schema extensions on your PostgreSQL database:
psql -U your_username -d your_database -f database-extensions/mobile-schema.sql
```

#### 3.2 API Extensions:
```javascript
# Add mobile API routes to your existing Express.js server:
# Copy backend-extensions/mobile-api-routes.js to your backend
# Add to your main app.js:
const mobileRoutes = require('./routes/mobile-api-routes');
app.use('/api', mobileRoutes);
```

#### 3.3 Admin Panel Extensions:
```bash
# Add mobile management to your existing admin panel:
# Copy admin-panel-extensions/mobile-management.tsx
# Add route to your admin panel routing
```

#### 3.4 Environment Variables:
```bash
# Add to your backend .env file:
MOBILE_APP_VERSION=1.0.0
MIN_APP_VERSION=1.0.0
MAINTENANCE_MODE=false
FORCE_UPDATE=false
```

### Step 4: Add Required Resources

#### 4.1 App Icons:
Place your app icons in `app/src/main/res/mipmap/`:
- `ic_launcher.png` (48dp, 72dp, 96dp, 144dp, 192dp)
- `ic_launcher_round.png` (same sizes)

#### 4.2 Custom Fonts:
Place fonts in `app/src/main/res/font/`:
- `roboto_light.ttf`
- `roboto_regular.ttf`
- `roboto_medium.ttf`
- `roboto_bold.ttf`
- `roboto_black.ttf`
- `pharaoh_regular.ttf` (Egyptian-style font)
- `pharaoh_bold.ttf`
- `noto_sans_arabic_regular.ttf`
- `noto_sans_arabic_medium.ttf`
- `noto_sans_arabic_bold.ttf`

#### 4.3 Images and Assets:
Create folders in `app/src/main/res/drawable/`:
- Logo files: `logo.png`, `logo_white.png`
- Placeholder images for dahabiyas, packages, etc.
- Egyptian-themed decorative elements

### Step 5: Configure Strings and Colors

#### 5.1 Update `app/src/main/res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">Dahabiyat Nile Cruise</string>
    <string name="app_tagline">Royal Nile Adventures</string>
    <!-- Add all your app strings here -->
</resources>
```

#### 5.2 Update `app/src/main/res/values/colors.xml`:
```xml
<resources>
    <color name="ocean_blue">#0080FF</color>
    <color name="deep_blue">#003D7A</color>
    <color name="navy_blue">#001F3F</color>
    <color name="gold">#FFD700</color>
    <!-- Add all theme colors -->
</resources>
```

### Step 6: Build and Test

#### 6.1 Sync Project:
```bash
# In Android Studio
File -> Sync Project with Gradle Files
```

#### 6.2 Build Project:
```bash
# Clean and build
./gradlew clean
./gradlew build
```

#### 6.3 Run on Device/Emulator:
```bash
# Run debug version
./gradlew installDebug
```

## 📱 App Features Implementation

### Core Screens (Matching Website):
1. **Splash Screen** - App logo with animation
2. **Onboarding** - Introduction for new users
3. **Home** - Hero section, featured content
4. **Dahabiyas** - Browse luxury boats
5. **Packages** - Tour packages with booking
6. **Itineraries** - Travel routes and plans
7. **Gallery** - Photo collections
8. **About** - Company information
9. **Contact** - Contact forms and info
10. **Blog** - Travel articles
11. **Profile** - User account management
12. **Booking** - Complete booking flow

### Advanced Features:
- **Authentication** - Sign up/in with email verification
- **Offline Mode** - Cached content for offline viewing
- **Push Notifications** - Booking updates and promotions
- **Maps Integration** - Location services
- **Social Sharing** - Share content to social media
- **Multi-language** - Arabic and English support
- **Biometric Auth** - Fingerprint/Face ID login
- **Dark/Light Theme** - Theme switching

## 🔧 Configuration Files

### Required Configuration:
1. **Network Security Config** (`res/xml/network_security_config.xml`)
2. **File Provider Paths** (`res/xml/file_paths.xml`)
3. **Backup Rules** (`res/xml/backup_rules.xml`)
4. **Data Extraction Rules** (`res/xml/data_extraction_rules.xml`)

## 🧪 Testing

### Unit Tests:
```bash
./gradlew test
```

### UI Tests:
```bash
./gradlew connectedAndroidTest
```

### Manual Testing Checklist:
- [ ] Authentication flow works
- [ ] All screens load properly
- [ ] API integration works
- [ ] Offline mode functions
- [ ] Push notifications received
- [ ] Booking flow completes
- [ ] Maps and location work
- [ ] Theme switching works
- [ ] Multi-language support

## 📦 Build Variants

### Debug Build:
- Development build with logging
- Points to staging API
- Debug signing

### Release Build:
- Production build optimized
- Points to production API
- Release signing with keystore

### Staging Build:
- Testing build
- Points to staging API
- Debug features enabled

## 🚀 Deployment

### Google Play Store:
1. Generate signed APK/AAB
2. Create Play Store listing
3. Upload app bundle
4. Configure store listing with screenshots
5. Submit for review

### Internal Testing:
1. Use Firebase App Distribution
2. Create testing groups
3. Upload builds for testing

## 📞 Support

For setup issues or questions:
- Email: dev@dahabiyatnilecruise.com
- Documentation: Check README files in each module
- Issues: Create GitHub issues for bugs

## 📄 License

This project is proprietary software for Dahabiyat Nile Cruise.
