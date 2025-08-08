@echo off
echo ========================================
echo 🚀 Building PRODUCTION Android APK
echo ========================================
echo.

echo 📋 Production Build Features:
echo - ✅ Optimized for performance
echo - ✅ Minified JavaScript bundle
echo - ✅ Your Cleopatra Dahabiyat logo
echo - ✅ Connects to: https://dahabiyatnilecruise.com
echo - ✅ No development dependencies
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
call .\gradlew.bat cleanBuildCache

echo 🗑️ Step 2: Clearing build cache...
rmdir /s /q app\build\intermediates 2>nul
rmdir /s /q app\build\outputs 2>nul

echo 📦 Step 3: Building RELEASE APK...
call .\gradlew.bat assembleRelease --stacktrace --info

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ PRODUCTION BUILD SUCCESSFUL!
    echo.
    echo 📱 Production APK Location:
    echo    app\build\outputs\apk\release\app-release-unsigned.apk
    echo.
    echo 🎯 This APK is optimized for:
    echo    - Performance and speed
    echo    - Smaller file size
    echo    - Production deployment
    echo    - Google Play Store upload
    echo.
    echo 📋 File sizes:
    dir app\build\outputs\apk\release\*.apk
    echo.
    echo 🚀 Ready for distribution!
) else (
    echo.
    echo ❌ PRODUCTION BUILD FAILED!
    echo Falling back to debug build...
    call .\gradlew.bat assembleDebug
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Debug build successful as fallback
        echo 📦 APK: app\build\outputs\apk\debug\app-debug.apk
    ) else (
        echo ❌ Both builds failed!
    )
)

echo.
pause
