# Dahabiyat Nile Cruise Android Application

## 📱 Complete Android App Design

This Android application is a complete replica of the Dahabiyat Nile Cruise website (https://www.dahabiyatnilecruise.com) built using Android SDK and Android Studio.

## 🎯 Features

### Core Features
- **Homepage** - Hero section, featured packages, testimonials
- **Dahabiyas** - Browse luxury boats with detailed views
- **Packages** - Tour packages with booking functionality
- **Itineraries** - Detailed travel plans and routes
- **Gallery** - Photo galleries with categories
- **About** - Company information and story
- **Contact** - Contact forms and information
- **Blog** - Travel articles and news
- **User Authentication** - Sign up, sign in, profile management
- **Booking System** - Complete booking flow with payments
- **Profile** - User dashboard with bookings and preferences

### Advanced Features
- **Offline Mode** - Cached content for offline viewing
- **Push Notifications** - Booking updates and promotions
- **Location Services** - Map integration for locations
- **Social Sharing** - Share content to social media
- **Multi-language** - Arabic and English support
- **Dark/Light Theme** - Theme switching
- **Biometric Auth** - Fingerprint/Face ID login

## 🛠 Technical Stack

- **Language**: Kotlin
- **Architecture**: MVVM with Repository Pattern
- **UI Framework**: Jetpack Compose
- **Navigation**: Navigation Compose
- **Networking**: Retrofit + OkHttp
- **Image Loading**: Coil
- **Database**: Room (SQLite)
- **Dependency Injection**: Hilt
- **Async**: Coroutines + Flow
- **Authentication**: JWT + Biometric
- **Maps**: Google Maps SDK
- **Analytics**: Firebase Analytics
- **Crash Reporting**: Firebase Crashlytics

## 📁 Project Structure

```
app/
├── src/main/
│   ├── java/com/dahabiyat/nilecruise/
│   │   ├── data/
│   │   │   ├── api/
│   │   │   ├── database/
│   │   │   ├── repository/
│   │   │   └── models/
│   │   ├── ui/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── theme/
│   │   │   └── navigation/
│   │   ├── utils/
│   │   ├── di/
│   │   └── MainActivity.kt
│   ├── res/
│   │   ├── drawable/
│   │   ├── values/
│   │   ├── layout/
│   │   └── mipmap/
│   └── AndroidManifest.xml
├── build.gradle.kts
└── proguard-rules.pro
```

## 🚀 Getting Started

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or later
- Android SDK 24+ (Android 7.0)
- Kotlin 1.9.0+
- Gradle 8.0+

### Setup Instructions
1. Clone this repository
2. Open in Android Studio
3. Sync Gradle files
4. Update API endpoints in `Constants.kt`
5. Add your Google Maps API key
6. Build and run

## 🎨 Design System

The app follows the exact design system from the website:
- **Primary Color**: Ocean Blue (#0080ff)
- **Secondary Color**: Deep Blue (#003d7a)
- **Accent Color**: Gold (#ffd700)
- **Typography**: Roboto with custom pharaonic elements
- **Spacing**: 8dp grid system
- **Elevation**: Material Design 3 standards

## 📱 Screens Overview

1. **Splash Screen** - App logo with loading animation
2. **Onboarding** - Introduction slides for new users
3. **Home** - Main dashboard with featured content
4. **Dahabiyas** - List and detail views of boats
5. **Packages** - Tour packages with filtering
6. **Itineraries** - Travel routes and schedules
7. **Gallery** - Photo collections
8. **Booking** - Complete booking flow
9. **Profile** - User account management
10. **Settings** - App preferences and configuration

## 🔧 Configuration

Update the following files with your specific configuration:
- `app/src/main/java/com/dahabiyat/nilecruise/utils/Constants.kt`
- `app/google-services.json` (Firebase)
- `app/src/main/res/values/strings.xml`
- `local.properties` (API keys)

## 📦 Build Variants

- **Debug** - Development build with logging
- **Release** - Production build with optimizations
- **Staging** - Testing build with staging API

## 🧪 Testing

- **Unit Tests** - Business logic testing
- **UI Tests** - Compose UI testing
- **Integration Tests** - API and database testing

## 📄 License

This project is proprietary software for Dahabiyat Nile Cruise.
