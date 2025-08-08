@echo off
echo ========================================
echo 🔄 FORCE FRESH BUILD - Clear All Caches
echo ========================================
echo.

echo 🧹 Step 1: Killing all Metro/Node processes...
taskkill /f /im node.exe > nul 2>&1
taskkill /f /im java.exe > nul 2>&1

echo 🗑️ Step 2: Clearing Metro cache...
call npx react-native start --reset-cache > nul 2>&1 &
timeout /t 2 > nul
taskkill /f /im node.exe > nul 2>&1

echo 🗑️ Step 3: Clearing npm cache...
call npm cache clean --force > nul 2>&1

echo 🗑️ Step 4: Clearing Gradle cache...
cd android
call .\gradlew.bat clean
call .\gradlew.bat cleanBuildCache
rmdir /s /q .gradle 2>nul
rmdir /s /q app\build 2>nul

echo 🗑️ Step 5: Clearing Android build cache...
rmdir /s /q app\build\intermediates 2>nul
rmdir /s /q app\build\outputs 2>nul
rmdir /s /q app\build\generated 2>nul

echo 📦 Step 6: Force rebuilding with new assets...
set NODE_ENV=production
call .\gradlew.bat assembleDebug --rerun-tasks --refresh-dependencies

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ FRESH BUILD SUCCESSFUL!
    echo 🎯 Your Cleopatra logo should now be visible!
    echo 📦 APK: android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo 🚀 Ready to install with: install-apk.bat
) else (
    echo.
    echo ❌ BUILD FAILED!
    echo Try running android-simple-build.bat instead
)

echo.
pause
