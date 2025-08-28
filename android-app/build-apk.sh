#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo "Dahabiyat Nile Cruise - Android Build"
echo -e "========================================${NC}"
echo

# Check if we're in the right directory
if [ ! -f "gradlew" ]; then
    echo -e "${RED}Error: gradlew not found!"
    echo "Please run this script from the android-app directory${NC}"
    exit 1
fi

# Make gradlew executable
chmod +x gradlew

echo "Checking Gradle wrapper..."
if [ ! -f "gradle/wrapper/gradle-wrapper.jar" ]; then
    echo -e "${RED}Error: Gradle wrapper not found!"
    echo "Please ensure the project is properly set up${NC}"
    exit 1
fi

echo
echo -e "${YELLOW}Building Debug APK...${NC}"
echo "========================================"
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo
    echo -e "${RED}❌ Debug build failed!"
    echo "Check the error messages above${NC}"
    exit 1
fi

echo
echo -e "${GREEN}✅ Debug APK built successfully!"
echo "Location: app/build/outputs/apk/debug/app-debug.apk${NC}"
echo

# Check if keystore exists for release build
if [ -f "keystore/dahabiyat-release.jks" ]; then
    echo -e "${YELLOW}Found release keystore, building release APK...${NC}"
    echo "========================================"
    ./gradlew assembleRelease
    
    if [ $? -ne 0 ]; then
        echo
        echo -e "${RED}❌ Release build failed!"
        echo "The debug APK is still available${NC}"
    else
        echo
        echo -e "${GREEN}✅ Release APK built successfully!"
        echo "Location: app/build/outputs/apk/release/app-release.apk${NC}"
    fi
else
    echo
    echo -e "${YELLOW}⚠️  No release keystore found"
    echo "Only debug APK was built"
    echo "To create release APK, generate a keystore first${NC}"
fi

echo
echo -e "${BLUE}========================================"
echo "Build Summary:"
echo -e "========================================${NC}"

if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo -e "${GREEN}✅ Debug APK: app/build/outputs/apk/debug/app-debug.apk${NC}"
else
    echo -e "${RED}❌ Debug APK: Not found${NC}"
fi

if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo -e "${GREEN}✅ Release APK: app/build/outputs/apk/release/app-release.apk${NC}"
else
    echo -e "${YELLOW}⚠️  Release APK: Not built (keystore required)${NC}"
fi

echo
echo -e "${GREEN}Build complete! 🚀${NC}"
echo
echo "Next steps:"
echo "1. Test the debug APK on a device or emulator"
echo "2. Verify API connectivity to your Hostinger VPS"
echo "3. Create release keystore for production builds"
echo

# Show APK info if available
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo -e "${BLUE}Debug APK Info:${NC}"
    ls -lh app/build/outputs/apk/debug/app-debug.apk
fi

if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo -e "${BLUE}Release APK Info:${NC}"
    ls -lh app/build/outputs/apk/release/app-release.apk
fi
