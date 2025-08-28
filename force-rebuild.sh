#!/bin/bash

echo "🚨 FORCE REBUILD - Clearing All Caches"
echo ""

echo "📁 Stopping any running processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true

echo "🗑️ Removing .next folder..."
rm -rf .next

echo "🗑️ Clearing npm cache..."
npm cache clean --force

echo "🗑️ Clearing node_modules cache..."
rm -rf node_modules/.cache

echo "🔄 Starting fresh development server..."
echo ""
echo "✅ Cache cleared! Starting dev server..."
echo "🌐 Open http://localhost:3000 and use Ctrl+Shift+R to hard refresh"
echo ""

npm run dev
