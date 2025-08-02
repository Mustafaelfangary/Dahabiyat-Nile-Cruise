#!/bin/bash

# Setup Database and Content Script
# This script sets up the database and populates missing content

echo "🔧 Setting up Database and Content..."
echo ""

# Check if PostgreSQL is running
echo "📡 Checking PostgreSQL service..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL service first."
    echo "   - Windows: Start PostgreSQL service from Services"
    echo "   - macOS: brew services start postgresql"
    echo "   - Linux: sudo systemctl start postgresql"
    exit 1
fi
echo "✅ PostgreSQL is running"
echo ""

# Check if database exists
echo "🔍 Checking if database exists..."
if ! psql -h localhost -p 5432 -U postgres -lqt | cut -d \| -f 1 | grep -qw cleopatra_db; then
    echo "📦 Creating database 'cleopatra_db'..."
    createdb -h localhost -p 5432 -U postgres cleopatra_db
    if [ $? -eq 0 ]; then
        echo "✅ Database 'cleopatra_db' created successfully"
    else
        echo "❌ Failed to create database. Please check your PostgreSQL credentials."
        exit 1
    fi
else
    echo "✅ Database 'cleopatra_db' already exists"
fi
echo ""

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed. Please check the error above."
    exit 1
fi
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Failed to generate Prisma client."
    exit 1
fi
echo ""

# Populate missing content
echo "📝 Populating missing content keys..."
node scripts/fix-database-and-content.js
if [ $? -eq 0 ]; then
    echo "✅ Content population completed successfully"
else
    echo "❌ Content population failed. Please check the error above."
fi
echo ""

# Optional: Seed database with sample data
echo "🌱 Do you want to seed the database with sample data? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded successfully"
    else
        echo "⚠️  Seeding failed or no seed script found. This is optional."
    fi
fi
echo ""

echo "🎉 Database and content setup completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Run: npm run build"
echo "   2. Run: npm start"
echo "   3. Visit: http://localhost:3000"
echo "   4. Admin panel: http://localhost:3000/admin"
echo ""
