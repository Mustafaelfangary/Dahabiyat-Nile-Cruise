@echo off
echo 🔧 Fixing ADB Path Issue for Dahabiyat Nile Cruise App...
echo.

REM Check if Android SDK is installed
echo 🔍 Searching for Android SDK installation...

REM Common Android SDK paths
set "ANDROID_HOME_1=%LOCALAPPDATA%\Android\Sdk"
set "ANDROID_HOME_2=%USERPROFILE%\AppData\Local\Android\Sdk"
set "ANDROID_HOME_3=C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
set "ANDROID_HOME_4=C:\Android\Sdk"
set "ANDROID_HOME_5=%PROGRAMFILES%\Android\Android Studio\sdk"

echo.
echo 📱 Checking common Android SDK locations...

if exist "%ANDROID_HOME_1%\platform-tools\adb.exe" (
    echo ✅ Found Android SDK at: %ANDROID_HOME_1%
    set "ANDROID_HOME=%ANDROID_HOME_1%"
    goto :found
)

if exist "%ANDROID_HOME_2%\platform-tools\adb.exe" (
    echo ✅ Found Android SDK at: %ANDROID_HOME_2%
    set "ANDROID_HOME=%ANDROID_HOME_2%"
    goto :found
)

if exist "%ANDROID_HOME_3%\platform-tools\adb.exe" (
    echo ✅ Found Android SDK at: %ANDROID_HOME_3%
    set "ANDROID_HOME=%ANDROID_HOME_3%"
    goto :found
)

if exist "%ANDROID_HOME_4%\platform-tools\adb.exe" (
    echo ✅ Found Android SDK at: %ANDROID_HOME_4%
    set "ANDROID_HOME=%ANDROID_HOME_4%"
    goto :found
)

if exist "%ANDROID_HOME_5%\platform-tools\adb.exe" (
    echo ✅ Found Android SDK at: %ANDROID_HOME_5%
    set "ANDROID_HOME=%ANDROID_HOME_5%"
    goto :found
)

echo ❌ Android SDK not found in common locations.
echo.
echo 📋 Please install Android Studio or Android SDK Platform Tools:
echo    1. Download from: https://developer.android.com/studio/releases/platform-tools
echo    2. Or install Android Studio: https://developer.android.com/studio
echo.
pause
exit /b 1

:found
echo.
echo 🚀 Setting up environment for this session...
set "PATH=%ANDROID_HOME%\platform-tools;%PATH%"

echo ✅ ADB path added to current session
echo.
echo 📱 Testing ADB connection...
adb devices

echo.
echo 🎯 Now you can run the app manually:
echo    1. The app is already installed on your device (SM-A515F)
echo    2. Look for "Dahabiyat" or "DahabiyatNileCruise" app icon
echo    3. Tap to open the app
echo.
echo 🔄 Or try running React Native again:
echo    npm run android
echo.
pause
