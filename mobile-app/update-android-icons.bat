@echo off
echo ========================================
echo 🎨 Updating Android Icons with Your Logo
echo ========================================
echo.

echo 📋 Source logo: assets\lo.jpeg
echo 🎯 Target: All Android icon files

if not exist "assets\lo.jpeg" (
    echo ❌ Error: Logo file not found at assets\lo.jpeg
    echo Please make sure your Cleopatra logo is saved as assets\lo.jpeg
    pause
    exit /b 1
)

echo.
echo 🔄 Copying logo to all Android icon locations...

:: Copy to all mipmap directories (different sizes)
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-hdpi\ic_launcher.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-hdpi\ic_launcher_foreground.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-hdpi\ic_launcher_round.png" > nul

copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-mdpi\ic_launcher.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-mdpi\ic_launcher_foreground.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-mdpi\ic_launcher_round.png" > nul

copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xhdpi\ic_launcher.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xhdpi\ic_launcher_foreground.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xhdpi\ic_launcher_round.png" > nul

copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher_foreground.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher_round.png" > nul

copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher_foreground.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher_round.png" > nul

:: Also copy to splash screen locations
copy "assets\lo.jpeg" "android\app\src\main\res\drawable-hdpi\splashscreen_image.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\drawable-mdpi\splashscreen_image.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\drawable-xhdpi\splashscreen_image.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\drawable-xxhdpi\splashscreen_image.png" > nul
copy "assets\lo.jpeg" "android\app\src\main\res\drawable-xxxhdpi\splashscreen_image.png" > nul

echo ✅ Logo copied to all Android icon locations!
echo.
echo 🎯 Next step: Run force-fresh-build.bat to rebuild with new icons
echo.
pause
