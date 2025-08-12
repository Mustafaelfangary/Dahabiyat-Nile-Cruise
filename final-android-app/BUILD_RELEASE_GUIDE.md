# 🚢 Dahabiyat Nile Cruise - Production Build Guide

Complete guide to build and release the Dahabiyat Nile Cruise Android app for Google Play Store.

## 📋 **Prerequisites**

### **Development Environment**
- ✅ Node.js 18+ installed
- ✅ React Native CLI installed
- ✅ Android Studio with SDK 35
- ✅ Java JDK 17+
- ✅ Git for version control

### **Required Tools**
```bash
# Install React Native CLI
npm install -g react-native-cli

# Install dependencies
npm install

# Verify Android setup
npx react-native doctor
```

## 🔐 **Step 1: Generate Release Keystore**

### **Option A: Use Our Script (Recommended)**
```bash
# Make script executable
chmod +x generate-keystore.sh

# Run keystore generation
./generate-keystore.sh
```

### **Option B: Manual Generation**
```bash
# Generate keystore manually
keytool -genkey -v -keystore android/app/dahabiyat-release.keystore -alias dahabiyat-release -keyalg RSA -keysize 2048 -validity 10000

# Create keystore.properties
cat > android/app/keystore.properties << EOF
storeFile=dahabiyat-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=dahabiyat-release
keyPassword=YOUR_KEY_PASSWORD
EOF
```

### **⚠️ Important Security Notes:**
- **NEVER** commit keystore files to version control
- **BACKUP** your keystore file securely
- **REMEMBER** your passwords - you cannot recover them
- If you lose the keystore, you cannot update your app on Google Play

## 🏗️ **Step 2: Build Production APK and AAB**

### **Option A: Use Our Build Script (Recommended)**
```bash
# Make script executable
chmod +x build-release.sh

# Run production build
./build-release.sh
```

### **Option B: Manual Build Process**
```bash
# 1. Install dependencies
npm install

# 2. Clean previous builds
cd android && ./gradlew clean && cd ..

# 3. Bundle JavaScript
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

# 4. Build APK
cd android && ./gradlew assembleRelease && cd ..

# 5. Build AAB (Android App Bundle)
cd android && ./gradlew bundleRelease && cd ..
```

## 📱 **Step 3: Test the APK**

### **Install on Physical Device**
```bash
# Install APK on connected device
adb install android/app/build/outputs/apk/release/app-release.apk

# Or use the generated APK file directly
```

### **Testing Checklist**
- ✅ App launches successfully
- ✅ All screens load properly
- ✅ API connections work
- ✅ Images load correctly
- ✅ Navigation functions properly
- ✅ Contact features work (call, email, WhatsApp)
- ✅ No crashes or errors
- ✅ Performance is smooth

## 📦 **Step 4: Prepare for Google Play Store**

### **Files Generated**
After successful build, you'll have:

```
📁 android/app/build/outputs/
├── 📱 apk/release/app-release.apk          (for testing)
└── 📦 bundle/release/app-release.aab       (for Google Play)
```

### **App Information**
- **App Name**: Dahabiyat Nile Cruise
- **Package Name**: com.dahabiyat.nilecruise
- **Version**: 3.0.0 (Version Code: 1)
- **Target SDK**: 35 (Android 15)
- **Min SDK**: 24 (Android 7.0)

## 🏪 **Step 5: Google Play Console Setup**

