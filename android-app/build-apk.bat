@echo off
echo ========================================
echo Dahabiyat Nile Cruise - Android Build
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "gradlew.bat" (
    echo Error: gradlew.bat not found!
    echo Please run this script from the android-app directory
    pause
    exit /b 1
)

echo Checking Gradle wrapper...
if not exist "gradle\wrapper\gradle-wrapper.jar" (
    echo Error: Gradle wrapper not found!
    echo Please ensure the project is properly set up
    pause
    exit /b 1
)

echo.
echo Building Debug APK...
echo ========================================
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ Debug build failed!
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo ✅ Debug APK built successfully!
echo Location: app\build\outputs\apk\debug\app-debug.apk
echo.

REM Check if keystore exists for release build
if exist "keystore\dahabiyat-release.jks" (
    echo Found release keystore, building release APK...
    echo ========================================
    call gradlew.bat assembleRelease
    if %ERRORLEVEL% neq 0 (
        echo.
        echo ❌ Release build failed!
        echo The debug APK is still available
    ) else (
        echo.
        echo ✅ Release APK built successfully!
        echo Location: app\build\outputs\apk\release\app-release.apk
    )
) else (
    echo.
    echo ⚠️  No release keystore found
    echo Only debug APK was built
    echo To create release APK, generate a keystore first
)

echo.
echo ========================================
echo Build Summary:
echo ========================================
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo ✅ Debug APK: app\build\outputs\apk\debug\app-debug.apk
) else (
    echo ❌ Debug APK: Not found
)

if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ✅ Release APK: app\build\outputs\apk\release\app-release.apk
) else (
    echo ⚠️  Release APK: Not built (keystore required)
)

echo.
echo Build complete! 🚀
echo.
echo Next steps:
echo 1. Test the debug APK on a device or emulator
echo 2. Verify API connectivity to your Hostinger VPS
echo 3. Create release keystore for production builds
echo.
pause
