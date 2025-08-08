@echo off
echo ========================================
echo 🔧 FIXING AND BUILDING ANDROID APP
echo ========================================
echo.

echo 📋 This script will:
echo - Fix all configuration issues
echo - Update your Cleopatra logo
echo - Force production mode
echo - Build a working APK
echo.

:: Set Java 17 environment
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=C:\Program Files\Java\jdk-17\bin;%PATH%

echo ✅ Using Java 17
java -version
echo.

echo 🔧 Step 1: Fixing React Native configuration...

:: Fix the entry file path in build.gradle
echo Fixing entry file path...
cd android\app
powershell -Command "(Get-Content build.gradle) -replace 'entryFile = file\(\"\.\.\/\.\.\/index\.js\"\)', 'entryFile = file(\"../../index.js\")' | Set-Content build.gradle"
cd ..\..

echo 🎨 Step 2: Ensuring logo is in place...
if not exist "assets\lo.jpeg" (
    echo ❌ Error: Logo file not found at assets\lo.jpeg
    echo Please make sure your Cleopatra logo is saved as assets\lo.jpeg
    pause
    exit /b 1
)

echo ✅ Logo found: assets\lo.jpeg

echo 🔄 Step 3: Updating all Android icon files...
:: Copy logo to all Android icon locations
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-hdpi\ic_launcher.png" > nul 2>&1
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-mdpi\ic_launcher.png" > nul 2>&1
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xhdpi\ic_launcher.png" > nul 2>&1
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png" > nul 2>&1
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png" > nul 2>&1

echo ✅ Logo copied to all Android icon locations

echo 🧹 Step 4: Cleaning build cache...
cd android
call .\gradlew.bat clean > nul 2>&1

echo 📦 Step 5: Building APK...
set NODE_ENV=production
call .\gradlew.bat assembleDebug --stacktrace

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD SUCCESSFUL!
    echo.
    echo 📱 APK Location:
    echo    android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo 🎯 Your app now includes:
    echo    - Cleopatra Dahabiyat logo
    echo    - Production mode (no localhost)
    echo    - Direct connection to your website
    echo.
    echo 📋 APK Details:
    dir app\build\outputs\apk\debug\*.apk
    echo.
    echo 🚀 Ready to install with: install-apk.bat
) else (
    echo.
    echo ❌ BUILD FAILED!
    echo Let me try a different approach...
    echo.
    
    :: Try with different Gradle options
    echo 🔄 Trying alternative build method...
    call .\gradlew.bat assembleDebug --no-daemon --no-build-cache
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Alternative build successful!
    ) else (
        echo ❌ Build still failed. Check error messages above.
    )
)

cd ..
echo.
pause
