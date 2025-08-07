@echo off
echo ========================================
echo  Dahabiyat Android Production Build
echo ========================================
echo.

:: Check if we're in the right directory
if not exist "mobile-app" (
    echo Error: mobile-app directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

:: Navigate to mobile app directory
cd mobile-app

echo 📱 Building Dahabiyat Nile Cruise Android App
echo 🌐 Production Domain: https://dahabiyatnilecruise.com
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not available
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available
echo.

:: Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

:: Install Expo CLI if not present
echo 🔧 Checking Expo CLI...
npx expo --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Expo CLI...
    call npm install -g @expo/cli
    if errorlevel 1 (
        echo ❌ Failed to install Expo CLI
        pause
        exit /b 1
    )
)

echo ✅ Expo CLI is ready
echo.

:: Install EAS CLI if not present
echo 🔧 Checking EAS CLI...
npx eas --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing EAS CLI...
    call npm install -g @expo/eas-cli
    if errorlevel 1 (
        echo ❌ Failed to install EAS CLI
        pause
        exit /b 1
    )
)

echo ✅ EAS CLI is ready
echo.

:: Show build options
echo 🚀 Build Options:
echo.
echo 1. Development Build (for testing)
echo 2. Preview APK (for distribution/testing)
echo 3. Production AAB (for Google Play Store)
echo 4. Start Development Server
echo 5. Exit
echo.

set /p choice="Choose an option (1-5): "

if "%choice%"=="1" goto development
if "%choice%"=="2" goto preview
if "%choice%"=="3" goto production
if "%choice%"=="4" goto devserver
if "%choice%"=="5" goto end

echo Invalid choice. Please try again.
pause
goto end

:development
echo.
echo 🔨 Building Development Version...
echo This will create a development build for testing
echo.
call npx eas build --platform android --profile development
goto buildcomplete

:preview
echo.
echo 📱 Building Preview APK...
echo This will create an APK file for testing and distribution
echo.
call npx eas build --platform android --profile preview
goto buildcomplete

:production
echo.
echo 🏭 Building Production AAB...
echo This will create an Android App Bundle for Google Play Store
echo.
echo ⚠️  Make sure you have:
echo   - Configured signing credentials
echo   - Updated version numbers
echo   - Tested the app thoroughly
echo.
set /p confirm="Continue with production build? (y/n): "
if /i not "%confirm%"=="y" goto end

call npx eas build --platform android --profile production
goto buildcomplete

:devserver
echo.
echo 🖥️  Starting Development Server...
echo This will start the Expo development server
echo.
call npx expo start
goto end

:buildcomplete
echo.
echo ✅ Build process completed!
echo.
echo 📋 Next Steps:
echo   1. Check the EAS dashboard for build status
echo   2. Download the build when ready
echo   3. Test on physical devices
echo   4. For production: Upload to Google Play Console
echo.
echo 🔗 Useful Links:
echo   - EAS Dashboard: https://expo.dev/
echo   - Google Play Console: https://play.google.com/console
echo   - App Domain: https://dahabiyatnilecruise.com
echo.

:end
echo.
echo 👋 Build script completed
pause
