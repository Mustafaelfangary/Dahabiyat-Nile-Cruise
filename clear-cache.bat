@echo off
echo Clearing Next.js cache and rebuilding...

echo.
echo 1. Removing .next folder...
if exist .next rmdir /s /q .next

echo.
echo 2. Removing node_modules/.cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo.
echo 3. Clearing npm cache...
npm cache clean --force

echo.
echo 4. Installing dependencies...
npm install

echo.
echo 5. Building application...
npm run build

echo.
echo 6. Starting development server...
npm run dev

echo.
echo Cache cleared and application rebuilt!
pause
