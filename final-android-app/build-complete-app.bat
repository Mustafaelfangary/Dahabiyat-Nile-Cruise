@echo off
echo ========================================
echo 🚀 Building Dahabiyat Android App
echo ========================================
echo.

echo 🔍 Checking environment...
echo.

REM Check if Android environment is set up
if not defined ANDROID_HOME (
    echo ❌ ANDROID_HOME is not set!
    echo Please run setup-complete-android-env.bat first
    echo.
    pause
    exit /b 1
)

echo ✅ ANDROID_HOME: %ANDROID_HOME%
echo.

REM Check if Java is available
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java is not installed or not in PATH!
    echo Please install Java 17+ and add to PATH
    echo.
    pause
    exit /b 1
)

echo ✅ Java is available
echo.

echo 📦 Installing dependencies...
npm install
if errorlevel 1 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo 🧹 Cleaning previous builds...
cd android
call gradlew clean
cd ..
echo.

echo 📱 Building Android APK...
echo.
echo Choose build type:
echo 1. Debug APK (for testing)
echo 2. Release APK (for production)
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo Building Debug APK...
    cd android
    call gradlew assembleDebug
    cd ..
    echo.
    echo ✅ Debug APK built successfully!
    echo Location: android\app\build\outputs\apk\debug\
) else if "%choice%"=="2" (
    echo Building Release APK...
    cd android
    call gradlew assembleRelease
    cd ..
    echo.
    echo ✅ Release APK built successfully!
    echo Location: android\app\build\outputs\apk\release\
) else (
    echo ❌ Invalid choice!
    pause
    exit /b 1
)

echo.
echo 🎉 Build completed successfully!
echo.
echo 📱 To install on device:
echo 1. Enable USB Debugging on your Android device
echo 2. Connect device to computer
echo 3. Run: adb install [path-to-apk]
echo.

pause
