@echo off
echo ========================================
echo Android Development Environment Setup
echo ========================================
echo.

echo Checking Android SDK installation...
echo.

REM Check if ANDROID_HOME is set
if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME environment variable is not set
    echo.
    echo Please install Android Studio and set up the environment:
    echo 1. Download Android Studio from: https://developer.android.com/studio
    echo 2. Install Android Studio
    echo 3. Open Android Studio and install SDK components
    echo 4. Add these to your system PATH:
    echo    - %%ANDROID_HOME%%\platform-tools
    echo    - %%ANDROID_HOME%%\tools
    echo    - %%ANDROID_HOME%%\tools\bin
    echo.
    echo Common ANDROID_HOME locations:
    echo - C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    echo - C:\Android\Sdk
    echo.
    pause
    exit /b 1
) else (
    echo ✅ ANDROID_HOME is set to: %ANDROID_HOME%
)

REM Check if adb is accessible
adb version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ADB is not accessible
    echo.
    echo Please add Android SDK platform-tools to your PATH:
    echo %ANDROID_HOME%\platform-tools
    echo.
    echo Or run this command as Administrator:
    echo setx PATH "%%PATH%%;%ANDROID_HOME%\platform-tools" /M
    echo.
    pause
    exit /b 1
) else (
    echo ✅ ADB is accessible
    adb version
)

echo.
echo Checking for connected devices or emulators...
adb devices

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo You can now run: npm run android
echo.
echo If you need an emulator:
echo 1. Open Android Studio
echo 2. Go to Tools > AVD Manager
echo 3. Create a new Virtual Device
echo 4. Start the emulator
echo.
pause
