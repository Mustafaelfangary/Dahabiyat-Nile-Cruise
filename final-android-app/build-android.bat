@echo off
echo ========================================
echo Building Dahabiyat Nile Cruise Android App
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found
    echo Please run this script from the final-android-app directory
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
    node --version
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check Android environment
echo.
echo Checking Android environment...

if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME not set. Trying common locations...
    
    if exist "C:\Users\%USERNAME%\AppData\Local\Android\Sdk" (
        set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
        echo Found Android SDK at: %ANDROID_HOME%
    ) else if exist "C:\Android\Sdk" (
        set ANDROID_HOME=C:\Android\Sdk
        echo Found Android SDK at: %ANDROID_HOME%
    ) else (
        echo ❌ Android SDK not found. Please install Android Studio.
        pause
        exit /b 1
    )
)

REM Add Android tools to PATH for this session
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin

REM Check if adb works now
adb version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ADB still not accessible
    echo Please ensure Android SDK is properly installed
    pause
    exit /b 1
)

echo ✅ Android environment ready

REM Check for devices/emulators
echo.
echo Checking for devices...
adb devices

REM Build the app
echo.
echo Building Android app...
echo ========================================

REM Clean previous builds
echo Cleaning previous builds...
cd android
call gradlew clean
cd ..

REM Build and install
echo Building and installing app...
npx react-native run-android

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ Build successful!
    echo ========================================
    echo.
    echo The app should now be installed on your device/emulator.
    echo Check your device for the "Dahabiyat Nile Cruise" app.
) else (
    echo.
    echo ========================================
    echo ❌ Build failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo Common solutions:
    echo 1. Make sure an Android device/emulator is connected
    echo 2. Check that Android SDK is properly installed
    echo 3. Try running: npx react-native doctor
)

echo.
pause
