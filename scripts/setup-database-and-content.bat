@echo off
REM Setup Database and Content Script for Windows
REM This script sets up the database and populates missing content

echo 🔧 Setting up Database and Content...
echo.

REM Check if PostgreSQL is running
echo 📡 Checking PostgreSQL service...
pg_isready -h localhost -p 5432 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not running. Please start PostgreSQL service first.
    echo    - Start PostgreSQL service from Windows Services
    echo    - Or run: net start postgresql-x64-14
    pause
    exit /b 1
)
echo ✅ PostgreSQL is running
echo.

REM Check if database exists
echo 🔍 Checking if database exists...
psql -h localhost -p 5432 -U postgres -lqt | findstr "cleopatra_db" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Creating database 'cleopatra_db'...
    createdb -h localhost -p 5432 -U postgres cleopatra_db
    if %errorlevel% equ 0 (
        echo ✅ Database 'cleopatra_db' created successfully
    ) else (
        echo ❌ Failed to create database. Please check your PostgreSQL credentials.
        pause
        exit /b 1
    )
) else (
    echo ✅ Database 'cleopatra_db' already exists
)
echo.

REM Run Prisma migrations
echo 🔄 Running Prisma migrations...
npx prisma migrate deploy
if %errorlevel% equ 0 (
    echo ✅ Migrations completed successfully
) else (
    echo ❌ Migration failed. Please check the error above.
    pause
    exit /b 1
)
echo.

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate
if %errorlevel% equ 0 (
    echo ✅ Prisma client generated successfully
) else (
    echo ❌ Failed to generate Prisma client.
    pause
    exit /b 1
)
echo.

REM Populate missing content
echo 📝 Populating missing content keys...
node scripts/fix-database-and-content.js
if %errorlevel% equ 0 (
    echo ✅ Content population completed successfully
) else (
    echo ❌ Content population failed. Please check the error above.
)
echo.

REM Optional: Seed database with sample data
echo 🌱 Do you want to seed the database with sample data? (y/n)
set /p response=
if /i "%response%"=="y" (
    echo 🌱 Seeding database...
    npx prisma db seed
    if %errorlevel% equ 0 (
        echo ✅ Database seeded successfully
    ) else (
        echo ⚠️  Seeding failed or no seed script found. This is optional.
    )
)
echo.

echo 🎉 Database and content setup completed!
echo.
echo 📋 Next steps:
echo    1. Run: npm run build
echo    2. Run: npm start
echo    3. Visit: http://localhost:3000
echo    4. Admin panel: http://localhost:3000/admin
echo.
pause
