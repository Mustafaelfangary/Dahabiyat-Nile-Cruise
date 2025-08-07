#!/bin/bash

echo "========================================"
echo " Dahabiyat Android Production Build"
echo "========================================"
echo

# Check if we're in the right directory
if [ ! -d "mobile-app" ]; then
    echo "❌ Error: mobile-app directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Navigate to mobile app directory
cd mobile-app

echo "📱 Building Dahabiyat Nile Cruise Android App"
echo "🌐 Production Domain: https://dahabiyatnilecruise.com"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available"
    exit 1
fi

echo "✅ Node.js and npm are available"
echo

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo

# Install Expo CLI if not present
echo "🔧 Checking Expo CLI..."
if ! npx expo --version &> /dev/null; then
    echo "📦 Installing Expo CLI..."
    npm install -g @expo/cli
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Expo CLI"
        exit 1
    fi
fi

echo "✅ Expo CLI is ready"
echo

# Install EAS CLI if not present
echo "🔧 Checking EAS CLI..."
if ! npx eas --version &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g @expo/eas-cli
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install EAS CLI"
        exit 1
    fi
fi

echo "✅ EAS CLI is ready"
echo

# Show build options
echo "🚀 Build Options:"
echo
echo "1. Development Build (for testing)"
echo "2. Preview APK (for distribution/testing)"
echo "3. Production AAB (for Google Play Store)"
echo "4. Start Development Server"
echo "5. Exit"
echo

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        echo
        echo "🔨 Building Development Version..."
        echo "This will create a development build for testing"
        echo
        npx eas build --platform android --profile development
        ;;
    2)
        echo
        echo "📱 Building Preview APK..."
        echo "This will create an APK file for testing and distribution"
        echo
        npx eas build --platform android --profile preview
        ;;
    3)
        echo
        echo "🏭 Building Production AAB..."
        echo "This will create an Android App Bundle for Google Play Store"
        echo
        echo "⚠️  Make sure you have:"
        echo "   - Configured signing credentials"
        echo "   - Updated version numbers"
        echo "   - Tested the app thoroughly"
        echo
        read -p "Continue with production build? (y/n): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            npx eas build --platform android --profile production
        else
            echo "Build cancelled"
            exit 0
        fi
        ;;
    4)
        echo
        echo "🖥️  Starting Development Server..."
        echo "This will start the Expo development server"
        echo
        npx expo start
        exit 0
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice. Please try again."
        exit 1
        ;;
esac

echo
echo "✅ Build process completed!"
echo
echo "📋 Next Steps:"
echo "   1. Check the EAS dashboard for build status"
echo "   2. Download the build when ready"
echo "   3. Test on physical devices"
echo "   4. For production: Upload to Google Play Console"
echo
echo "🔗 Useful Links:"
echo "   - EAS Dashboard: https://expo.dev/"
echo "   - Google Play Console: https://play.google.com/console"
echo "   - App Domain: https://dahabiyatnilecruise.com"
echo

echo "👋 Build script completed"
