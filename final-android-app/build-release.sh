#!/bin/bash

# Dahabiyat Nile Cruise - Production Build Script
# Builds both APK and AAB for Google Play Store

set -e  # Exit on any error

echo "🚢 Building Dahabiyat Nile Cruise App for Production"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# App information
APP_NAME="Dahabiyat Nile Cruise"
PACKAGE_NAME="com.dahabiyat.nilecruise"
VERSION_NAME="3.0.0"
VERSION_CODE="1"

echo -e "${BLUE}📱 App: ${APP_NAME}${NC}"
echo -e "${BLUE}📦 Package: ${PACKAGE_NAME}${NC}"
echo -e "${BLUE}🔢 Version: ${VERSION_NAME} (${VERSION_CODE})${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the React Native project root.${NC}"
    exit 1
fi

# Check if Android directory exists
if [ ! -d "android" ]; then
    echo -e "${RED}❌ Error: android directory not found.${NC}"
    exit 1
fi

echo -e "${YELLOW}🔧 Step 1: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}🧹 Step 2: Cleaning previous builds...${NC}"
cd android
./gradlew clean
cd ..
echo -e "${GREEN}✅ Clean completed${NC}"
echo ""

echo -e "${YELLOW}📦 Step 3: Bundling JavaScript...${NC}"
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
echo -e "${GREEN}✅ JavaScript bundled${NC}"
echo ""

echo -e "${YELLOW}🔐 Step 4: Checking keystore configuration...${NC}"

# Check if keystore.properties exists
KEYSTORE_PROPS="android/app/keystore.properties"
if [ -f "$KEYSTORE_PROPS" ]; then
    echo -e "${GREEN}✅ Found keystore.properties${NC}"
    echo -e "${BLUE}📋 Keystore configuration:${NC}"
    cat "$KEYSTORE_PROPS" | grep -v Password | grep -v password
else
    echo -e "${YELLOW}⚠️  No keystore.properties found. Creating with debug keystore...${NC}"
    
    # Create keystore.properties with debug keystore for testing
    cat > "$KEYSTORE_PROPS" << EOF
storeFile=debug.keystore
storePassword=android
keyAlias=androiddebugkey
keyPassword=android
EOF
    
    echo -e "${YELLOW}⚠️  Using debug keystore. For production, replace with your release keystore!${NC}"
fi
echo ""

echo -e "${YELLOW}🏗️  Step 5: Building Release APK...${NC}"
cd android
./gradlew assembleRelease
cd ..

# Check if APK was created
APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo -e "${GREEN}✅ APK built successfully!${NC}"
    echo -e "${BLUE}📱 APK Location: ${APK_PATH}${NC}"
    echo -e "${BLUE}📏 APK Size: ${APK_SIZE}${NC}"
else
    echo -e "${RED}❌ APK build failed!${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}📦 Step 6: Building Release AAB (Android App Bundle)...${NC}"
cd android
./gradlew bundleRelease
cd ..

# Check if AAB was created
AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"
if [ -f "$AAB_PATH" ]; then
    AAB_SIZE=$(du -h "$AAB_PATH" | cut -f1)
    echo -e "${GREEN}✅ AAB built successfully!${NC}"
    echo -e "${BLUE}📦 AAB Location: ${AAB_PATH}${NC}"
    echo -e "${BLUE}📏 AAB Size: ${AAB_SIZE}${NC}"
else
    echo -e "${RED}❌ AAB build failed!${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}📊 Step 7: Build Summary...${NC}"
echo "=================================================="
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo -e "${BLUE}📱 APK (for direct installation):${NC}"
echo -e "   Location: ${APK_PATH}"
echo -e "   Size: ${APK_SIZE}"
echo ""
echo -e "${BLUE}📦 AAB (for Google Play Store):${NC}"
echo -e "   Location: ${AAB_PATH}"
echo -e "   Size: ${AAB_SIZE}"
echo ""

echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Test the APK on physical devices"
echo "2. Upload the AAB to Google Play Console"
echo "3. Configure store listing and screenshots"
echo "4. Submit for review"
echo ""

echo -e "${YELLOW}🔐 Security Note:${NC}"
if grep -q "debug.keystore" "$KEYSTORE_PROPS" 2>/dev/null; then
    echo -e "${RED}⚠️  WARNING: Using debug keystore! For production release:${NC}"
    echo "   1. Generate a release keystore: keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000"
    echo "   2. Update android/app/keystore.properties with release keystore details"
    echo "   3. Rebuild with: ./build-release.sh"
else
    echo -e "${GREEN}✅ Using release keystore configuration${NC}"
fi
echo ""

echo -e "${GREEN}🎉 Dahabiyat Nile Cruise app is ready for release!${NC}"
echo "=================================================="
