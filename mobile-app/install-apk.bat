@echo off
echo ========================================
echo DAHABIYAT NILE CRUISE - APK INSTALLER
echo ========================================

echo.
echo APK Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.

echo Checking if ADB is available...
adb version >nul 2>&1
if %errorlevel% neq 0 (
    echo ADB not found. Please install Android SDK Platform Tools.
    echo Or manually transfer the APK to your phone.
    goto :manual
)

echo.
echo Checking for connected devices...
adb devices

echo.
echo Installing APK to connected device...
adb install -r android\app\build\outputs\apk\debug\app-debug.apk

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! App installed successfully!
    echo You can now find "Dahabiyat Nile Cruise" in your app drawer.
) else (
    echo.
    echo ❌ Installation failed. Try manual installation.
    goto :manual
)

goto :end

:manual
echo.
echo MANUAL INSTALLATION:
echo 1. Copy android\app\build\outputs\apk\debug\app-debug.apk to your phone
echo 2. Enable "Install from unknown sources" in Android settings
echo 3. Tap the APK file to install
echo.

:end
echo.
echo ========================================
echo ✅ FIXED ISSUES:
echo - ✅ Logo: Now uses your Cleopatra Dahabiyat logo
echo - ✅ Background: Clean white (no blue background)
echo - ✅ Connection: Forces production mode (no localhost)
echo - ✅ Domain: https://dahabiyatnilecruise.com
echo - ✅ Icons: Updated all Android icon files
echo ========================================
pause
