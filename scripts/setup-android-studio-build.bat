@echo off
echo ========================================
echo  Android Studio & SDK Setup Guide
echo ========================================
echo.

echo 📱 Setting up Dahabiyat Android App for Android Studio
echo 🌐 Production Domain: https://dahabiyatnilecruise.com
echo.

echo 🔧 Prerequisites Check:
echo.

:: Check if Android Studio is installed
echo 1️⃣ Checking Android Studio installation...
if exist "%LOCALAPPDATA%\Android\Sdk" (
    echo ✅ Android SDK found at %LOCALAPPDATA%\Android\Sdk
) else (
    echo ❌ Android SDK not found
    echo Please install Android Studio from: https://developer.android.com/studio
    echo.
    echo After installation:
    echo - Open Android Studio
    echo - Go to SDK Manager
    echo - Install Android SDK Platform-Tools
    echo - Install Android SDK Build-Tools
    echo - Install Android API Level 34
    pause
    exit /b 1
)

:: Check if Java is installed
echo.
echo 2️⃣ Checking Java installation...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java not found
    echo Please install Java JDK 17 or higher
    echo Download from: https://adoptium.net/
    pause
    exit /b 1
) else (
    echo ✅ Java is installed
    java -version
)

:: Check if Node.js is installed
echo.
echo 3️⃣ Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
    node --version
)

echo.
echo 🚀 Setting up React Native CLI project...
echo.

:: Navigate to project root
cd /d "%~dp0.."

:: Check if we're in the right directory
if not exist "mobile-app" (
    echo ❌ mobile-app directory not found
    echo Please run this script from the project root
    pause
    exit /b 1
)

:: Install React Native CLI globally
echo 📦 Installing React Native CLI...
call npm install -g @react-native-community/cli
if errorlevel 1 (
    echo ❌ Failed to install React Native CLI
    pause
    exit /b 1
)

echo ✅ React Native CLI installed
echo.

:: Create new React Native project for Android Studio
echo 🏗️  Creating React Native project with Android Studio support...
echo.

set PROJECT_NAME=DahabiyatNileCruise
set PROJECT_DIR=mobile-app-android

:: Remove existing directory if it exists
if exist "%PROJECT_DIR%" (
    echo Removing existing %PROJECT_DIR% directory...
    rmdir /s /q "%PROJECT_DIR%"
)

:: Create new React Native project
call npx react-native init %PROJECT_NAME% --directory %PROJECT_DIR%
if errorlevel 1 (
    echo ❌ Failed to create React Native project
    pause
    exit /b 1
)

echo ✅ React Native project created successfully
echo.

:: Navigate to the new project
cd %PROJECT_DIR%

:: Install additional dependencies
echo 📦 Installing additional dependencies...
call npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
call npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
call npm install react-native-vector-icons react-native-svg
call npm install @react-native-async-storage/async-storage

echo ✅ Dependencies installed
echo.

:: Configure Android build
echo 🔧 Configuring Android build settings...

:: Update package.json with build scripts
echo Updating package.json...
powershell -Command "(Get-Content package.json) -replace '\"scripts\": {', '\"scripts\": {\"build:android\": \"cd android && ./gradlew assembleRelease\",\"build:android-debug\": \"cd android && ./gradlew assembleDebug\",' | Set-Content package.json"

echo.
echo 📋 Android Studio Setup Instructions:
echo.
echo 1. Open Android Studio
echo 2. Click "Open an existing Android Studio project"
echo 3. Navigate to: %CD%\android
echo 4. Open the android folder
echo 5. Wait for Gradle sync to complete
echo 6. Connect Android device or start emulator
echo 7. Click "Run" button or use Shift+F10
echo.

echo 🔧 Environment Variables to Set:
echo.
echo Add these to your system environment variables:
echo ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
echo JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot
echo.
echo Add to PATH:
echo %%ANDROID_HOME%%\platform-tools
echo %%ANDROID_HOME%%\tools
echo %%ANDROID_HOME%%\tools\bin
echo %%JAVA_HOME%%\bin
echo.

echo 🚀 Build Commands:
echo.
echo For Debug Build:
echo   cd %PROJECT_DIR%
echo   npx react-native run-android
echo.
echo For Release Build:
echo   cd %PROJECT_DIR%\android
echo   gradlew assembleRelease
echo.
echo APK Location:
echo   %PROJECT_DIR%\android\app\build\outputs\apk\release\app-release.apk
echo.

echo ✅ Setup completed!
echo.
echo 📱 Next Steps:
echo 1. Set environment variables
echo 2. Restart command prompt
echo 3. Open Android Studio
echo 4. Open the android folder in Android Studio
echo 5. Build and run the app
echo.

pause
