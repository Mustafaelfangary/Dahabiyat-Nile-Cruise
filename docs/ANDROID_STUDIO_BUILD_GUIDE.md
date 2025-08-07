# Android Studio Build Guide

## 🎉 **Native Android Project Ready!**

Your Dahabiyat Nile Cruise app now has **native Android code** generated and is ready to be built with **Android Studio** and the **Android SDK**.

---

## 📱 **Project Status**

### ✅ **Native Android Code Generated**
- **Location**: `mobile-app/android/`
- **Package**: `com.dahabiyat.nilecruise`
- **Version**: 3.0.0 (versionCode: 1)
- **Target SDK**: 34
- **Production Domain**: `https://dahabiyatnilecruise.com`

### ✅ **Build Configuration**
- **Gradle Build**: Ready for Android Studio
- **Debug Keystore**: Included for development
- **Release Build**: Configured for production
- **Proguard**: Available for code minification

---

## 🔧 **Prerequisites**

### **1. Install Android Studio**
Download from: https://developer.android.com/studio

### **2. Install Android SDK Components**
In Android Studio SDK Manager, install:
- ✅ **Android SDK Platform 34** (API Level 34)
- ✅ **Android SDK Build-Tools 34.0.0**
- ✅ **Android SDK Platform-Tools**
- ✅ **Android Emulator** (optional)

### **3. Set Environment Variables**
```bash
ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot

# Add to PATH:
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\build-tools\34.0.0
%JAVA_HOME%\bin
```

---

## 🚀 **Build Methods**

### **Method 1: Android Studio (Recommended)**

#### **Step 1: Open Project**
1. Launch **Android Studio**
2. Click **"Open an existing Android Studio project"**
3. Navigate to: `mobile-app/android/`
4. Click **"OK"**

#### **Step 2: Sync Project**
1. Wait for **Gradle sync** to complete
2. If prompted, click **"Sync Now"**
3. Resolve any dependency issues

#### **Step 3: Build & Run**
1. **For Development**:
   - Click **"Run"** button (▶️) or press `Shift+F10`
   - Select connected device or emulator

2. **For Release APK**:
   - Go to **Build → Generate Signed Bundle / APK**
   - Select **APK**
   - Choose **release** build variant
   - Sign with your keystore

### **Method 2: Command Line (Gradle)**

#### **Navigate to Android Directory**
```bash
cd mobile-app/android
```

#### **Build Debug APK**
```bash
# Windows
gradlew assembleDebug

# Linux/Mac
./gradlew assembleDebug
```

#### **Build Release APK**
```bash
# Windows
gradlew assembleRelease

# Linux/Mac
./gradlew assembleRelease
```

#### **Install on Device**
```bash
# Install debug APK
gradlew installDebug

# Install release APK
gradlew installRelease
```

---

## 📂 **Build Output Locations**

### **Debug APK**
```
mobile-app/android/app/build/outputs/apk/debug/app-debug.apk
```

### **Release APK**
```
mobile-app/android/app/build/outputs/apk/release/app-release.apk
```

### **AAB (App Bundle)**
```
mobile-app/android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🔑 **Signing Configuration**

### **Debug Build (Development)**
- **Keystore**: `mobile-app/android/app/debug.keystore`
- **Password**: `android`
- **Alias**: `androiddebugkey`
- **Key Password**: `android`

### **Release Build (Production)**
For production, you'll need to create a release keystore:

```bash
keytool -genkey -v -keystore release-key.keystore -alias release-key -keyalg RSA -keysize 2048 -validity 10000
```

Then update `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('release-key.keystore')
        storePassword 'your-store-password'
        keyAlias 'release-key'
        keyPassword 'your-key-password'
    }
}
```

---

## 🧪 **Testing the Build**

### **1. Test API Connectivity**
The app is configured to connect to:
- **Production API**: `https://dahabiyatnilecruise.com`
- **Booking System**: Integrated with unified backend
- **Content Sync**: Real-time updates from website

### **2. Test Features**
- ✅ Browse Dahabiya fleet
- ✅ View journey packages  
- ✅ Book trips with availability checking
- ✅ User profile and loyalty program
- ✅ Gallery and blog integration
- ✅ Ocean blue theme consistency

### **3. Performance Testing**
- Test on different Android versions
- Check memory usage and performance
- Verify network connectivity
- Test offline functionality

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Gradle Sync Failed**
```bash
cd mobile-app/android
./gradlew clean
./gradlew build
```

#### **SDK Not Found**
- Verify `ANDROID_HOME` environment variable
- Check SDK installation in Android Studio

#### **Build Tools Version**
Update `android/build.gradle` if needed:
```gradle
buildToolsVersion "34.0.0"
compileSdkVersion 34
targetSdkVersion 34
```

#### **Memory Issues**
Add to `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
```

---

## 📊 **Build Variants**

| Variant | Purpose | Output | Signing |
|---------|---------|---------|---------|
| **debug** | Development | APK | Debug keystore |
| **release** | Production | APK/AAB | Release keystore |

---

## 🚀 **Quick Start Commands**

```bash
# Navigate to project
cd mobile-app/android

# Clean build
gradlew clean

# Build debug APK
gradlew assembleDebug

# Build release APK  
gradlew assembleRelease

# Install on connected device
gradlew installDebug
```

---

## 📱 **Final Steps**

1. **Open Android Studio**
2. **Open**: `mobile-app/android/`
3. **Wait for Gradle sync**
4. **Click Run** or **Build APK**
5. **Test on device/emulator**
6. **Deploy to Google Play Store**

---

**🎉 Your Dahabiyat Nile Cruise Android app is now ready for native Android Studio development and building!**

**📱 The app will connect to your live production API at `https://dahabiyatnilecruise.com`**
