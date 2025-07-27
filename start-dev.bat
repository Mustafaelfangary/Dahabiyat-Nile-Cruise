@echo off
echo Starting Cleopatra Dahabiyat Development Server...
echo.
echo Current Directory: %CD%
echo.

REM Navigate to project directory
cd /d "d:\New folder (3)\cleopatra-dahabiyat"

REM Verify we're in the right directory
if not exist "package.json" (
    echo ERROR: package.json not found! 
    echo Make sure you're in the correct project directory.
    pause
    exit /b 1
)

echo ✅ Found package.json - Starting development server...
echo.

REM Start the development server
npm run dev

pause
