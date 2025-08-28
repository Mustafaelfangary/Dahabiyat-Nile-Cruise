@echo off
echo 🚨 FORCE REBUILD - Clearing All Caches
echo.

echo 📁 Stopping any running processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im next.exe 2>nul

echo 🗑️ Removing .next folder...
if exist .next rmdir /s /q .next

echo 🗑️ Clearing npm cache...
npm cache clean --force

echo 🗑️ Clearing node_modules cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 🔄 Starting fresh development server...
echo.
echo ✅ Cache cleared! Starting dev server...
echo 🌐 Open http://localhost:3000 and use Ctrl+Shift+R to hard refresh
echo.

npm run dev
