@echo off
echo ========================================
echo Dahabiyat Nile Cruise - Metro Fix Script
echo ========================================

echo.
echo Step 1: Cleaning cache and node_modules...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo.
echo Step 2: Installing dependencies...
npm install

echo.
echo Step 3: Clearing Metro cache...
npx react-native start --reset-cache --port 8081 &

echo.
echo Step 4: Waiting for Metro to start...
timeout /t 10

echo.
echo Step 5: Building Android APK...
cd android
call gradlew.bat clean
call gradlew.bat assembleDebug

echo.
echo ========================================
echo Build Complete! Check android/app/build/outputs/apk/debug/
echo ========================================
pause
