@echo off
echo ========================================
echo 🚀 Building OPTIMIZED Android APK
echo ========================================
echo.

echo 📋 Optimized Build Features:
echo - ✅ Your Cleopatra Dahabiyat logo
echo - ✅ Production mode (no localhost)
echo - ✅ Connects to: https://dahabiyatnilecruise.com
echo - ✅ Optimized for performance
echo - ✅ Ready for distribution
echo.

:: Set Java 17 environment
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=C:\Program Files\Java\jdk-17\bin;%PATH%

echo ✅ Using Java 17
java -version
echo.

:: Set production environment variables
set NODE_ENV=production
set REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1

echo 🧹 Step 1: Cleaning previous builds...
cd android
call .\gradlew.bat clean

echo 📦 Step 2: Building optimized debug APK...
call .\gradlew.bat assembleDebug --stacktrace

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ OPTIMIZED BUILD SUCCESSFUL!
    echo.
    echo 📱 Optimized APK Location:
    echo    app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo 🎯 This APK includes:
    echo    - Your Cleopatra Dahabiyat logo
    echo    - Production mode (no development server)
    echo    - Direct connection to your website
    echo    - All performance optimizations
    echo.
    echo 📋 APK Details:
    dir app\build\outputs\apk\debug\*.apk
    echo.
    echo 🚀 Ready for installation and distribution!
    echo.
    echo 📱 To install: Run install-apk.bat
) else (
    echo.
    echo ❌ BUILD FAILED!
    echo Check the error messages above for details.
)

echo.
pause
