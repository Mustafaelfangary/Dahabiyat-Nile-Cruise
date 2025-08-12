@echo off
REM Dahabiyat Nile Cruise - Production Build Script for Windows
REM Builds both APK and AAB for Google Play Store

echo.
echo 🚢 Building Dahabiyat Nile Cruise App for Production
echo ==================================================
echo.

REM App information
set APP_NAME=Dahabiyat Nile Cruise
set PACKAGE_NAME=com.dahabiyat.nilecruise
set VERSION_NAME=3.0.0
set VERSION_CODE=1

echo 📱 App: %APP_NAME%
echo 📦 Package: %PACKAGE_NAME%
echo 🔢 Version: %VERSION_NAME% (%VERSION_CODE%)
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the React Native project root.
    pause
    exit /b 1
)

REM Check if Android directory exists
if not exist "android" (
    echo ❌ Error: android directory not found.
    pause
    exit /b 1
)

echo 🔧 Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

echo 🧹 Step 2: Cleaning previous builds...
cd android
call gradlew clean
cd ..
if %errorlevel% neq 0 (
    echo ❌ Clean failed
    pause
    exit /b 1
)
echo ✅ Clean completed
echo.

echo 📦 Step 3: Bundling JavaScript...
REM Create assets directory if it doesn't exist
if not exist "android\app\src\main\assets" mkdir "android\app\src\main\assets"

call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
if %errorlevel% neq 0 (
    echo ❌ JavaScript bundling failed
    pause
    exit /b 1
)
echo ✅ JavaScript bundled
echo.

echo 🔐 Step 4: Checking keystore configuration...
set KEYSTORE_PROPS=android\app\keystore.properties

if exist "%KEYSTORE_PROPS%" (
    echo ✅ Found keystore.properties
    echo 📋 Keystore configuration:
    type "%KEYSTORE_PROPS%" | findstr /v /i password
) else (
    echo ⚠️  No keystore.properties found. Creating with debug keystore...
    
    REM Create keystore.properties with debug keystore for testing
    (
        echo storeFile=debug.keystore
        echo storePassword=android
        echo keyAlias=androiddebugkey
        echo keyPassword=android
    ) > "%KEYSTORE_PROPS%"
    
    echo ⚠️  Using debug keystore. For production, replace with your release keystore!
)
echo.

echo 🏗️  Step 5: Building Release APK...
cd android
call gradlew assembleRelease
cd ..

REM Check if APK was created
set APK_PATH=android\app\build\outputs\apk\release\app-release.apk
if exist "%APK_PATH%" (
    echo ✅ APK built successfully!
    echo 📱 APK Location: %APK_PATH%
    for %%A in ("%APK_PATH%") do echo 📏 APK Size: %%~zA bytes
) else (
    echo ❌ APK build failed!
    pause
    exit /b 1
)
echo.

echo 📦 Step 6: Building Release AAB (Android App Bundle)...
cd android
call gradlew bundleRelease
cd ..

REM Check if AAB was created
set AAB_PATH=android\app\build\outputs\bundle\release\app-release.aab
if exist "%AAB_PATH%" (
    echo ✅ AAB built successfully!
    echo 📦 AAB Location: %AAB_PATH%
    for %%A in ("%AAB_PATH%") do echo 📏 AAB Size: %%~zA bytes
) else (
    echo ❌ AAB build failed!
    pause
    exit /b 1
)
echo.

echo 📊 Step 7: Build Summary...
echo ==================================================
echo ✅ Build completed successfully!
echo.
echo 📱 APK (for direct installation):
echo    Location: %APK_PATH%
echo.
echo 📦 AAB (for Google Play Store):
echo    Location: %AAB_PATH%
echo.

echo 📋 Next Steps:
echo 1. Test the APK on physical devices
echo 2. Upload the AAB to Google Play Console
echo 3. Configure store listing and screenshots
echo 4. Submit for review
echo.

echo 🔐 Security Note:
findstr /i "debug.keystore" "%KEYSTORE_PROPS%" >nul
if %errorlevel% equ 0 (
    echo ⚠️  WARNING: Using debug keystore! For production release:
    echo    1. Generate a release keystore: keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
    echo    2. Update android\app\keystore.properties with release keystore details
    echo    3. Rebuild with: build-release.bat
) else (
    echo ✅ Using release keystore configuration
)
echo.

echo 🎉 Dahabiyat Nile Cruise app is ready for release!
echo ==================================================

REM Open output directory
echo Opening build output directory...
start "" "android\app\build\outputs"

echo.
echo Press any key to exit...
pause >nul
