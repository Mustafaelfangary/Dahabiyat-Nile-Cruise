@echo off
echo ========================================
echo  Simple Android APK Build Script
echo ========================================
echo.

echo 📱 Building Dahabiyat Nile Cruise Android APK
echo 🌐 Production Domain: https://dahabiyatnilecruise.com
echo.

:: Set Java 17 environment
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=C:\Program Files\Java\jdk-17\bin;%PATH%

echo ✅ Using Java 17
java -version
echo.

:: Navigate to Android directory
cd android

echo 🧹 Clearing all caches...
call .\gradlew.bat clean
call .\gradlew.bat cleanBuildCache

echo 🔄 Forcing fresh asset compilation...
rmdir /s /q app\build\intermediates\merged_res 2>nul
rmdir /s /q app\build\intermediates\processed_res 2>nul

echo 📦 Building Fresh APK with new logo...
call .\gradlew.bat assembleDebug --stacktrace --info --rerun-tasks

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD SUCCESSFUL!
    echo.
    echo 📱 APK Location:
    echo    app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo 🎯 Next Steps:
    echo    1. Install APK on Android device
    echo    2. Test app functionality
    echo    3. Build release version if needed
    echo.
) else (
    echo.
    echo ❌ BUILD FAILED!
    echo Check the error messages above for details.
    echo.
)

pause
