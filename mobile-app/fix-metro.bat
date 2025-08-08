@echo off
echo ========================================
echo METRO BUNDLER FIX SCRIPT
echo ========================================

echo Step 1: Removing problematic cache...
rmdir /s /q node_modules\metro-cache 2>nul
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q %TEMP%\metro-* 2>nul

echo Step 2: Clearing React Native cache...
npx react-native start --reset-cache --port 8081

echo ========================================
echo Metro should now work properly!
echo ========================================
pause
