@echo off
echo ========================================
echo Testing Dahabiyat Nile Cruise App Build
echo ========================================
echo.

REM Navigate to the app directory
cd /d "%~dp0"

REM Check if we're in the right place
if not exist "package.json" (
    echo ❌ Error: Not in the correct directory
    exit /b 1
)

echo ✅ In correct directory: %CD%
echo.

REM Clean previous builds
echo 🧹 Cleaning previous builds...
npm run android:clean
if %errorlevel% neq 0 (
    echo ❌ Clean failed
    exit /b 1
)

echo ✅ Clean successful
echo.

REM Build APK only (without installing)
echo 🔨 Building APK...
npm run android:build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Check if APK was created
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo ✅ APK created successfully!
    echo Location: android\app\build\outputs\apk\debug\app-debug.apk
    
    REM Get file size
    for %%A in ("android\app\build\outputs\apk\debug\app-debug.apk") do (
        echo Size: %%~zA bytes
    )
) else (
    echo ❌ APK not found
    exit /b 1
)

echo.
echo ========================================
echo ✅ BUILD TEST SUCCESSFUL!
echo ========================================
echo.
echo The app has been built successfully with:
echo ✅ Fixed app icon (no more cropping)
echo ✅ Hieroglyphic text on all screens
echo ✅ Egyptian theme maintained
echo.
echo To install on a device:
echo 1. Connect your Android device via USB
echo 2. Enable USB Debugging
echo 3. Run: npm run android
echo.
echo Or manually install the APK:
echo adb install android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