### **1. Create Google Play Developer Account**
- Go to [Google Play Console](https://play.google.com/console)
- Pay $25 one-time registration fee
- Complete developer profile

### **2. Create New App**
- Click "Create app"
- Choose "App" type
- Select "Free" or "Paid"
- Enter app details:
  - **App name**: Dahabiyat Nile Cruise
  - **Default language**: English (United States)
  - **App category**: Travel & Local
  - **Content rating**: Everyone

### **3. Upload App Bundle**
- Go to "Release" → "Production"
- Click "Create new release"
- Upload `app-release.aab` file
- Add release notes

### **4. Store Listing**
```
App name: Dahabiyat Nile Cruise
Short description: Luxury Nile River cruise experience aboard traditional dahabiyas
Full description: Experience the magic of the Nile River aboard our luxury dahabiyas. Discover ancient Egypt in comfort and style with authentic hospitality and modern amenities.

Category: Travel & Local
Tags: nile cruise, egypt, luxury travel, dahabiya, river cruise
Contact email: info@dahabiyatnilecruise.com
Website: https://dahabiyatnilecruise.com
```

### **5. Required Assets**
You'll need to create:
- **App icon**: 512x512 PNG
- **Feature graphic**: 1024x500 PNG
- **Screenshots**: 
  - Phone: 16:9 or 9:16 ratio (min 320px)
  - Tablet: 16:10 or 10:16 ratio (min 1080px)
- **Privacy policy URL**: Required for apps that handle user data

## 📸 **Step 6: Screenshots and Graphics**

### **Required Screenshots**
Take screenshots of:
1. **Home screen** - Main dahabiyas listing
2. **Dahabiya details** - Individual dahabiya page
3. **Package details** - Cruise package information
4. **Gallery view** - Image gallery
5. **Contact screen** - Contact information

### **Graphic Assets**
- **App Icon**: 512x512 PNG (adaptive icon recommended)
- **Feature Graphic**: 1024x500 PNG (promotional banner)
- **Screenshots**: At least 2, maximum 8 per device type

## 🔍 **Step 7: Content Rating & Policies**

### **Content Rating Questionnaire**
- Violence: None
- Sexual content: None
- Profanity: None
- Controlled substances: None
- Gambling: None
- **Result**: Everyone rating

### **Required Policies**
- **Privacy Policy**: Must be hosted and accessible
- **Terms of Service**: Recommended
- **Data Safety**: Declare what data you collect

## 🚀 **Step 8: Release Process**

### **Internal Testing (Optional)**
1. Create internal testing track
2. Upload AAB file
3. Add internal testers
4. Test thoroughly

### **Production Release**
1. Upload final AAB to production track
2. Complete all store listing requirements
3. Submit for review
4. **Review time**: Usually 1-3 days

### **Release Timeline**
```
Day 1: Submit app for review
Day 2-3: Google review process
Day 4: App goes live (if approved)
```

## 📊 **Build Optimization Features**

### **Enabled Optimizations**
- ✅ **ProGuard**: Code obfuscation and minification
- ✅ **Resource shrinking**: Removes unused resources
- ✅ **APK splitting**: Separate APKs for different architectures
- ✅ **Bundle optimization**: Smaller download sizes
- ✅ **Hermes engine**: Faster JavaScript execution

### **App Size Optimization**
- **APK size**: ~15-25 MB (varies by architecture)
- **AAB size**: ~20-30 MB (Google Play optimizes downloads)
- **Download size**: ~10-15 MB (after Play Store optimization)

## 🔧 **Troubleshooting**

### **Common Build Issues**

#### **Keystore Issues**
```bash
# Error: keystore.properties not found
# Solution: Run ./generate-keystore.sh first
```

#### **Build Failures**
```bash
# Clean and rebuild
cd android && ./gradlew clean && cd ..
npm install
./build-release.sh
```

#### **APK Installation Issues**
```bash
# Enable unknown sources on device
# Or use: adb install -r app-release.apk
```

### **Google Play Issues**

#### **Upload Errors**
- Ensure AAB is signed with release keystore
- Check version code is higher than previous uploads
- Verify target SDK meets Google Play requirements

#### **Policy Violations**
- Ensure privacy policy is accessible
- Complete data safety section
- Follow Google Play policies

## 📞 **Support & Resources**

### **Documentation**
- [React Native Docs](https://reactnative.dev/docs/signed-apk-android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)

### **Contact**
- **Developer**: Dahabiyat Development Team
- **Email**: dev@dahabiyatnilecruise.com
- **Website**: https://dahabiyatnilecruise.com

## ✅ **Final Checklist**

Before submitting to Google Play:

- [ ] ✅ Keystore generated and secured
- [ ] ✅ APK tested on multiple devices
- [ ] ✅ AAB file built successfully
- [ ] ✅ All app features working
- [ ] ✅ Store listing completed
- [ ] ✅ Screenshots and graphics ready
- [ ] ✅ Privacy policy published
- [ ] ✅ Content rating completed
- [ ] ✅ Data safety section filled
- [ ] ✅ Release notes written

## 🎉 **Success!**

Once approved, your Dahabiyat Nile Cruise app will be available on Google Play Store!

**App URL**: `https://play.google.com/store/apps/details?id=com.dahabiyat.nilecruise`

---

**🚢 Ready to sail the digital Nile! Your luxury cruise app is ready for the world! 🌊**
